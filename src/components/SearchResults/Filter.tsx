import React from "react";
import FormatDropdown from "./FormatDropdown";
import { RootState, useAppDispatch } from "../../redux/store";
import { useSelector } from "react-redux";
import {
  animeSearch,
  searchLoadingAction,
  setHasNextPage,
  setLastPage,
  setSearchQuery,
  setSearchQueryView,
} from "../../redux/search-slice";
import axios from "axios";
import SortDropdown from "./SortDropdown";
import GenresButtons from "./GenresButtons";
import {
  setFormat,
  setGenres,
  setSort,
  setStatusInSearch,
  setYear,
} from "../../redux/filter-slice";
import { setCurrentPage } from "../../redux/search-slice";
import YearDropdown from "./YearDropdown";
import StatusDropdown from "./StatusDropdown";

const Filter = () => {
  const dispatch = useAppDispatch();
  const paginate = (pageNumber: number) => {
    return setCurrentPage(pageNumber);
  };

  const { format, sort, genres, year, status } = useSelector(
    (state: RootState) => state.filter
  );
  const currentPage = useSelector(
    (state: RootState) => state.anime.currentPage
  );
  const statusInSearch = useSelector(
    (state: RootState) => state.filter.statusInSearch
  );

  const { searchQueryView } = useSelector((state: RootState) => state.anime);

  // screen width
  const width = window.innerWidth;
  const isMobile = width < 768;
  const isTablet = width >= 768 && width <= 1024;
  const isDesktop = width > 1024;

  const getSearch = async () => {
    const convertedGenres = `[${genres.map((genre: any) => `"${genre}"`)}]`;
    await axios
      .get(` https://ashanime-api.vercel.app/meta/anilist/advanced-search`, {
        params: {
          ...(searchQueryView && { query: searchQueryView }),
          page: currentPage,
          perPage: isMobile ? 26 : isTablet ? 24 : 25,
          ...(format.value && { format: format.value }),
          type: "ANIME",
          ...([...genres].length > 0 && { genres: convertedGenres }),
          ...(sort.value && { sort: sort.value }),
          ...(year && { year: year }),
          ...((statusInSearch.value || status.value) && {
            status: statusInSearch.value || status.value,
          }),
        },
      })
      .then(async (res) => {
        const data = res.data.results;
        dispatch(animeSearch(data));
        dispatch(setHasNextPage(res.data.hasNextPage));
        dispatch(setLastPage(res.data.totalPages));
      });
  };

  const handleSubmit = () => {
    dispatch(searchLoadingAction(true));
    dispatch(setCurrentPage(1));
    getSearch();
  };

  const handleReset = () => {
    dispatch(setSearchQueryView(""));
    dispatch(setSearchQuery(""));
    dispatch(setFormat({ value: "", name: "" }));
    dispatch(setSort({ value: "", name: "" }));
    dispatch(setGenres([]));
    dispatch(setCurrentPage(1));
    dispatch(setYear(0));
    dispatch(setStatusInSearch({ value: "", name: "" }));
  };

  return (
    <div className="flex flex-col mb-10">
      <h2 className="text-[32px] text-orange-300 outfit-medium mb-4">Filter</h2>
      <div>
        <div className="flex gap-2">
          {isMobile && (
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <FormatDropdown paginate={paginate} />
                <SortDropdown paginate={(value: number) => paginate(value)} />
              </div>
              <div className="flex gap-2">
                <YearDropdown paginate={(value: number) => paginate(value)} />
                <StatusDropdown paginate={(value: number) => paginate(value)} />
              </div>
            </div>
          )}
          {isDesktop && (
            <div className="flex gap-2">
              <FormatDropdown paginate={paginate} />
              <SortDropdown paginate={(value: number) => paginate(value)} />
              <YearDropdown paginate={(value: number) => paginate(value)} />
              <StatusDropdown paginate={(value: number) => paginate(value)} />
            </div>
          )}
        </div>
        <GenresButtons />
        {/*  Submit button*/}
        <div className="flex gap-2">
          <button
            onClick={() => handleSubmit()}
            className="outfit-medium bg-white text-redor text-white text-[20px] w-24 rounded-xl"
          >
            Search
          </button>
          <button
            onClick={() => handleReset()}
            className="outfit-medium bg-white text-redor text-white text-[20px] w-36 rounded-xl"
          >
            Reset filters
          </button>
        </div>
      </div>
    </div>
  );
};
export default Filter;
