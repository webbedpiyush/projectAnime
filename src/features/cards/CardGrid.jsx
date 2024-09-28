/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useCallback, useEffect } from "react";
import { useAnime } from "../../contexts/AnimeContext";
import CardItem from "./CardItem";

export default function CardGrid({ hasNextPage, onLoadMore }) {
  const { state } = useAnime();
  const animeData = state.trendingAnime.results;

  const handleLoadMore = useCallback(() => {
    if (hasNextPage) {
      onLoadMore();
    }
  }, [hasNextPage, onLoadMore]);

  useEffect(
    function () {
      function handleScroll() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.offsetHeight;
        const scrollTop =
          document.documentElement.scrollTop || document.body.scrollTop;

        let threshold = 0;
        if (window.innerWidth <= 450) {
          threshold = 1;
        }

        if (windowHeight + scrollTop >= documentHeight - threshold) {
          handleLoadMore();
        }
      }

      window.addEventListener("scroll", handleScroll);
      return function () {
        window.removeEventListener("scroll", handleScroll);
      };
    },
    [handleLoadMore, hasNextPage]
  );
  console.log(state.trendingAnime.results
  );

  return (
    <div className="my-0 mx-auto grid relative grid-cols-[repeat(auto-fill,_minmax(10rem_1fr))]  grid-rows-auto gap-[2rem] duration-200 md:gap-6 sm:grid-cols-[repeat(auto-fill,_minmax(8rem,_1fr))] sm:gap-4 ">
      {animeData.map((anime) => (
        <CardItem key={anime.id} anime={anime} />
      ))}
    </div>
  );
}
