import React, { useEffect, useState } from "react";
import axios from "axios";
import { RootState, useAppDispatch } from "../../redux/store";
import { useSelector } from "react-redux";

import Pagination from "../Shared/Pagination";
import {
  animeSearch,
  setHasNextPage,
  setLastPage,
  setModalData,
} from "../../redux/search-slice";
import ToggleAiring from "./ToggleAiring";
import { setUser } from "../../redux/google-slice";
import AnimeGridStream from "../Shared/AnimeGridStream";
import ModalStream from "../Shared/ModalStream";
import SheetStream from "../Shared/SheetStream";

interface props {
  currentPage: number;
  paginate: (pageNumber: number) => void;
}

const TopAnime = ({ currentPage, paginate }: props) => {
  const [modalId, setModalId] = useState<number>(0);
  const [modal, setModal] = useState(false);
  const [sheet, setSheet] = useState(false);

  const dispatch = useAppDispatch();

  const { format, status } = useSelector((state: RootState) => state.filter);
  const { searchResults } = useSelector((state: RootState) => state.anime);

  const handleGridRows = () => {
    //  make a new grid row for every 5 bookmarks
    const gridRows =
      searchResults.length % 5 === 0
        ? searchResults.length / 5
        : Math.ceil(searchResults.length / 5);
    return `grid-rows-${gridRows}`;
  };

  const isMobile = () => {
    return window.innerWidth < 768;
  };

  const getTopAnime = async () => {
    return await axios
      .get(`https://consumet-api.herokuapp.com/meta/anilist/advanced-search`, {
        params: {
          page: currentPage,
          perPage: isMobile() ? 26 : 25,
          sort: '["SCORE_DESC"]',
          ...(format.value && { format: format.value }),
          ...(status.value && { status: status.value }),
        },
      })
      .then((response) => {
        const data = response.data.results;
        dispatch(animeSearch(data));
        dispatch(setHasNextPage(response.data.hasNextPage));
        dispatch(setLastPage(response.data.totalPages));
      })
      .catch(() => {
        return;
      });
  };

  useEffect(() => {
    // wait 0.5 seconds before getting top anime
    setTimeout(() => {
      getTopAnime();
    }, 600);
    dispatch(setUser(JSON.parse(localStorage.getItem("user") as string)));
  }, [format, status, currentPage]);

  useEffect(() => {
    if (format.name !== "") {
      console.log(format);
      document.getElementById("top-anime")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [format]);

  //get type from local storage
  const savedFormat = localStorage.getItem("format");
  // scroll down to id===top-anime when user loads the page if type is set

  useEffect(() => {
    if (savedFormat !== null) {
      console.log("savedFormat", savedFormat);
      document.getElementById("top-anime")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [savedFormat, searchResults]);

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

  const handleTitle = () => {
    if (format.name === "") {
      return "Top Anime";
    } else if (format.name === "TV") {
      return "Top TV Shows";
    } else if (format.name === "Movie") {
      return "Top Movies";
    }
  };

  return (
    <div className="lg:mt-8 mt-4" id="top-anime">
      <div className="flex justify-between">
        <h2 className="outfit-light 2xl:ml-8 lg:ml-3 text-orange-300 text-[32px] mb-4 z-10">
          {handleTitle()}
        </h2>
        <div className="flex items-center mb-4">
          {format.name !== "Movie" && (
            <ToggleAiring
              paginate={(pageNumber: number) => paginate(pageNumber)}
            />
          )}
        </div>
      </div>
      <div>
        {/*make a grid of top anime*/}
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
        {searchResults.length >= 25 && (
          <div className="mb-10 mt-5">
            <Pagination paginate={paginate} currentPage={currentPage} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TopAnime;
