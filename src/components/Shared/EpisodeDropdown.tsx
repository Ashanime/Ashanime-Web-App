import React, { Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import {
  episodeSelected,
  fetchUserDataById,
  RootState,
  useAppDispatch,
  watchViewOpened,
} from "../../redux/store";
import { useSelector } from "react-redux";
import { episodes } from "../../types/type";
import { setStreamEpisode } from "../../redux/search-slice";
import { db } from "../../firebase/Firebase";
import { ref, set } from "firebase/database";
import { Buffer } from "buffer";
import { setStreamEpisodeObject } from "../../redux/videoState-slice";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function EpisodeDropdown(modalToggle: any) {
  const dispatch = useAppDispatch();
  const streamEpisode = useSelector(
    (state: RootState) => state.anime.streamEpisode
  );
  const episodesList = useSelector(
    (state: RootState) => state.anime.modalData.episodes
  );
  const modalData = useSelector((state: RootState) => state.anime.modalData);
  const savedEpisode = useSelector(
    (state: RootState) => state.videoState.savedEpisode
  );
  const savedProvider = useSelector(
    (state: RootState) => state.videoState.streamProvider
  );

  const uid = useSelector((state: any) => state.google.profileObject.uid);
  const streamProvider = useSelector(
    (state: any) => state.videoState.streamProvider
  );
  const provider = useSelector((state: any) => state.anime.provider);
  const streamEpisodeObject = useSelector(
    (state: any) => state.videoState.streamEpisodeObject
  );

  const [selected, setSelected] = useState<any>(savedEpisode);

  //remove mappings from modalData since it breaks firebase
  const { mappings, ...rest } = modalData;
  const cleanModalData = { ...rest } as any;

  const encodeBase64 = (data: string) => {
    if (!data) return "undefined";
    return Buffer.from(data).toString("base64");
  };

  const currentAnimeTitleB64 = encodeBase64(
    cleanModalData.title.romaji
  ) as string;

  // fetch savedEpisodes from firebase
  useEffect(() => {
    dispatch(watchViewOpened(cleanModalData));
    setSelected(streamEpisode);
  }, [modalToggle, streamEpisode, episodesList, selected]);

  useEffect(() => {
    dispatch(fetchUserDataById(uid));

    return () => {
      dispatch(
        setStreamEpisode({
          title: "",
          id: "",
          number: 0,
          image: "",
          description: "",
        })
      );
    };
  }, []);

  // TODO: add DUB to redux then here as a dependency
  //When the provider is changed, select the same episode number from the new provider
  useEffect(() => {
    const writeUserDataEpisode = (episode: any) => {
      set(ref(db, `users/${uid}/savedEpisodes/${currentAnimeTitleB64}`), {
        id: episode.id,
        number: episode.number,
      });
    };
    if (savedProvider) {
      const episode = episodesList.find(
        (episode: episodes) => episode.number === savedEpisode.number
      );
      if (episode) {
        dispatch(setStreamEpisode(episode));
        dispatch(setStreamEpisodeObject(episode));
        setSelected(episode);
        writeUserDataEpisode(episode);
      }
    }
  }, [
    savedProvider,
    streamProvider,
    episodesList,
    savedEpisode.number,
    dispatch,
    savedEpisode,
    provider,
    streamEpisodeObject,
  ]);

  // send the selected episode to the video player
  const handleOnChange = (selected: any) => {
    dispatch(
      episodeSelected({
        selectedEpisode: selected,
        cleanModalData,
        uid: uid,
      })
    );
    setSelected(selected);
    dispatch(setStreamEpisodeObject(selected));
  };

  const lastEpisode = episodesList[episodesList.length - 1];

  return (
    <Listbox
      value={selected}
      by={"number"}
      onChange={(selected) => handleOnChange(selected)}
    >
      <div className="relative mt-1">
        <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
          <span className="block truncate">
            {selected.number > 0 ? selected.number : "Select Episode"}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <SelectorIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute w-28 mt-1 max-h-60 w-24 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            <Listbox.Option
              key={0}
              value={lastEpisode?.id ? lastEpisode : "No episodes"}
              className={({ active }) =>
                classNames(
                  active ? "text-white bg-indigo-600" : "text-gray-900",
                  "cursor-default  select-none relative py-2 pl-3 pr-9 whitespace-nowrap"
                )
              }
            >
              {lastEpisode?.id ? "Last episode" : "No episodes"}
            </Listbox.Option>
            {episodesList &&
              [...episodesList].map((episode: episodes) => (
                <Listbox.Option
                  key={episode.id}
                  className={({ active }) =>
                    `relative w-full cursor-default select-none py-2 flex justify-center ${
                      active ? "bg-redor text-white" : ""
                    }${
                      episode.isFiller
                        ? "bg-black text-white"
                        : "bg-white text-black"
                    }`
                  }
                  value={episode}
                >
                  {({ selected, active }) => (
                    <>
                      {episode.number === streamEpisode.number
                        ? selected
                        : !selected}
                      <span
                        key={episode.id}
                        className={`block truncate ${
                          selected || episode.number === streamEpisode.number
                            ? "font-medium"
                            : "font-normal"
                        }`}
                      >
                        {episode.number}
                      </span>
                      {selected || episode.number === streamEpisode.number ? (
                        <span
                          className={classNames(
                            active ? "text-white" : "text-redor",
                            `absolute inset-y-0 left-0 flex items-center pl-3`
                          )}
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
