import type { StayKind } from "../types/stay";

export type BookingHandoff = {
  mode: "link" | "in_person";
  platform: string;
  label: string;
  href?: string;
  carries: string;
};

type TripHandoff = {
  checkIn: string;
  checkOut: string;
  travellers: number;
  units: number;
};

function searchQuery(parts: Array<string | null | undefined>) {
  return parts
    .map((part) => part?.trim())
    .filter((part): part is string => Boolean(part))
    .join(" ");
}

function usDate(iso: string) {
  const [year, month, day] = iso.split("-");
  return `${month}/${day}/${year}`;
}

function tripCarry(options: {
  checkIn: string;
  checkOut: string;
  travellers: number;
  units?: number;
  unitWord?: string;
}) {
  const dates = new Intl.DateTimeFormat("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const start = dates.format(new Date(`${options.checkIn}T12:00:00`));
  const end = dates.format(new Date(`${options.checkOut}T12:00:00`));
  const people =
    options.travellers === 1 ? "1 traveller" : `${options.travellers} travellers`;
  const units =
    options.units && options.unitWord
      ? options.units === 1
        ? `1 ${options.unitWord}`
        : `${options.units} ${options.unitWord}s`
      : null;
  return [start === end ? start : `${start} – ${end}`, people, units]
    .filter(Boolean)
    .join(" · ");
}

function withTripParams(
  url: string,
  fields: Record<string, string>,
) {
  const parsed = new URL(url);
  for (const [key, value] of Object.entries(fields)) {
    parsed.searchParams.set(key, value);
  }
  return parsed.toString();
}

const COMPANY_TICKET_URL: Record<string, string> = {
  "Table Mountain Aerial Cableway Company": "https://www.tablemountain.net/",
  "Two Oceans Aquarium Foundation": "https://www.aquarium.co.za/",
  "Robben Island Museum": "https://www.robben-island.org.za/",
  "South African National Biodiversity Institute":
    "https://www.sanbi.org/visit/tickets/",
  "Iziko Museums of South Africa": "https://www.iziko.org.za/",
  "Castle Control Board": "https://www.castleofgoodhope.co.za/",
  "District Six Museum Foundation": "https://www.districtsix.co.za/",
  "Groot Constantia Wine Estate": "https://www.grootconstantia.co.za/",
  "Stellenbosch Museum": "https://www.stellenbosch.org/",
  "Apartheid Museum": "https://www.apartheidmuseum.org/",
  "Constitution Hill Trust": "https://www.constitutionhill.org.za/",
  "Mandela House Museum": "https://www.mandelahouse.com/",
  "Gold Reef City": "https://www.goldreefcity.co.za/",
  "Maropeng a'Afrika": "https://www.maropeng.co.za/",
  "uShaka Marine World": "https://www.ushakamarineworld.co.za/",
  "Moses Mabhida Stadium": "https://www.mmstadium.com/",
  "Afrikaanse Taal en Kultuurvereniging": "https://www.taalmuseum.co.za/",
  "L'Ormarins": "https://www.fmm.co.za/",
  "CapeNature": "https://www.capenature.co.za/",
  "Oudtshoorn Municipality": "https://www.cango-caves.co.za/",
  "Voortrekker Monument Heritage Site": "https://www.vtm.org.za/",
  "Freedom Park Trust": "https://www.freedompark.co.za/",
  "Cradle of Humankind": "https://www.maropeng.co.za/",
  "Nelson Mandela Museum": "https://www.nelsonmandelamuseum.org.za/",
  "Sun International": "https://www.suninternational.com/",
  "Sudwala Caves": "https://www.sudwalacaves.com/",
  "Jane Goodall Institute South Africa": "https://www.chimpeden.com/",
  "HESC": "https://www.hesc.co.za/",
  "Kimberley Big Hole": "https://www.thebighole.co.za/",
  "Mbombela Stadium": "https://www.mbombelastadium.com/",
  "National Gallery of Zimbabwe": "https://www.nationalgallery.co.zw/",
  "National Museum Bloemfontein": "https://nasmus.co.za/",
  "Buffalo City Museum": "https://www.elmuseum.za.org/",
  "Pilgrim's Rest Museum": "https://www.pilgrims-rest.co.za/",
  "Rhodes University / Albany Museum": "https://www.ru.ac.za/albanymuseum/",
};

function companyHas(company: string, fragment: string) {
  return company.toLowerCase().includes(fragment.toLowerCase());
}

function bookingComUrl(options: {
  name: string;
  area: string;
  checkIn: string;
  checkOut: string;
  travellers: number;
  units: number;
}) {
  return withTripParams("https://www.booking.com/searchresults.html", {
    ss: searchQuery([options.name, options.area]),
    checkin: options.checkIn,
    checkout: options.checkOut,
    group_adults: String(options.travellers),
    no_rooms: String(Math.max(1, options.units)),
    selected_currency: "ZAR",
  });
}

function airbnbUrl(options: {
  name: string;
  area: string;
  checkIn: string;
  checkOut: string;
  travellers: number;
}) {
  const query = searchQuery([options.name, options.area]);
  return withTripParams(
    `https://www.airbnb.com/s/${encodeURIComponent(query)}/homes`,
    {
      query,
      checkin: options.checkIn,
      checkout: options.checkOut,
      adults: String(options.travellers),
    },
  );
}

function lekkeSlaapUrl(options: {
  name: string;
  area: string;
  checkIn: string;
  checkOut: string;
  travellers: number;
}) {
  return withTripParams("https://www.lekkeslaap.co.za/accommodation/search", {
    term: searchQuery([options.name, options.area]),
    arrival: options.checkIn,
    departure: options.checkOut,
    adults: String(options.travellers),
  });
}

function safariNowUrl(options: {
  name: string;
  area: string;
  checkIn: string;
  checkOut: string;
  travellers: number;
}) {
  return withTripParams("https://www.safarinow.com/search", {
    q: searchQuery([options.name, options.area]),
    start: options.checkIn,
    end: options.checkOut,
    adults: String(options.travellers),
  });
}

function marriottUrl(options: {
  name: string;
  area: string;
  checkIn: string;
  checkOut: string;
  travellers: number;
  units: number;
}) {
  return withTripParams("https://www.marriott.com/search/findHotels.mi", {
    "destinationAddress.destination": searchQuery([options.name, options.area]),
    fromDate: usDate(options.checkIn),
    toDate: usDate(options.checkOut),
    roomCount: String(Math.max(1, options.units)),
    numAdultsPerRoom: String(Math.max(1, options.travellers)),
  });
}

function radissonUrl(options: {
  name: string;
  area: string;
  checkIn: string;
  checkOut: string;
  travellers: number;
  units: number;
}) {
  return withTripParams(
    "https://www.radissonhotels.com/en-us/booking/search",
    {
      search: searchQuery([options.name, options.area]),
      checkInDate: options.checkIn,
      checkOutDate: options.checkOut,
      adults: String(options.travellers),
      rooms: String(Math.max(1, options.units)),
    },
  );
}

function southernSunUrl(options: {
  name: string;
  area: string;
  checkIn: string;
  checkOut: string;
  travellers: number;
}) {
  return withTripParams("https://www.southernsun.com/search", {
    q: searchQuery([options.name, options.area]),
    checkIn: options.checkIn,
    checkOut: options.checkOut,
    adults: String(options.travellers),
  });
}

function sunInternationalUrl(options: {
  name: string;
  area: string;
  checkIn: string;
  checkOut: string;
  travellers: number;
}) {
  return withTripParams("https://www.suninternational.com/search/", {
    q: searchQuery([options.name, options.area]),
    checkin: options.checkIn,
    checkout: options.checkOut,
    adults: String(options.travellers),
  });
}

function sanparksUrl(options: {
  name: string;
  checkIn: string;
  checkOut: string;
  travellers: number;
}) {
  return withTripParams("https://www.sanparks.org/tourism/reservations/", {
    q: options.name,
    arrival: options.checkIn,
    departure: options.checkOut,
    guests: String(options.travellers),
  });
}

function capeNatureUrl(options: {
  name: string;
  checkIn: string;
  checkOut: string;
  travellers: number;
}) {
  return withTripParams("https://bookings.capenature.co.za/", {
    q: options.name,
    startDate: options.checkIn,
    endDate: options.checkOut,
    adults: String(options.travellers),
  });
}

function officialStayUrl(
  site: string,
  options: {
    name: string;
    checkIn: string;
    checkOut: string;
    travellers: number;
    units: number;
  },
) {
  return withTripParams(site, {
    q: options.name,
    checkin: options.checkIn,
    checkout: options.checkOut,
    adults: String(options.travellers),
    rooms: String(Math.max(1, options.units)),
  });
}

function inPerson(platform: string, carries: string): BookingHandoff {
  return {
    mode: "in_person",
    platform,
    label: "Travel there yourself",
    carries,
  };
}

function linkHandoff(
  platform: string,
  label: string,
  href: string,
  carries: string,
): BookingHandoff {
  return { mode: "link", platform, label, href, carries };
}

export function stayHandoff(
  stay: {
    name: string;
    company: string;
    area: string;
    kind: StayKind;
  },
  trip: TripHandoff,
): BookingHandoff {
  const adults = Math.max(1, trip.travellers);
  const units = Math.max(1, trip.units);
  const unitWord = stay.kind === "house" ? "house" : "room";
  const carries = tripCarry({
    checkIn: trip.checkIn,
    checkOut: trip.checkOut,
    travellers: adults,
    units,
    unitWord,
  });
  const args = {
    name: stay.name,
    area: stay.area,
    checkIn: trip.checkIn,
    checkOut: trip.checkOut,
    travellers: adults,
    units,
  };

  if (
    companyHas(stay.company, "South African National Parks") ||
    stay.kind === "camp"
  ) {
    return linkHandoff(
      "SANParks",
      "Book on SANParks",
      sanparksUrl(args),
      carries,
    );
  }
  if (companyHas(stay.company, "CapeNature")) {
    return linkHandoff(
      "CapeNature",
      "Book on CapeNature",
      capeNatureUrl(args),
      carries,
    );
  }
  if (
    companyHas(stay.company, "Marriott") ||
    companyHas(stay.company, "Protea")
  ) {
    return linkHandoff(
      "Marriott",
      "Book on Marriott",
      marriottUrl(args),
      carries,
    );
  }
  if (companyHas(stay.company, "Radisson")) {
    return linkHandoff(
      "Radisson",
      "Book on Radisson",
      radissonUrl(args),
      carries,
    );
  }
  if (
    companyHas(stay.company, "Southern Sun") ||
    companyHas(stay.company, "Tsogo")
  ) {
    return linkHandoff(
      "Southern Sun",
      "Book on Southern Sun",
      southernSunUrl(args),
      carries,
    );
  }
  if (
    companyHas(stay.company, "Sun International") ||
    companyHas(stay.company, "Suncoast")
  ) {
    return linkHandoff(
      "Sun International",
      "Book on Sun International",
      sunInternationalUrl(args),
      carries,
    );
  }
  if (companyHas(stay.company, "Four Seasons")) {
    return linkHandoff(
      "Four Seasons",
      "Book on Four Seasons",
      officialStayUrl("https://www.fourseasons.com/search/", args),
      carries,
    );
  }
  if (
    companyHas(stay.company, "Kerzner") ||
    companyHas(stay.company, "One&Only")
  ) {
    return linkHandoff(
      "One&Only",
      "Book on One&Only",
      officialStayUrl("https://www.oneandonlyresorts.com/", args),
      carries,
    );
  }
  if (companyHas(stay.company, "Royal Portfolio")) {
    return linkHandoff(
      "The Royal Portfolio",
      "Book with The Royal Portfolio",
      officialStayUrl("https://www.theroyalportfolio.com/", args),
      carries,
    );
  }
  if (companyHas(stay.company, "Tintswalo")) {
    return linkHandoff(
      "Tintswalo",
      "Book with Tintswalo",
      officialStayUrl("https://www.tintswalo.com/", args),
      carries,
    );
  }
  if (companyHas(stay.company, "Liz McGrath")) {
    return linkHandoff(
      "The Collection",
      "Book with The Collection",
      officialStayUrl("https://www.collectionmcgrath.com/", args),
      carries,
    );
  }
  if (companyHas(stay.company, "Premier Hotels")) {
    return linkHandoff(
      "Premier Hotels",
      "Book with Premier Hotels",
      officialStayUrl("https://www.premierhotels.co.za/", args),
      carries,
    );
  }
  if (companyHas(stay.company, "The Capital")) {
    return linkHandoff(
      "The Capital",
      "Book with The Capital",
      officialStayUrl("https://thecapital.co.za/", args),
      carries,
    );
  }

  if (stay.kind === "house" || stay.kind === "apartment") {
    return linkHandoff("Airbnb", "Book on Airbnb", airbnbUrl(args), carries);
  }
  if (stay.kind === "guesthouse") {
    return linkHandoff(
      "LekkeSlaap",
      "Book on LekkeSlaap",
      lekkeSlaapUrl(args),
      carries,
    );
  }
  if (stay.kind === "lodge") {
    return linkHandoff(
      "SafariNow",
      "Book on SafariNow",
      safariNowUrl(args),
      carries,
    );
  }
  if (stay.kind === "hotel") {
    return linkHandoff(
      "Booking.com",
      "Book on Booking.com",
      bookingComUrl(args),
      carries,
    );
  }

  return inPerson(stay.company, carries);
}

export function activityHandoff(
  place: {
    name: string;
    company: string;
    ticketChannel: "online" | "venue" | "none";
  },
  trip: { visitDate: string; travellers: number },
): BookingHandoff {
  const carries = tripCarry({
    checkIn: trip.visitDate,
    checkOut: trip.visitDate,
    travellers: Math.max(1, trip.travellers),
  });

  if (place.ticketChannel !== "online") {
    return inPerson(place.company, carries);
  }

  const site = COMPANY_TICKET_URL[place.company];
  if (!site) {
    return inPerson(place.company, carries);
  }

  return linkHandoff(
    place.company,
    `Buy tickets`,
    withTripParams(site, {
      date: trip.visitDate,
      adults: String(Math.max(1, trip.travellers)),
      quantity: String(Math.max(1, trip.travellers)),
    }),
    carries,
  );
}
