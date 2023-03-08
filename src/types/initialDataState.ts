import { anime, streamEpisode } from "./type";
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
      rating: 0,
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
      status: "",
      color: "",
      relationType: "",
    },
  ],
  studios: [""],
  mappings: { "": "" },
  episodes: [
    {
      id: "",
      title: "",
      image: "",
      number: 0,
      description: "",
      url: "",
      isFiller: null,
    },
  ],
};

export const streamEpisodeDatastate: streamEpisode = {
  id: "",
  title: "",
  image: "",
  number: 0,
  description: "",
};
