"use client";
import React, { useEffect, useState } from "react";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import {
  NextButton,
  PrevButton,
  usePrevNextButtons,
} from "./Carouselarrowbutton";
import { Button } from "./ui/button";

interface AnimeProps {
  cover: string;
}

const text = `This is a story about Momo, a high school girl who comes
                    from a family of spirit mediums, and her classmate Okarun,
                    an occult fanatic. After Momo rescues Okarun from being
                    bullied, they begin talking. However, an argument ensues
                    between them since Momo believes in ghosts but denies aliens
                    exist, and Okarun believes in aliens but denies ghosts
                    exist. To prove to each other what they believe in is real,
                    Momo goes to an abandoned hospital where a UFO has been
                    spotted and Okarun goes to a tunnel rumored to be haunted.
                    To their surprise, they each encounter overwhelming
                    paranormal activities that transcend comprehension. Amid
                    these predicaments, Momo awakens her hidden power and Okarun
                    gains the power of a curse to overcome these new dangers!
                    Their fateful love begins as well!? The story of the occult
                    battle and adolescence starts! Notes: - Worldwide premiere
                    of Episode 1 before the Japanese television premiere
                    occurred at Anime Expo July 6, 2024. - Episodes 1-3 titled
                    as DAN DA DAN: FIRST ENCOUNTER was pre-screened in advance
                    in theaters on August 31, 2024 in Asia, September 7, 2024 in
                    Europe and September 13, 2024 in North America. The regular
                    TV broadcast begins October 2024.`;

type PropType = {
  slides: string[];
  options?: EmblaOptionsType;
};

function truncateText(text: string) {
  const maxLength = 300;

  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }

  return text;
}

const Carousel: React.FC<PropType> = (props) => {
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [
    Autoplay({ playOnInit: true, delay: 8000 }), // Start autoplay on init
  ]);
  const [isPlaying, setIsPlaying] = useState(true); // Start as playing
  const [selectedIndex, setSelectedIndex] = useState(0);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  useEffect(() => {
    const autoplay = emblaApi?.plugins()?.autoplay;
    if (!autoplay) return;

    setIsPlaying(autoplay.isPlaying());
    emblaApi
      .on("autoplay:play", () => setIsPlaying(true))
      .on("autoplay:stop", () => setIsPlaying(false))
      .on("reInit", () => setIsPlaying(autoplay.isPlaying()));
  }, [emblaApi]);

  useEffect(
    function () {
      if (!emblaApi) return;
      function onSelect() {
        setSelectedIndex(emblaApi?.selectedScrollSnap()!);
      }
      emblaApi.on("select", onSelect);
      onSelect();
    },
    [emblaApi]
  );

  return (
    <div className="embla relative">
      <div className="embla__viewport rounded-xl" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((anime, index) => (
            <div className="embla__slide" key={index}>
              <div className="embla__slide__number relative">
                <img
                  src={anime.cover}
                  className="object-cover w-full h-full"
                  alt={`Slide ${index + 1}`}
                  style={{
                    position: "relative",
                  }}
                />
                <div
                  className="absolute inset-0 flex flex-col justify-end p-6"
                  style={{
                    backgroundImage: `linear-gradient(90deg, rgba(0, 0, 0, 0.5) 10%, transparent 100%)`, // Change to 90deg
                  }}
                >
                  <h2 className={`text-[22px] md:text-[40px] font-bold mb-3`}
                  style={{color : anime.color}}>
                    {anime.title.english}
                  </h2>
                  <p className="text-gray-300 text-xs hidden lg:block lg:text-xs max-w-[50%] overflow-auto">
                    {truncateText(anime.description)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="embla__button-container">
        <PrevButton
          onClick={onPrevButtonClick}
          disabled={prevBtnDisabled}
          className="embla__button hover:text-stone-800 hover:bg-slate-300"
        />
        <NextButton
          onClick={onNextButtonClick}
          disabled={nextBtnDisabled}
          className="embla__button hover:text-stone-800 hover:bg-slate-300"
        />
      </div>
      <div className="absolute flex gap-4 z-10 right-2 sm:right-4 sm:bottom-4 bottom-2 ">
        <Button className="  text-gray-200 p-1 sm:p-2 rounded-xl backdrop-filter opacity-80 bg-slate-800 hover:text-stone-800 hover:bg-slate-300">
          DETAILS
        </Button>
        <Button className=" text-gray-200 p-1 sm:p-2 rounded-xl backdrop-filter opacity-80 bg-slate-800 hover:text-stone-800 hover:bg-slate-300">
          WATCH NOW
        </Button>
      </div>
    </div>
  );
};

export default Carousel;
