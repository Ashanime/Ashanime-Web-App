import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { A11y, Mousewheel, Navigation, Pagination, Scrollbar } from "swiper";
import "swiper/css/navigation";
import { useAppDispatch } from "../../redux/store";
import useWindowResize from "../../hooks/useWindowResize";
import ModalStream from "../Shared/ModalStream";
import { setModalData } from "../../redux/search-slice";
import SheetStream from "../Shared/SheetStream";
import { imageResize } from "../Shared/reUsableFunctions";
import { animeApi } from "../../backend/anime_api";

export const Popular = () => {
  const [popular, setPopular] = useState<any>([]);
  const [modalId, setModalId] = useState<number>(0);
  const [modal, setModal] = useState(false);
  const [sheet, setSheet] = useState(false);

  const dispatch = useAppDispatch();
  const { windowDimension } = useWindowResize();
  const { winWidth } = windowDimension;

  const getPopular = async () => {
    try {
      const data = await animeApi.getPopular();
      setPopular(data.results);
    } catch (error) {
      //@ts-ignore
      console.log(error.status);
    }
  };

  useEffect(() => {
    if (popular.length === 0) {
      getPopular();
    }
  }, [popular.length]);

  const handleClick = (id: number) => {
    setModalId(id);

    if (winWidth >= 768) {
      setModal(true);
    }
    if (winWidth < 768) {
      setSheet(true);
    }
  };

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
      return 15;
    }
    if (winWidth > 1100 && winWidth <= 1440) {
      return 0;
    }
    if (winWidth > 1440) {
      return 0;
    }
  };

  return (
    <div className="z-10 lg:-ml-2 lg:mt-0 lg:mt-6 ">
      <h3 className="outfit-light text-orange-300 text-[32px] 2xl:ml-8 xl:ml-2 lg:ml-6 relative">
        Popular Anime
      </h3>
      <div className="flex recent-height justify-center 2xl:mr-6 2xl:ml-8  ">
        <Swiper
          className="popular-height flex justify-center items-center"
          modules={[Navigation, Pagination, Scrollbar, A11y, Mousewheel]}
          slidesPerView={itemCount()}
          spaceBetween={spaceBetween()}
          pagination={{ clickable: true }}
          scrollbar={{ draggable: true }}
          loop={true}
          mousewheel={true}
          a11y={{
            prevSlideMessage: "previous slide",
            nextSlideMessage: "next slide",
          }}
        >
          {popular.map(
            (anime: {
              title: {
                romaji: string;
              };
              image: string;
              totalEpisodes: number;
              rating: string;
              id: number;
            }) => {
              // only include animeTitle if it does not have special characters
              const title = anime.title.romaji.replace(/[^a-zA-Z0-9 ]/g, ` `);
              if (title) {
                return (
                  <SwiperSlide
                    key={anime.id}
                    className="flex flex-col xl:w-[14rem] justify-start items-center cursor-pointer relative"
                  >
                    <div
                      className="flex flex-col xl:w-[14rem] justify-center items-center cursor-pointer mt-4 relative"
                      key={anime.title.romaji}
                    >
                      <img
                        alt={`thumbnail of ${title}`}
                        src={imageResize(anime.image)}
                        className="skeleton h-full standard-box-recent rounded-xl hover:scale-105 hover:shadow-2xl transition-all duration-300 ease-in-out"
                        onClick={() => handleClick(anime.id)}
                      />
                      <div className="flex flex-col justify-center">
                        <div className="flex gap-2 justify-center items-center">
                          <p className="outfit-medium lg:mt-2 mt-1 lg:mx-0 text-white hover:text-redor transition-all ease-in-out lg:text-[12px] text-[12px] cursor-pointer text-center">
                            Score: {anime.rating}
                          </p>
                        </div>
                        <h3 className="h-14 lg:h-12 overflow-clip outfit-medium lg:mt-2 lg:mx-0 mt-1 text-white hover:text-redor transition-all ease-in-out lg:text-[16px] text-[12px] cursor-pointer text-center">
                          {title}
                        </h3>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              }
            }
          )}
        </Swiper>
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
