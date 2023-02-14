import { motion } from "framer-motion";
import React from "react";
import { streamModal, streamSearch } from "../../types/type";
import useWindowResize from "../../hooks/useWindowResize";
import { gridImageResize } from "./reUsableFunctions";

interface props {
  animeList?: streamSearch[] | streamModal[];
  handleSheet?: (active: boolean, anime: any) => void;
  handleModal: (active: boolean, anime: any) => void;
  handleGridRows: () => void;
}

const AnimeGrid = ({
  animeList,
  handleSheet,
  handleModal,
  handleGridRows,
}: props) => {
  const { windowDimension } = useWindowResize();
  const { winWidth } = windowDimension;

  const handleOnClick = (boolean: boolean, animeId: any) => {
    if (winWidth < 768) {
      if (handleSheet) {
        handleSheet(boolean, animeId);
      }
    }
    if (winWidth >= 768) {
      handleModal(boolean, animeId);
    }
  };

  return (
    <div
      className={`2xl:mx-10 xl:mx-12 grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-4 grid-cols-2 ${handleGridRows}`}
    >
      {animeList?.map((anime: any, i: number) => {
        return (
          <motion.div
            initial={{ opacity: 0, translateX: -50 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            onClick={() => handleOnClick(true, anime.id)}
            className="flex flex-col w-full h-full items-center z-10"
            key={anime.id}
          >
            <div className="standard-box cursor-pointer">
              <img
                alt={`thumbnail of ${anime.title.romaji}`}
                src={gridImageResize(anime.image)}
                className="skeleton anime-box hover:scale-105 hover:shadow-2xl transition-all duration-300 ease-in-out"
                data-tippy-content={<span>{anime.title.romaji}</span>}
              />
            </div>
            <div className="flex gap-3 mt-2">
              {anime.releaseDate && (
                <span className="outfit-light text-white lg:text-[13px] text-[8px]">
                  {anime.releaseDate}
                </span>
              )}
              <span className="outfit-light text-white lg:text-[13px] text-[8px]">
                Score: {anime.rating}
              </span>
            </div>
            <div className="w-52 flex justify-center">
              <span
                className="outfit-medium lg:mb-4 mb-8 lg:mx-0 mx-8 text-white hover:text-redor transition-all ease-in-out lg:text-[16px] text-[12px] cursor-pointer text-center"
                onClick={() => handleOnClick(true, anime.id)}
              >
                {anime.title.romaji}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default AnimeGrid;
