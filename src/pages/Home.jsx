import { useEffect } from "react";
import { getNextSeason, time } from "../hooks/useTime";

import HomeCarousel from "../features/home/HomeCarousel";
import SkeletonSlide from "../features/skeletons/SkeletonSlide";
import EpisodeCard from "../features/home/EpisodeCard";
import { Tab } from "../ui/Tab";
import StyledCardGrid from "../ui/StyledCardGrid";
import SkeletonCard from "../features/skeletons/SkeletonCard";
import CardGrid from "../features/cards/CardGrid";
import HomeSideBar from "../features/home/HomeSideBar";
import { useAnime } from "../contexts/AnimeContext";

export default function Home() {
  const { itemsCount, activeTab, handleTabClick, state } = useAnime();

  useEffect(
    function () {
      document.title = `Project-Anime || Also to watch it`;
    },
    [activeTab]
  );

  useEffect(
    function () {
      const tabData = JSON.stringify({ tab: activeTab, timestamp: time });
      localStorage.setItem("home tab", tabData);
    },
    [activeTab]
  );

  const SEASON = getNextSeason();

  function renderCardGrid(animeData, isLoading, hasError) {
    return (
      <section className="p-0 rounded-[0.3rem]">
        {isLoading || hasError ? (
          <StyledCardGrid>
            {Array.from({ length: itemsCount }, (_, index) => (
              <SkeletonCard key={index} />
            ))}
          </StyledCardGrid>
        ) : (
          <CardGrid
            animeData={animeData}
            hasNextPage={false}
            onLoadMore={() => {}}
          />
        )}
      </section>
    );
  }

  return (
    <div className="gap-4 mx-auto max-w-[125rem] rounded-[0.3rem] flex flex-col">
      {state.error && (
        <div
          className="p-4 my-4 bg-red-100 border-l-4 border-red-600 text-red-600 rounded-[0.3rem]"
          title="Error message"
        >
          <p className="m-0 font-bold">ERROR : {state.error}</p>
        </div>
      )}
      {state.loading.trending || state.error ? (
        <SkeletonSlide />
      ) : (
        <HomeCarousel
          data={state.trendingAnime}
          loading={state.loading}
          error={state.error}
        />
      )}
      <EpisodeCard />
      <div className="flex flex-col gap-8 w-full md:flex-row md:justify-between">
        <div className="flex flex-col flex-grow gap-4">
          <div className="flex flex-wrap justify-center gap-2 rounded-[0.3rem] w-full">
            <Tab
              title="Trending Tab"
              isActive={activeTab === "trending"}
              onClick={() => handleTabClick("trending")}
            >
              TRENDING
            </Tab>
            <Tab
              title="Popular Tab"
              isActive={activeTab === "popular"}
              onClick={() => handleTabClick("popular")}
            >
              POPULAR
            </Tab>
            <Tab
              title="Top Rated Tab"
              isActive={activeTab === "topRated"}
              onClick={() => handleTabClick("topRated")}
            >
              TOP RATED
            </Tab>
          </div>
          <div>
            {activeTab === "trending" &&
              renderCardGrid(
                state.trendingAnime,
                state.loading.trending,
                !!state.error
              )}
            {activeTab === "popular" &&
              renderCardGrid(
                state.popularAnime,
                state.loading.popular,
                !!state.error
              )}
            {activeTab === "topRated" &&
              renderCardGrid(
                state.topAnime,
                state.loading.topRated,
                !!state.error
              )}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="text-xl font-bold py-3">TOP AIRING</div>
          <HomeSideBar animeData={state.topAiring} />
          <div className="text-xl font-bold py-3">UPCOMING {SEASON}</div>
          <HomeSideBar animeData={state.Upcoming} />
        </div>
      </div>
    </div>
  );
}
