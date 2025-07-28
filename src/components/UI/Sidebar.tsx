import { CaretLeft, List } from "phosphor-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

const Sidebar = (): JSX.Element => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <aside
      className={`mt-5 md:mt-0 p-2 border-r-1 border-[#2F2F2F] transition-[width] ${
        sidebarOpen ? "w-[calc(100vw*0.80)] md:w-[calc(100vw*0.25)]" : "w-10"
      }`}
    >
      {(sidebarOpen && (
        // Sidebar open
        <section>
          {/* Sidebar header */}
          <section className="flex justify-between items-center mb-2">
            <h1 className="font-semibold">Navigation</h1>

            <CaretLeft
              size={20}
              weight="bold"
              className="opacity-50 hover:opacity-100 cursor-pointer"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            />
          </section>

          {/* Groups */}
          <section>
            <NavLink to="/chords" className="custom-link">
              Chords
            </NavLink>
          </section>
        </section>
      )) || (
        // Sidebar closed
        <section className="flex justify-end items-center">
          <List
            size={25}
            weight="bold"
            className="opacity-50 hover:opacity-100 text-center cursor-pointer"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          />
        </section>
      )}
    </aside>
  );
};

export default Sidebar;
