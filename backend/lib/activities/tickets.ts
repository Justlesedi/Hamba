export type TicketChannel = "online" | "venue" | "none";

/** Companies that sell activity tickets on their own sites. */
const SELLS_TICKETS_ONLINE = new Set([
  "Table Mountain Aerial Cableway Company",
  "Two Oceans Aquarium Foundation",
  "Robben Island Museum",
  "South African National Biodiversity Institute",
  "Iziko Museums of South Africa",
  "Castle Control Board",
  "District Six Museum Foundation",
  "Groot Constantia Wine Estate",
  "Stellenbosch Museum",
  "Apartheid Museum",
  "Constitution Hill Trust",
  "Mandela House Museum",
  "Gold Reef City",
  "Maropeng a'Afrika",
  "uShaka Marine World",
  "Moses Mabhida Stadium",
  "Afrikaanse Taal en Kultuurvereniging",
  "L'Ormarins",
  "CapeNature",
  "Oudtshoorn Municipality",
  "Voortrekker Monument Heritage Site",
  "Freedom Park Trust",
  "Cradle of Humankind",
  "Nelson Mandela Museum",
  "Sun International",
  "Sudwala Caves",
  "Jane Goodall Institute South Africa",
  "HESC",
  "Kimberley Big Hole",
  "Mbombela Stadium",
  "National Gallery of Zimbabwe",
  "National Museum Bloemfontein",
  "Buffalo City Museum",
  "Pilgrim's Rest Museum",
  "Rhodes University / Albany Museum",
]);

export function isTicketChannel(value: string | null | undefined): value is TicketChannel {
  return value === "online" || value === "venue" || value === "none";
}

export function ticketChannel(options: {
  company: string;
  kind: "activity" | "food";
  estimatedCostCents: number;
}): TicketChannel {
  if (options.kind !== "activity") {
    return "none";
  }
  if (options.estimatedCostCents <= 0) {
    return "none";
  }
  if (SELLS_TICKETS_ONLINE.has(options.company)) {
    return "online";
  }
  return "venue";
}

export function ticketChannelLabel(channel: TicketChannel) {
  if (channel === "online") {
    return "Tickets online";
  }
  if (channel === "venue") {
    return "Pay at the venue";
  }
  return "No ticket needed";
}
