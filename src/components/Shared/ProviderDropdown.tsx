import React, { Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";

import { useSelector } from "react-redux";
import {
  fetchUserDataById,
  RootState,
  useAppDispatch,
  watchViewOpened,
} from "../../redux/store";
import { setStreamProvider, setVideoLink } from "../../redux/videoState-slice";
import { onValue, ref, set } from "firebase/database";
import { db } from "../../firebase/Firebase";
import { Buffer } from "buffer";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function ProviderDropdown(modalToggle: any) {
  const dispatch = useAppDispatch();

  const encodeBase64 = (data: string) => {
    if (!data) return "undefined";
    return Buffer.from(data).toString("base64");
  };
  const modalData = useSelector((state: RootState) => state.anime.modalData);
  const savedProvider = useSelector(
    (state: RootState) => state.videoState.streamProvider
  );

  const uid = useSelector((state: any) => state.google.profileObject.uid);
  const currentAnimeTitle = useSelector(
    (state: any) => state.anime.modalData.title.romaji
  );
  const videoLink = useSelector((state: any) => state.videoState.videoLink);

  const currentAnimeTitleB64 = encodeBase64(currentAnimeTitle) as string;
  const [selected, setSelected] = useState<any>(savedProvider);

  const writeUserDataProvider = (provider: string) => {
    set(ref(db, `users/${uid}/savedProviders/${currentAnimeTitleB64}`), {
      provider: provider,
    });
  };

  function readUserDataProvider() {
    try {
      onValue(
        ref(db, `users/${uid}/savedProviders/${currentAnimeTitleB64}/provider`),
        async (snapshot: { val: () => any }) => {
          const data = await snapshot.val();
          if (data !== null) {
            dispatch(setStreamProvider(data));
          }
          if (data === null) {
            dispatch(setStreamProvider("gogoanime"));
          }
        }
      );
    } catch (err) {
      console.error(err);
    }
  }

  // fetch savedEpisodes from firebase
  useEffect(() => {
    dispatch(watchViewOpened(modalData));
    setSelected(savedProvider);
  }, [modalToggle]);

  useEffect(() => {
    readUserDataProvider();
    dispatch(fetchUserDataById(uid));
  }, []);

  useEffect(() => {
    if (videoLink.length > 0) {
      dispatch(setVideoLink(""));
    }
  }, [dispatch, savedProvider]);

  // send the selected episode to the video player
  const handleOnChange = (selected: string) => {
    dispatch(setStreamProvider(selected));
    // make first letter uppercase
    setSelected(selected);
    writeUserDataProvider(selected);
  };

  const providers = [
    { name: "Gogoanime", id: "gogoanime" },
    { name: "Zoro", id: "zoro" },
    // { name: "Anime Fox", id: "animefox" },
    // { name: "Enime", id: "enime" },
    // { name: "AniMixPlay", id: "animixplay" },
  ];

  return (
    <Listbox
      value={selected ? selected : savedProvider}
      onChange={(selected) => handleOnChange(selected)}
    >
      {({ open }) => (
        <div className="flex">
          <div className="relative flex items-center w-full">
            <Listbox.Button className="bg-white w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              <p className="block truncate text-[16px]">
                {savedProvider?.toString().charAt(0).toUpperCase() +
                  selected?.slice(1) || "Select Provider"}
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
                {providers &&
                  [...providers].map((provider) => (
                    <Listbox.Option
                      key={provider.id}
                      className={({ active }) =>
                        classNames(
                          active ? "text-white bg-indigo-600" : "text-gray-900",
                          "cursor-default  select-none relative py-2 pl-3 pr-9"
                        )
                      }
                      value={provider.id}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={classNames(
                              selected ? "font-semibold" : "font-normal",
                              "block truncate"
                            )}
                          >
                            {provider.name}
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
