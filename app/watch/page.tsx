"use client";
import AnimeVideoPlayer from "@/components/AnimeVideoPlayer";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);
  const [anime, setAnime] = useState({});
  const [image, setImage] = useState("");
  async function fetch() {
    // Get the appropriate search query
    const url = `http://localhost:8000/meta/anilist/info/16498`;
    console.log(url);
    try {
      setIsLoading(true);
      const { data } = await axios.get(url, {
        params: { provider: "gogoanime" },
      });
      // console.log(data.results);
      console.log(data);
      setImage(data.image);
      // setAnime(data.results);
    } catch (error: any) {
      throw new Error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  // Fetch data when selectedTab changes
  useEffect(() => {
    fetch();
  }, []);

  return (
    <>
      {isLoading ? (
        <div>Loading</div>
      ) : (
        <div>
          <AnimeVideoPlayer image={image} />
        </div>
      )}
    </>
  );
}
