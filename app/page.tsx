import Carousel from "@/components/Carousel";
import { EmblaOptionsType } from "embla-carousel";
import "./embla.css"

const OPTIONS: EmblaOptionsType = { loop: true };
const SLIDE_COUNT = 5;
const SLIDES = Array.from(Array(SLIDE_COUNT).keys());
export default function Home() {
  return (
    <main className="mx-auto w-full">
      <Carousel slides={SLIDES} options={OPTIONS} />
    </main>
  );
}
