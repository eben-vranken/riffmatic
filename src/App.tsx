import "./App.css";
import Sidebar from "./components/UI/Sidebar";
import Titlebar from "./components/UI/Titlebar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Chords from "./pages/Chords";

function App() {
  return (
    <BrowserRouter>
      <Titlebar />
      <section className="flex h-[calc(100vh-32px)] w-full gap-x-2 overflow-clip">
        <Sidebar />

        {/* Titlebar on mobile */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chords" element={<Chords />} />
        </Routes>
      </section>
    </BrowserRouter>
  );
}

export default App;
