import { CaretLeft, List } from "phosphor-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

const Sidebar = (): JSX.Element => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <aside>
      {sidebarOpen && (
        // Sidebar open
        <section className="p-2 w-[calc(100vw*0.80)] md:w-[calc(100vw*0.25)] fixed md:relative h-full z-20 border-r-1 bg-[#1e1e1e] border-[#2F2F2F]">
          {/* Sidebar header */}
          <section className="flex justify-between items-center mb-2">
            <h1 className="font-semibold">Riffmatic</h1>

            <CaretLeft
              size={20}
              weight="bold"
              className="opacity-50 hover:opacity-100 cursor-pointer"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            />
          </section>

          {/* Groups */}
          <section className="flex flex-col">
            <NavLink
              to="/chords"
              className="custom-link"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              Chords
            </NavLink>
            <NavLink
              to="/metronome"
              className="custom-link"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              Metronome
            </NavLink>
          </section>
        </section>
      )}
      {/* Sidebar closed */}
      <section
        className={`flex pt-2 flex-col items-center w-10 h-full border-r-1 bg-[#1e1e1e] border-[#2F2F2F] z-0 ${
          sidebarOpen ? "hidden" : ""
        }`}
      >
        <List
          size={25}
          weight="bold"
          className="opacity-50 hover:opacity-100 text-center cursor-pointer"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        />
      </section>
    </aside>
  );
};

export default Sidebar;
