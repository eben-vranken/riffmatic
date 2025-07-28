// Tauri API
import { getCurrentWindow } from "@tauri-apps/api/window";

// Phosphor icons
import { CaretLeft, CaretRight } from "phosphor-react";

const Titlebar = (): JSX.Element => {
  const appWindow = getCurrentWindow();

  const minimize = () => {
    appWindow.minimize();
  };

  const maximize = () => {
    appWindow.toggleMaximize();
  };

  const close = () => {
    appWindow.close();
  };

  return (
    <section
      className="hidden md:flex justify-between items-center select-none h-8 border-b-1 border-[#2F2F2F] px-2"
      data-tauri-drag-region
    >
      {/* Page control */}
      <section className="flex flex-0 opacity-50">
        <CaretLeft size={20} />
        <CaretRight size={20} />
      </section>

      {/* Title */}
      <h1 className="font-bold pointer-events-none flex-1 text-center ">
        Riffmatic
      </h1>

      {/* Window Actions */}
      <section className="flex gap-x-2 flex-0">
        <div
          className="w-4 aspect-square rounded-full bg-green-500 hover:opacity-75 cursor-pointer"
          onClick={() => minimize()}
        ></div>
        <div
          className="w-4 aspect-square rounded-full bg-yellow-500 hover:opacity-75 cursor-pointer"
          onClick={() => maximize()}
        ></div>
        <div
          className="w-4 aspect-square rounded-full bg-red-500 hover:opacity-75 cursor-pointer"
          onClick={() => close()}
        ></div>
      </section>
    </section>
  );
};

export default Titlebar;
