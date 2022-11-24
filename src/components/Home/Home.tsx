import AnimeTrailersHome from "./AnimeTrailersHome";
import TopAnime from "./TopAnime";
import Navbar from "../Shared/Navbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import MobileNav from "../Shared/MobileNav";
import ContinueWatching from "./ContinueWatching";
import { RecentReleases } from "./RecentReleases";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../redux/store";
import { setContinueWatching } from "../../redux/videoState-slice";
import { onValue, ref } from "firebase/database";
import { db } from "../../firebase/Firebase";
import { motion } from "framer-motion";
import Hero from "./Hero";
import { Popular } from "./Popular";
import {
  animeSearch,
  setBookmarks,
  setSearchQueryView,
} from "../../redux/search-slice";

export const Home = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();
  const userSignedIn = typeof localStorage.getItem("user") === "string";
  const continueWatching = useSelector(
    (state: RootState) => state.videoState.continueWatching
  );
  const { searchResults } = useSelector((state: RootState) => state.anime);
  const recentReleases = useSelector(
    (state: RootState) => state.anime.recentReleases
  );
  const dispatch = useAppDispatch();
  const uid = useSelector((state: any) => state.google.profileObject?.uid);

  const paginate = (pageNumber: number) => {
    return setCurrentPage(pageNumber);
  };

  useEffect(() => {
    dispatch(animeSearch([]));
    dispatch(setSearchQueryView(""));
  }, []);

  //  get continue watching from firebase on load and set in redux
  useEffect(() => {
    onValue(
      ref(db, `users/${uid}/continueWatching`),
      (snapshot: { val: () => any }) => {
        const data = snapshot.val();
        if (data !== null) {
          dispatch(setContinueWatching(data));
        }
      }
    );
  }, [dispatch, uid]);

  useEffect(() => {
    onValue(
      ref(db, `users/${uid}/bookmarks`),
      (snapshot: { val: () => any }) => {
        const data = snapshot.val();
        if (data !== null) {
          dispatch(setBookmarks(data));
        }
      }
    );
  }, [dispatch, uid]);

  useEffect(() => {
    !userSignedIn && navigate("/login");
    window.scrollTo(0, 0);
  }, [navigate, userSignedIn]);

  return (
    <motion.div
      initial={{ opacity: 0.5, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0.5, x: 100 }}
    >
      <div
        style={{ height: "auto" }}
        className="overflow-x-hidden flex flex-col justify-center items-center"
      >
        <div className="flex flex-col desktop:w-[1920px] w-screen mt-20 xl:px-12 px-4 overflow-x-hidden">
          <Navbar paginate={(pageNumber: number) => paginate(pageNumber)} />
          <MobileNav paginate={(pageNumber: number) => paginate(pageNumber)} />
          <Hero />
          {window.innerWidth > 768 && <AnimeTrailersHome />}
          {recentReleases && <RecentReleases />}
          {continueWatching.length > 0 && <ContinueWatching />}
          {searchResults && <Popular />}
          <TopAnime
            currentPage={currentPage}
            paginate={(pageNumber: number) => paginate(pageNumber)}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Home;
