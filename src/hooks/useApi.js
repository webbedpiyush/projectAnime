import axios from "axios";
import { year, getCurrentSeason, getNextSeason } from "./useTime";

function ensureUrlEndsWithSlash(url) {
  return url.endsWith("/") ? url : `${url}/`;
}

const BASE_URL = ensureUrlEndsWithSlash(import.meta.env.VITE_BACKEND_URL);

const SKIP_TIMES = ensureUrlEndsWithSlash(import.meta.env.VITE_SKIP_TIMES);

const API_KEY = import.meta.env.VITE_API_KEY;

let PROXY_URL = import.meta.env.VITE_PROXY_URL || undefined;

if (PROXY_URL) {
  PROXY_URL = ensureUrlEndsWithSlash(PROXY_URL);
}

const axiosInstance = axios.create({
  baseURL: PROXY_URL || undefined,
  timeout: 100000,
  headers: {
    "X-API-Key": API_KEY,
  },
});

function handleError(error, context) {
  let errorMessage = "An error occurred";

  if (error.message && error.message.includes("Access-Control-Allow-Origin")) {
    errorMessage = "A cors error occurred";
  }

  switch (context) {
    case "data":
      errorMessage = "error fetching data";
      break;
    case "anime episode":
      errorMessage = "error fetching anime episodes";
      break;
    // TODO : extend with the other error cases as well ( in future )
  }

  if (error.response) {
    const status = error.response.status;
    if (status >= 500) {
      errorMessage += " : Server error";
    } else if (status >= 400) {
      errorMessage += ": Client error";
    }
    errorMessage += `: ${error.response.data.message || "unknown error"}`;
  } else if (error.message) {
    errorMessage += `: ${error.message}`;
  }

  console.error(`${errorMessage}`, error);
  throw new Error(errorMessage);
}

function generateCacheKey(...args) {
  return args.join("-");
}

function createOptimizedSessionStorageCache(maxSize, maxAge, cacheKey) {
  const cache = new Map(JSON.parse(sessionStorage.getItem(cacheKey) || "[]"));

  const keys = new Set(cache.keys());
  function isItemExpired(item) {
    return Date.now() - item.timestamp > maxAge;
  }

  function updateSessionStorage() {
    sessionStorage.setItem(
      cacheKey,
      JSON.stringify(Array.from(cache.entries()))
    );
  }

  return {
    get(key) {
      if (cache.has(key)) {
        const item = cache.get(key);
        if (!isItemExpired(item)) {
          keys.delete(key);
          keys.add(key);
          return item.value;
        }
        cache.delete(key);
        keys.delete(key);
      }
      return undefined;
    },
    set(key, value) {
      if (cache.size >= maxSize) {
        const oldestKey = keys.values().next().value;
        cache.delete(oldestKey);
        key.delete(oldestKey);
      }
      keys.add(key);
      cache.set(key, { value, timestamp: Date.now() });
      updateSessionStorage();
    },
  };
}

const CACHE_SIZE = 20;
const CACHE_MAX_AGE = 24 * 60 * 60 * 1000;

function createCache(cacheKey) {
  return createOptimizedSessionStorageCache(
    CACHE_SIZE,
    CACHE_MAX_AGE,
    cacheKey
  );
}

const advancedSearchCache = createCache("Advanced Search");
const animeDataCache = createCache("Data");
const animeInfoCache = createCache("Info");
const animeEpisodesCache = createCache("Episodes");
const fetchAnimeEmbeddedEpisodesCache = createCache("Video Embedded Sources");
const videoSourcesCache = createCache("Video Sources");

// TODO : to make a proxy url in the axios instance and use here
async function fetchFromProxy(url, cache, cacheKey) {
  try {
    const cachedResponse = cache.get(cacheKey);
    if (cachedResponse) {
      return cachedResponse;
    }

    const requestConfig = PROXY_URL ? { params: { url } } : {};

    const response = await axiosInstance.get(
      PROXY_URL ? "" : url,
      requestConfig
    );

    if (response.status !== 200 || response.data.statusCode >= 400) {
      const errorMessage = response.data.message || "unknown server error";
      throw new Error(
        `Server error: ${
          response.data.statusCode || response.status
        } ${errorMessage}`
      );
    }

    cache.set(cacheKey, response.data);
    console.log(response.data);
    return response.data;
  } catch (err) {
    handleError(err, "data");
    throw err;
  }
}

export async function fetchAdvancedSearch(searchQuery, page, perPage, options) {
  const queryParams = new URLSearchParams({
    ...(searchQuery && { query: searchQuery }),
    page: page.toString(),
    perPage: perPage.toString(),
    type: options.type ?? "ANIME",
    ...(options.season && { season: options.season }),
    ...(options.format && { format: options.format }),
    ...(options.id && { id: options.id }),
    ...(options.year && { year: options.year }),
    ...(options.status && { status: options.status }),
    ...(options.sort && { sort: JSON.stringify(options.sort) }),
  });

  if (options.genres && options.genres.length > 0) {
    queryParams.set("genres", JSON.stringify(options.genres));
  }

  const url = `${BASE_URL}meta/anilist/advanced-search?${queryParams.toString()}`;
  const cacheKey = generateCacheKey("advancedSearch", queryParams.toString());

  return fetchFromProxy(url, advancedSearchCache, cacheKey);
}

export async function fetchAnimeData(animeId, provider = "gogoanime") {
  const params = new URLSearchParams({ provider });
  const url = `${BASE_URL}meta/anilist/data/${animeId}?${params.toString()}`;
  const cacheKey = generateCacheKey("animeData", animeId, provider);

  return fetchFromProxy(url, animeDataCache, cacheKey);
}

