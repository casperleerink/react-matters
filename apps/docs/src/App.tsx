import { useState, useEffect } from "react";
import Landing from "./pages/Landing";
import DynamicBodies from "./pages/DynamicBodies";
import PropertyUpdates from "./pages/PropertyUpdates";
import Constraints from "./pages/Constraints";
import CollisionFilters from "./pages/CollisionFilters";
import Sensors from "./pages/Sensors";

function App() {
  const [route, setRoute] = useState(
    window.location.hash.slice(1) || "home"
  );

  useEffect(() => {
    const onHashChange = () => {
      setRoute(window.location.hash.slice(1) || "home");
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  switch (route) {
    case "dynamic-bodies":
      return <DynamicBodies />;
    case "property-updates":
      return <PropertyUpdates />;
    case "constraints":
      return <Constraints />;
    case "collision-filters":
      return <CollisionFilters />;
    case "sensors":
      return <Sensors />;
    default:
      return <Landing />;
  }
}

export default App;
