export type DevUser = {
	id: string;
	name: string;
};

// Stub for future auth work; unused for now.
export function getCurrentUser(): DevUser | undefined {
	return undefined;
}
