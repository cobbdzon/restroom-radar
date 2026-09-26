# Restroom Radar

Curated restrooms for Mapúa University Intramuros Campus

## Running the demo

The demo is read-only and backed by client-side mock data, so it ships as a
single container serving the built SPA. There is no API and no database.

```sh
docker compose up --build
```

Then open <http://127.0.0.1:8080>.

The demo is published on port 8080, bound to all interfaces so an upstream
reverse proxy can reach it over the LAN. TLS and public hosting are expected to
be handled by that proxy, not by the container. Override the published port
with `CLIENT_PORT`:

```sh
CLIENT_PORT=3000 docker compose up --build
```

## Icons

This project uses [lucide-react](https://lucide.dev/icons/) for icons.

Import icons in your components:

```tsx
import { ArrowRight } from "lucide-react";

<button>
	Start Exploring
	<ArrowRight />
</button>
```

Icons inherit the current text color via `currentColor` by default. Size and
position them with a CSS class:

```css
.icon {
	width: 1.25rem;
	height: 1.25rem;
	margin-inline-start: 0.5rem;
}
```

Browse the full icon set at <https://lucide.dev/icons>.
