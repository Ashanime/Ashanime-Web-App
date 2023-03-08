import React, { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Notification from "../Shared/Notification";

interface data {
  entry: { title: string; mal_id: number };
  trailer: { embed_url: string };
}
interface props {
  setToggle: (toggle: boolean) => void;
  toggle: boolean;
  data: data;
}

const Modal = ({ setToggle, data, toggle }: props) => {
  const cancelButtonRef = useRef(null);
  return (
    <Transition.Root show={toggle} as={Fragment}>
      <Dialog
        as="div"
        className="relative infinite"
        initialFocus={cancelButtonRef}
        onClose={() => setToggle(false)}
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

        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full lg:p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="lg:mt-14 2xl:w-[100rem] 2xl:h-[56.25rem] xl:w-[70rem] xl:h-[39.38rem] lg:w-[50rem] lg:h-[28.13rem]  lg:mt-0 h-40 flex flex-col relative page-bg rounded-lg text-left overflow-hidden shadow-xl transform transition-all">
                <div className="flex flex-col page-bg">
                  {/*Checks if video URL is available*/}
                  {data.trailer.embed_url ? (
                    <iframe
                      title="video player"
                      src={data.trailer.embed_url}
                      className="2xl:w-[100rem] 2xl:h-[56.25rem] xl:w-[70rem] xl:h-[39.38rem] lg:w-[50rem] lg:h-[28.13rem]"
                    />
                  ) : (
                    <div className="flex justify-center items-center h-56 lg:h-96 w-full">
                      <span className="text-white outfit-medium ">
                        {/*if no video URL then display below message*/}
                        No trailer available :(
                      </span>
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
          <Notification />
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Modal;
