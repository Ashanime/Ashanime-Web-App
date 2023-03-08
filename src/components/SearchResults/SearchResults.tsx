import React, { useEffect, useState } from "react";
import Navbar from "../Shared/Navbar";
import { useSelector } from "react-redux";
import {
  fetchUserDataById,
  RootState,
  useAppDispatch,
} from "../../redux/store";
import AnimeGridStream from "../Shared/AnimeGridStream";
import {
  setCurrentPage,
  setModalData,
  setSearchQueryView,
} from "../../redux/search-slice";
import ModalStream from "../Shared/ModalStream";
import MobileNav from "../Shared/MobileNav";
import SheetStream from "../Shared/SheetStream";
import { motion } from "framer-motion";
import Filter from "./Filter";
import {
  setFormat,
  setGenres,
  setSort,
  setStatusInSearch,
  setYear,
} from "../../redux/filter-slice";
import Pagination from "../Shared/Pagination";
import { useLocation } from "react-router";
import ReactGA from "react-ga";

const SearchResults = () => {
  const [modalId, setModalId] = useState<number>(0);
  const [modal, setModal] = useState(false);
  const [sheet, setSheet] = useState(false);
  const location = useLocation();
  const getParams = new URLSearchParams(location.search);
  const searchQueryTerm = getParams.get("search");

  const dispatch = useAppDispatch();
  const uid = useSelector((state: any) => state.google.profileObject?.uid);
  const { genres, format, sort } = useSelector(
    (state: RootState) => state.filter
  );
  const currentPage = useSelector(
    (state: RootState) => state.anime.currentPage
  );

  useEffect(() => {
    if (searchQueryTerm) {
      dispatch(setSearchQueryView(searchQueryTerm));
    }
    dispatch(fetchUserDataById(uid));
    dispatch(setCurrentPage(1));
    localStorage.removeItem("format");
    //scroll to top
    window.scrollTo(0, 0);
    return () => {
      dispatch(setFormat({ value: "", name: "" }));
      dispatch(setSort({ value: "", name: "" }));
      dispatch(setGenres([]));
      dispatch(setYear(0));
      dispatch(setStatusInSearch({ value: "", name: "" }));
    };
  }, [searchQueryTerm]);

  const { searchResults, searchQueryView } = useSelector(
    (state: RootState) => state.anime
  );

  const handleSearchTitleStart = () => {
    if (searchQueryView.length > 0) {
      return `Search results for`;
    }
    if ([...searchResults].length > 0) {
      return "Search results";
    }
    if (
      searchQueryView.length === 0 &&
      [...searchResults].length === 0 &&
      [...genres].length === 0 &&
      format.value === "" &&
      sort.value === ""
    ) {
      return "Search for an anime";
    } else {
      return "Search for an anime";
    }
  };

  const handleSearchTitleEnd = () => {
    return ` ${searchQueryView}`;
  };

  const handleModal = (active: boolean, animeId: number) => {
    setModal(active);
    if (animeId) {
      setModalId(animeId);
    }
  };

  const handleSheet = (active: boolean, animeId: number) => {
    setSheet(active);
    if (animeId) {
      setModalId(animeId);
    }
  };

  const handleGridRows = () => {
    //  make a new grid row for every 5 bookmarks
    const gridRows =
      searchResults.length % 5 === 0
        ? searchResults.length / 5
        : Math.ceil(searchResults.length / 5);
    return `grid-rows-${gridRows}`;
  };

  const paginate = (pageNumber: number) => {
    dispatch(setCurrentPage(pageNumber));
  };

  return (
    <div className="mb-2">
      <motion.div
        initial={{ opacity: 0.5, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0.5, x: 100 }}
      >
        <div>
          {
            //dont load this component if window width is less than 1024px
            window.innerWidth < 1024 && <MobileNav />
          }
          <Navbar />
          <div className="flex justify-center mt-12">
            <div
              className="mt-8 mx-2 flex flex-col desktop:w-[1920px] w-screen"
              id="top-anime"
            >
              <div className="xl:mx-16 md:mx-4 mb-4">
                <div className="flex">
                  <Filter />
                </div>
                <span className="outfit-light text-white text-[32px]">
                  {handleSearchTitleStart()}
                </span>
                <span className="outfit-light text-orange-300 text-[32px] ">
                  {handleSearchTitleEnd()}
                </span>
              </div>
              <AnimeGridStream
                animeList={searchResults}
                handleSheet={handleSheet}
                handleGridRows={handleGridRows}
                handleModal={handleModal}
              />
              <ModalStream
                setToggle={(boolean: boolean) => {
                  if (!boolean) {
                    dispatch(setModalData({} as any));
                  }
                  setModal(boolean);
                }}
                modalId={modalId}
                setModalId={setModalId}
                toggle={modal}
              />
              <SheetStream
                setToggle={(boolean: boolean) => {
                  if (!boolean) {
                    dispatch(setModalData({} as any));
                  }
                  setSheet(boolean);
                }}
                modalId={modalId}
                toggle={sheet}
                setModalId={setModalId}
              />
              <div className="mb-10 mt-5">
                <Pagination paginate={paginate} currentPage={currentPage} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SearchResults;
