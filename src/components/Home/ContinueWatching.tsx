import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { setModalData } from "../../redux/search-slice";
import { setContinueWatching } from "../../redux/videoState-slice";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../redux/store";
import { streamModal } from "../../types/type";
import { A11y, Mousewheel, Pagination } from "swiper";
import SheetStream from "../Shared/SheetStream";
import useWindowResize from "../../hooks/useWindowResize";
import { ref, set } from "firebase/database";
import { db } from "../../firebase/Firebase";
import { streamDataState } from "../../types/initialDataState";
import { imageResize } from "../Shared/reUsableFunctions";
import ModalStream from "../Shared/ModalStream";

const ContinueWatching = () => {
  const [modal, setModal] = useState(false);
  const [sheet, setSheet] = useState(false);
  const { windowDimension } = useWindowResize();
  const { winWidth } = windowDimension;
  const [localModalData, setLocalModalData] =
    useState<streamModal>(streamDataState);

  const dispatch = useAppDispatch();
  const continueWatching = useSelector(
    (state: RootState) => state.videoState.continueWatching
  );
  const uid = useSelector((state: any) => state.google.profileObject.uid);

  // remove continue watching by pressing the remove button
  const removeContinueWatching = (id: number) => {
    const newContinueWatching = [...continueWatching];
    const newContinueWatching2 = newContinueWatching.filter(
      (item) => item.id !== id
    );
    dispatch(setContinueWatching(newContinueWatching2));
    // add new state to firebase
    set(ref(db, `users/${uid}/continueWatching`), {
      ...newContinueWatching2,
    });
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

  //reverse the order of the continue watching list
  const reverseContinueWatching = () => {
    const newContinueWatching = [...continueWatching];
    return newContinueWatching.reverse();
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
  const handleOnClick = (boolean: boolean, anime: any) => {
    setLocalModalData(anime);
    if (winWidth < 768) setSheet(boolean);
    if (winWidth >= 768) setModal(boolean);
  };

  return (
    <div className="z-10 mt-6 lg:mt-6 xl:mt-0 2xl:mt-4">
      <h3 className=" 2xl:ml-5 xl:ml-0 outfit-light lg:ml-2 text-orange-300 text-[32px] relative">
        Continue Watching
      </h3>
      <div className="2xl:ml-4 xl:-ml-1">
        <Swiper
          className="continue-height"
          slidesPerView={itemCount()}
          spaceBetween={spaceBetween()}
          modules={[Pagination, Mousewheel, A11y]}
          mousewheel={true}
          a11y={{
            prevSlideMessage: "previous slide",
            nextSlideMessage: "next slide",
          }}
        >
          {reverseContinueWatching().map((anime) => {
            if (anime.image) {
              return (
                <SwiperSlide key={anime.title.romaji} className="lg:ml-0.5">
                  <div
                    className="flex flex-col xl:w-[14rem] justify-center items-center cursor-pointer mt-4 relative"
                    key={anime.title.romaji}
                  >
                    {/*x button on the top right corner of the img */}
                    <div className="absolute z-index-99 xl:right-1 xl:top-1 lg:right-2 lg:top-1 right-1 top-1">
                      <button
                        className="flex items-center justify-center bg-redor lg:w-8 lg:h-8 w-4 h-4 rounded-full border-0 text-white text-[12px] lg:text-2xl"
                        onClick={() => removeContinueWatching(anime.id)}
                      >
                        <i className="outfit-medium not-italic"> X </i>
                      </button>
                    </div>
                    <img
                      alt={`thumbnail of ${anime.title.romaji}`}
                      src={imageResize(anime.image)}
                      className="skeleton h-full standard-box-recent rounded-xl hover:scale-105 hover:shadow-2xl transition-all duration-300 ease-in-out"
                      onClick={() => handleOnClick(true, anime)}
                    />
                    <div className="lg:visible invisible flex justify-center">
                      <p className="outfit-medium lg:mt-2 lg:mx-0 mx-8 text-white hover:text-redor transition-all ease-in-out lg:text-[16px] text-[12px] cursor-pointer text-center">
                        {anime.title.romaji}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              );
            }
          })}
        </Swiper>
      </div>
      <ModalStream
        setToggle={(boolean: boolean) => {
          if (!boolean) {
            dispatch(setModalData(streamDataState));
          }
          setModal(boolean);
        }}
        toggle={modal}
        modalId={localModalData.id}
      />
      <SheetStream
        modalId={localModalData.id}
        toggle={sheet}
        setToggle={(boolean: boolean) => {
          if (!boolean) {
            dispatch(setModalData(streamDataState));
          }
          setSheet(boolean);
        }}
      />
    </div>
  );
};

export default ContinueWatching;
