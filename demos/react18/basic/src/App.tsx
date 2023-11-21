import { SciChartSurface } from "scichart";
import { SciChartReact } from "scichart-react";

function App() {
    return (
        <div className="App">
            <SciChartReact
                initChart={async (divElement) => {
                    const { sciChartSurface } = await SciChartSurface.create(divElement);
                    return { sciChartSurface };
                }}
                style={{ width: 800, height: 600 }}
            />
        </div>
    );
}

export default App;
