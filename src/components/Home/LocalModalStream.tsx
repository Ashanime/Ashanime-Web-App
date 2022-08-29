import React, { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import PulseLoader from "react-spinners/PulseLoader";

import { setModalData, setStreamId } from "../../redux/search-slice";
import { useAppDispatch } from "../../redux/store";
import VideoPlayer from "../videoplayer/VideoPlayer";
import { streamModal } from "../../types/type";
import EpisodeDropdown from "../Shared/EpisodeDropdown";
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

export default function LocalModalStream({
  setToggle,
  toggle,
  data,
  setModalId,
}: props) {
  const [loading, setLoading] = useState(false);
  const cancelButtonRef = useRef(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setModalData(data));
  }, [toggle]);

  const handleOnClose = () => {
    setToggle(false);
    dispatch(setModalData(streamDataState));
    dispatch(setStreamId(""));
  };

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
          <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
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
              <Dialog.Panel className="h-auto lg:mt-0 2xl:w-[70rem] xl:w-[52rem] lg:w-[42rem] md:w-[36rem] flex flex-col relative page-bg rounded-lg text-left overflow-hidden shadow-xl transform transition-all">
                <div className=" w-full 2xl:h-[40rem] xl:h-[30rem] lg:h-[24rem] md:h-[20rem] flex flex-col page-bg lg:pb-4">
                  <VideoPlayer />
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
                        className="flex items-center justify-center xl:mb-4 lg:justify-start xl:text-[24px] md:text-[20px] lg:mr-0 lg:text-left lg:leading-6 outfit-medium text-redor"
                      >
                        {data.title.romaji}
                      </Dialog.Title>
                    </div>

                    <div className="flex justify-center lg:justify-start lg:ml-8 items-center md:gap-6 gap-2">
                      <span className="text-white outfit-light lg:text-[16px] md:text-[14px] text-[10px] text-center">
                        {data.episodes.length > 1 ? "TV Show" : "Movie"}
                      </span>
                      <span className="text-white outfit-light lg:text-[16px] md:text-[14px] text-[10px]  text-center">
                        Episodes Aired: {data.episodes.length}
                      </span>
                      <span className="text-white outfit-light lg:text-[16px] md:text-[14px] text-[10px]  text-center">
                        {data.releaseDate}
                      </span>
                      <span className="text-white outfit-light lg:text-[16px] md:text-[14px] text-[10px]  text-center">
                        {data.status}
                      </span>
                    </div>
                    <div className="flex mt-2 justify-center lg:justify-start lg:px-8 px-4">
                      {/*  drop down list for episodes*/}
                      <EpisodeDropdown />
                    </div>
                  </div>
                )}
                {/*synopsis*/}
                {loading ? (
                  ""
                ) : (
                  <div className="my-4 lg:px-8 px-4 overflow-y-auto">
                    <p className="text-redor outfit-medium xl:text-[20px] md:text-[18px]">
                      Summary:
                    </p>
                    <p className="text-white outfit-light lg:text-[16px] md:text-[16px] text-[10px]">
                      {/*remove HTML from variable*/}
                      {data.description.replace(/<[^>]*>/g, "")}
                    </p>
                  </div>
                )}
                <div className=" flex flex-col lg:px-4 mt-auto lg:pb-6 pb-4 flex justify-between">
                  <div className="flex items-center">
                    <span className="outfit-medium text-redor xl:text-[18px] lg:text-[16px] md:text-[16px] text-[12px] pl-4 text-left ">
                      {loading ? "" : "Genres:"}
                    </span>
                    <span className="outfit-medium text-white lg:text-[16px] md:text-[14px] text-[10px] px-2 text-left">
                      {loading
                        ? ""
                        : data?.genres?.map((genre) => genre).join(", ")}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="outfit-medium text-redor xl:text-[18px] lg:text-[16px] md:text-[16px] text-[12px] pl-4 text-left">
                      {loading ? "" : "Studios:"}
                    </span>
                    <span className="outfit-medium text-white lg:text-[16px] md:text-[14px] text-[10px] px-2 text-left">
                      {loading
                        ? ""
                        : data?.studios?.map((studio) => studio).join(", ")}
                    </span>
                  </div>
                  <Relations setModalId={setModalId} data={data} local={true} />
                </div>
                {loading ? (
                  ""
                ) : (
                  <Recommended
                    setModalId={(modalId: number) => {
                      if (setModalId) {
                        setModalId(modalId);
                      }
                    }}
                    data={data}
                    local={true}
                  />
                )}
                <Comments />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
