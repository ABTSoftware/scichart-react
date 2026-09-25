import { StrictMode } from "react";
import { SciChartDeclarative, SciChartMemoryDebugWrapper } from "scichart-react";

function App() {
    return (
        <div className="App">
            <StrictMode>
                <SciChartMemoryDebugWrapper>
                    <SciChartDeclarative config={{}} style={{ width: 800, height: 600 }} />
                </SciChartMemoryDebugWrapper>
            </StrictMode>
        </div>
    );
}

export default App;
