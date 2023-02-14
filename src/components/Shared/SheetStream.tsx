import React, { useEffect, useState } from "react";
import Sheet from "react-modal-sheet";
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
import Comments from "./Comments";
import {
  streamDataState,
  streamEpisodeDatastate,
} from "../../types/initialDataState";
import ToggleDub from "./ToggleDub";
import Recommended from "./Recommended";
import { useNotification } from "../../hooks/useNotification";
import { onValue, ref, set } from "firebase/database";
import { db } from "../../firebase/Firebase";
import Relations from "./Relations";
import ProviderDropdown from "./ProviderDropdown";
import ArtPlayerApp from "../videoplayer/ArtPlayerApp";
import { Buffer } from "buffer";
import { setStreamProvider } from "../../redux/videoState-slice";

interface props {
  setToggle: (toggle: boolean) => void;
  toggle: boolean;
  modalId: number;
  setModalId?: (id: number) => void;
}

export default function SheetStream({ setToggle, toggle, modalId }: props) {
  const [loading, setLoading] = useState(false);
  const [dub, setDub] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const modalData = useSelector((state: RootState) => state.anime.modalData);
  const uid = useSelector((state: any) => state.google.profileObject.uid);
  const bookmarks = useSelector((state: RootState) => state.anime.bookmarks);
  const provider = useSelector(
    (state: RootState) => state.videoState.streamProvider
  );
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
      .catch(() => {
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

  // get bookmarks from firebase
  useEffect(() => {
    if (toggle) {
      onValue(
        ref(db, `users/${uid}/bookmarks`),
        (snapshot: { val: () => any }) => {
          const data = snapshot.val();
          if (data !== null) {
            dispatch(setBookmarks(data));
          }
        }
      );
    }
  }, [dispatch, uid, toggle]);

  // check if items are in bookmarks and set
  useEffect(() => {
    if (bookmarks.length > 0 && toggle) {
      localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    }
  }, [bookmarks, toggle]);

  function onDismiss() {
    setToggle(false);
    dispatch(setModalData(streamDataState));
    dispatch(setStreamEpisode(streamEpisodeDatastate));
  }

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

  function writeUserData(newBookmarks: any) {
    set(ref(db, `users/${uid}/bookmarks`), {
      ...newBookmarks,
    });
  }

  const addToBookmarks = () => {
    dispatch(setBookmarks([...bookmarks, modalData]));
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    writeUserData([...bookmarks, modalData]);
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
    { modalData } && (
      <div>
        <Sheet
          disableDrag={true}
          snapPoints={[0]}
          isOpen={toggle}
          onClose={onDismiss}
        >
          <Sheet.Container>
            <Sheet.Content>
              <div className="bg-whole-page relative">
                <div className="fixed z-10 w-full md:h-[25rem] flex flex-col  page-bg lg:pb-4">
                  <div className="absolute z-index-102 left-1 top-1 bg-redor rounded-2xl flex justify-center">
                    <button
                      className="bg-transparent text-white font-semibold py-2 px-4"
                      onClick={onDismiss}
                    >
                      <p className="flex">
                        <svg
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Back
                      </p>
                    </button>
                  </div>
                  <div className="flex h-[14rem]">
                    <ArtPlayerApp />
                  </div>
                </div>

                {loading ? (
                  <div className="flex justify-center items-center h-[40rem] md:h-[25rem] w-full">
                    <PulseLoader color={"white"} loading={loading} size={10} />
                  </div>
                ) : (
                  <div>
                    <div className=" lg:gap-6 gap-2 lg:mt-3  pt-60 lg:px-8 px-4">
                      <h3 className="flex items-center justify-center lg:text-lg lg:mr-0 text-[16px] lg:text-left  lg:leading-6 outfit-medium text-redor">
                        {modalData.title.romaji}
                      </h3>
                    </div>
                    <div className="flex justify-center mt-2 lg:px-8 px-4">
                      <div className="flex justify-between items-center gap-6">
                        <p className="text-white outfit-medium lg:text-[12px] text-[14px] text-center">
                          {modalData?.episodes.length > 1 ? "TV Show" : "Movie"}
                        </p>
                        <p className="text-white outfit-medium lg:text-[12px] text-[14px] text-center">
                          Episodes Aired: {modalData?.episodes.length}
                        </p>
                        <p className="text-white outfit-medium lg:text-[12px] text-[14px] text-center">
                          {modalData.releaseDate}
                        </p>
                        <p className="text-white outfit-medium lg:text-[12px] text-[14px] text-center">
                          {modalData.status}
                        </p>
                      </div>
                    </div>
                    <p className="text-white outfit-medium lg:text-[12px] text-[14px] text-center mt-4">
                      Score: {modalData.rating}
                    </p>
                    <div className="flex justify-center my-4">
                      <ToggleDub handleToggle={handleToggleDub} dub={dub} />
                    </div>
                    <div className="flex justify-center lg:px-4 mt-auto lg:pb-6">
                      <h3 className="flex items-center outfit-medium text-redor xl:text-[18px] text-[16px] pl-4 mr-4 text-left ">
                        Server:
                      </h3>
                      <div className="flex items-center justify-center flex-wrap">
                        <ProviderDropdown />
                      </div>
                    </div>
                    <div className="flex justify-center mt-2">
                      <h3 className="flex items-center outfit-medium text-redor xl:text-[18px] text-[16px] pl-4 mr-4 text-left ">
                        Episode:
                      </h3>
                      {/*  drop down list for episodes*/}
                      {modalData?.episodes?.length > 0 ? (
                        <EpisodeDropdown modalToggle={toggle} />
                      ) : (
                        ""
                      )}
                    </div>
                    {modalData.nextAiringEpisode?.airingTime && (
                      <div className="flex flex-col justify-center items-center mt-4">
                        <p className="outfit-medium text-white text-[14px] text center">
                          Next episode: &nbsp;
                          {handleDate(modalData.nextAiringEpisode.airingTime)}
                        </p>
                      </div>
                    )}
                    <div className="flex justify-center mt-4">
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
                        className="w-3/5 h-8 lg:w-44 text-[16px] py-0 inline-flex justify-center items-center rounded-md border border-transparent shadow-sm lg:px-2 px-4 py-6 redor-button outfit-medium text-white hover:bg-red-600 transition-all ease-linear duration-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500  sm:w-auto sm:text-sm"
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
                <div>
                  {loading ? (
                    ""
                  ) : (
                    <div className="my-4 lg:px-8 mx-4 ">
                      {(streamEpisodeObject?.description ||
                        streamEpisode?.description) && (
                        <div>
                          <h3 className="text-redor outfit-medium text-[16px]">
                            Episode Synopsis
                          </h3>
                          <p className="text-white mb-[1rem] text-left outfit-light text-[16px]">
                            {streamEpisodeObject?.description?.replace(
                              /<[^>]*>/g,
                              ""
                            )}
                          </p>
                        </div>
                      )}
                      <h3 className="text-redor outfit-medium text-[16px]">
                        Summary
                      </h3>
                      <p className="text-white text-left outfit-light text-[16px]">
                        {modalData?.description?.replace(/<[^>]*>/g, "")}
                      </p>
                    </div>
                  )}
                  <div className=" flex flex-col lg:px-4 mt-auto lg:pb-6 pb-4 sm:px-6 justify-between gap-6">
                    <div className="flex flex-col ">
                      <p className="outfit-medium text-redor text-[16px] px-4 text-left ">
                        {loading ? "" : "Genres "}
                      </p>
                      <p className="outfit-light text-white text-[16px] text-left mx-4 ">
                        {loading
                          ? ""
                          : modalData?.genres?.map((genre) => genre).join(", ")}
                      </p>
                    </div>
                    <div className="flex flex-col ">
                      <p className="outfit-medium text-redor text-[16px] px-4 text-left ">
                        {loading ? "" : "Studios "}
                      </p>
                      <p className="outfit-light text-white text-[16px] text-left mx-4 ">
                        {loading
                          ? ""
                          : modalData?.studios
                              ?.map((studio) => studio)
                              .join(", ")}
                      </p>
                    </div>
                    {loading ? (
                      ""
                    ) : (
                      <Relations
                        getAnimeDetails={async (modalId: number) => {
                          await getAnimeDetails(modalId);
                        }}
                        data={modalData}
                      />
                    )}
                  </div>
                </div>
                {loading || recommendations?.length < 1 ? (
                  ""
                ) : (
                  <Recommended
                    getAnimeDetails={async (modalId: number) => {
                      await getAnimeDetails(modalId);
                    }}
                  />
                )}
                {/*<Comments />*/}
              </div>
            </Sheet.Content>
          </Sheet.Container>
        </Sheet>
      </div>
    )
  );
}
