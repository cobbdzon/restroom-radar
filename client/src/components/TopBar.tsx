import { Link, useLocation } from "@tanstack/react-router";
import { Menu, Moon, Radar, Sun, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import styles from "../assets/styles/TopBar.module.css";

const NAV_LINKS = [
	{ to: "/directory", label: "Directory" },
	{ to: "/about", label: "About" },
	{ to: "/contact", label: "Contact" },
] as const;

type Theme = "light" | "dark";

/** The inline script in index.html applies a saved theme before first paint. */
function currentTheme(): Theme {
	const applied = document.documentElement.dataset.theme;
	if (applied === "light" || applied === "dark") {
		return applied;
	}
	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}

function TopBar() {
	const { pathname } = useLocation();
	const [open, setOpen] = useState(false);
	const [theme, setTheme] = useState<Theme>(currentTheme);
	const prevPathname = useRef(pathname);

	// Close when the route changes (e.g. picking a link from the menu).
	useEffect(() => {
		if (prevPathname.current !== pathname) {
			prevPathname.current = pathname;
			setOpen(false);
		}
	}, [pathname]);

	useEffect(() => {
		if (!open) {
			return;
		}
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setOpen(false);
			}
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [open]);

	useEffect(() => {
		const mq = window.matchMedia("(min-width: 64rem)");
		const onChange = () => {
			if (mq.matches) {
				setOpen(false);
			}
		};
		onChange();
		mq.addEventListener("change", onChange);
		return () => mq.removeEventListener("change", onChange);
	}, []);

	// Follow the OS theme until someone picks one with the toggle.
	useEffect(() => {
		const mq = window.matchMedia("(prefers-color-scheme: dark)");
		const onChange = (event: MediaQueryListEvent) => {
			if (!document.documentElement.dataset.theme) {
				setTheme(event.matches ? "dark" : "light");
			}
		};
		mq.addEventListener("change", onChange);
		return () => mq.removeEventListener("change", onChange);
	}, []);

	const toggleTheme = () => {
		const next: Theme = theme === "dark" ? "light" : "dark";
		setTheme(next);
		document.documentElement.dataset.theme = next;
		try {
			localStorage.setItem("theme", next);
		} catch {
			// The choice still applies for this session.
		}
	};

	const themeAction =
		theme === "dark" ? "Switch to light mode" : "Switch to dark mode";

	const renderLinks = () =>
		NAV_LINKS.map((link) => {
			const isActive = pathname === link.to;
			return (
				<Link
					key={link.to}
					to={link.to}
					className={`${styles.nav_link}${isActive ? ` ${styles.active}` : ""}`}
					aria-current={isActive ? "page" : undefined}
				>
					{link.label}
				</Link>
			);
		});

	return (
		<div className={styles.topbar}>
			<Link to="/" className={styles.logo_link}>
				<span className={styles.logo_mark} aria-hidden="true">
					<Radar />
				</span>
				<span className={styles.logo_word}>
					<span className={styles.logo_name}>Restroom Radar</span>
					<span className={styles.logo_place}>Mapúa Intramuros</span>
				</span>
			</Link>
			<div className={styles.controls}>
				<nav className={styles.right} aria-label="Primary">
					{renderLinks()}
				</nav>
				<button
					type="button"
					className={styles.themeToggle}
					aria-label={themeAction}
					title={themeAction}
					onClick={toggleTheme}
				>
					{theme === "dark" ? (
						<Sun aria-hidden="true" />
					) : (
						<Moon aria-hidden="true" />
					)}
				</button>
				<button
					type="button"
					className={styles.hamburger}
					aria-expanded={open}
					aria-controls="primary-nav"
					aria-label={open ? "Close menu" : "Open menu"}
					onClick={() => setOpen((prev) => !prev)}
				>
					{open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
				</button>
			</div>
			{open && (
				<>
					<button
						type="button"
						className={styles.backdrop}
						aria-label="Close menu"
						onClick={() => setOpen(false)}
					/>
					<nav
						id="primary-nav"
						className={styles.mobileNav}
						aria-label="Primary"
					>
						{renderLinks()}
					</nav>
				</>
			)}
		</div>
	);
}

export default TopBar;
