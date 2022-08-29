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
import { setStreamId } from "../../redux/search-slice";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function EpisodeDropdown(modalToggle: any, dub: boolean) {
  const dispatch = useAppDispatch();
  const streamId = useSelector((state: RootState) => state.anime.streamId);
  const episodesList = useSelector(
    (state: RootState) => state.anime.modalData.episodes
  );
  const modalData = useSelector((state: RootState) => state.anime.modalData);
  const savedEpisode = useSelector(
    (state: RootState) => state.videoState.savedEpisode
  );

  const uid = useSelector((state: any) => state.google.profileObject.uid);

  const [selected, setSelected] = useState<any>(savedEpisode);

  // fetch savedEpisodes from firebase
  useEffect(() => {
    dispatch(fetchUserDataById(uid));
    dispatch(watchViewOpened(modalData));
    setSelected(savedEpisode);
  }, [modalToggle, streamId, episodesList]);

  useEffect(() => {
    dispatch(fetchUserDataById(uid));

    return () => {
      dispatch(setStreamId(""));
    };
  }, []);

  // send the selected episode to the video player
  const handleOnChange = (selected: any) => {
    dispatch(
      episodeSelected({
        selectedEpisode: selected,
        modalData,
        uid: uid,
      })
    );
    setSelected(selected);
  };

  const lastEpisode = episodesList[episodesList.length - 1];

  const cleanSelected =
    // extract the episode number from the selected episode. It is the last number in the string
    selected.match(/\d+$/g) && selected.match(/\d+$/g)[0];

  const cleanStreamId = () => {
    // extract the episode number from the selected episode. It is the last number in the string
    return selected.match(/\d+$/g) && selected.match(/\d+$/g)[0];
  };

  return (
    <Listbox
      value={selected ? selected : streamId}
      onChange={(selected) => handleOnChange(selected)}
    >
      {({ open }) => (
        <div className="flex">
          <div className="relative flex items-center w-full">
            <Listbox.Button className="bg-white w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              <p className="block truncate text-[12px] lg:text-[16px]">
                {streamId.toString()
                  ? cleanStreamId()?.toString()
                  : "Select episode"}
              </p>
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <SelectorIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute infinite  mt-1 w-28 bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                <Listbox.Option
                  key={0}
                  value={lastEpisode?.id ? lastEpisode.id : "No episodes"}
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
                      key={episode.number}
                      className={({ active }) =>
                        classNames(
                          active ? "text-white bg-indigo-600" : "text-gray-900",
                          "cursor-default  select-none relative py-2 pl-3 pr-9"
                        )
                      }
                      value={episode.id}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={classNames(
                              selected ? "font-semibold" : "font-normal",
                              "block truncate"
                            )}
                          >
                            {episode.number}
                          </span>

                          {selected ? (
                            <span
                              className={classNames(
                                active ? "text-white" : "text-indigo-600",
                                "absolute inset-y-0 right-0 flex items-center pr-4"
                              )}
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
              </Listbox.Options>
            </Transition>
          </div>
        </div>
      )}
    </Listbox>
  );
}
