/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {
  createContext,
  useState,
  useEffect,
  useReducer,
  useContext,
} from "react";
import {
  fetchPopularAnime,
  fetchTopAiringAnime,
  fetchTopAnime,
  fetchTrendingAnime,
  fetchUpcomingSeasons,
} from "../hooks/useApi";

const initialState = {
  watchedEpisodes: [],
  trendingAnime: [],
  popularAnime: [],
  topAnime: [],
  topAiring: [],
  Upcoming: [],
  error: null,
  loading: {
    trending: true,
    popular: true,
    topRated: true,
    topAiring: true,
    Upcoming: true,
  },
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return {
        ...state,
        loading: {
          trending: true,
          popular: true,
          topRated: true,
          topAiring: true,
          Upcoming: true,
        },
        error: null,
      };
    case "localStorageDataLoaded":
      return {
        ...state,
        watchedEpisodes: action.payload,
      };
    case "anime/loaded":
      return {
        ...state,
        loading: {
          trending: false,
          popular: false,
          topRated: false,
          topAiring: false,
          Upcoming: false,
        },
        trendingAnime: action.payload.trending,
        popularAnime: action.payload.popular,
        topAnime: action.payload.topAnime,
        topAiring: action.payload.topAiring,
        Upcoming: action.payload.Upcoming,
      };
    case "error":
      return {
        ...state,
        error: action.payload,
      };
    case "loading/finished":
      return {
        ...state,
        loading: {
          trending: false,
          popular: false,
          topRated: false,
          topAiring: false,
          Upcoming: false,
        },
      };
    default:
      throw new Error("Unknown action type");
  }
}


const AnimeContext = createContext();


const AnimeProvider = ({ children }) => {
  const [itemsCount, setItemsCount] = useState(
    window.innerWidth > 500 ? 24 : 15
  );

  const [activeTab, setActiveTab] = useState(() => {
    const time = Date.now();
    const savedData = localStorage.getItem("home tab");
    if (savedData) {
      const { tab, timestamp } = JSON.parse(savedData);
      if (time - timestamp < 300000) {
        return tab;
      } else {
        localStorage.removeItem("home tab");
      }
    }
    return "trending";
  });

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const handleResize = () => {
      setItemsCount(window.innerWidth > 500 ? 24 : 15);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchWatchedEpisodes = () => {
      const watchedEpisodesData = localStorage.getItem("watched-episodes");
      if (watchedEpisodesData) {
        const allEpisodes = JSON.parse(watchedEpisodesData);
        const latestEpisodes = [];
        Object.keys(allEpisodes).forEach((animeId) => {
          const episodes = allEpisodes[animeId];
          const latestEpisode = episodes[episodes.length - 1];
          latestEpisodes.push(latestEpisode);
        });
        dispatch({
          type: "localStorageDataLoaded",
          payload: latestEpisodes,
        });
      }
    };

    fetchWatchedEpisodes();
  }, []);

  useEffect(() => {
    const fetchCount = Math.ceil(itemsCount * 1.4);
    const fetchData = async () => {
      try {
        dispatch({
          type: "loading",
        });
        const trending = await fetchTrendingAnime(1, fetchCount);
        const popular = await fetchPopularAnime(1, fetchCount);
        const topRated = await fetchTopAnime(1, fetchCount);
        const topAiring = await fetchTopAiringAnime(1, 6);
        const Upcoming = await fetchUpcomingSeasons(1, 6);

        dispatch({
          type: "anime/loaded",
          payload: {
            trending,
            popular,
            topAiring,
            topRated,
            Upcoming,
          },
        });
      } catch (fetchErr) {
        dispatch({
          type: "error",
          payload: "an unexpected error occurred",
        });
      } finally {
        dispatch({
          type: "loading/finished",
        });
      }
    };

    if (state.loading.trending) {
      fetchData();
    }
  }, [itemsCount]);

  useEffect(() => {
    const time = Date.now();
    const tabData = JSON.stringify({ tab: activeTab, timestamp: time });
    localStorage.setItem("home tab", tabData);
  }, [activeTab]);

  const filterAndTrimAnime = async (animeList) => {
    return animeList?.results?.slice(0, itemsCount);
  };

  const handleTabClick = (tabname) => {
    setActiveTab(tabname);
  };

  return (
    <AnimeContext.Provider
      value={{
        itemsCount,
        activeTab,
        state,

        handleTabClick,
      }}
    >
      {children}
    </AnimeContext.Provider>
  );
};

function useAnime() {
  const context = useContext(AnimeContext);
  if (context === undefined) {
    throw new Error("context was used outside the AnimeProvider");
  }
  return context;
}

export { AnimeProvider, useAnime };
