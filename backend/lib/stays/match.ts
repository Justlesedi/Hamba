import { normalizePlace } from "../geo";
import { SOUTH_AFRICA_PLACES } from "../places/south-africa";

export function staySearchHaystack(stay: {
  name: string;
  area: string;
  company: string;
  note?: string;
}) {
  return normalizePlace(
    `${stay.name} ${stay.area} ${stay.company} ${stay.note ?? ""}`,
  );
}

export function stayMatchesQuery(
  stay: { name: string; area: string; company: string; note?: string },
  query: string,
) {
  const needle = normalizePlace(query);
  if (!needle) {
    return true;
  }

  return staySearchHaystack(stay).includes(needle);
}

function destinationNeedles(destination: string) {
  const needle = normalizePlace(destination);
  if (!needle) {
    return [];
  }

  const needles = new Set<string>([needle]);
  for (const place of SOUTH_AFRICA_PLACES) {
    const aliases = place.aliases.map((alias) => normalizePlace(alias));
    if (aliases.some((alias) => needle === alias || needle.includes(alias))) {
      for (const alias of aliases) {
        needles.add(alias);
      }
    }
  }

  return [...needles];
}

export function stayMatchesDestination(
  stay: { name: string; area: string; company: string; note?: string },
  destination: string,
) {
  const haystack = staySearchHaystack(stay);
  return destinationNeedles(destination).some((needle) =>
    haystack.includes(needle),
  );
}
