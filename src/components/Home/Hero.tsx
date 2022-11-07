import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay, Mousewheel, Pagination } from "swiper";
import "swiper/css";
// @ts-ignore
import episodes from "../../assets/episodes.svg";
// @ts-ignore
import play from "../../assets/play.svg";
// @ts-ignore
import calender from "../../assets/calender.svg";
// @ts-ignore
import time from "../../assets/time.svg";
import { setModalData } from "../../redux/search-slice";
import { useAppDispatch } from "../../redux/store";
import ModalStream from "../Shared/ModalStream";
import SheetStream from "../Shared/SheetStream";
import useWindowResize from "../../hooks/useWindowResize";
import { animeApi } from "../../backend/anime_api";

const Hero = () => {
  const [trending, setTrending] = useState<any[]>([]);
  const [modalId, setModalId] = useState<number>(0);
  const [modal, setModal] = useState(false);
  const [sheet, setSheet] = useState(false);

  const dispatch = useAppDispatch();

  const getTrending = async () => {
    try {
      const data = await animeApi.getTrending();
      setTrending(data.results);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  //get win-width
  const { windowDimension } = useWindowResize();
  const { winWidth } = windowDimension;

  // Search for the anime when clicking the button
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
    if (trending.length === 0) {
      getTrending();
    }
  }, [trending.length]);

  const cleanHTML = (html: string, letterCount: number) => {
    return html.replace(/<[^>]*>?/gm, "").substring(0, letterCount) + "...";
  };

  const shortTitle = (title: string, letterCount: number) => {
    return title.replace(/[^a-zA-Z0-9 ]/g, ` `).substring(0, letterCount);
  };

  // detect screen size
  const isMobile = window.innerWidth < 768;
  const isTablet = window.innerWidth < 1024 && window.innerWidth >= 768;
  const isDesktop = window.innerWidth >= 1024 && window.innerWidth < 1440;
  const isLargeDesktop = window.innerWidth >= 1440;

  return (
    <div className="z-10 lg:ml-0 lg:mb-6 ">
      <div className="whitespace-nowrap lg:h-[30rem] h-[20rem] overflow-y-hidden lg:px-5 flex items-center justify-center">
        {trending && (
          <Swiper
            className="lg:ml-0 flex h-full"
            slidesPerView={1}
            modules={[Pagination, Autoplay, Mousewheel, A11y]}
            loop={true}
            pagination={{ clickable: true }}
            autoplay={{
              delay: 2000,
              pauseOnMouseEnter: true,
              disableOnInteraction: false,
            }}
            mousewheel={true}
            a11y={{
              prevSlideMessage: "previous slide",
              nextSlideMessage: "next slide",
            }}
          >
            {trending.map((anime) => {
              if (anime.cover.includes("banner")) {
                return (
                  <SwiperSlide key={anime.id}>
                    <div className="rounded-xl  lg:h-[28rem] h-[20rem] w-full flex justify-center relative">
                      <div className="relative z-20 w-full flex justify-start items-start">
                        <div className="flex flex-col gap-4 lg:ml-10 lg:mt-4 mx-8 mt-4">
                          <h2 className="text-white text-left lg:w-full w-[1rem] outfit-medium lg:text-[48px] text-[28px] -mb-2 whitespace-nowrap">
                            {(isLargeDesktop &&
                              shortTitle(anime.title.romaji, 51)) ||
                              (isDesktop &&
                                shortTitle(anime.title.romaji, 35)) ||
                              (isTablet &&
                                shortTitle(anime.title.romaji, 25)) ||
                              (isMobile && shortTitle(anime.title.romaji, 20))}
                          </h2>
                          <div className="flex flex-col">
                            <div className="flex gap-4">
                              {anime.type && (
                                <p
                                  className="text-white flex items-center justify-center outfit-light lg:text-[16px]
                            text-[14px]"
                                >
                                  <img
                                    alt="TV show"
                                    src={play}
                                    className="h-4"
                                  />
                                  {anime.type}
                                </p>
                              )}
                              {anime.totalEpisodes && (
                                <p
                                  className="ml-4 flex items-center justify-center text-white outfit-light lg:text-[16px]
                            text-[14px]"
                                >
                                  <img
                                    alt="total episodes"
                                    src={episodes}
                                    className="h-4"
                                  />
                                  {anime.totalEpisodes} Episodes
                                </p>
                              )}
                              {anime.duration && (
                                <p
                                  className="text-white flex items-center justify-center outfit-light lg:text-[16px]
                            text-[14px]"
                                >
                                  <img
                                    alt="average episode duration"
                                    src={time}
                                    className="h-4"
                                  />
                                  {anime.duration} mins
                                </p>
                              )}
                              {anime.releaseDate && (
                                <p
                                  className="text-white flex items-center justify-center outfit-light lg:text-[16px]
                            text-[14px]"
                                >
                                  <img
                                    alt="airing date"
                                    src={calender}
                                    className="h-4"
                                  />
                                  {anime.releaseDate}
                                </p>
                              )}
                            </div>
                          </div>
                          {/*add the anime description within the container*/}
                          <div
                            /*place div at the bottom left of container*/

                            className="hero-absolute"
                          >
                            <div className="flex flex-col hide-scrollbar">
                              <p className="text-white overflow-y-scroll xl:h-[13rem] lg:h-[13rem] md:h-[8rem] md:w-1/2 lg:mb-4 text-left outfit-medium lg:text-[14px] text-[12px] whitespace-pre-line">
                                {isLargeDesktop &&
                                  cleanHTML(anime.description, 700)}
                                {isDesktop && cleanHTML(anime.description, 600)}
                                {isTablet && cleanHTML(anime.description, 350)}
                                {isMobile && cleanHTML(anime.description, 100)}
                              </p>
                            </div>

                            <button
                              className="flex gap-2 mt-2 items-center justify-center bg-redor w-44 h-12 rounded-xl
                          hover:brightness-150 transition-all ease-in-out duration-200"
                              onClick={() => handleClick(anime.id)}
                            >
                              <img
                                src={play}
                                className="h-8"
                                alt="play-button"
                              />
                              <p className="outfit-medium text-white text-[20px]">
                                Watch Now
                              </p>
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="absolute z-10 w-full h-full">
                        <div className="dark-gradient-banner rounded-xl absolute w-full h-full" />
                        <div
                          style={{
                            backgroundImage: `url(${anime.cover})`,
                          }}
                          className="rounded-xl w-full h-full bg-no-repeat bg-cover bg-center "
                        >
                          {/*There has to be something in the div for Swiper to work correctly :(*/}
                          <div className="opacity-0">.</div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              }
            })}
          </Swiper>
        )}
      </div>
      <ModalStream
        modalId={modalId}
        setModalId={setModalId}
        setToggle={(boolean: boolean) => {
          if (!boolean) {
            dispatch(setModalData({} as any));
          }
          setModal(boolean);
        }}
        toggle={modal}
      />
      <SheetStream
        setToggle={(boolean: boolean) => {
          if (!boolean) {
            dispatch(setModalData({} as any));
          }
          setSheet(boolean);
        }}
        toggle={sheet}
        modalId={modalId}
      />
    </div>
  );
};

export default Hero;
