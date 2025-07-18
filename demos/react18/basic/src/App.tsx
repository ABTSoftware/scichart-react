import { StrictMode } from "react";
import { SciChartMemoryDebugWrapper, SciChartReact } from "scichart-react";

function App() {
    return (
        <div className="App">
            <StrictMode>
                <SciChartMemoryDebugWrapper>
                    <SciChartReact config={{}} style={{ width: 800, height: 600 }} />
                </SciChartMemoryDebugWrapper>
            </StrictMode>
        </div>
    );
}

export default App;
