"use client";
import HomeCarousel from "@/components/HomeCarousel";
import { AnimeGrid } from "@/components/AnimeGrid";
import AnimeFilter from "@/components/AnimeFilter";
import { useEffect, useState } from "react";
import { RightSidebar } from "@/components/RightSidebar";

export default function Home() {
  const [selectedTab, setSelectedTab] = useState("Newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [animes, setAnimes] = useState([]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(
    function () {
      setCurrentPage(1);
    },
    [selectedTab]
  );
  console.log(selectedTab);
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
        <div className="flex flex-col md:flex-row justify-evenly mt-4">
          <AnimeGrid
            animes={animes}
            setAnimes={setAnimes}
            selectedTab={selectedTab}
            currentPage={currentPage}
          />
          <div className="flex flex-col items-center justify-around">
            <div className="flex flex-col">
              <h2 className="text-xl font-bold mb-2">Best Scores</h2>
              <RightSidebar query="score" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">UpComing</h2>
              <RightSidebar query="upcoming" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-xl font-bold mb-2">Big Boys</h2>
              <RightSidebar query="favourite" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