export async function fetchAnimeInfo(animeId, provider = "gogoanime") {
  const params = new URLSearchParams({ provider });
  const url = `${BASE_URL}meta/anilist/info/${animeId}?${params.toString()}`;
  const cacheKey = generateCacheKey("animeInfo", animeId, provider);

  return fetchFromProxy(url, animeInfoCache, cacheKey);
}

async function fetchList(type, page = 1, perPage = 10, options = {}) {
  let cacheKey;
  let url;
  const params = new URLSearchParams({
    page: page.toString(),
    perPage: perPage.toString(),
  });

  if (
    ["TopRated", "Trending", "Popular", "TopAiring", "Upcoming"].includes(type)
  ) {
    cacheKey = generateCacheKey(
      `${type}Anime`,
      page.toString(),
      perPage.toString()
    );
    url = `${BASE_URL}meta/anilist/${type.toLowerCase()}`;

    if (type === "TopRated") {
      options = {
        type: "ANIME",
        sort: ['["SCORE_DESC"]'],
      };
      url = `${BASE_URL}meta/anilist/advanced-search?type=${options.type}&sort=${options.sort}&`;
    } else if (type === "Popular") {
      options = {
        type: "ANIME",
        sort: ['["POPULARITY_DESC"]'],
      };
      url = `${BASE_URL}meta/anilist/advanced-search?type=${options.type}&sort=${options.sort}&`;
    } else if (type === "Upcoming") {
      const season = getNextSeason();
      options = {
        type: "ANIME",
        season: season,
        year: year.toString(),
        status: "NOT_YET_RELEASED",
        sort: ['["POPULARITY_DESC"]'],
      };
      url = `${BASE_URL}meta/anilist/advanced-search?type=${options.type}&status=${options.status}&sort=${options.sort}&season=${options.season}&year=${options.year}&`;
    } else if (type === "TopAiring") {
      const season = getCurrentSeason();
      options = {
        type: "ANIME",
        season: season,
        year: year.toString(),
        status: "RELEASING",
        sort: ['["POPULARITY_DESC"]'],
      };
      url = `${BASE_URL}meta/anilist/advanced-search?type=${options.type}&status=${options.status}&sort=${options.sort}&season=${options.season}&year=${options.year}&`;
    }
  } else {
    cacheKey = generateCacheKey(
      `${type}Anime`,
      page.toString(),
      perPage.toString()
    );
    url = `${BASE_URL}meta/anilist/${type.toLowerCase()}`;
  }
  const specificCache = createCache(`${type}`);
  return fetchFromProxy(`${url}?${params.toString()}`, specificCache, cacheKey);
}

export function fetchTopAnime(page, perPage) {
  return fetchList("TopRated", page, perPage);
}
export function fetchTrendingAnime(page, perPage) {
  return fetchList("Trending", page, perPage);
}
export function fetchTopAiringAnime(page, perPage) {
  return fetchList("TopAiring", page, perPage);
}
export function fetchPopularAnime(page, perPage) {
  return fetchList("Popular", page, perPage);
}
export function fetchUpcomingSeasons(page, perPage) {
  return fetchList("Upcoming", page, perPage);
}

export async function fetchAnimeEpisodes(
  animeId,
  provider = "gogoanime",
  dub = false
) {
  const params = new URLSearchParams({ provider, dub: dub ? true : false });
  const url = `${BASE_URL}meta/anilist/episodes/${animeId}?${params.toString()}`;

  const cacheKey = generateCacheKey(
    "animeEpisodes",
    animeId,
    provider,
    dub ? "dub" : "sub"
  );
  return fetchFromProxy(url, animeEpisodesCache, cacheKey);
}

export async function fetchAnimeStreamingLinks(episodeId) {
  const url = `${BASE_URL}meta/anilist/watch/${episodeId}`;
  const cacheKey = generateCacheKey("animeStreamingLinks", episodeId);

  return fetchFromProxy(url, videoSourcesCache, cacheKey);
}

export async function fetchAnimeEmbeddedEpisodes(episodeId) {
  const url = `${BASE_URL}meta/anilist/servers/${episodeId}`;
  const cacheKey = generateCacheKey("animeEmbeddedServers", episodeId);

  return fetchFromProxy(url, fetchAnimeEmbeddedEpisodesCache, cacheKey);
}

export async function fetchSkipTimes({
  malID,
  episodeNumber,
  episodeLength = "0",
}) {
  const types = ["ed", "mixed-ed", "mixed-op", "op", "recap"];
  const url = new URL(`${SKIP_TIMES}v2/skip-times/${malID}/${episodeNumber}`);
  url.searchParams.append("episodeLength", episodeLength.toString());
  types.forEach((type) => url.searchParams.append("types[]", type));

  const cacheKey = generateCacheKey(
    "skipTimes",
    malID,
    episodeNumber,
    episodeLength || ""
  );

  return fetchFromProxy(url.toString(), createCache("SkipTimes"), cacheKey);
}

export async function fetchRecentEpisodes(
  page = 1,
  perPage = 10,
  provider = "gogoanime"
) {
  const params = new URLSearchParams({
    page: page.toString(),
    perPage: perPage.toString(),
    provider: provider,
  });

  const url = `${BASE_URL}meta/anilist/recent-episodes?${params.toString()}`;
  const cacheKey = generateCacheKey(
    "recentEpisodes",
    page.toString(),
    perPage.toString(),
    provider
  );

  return fetchFromProxy(url, createCache("RecentEpisodes"), cacheKey);
}
