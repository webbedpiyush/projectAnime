/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useAnime } from "../../contexts/AnimeContext";
import { Link } from "react-router-dom";
import { TbCards } from "react-icons/tb";
import { FaStar, FaCalendarAlt } from "react-icons/fa";
import StatusIndicator from "../../ui/StatusIndicator";

export default function HomeSideBar({ animeData }) {
  const { state } = useAnime();
  console.log(animeData);
  const data = state[animeData.toString()];
  console.log(data);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(function () {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return function () {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  let displayedAnime;
  if (data) {
    displayedAnime =
      windowWidth <= 500 ? data.results.slice(0, 5) : data.results;
    console.log(data.results);
  }
  // console.log()

  return (
    <div className="transition-all duration-200 ease-in-out m-0 p-0 max-w-[24rem] md:max-w-full">
      {displayedAnime &&
        displayedAnime.length > 1 &&
        displayedAnime?.map((anime, index) => (
          <Link
            to={`/watch/${anime.id}`}
            key={anime.id}
            className="no-underline text-inherit"
            title={`${anime.title.userPreferred}`}
            aria-label={`Watch ${anime.title.userPreferred}`}
          >
            <div
              className="flex bg-[#e0e0e0] rounded-[0.3rem] items-center overflow-hidden gap-2 cursor-pointer mb-2 animate-[slideUp_0.5s_ease-in-out] animate-fill-backwards transition-all duration-200 md:hover:ml-0"
              key={anime.id}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <img
                src={anime.image}
                alt={anime.title.userPreferred}
                className="w-[4.25rem] h-[6rem] object-cover rounded"
              />
              <div>
                <div className="flex items-center p-2 mt-1 gap-2 rounded cursor-pointer transition-background duration-200 ease">
                  <StatusIndicator status={anime.status} />
                  <p className="top-0 mb-2 line-clamp-2 text-sm m-0">
                    {anime.title.english || anime.title.romaji}
                  </p>
                </div>
                <p className="text-xs m-0 text-gray-500">
                  {anime.type && <>{anime.type}</>}
                  {anime.releaseDate && (
                    <>
                      <FaCalendarAlt className="inline-block mr-1" />{" "}
                      {anime.releaseDate}
                    </>
                  )}
                  {anime.currentEpisode !== null &&
                    anime.currentEpisode !== undefined &&
                    anime.totalEpisodes !== null &&
                    anime.totalEpisodes !== undefined &&
                    anime.totalEpisodes !== 0 &&
                    anime.totalEpisodes !== 0 && (
                      <>
                        <TbCards className="inline-block mr-1" />{" "}
                        {anime.currentEpisode}
                        {" / "}
                        {anime.totalEpisodes}
                      </>
                    )}

                  {anime.rating && (
                    <>
                      <FaStar className="inline-block mr-1" /> {anime.rating}
                    </>
                  )}
                </p>
              </div>
            </div>
          </Link>
        ))}
    </div>
  );
}
