import { useEffect, useState } from "react";
import useGetChords from "../hooks/chords/useGetChords";
import { ChordTabs } from "../components/Guitar/ChordTabs";

interface Chord {
  name: string;
  type: string;
  strings: string;
  tag: string;
  barre: null | number;
}

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

const Chords = (): JSX.Element => {
  const [chords, setChords] = useState<Chord[]>([]);
  const [chordFilters, setChordFilters] = useState<string[]>([...chordTypes]);
  const [chordSearchName, setChordSearchName] = useState<string>("");

  useEffect(() => {
    console.log(chordFilters);
    const chords = useGetChords({
      chord_name: chordSearchName,
      types: chordFilters,
    });

    setChords(chords);

    console.log(chords);
  }, [chordFilters, chordSearchName]);

  const allSelected =
    chordFilters.length === chordTypes.length || chordSearchName != "";

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

  const handleSearchByName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChordSearchName(e.currentTarget.value);
  };

  return (
    <main className="p-2 pb-0 flex flex-col gap-y-2 w-full">
      <h1 className="font-bold">Chord List</h1>

      {/* Search by name */}
      <input
        type="text"
        className="custom-input w-52"
        placeholder="Search for a chord..."
        onChange={(e) => handleSearchByName(e)}
      />

      {/* Filter List */}
      <section className="flex gap-x-2 text-sm flex-wrap pr-16">
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
              chordFilters.includes(type) || chordSearchName != ""
                ? "opacity-100 underline"
                : "opacity-50"
            }`}
            onClick={() => handleFilter(type)}
          >
            {type}
          </span>
        ))}
      </section>

      {/* Chords */}
      <section className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 overflow-y-auto">
        {chords.map((chord, i) => {
          return (
            <section key={i} className="bg-white/5 rounded flex flex-col p-3">
              <h1 className="font-bold w-full text-center">{chord.name}</h1>

              <section className="flex items-center justify-center">
                <ChordTabs tabs={chord.strings} barre={chord.barre} />
              </section>
            </section>
          );
        })}
      </section>
    </main>
  );
};

export default Chords;
