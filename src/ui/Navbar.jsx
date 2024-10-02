/* eslint-disable react/no-unknown-property */
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { fetchAdvancedSearch } from "../hooks/useApi";
import { IoIosSearch } from "react-icons/io";
import { FiSun, FiMoon, FiX } from "react-icons/fi";
import { GoCommandPalette } from "react-icons/go";
import DropDownSearch from "./DropDownSearch";

function detectUserTheme() {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return true;
  }
  return false;
}

function saveThemePreference(isDarkMode) {
  localStorage.setItem("themePreference", isDarkMode ? "dark" : "light");
}

function getInitialThemePreference() {
  const storedTheme = localStorage.getItem("themePreference");

  if (storedTheme) {
    return storedTheme === "dark";
  }

  return detectUserTheme();
}
export default function Navbar() {
  // eslint-disable-next-line no-unused-vars
  const [isPadding, setIsPadding] = useState(false);
  const inputContainer = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [inputContainerWidth, setInputContainerWidth] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const inputRef = useRef(null);
  const navbarRef = useRef(null);
  const dropdownRef = useRef(null);
  const [searchResults, setSearchResults] = useState([]);
  const debounceTimeout = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [search, setSearch] = useState({
    isSearchFocused: false,
    searchQuery: searchParams.get("query") || "",
    isDropdownOpen: false,
  });
  const [isInputVisible, setIsInputVisible] = useState(true);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 500);

  async function fetchSearchResults(query) {
    if (!query.trim()) return;

    try {
      const fetchedData = await fetchAdvancedSearch(query, 1, 5); // Fetch first 5 results for the dropdown
      const formattedResults = fetchedData.results.map((anime) => ({
        id: anime.id, // Make sure to include the ID field
        title: anime.title,
        image: anime.image,
        type: anime.type,
        totalEpisodes: anime.totalEpisodes,
        rating: anime.rating,
      }));
      setSearchResults(formattedResults);
    } catch (error) {
      console.error("Failed to fetch search results:", error);
      setSearchResults([]);
    }
  }

  function handleCloseDropdown() {
    setSearch((prev) => ({ ...prev, isDropdownOpen: false }));
  }

  function handleClickOutside(e) {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      handleCloseDropdown();
    }
  }

  useEffect(function () {
    document.addEventListener("mousedown", handleClickOutside);

    return function () {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  const [isDarkMode, setIsDarkMode] = useState(getInitialThemePreference());

  const toggleTheme = useCallback(() => {
    const newIsDarkMode = !isDarkMode;
    setIsDarkMode(newIsDarkMode);
    saveThemePreference(newIsDarkMode);
  }, [isDarkMode, setIsDarkMode]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "/" && inputRef.current) {
        e.preventDefault();
        inputRef.current.focus();
        setSearch((prevState) => ({
          ...prevState,
          isSearchFocused: true,
        }));
      } else if (e.key === "Escape" && inputRef.current) {
        inputRef.current.blur();
        setSearch((prevState) => ({
          ...prevState,
          isSearchFocused: false,
        }));
        handleCloseDropdown();
      } else if (e.shiftKey && e.key.toLowerCase() === "d") {
        if (document.activeElement !== inputRef.current) {
          e.preventDefault();
          toggleTheme();
        }
      }
    },
    [toggleTheme]
  );

  useEffect(
    function () {
      const listener = handleKeyDown;
      document.addEventListener("keydown", listener);

      return function () {
        document.removeEventListener("keydown", listener);
      };
    },
    [handleKeyDown]
  );

  useEffect(() => {
    setSearch({ ...search, searchQuery: searchParams.get("query") || "" });
  }, [searchParams]);

  const navigateWithQuery = useCallback(
    (value) => {
      if (location.pathname == "/search") {
        const params = new URLSearchParams();

        params.set("query", value);
        setSearchParams(params, { replace: true });
      } else {
        navigate(value ? `/search?query=${value}` : "/search");
      }
    },
    [navigate, location.pathname, setSearchParams]
  );

  function handleInputChange(e) {
    const newValue = e.target.value;
    setSearch({ ...search, searchQuery: newValue });

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      fetchSearchResults(newValue);
      setSearch((prevState) => ({
        ...prevState,
        isDropdownOpen: true,
      }));
    }, 300);
  }

  function handleKeyDownInput(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex !== null && searchResults[selectedIndex]) {
        const animeId = searchResults[selectedIndex].id;
        navigate(`/watch/${animeId}`);
        handleCloseDropdown();
      } else {
        navigateWithQuery(search.searchQuery);
      }
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      setSearch((prevState) => ({
        ...prevState,
        isDropdownOpen: false,
      }));
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  }

  useEffect(function () {
    function updateWidth() {
      if (inputContainer.current) {
        setInputContainerWidth(inputContainer.current.offsetWidth);
      }
    }

    updateWidth();

    window.addEventListener("resize", updateWidth);

    return function () {
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  useEffect(
    function () {
      if (isMobileView) {
        setIsInputVisible(false);
      }
    },
    [location.pathname, isMobileView]
  );

  function handleClearSearch() {
    setSearch((prevState) => ({
      ...prevState,
      searchQuery: "",
    }));
    setSearchResults([]);
    setSearch((prevState) => ({
      ...prevState,
      isDropdownOpen: false,
    }));
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  useEffect(function () {
    function handleResize() {
      setIsMobileView(window.innerWidth < 500);
    }

    window.addEventListener("resize", handleResize);

    return function () {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <div
        className="fixed top-0 left-0 right-0 text-center m-0 p-[1rem] bg-[rgba(224, 224, 224, 0.5)] backdrop-blur-[10px] z-10 animate-[fadeIn('rgba(224, 224, 224, 0.5)')_0.5s_ease-in-out] transition duration-[500] ease-in-out py-[1rem] px-[0.5rem]"
        ref={navbarRef}
      >
        <div className="max-w-[105rem] m-auto">
          <div className="flex gap-[0.5rem] items-center justify-between">
            <Link
              className="w-[7rem] text-[1.2rem] font-bold no-underline cursor-pointer text-[#333] transition duration-[200] ease-in-out hover:text-black hover:scale-[1.05] focus:text-black focus:scale-[1.05] active:text-black active:scale-[1.05] max-w-[6rem]"
              to="/home"
              onClick={() => window.scrollTo(0, 0)}
            >
              LOGO HERE
            </Link>
            {!isMobileView && (
              <div
                className={`flex flex-1 max-w-[35rem] h-[1.2rem] items-center p-[0.6rem] rounded-[0.3rem] bg-[#333] animate-[fadeIn_0.1s_ease-in-out] md:max-w-[30rem] max-w-[100%] mt-[1rem] ${
                  isInputVisible ? "flex" : "hidden"
                }`}
                ref={inputContainer}
              >
                <div
                  className={`m-0 py-0 px-[0.25rem] text-[#fff] ${
                    search.isSearchFocused ? "opacity-100" : "opacity-50"
                  } text-[1.2rem] max-h-[100%] flex items-center`}
                >
                  <IoIosSearch />
                </div>

                <input
                  className="bg-transparent border-none text-[#fff] inline-block text-[0.85rem] outline-0 p-0 max-h-[100%] flex items-center pt-0 w-[100%] transition duration-[200] ease-in-out"
                  type="text"
                  placeholder="Search Anime"
                  value={search.searchQuery}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDownInput}
                  onFocus={() => {
                    setSearch((prevState) => ({
                      ...prevState,
                      isDropdownOpen: true,
                      isSearchFocused: true,
                    }));
                  }}
                  ref={inputRef}
                />

                <DropDownSearch
                  searchResults={searchResults}
                  onClose={handleCloseDropdown}
                  isVisible={search.isDropdownOpen}
                  selectedIndex={selectedIndex}
                  setSelectedIndex={setSelectedIndex}
                  searchQuery={search.searchQuery}
                  containerWidth={inputContainerWidth}
                />
                <button
                  className={`bg-transparent border-none text-[#333] text-[1.2rem] cursor-pointer ${
                    search.searchQuery ? "opacity-[0.5rem]" : "opacity-0"
                  } ${
                    search.searchQuery ? "visible" : "hidden"
                  } max-h-[100%] flex items-center hover:text-[#333] hover:opacity-100`}
                  onClick={handleClearSearch}
                >
                  <FiX />
                </button>
                {/* <div
                  className={`m-0 py-0 px-[0.25rem] text-[#333] ${
                    search.isSearchFocused ? "opacity-100" : "opacity-50"
                  } text-[1.2rem] max-h-[100%] flex items-center`}
                >
                  <GoCommandPalette />
                </div> */}
              </div>
            )}
            <div className="flex items-center h-[2rem] gap-[0.5rem]">
              {isMobileView && (
                <button
                  className={`bg-transparent bg-[#e0e0e0] text-[#333] text-[1.2rem] cursor-pointer py-[1.2rem] px-[0.6rem] flex items-center justify-center rounded-[0.3rem] w-[100%] h-[100%] border-none active:scale-90 `}
                  onClick={() => {
                    setIsInputVisible((prev) => !prev);
                    setIsPadding((prev) => !prev);
                  }}
                >
                  <IoIosSearch />
                </button>
              )}
              <button
                className={`bg-transparent bg-[#e0e0e0] text-[#333] text-[1.2rem] cursor-pointer py-[1.2rem] px-[0.6rem] flex items-center justify-center rounded-[0.3rem] w-[100%] h-[100%] border-none active:scale-90 `}
                onClick={toggleTheme}
              >
                {isDarkMode ? <FiSun /> : <FiMoon />}
              </button>
            </div>
          </div>
          {isMobileView && isInputVisible && (
            <div
              className={`flex flex-1 max-w-[35rem] h-[1.2rem] items-center p-[0.6rem] rounded-[0.3rem] bg-[#333] animate-[fadeIn_0.1s_ease-in-out] md:max-w-[30rem] max-w-[100%] mt-[1rem] ${
                isInputVisible ? "flex" : "none"
              }`}
            >
              <div
                className={`m-0 py-0 px-[0.25rem] text-[#333] ${
                  search.isSearchFocused ? "opacity-100" : "opacity-50"
                } text-[1.2rem] max-h-[100%] flex items-center`}
              >
                <IoIosSearch />
              </div>
              <input
                className="bg-transparent border-none text-[#333] inline-block text-[0.85rem] outline-0 p-0 max-h-[100%] flex items-center pt-0 w-[100%] transition duration-[200] ease-in-out"
                type="text"
                placeholder="Search Anime"
                value={search.searchQuery}
                onChange={handleInputChange}
                onKeyDown={handleKeyDownInput}
                onFocus={() => {
                  setSearch((prevState) => ({
                    ...prevState,
                    isDropdownOpen: true,
                    isSearchFocused: true,
                  }));
                }}
                ref={inputRef}
              />
              <DropDownSearch
                searchResults={searchResults}
                onClose={handleCloseDropdown}
                isVisible={search.isDropdownOpen}
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex}
                searchQuery={search.searchQuery}
                containerWidth={inputContainerWidth}
              />
              <button
                className={`bg-transparent border-none text-[#333] text-[1.2rem] cursor-pointer ${
                  search.searchQuery ? "opacity-[0.5rem]" : "opacity-0"
                } ${
                  search.searchQuery ? "visible" : "hidden"
                } max-h-[100%] flex items-center hover:text-[#333] hover:opacity-100`}
                onClick={handleClearSearch}
              >
                <FiX />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
