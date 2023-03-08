import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../redux/store";

import Navbar from "../Shared/Navbar";
import LocalPagination from "./LocalPagination";
import MobileNav from "../Shared/MobileNav";
import { motion } from "framer-motion";
import ModalStream from "../Shared/ModalStream";
import AnimeGridStream from "../Shared/AnimeGridStream";
import SheetStream from "../Shared/SheetStream";
import {
  animeSearch,
  setBookmarks,
  setSearchQueryView,
} from "../../redux/search-slice";
import { onValue, ref } from "firebase/database";
import { db } from "../../firebase/Firebase";

const Bookmarks = () => {
  const [modalId, setModalId] = useState<number>(0);
  const [modal, setModal] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const uid = useSelector((state: any) => state.google.profileObject?.uid);

  //obtain the bookmarks from the database and store them in the redux store
  const readUserDataBookmarks = () => {
    onValue(ref(db, `users/${uid}/bookmarks`), (snapshot) => {
      const data = snapshot.val();
      if (data) {
        dispatch(setBookmarks(data));
        localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
      }
    });
  };

  const dispatch = useAppDispatch();

  useEffect(() => {
    window.scroll({ top: 0 });
    localStorage.removeItem("format");
    dispatch(animeSearch([]));
    dispatch(setSearchQueryView(""));
    readUserDataBookmarks();
    // read bookmarks from local storage
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    dispatch(setBookmarks(bookmarks));
  }, []);

  const bookmarks = useSelector((state: RootState) => state.anime.bookmarks);

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

  const paginate = (pageNumber: number) => {
    return setCurrentPage(pageNumber);
  };

  const handleGridRows = () => {
    //  make a new grid row for every 5 bookmarks
    const gridRows =
      bookmarks.length % 5 === 0
        ? bookmarks.length / 5
        : Math.ceil(bookmarks.length / 5);
    return `grid-rows-${gridRows}`;
  };

  //get current elements
  const indexOfLastBookmark = currentPage * 25;
  const indexOfFirstBookmark = indexOfLastBookmark - 25;
  const currentBookmarks = bookmarks.slice(
    indexOfFirstBookmark,
    indexOfLastBookmark
  );

  return (
    <motion.div
      initial={{ opacity: 0.5, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0.5, x: 100 }}
    >
      <div>
        <Navbar />
        {
          //dont load this component if window width is less than 1024px
          window.innerWidth < 1024 && <MobileNav />
        }
        <div className="flex justify-center mt-12">
          <div
            className="mt-8 2xl:w-[1920px]  xl:w-[1440px] lg:px-8"
            id="top-anime"
          >
            <div className=" ml-6 mb-4">
              <h1 className="outfit-light text-orange-300 text-[32px]">
                {bookmarks.length > 0
                  ? "My Watchlist"
                  : "Build your watchlist by checking out some anime!"}
              </h1>
            </div>

            <AnimeGridStream
              handleGridRows={handleGridRows}
              handleModal={handleModal}
              handleSheet={handleSheet}
              animeList={currentBookmarks}
            />
            {bookmarks.length > 0 && (
              <div className="mb-10 mt-5">
                <LocalPagination
                  currentPage={currentPage}
                  paginate={(pageNumber: number) => paginate(pageNumber)}
                />
              </div>
            )}
            <ModalStream
              setToggle={(boolean: boolean) => {
                return setModal(boolean);
              }}
              modalId={modalId}
              toggle={modal}
            />
            <SheetStream
              setToggle={(boolean: boolean) => {
                return setSheet(boolean);
              }}
              toggle={sheet}
              modalId={modalId}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Bookmarks;
