"use client";

import HomeCarousel from "@/components/HomeCarousel";
import { AnimeGrid } from "@/components/AnimeGrid";
import AnimeFilter from "@/components/AnimeFilter";
import { useEffect, useState } from "react";
import { RightSidebar } from "@/components/RightSidebar";

interface Anime {
  image: string;
  type: string;
  totalEpisodes: number;
  title: {
    english: string;
    romaji: string;
  };
}

export default function Home() {
  const [selectedTab, setSelectedTab] = useState("Newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [animes, setAnimes] = useState<Anime[]>([]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTab]);

  return (
    <main className="mx-auto w-full bg-background text-foreground">
      <HomeCarousel />
      <section className="container mx-auto">
        <AnimeFilter
          setSelectedTab={setSelectedTab}
          categories={["Newest", "Popular", "TopRated"]}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
        />
        <div className="flex flex-col lg:flex-row justify-between mt-4">
          <div className="lg:w-3/4">
            <AnimeGrid
              animes={animes}
              setAnimes={setAnimes}
              selectedTab={selectedTab}
              currentPage={currentPage}
            />
          </div>
          <div className="lg:w-1/4 space-y-8 mt-8 lg:mt-0">
            <div>
              <h2 className="text-xl font-bold mb-2">Best Scores</h2>
              <RightSidebar query="score" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">Upcoming</h2>
              <RightSidebar query="upcoming" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">Big Boys</h2>
              <RightSidebar query="favourite" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}