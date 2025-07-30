import "./App.css";
import Sidebar from "./components/UI/Sidebar";
import Titlebar from "./components/UI/Titlebar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Chords from "./pages/Tools/Chords";
import Metronome from "./pages/Tools/Metronome";

function App() {
  return (
    <BrowserRouter>
      <Titlebar />
      <section className="flex h-[calc(100vh)] w-full gap-x-2 pointer-fine:pt-8">
        <Sidebar />

        {/* Titlebar on mobile */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chords" element={<Chords />} />
          <Route path="/metronome" element={<Metronome />} />
        </Routes>
      </section>
    </BrowserRouter>
  );
}

export default App;
