import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { SearchIcon } from "@heroicons/react/solid";
import { BellIcon, MenuIcon, XIcon } from "@heroicons/react/outline";

import React, { useEffect } from "react";
import { Link } from "react-router-dom";
//@ts-ignore
import logo from "../../assets/logo-icon.png";
import {
  setSearchQuery,
  setCurrentPage,
  setSearchQueryView,
  setPageLoadingAction,
  searchLoadingAction,
  animeSearch,
  setHasNextPage,
  setLastPage,
} from "../../redux/search-slice";
import { useAppDispatch } from "../../redux/store";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import LogoutButton from "../Login/google/LogoutButton";
import axios from "axios";
import Random from "../Random/Random";
import {
  setFormat,
  setStatus,
  setStatusInSearch,
} from "../../redux/filter-slice";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface props {
  paginate?: (page: number) => void;
}

export default function MobileNav({ paginate }: props) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { searchLoading, searchQuery, searchQueryView, pageLoading } =
    useSelector((state: RootState) => state.anime);
  const currentPage = useSelector(
    (state: RootState) => state.anime.currentPage
  );
  const { format, type, sort, genres, submit, year, statusInSearch } =
    useSelector((state: RootState) => state.filter);
  const searchResults = useSelector(
    (state: RootState) => state.anime.searchResults
  );

  // Handles logo click
  const handleLogoClick = () => {
    navigate("/home");
    //  Smooth scroll to top of page
    window.scrollTo({ top: 0, behavior: "smooth" });
    dispatch(setSearchQuery(""));
  };

  // Handles the click highlighting of the Home button
  const handleClickAll = () => {
    dispatch(
      setFormat({
        value: "",
        name: "",
      })
    );
    // set type to local storage for format persistence when navigating to other pages
    localStorage.setItem("format", "");
    dispatch(setStatus({ value: "FINISHED", name: "Finished" }));
    if (paginate) {
      paginate(1);
    }
    navigate("/home");
    dispatch(setSearchQuery(""));
  };

  //Handles the click highlighting of the movie button
  const handleClickMovie = () => {
    // set type to local storage for format  persistence when navigating to other pages
    localStorage.setItem("format", "Movie");
    dispatch(
      setFormat({
        value: "MOVIE",
        name: "Movie",
      })
    );
    dispatch(setStatus({ value: "FINISHED", name: "Finished" }));
    dispatch(setSearchQuery(""));
    if (paginate) {
      paginate(1);
    }
    navigate("/home");
  };

  // Handles the highlighting of the TV shows button
  const handleClickTV = () => {
    dispatch(
      setFormat({
        value: "TV",
        name: "TV",
      })
    );
    // set type to local storage for format  persistence when navigating to other pages
    localStorage.setItem("format", "TV");
    dispatch(setStatus({ value: "FINISHED", name: "Finished" }));
    dispatch(setSearchQuery(""));
    if (paginate) {
      paginate(1);
    }
    navigate("/home");
  };

  // Handles the highlighting of the bookmarks button
  const handleClickBookmarks = () => {
    dispatch(setSearchQuery(""));
    navigate(`/bookmarks`);
  };

  const handleClickGenres = () => {
    dispatch(setSearchQuery(""));
    navigate(`/genres`);
  };

  const winWidth = window.innerWidth;
  const isMobile = winWidth < 768;

  // FETCHES FROM API

  const getSearch = async () => {
    const convertedGenres = `[${genres.map((genre: any) => `"${genre}"`)}]`;
    await axios
      .get(`https://ashanime-api.vercel.app/meta/anilist/advanced-search`, {
        params: {
          ...(searchQuery && { query: searchQuery }),
          page: currentPage,
          perPage: isMobile ? 26 : 25,
          ...(format.value && { format: format.value }),
          type: "ANIME",
          ...([...genres].length > 0 && { genres: convertedGenres }),
          ...(sort.value && { sort: sort.value }),
          ...(year && { year: year }),
          ...(statusInSearch.value && { status: statusInSearch.value }),
        },
      })
      .then(async (res) => {
        const data = res.data.results;
        dispatch(setHasNextPage(res.data.hasNextPage));
        dispatch(animeSearch(data));
        dispatch(setLastPage(res.data.totalPages));
      });
  };

  const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    // searchQueryView is used to store what the user is searching for without filling the search input bar
    dispatch(setSearchQueryView(searchQuery));

    dispatch(searchLoadingAction(true));

    getSearch().then(() => {
      dispatch(searchLoadingAction(false));
      if (searchResults.length === 0 && setCurrentPage) {
        setCurrentPage(1);
      }
      // dispatch(setSearchQuery(""));
      //check if address bar contains /search-results and redirect to it
      if (window.location.pathname !== "/search-results") {
        navigate("/search-results");
      }
    });
  };

  useEffect(() => {
    if (searchLoading && window.innerWidth < 768) {
      handleSubmit();
    } else {
      dispatch(setPageLoadingAction(true));
      dispatch(searchLoadingAction(false));
      // dispatch(setSearchQuery(""));
    }
  }, [currentPage, searchLoading]);

  return (
    <Disclosure as="nav" className="lg:invisible bg-whole-page sticky-nav">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
            <div className="relative flex items-center justify-between h-16">
              <div className="flex items-center px-2 lg:px-0">
                <div className="flex-shrink-0">
                  <img
                    className="block lg:hidden h-8 w-auto"
                    src={logo}
                    alt="logo"
                    onClick={() => {
                      handleLogoClick();
                    }}
                  />
                  <img
                    className="hidden lg:block h-8 w-auto"
                    src="https://tailwindui.com/img/logos/workflow-logo-indigo-500-mark-white-text.svg"
                    alt="Workflow"
                  />
                </div>
                <div className="hidden lg:block lg:ml-6">
                  <div className="flex space-x-4">
                    <Link
                      onClick={handleClickAll}
                      to={"/"}
                      className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Top All Anime
                    </Link>
                    <div
                      onClick={handleClickTV}
                      className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Top Anime Shows
                    </div>
                    <div
                      onClick={handleClickMovie}
                      className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Top Anime Movies
                    </div>
                    <Random />
                    <div
                      onClick={handleClickGenres}
                      className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Genres
                    </div>
                    <div
                      onClick={handleClickBookmarks}
                      className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    >
                      My Watchlist
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex justify-center px-2 lg:ml-6 lg:justify-end">
                <div className="max-w-lg w-full lg:max-w-xs">
                  <label htmlFor="search" className="sr-only">
                    Search
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <SearchIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </div>
                    <form onSubmit={handleSubmit}>
                      <input
                        id="search"
                        name="search"
                        className="w-full pl-10 pr-3 py-2 border border-transparent rounded-md leading-5 bg-gray-700 text-gray-300 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-white focus:ring-white focus:text-gray-900 sm:text-sm"
                        placeholder="Search for anime"
                        type="search"
                        onChange={(e) => {
                          dispatch(setSearchQuery(e.target.value));
                          // sets the page to 1 when searching something new
                          if (searchQueryView !== searchQuery) {
                            if (setCurrentPage) {
                              dispatch(setCurrentPage(1));
                            }
                          }
                        }}
                        value={searchQuery}
                      />
                      <button type="submit" />
                    </form>
                  </div>
                </div>
              </div>
              <div className="flex lg:hidden transition-all ease-in-out duration-200 ">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white ">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="hidden lg:block lg:ml-4">
                <div className="flex items-center">
                  <button
                    type="button"
                    className="flex-shrink-0 bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                  >
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>

                  {/* Profile dropdown */}
                  <Menu as="div" className="ml-4 relative flex-shrink-0">
                    <div>
                      <Menu.Button className="bg-gray-800 rounded-full flex text-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                        <span className="sr-only">Open user menu</span>
                        <img
                          className="h-8 w-8 rounded-full"
                          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                          alt=""
                        />
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
                      <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              Sign out
                            </a>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95 translate-x-full"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95 translate-x-full"
          >
            <Disclosure.Panel className="lg:hidden ">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Disclosure.Button
                  as="div"
                  className="text-gray-300 block px-3 py-2 rounded-md text-center font-medium"
                >
                  <Link to="/home" onClick={handleClickAll}>
                    Top All Anime
                  </Link>
                </Disclosure.Button>
                <Disclosure.Button
                  as="div"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-center font-medium"
                  onClick={handleClickTV}
                >
                  Top Anime Shows
                </Disclosure.Button>
                <Disclosure.Button
                  as="div"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-center font-medium"
                  onClick={handleClickMovie}
                >
                  Top Anime Movies
                </Disclosure.Button>
                <Disclosure.Button
                  as="div"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-center font-medium"
                  onClick={handleClickGenres}
                >
                  Genres
                </Disclosure.Button>
                <Disclosure.Button
                  as="div"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-center font-medium"
                  onClick={handleClickBookmarks}
                >
                  My Watchlist
                </Disclosure.Button>
              </div>
              <div className="pl-3 pb-3 border-t border-gray-700">
                <div className="mt-3 px-2 flex justify-center mx-auto space-y-1">
                  <LogoutButton />
                </div>
              </div>
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
}
