"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { useEffect, useState } from "react";
import SkeletonCard from "@/components/SkeletonCard";

export function AnimeGrid({
  selectedTab,
  currentPage,
  animes,
  setAnimes,
}: {
  selectedTab: string;
  currentPage: number;
  animes: string[];
  setAnimes: () => void;
}) {
  const [isLoading, setIsLoading] = useState(true);

  // Dynamically set searchQuery based on selectedTab
  const getSearchQuery = () => {
    switch (selectedTab.toLowerCase()) {
      case "newest":
        return `advanced-search?type=ANIME&year=2024&season=WINTER`;
      case "toprated":
        return `advanced-search?type=ANIME&sort=["TRENDING_DESC"]`;
      case "popular":
        return `advanced-search?type=ANIME&sort=["POPULARITY_DESC"]`;
      default:
        return `advanced-search?type=ANIME&sort=["TRENDING_DESC"]`; // Default to trending
    }
  };

  // Fetch data function
  async function fetch() {
    const searchQuery = getSearchQuery(); // Get the appropriate search query
    const url = `http://localhost:8000/meta/anilist/${searchQuery}`;
    console.log(url);
    try {
      setIsLoading(true);
      const { data } = await axios.get(url, {
        params: { page: currentPage, perPage: 15, provider: "zoro" },
      });
      // console.log(data.results);
      console.log(currentPage);
      setAnimes(data.results);
    } catch (error: any) {
      throw new Error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  // Fetch data when selectedTab changes
  useEffect(() => {
    fetch();
  }, [selectedTab, currentPage]);

  // Return JSX
  return (
    <>
      {isLoading ? (
        <SkeletonCard />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
          {animes.length > 0 &&
            animes.map((anime, index) => (
              <Card key={index} className="overflow-hidden lg:w-[180px]">
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={anime.image}
                      className="object-cover w-full h-full "
                      alt={`Slide ${index + 1}`}
                      style={{
                        width: "100%", // Ensures the image fills the card
                        height: "250px", // Adjusted height to match the reduced width
                        objectFit: "cover",
                      }}
                    />
                    <Badge className="absolute bottom-2 right-2 bg-primary text-primary-foreground">
                      {anime.type === "TV"
                        ? `EP ${anime.totalEpisodes}`
                        : anime.type}
                    </Badge>
                  </div>
                  <h3 className="p-2 text-sm font-medium truncate">
                    {anime.title.english || anime.title.romaji}
                  </h3>
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </>
  );
}
