import React from "react";
import axios from "axios";
import {
  animeSearch,
  searchLoadingAction,
  setCurrentPage,
  setSearchQuery,
  setSearchQueryView,
} from "../../redux/search-slice";
import { useAppDispatch } from "../../redux/store";

interface props {
  getAnimeDetails?: (id: number) => void;
  setModalId?: (id: number) => void;
  data?: any;
  local?: boolean;
}

const Relations = ({ getAnimeDetails, setModalId, data, local }: props) => {
  const dispatch = useAppDispatch();

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
    <div className="flex flex-col justify-center">
      <div>
        {data.relations?.map((relation: any) => {
          if (relation.relationType === "ADAPTATION") {
            return (
              <div
                className="flex items-start lg:items-center"
                key={relation.id}
              >
                <p className="outfit-medium text-redor xl:text-[18px]   text-[16px] pl-4 text-left ">
                  Adaptation:
                </p>
                <p
                  onClick={() =>
                    handleOnClick(relation.id, relation.title.romaji)
                  }
                  className="outfit-light cursor-pointer hover:text-orange-300 transition-all ease-in-out text-white text-[16px] px-2 text-left "
                >
                  {relation.title.romaji}
                </p>
              </div>
            );
          } else if (relation.relationType === "PREQUEL") {
            return (
              <div
                className="flex items-start lg:items-center"
                key={relation.id}
              >
                <p className="outfit-medium text-redor xl:text-[18px] pl-4 text-[16px]pl-4 text-left ">
                  Prequel:
                </p>
                <p
                  onClick={() =>
                    handleOnClick(relation.id, relation.title.romaji)
                  }
                  className="outfit-light cursor-pointer hover:text-orange-300 transition-all ease-in-out text-white text-[16px] px-2 text-left "
                >
                  {relation.title.romaji}
                </p>
              </div>
            );
          } else if (relation.relationType === "SEQUEL") {
            return (
              <div
                className="flex items-start lg:items-center"
                key={relation.id}
              >
                <p className="outfit-medium text-redor xl:text-[18px]  text-[16px] pl-4 text-left ">
                  Sequel:
                </p>
                <p
                  onClick={() =>
                    handleOnClick(relation.id, relation.title.romaji)
                  }
                  className="outfit-light cursor-pointer hover:text-orange-300 transition-all ease-in-out text-white  text-[16px] px-2 text-left "
                >
                  {relation.title.romaji}
                </p>
              </div>
            );
          } else if (relation.relationType === "SIDE_STORY") {
            return (
              <div
                className="flex items-start lg:items-center"
                key={relation.id}
              >
                <p className="outfit-medium text-redor xl:text-[18px] whitespace-nowrap text-[16px] pl-4 text-left ">
                  Side Story:
                </p>
                <p
                  onClick={() =>
                    handleOnClick(relation.id, relation.title.romaji)
                  }
                  className="outfit-light cursor-pointer hover:text-orange-300 transition-all ease-in-out text-white   text-[16px] px-2 text-left "
                >
                  {relation.title.romaji}
                </p>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

export default Relations;
