import { motion } from "framer-motion";
import React from "react";
import { anime } from "../../types/type";
import useWindowResize from "../../hooks/useWindowResize";

const AnimeGrid = ({
  animeList,
  handleSheet,
  handleModal,
  handleGridRows,
}: any) => {
  const { windowDimension } = useWindowResize();
  const { winWidth } = windowDimension;
  const handleOnClick = (boolean: boolean, anime: any) => {
    if (winWidth < 768) {
      if (handleSheet) {
        handleSheet(boolean, anime);
      }
    }
    if (winWidth >= 768) {
      handleModal(boolean, anime);
    }
  };

  return (
    <div
      className={`2xl:mx-10 xl:mx-12 grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-4 grid-cols-2 ${handleGridRows}`}
    >
      {animeList.map((anime: anime, i: number) => {
        return (
          <motion.div
            initial={{ opacity: 0, translateX: -50 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            onClick={() => handleOnClick(true, anime)}
            className="flex flex-col w-full h-full items-center z-3"
            key={anime.mal_id}
          >
            <div className="standard-box cursor-pointer">
              <img
                alt={`thumbnail of ${anime.title}`}
                src={anime.images.jpg.large_image_url}
                className="skeleton anime-box hover:scale-105 hover:shadow-2xl overflow-visible transition-all duration-300 ease-in-out"
                data-tippy-content={<span>{anime.title}</span>}
              />
            </div>
            <div className="flex gap-3 lg:mt-2 md:mt-2  ">
              <p className="outfit-light text-white  xl:text-[13px] lg:text-[10px] md:text-[8px] text-[10px]">
                Rank: {anime.rank}
              </p>
              {anime.year && (
                <p className="outfit-light text-white  xl:text-[13px] lg:text-[10px] md:text-[8px] text-[10px]">
                  {anime.year}
                </p>
              )}
              <p className="outfit-light text-white   xl:text-[13px] lg:text-[10px] md:text-[8px] text-[10px]">
                {anime.type}
              </p>
              <p className="flex outfit-light text-white  xl:text-[13px] lg:text-[10px] md:text-[8px] text-[10px] items-center">
                Score: {anime.score}
              </p>
            </div>
            <div className="w-52 flex justify-center">
              <h2
                className="outfit-medium lg:mb-4 mb-8 lg:mx-0 mx-8 text-white hover:text-redor transition-all ease-in-out xl:text-[16px] l:text-[14px] text-[12px] cursor-pointer text-center"
                onClick={() => handleOnClick(true, anime)}
              >
                {anime.title}
              </h2>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default AnimeGrid;
