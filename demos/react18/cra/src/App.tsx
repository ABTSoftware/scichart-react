import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { SciChartReact } from "scichart-react";

function App() {
    return (
        <div className="App">
            <SciChartReact config={{}} style={{ width: 800, height: 600 }} />
        </div>
    );
}

export default App;
