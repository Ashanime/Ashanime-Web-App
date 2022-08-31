import { Fragment, useEffect } from "react";
import { Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/solid";
import { RootState, useAppDispatch } from "../../redux/store";
import { useSelector } from "react-redux";
import { notificationMessage } from "../../redux/notification-slice";

export default function Notification() {
  const { show, title, message } = useSelector(
    (state: RootState) => state.notification
  ).notification;
  const dispatch = useAppDispatch();
  useEffect(() => {
    const timeOut = setTimeout(() => {
      dispatch(notificationMessage({ show: false, title: "", message: "" }));
    }, 3000);
    return () => {
      clearTimeout(timeOut);
    };
  }, [show, dispatch]);

  return (
    <>
      <div
        aria-live="assertive"
        className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start infinite"
      >
        <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
          <Transition
            show={show}
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="max-w-sm  w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {/*<CheckCircleIcon*/}
                    {/*  className="h-6 w-6 text-green-400"*/}
                    {/*  aria-hidden="true"*/}
                    {/*/>*/}
                  </div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="outfit-medium text-navy-blue">{title}</p>
                    <p className="outfit-medium text-navy-blue">{message}</p>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex">
                    <button
                      type="button"
                      className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={() => {
                        dispatch(
                          notificationMessage({
                            show: false,
                            title: "",
                            message: "",
                          })
                        );
                      }}
                    >
                      <span className="sr-only">Close</span>
                      <XIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </>
  );
}
