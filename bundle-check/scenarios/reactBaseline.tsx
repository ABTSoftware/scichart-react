// The React floor: react-dom rendering a plain div, no scichart-react at all.
// Subtract this from any other scenario to see the scichart-react + scichart cost alone.
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")!).render(<div>baseline</div>);
