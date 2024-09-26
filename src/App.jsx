import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Watch from "./pages/Watch";
import About from "./pages/About";
import { NotFound as Page404 } from "./pages/NotFound";

import Navbar from "./ui/Navbar";
import Footer from "./ui/Footer";
import { AnimeProvider } from "./contexts/AnimeContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import ShortcutsPopup from "./ui/ShortcutsPopup";

function App() {
  return (
    <>
      <AnimeProvider>
        <BrowserRouter>
          <ThemeProvider>
            <Navbar />
            <ShortcutsPopup />
            <div style={{ minHeight: "35rem" }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/watch/:animeId" element={<Watch />} />
                <Route
                  path="/watch/:animeId/:animeTitle/:episodeNumber"
                  element={<Watch />}
                />
                <Route path="/about" element={<About />} />
                {/* TODO : all the other stuff into the callback */}
                {/* <Route path='/callback' element={<Callback />} /> */}
                <Route path="*" element={<Page404 />} />
              </Routes>
            </div>
            <Footer />
          </ThemeProvider>
        </BrowserRouter>
      </AnimeProvider>
    </>
  );
}

export default App;
