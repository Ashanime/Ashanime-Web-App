import GenreButton from "./GenreButton";
import React from "react";

export default function GenresButtons() {
  const genreStrings = [
    "Action",
    "Adventure",
    "Comedy",
    "Drama",
    "Fantasy",
    "Horror",
    "Mecha",
    "Music",
    "Mystery",
    "Psychological",
    "Romance",
    "Sci-Fi",
    "Slice of Life",
    "Sports",
    "Supernatural",
    "Thriller",
  ];

  return (
    <div className="flex flex-col mb-4">
      <div className="flex-wrap items-center">
        {genreStrings.map((genre, index) => (
          <GenreButton genre={genre} key={index} />
        ))}
      </div>
    </div>
  );
}
