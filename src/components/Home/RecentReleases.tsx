import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { A11y, Mousewheel, Navigation, Pagination, Scrollbar } from "swiper";
import "swiper/css/navigation";
import { setModalData, setRecentReleases } from "../../redux/search-slice";
import { useAppDispatch } from "../../redux/store";
import useWindowResize from "../../hooks/useWindowResize";
import ModalStream from "../Shared/ModalStream";
import SheetStream from "../Shared/SheetStream";
import { streamModal } from "../../types/type";
import { imageResize } from "../Shared/reUsableFunctions";
import { animeApi } from "../../backend/anime_api";

export const RecentReleases = () => {
  const [animeBelt, setAnimeBelt] = useState<any>([]);
  const [modalId, setModalId] = useState<number>(0);
  const [modal, setModal] = useState(false);
  const [sheet, setSheet] = useState(false);

  const dispatch = useAppDispatch();
  const { windowDimension } = useWindowResize();
  const { winWidth } = windowDimension;

  const getRecent = async () => {
    try {
      const data = await animeApi.getRecentEpisodes();
      setAnimeBelt(data.results);
      data.results.length > 0 && dispatch(setRecentReleases(true));
      data.results.length === 0 && dispatch(setRecentReleases(false));
    } catch (error: any) {
      return console.log(error.status);
    }
  };

  const handleClick = (id: number) => {
    setModalId(id);

    if (winWidth >= 768) {
      setModal(true);
    }
    if (winWidth < 768) {
      setSheet(true);
    }
  };

  useEffect(() => {
    getRecent();
  }, []);

  const itemCount = () => {
    if (winWidth <= 500) {
      return 3;
    }
    if (winWidth > 500 && winWidth <= 800) {
      return 4;
    }
    if (winWidth > 800 && winWidth <= 1440) {
      return 5;
    }
    if (winWidth > 1440 && winWidth <= 1790) {
      return 6;
    }
    if (winWidth > 1790) {
      return 7;
    }
  };

  const spaceBetween = () => {
    if (winWidth <= 500) {
      return 10;
    }
    if (winWidth > 500 && winWidth <= 800) {
      return 10;
    }
    if (winWidth > 800 && winWidth <= 1100) {
      return 0;
    }
    if (winWidth > 1100 && winWidth <= 1440) {
      return 0;
    }
    if (winWidth > 1440) {
      return 0;
    }
  };

  return (
    <div className="z-10 lg:-ml-2 mt-6 lg:mt-0 ">
      <h3 className="outfit-light text-orange-300 text-[32px] 2xl:ml-8 xl:ml-2 lg:ml-6 relative">
        Recent Releases
      </h3>
      <div className="flex recent-height justify-center 2xl:mr-6 2xl:ml-8  ">
        <Swiper
          className="recent-height flex justify-center items-center"
          modules={[Navigation, Pagination, Scrollbar, A11y, Mousewheel]}
          slidesPerView={itemCount()}
          spaceBetween={spaceBetween()}
          // navigation={true}
          pagination={{ clickable: true }}
          scrollbar={{ draggable: true }}
          loop={true}
          mousewheel={true}
          a11y={{
            prevSlideMessage: "previous slide",
            nextSlideMessage: "next slide",
          }}
        >
          {animeBelt.map(
            (anime: {
              id: number;
              title: {
                english: string;
                romaji: string;
                native: string;
              };
              episodeNumber: number;
              image: string;
              malId: number;
              rating: number;
            }) => {
              return (
                // if any of the anime images are the same as the previous one, don't show it
                anime.title.romaji !==
                  animeBelt[animeBelt.length - 1].title.romaji && (
                  <SwiperSlide
                    key={anime.episodeNumber + anime.malId}
                    className="lg:ml-0.5"
                  >
                    <div
                      className=" flex flex-col xl:w-[14rem] justify-center items-center cursor-pointer mt-4 relative"
                      key={anime.title.romaji}
                    >
                      <img
                        alt={`${anime.title.romaji}`}
                        src={imageResize(anime.image)}
                        className="skeleton h-full standard-box-recent rounded-xl hover:scale-105 hover:shadow-2xl  transition-all duration-300 ease-in-out"
                        onClick={() => {
                          handleClick(anime.id);
                        }}
                      />
                      <div className="flex flex-col justify-center">
                        <div className="flex justify-center">
                          <p className="flex-wrap outfit-medium lg:mt-2 mt-1 lg:mx-0 text-white hover:text-redor transition-all ease-in-out lg:text-[12px] text-[12px] cursor-pointer text-center">
                            Episode: {anime.episodeNumber}
                          </p>
                        </div>
                        <h3 className="h-14 lg:h-12 overflow-clip outfit-medium lg:mt-2 lg:mx-0 mt-1 text-white hover:text-redor transition-all ease-in-out lg:text-[16px] text-[12px] cursor-pointer text-center">
                          {anime.title.romaji}
                        </h3>
                      </div>
                    </div>
                  </SwiperSlide>
                )
              );
            }
          )}
        </Swiper>
      </div>
      <ModalStream
        modalId={modalId}
        setModalId={setModalId}
        setToggle={(boolean: boolean) => {
          if (!boolean) {
            dispatch(setModalData({} as streamModal));
          }
          setModal(boolean);
        }}
        toggle={modal}
      />
      <SheetStream
        setToggle={(boolean: boolean) => {
          if (!boolean) {
            dispatch(setModalData({} as streamModal));
          }
          setSheet(boolean);
        }}
        toggle={sheet}
        modalId={modalId}
      />
    </div>
  );
};
