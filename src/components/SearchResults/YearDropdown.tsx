import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { useAppDispatch } from "../../redux/store";
import { setYear } from "../../redux/filter-slice";
import { useSelector } from "react-redux";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface props {
  paginate?: any;
}

export default function YearDropdown(props: props) {
  const dispatch = useAppDispatch();
  const savedYear = useSelector((state: any) => state.filter.year);

  const yearList = [
    // create an array for all years from the current year to 1970
    ...Array.from(
      { length: new Date().getFullYear() - 1979 },
      (_, i) => i + 1980
    ).reverse(),
  ];

  const handleList = () =>
    yearList.map((year) => {
      return (
        <Menu.Item key={year}>
          {({ active }) => (
            <span
              onClick={() => {
                dispatch(setYear(year));
                props.paginate(1);
              }}
              className={classNames(
                active
                  ? " cursor-pointer bg-gray-100 text-gray-900"
                  : "cursor-pointer text-gray-700",
                "block px-4 py-2 text-sm"
              )}
            >
              {savedYear === year ? (
                <span className="text-red-500">{year}</span>
              ) : (
                year
              )}
            </span>
          )}
        </Menu.Item>
      );
    });

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
          {savedYear ? savedYear : "Year"}
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
        <Menu.Items className="h-96 overflow-scroll z-20 origin-top-right absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">{handleList()}</div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
