import Chords from "../../data/chords.json"

interface Chord {
    name: string;
    type: string;
    strings: string;
    tag: string;
    barre: null | number;
}

interface ChordFilters {
    chord_name: string;
    types: string[];
}

const useGetChords = ({chord_name, types }: ChordFilters): Chord[] => {
    const chords: Chord[] = JSON.parse(JSON.stringify(Chords)).chords;

    console.log(chords);

    if (chord_name !== "") {
        return chords.filter((chord) =>
            chord.name.toLowerCase().includes(chord_name.toLowerCase())
        );
    } else if (types.length !== 0 && types.length > 0) {
        return chords.filter((chord) => types.includes(chord.tag));
    } else {
        return [];
    }
};

export default useGetChords;
