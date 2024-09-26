/* eslint-disable react/prop-types */
import { useAnime } from "../../contexts/AnimeContext";

function SkeletonSlides({ loading, children }) {
  return (
    <div className="bg-[ rgba(165, 165, 165, 0.1)] rounded-[0.3rem]">
      <div
        className={`bg-gray-200 w-full ${
          !loading ? "animate-pulse" : ""
        } h-[24rem] md:h-[20rem] sm:h-[18rem]`}
      >
        {children}
      </div>
    </div>
  );
}
function SkeletonImage() {
  return (
    <div className="bg-[ rgba(165, 165, 165, 0.1)] rounded-[0.3rem] w-full h-full"></div>
  );
}

export default function SkeletonSlide() {
  const { state } = useAnime();
  const loading =
    state.loading.trending ||
    state.loading.popular ||
    state.loading.topRated ||
    state.loading.Upcoming ||
    state.loading.topAiring;
  return (
    <SkeletonSlides loading={loading}>
      <SkeletonImage />
    </SkeletonSlides>
  );
}
