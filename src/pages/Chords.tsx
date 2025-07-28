import { useState } from "react";

const Chords = (): JSX.Element => {
  const chordTypes = [
    "Triads",
    "7ths",
    "Extended",
    "Altered",
    "Add/6",
    "Sus/5",
    "Slash",
    "Sym/Q4",
    "Poly/UST",
  ];

  const [chordFilters, setChordFilters] = useState<string[]>([...chordTypes]);

  const allSelected = chordFilters.length === chordTypes.length;

  const handleFilter = (chordType: string) => {
    setChordFilters((prev) =>
      prev.includes(chordType)
        ? prev.filter((c) => c !== chordType)
        : [...prev, chordType]
    );
  };

  const handleSetAll = () => {
    setChordFilters(allSelected ? [] : [...chordTypes]);
  };

  return (
    <main className="p-2 flex flex-col w-full">
      <h1 className="font-bold">Chord List</h1>

      {/* Filter List */}
      <section className="w-full overflow-x-auto">
        <div className="flex gap-x-2 text-sm mt-3 overflow-x-scroll whitespace-nowrap px-2 pr-16">
          <span
            className={`cursor-pointer ${
              allSelected ? "opacity-100" : "opacity-50"
            }`}
            onClick={handleSetAll}
          >
            All
          </span>

          {chordTypes.map((type) => (
            <span
              key={type}
              className={`cursor-pointer ${
                chordFilters.includes(type) ? "opacity-100" : "opacity-50"
              }`}
              onClick={() => handleFilter(type)}
            >
              {type}
            </span>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Chords;
