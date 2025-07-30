import { getCurrentWindow } from "@tauri-apps/api/window";
import { useNavigate, useLocation } from "react-router-dom";
import { CaretLeft, CaretRight } from "phosphor-react";
import { useEffect, useState } from "react";

const Titlebar = (): JSX.Element => {
  const appWindow = getCurrentWindow();
  const navigate = useNavigate();
  const location = useLocation();
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [history, setHistory] = useState<string[]>([location.pathname]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const current = location.pathname;
    setHistory((prev) => {
      const newHistory = [...prev.slice(0, index + 1), current];
      setIndex(newHistory.length - 1);
      return newHistory;
    });
  }, [location.pathname]);

  useEffect(() => {
    setCanGoBack(index > 0);
    setCanGoForward(index < history.length - 1);
  }, [index, history]);

  const goBack = () => {
    if (canGoBack) {
      const newIndex = index - 1;
      setIndex(newIndex);
      navigate(history[newIndex]);
    }
  };

  const goForward = () => {
    if (canGoForward) {
      const newIndex = index + 1;
      setIndex(newIndex);
      navigate(history[newIndex]);
    }
  };

  return (
    <section
      className="titlebar fixed flex w-full bg-[#1E1E1E] justify-between items-center select-none h-8 border-b border-[#2F2F2F] px-2"
      data-tauri-drag-region
    >
      <section className="flex flex-0 gap-x-1">
        <CaretLeft
          size={20}
          onClick={goBack}
          className={`${canGoBack ? "opacity-75 cursor-pointer" : "opacity-30 cursor-default"}`}
        />
        <CaretRight
          size={20}
          onClick={goForward}
          className={`${canGoForward ? "opacity-75 cursor-pointer" : "opacity-30 cursor-default"}`}
        />
      </section>

      <h1 className="font-bold pointer-events-none flex-1 text-center text-(--primary)">
        Riffmatic
      </h1>

      <section className="flex gap-x-2 flex-0">
        <div
          className="w-4 aspect-square rounded-full bg-green-500 hover:opacity-75 cursor-pointer"
          onClick={() => appWindow.minimize()}
        />
        <div
          className="w-4 aspect-square rounded-full bg-yellow-500 hover:opacity-75 cursor-pointer"
          onClick={() => appWindow.toggleMaximize()}
        />
        <div
          className="w-4 aspect-square rounded-full bg-red-500 hover:opacity-75 cursor-pointer"
          onClick={() => appWindow.close()}
        />
      </section>
    </section>
  );
};

export default Titlebar;
