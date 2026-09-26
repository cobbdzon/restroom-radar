import { Link, useLocation } from "@tanstack/react-router";
import { Menu, Radar, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import styles from "../assets/styles/TopBar.module.css";

const NAV_LINKS = [
	{ to: "/directory", label: "Directory" },
	{ to: "/about", label: "About" },
	{ to: "/contact", label: "Contact" },
] as const;

function TopBar() {
	const { pathname } = useLocation();
	const [open, setOpen] = useState(false);
	const prevPathname = useRef(pathname);

	// Close when the route changes (e.g. picking a link from the menu).
	useEffect(() => {
		if (prevPathname.current !== pathname) {
			prevPathname.current = pathname;
			setOpen(false);
		}
	}, [pathname]);

	// Close on Escape.
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

	// Close if the viewport grows back to desktop width.
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
			<div className={styles.left}>
				<Link to="/" className={styles.logo_link}>
					<Radar className={styles.logo_icon} aria-hidden="true" />
					Restroom Radar
				</Link>
			</div>
			<nav className={styles.right} aria-label="Primary">
				{renderLinks()}
			</nav>
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
