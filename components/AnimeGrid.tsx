"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { useEffect, useState } from "react";
import SkeletonCard from "@/components/SkeletonCard";
import Link from "next/link";

interface Anime {
  image: string;
  type: string;
  totalEpisodes: number;
  title: {
    english: string;
    romaji: string;
  };
}

interface AnimeGridProps {
  selectedTab: string;
  currentPage: number;
  animes: Anime[];
  setAnimes: React.Dispatch<React.SetStateAction<Anime[]>>;
}

export function AnimeGrid({ selectedTab, currentPage, animes, setAnimes }: AnimeGridProps) {
  const [isLoading, setIsLoading] = useState(true);

  const getSearchQuery = () => {
    switch (selectedTab.toLowerCase()) {
      case "newest":
        return `advanced-search?type=ANIME&year=2024&season=WINTER`;
      case "toprated":
        return `advanced-search?type=ANIME&sort=["TRENDING_DESC"]`;
      case "popular":
        return `advanced-search?type=ANIME&sort=["POPULARITY_DESC"]`;
      default:
        return `advanced-search?type=ANIME&sort=["TRENDING_DESC"]`;
    }
  };

  

  async function fetchAnimes() {
    const searchQuery = getSearchQuery();
    const url = `http://localhost:8000/meta/anilist/${searchQuery}`;
    try {
      setIsLoading(true);
      const { data } = await axios.get(url, {
        params: { page: currentPage, perPage: 15, provider: "zoro" },
      });
      setAnimes(data.results);
    } catch (error: any) {
      console.error("Error fetching animes:", error.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchAnimes();
  }, [selectedTab, currentPage]);

  if (isLoading) {
    return <SkeletonCard />;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
      {animes.map((anime, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative">
              <Link href={{
    pathname: "/watch",
    query: { animeData: JSON.stringify(anime) },
  }}
  as="/watch">
              <img
                src={anime.image}
                className="object-cover w-full h-48"
                alt={`${anime.title.english || anime.title.romaji}`}
                />
              <Badge className="absolute bottom-2 right-2 bg-primary text-primary-foreground">
                {anime.type === "TV" ? `EP ${anime.totalEpisodes}` : anime.type}
              </Badge>
                </Link>
            </div>
            <h3 className="p-2 text-sm font-medium truncate">
              {anime.title.english || anime.title.romaji}
            </h3>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}