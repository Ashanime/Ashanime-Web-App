import React, { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import PulseLoader from "react-spinners/PulseLoader";
import {
  setBookmarks,
  setModalData,
  setStreamEpisode,
} from "../../redux/search-slice";
import { RootState, useAppDispatch } from "../../redux/store";
import { useSelector } from "react-redux";
import axios from "axios";
import EpisodeDropdown from "./EpisodeDropdown";
import {
  streamDataState,
  streamEpisodeDatastate,
} from "../../types/initialDataState";
import ToggleDub from "./ToggleDub";
import Recommended from "./Recommended";
import {
  setVideoLink,
  setContinueWatching,
  setStreamEpisodeObject,
  setStreamProvider,
} from "../../redux/videoState-slice";
import { useNotification } from "../../hooks/useNotification";
import { onValue, ref, set } from "firebase/database";
import { db } from "../../firebase/Firebase";
import Relations from "../Shared/Relations";
import ProviderDropdown from "./ProviderDropdown";
import ArtPlayerApp from "../videoplayer/ArtPlayerApp";
import { Buffer } from "buffer";

interface props {
  setToggle: (toggle: boolean) => void;
  toggle: boolean;
  modalId: number;
  setModalId?: (id: number) => void;
}

export default function ModalStream({
  setToggle,
  toggle,
  modalId,
  setModalId,
}: props) {
  const [loading, setLoading] = useState<boolean>(false);
  const [dub, setDub] = useState<boolean>(false);

  const cancelButtonRef = useRef(null);
  const dispatch = useAppDispatch();
  const modalData = useSelector((state: RootState) => state.anime.modalData);
  const provider = useSelector(
    (state: RootState) => state.videoState.streamProvider
  );
  // StreamEpisodeObject is a temp state to store the episode object as the streamEpisode var only contains 2 elements
  // elements of the object rather than the whole object due to redux thunk in store.
  const streamEpisodeObject = useSelector(
    (state: RootState) => state.videoState.streamEpisodeObject
  );
  const streamEpisode = useSelector(
    (state: RootState) => state.anime.streamEpisode
  );
  const currentAnimeTitle = useSelector(
    (state: any) => state.anime.modalData.title.romaji
  );

  const encodeBase64 = (data: string) => {
    if (!data) return "undefined";
    return Buffer.from(data).toString("base64");
  };

  const currentAnimeTitleB64 = encodeBase64(currentAnimeTitle) as string;

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

  const getAnimeDetails = async (modalId: number) => {
    dispatch(setVideoLink(""));
    setLoading(true);
    readUserDataProvider();
    await axios
      .get(
        `https://ashanime-api.vercel.app/meta/anilist/info/${modalId}${
          provider === "gogoanime" || "zoro" ? "?fetchFiller=true" : ""
        }`,
        {
          params: {
            dub,
            provider,
          },
        }
      )
      .then(async (response) => {
        const data = response.data;
        dispatch(setModalData(data));
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        return;
      });
  };

  useEffect(() => {
    if (modalId && toggle) {
      const getData = async () => {
        await getAnimeDetails(modalId);
      };
      getData();
    }
  }, [modalId, toggle, dub, provider]);

  const handleOnClose = () => {
    setToggle(false);
    dispatch(setModalData(streamDataState));
    dispatch(setStreamEpisode(streamEpisodeDatastate));
    dispatch(setStreamEpisodeObject(streamEpisodeDatastate));
  };

  const handleToggleDub = () => {
    setDub(!dub);
  };

  const handleDate = (nextAiringEpisodeTime: number) => {
    // convert unix time to date and time
    const date = new Date(nextAiringEpisodeTime * 1000);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = "0" + date.getMinutes();
    return (
      day + "/" + month + "/" + year + " " + hours + ":" + minutes.substr(-2)
    );
  };

  const { notificationHandler } = useNotification();
  const bookmarks = useSelector((state: RootState) => state.anime.bookmarks);
  const uid = useSelector((state: any) => state.google.profileObject.uid);

  function writeUserData(newBookmarks: any) {
    set(ref(db, `users/${uid}/bookmarks`), {
      ...newBookmarks,
    });
  }

  // get continewatching from firebase
  useEffect(() => {
    if (toggle) {
      onValue(
        ref(db, `users/${uid}/continueWatching`),
        (snapshot: { val: () => any }) => {
          const data = snapshot.val();
          if (data !== null) {
            dispatch(setContinueWatching(data));
          }
        }
      );
    }
  }, [dispatch, uid, toggle]);

  // remove mappings from modalData
  const { mappings, ...rest } = modalData;

  // check if items are in bookmarks and set
  useEffect(() => {
    if (bookmarks.length > 0 && toggle) {
      // remove mappings from bookmarks
      const newBookmarks = bookmarks.map((item: any) => {
        const { mappings, ...rest } = item;
        return rest;
      });
      localStorage.setItem("bookmarks", JSON.stringify(newBookmarks));
    }
  }, [bookmarks, toggle]);

  const addToBookmarks = () => {
    dispatch(setModalData(rest as any));
    dispatch(setBookmarks([...bookmarks, rest as any]));
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    writeUserData([...bookmarks, rest as any]);
    notificationHandler("Added to Watchlist", "Success", true);
  };

  const removeFromBookmarks = () => {
    const newBookmarks = bookmarks.filter((item) => item.id !== modalData.id);
    notificationHandler("Removed from Watchlist", "Success", true);
    dispatch(setBookmarks(newBookmarks));
    localStorage.setItem("bookmarks", JSON.stringify(newBookmarks));
    writeUserData(newBookmarks);
  };

  const recommendations = modalData.recommendations;

  return (
    <Transition.Root show={toggle} as={Fragment}>
      <Dialog
        as="div"
        className="relative modal-stream"
        initialFocus={cancelButtonRef}
        onClose={handleOnClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity">
            <img
              alt={modalData.title.romaji}
              src={modalData.cover}
              className="w-screen h-screen object-cover blur-md opacity-50 transition-all duration-500"
            />
          </div>
        </Transition.Child>

        <div className="fixed modal-stream inset-0 overflow-y-auto">
          <div className="h-full w-92  lg:mt-0 flex items-start justify-center min-h-full lg:p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="h-auto lg:mt-0 2xl:w-[70rem] xl:w-[52rem] lg:w-[42rem] md:w-[36rem]  flex flex-col relative page-bg rounded-lg text-left overflow-hidden shadow-xl transform transition-all">
                <div className="w-full 2xl:h-[40rem] xl:h-[30rem] lg:h-[24rem] md:h-[20rem]flex flex-col page-bg lg:pb-4">
                  <ArtPlayerApp />
                </div>
                {loading ? (
                  <div className="flex justify-center items-center lg:h-96 h-52 w-full">
                    <PulseLoader color={"white"} loading={loading} size={10} />
                  </div>
                ) : (
                  <div>
                    <div className=" lg:gap-6 gap-2 lg:mt-3  mt-2 lg:px-8 px-4">
                      <Dialog.Title
                        as="h3"
                        className="flex items-center mb-4 justify-center lg:justify-start xl:text-[24px] md:text-[20px] lg:mr-0 lg:text-left lg:leading-6 outfit-medium text-redor"
                      >
                        {modalData?.title?.romaji}
                      </Dialog.Title>
                    </div>

                    <div className="flex justify-center lg:justify-start lg:ml-8 items-center md:gap-6 gap-2">
                      <span className="text-white outfit-light lg:text-[16px] md:text-[14px] text-[10px] text-center">
                        {modalData.episodes?.length > 1 ? "TV Show" : "Movie"}
                      </span>
                      <span className="text-white outfit-light lg:text-[16px] md:text-[14px] text-[10px]  text-center">
                        Score: {modalData.rating}
                      </span>
                      <span className="text-white outfit-light lg:text-[16px] md:text-[14px] text-[10px]  text-center">
                        Episodes Aired: {modalData?.episodes?.length}
                      </span>
                      <span className="text-white outfit-light lg:text-[16px] md:text-[14px] text-[10px]  text-center">
                        {modalData.releaseDate}
                      </span>
                      <span className="text-white outfit-light lg:text-[16px] md:text-[14px] text-[10px]  text-center">
                        {modalData.status}
                      </span>
                    </div>
                    <div className="flex flex-col justify-center md:items-center lg:items-start">
                      <div className="flex mt-2 gap-4 justify-center lg:justify-start pr-8 pl-4 mb-2">
                        <h3 className="flex items-center outfit-medium text-redor xl:text-[18px] lg:text-[16px] md:text-[16px] text-[12px] pl-4 text-left ">
                          Episode:
                        </h3>
                        {/*  drop down list for episodes*/}
                        <EpisodeDropdown dub={dub} />
                        <h3 className="flex items-center outfit-medium text-redor xl:text-[18px] lg:text-[16px] md:text-[16px] text-[12px] pl-4 text-left ">
                          Server:
                        </h3>
                        <ProviderDropdown />
                        <ToggleDub handleToggle={handleToggleDub} dub={dub} />
                      </div>
                      <div className="flex justify-center lg:justify-start lg:ml-8">
                        {modalData.nextAiringEpisode?.airingTime && (
                          <p className="mt-2 outfit-medium text-white text-[16px] text center">
                            Next episode: &nbsp;
                            {handleDate(modalData.nextAiringEpisode.airingTime)}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        // save the bookmark to localstorage or remove it if it already exists
                        onClick={
                          bookmarks.find(
                            (bookmark) => bookmark.id === modalData.id
                          )
                            ? removeFromBookmarks
                            : addToBookmarks
                        }
                        className="w-40 lg:w-52 md:py-2 lg:ml-8 mt-2 text-[10px]  md:text-[16px] py-0 inline-flex justify-center items-center rounded-md border border-transparent shadow-sm lg:px-2 px-4 py-2 redor-button outfit-medium text-white hover:bg-red-600 transition-all ease-linear duration-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 "
                      >
                        {/*check if item is in bookmarks*/}
                        {bookmarks.find(
                          (bookmark) => bookmark.id === modalData.id
                        )
                          ? "Remove from Watchlist"
                          : "Add to Watchlist"}
                      </button>
                    </div>
                  </div>
                )}
                {/*synopsis*/}
                {loading ? (
                  ""
                ) : (
                  <div className="my-4 lg:px-8 px-4 overflow-y-auto">
                    {(streamEpisodeObject?.description ||
                      streamEpisode?.description) && (
                      <div>
                        <p className="text-redor outfit-medium xl:text-[20px] md:text-[18px]">
                          Episode Synopsis
                        </p>
                        <p className="text-white mb-[1rem] outfit-light lg:text-[16px] md:text-[16px] text-[10px]">
                          {/*clean HTML text from the variable*/}
                          {streamEpisodeObject?.description?.replace(
                            /<[^>]*>?/gm,
                            ""
                          ) ||
                            streamEpisode?.description?.replace(
                              /<[^>]*>?/gm,
                              ""
                            )}
                        </p>
                      </div>
                    )}
                    <p className="text-redor outfit-medium xl:text-[20px] md:text-[18px]">
                      Summary
                    </p>
                    <p className="text-white outfit-light lg:text-[16px] md:text-[16px] text-[10px]">
                      {/*clean HTML text from the variable*/}
                      {modalData.description?.replace(/<[^>]*>?/gm, "")}
                    </p>
                  </div>
                )}
                <div className=" flex flex-col lg:px-4 mt-auto lg:pb-6 pb-4 justify-between ">
                  <div className="flex items-center">
                    <span className="outfit-medium text-redor xl:text-[18px] lg:text-[16px] md:text-[16px] text-[12px] pl-4 text-left ">
                      {loading ? "" : "Genres:"}
                    </span>
                    <span className="outfit-medium text-white lg:text-[16px] md:text-[14px] text-[10px] px-2 text-left">
                      {loading
                        ? ""
                        : modalData.genres?.map((genre) => genre).join(", ")}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="outfit-medium text-redor xl:text-[18px] lg:text-[16px] md:text-[16px] text-[12px] pl-4 text-left ">
                      {loading ? "" : "Studios:"}
                    </span>
                    <span className="outfit-medium text-white lg:text-[16px] md:text-[14px] text-[10px] px-2 text-left">
                      {loading
                        ? ""
                        : modalData.studios?.map((studio) => studio).join(", ")}
                    </span>
                  </div>
                  {loading ? (
                    ""
                  ) : (
                    <Relations
                      data={modalData}
                      setModalId={(modalId: number) => {
                        if (setModalId) {
                          setModalId(modalId);
                        }
                      }}
                      getAnimeDetails={async (modalId: number) => {
                        await getAnimeDetails(modalId);
                      }}
                    />
                  )}
                </div>
                {loading || recommendations?.length < 1 ? (
                  ""
                ) : (
                  <Recommended
                    getAnimeDetails={async (modalId: number) => {
                      await getAnimeDetails(modalId);
                    }}
                    setModalId={(modalId: number) => {
                      if (setModalId) {
                        setModalId(modalId);
                      }
                    }}
                  />
                )}
                {/*<Comments />*/}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
