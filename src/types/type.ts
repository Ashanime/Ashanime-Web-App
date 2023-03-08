export interface streamSearch {
  id: number;
  title: {
    romaji: string;
    english: string;
    native: string;
  };
  format: string;
  image: string;
  malId: number;
  rating: number;
  releaseDate: string;
  status: string;
}

export interface episodes {
  isFiller: boolean | null;
  id: string;
  title: string;
  image: string;
  number: number;
  description: string;
  url: string;
}

export interface recommended {
  id: number;
  title: {
    english: string;
    romaji: string;
    native: string;
    userPreferred: string;
  };
  image: string;
  episodes: number;
  malId: number;
  rating: number;
  status: string;
}

export interface streamModal {
  mappings: any;
  title: {
    romaji: string;
    english: string;
    native: string;
    userPreferred: string;
  };
  cover: string;
  id: number;
  type: string;
  releaseDate: string;
  status: string;
  genres: [string];
  description: string;
  image: string;
  rating: number;
  malId: number;
  subOrDub: string;
  trailer: {} | string;
  duration: number;
  studios: [string];
  episodes: [episodes];
  nextAiringEpisode: {
    airingTime: number;
    episode: number;
    timeUntilAiring: number;
  };
  recommendations: [
    {
      rating: number;
      title: {
        romaji: string;
        english: string;
        native: string;
        userPreferred: string;
      };
      cover: string;
      episodes: number;
      id: number;
      image: string;
      malId: number;
      status: string;
    }
  ];
  relations: [
    {
      color: string;
      cover: string;
      episodes: number;
      id: number;
      image: string;
      malId: number;
      relationType: string;
      status: string;
      title: {
        romaji: string;
        english: string;
        native: string;
      };
    }
  ];
}

export interface anime {
  rank: number;
  studios: [{ name: string }];
  year: number;
  mal_id: number;
  type: string;
  score: number;
  title: string;
  images: {
    jpg: { large_image_url: string };
    webp: { large_image_url: string };
  };
  trailer: { embed_url: string };
  synopsis: string;
  episodes: number;
  demographics: animeDemographics[];
  status: string;
  genres: genres[];
}

interface animeDemographics {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

interface genres {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface comments {
  commentId: string;
}

export interface streamEpisode {
  id: string;
  title: string;
  image: string;
  number: number;
  description: string;
}
