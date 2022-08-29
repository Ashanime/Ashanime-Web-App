import React, { useEffect, useState } from "react";
import Sheet from "react-modal-sheet";
import "react-spring-bottom-sheet/dist/style.css";
import PulseLoader from "react-spinners/PulseLoader";
import { setModalData, setStreamId } from "../../redux/search-slice";
import { useAppDispatch } from "../../redux/store";
import VideoPlayer from "../videoplayer/VideoPlayer";
import EpisodeDropdown from "../Shared/EpisodeDropdown";
import { streamModal } from "../../types/type";
import Comments from "../Shared/Comments";
import { streamDataState } from "../../types/initialDataState";
import Recommended from "../Shared/Recommended";
import Relations from "../Shared/Relations";

interface props {
  setToggle: (toggle: boolean) => void;
  toggle: boolean;
  data: streamModal;
  setModalId?: (id: number) => void;
}

export default function LocalSheetStream({
  setToggle,
  toggle,
  data,
  setModalId,
}: props) {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setModalData(data));
  }, [toggle]);

  function onDismiss() {
    dispatch(setStreamId(""));
    dispatch(setModalData(streamDataState));
    setToggle(false);
  }

  return (
    <div>
      <Sheet disableDrag={true} isOpen={toggle} onClose={onDismiss}>
        <Sheet.Container>
          <Sheet.Content>
            <div className="bg-whole-page relative">
              <div className="fixed z-10 w-full md:h-[25rem] flex flex-col page-bg lg:pb-4">
                <div className="absolute z-index-102 left-1 top-1 bg-redor rounded-2xl flex justify-center">
                  <button
                    className="bg-transparent text-white font-semibold py-2 px-4"
                    onClick={onDismiss}
                  >
                    <div className="flex">
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
                    </div>
                  </button>
                </div>
                <VideoPlayer animeStatus={data?.status} />
              </div>

              {loading ? (
                <div className="flex justify-center items-center lg:h-96 md:h-[25rem] mt-60 w-full">
                  <PulseLoader color={"white"} loading={loading} size={10} />
                </div>
              ) : (
                <div>
                  <div className=" lg:gap-6 gap-2 lg:mt-3  pt-60 lg:px-8 px-4">
                    <h3 className="flex items-center justify-center lg:text-lg lg:mr-0 text-[16px] lg:text-left  lg:leading-6 outfit-medium text-redor">
                      {data?.title?.romaji}
                    </h3>
                  </div>
                  <div className="flex justify-center mt-2 lg:px-8 px-4">
                    <div className="flex justify-between items-center gap-6">
                      <p className="text-white outfit-medium lg:text-[12px] text-[14px] text-center">
                        {data?.episodes?.length > 1 ? "TV Show" : "Movie"}
                      </p>
                      <p className="text-white outfit-medium lg:text-[12px] text-[14px] text-center">
                        Episodes Aired: {data?.episodes?.length}
                      </p>
                      <p className="text-white outfit-medium lg:text-[12px] text-[14px] text-center">
                        {data?.releaseDate}
                      </p>
                      <p className="text-white outfit-medium lg:text-[12px] text-[14px] text-center">
                        {data?.status}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-center mt-2">
                    {/*  drop down list for episodes*/}
                    {data?.episodes?.length > 0 ? (
                      <EpisodeDropdown modalToggle={toggle} />
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              )}
              {/*synopsis*/}
              <div>
                {loading ? (
                  ""
                ) : (
                  <div className="my-4 lg:px-8 mx-4 ">
                    <h3 className="text-redor outfit-medium text-[16px]">
                      Synopsis
                    </h3>
                    <p className="text-white text-left outfit-light text-[16px]">
                      {data?.description?.replace(/<[^>]*>/g, "")}
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
                        : data?.genres?.map((genre) => genre).join(", ")}
                    </p>
                  </div>
                  <div className="flex flex-col ">
                    <p className="outfit-medium text-redor text-[16px] px-4 text-left ">
                      {loading ? "" : "Studios "}
                    </p>
                    <p className="outfit-light text-white text-[16px] text-left mx-4 ">
                      {loading
                        ? ""
                        : data?.studios?.map((studio) => studio).join(", ")}
                    </p>
                  </div>
                </div>
                <Relations
                  data={data}
                  setModalId={(modalId: number) => {
                    if (setModalId) {
                      setModalId(modalId);
                    }
                  }}
                  local={true}
                />
              </div>
              <Recommended
                data={data}
                setModalId={(modalId: number) => {
                  if (setModalId) {
                    setModalId(modalId);
                  }
                }}
              />
              <Comments />
            </div>
          </Sheet.Content>
        </Sheet.Container>
      </Sheet>
    </div>
  );
}
