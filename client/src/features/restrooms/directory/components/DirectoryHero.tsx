import styles from "../../../../assets/styles/directory.module.css";

export function DirectoryHero() {
	return (
		<section className={styles.hero}>
			<h1 className={styles.heroTitle}>Browse Restrooms</h1>
			<p className={styles.heroSubtitle}>
				Curated loos across Mapúa Intramuros
			</p>
		</section>
	);
}
