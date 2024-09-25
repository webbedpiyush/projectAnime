import { year } from "./useTime";

export const anyOption = {
  value: "",
  label: "Any",
};

export const genreOptions = [
  { value: "Action", label: "Action" },
  { value: "Adventure", label: "Adventure" },
  { value: "Comedy", label: "Comedy" },
  { value: "Drama", label: "Drama" },
  { value: "Fantasy", label: "Fantasy" },
  { value: "Horror", label: "Horror" },
  { value: "Mahou Shoujo", label: "Mahou Shoujo" },
  { value: "Mecha", label: "Mecha" },
  { value: "Music", label: "Music" },
  { value: "Mystery", label: "Mystery" },
  { value: "Psychological", label: "Psychological" },
  { value: "Romance", label: "Romance" },
  { value: "Sci-Fi", label: "Sci-Fi" },
  { value: "Slice of Life", label: "Slice of Life" },
  { value: "Sports", label: "Sports" },
  { value: "Supernatural", label: "Supernatural" },
  { value: "Thriller", label: "Thriller" },
];

export const yearOptions = [
  anyOption,
  { value: String(year + 1), label: String(year + 1) },
  ...Array.from({ length: year - 1939 }, (_, i) => ({
    value: String(year - i),
    label: String(year - i),
  })),
];

export const seasonOptions = [
  anyOption,
  { value: "WINTER", label: "Winter" },
  { value: "SPRING", label: "Spring" },
  { value: "SUMMER", label: "Summer" },
  { value: "FALL", label: "Fall" },
];

export const formatOptions = [
  anyOption,
  { value: "TV", label: "TV" },
  { value: "TV_SHORT", label: "TV Short" },
  { value: "OVA", label: "OVA" },
  { value: "ONA", label: "ONA" },
  { value: "MOVIE", label: "Movie" },
  { value: "SPECIAL", label: "Special" },
  { value: "MUSIC", label: "Music" },
];

export const statusOptions = [
  anyOption,
  { value: "RELEASING", label: "Airing" },
  { value: "NOT_YET_RELEASED", label: "Not Yet Aired" },
  { value: "FINISHED", label: "Finished" },
  { value: "CANCELLED", label: "Cancelled" },
];

export const sortOptions = [
  { value: "POPULARITY_DESC", label: "Popularity" },
  { value: "TRENDING_DESC", label: "Trending" },
  { value: "SCORE_DESC", label: "Rating" },
  { value: "FAVOURITES_DESC", label: "Favorites" },
  { value: "EPISODES_DESC", label: "Episodes" },
  { value: "ID_DESC", label: "ID" },
  { value: "UPDATED_AT_DESC", label: "Last Updated" },
  { value: "START_DATE_DESC", label: "Start Date" },
  { value: "END_DATE_DESC", label: "End Date" },
  { value: "TITLE_ROMAJI_DESC", label: "Title (Romaji)" },
  { value: "TITLE_ENGLISH_DESC", label: "Title (English)" },
  { value: "TITLE_NATIVE_DESC", label: "Title (Native)" },
];
