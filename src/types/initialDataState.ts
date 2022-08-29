import { anime } from "./type";
import { streamModal } from "./type";

export const streamDataState: streamModal = {
  title: {
    romaji: "",
    english: "",
    native: "",
    userPreferred: "",
  },
  cover: "",
  id: 0,
  type: "",
  releaseDate: "",
  status: "",
  genres: [""],
  duration: 0,
  description: "",
  image: "",
  rating: 0,
  malId: 0,
  subOrDub: "",
  trailer: {},
  nextAiringEpisode: {
    airingTime: 0,
    episode: 0,
    timeUntilAiring: 0,
  },
  recommendations: [
    {
      title: {
        romaji: "",
        english: "",
        native: "",
        userPreferred: "",
      },
      cover: "",
      episodes: 0,
      id: 0,
      image: "",
      malId: 0,
      score: 0,
      status: "",
    },
  ],
  relations: [
    {
      title: {
        romaji: "",
        english: "",
        native: "",
      },
      cover: "",
      episodes: 0,
      id: 0,
      image: "",
      malId: 0,
      score: 0,
      status: "",
      color: "",
      relationType: "",
    },
  ],
  studios: [""],
  episodes: [
    {
      id: "",
      title: "",
      image: "",
      number: 0,
      description: "",
      url: "",
    },
  ],
};

export const initialDataState: anime = {
  rank: 0,
  year: 0,
  mal_id: 0,
  type: "",
  score: 0,
  title: "",
  studios: [{ name: "" }],
  trailer: { embed_url: "" },
  images: {
    jpg: { large_image_url: "" },
    webp: { large_image_url: "" },
  },
  synopsis: "",
  episodes: 0,
  status: "",
  demographics: [
    {
      mal_id: 0,
      type: "",
      name: "",
      url: "",
    },
  ],
  genres: [
    {
      mal_id: 0,
      type: "",
      name: "",
      url: "",
    },
  ],
};
