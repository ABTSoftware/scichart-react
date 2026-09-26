import styles from "./page.module.css";
import Charts from "./Charts";

export default function Home() {
    return (
        <main className={styles.main}>
            <Charts />
        </main>
    );
}
