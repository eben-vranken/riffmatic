import { CaretDown, CaretLeft, CaretRight, List } from "phosphor-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

const Sidebar = (): JSX.Element => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Groups open
  const [toolsOpen, setToolsOpen] = useState(false);

  const handleLinkClick = () => {
    const width = window.innerWidth

    if (width < 768) {
      setSidebarOpen(!sidebarOpen);
    }
  }

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

          {/*        */}
          {/* Groups */}
          {/*        */}

          {/* Tools */}
          <section>
            <h1
              className={`flex items-center gap-x-1 font-semibold mb-1 hover:opacity-75 cursor-pointer ${toolsOpen ? "opacity-100" : "opacity-80"
                }`}
              onClick={() => setToolsOpen(!toolsOpen)}
            >
              {
                toolsOpen && <CaretDown /> || <CaretRight />
              }
              Tools
            </h1>

            {
              toolsOpen && <ul className="flex flex-col [&>li]:ml-7">
                <li>
                  <NavLink
                    to="/tuner"
                    className="custom-link"
                    onClick={() => handleLinkClick()}
                  >
                    Tuner
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/metronome"
                    className="custom-link"
                    onClick={() => handleLinkClick()}
                  >
                    Metronome
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/fretboard"
                    className="custom-link"
                    onClick={() => handleLinkClick()}
                  >
                    Fretboard
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/chords"
                    className="custom-link"
                    onClick={() => handleLinkClick()}
                  >
                    Chord Library
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/scales"
                    className="custom-link"
                    onClick={() => handleLinkClick()}
                  >
                    Scale Library
                  </NavLink>
                </li>
              </ul>
            }
          </section>
        </section>
      )}
      {/* Sidebar closed */}
      <section
        className={`flex pt-2 flex-col items-center w-10 h-full border-r-1 bg-[#1e1e1e] border-[#2F2F2F] z-0 ${sidebarOpen ? "hidden" : ""
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
