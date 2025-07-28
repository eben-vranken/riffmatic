import "./App.css";
import Titlebar from "./components/UI/Titlebar";

function App() {
  const titlebar = {
    title: "Saga"
  }

  return (
    <main>
      {/* Titlebar on mobile */}
      <Titlebar title={titlebar.title}/>
    </main>
  );
}

export default App;
