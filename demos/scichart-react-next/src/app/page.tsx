import styles from "./page.module.css";
import ChartExample from "./ChartExample";

export default function Home() {
    return (
        <main className={styles.main}>
            <ChartExample />
        </main>
    );
}
