import { RotateCcw, Search } from "lucide-react";
import { type CSSProperties, useEffect, useState } from "react";
import styles from "../../../../assets/styles/filterSidebar.module.css";
import {
	BUILDINGS,
	GENDER_LABELS,
	GENDERS,
	RESTROOM_TAGS,
	TAG_LABELS,
} from "../../types";
import { isFilterActive, resetFilters } from "../directoryLogic";
import {
	DEFAULT_DIRECTORY_SEARCH,
	type DirectorySearch,
	type MinRating,
	SORT_OPTIONS,
	type SortKey,
} from "../searchParams";

const SEARCH_DEBOUNCE_MS = 250;

export type FilterPanelProps = {
	search: DirectorySearch;
	counts: {
		building: Record<string, number>;
		tag: Record<string, number>;
	};
	suggestions: string[];
	onChange: (patch: Partial<DirectorySearch>) => void;
	/** "sidebar" (desktop) or "drawer" (mobile) — adjusts spacing/sizes. */
	variant?: "sidebar" | "drawer";
};

function toggleValue<T>(list: readonly T[], value: T): T[] {
	return list.includes(value)
		? list.filter((item) => item !== value)
		: [...list, value];
}

export function FilterPanel({
	search,
	counts,
	suggestions,
	onChange,
	variant = "sidebar",
}: FilterPanelProps) {
	const [queryValue, setQueryValue] = useState(search.q);
	const [showSuggestions, setShowSuggestions] = useState(false);

	useEffect(() => {
		setQueryValue(search.q);
	}, [search.q]);

	useEffect(() => {
		if (queryValue === search.q) {
			return;
		}
		const timer = setTimeout(
			() => onChange({ q: queryValue }),
			SEARCH_DEBOUNCE_MS,
		);
		return () => clearTimeout(timer);
	}, [queryValue, search.q, onChange]);

	const activeSuggestions =
		showSuggestions && search.q.trim() !== "" ? suggestions : [];

	const sliderFill = ((search.minRating - 1) / 4) * 100;

	const panelClass = variant === "drawer" ? styles.panelDrawer : styles.panel;

	return (
		<div className={panelClass}>
			{/* Sort order */}
			<div className={styles.section}>
				<label className={styles.sectionLabel} htmlFor="directory-sort">
					Sort Order
				</label>
				<select
					id="directory-sort"
					className={styles.select}
					value={search.sort}
					onChange={(event) =>
						onChange({ sort: event.target.value as SortKey })
					}
				>
					{SORT_OPTIONS.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
			</div>

			{/* Search */}
			<div className={styles.section}>
				<label className={styles.sectionLabel} htmlFor="directory-search">
					Search
				</label>
				<div className={styles.searchGroup}>
					<Search className={styles.searchIcon} aria-hidden="true" />
					<input
						id="directory-search"
						type="text"
						role="combobox"
						aria-autocomplete="list"
						aria-controls="directory-search-suggestions"
						aria-expanded={activeSuggestions.length > 0}
						className={styles.searchInput}
						placeholder="Search name or building…"
						value={queryValue}
						onChange={(event) => setQueryValue(event.target.value)}
						onFocus={() => setShowSuggestions(true)}
						onBlur={(event) => {
							if (
								!event.currentTarget.parentElement?.contains(
									event.relatedTarget,
								)
							) {
								setShowSuggestions(false);
							}
						}}
					/>
					{activeSuggestions.length > 0 && (
						<div
							id="directory-search-suggestions"
							className={styles.suggestions}
						>
							{activeSuggestions.map((suggestion) => (
								<button
									key={suggestion}
									type="button"
									className={styles.suggestionButton}
									onMouseDown={(event) => event.preventDefault()}
									onClick={() => {
										onChange({ q: suggestion });
										setShowSuggestions(false);
									}}
								>
									{suggestion}
								</button>
							))}
						</div>
					)}
				</div>
			</div>

			{/* Gender */}
			<fieldset className={`${styles.section} ${styles.fieldset}`}>
				<legend className={styles.sectionLabel}>Gender</legend>
				<div className={styles.pillGroup}>
					<button
						type="button"
						className={`${styles.pill}${search.gender === "all" ? ` ${styles.selected}` : ""}`}
						aria-pressed={search.gender === "all"}
						onClick={() => onChange({ gender: "all" })}
					>
						All
					</button>
					{GENDERS.map((gender) => {
						const isSelected = search.gender === gender;
						return (
							<button
								key={gender}
								type="button"
								className={`${styles.pill}${isSelected ? ` ${styles.selected}` : ""}`}
								aria-pressed={isSelected}
								onClick={() => onChange({ gender })}
							>
								{GENDER_LABELS[gender]}
							</button>
						);
					})}
				</div>
			</fieldset>

			{/* Building */}
			<div className={styles.section}>
				<span className={styles.sectionLabel}>Building</span>
				<div className={styles.pillGroup}>
					{BUILDINGS.map((building) => {
						const isSelected = search.building.includes(building);
						return (
							<button
								key={building}
								type="button"
								className={`${styles.pill}${isSelected ? ` ${styles.selected}` : ""}`}
								aria-pressed={isSelected}
								onClick={() =>
									onChange({
										building: toggleValue(search.building, building),
									})
								}
							>
								{building}
								<span className={styles.pillCount}>
									{counts.building[building] ?? 0}
								</span>
							</button>
						);
					})}
				</div>
			</div>

			{/* Tags */}
			<div className={styles.section}>
				<span className={styles.sectionLabel}>Tags</span>
				<div className={styles.pillGroup}>
					{RESTROOM_TAGS.map((tag) => {
						const isSelected = search.tags.includes(tag);
						return (
							<button
								key={tag}
								type="button"
								className={`${styles.pill}${isSelected ? ` ${styles.selected}` : ""}`}
								aria-pressed={isSelected}
								onClick={() =>
									onChange({ tags: toggleValue(search.tags, tag) })
								}
							>
								{TAG_LABELS[tag]}
								<span className={styles.pillCount}>{counts.tag[tag] ?? 0}</span>
							</button>
						);
					})}
				</div>
			</div>

			{/* Minimum rating */}
			<div className={styles.section}>
				<label className={styles.sectionLabel} htmlFor="directory-min-rating">
					Minimum rating
				</label>
				<input
					id="directory-min-rating"
					type="range"
					className={styles.slider}
					min={1}
					max={5}
					step={1}
					value={search.minRating}
					onChange={(event) =>
						onChange({
							minRating: Number(event.target.value) as MinRating,
						})
					}
					style={{ "--fill": `${sliderFill}%` } as CSSProperties}
				/>
				<p className={styles.sliderRow}>
					<span>
						{search.minRating === 1 ? "Any rating" : `💩 ≥ ${search.minRating}`}
					</span>
					{search.minRating > 1 && (
						<button
							type="button"
							className={styles.clearButton}
							onClick={() =>
								onChange({
									minRating: DEFAULT_DIRECTORY_SEARCH.minRating,
								})
							}
						>
							Clear
						</button>
					)}
				</p>
			</div>

			{/* PWD accessible */}
			<div className={styles.section}>
				<span className={styles.sectionLabel}>Accessibility</span>
				<label className={styles.toggleRow}>
					<input
						type="checkbox"
						className={styles.toggleInput}
						checked={search.pwd}
						onChange={(event) => onChange({ pwd: event.target.checked })}
					/>
					<span className={styles.toggleTrack} aria-hidden="true">
						<span className={styles.toggleThumb} />
					</span>
					<span className={styles.toggleLabel}>PWD accessible only</span>
				</label>
			</div>

			{/* Reset */}
			<button
				type="button"
				className={styles.resetButton}
				disabled={!isFilterActive(search)}
				onClick={() => onChange(resetFilters())}
			>
				<RotateCcw aria-hidden="true" />
				Reset filters
			</button>
		</div>
	);
}
