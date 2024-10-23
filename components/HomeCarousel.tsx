"use client";
import Carousel from "@/components/Carousel";
import { EmblaOptionsType } from "embla-carousel";
import "../app/embla.css";
import axios from "axios";
import { useEffect, useState } from "react";
import SkeletonCover from "./SkeletonCover";

const OPTIONS: EmblaOptionsType = { loop: true };

export default function HomeCarousel() {
  const [coverImages, setCoverImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function fetch() {
    const url = `http://localhost:8000/meta/anilist/popular`;
    try {
      setIsLoading(true);
      const { data } = await axios.get(url, {
        params: { page: 1, perPage: 20 },
      });
      const coverArr = data.results.filter((obj: any) => obj.cover !== null);
      setCoverImages(coverArr);
      // for(let image in data.results)
      return data;
    } catch (error: any) {
      throw new Error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(function () {
    fetch();
  }, []);

  return (
    <div>
      {isLoading ? (
        <SkeletonCover />
      ) : (
        <Carousel slides={coverImages} options={OPTIONS} />
      )}
      {/* <button onClick={fetch}>testing the anime</button> */}
    </div>
  );
}
