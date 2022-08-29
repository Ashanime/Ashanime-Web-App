import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { useAppDispatch } from "../../redux/store";
import { setFormat } from "../../redux/filter-slice";
import { useSelector } from "react-redux";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface props {
  paginate?: any;
}

export default function FormatDropdown(props: props) {
  const dispatch = useAppDispatch();
  const savedFormat = useSelector((state: any) => state.filter.format);

  const formatList = [
    { value: "TV", name: "TV" },
    { value: "TV_SHORT", name: "TV Short" },
    { value: "MOVIE", name: "Movie" },
    { value: "SPECIAL", name: "Special" },
    { value: "OVA", name: "OVA" },
    { value: "ONA", name: "ONA" },
    { value: "MUSIC", name: "Music" },
  ];

  const handleList = () =>
    formatList.map((format) => {
      return (
        <Menu.Item key={format.name}>
          {({ active }) => (
            <span
              onClick={() => {
                dispatch(setFormat(format));
                props.paginate(1);
              }}
              className={classNames(
                active
                  ? " cursor-pointer bg-gray-100 text-gray-900"
                  : "cursor-pointer text-gray-700",
                "block px-4 py-2 text-sm"
              )}
            >
              {savedFormat === format.value ? (
                <span className="text-red-500">{format.name}</span>
              ) : (
                format.name
              )}
            </span>
          )}
        </Menu.Item>
      );
    });

  return (
    <Menu as="div" className="relative inline-block text-left z-index-102">
      <div>
        <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
          {savedFormat.name ? savedFormat.name : "Format"}
          <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="h-96 overflow-scroll origin-top-right absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">{handleList()}</div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
