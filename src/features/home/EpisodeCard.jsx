import { useEffect, useMemo, useState } from "react";
import { FaCircle, FaPlay } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";

const LOCAL_STORAGE_KEYS = {
  WATCHED_EPISODES: "watched-episodes",
  LAST_ANIME_VISITED: "last-anime-visited",
};

function calculateSlidesPerView(windowWidth) {
  if (windowWidth >= 1200) {
    return 5;
  }
  if (windowWidth >= 1000) {
    return 4;
  }
  if (windowWidth >= 700) {
    return 3;
  }
  if (windowWidth >= 500) {
    return 2;
  }
  return 2;
}

export default function EpisodeCard() {
  const [watchedEpisodesData, setWatchedEpisodesData] = useState(
    localStorage.getItem("watched-episodes")
  );
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const lastVisitedData = useMemo(() => {
    const data = localStorage.getItem(LOCAL_STORAGE_KEYS.LAST_ANIME_VISITED);
    return data ? JSON.parse(data) : {};
  }, []);
  useEffect(function () {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }
    const debouncedResize = setTimeout(handleResize, 200);
    window.addEventListener("resize", handleResize);
    return function () {
      clearTimeout(debouncedResize);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const episodesToRender = useMemo(() => {
    if (!watchedEpisodesData) return [];

    try {
      const allEpisodes = JSON.parse(watchedEpisodesData);
      const lastEpisodes = Object.entries(allEpisodes).reduce(
        (acc, [animeId, episodes]) => {
          const lastEpisode = episodes[episodes.length - 1]; // Assuming the episodes are in order
          if (lastEpisode) {
            acc[animeId] = lastEpisode;
          }
          return acc;
        },
        {}
      );

      const orderedAnimeIds = Object.keys(lastEpisodes).sort((a, b) => {
        const lastVisitedA = lastVisitedData[a]?.timestamp || 0;
        const lastVisitedB = lastVisitedData[b]?.timestamp || 0;
        return lastVisitedB - lastVisitedA;
      });

      return orderedAnimeIds.map((animeId) => {
        const episode = lastEpisodes[animeId];
        const playbackInfo = JSON.parse(
          localStorage.getItem("all_episode_times") || "{}"
        );

        const playbackPercentage =
          playbackInfo[episode.id]?.playbackPercentage || 0;

        // Determine anime title, preferring English, falling back to Romaji, then to empty string
        const animeTitle =
          lastVisitedData[animeId]?.titleEnglish ||
          lastVisitedData[animeId]?.titleRomaji ||
          "";

        // Conditional title display
        const displayTitle = `${animeTitle}${
          episode.title ? ` - ${episode.title}` : ""
        }`;

        const handleRemoveAllEpisodes = (animeId) => {
          const updatedEpisodes = JSON.parse(watchedEpisodesData || "{}");
          delete updatedEpisodes[animeId];

          const newWatchedEpisodesData = JSON.stringify(updatedEpisodes);
          localStorage.setItem("watched-episodes", newWatchedEpisodesData);
          setWatchedEpisodesData(newWatchedEpisodesData); // Trigger re-render
        };

        return (
          <SwiperSlide key={episode.id}>
            <Link
              className="relative flex flex-col mx-[1rem] my-0 p-0 rounded-[0.3rem] overflow-hidden transition duration-200 ease-in-out hover:shadow-[2px_2px_10px_10px_rgba(0, 0, 0, 0.2)] active:shadow-[2px_2px_10px_10px_rgba(0, 0, 0, 0.2)] focus:shadow-[2px_2px_10px_10px_rgba(0, 0, 0, 0.2)] md:hover:translate-y-[-10px] md:active:translate-y-[-10px] md:focus:translate-y-[-10px] no-underline"
              to={`/watch/${animeId}`}
              title={`Continue Watching ${displayTitle}`}
            >
              <img
                src={episode.image}
                alt={`Cover for ${animeTitle}`}
                className="h-auto aspect-video
              object-cover transition duration-200 ease-in-out animate-[slideDown_0.5s_ease-in-out]"
              />
              <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] text-[#fff] text-[][2.5rem] opacity-0 z-1 transition duration-200 ease-in-out flex items-center justify-center">
                <FaPlay />
              </div>
              <div className="absolute bottom-0 left-0 w-full p-[0.5rem] bg-[rgba(8, 8, 8, 1)] text-white ">
                <p className="nowrap overflow-hidden text-ellipsis text-[0.95rem] font-bold my-[0.25rem] mx-0">
                  {displayTitle}
                </p>
                <p className="text-[0.75rem] m-0 text-[rgba(255, 255, 255, 0.65)]">{`Episode ${episode.number}`}</p>
              </div>
              <div
                className="absolute bottom-0 left-0 h-[0.25rem] rounded-[0.3rem] bg-[#8080cf] transition duration-300 ease-in-out"
                style={{ width: `${Math.max(playbackPercentage, 5)}%` }}
              ></div>
              <button
                className="absolute right-0 bg-transparent border-none text-[#fff] cursor-pointer hidden animate-[slideDown_0.25s_ease-in-out] pr-[0.2rem] pt-[0.2rem] "
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRemoveAllEpisodes(animeId);
                }}
              >
                <FaCircle
                  aria-label="Close"
                  className="text-[1.75rem] hover:scale-100 active:scale-100 focus:scale-100 transition duration-200 ease-in-out "
                />
              </button>
            </Link>
          </SwiperSlide>
        );
      });
    } catch (error) {
      console.error("Error parsing watchedEpisodesData:", error);
      return [];
    }
  }, [watchedEpisodesData, lastVisitedData]);

  const swiperSettings = useMemo(
    () => ({
      spaceBetween: 20,
      slidesPerView: calculateSlidesPerView(windowWidth),
      loop: true,
      freeMode: true,
      grabCursor: true,
      keyboard: true,
      autoplay: {
        delay: 6000,
        disableOnInteraction: false,
      },
    }),
    [windowWidth]
  );

  return (
    <section className="p-[0rem] rounded-[0.3rem] w-full">
      {episodesToRender.length > 0 && (
        <h2
          className="text-[#333] text-[1.25rem] mb-1"
          id="continueWatchingTitle"
        >
          CONTINUE WATCHING
        </h2>
      )}
      <Swiper
        className="relative w-full h-96 rounded-[0.3rem] cursor-grab"
        {...swiperSettings}
      >
        {episodesToRender}
      </Swiper>
    </section>
  );
}
