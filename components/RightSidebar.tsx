"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Link from "next/link";
import { Button } from "./ui/button";
import axios from "axios";

interface AnimeTitle {
  userPreferred: string;
  english: string;
  romaji: string;
}

interface Anime {
  id: string;
  title: AnimeTitle;
  image: string;
  status: "FINISHED" | "RELEASING" | "NOT_YET_RELEASED";
  type: string;
  releaseDate: string;
  currentEpisode: number | null;
  totalEpisodes: number | null;
  rating: number | null;
}

interface RightSidebarProps {
  query: string;
}

const StatusIndicator: React.FC<{ status: Anime["status"] }> = ({ status }) => {
  const statusColors = {
    FINISHED: "bg-blue-500",
    RELEASING: "bg-green-500",
    NOT_YET_RELEASED: "bg-yellow-500",
  };

  return <div className={`w-2 h-2 rounded-full ${statusColors[status]}`} />;
};

export const RightSidebar: React.FC<RightSidebarProps> = ({ query }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [animeData, setAnimeData] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);

  const getSearchQuery = () => {
    switch (query.toLowerCase()) {
      case "favourite":
        return `advanced-search?type=ANIME&sort=["FAVOURITES_DESC"]`;
      case "upcoming":
        return `advanced-search?type=ANIME&year=2025&season=WINTER&`;
      case "score":
        return `advanced-search?type=ANIME&sort=["SCORE_DESC"]`;
      default:
        return `advanced-search?type=ANIME&sort=["TRENDING_DESC"]`; // Default to trending
    }
  };

  const fetchAnimeData = async () => {
    setLoading(true);
    const searchQuery = getSearchQuery();
    const url = `http://localhost:8000/meta/anilist/${searchQuery}`;

    try {
      const { data } = await axios.get(url, {
        params: { page: 1, perPage: 15, provider: "zoro" },
      });
      setAnimeData(data.results);
    } catch (error: any) {
      console.error("Error fetching anime data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimeData();
  }, [query]);

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setShowLeftArrow(container.scrollLeft > 0);
      setShowRightArrow(
        container.scrollLeft < container.scrollWidth - container.clientWidth
      );
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="relative w-full max-w-xs lg:max-w-sm xl:max-w-md">
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide"
          onScroll={handleScroll}
        >
          {animeData.length > 0 &&
            animeData.map((anime) => (
              <Link
                href={`/watch/${anime.id}`}
                key={anime.id}
                className="flex-none w-36"
                title={`${anime.title.userPreferred}`}
                aria-label={`Watch ${anime.title.userPreferred}`}
              >
                <div className="relative h-48 w-36 rounded-lg overflow-hidden group">
                  <img
                    src={anime.image}
                    alt={anime.title.userPreferred}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white text-sm font-medium line-clamp-2 mb-1">
                        {anime.title.english || anime.title.romaji}
                      </h3>
                      <div className="flex items-center space-x-2 text-xs text-gray-300">
                        <StatusIndicator status={anime.status} />
                        <span>{anime.type}</span>
                        {anime.rating && (
                          <span className="flex items-center">
                            <FaStar className="mr-1 text-yellow-400" />
                            {anime.rating}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
        </div>
        {showLeftArrow && (
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70"
            onClick={() => scroll("left")}
          >
            <FaChevronLeft />
          </Button>
        )}
        {showRightArrow && (
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70"
            onClick={() => scroll("right")}
          >
            <FaChevronRight />
          </Button>
        )}
      </div>
    </div>
  );
};

export default function Component({ query = "" }: { query?: string }) {
  return <RightSidebar query={query} />;
}
