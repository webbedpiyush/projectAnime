/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from "react";
import { FaCalendarAlt, FaPlay, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import SkeletonCard from "../skeletons/SkeletonCard";
import StatusIndicator from "../../ui/StatusIndicator";
import { TbCards } from "react-icons/tb";

export default function CardItem({ anime }) {
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(
    function () {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 0);

      return function () {
        clearTimeout(timer);
      };
    },
    [anime.id]
  );

  function handleMouseEnter() {
    setIsHovered(true);
  }

  function handleMouseLeave() {
    setIsHovered(false);
  }

  const imageSrc = anime.image || "";
  const animeColor = anime.color || "#999999";

  const displayTitle = useMemo(
    () => anime.title.english || anime.title.romaji || "No Title",
    [anime.title.english, anime.title.romaji]
  );

  const truncateTitle = useMemo(
    () => (title, maxLength) =>
      title.length > maxLength ? `${title.slice(0, maxLength)}...` : title,
    []
  );

  function handleImageLoad() {
    setLoading(false);
  }

  const displayDetail = useMemo(() => {
    // Any complex logic can go here
    return (
      <p
        className={`absolute bottom-0 m-[0.25rem] p-[0.2rem] text-[0.8rem] font-bold opacity-90 rounded-[0.3rem] backdrop-blur-md transition duration-200 ease-in-out `}
      >
        {anime.type}
      </p>
    );
  }, [isHovered, anime.type]);

  return (
    <>
      {loading ? (
        <SkeletonCard />
      ) : (
        <Link className="text-[#333] animate-[slideUp_0.4s_ease] no-underline hover:z-2 active:z-2 focus:z-2">
          <div
            className="
      transition duration-200 ease-in-out sm:hover:translate-y-[-10px] sm:focus:translate-y-[-10px] sm:active:translate-y-[-10px]"
          >
            <div className="relative text-left overflow-hidden rounded-[0.3rem] pt-[calc(100% * 184 / 133)] animate-[slideUp_0.5s_ease-in-out] transition duration-200 ease-in-out shadow-[2px_2px_10px_rgba(0, 0, 0, 0.2)]  bg-[ #fff]">
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                <img
                  src={imageSrc}
                  onLoad={handleImageLoad}
                  loading="eager"
                  className="absolute top-0 left-0 w-full h-full rounded-[0.3rem] transition duration-300 ease-in-out hover:filter brightness-50"
                />
                <FaPlay
                  title={"Play" + (anime.title.english || anime.title.romaji)}
                  className="absolute top-2/4 left-2/4 opacity-0 z-1 text-[2rem] transition duration-300 ease text-[#fff] hover:opacity-100"
                />
              </div>
              {isHovered && displayDetail}
            </div>
          </div>
          <div className="flex items-center p-[0.5rem] mt-[0.35rem] gap-[0.4rem] rounded-[0.3rem] cursor-pointer transition duration-200 ease-in-out hover:bg-[#e8e8e8] active:bg-[#e8e8e8] focus:bg-[#e8e8e8]">
            <StatusIndicator />
            <h5 className="m-0 overflow-hidden whitespace-nowrap transition duration-200 ease-in-out text-[0.7rem] text-ellipsis">
              {truncateTitle(displayTitle, 35)}
            </h5>
          </div>
          <div>
            <div className="w-full font-bold text-[0.75rem] text-[rgba(102, 102, 102, 0.65)] m-0 flex items-center py-[0.25rem] px-0 whitespace-nowrap overflow-hidden text-ellipsis font-['Arail']">
              {truncateTitle(anime.title.romaji || "", 24)}
            </div>
            <div className="w-full font-bold text-[0.75rem] text-[rgba(102, 102, 102, 0.65)] m-0 flex items-center py-[0.25rem] px-0 whitespace-nowrap overflow-hidden text-ellipsis font-['Arail']">
              {anime.releaseDate && (
                <>
                  <FaCalendarAlt />
                  {anime.releaseDate}
                </>
              )}
              {(anime.totalEpisodes || anime.episodes) && (
                <>
                  <TbCards />
                  {anime.totalEpisodes || anime.episodes}
                </>
              )}
              {anime.rating && (
                <>
                  <FaStar />
                  {anime.rating}
                </>
              )}
            </div>
          </div>
        </Link>
      )}
    </>
  );
}
