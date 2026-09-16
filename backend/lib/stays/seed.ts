import type { DatabaseSync } from "node:sqlite";
import { zarToCents } from "../money";
import type { Stay, StayKind } from "../../types/stay";

function stay(
  id: string,
  name: string,
  latitude: number,
  longitude: number,
  company: string,
  area: string,
  kind: StayKind,
  sleeps: number,
  nightlyZar: number,
  note: string,
): Stay {
  return {
    id,
    name,
    latitude,
    longitude,
    company,
    area,
    kind,
    sleeps,
    nightlyCents: zarToCents(nightlyZar),
    note,
    operatingHours: "Open 24 hours",
  };
}

/** Recognisable hotels, guesthouses, lodges, and camps with the area they sit in. */
export const STAYS: Stay[] = [
  // Cape Town
  stay("stay_ct_silo", "The Silo Hotel", -33.9078, 18.4236, "The Royal Portfolio", "V&A Waterfront, Cape Town", "hotel", 2, 8500, "Suites above the Zeitz Museum, harbour views."),
  stay("stay_ct_oneandonly", "One&Only Cape Town", -33.9062, 18.4212, "Kerzner International", "V&A Waterfront, Cape Town", "hotel", 2, 7200, "Island resort on the marina."),
  stay("stay_ct_capegrace", "Cape Grace", -33.9039, 18.4218, "Cape Grace Hotel", "V&A Waterfront, Cape Town", "hotel", 2, 6800, "Quay-side five-star on West Quay."),
  stay("stay_ct_radissonred", "Radisson RED V&A Waterfront", -33.9048, 18.4196, "Radisson Hotel Group", "V&A Waterfront, Cape Town", "hotel", 2, 2400, "Design hotel next to the working harbour."),
  stay("stay_ct_twelveapostles", "The Twelve Apostles Hotel", -33.9855, 18.3594, "The Twelve Apostles Hotel and Spa", "Camps Bay, Cape Town", "hotel", 2, 5500, "Between mountain and Atlantic, above Camps Bay."),
  stay("stay_ct_marly", "The Marly", -33.9512, 18.3776, "The Marly Boutique Hotel", "Camps Bay, Cape Town", "hotel", 2, 3800, "Boutique rooms on the Camps Bay strip."),
  stay("stay_ct_pod", "POD Camps Bay", -33.9524, 18.3768, "POD Hotels", "Camps Bay, Cape Town", "hotel", 2, 4200, "Small luxury hotel a short walk from the beach."),
  stay("stay_ct_glen", "The Glen Boutique Hotel", -33.9108, 18.3942, "The Glen Boutique Hotel", "Sea Point, Cape Town", "hotel", 2, 2800, "Adults-only boutique in Sea Point."),
  stay("stay_ct_winchester", "Winchester Mansions", -33.9126, 18.3878, "Winchester Mansions Hotel", "Sea Point, Cape Town", "hotel", 2, 2200, "Sea-facing rooms on the promenade."),
  stay("stay_ct_morequarters", "More Quarters", -33.9314, 18.4112, "More Quarters", "Gardens, Cape Town", "apartment", 4, 1800, "Apartment-style suites near Kloof Street."),
  stay("stay_ct_granddaddy", "Grand Daddy Boutique Hotel", -33.9248, 18.4202, "Grand Daddy", "Long Street, Cape Town", "hotel", 2, 1400, "CBD boutique with the rooftop Airstream trailers."),
  stay("stay_ct_once", "Once in Cape Town", -33.9286, 18.4108, "Once in Cape Town", "Gardens, Cape Town", "hotel", 2, 650, "Social hotel on Kloof Street."),
  stay("stay_ct_backpack", "The Backpack", -33.9278, 18.4116, "The Backpack", "Gardens, Cape Town", "guesthouse", 2, 450, "Long-running Gardens backpacker and guesthouse."),
  stay("stay_ct_cellars", "The Cellars-Hohenort", -34.0024, 18.4391, "Liz McGrath Collection", "Constantia, Cape Town", "hotel", 2, 4500, "Garden estate hotel in Constantia."),
  stay("stay_ct_tintswalo", "Tintswalo Atlantic", -34.0912, 18.3594, "Tintswalo", "Hout Bay, Cape Town", "lodge", 2, 8900, "Cliff lodge under Chapman's Peak."),

  // Winelands
  stay("stay_stb_lanzerac", "Lanzerac Hotel", -33.9378, 18.8946, "Lanzerac Wine Estate", "Stellenbosch", "hotel", 2, 3200, "Manor-house hotel on a Stellenbosch wine estate."),
  stay("stay_stb_oudewerf", "Oude Werf Hotel", -33.9372, 18.8608, "Oude Werf Hotel", "Stellenbosch", "hotel", 2, 2100, "Historic hotel on Church Street."),
  stay("stay_stb_stellenbosch", "Stellenbosch Hotel", -33.9368, 18.8596, "Oude Werf Collection", "Stellenbosch", "hotel", 2, 1600, "Town-centre rooms in the village."),
  stay("stay_fh_lqf", "Le Quartier Français", -33.9096, 19.1184, "Lee Collection", "Franschhoek", "hotel", 2, 4800, "Village hotel with The Tasting Room."),
  stay("stay_paarl_grande", "Grande Roche Hotel", -33.7496, 18.9742, "Grande Roche", "Paarl", "hotel", 2, 3600, "Manor hotel in the Paarl vineyards."),

  // Garden Route and Overberg
  stay("stay_knysna_phantom", "Phantom Forest Eco Lodge", -34.0186, 23.0008, "Phantom Forest", "Knysna", "lodge", 2, 4200, "Tree-suite lodge above the Knysna lagoon."),
  stay("stay_knysna_thesen", "The Turbine Hotel", -34.0462, 23.0476, "The Turbine Hotel", "Thesen Island, Knysna", "hotel", 2, 2400, "Converted power station on Thesen Island."),
  stay("stay_plett_beacon", "The Plettenberg", -34.0578, 23.3786, "Liz McGrath Collection", "Plettenberg Bay", "hotel", 2, 3900, "Clifftop hotel over Lookout Beach."),
  stay("stay_hermanus_marine", "The Marine Hermanus", -34.4196, 19.2438, "Liz McGrath Collection", "Hermanus", "hotel", 2, 3400, "Sea-facing hotel on the cliff path."),
  stay("stay_george_fancourt", "Fancourt", -33.9648, 22.3842, "Fancourt", "George", "hotel", 2, 3100, "Golf estate hotel outside George."),
  stay("stay_mossel_santos", "Santos Express", -34.1804, 22.1464, "Santos Express", "Mossel Bay", "guesthouse", 2, 700, "Train-carriage rooms on Santos Beach."),
  stay("stay_oudt_rosenhoff", "Rosenhof Country House", -33.5922, 22.2012, "Rosenhof Country House", "Oudtshoorn", "guesthouse", 2, 1500, "Garden guesthouse in town."),

  // Johannesburg, Sandton, Soweto
  stay("stay_jhb_saxon", "The Saxon Hotel", -26.1152, 28.0416, "The Saxon Hotel, Villas & Spa", "Sandhurst, Johannesburg", "hotel", 2, 7800, "Villa hotel in Sandhurst."),
  stay("stay_jhb_westcliff", "Four Seasons The Westcliff", -26.1704, 28.0348, "Four Seasons", "Westcliff, Johannesburg", "hotel", 2, 6200, "Hillside hotel above the zoo."),
  stay("stay_jhb_54bath", "54 on Bath", -26.1468, 28.0436, "The Capital", "Rosebank, Johannesburg", "hotel", 2, 2800, "Rosebank boutique on Bath Avenue."),
  stay("stay_jhb_maslow", "The Maslow Sandton", -26.1072, 28.0574, "Southern Sun", "Sandton, Johannesburg", "hotel", 2, 2400, "Business hotel by Sandton Convention Centre."),
  stay("stay_jhb_radissonred", "Radisson RED Sandton", -26.1048, 28.0546, "Radisson Hotel Group", "Sandton, Johannesburg", "hotel", 2, 2100, "Design hotel in the Sandton core."),
  stay("stay_jhb_peech", "The Peech Hotel", -26.1338, 28.0584, "The Peech Hotel", "Melrose, Johannesburg", "hotel", 2, 2600, "Garden boutique in Melrose."),
  stay("stay_jhb_goldreef", "Gold Reef City Theme Park Hotel", -26.2362, 28.0128, "Tsogo Sun", "Ormonde, Johannesburg", "hotel", 2, 1600, "Hotel next to the theme park and casino."),
  stay("stay_soweto_liberty", "Soweto Hotel on Liberty", -26.2488, 27.8546, "Soweto Hotel", "Kliptown, Soweto", "hotel", 2, 1400, "Hotel at Walter Sisulu Square."),
  stay("stay_soweto_lebos", "Lebo's Soweto Backpackers", -26.2374, 27.9082, "Lebo's Soweto Backpackers", "Orlando West, Soweto", "guesthouse", 2, 480, "Homestay-style rooms near Vilakazi Street."),

  // Pretoria
  stay("stay_pta_sheraton", "Sheraton Pretoria", -25.7468, 28.2292, "Marriott", "Pretoria", "hotel", 2, 2200, "Hotel opposite the Union Buildings gardens."),
  stay("stay_pta_protea", "Protea Hotel Hatfield", -25.7486, 28.2378, "Marriott", "Hatfield, Pretoria", "hotel", 2, 1400, "University-area hotel."),
  stay("stay_pta_court", "Court Classique Suite Hotel", -25.7524, 28.2226, "Court Classique", "Arcadia, Pretoria", "apartment", 4, 1600, "Suite hotel near Loftus."),

  // Durban and Umhlanga
  stay("stay_umh_oysterbox", "The Oyster Box", -29.7282, 31.0878, "The Oyster Box", "Umhlanga", "hotel", 2, 5200, "Colonial hotel on Umhlanga beach."),
  stay("stay_umh_beverly", "Beverly Hills Hotel", -29.7264, 31.0846, "Southern Sun", "Umhlanga", "hotel", 2, 3800, "Beachfront five-star on Lagoon Drive."),
  stay("stay_dbn_elangeni", "Southern Sun Elangeni & Maharani", -29.8496, 31.0364, "Southern Sun", "North Beach, Durban", "hotel", 2, 1800, "Twin beachfront towers on the Golden Mile."),
  stay("stay_dbn_suncoast", "Suncoast Hotel", -29.8136, 31.0368, "Suncoast", "North Beach, Durban", "hotel", 2, 1600, "Hotel at the Suncoast casino and promenade."),
  stay("stay_dbn_benjamin", "The Benjamin", -29.8294, 31.0168, "The Benjamin Hotel", "Morningside, Durban", "hotel", 2, 1400, "Boutique hotel near Florida Road."),
  stay("stay_dbn_tekweni", "Tekweni Backpackers", -29.8298, 31.0224, "Tekweni Backpackers", "Morningside, Durban", "guesthouse", 2, 380, "Florida Road backpacker."),

  // Eastern Cape
  stay("stay_gqe_boardwalk", "Boardwalk Hotel", -33.9852, 25.6704, "Sun International", "Gqeberha", "hotel", 2, 1800, "Hotel at the Boardwalk casino complex."),
  stay("stay_gqe_kelway", "The Kelway Hotel", -33.9726, 25.6492, "The Kelway Hotel", "Humewood, Gqeberha", "hotel", 2, 1400, "Beach-suburb hotel near King's Beach."),
  stay("stay_el_premier", "Premier Hotel East London ICC", -33.0158, 27.9112, "Premier Hotels", "East London", "hotel", 2, 1300, "Hotel at the international convention centre."),
  stay("stay_jbay_island", "Island Vibe Jeffreys Bay", -34.0502, 24.9284, "Island Vibe", "Jeffreys Bay", "guesthouse", 2, 550, "Surf hostel and rooms above Supertubes."),

  // Free State
  stay("stay_bloem_protea", "Protea Hotel Bloemfontein", -29.1164, 26.2148, "Marriott", "Bloemfontein", "hotel", 2, 1300, "City hotel near the universities."),
  stay("stay_bloem_houdene", "Hobbit House", -29.1086, 26.2098, "Hobbit Boutique Hotel", "Westdene, Bloemfontein", "guesthouse", 2, 1100, "Literary-themed guesthouse."),
  stay("stay_qwa_witsieshoek", "Witsieshoek Mountain Lodge", -28.5642, 28.8904, "Witsieshoek Mountain Lodge", "QwaQwa Drakensberg", "lodge", 2, 1800, "Mountain rooms on the Sentinel hike road."),

  // Mpumalanga and Kruger
  stay("stay_mbomb_protea", "Protea Hotel Nelspruit", -25.4746, 30.9692, "Marriott", "Mbombela", "hotel", 2, 1500, "City hotel above the Nelspruit CBD."),
  stay("stay_mbomb_umhifune", "Umhifune Lodge", -25.4528, 30.9784, "Umhifune Lodge", "Mbombela", "guesthouse", 2, 1100, "Suburban lodge with a garden pool."),
  stay("stay_wr_casterbridge", "Casterbridge Hollow", -25.3306, 31.0114, "Casterbridge Hollow Boutique Hotel", "Casterbridge, White River", "hotel", 2, 1800, "Boutique rooms at the Casterbridge centre."),
  stay("stay_wr_casadosol", "Casa do Sol", -25.3184, 31.0086, "Casa do Sol Hotel", "White River", "hotel", 2, 1600, "Mediterranean-style hotel outside White River."),
  stay("stay_hazy_perrys", "Perry's Bridge Hollow", -25.0442, 31.1258, "Perry's Bridge Hollow", "Hazyview", "hotel", 2, 1900, "Boutique hotel at Perry's Bridge."),
  stay("stay_hazy_hippo", "Hippo Hollow Country Estate", -25.0488, 31.1164, "Hippo Hollow", "Hazyview", "lodge", 2, 1700, "River lodge on the Sabie River."),
  stay("stay_hazy_numbi", "Numbi Hotel", -25.0436, 31.1284, "Numbi Hotel", "Hazyview", "hotel", 2, 1200, "Long-running Hazyview hotel near Kruger gates."),
  stay("stay_skukuza_rest", "Skukuza Rest Camp", -24.9924, 31.5928, "South African National Parks", "Skukuza, Kruger National Park", "camp", 4, 2100, "Main rest camp bungalows in southern Kruger."),
  stay("stay_kruger_jock", "Jock Safari Lodge", -25.1042, 31.4864, "Jock Safari Lodge", "Kruger National Park", "lodge", 2, 9800, "Private concession lodge in southern Kruger."),

  // North West
  stay("stay_suncity_palace", "The Palace of the Lost City", -25.3414, 27.0968, "Sun International", "Sun City", "hotel", 2, 6200, "Dome hotel inside the Lost City."),
  stay("stay_suncity_cascades", "Cascades Hotel", -25.3406, 27.0948, "Sun International", "Sun City", "hotel", 2, 3400, "Hotel beside the Valley of Waves."),
  stay("stay_suncity_sun", "Sun City Hotel", -25.3402, 27.0936, "Sun International", "Sun City", "hotel", 2, 2200, "Original resort hotel at the casino."),
  stay("stay_pilanesberg_shepherd", "Shepherd's Tree Game Lodge", -25.2264, 27.0568, "Shepherd's Tree", "Pilanesberg", "lodge", 2, 5400, "Game lodge on the edge of Pilanesberg."),
  stay("stay_rust_kedar", "Kedar Heritage Lodge", -25.5984, 27.1986, "Kedar Country Hotel", "Rustenburg", "lodge", 2, 1800, "Country lodge near Kgaswane."),

  // Limpopo
  stay("stay_polok_fusion", "Fusion Boutique Hotel", -23.9072, 29.4498, "Fusion Boutique Hotel", "Polokwane", "hotel", 2, 1600, "Boutique hotel in the Polokwane suburbs."),
  stay("stay_tzaneen_coach", "The Coach House", -23.8224, 30.1586, "The Coach House Hotel", "Tzaneen", "hotel", 2, 1400, "Hill hotel above Tzaneen."),
  stay("stay_hoeds_khaya", "Khaya Ndlovu", -24.3528, 30.9486, "Khaya Ndlovu Manor House", "Hoedspruit", "lodge", 2, 4200, "Manor lodge near the Kruger Orpen area."),
  stay("stay_phal_sefapane", "Sefapane Lodges", -23.9436, 31.1408, "Sefapane Lodge & Safaris", "Phalaborwa", "lodge", 2, 2100, "Chalet lodge at the Phalaborwa gate."),

  // Northern Cape
  stay("stay_kim_garden", "Garden Court Kimberley", -28.7486, 24.7712, "Southern Sun", "Kimberley", "hotel", 2, 1300, "City hotel near the Big Hole."),
  stay("stay_upington_protea", "Protea Hotel Upington", -28.4472, 21.2568, "Marriott", "Upington", "hotel", 2, 1400, "Orange River hotel."),
  stay("stay_springbok_naries", "Naries Namakwa Retreat", -29.6824, 17.8216, "Naries Namakwa Retreat", "Springbok", "lodge", 2, 2400, "Desert retreat west of Springbok."),
];

export function seedStays(database: DatabaseSync) {
  const insert = database.prepare(
    `INSERT OR IGNORE INTO stays (
      id, name, latitude, longitude, company, area, kind, sleeps, nightlyCents, note, operatingHours
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  const update = database.prepare(
    `UPDATE stays SET
      name = ?,
      latitude = ?,
      longitude = ?,
      company = ?,
      area = ?,
      kind = ?,
      sleeps = ?,
      nightlyCents = ?,
      note = ?,
      operatingHours = ?
    WHERE id = ?`,
  );

  for (const listed of STAYS) {
    insert.run(
      listed.id,
      listed.name,
      listed.latitude,
      listed.longitude,
      listed.company,
      listed.area,
      listed.kind,
      listed.sleeps,
      listed.nightlyCents,
      listed.note,
      listed.operatingHours,
    );
    update.run(
      listed.name,
      listed.latitude,
      listed.longitude,
      listed.company,
      listed.area,
      listed.kind,
      listed.sleeps,
      listed.nightlyCents,
      listed.note,
      listed.operatingHours,
      listed.id,
    );
  }
}
