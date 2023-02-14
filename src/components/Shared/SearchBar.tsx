import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  animeSearch,
  searchLoadingAction,
  setCurrentPage,
  setHasNextPage,
  setLastPage,
  setPageLoadingAction,
} from "../../redux/search-slice";
import { setSearchQuery, setSearchQueryView } from "../../redux/search-slice";
import { RootState, useAppDispatch } from "../../redux/store";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";

const SearchBar = () => {
  const { searchLoading, searchResults, searchQuery, searchQueryView } =
    useSelector((state: RootState) => state.anime);
  const location = useLocation();
  const getParams = new URLSearchParams(location.search);
  const searchQueryTerm = getParams.get("search");

  const [showInput, setShowInput] = useState(true);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentPage = useSelector(
    (state: RootState) => state.anime.currentPage
  );
  const { format, sort, genres, year, statusInSearch } = useSelector(
    (state: RootState) => state.filter
  );

  // screen width
  const width = window.innerWidth;
  const isMobile = width < 768;

  const getSearch = async () => {
    const convertedGenres = `[${genres.map((genre: any) => `"${genre}"`)}]`;
    await axios
      .get(`https://ashanime-api.vercel.app/meta/anilist/advanced-search`, {
        params: {
          ...(searchQueryTerm && { query: searchQueryTerm }),
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
        dispatch(animeSearch(data));
        dispatch(setHasNextPage(res.data.hasNextPage));
        dispatch(setLastPage(res.data.totalPages));
      });
  };

  const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    // searchQueryView is used to store what the user is searching for without filling the search input bar
    if (searchQuery !== "" && searchQueryTerm !== "") {
      dispatch(setSearchQueryView(searchQuery));
      dispatch(searchLoadingAction(true));
    }
    getSearch().then(() => {
      dispatch(searchLoadingAction(false));
      if (searchResults.length === 0 && setCurrentPage) {
        setCurrentPage(1);
      }
      if (
        searchQueryTerm !== "" &&
        searchQuery === "" &&
        searchResults.length > 0
      ) {
        navigate(`/search-results/?search=${searchQueryTerm}`);
      } else if (searchQuery) {
        navigate(`/search-results/?search=${searchQuery}`);
      }
    });
  };

  useEffect(() => {
    if (searchQueryTerm) {
      dispatch(setSearchQuery(searchQueryTerm));
      dispatch(setSearchQueryView(searchQueryTerm));
      handleSubmit();
    }
  }, [dispatch, searchQueryTerm]);

  // The search loading state is used so that the handleSubmit function does not keep rerunning infinitely.
  useEffect(() => {
    dispatch(setPageLoadingAction(true));
    dispatch(searchLoadingAction(false));
  }, [currentPage, searchLoading]);

  return (
    <div className="flex w-96">
      <div
        className="cursor-pointer"
        onClick={() => {
          if (!showInput) setShowInput(true);
        }}
        id="search-input"
      >
        <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M27.613 25.72 23.08 21.2a10.56 10.56 0 0 0 2.253-6.533C25.333 8.776 20.558 4 14.667 4S4 8.776 4 14.667c0 5.89 4.776 10.666 10.667 10.666A10.56 10.56 0 0 0 21.2 23.08l4.52 4.533a1.333 1.333 0 0 0 1.893 0 1.333 1.333 0 0 0 0-1.893ZM6.667 14.667a8 8 0 1 1 16 0 8 8 0 0 1-16 0Z"
            fill="#FFF"
          />
        </svg>
      </div>
      <AnimatePresence>
        {showInput && (
          <motion.div
            className="w-full h-1"
            id="search-bar"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
          >
            <form onSubmit={handleSubmit} className="h-1">
              <input
                type="text"
                placeholder="Search titles, movies, shows"
                id="search-bar"
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
                className=" outfit-light text-[16px] bg-whole-page border-none appearance-none w-11/12 ml-4 -my-1 text-white leading-tight outline-none input transition-all ease-in-out duration-200"
              />
              <button type="submit" />
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
