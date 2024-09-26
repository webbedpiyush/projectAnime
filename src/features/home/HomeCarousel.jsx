/* eslint-disable no-unused-vars */

import { useNavigate } from "react-router-dom";
import SkeletonSlide from "../skeletons/SkeletonSlide";
import { Swiper, SwiperSlide } from "swiper/react";
import { FaPlay } from "react-icons/fa";
import { TbCards } from "react-icons/tb";
import { FaStar } from "react-icons/fa";
import { FaClock } from "react-icons/fa6";
import { useAnime } from "../../contexts/AnimeContext";
import "swiper/swiper-bundle.css";
import 'swiper/css/navigation';
import 'swiper/css/pagination';



export default function HomeCarousel() {
  const { state } = useAnime();
  const data = state.trendingAnime.results;
  const loading = state.loading.trending;
  const error = state.error;
  console.log(data, loading, error);
  const navigate = useNavigate();

  function handlePlayButtonClick(id) {
    navigate(`/watch/${id}`);
  }

  function trimTitle(title, maxLength, number = 40) {
    return title.length > maxLength
      ? `${title.substring(0, maxLength)}...`
      : title;
  }

  const validData = (Array.isArray(data) ? data : []).filter(
    (item) =>
      item.title &&
      item.title.english &&
      item.description &&
      item.cover !== item.image
  );
  console.log(validData);

  return (
    <>
      {loading || error ? (
        <SkeletonSlide />
      ) : (
        <div className="swiper-pagination">
          <span className="swiper-pagination-bullet bg-[#007bff)] opacity-70 mx-[3px]"></span>
          <span className="swiper-pagination-bullet-active bg-[#333] opacity-100"></span>
        </div>
      )}
      {loading || error ? (
        <SkeletonSlide />
      ) : (
        <Swiper
          spaceBetween={30}
          slidesPerView={1}
          loop={validData.length > 1}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          pagination={{
            el: ".swiper-pagination",
            clickable: true,
            dynamicBullets: true,
            type: "bullets",
          }}
          grabCursor={true}
          centeredSlides={true}
          className="relative max-w-full w-[100%] h-96 sm:h-80 rounded-lg cursor-grab"
        >
          {validData.map(
            ({
              id,
              cover,
              title,
              description,
              rating,
              totalEpisodes,
              duration,
              type,
            }) => (
              <SwiperSlide
                key={id}
                className="relative flex items-center animate-fadeIn"
              >
                <div className="relative w-full h-full rounded-lg">
                  <img
                    src={cover}
                    alt={title.english || title.romaji + " Banner Image"}
                    className="absolute w-full h-full object-cover rounded-lg"
                  />
                  <div className="flex flex-col justify-between h-full">
                    <div className="absolute left-8 bottom-6 z-10 max-w-[60%] sm:left-4 sm:bottom-6">
                      <h2 className="text-white text-2xl sm:text-xl font-bold truncate">
                        {trimTitle(title.english)}
                      </h2>
                      <div className="flex gap-2 text-white mt-2 text-sm sm:text-xs">
                        {type && <p className="flex gap-1">{type}</p>}
                        {totalEpisodes && (
                          <p className="flex gap-1">
                            <TbCards />
                            {totalEpisodes}
                          </p>
                        )}
                        {rating && (
                          <p className="flex gap-1">
                            <FaStar />
                            {rating}
                          </p>
                        )}
                        {duration && (
                          <p className="flex gap-1">
                            <FaClock />
                            {duration} mins
                          </p>
                        )}
                      </div>
                      <p
                        className="text-gray-300 mt-2 text-sm line-clamp-3"
                        dangerouslySetInnerHTML={{ __html: description }}
                      />
                    </div>
                    <div className="absolute right-8 bottom-6 z-10 flex justify-center items-center sm:right-6">
                      <button
                        onClick={() => handlePlayButtonClick(id)}
                        className="flex items-center gap-2 bg-blue-600 text-white rounded-lg px-6 py-3 hover:bg-blue-700 transition-transform transform hover:scale-105 sm:px-4 sm:py-2"
                      >
                        <FaPlay />
                        <span className="sm:hidden">WATCH NOW</span>
                      </button>
                    </div>
                  </div>
                  <div className="absolute inset-0 z-0 bg-gradient-to-tr from-black via-transparent to-transparent rounded-lg"></div>
                </div>
              </SwiperSlide>
            )
          )}
          <div className="swiper-pagination"></div>
        </Swiper>
      )}
    </>
  );
}
