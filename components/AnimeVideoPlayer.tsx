"use client";
import { useEffect, useRef, useState } from "react";
import {
  isHLSProvider,
  MediaPlayer,
  MediaProvider,
  Poster,
  type MediaCanPlayDetail,
  type MediaCanPlayEvent,
  type MediaPlayerInstance,
  type MediaProviderAdapter,
  type MediaProviderChangeEvent,
} from "@vidstack/react";
import axios from "axios";

interface AnimeVideoPlayerProps {
  image: string; // Expecting the image URL as a prop
}

export default function AnimeVideoPlayer({ image }: AnimeVideoPlayerProps) {
  const [src, setSrc] = useState("");
  const playerRef = useRef<MediaPlayerInstance | null>(null);

  // Fetch the video URL on mount
  useEffect(() => {
    const fetchVideo = async () => {
      const url = `http://localhost:8000/meta/anilist/watch/shingeki-no-kyojin-episode-1`;
      try {
        const { data } = await axios.get(url);
        const source = data.sources[3].url; // Adjust index based on actual data structure
        console.log(data);
        setSrc(source); // Set the video source
      } catch (error: any) {
        console.error("Error fetching video:", error.message);
      }
    };
    fetchVideo();
  }, []);

  // Event: Listen for provider change
  function onProviderChange(
    provider: MediaProviderAdapter | null,
    nativeEvent: MediaProviderChangeEvent
  ) {
    if (provider && isHLSProvider(provider)) {
      provider.config = {}; // Configure HLS provider as needed
    }
  }

  // Event: Handle `can-play` event
  function onCanPlay(
    detail: MediaCanPlayDetail,
    nativeEvent: MediaCanPlayEvent
  ) {
    console.log("Player is ready to play", detail);
  }

  return (
    <>
      {src.length > 0 && (
        <MediaPlayer
          className="relative lg:w-[600px] w-[350px] h-full bg-slate-900 text-white font-sans overflow-hidden rounded-md ring-media-focus data-[focus]:ring-4"
          title="Spy x Family Episode 1"
          src={src}
          crossOrigin="anonymous"
          playsInline
          onProviderChange={onProviderChange}
          onCanPlay={onCanPlay}
          ref={(player) => (playerRef.current = player)} // Set ref
        >
          <MediaProvider>
            <Poster
              className="absolute inset-0 block h-full w-full rounded-md opacity-0 transition-opacity data-[visible]:opacity-100 object-cover"
              src={image}
              alt="Spy x Family cover image"
            />
          </MediaProvider>
        </MediaPlayer>
      )}
    </>
  );
}
