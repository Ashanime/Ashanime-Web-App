import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
//@ts-ignore
import logo from "../../assets/logo-long.png";
import { setSearchQuery } from "../../redux/search-slice";
import { useAppDispatch } from "../../redux/store";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import LogoutButton from "../Login/google/LogoutButton";
import SearchBar from "./SearchBar";
import Random from "../Random/Random";
import { setFormat, setStatus } from "../../redux/filter-slice";

interface props {
  paginate?: (page: number) => void;
}

const Navbar = ({ paginate }: props) => {
  const [scrolled, setScrolled] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const profile = useSelector((state: RootState) => state.google.profileObject);

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
    //
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

  const handleClickGenres = () => {
    navigate("/genres");
  };

  // Handles the highlighting of the bookmarks button
  const handleClickBookmarks = () => {
    dispatch(setSearchQuery(""));
    navigate(`/bookmarks`);
  };

  useEffect(() => {
    // change nav background to black when scrolling
    window.addEventListener("scroll", () => {
      window.scrollY > 25 ? setScrolled(true) : setScrolled(false);
    });
  }, []);

  const winWidth = window.innerWidth;
  const isDesktop = winWidth > 768;

  return (
    <div
      className={` invisible lg:visible flex justify-center items-center bg-none dark-gradient-nav transition-all sticky-nav ${
        scrolled ? "scrolled-nav" : ""
      }`}
    >
      <div className="flex justify-between items-center py-4 2xl:px-15 xl:px-[4.5rem] lg:px-[2.5rem] lg: 2xl:w-[1920px] w-[1440px] ">
        <div className="flex items-center xl:gap-4 lg:gap-2">
          <div className="cursor-pointer" onClick={handleLogoClick}>
            <img alt="logo" className="mx-auto h-6" src={logo} />
          </div>
          {isDesktop && <SearchBar />}
          <div
            onClick={handleClickAll}
            title="All Anime"
            className="flex items-center"
          >
            <Link
              className=" xl:text-[16px] lg:text-[12px] whitespace-nowrap  outfit-medium text-concrete hover:text-white transition-colors duration-200"
              to={"/"}
            >
              Top Anime
            </Link>
          </div>
          <div
            onClick={handleClickMovie}
            title="Anime Movies"
            className="flex items-center"
          >
            <h3 className=" xl:text-[16px] lg:text-[12px] whitespace-nowrap outfit-medium text-concrete hover:text-white transition-colors duration-200 cursor-pointer">
              Top Movies
            </h3>
          </div>
          <div
            onClick={handleClickTV}
            title="Anime Shows"
            className="flex items-center"
          >
            <h3 className=" xl:text-[16px] lg:text-[12px] whitespace-nowrap outfit-medium text-concrete hover:text-white transition-colors duration-200 cursor-pointer">
              Top Shows
            </h3>
          </div>
          <div className="xl:text-[16px] lg:text-[12px] whitespace-nowrap outfit-medium text-concrete hover:text-white transition-colors duration-200 cursor-pointer">
            <Random classes="xl:text-[16px] lg:text-[12px] whitespace-nowrap outfit-medium text-concrete hover:text-white transition-colors duration-200 cursor-pointer" />
          </div>
          <div
            onClick={handleClickGenres}
            title="Anime Shows"
            className="flex items-center"
          >
            <h3 className=" xl:text-[16px] lg:text-[12px] whitespace-nowrap outfit-medium text-concrete hover:text-white transition-colors duration-200 cursor-pointer">
              Genres
            </h3>
          </div>
          <div
            onClick={handleClickBookmarks}
            title="Watchlist"
            className="flex items-center"
          >
            <h3 className=" xl:text-[16px] lg:text-[12px] whitespace-nowrap outfit-medium text-concrete hover:text-white transition-colors duration-200 cursor-pointer">
              My Watchlist
            </h3>
          </div>
        </div>
        <div className="flex lg:gap-2">
          {profile.photoURL && (
            <img
              className="inline-block xl:h-8 xl:w-8 lg:h-6 lg:w-6 rounded-full ml-4"
              src={profile.photoURL}
              alt="profile pic"
            />
          )}
          <div className="flex justify-center">
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
