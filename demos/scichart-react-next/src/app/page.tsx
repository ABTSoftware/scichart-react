import styles from "./page.module.css";
import ChartExample from "./ChartExample";
import Surface3DChart from "./Surface3DChart";

export default function Home() {
    return (
        <main className={styles.main}>
            {/* 2D, built from a JSON definition through the Builder API */}
            <ChartExample />
            {/* 3D, built imperatively - it also pulls the charting3d wasm side module */}
            <Surface3DChart />
        </main>
    );
}
