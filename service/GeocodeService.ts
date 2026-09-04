/*
 * Turning a town name into a position is done once, when a class is saved -
 * never while a student is searching. That keeps the search fast and stays well
 * inside Nominatim's usage policy, which asks for at most one request a second
 * and a User-Agent that identifies the application.
 */
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
const USER_AGENT = 'UniThaksalawa/1.0 (class location lookup)';
const COUNTRY = 'lk';
const TIMEOUT_MS = 5000;

const askNominatim = async (town: string) => {
    const query = new URLSearchParams({
        q: town,
        countrycodes: COUNTRY,
        format: 'json',
        limit: '1',
    });

    // A slow lookup must not hold up saving the class.
    const response = await fetch(`${NOMINATIM_URL}?${query}`, {
        headers: { 'User-Agent': USER_AGENT },
        signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!response.ok) {
        throw new Error(`Nominatim answered ${response.status}`);
    }

    const [best] = (await response.json()) as Array<{ lat: string; lon: string }>;
    if (!best) {
        return undefined;
    }

    return { lat: Number(best.lat), lng: Number(best.lon) };
};

/**
 * The position of a town, or undefined where it could not be placed.
 *
 * A class left without a position cannot match a "classes near me" search, so
 * the backfill script sweeps up anything a failed lookup missed here.
 */
export const geocodeTown = async (town?: string) => {
    if (!town || !town.trim()) {
        return undefined;
    }

    try {
        return await askNominatim(town.trim());
    } catch (error) {
        console.error(`Geocoding "${town}" failed:`, error);
        return undefined;
    }
};
