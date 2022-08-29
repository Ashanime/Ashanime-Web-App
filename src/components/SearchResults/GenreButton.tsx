import React from "react";
import { useAppDispatch } from "../../redux/store";
import { setGenres } from "../../redux/filter-slice";
import { useSelector } from "react-redux";

interface props {
  genre: string;
}

const GenreButton = (props: props) => {
  const dispatch = useAppDispatch();
  const { genre } = props;
  const genres = useSelector((state: any) => state.filter.genres);

  const handleOnClick = () => {
    //  everytime a genre is clicked, it is added to the array of genres
    //  if the genre is already in the array, it is removed
    if (genres.includes(genre)) {
      dispatch(setGenres(genres.filter((g: string) => g !== genre)));
    } else {
      dispatch(setGenres([...genres, genre]));
    }
  };

  const selected = genres.includes(genre)
    ? "bg-white text-redor"
    : "bg-redor text-white";

  return (
    <button
      onClick={handleOnClick}
      type="button"
      className={`inline-flex ${selected} mr-2 mt-2 items-center px-3 py-1.5 border border-transparent text-xs font-medium
      rounded-full shadow-sm hover:brightness-125 focus:outline-none focus:ring-2
      focus:ring-offset-2 focus:ring-gray-500`}
    >
      {genre}
    </button>
  );
};

export default GenreButton;
