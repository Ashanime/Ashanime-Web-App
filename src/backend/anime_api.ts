import axios from "axios";

const AnimeProviders = {
  ANIMEPAHE: "animepahe",
  GOGO: "gogoanime",
  ZORO: "zoro",
  ENIME: "enime",
  CRUNCHYROLL: "crunchyroll",
};

export type AnimeProvider = keyof typeof AnimeProviders;

export class AnimeApi {
  host = "https://ashanime-api.vercel.app";
  provider;

  constructor(provider: AnimeProvider = "GOGO") {
    this.provider = AnimeProviders[provider];
  }

  async consumetApiGetCall(path: string = "", params = {}) {
    const url = `${this.host}${path.startsWith("/") ? path : `/${path}`}`;
    return (
      await axios.get(url, {
        params: {
          provider: this.provider,
          ...params,
        },
      })
    ).data;
  }

  async advancedSearch(params = {}) {
    return this.consumetApiGetCall("/meta/anilist/advanced-search", params);
  }

  async getRandom(params = {}) {
    return this.consumetApiGetCall("/meta/anilist/random-anime", params);
  }

  async getTrending(params = {}) {
    return this.consumetApiGetCall("/meta/anilist/trending", params);
  }

  async getRecentEpisodes(params = {}) {
    return this.consumetApiGetCall("/meta/anilist/recent-episodes", {
      perPage: 15,
      ...params,
    });
  }

  async getPopular(params = {}) {
    return this.consumetApiGetCall("/meta/anilist/popular", {
      perPage: 20,
      ...params,
    });
  }

  async getUpcomingAnimes(params = {}) {
    return (
      await axios.get("https://api.jikan.moe/v4/top/anime", {
        params: {
          filter: "upcoming",
        },
      })
    ).data;
  }
}

export const animeApi = new AnimeApi();
