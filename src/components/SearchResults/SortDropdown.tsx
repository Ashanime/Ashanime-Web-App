import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { useAppDispatch } from "../../redux/store";
import { setSort } from "../../redux/filter-slice";
import { useSelector } from "react-redux";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface props {
  paginate?: any;
}

export default function SortDropdown(props: props) {
  const dispatch = useAppDispatch();
  const savedSort = useSelector((state: any) => state.filter.sort);

  const sortList = [
    { value: '["POPULARITY_DESC"]', name: "Popularity Descending" },
    { value: '["POPULARITY"]', name: "Popularity Ascending" },
    { value: '["SCORE_DESC"]', name: "Score Descending" },
    { value: '["SCORE"]', name: "Score Ascending" },
    { value: '["TRENDING_DESC"]', name: "Trending Descending" },
    { value: '["TRENDING"]', name: "Trending Ascending" },
    { value: '["UPDATED_AT_DESC"]', name: "Updated Descending" },
    { value: '["UPDATED_AT"]', name: "Updated Ascending" },
    { value: '["START_DATE_DESC"]', name: "Start Date Descending" },
    { value: '["START_DATE"]', name: "Start Date Ascending" },
    { value: '["END_DATE_DESC"]', name: "End Date Descending" },
    { value: '["END_DATE"]', name: "End Date Ascending" },
    { value: '["TITLE_ROMAJI"]', name: "Alphabetically" },
    { value: '["TITLE_ROMAJI_DESC"]', name: "Reverse Alphabetically" },
  ];

  const handleList = () =>
    sortList.map((sort) => {
      return (
        <Menu.Item key={sort.value}>
          {({ active }) => (
            <span
              onClick={() => {
                dispatch(setSort(sort));
                props.paginate(1);
              }}
              className={classNames(
                active
                  ? " cursor-pointer bg-gray-100 text-gray-900"
                  : "cursor-pointer text-gray-700",
                "block px-4 py-2 text-sm"
              )}
            >
              {savedSort === sort.value ? (
                <span className="text-red-500">{sort.name}</span>
              ) : (
                sort.name
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
          {savedSort.name ? savedSort.name : "Sort by"}
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
