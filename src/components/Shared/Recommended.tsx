import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../redux/store";

import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Mousewheel, Navigation, Pagination, Scrollbar } from "swiper";
import {
  animeSearch,
  searchLoadingAction,
  setCurrentPage,
  setModalData,
  setSearchQuery,
  setSearchQueryView,
} from "../../redux/search-slice";
import axios from "axios";
import { imageResize } from "./reUsableFunctions";

interface props {
  getAnimeDetails?: (id: number) => void;
  setModalId?: (id: number) => void;
  data?: any;
  local?: boolean;
}

const Recommended = ({ getAnimeDetails, setModalId, data, local }: props) => {
  const recommendations = useSelector(
    (state: RootState) => state.anime.modalData.recommendations
  );

  const winWidth = window.innerWidth;

  const dispatch = useAppDispatch();

  const itemCount = () => {
    if (recommendations.length) {
    }

    if (winWidth <= 500) {
      return 3;
    }
    if (winWidth > 500 && winWidth <= 800) {
      return 3;
    }
    if (winWidth > 800 && recommendations.length < 5) {
      return recommendations.length;
    }
    if (winWidth > 800 && recommendations.length >= 5) {
      return 5;
    }
  };

  const spaceBetween = () => {
    if (winWidth <= 500) {
      return 10;
    }
    if (winWidth > 500 && winWidth <= 800) {
      return 10;
    }
    if (winWidth > 800) {
      return 15;
    }
    if (winWidth > 1100) {
      return 35;
    }
  };

  useEffect(() => {
    if (data) {
      setModalData(data);
    }
  }, [data]);

  const handleOnClick = (id: number, title: string) => {
    if (getAnimeDetails) {
      getAnimeDetails(id);
    }
    // The modal id is updated to the source to maintain appropriate state
    if (setModalId) {
      setModalId(id);
    }

    if (data && local) {
      dispatch(setSearchQueryView(title));
      dispatch(setSearchQuery(title));
      dispatch(searchLoadingAction(true));
      const getSearch = async () => {
        await axios
          .get(` https://ashanime-api.vercel.app/meta/anilist/${title}`, {
            params: {
              pagePage: 25,
            },
          })
          .then(async (res) => {
            const data = res.data.results;
            dispatch(searchLoadingAction(false));
            if (data.length === 0 && setCurrentPage) {
              setCurrentPage(1);
            }
            dispatch(animeSearch(data));
          });
      };
      getSearch()
        .then(() => {
          dispatch(setSearchQuery(""));
        })
        .catch((err) => {
          return console.log(err.status);
        });
    }
  };

  return (
    <section className="mb-6">
      <h2 className="text-redor md:mx-4 xl:text-[24px] xl:mx-8 lg:mx-8  mx-4 text-[18px] outfit-medium mt-4 lg:-mb-2">
        More like this
      </h2>
      <div className=" flex justify-center">
        <Swiper
          className="lg:h-[20rem] xl:h-[23rem] 2xl:h-[28rem] flex justify-center"
          modules={[Navigation, Pagination, Scrollbar, A11y, Mousewheel]}
          slidesPerView={itemCount()}
          spaceBetween={spaceBetween()}
          pagination={{ clickable: true }}
          scrollbar={{ draggable: true }}
          mousewheel={true}
          loop={true}
        >
          {recommendations?.map((anime) => {
            // only include animeTitle if it does not have special characters
            const title = anime.title.romaji.replace(/[^a-zA-Z0-9 ]/g, ` `);
            if (title) {
              return (
                <SwiperSlide key={anime.title.romaji} className="lg:ml-0.5">
                  <div
                    className=" flex flex-col justify-center lg:w-[8rem] lg:h-[12rem] xl:w-[10rem] xl:h-[15rem] 2xl:w-[13rem] 2xl:h-[19.5rem] inline-block cursor-pointer mt-2 lg:mt-12 mb-4 relative"
                    key={anime.title.romaji}
                  >
                    <img
                      alt={`${title}`}
                      src={imageResize(anime.image)}
                      className="skeleton h-full mr-1 inline-block lg:w-[8rem] lg:h-[12rem] xl:w-[10rem] xl:h-[15rem] 2xl:w-[13rem] 2xl:h-[19.5rem] rounded-xl hover:scale-105 hover:shadow-2xl transition-all duration-300 ease-in-out"
                      onClick={() =>
                        handleOnClick(anime.id, anime.title.romaji)
                      }
                    />
                    <div className="flex flex-col justify-center items-center mx-4">
                      <p className="outfit-medium  mt-2 lg:mx-0 text-white hover:text-redor transition-all ease-in-out lg:text-[12px] text-[12px] cursor-pointer text-center">
                        Score: {anime.rating}
                      </p>
                      <h3 className="h-14 lg:h-12 overflow-clip outfit-medium  lg:mx-0 mt-1 text-white hover:text-redor transition-all ease-in-out lg:text-[16px] text-[12px] cursor-pointer text-center">
                        {title}
                      </h3>
                    </div>
                  </div>
                </SwiperSlide>
              );
            }
          })}
        </Swiper>
      </div>
    </section>
  );
};

export default Recommended;
