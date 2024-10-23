"use client";
import HomeCarousel from "@/components/HomeCarousel";
import { AnimeGrid } from "@/components/AnimeGrid";
import AnimeFilter from "@/components/AnimeFilter";
import { useState } from "react";

export default function Home() {
  const [selectedTab, setSelectedTab] = useState("Newest");
  console.log(selectedTab);
  return (
    <main className="mx-auto w-full bg-background text-foreground">
      <HomeCarousel />
      <section className="container mx-auto">
        <AnimeFilter
          setSelectedTab={setSelectedTab}
          categories={["Newest", "Popular", "TopRated"]}
        />
        <div className="mr-10 lg:mr-20"> {/* Add margin-top here */}
          <AnimeGrid selectedTab={selectedTab} />
        </div>
      </section>
    </main>
  );
}
