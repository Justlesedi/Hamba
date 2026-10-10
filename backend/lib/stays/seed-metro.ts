import type { Stay } from "../../types/stay";
import { stay } from "./factory";

/** Extra named stays so each big destination has hotels, houses, guesthouses, and more. */
export const METRO_STAYS: Stay[] = [
  stay("stay_ct_belmond", "Belmond Mount Nelson", -33.9324, 18.4112, "Belmond", "Gardens, Cape Town", "hotel", 2, 7800, "Pink hotel at the foot of Table Mountain."),
  stay("stay_ct_taj", "Taj Cape Town", -33.9252, 18.4196, "Taj Hotels", "Cape Town City Centre", "hotel", 2, 4100, "City hotel beside the Company's Garden."),
  stay("stay_ct_pepperclub", "Pepperclub Hotel", -33.9218, 18.4188, "Pepperclub", "Cape Town City Centre", "hotel", 2, 2200, "Loop Street hotel with a rooftop pool."),
  stay("stay_ct_va", "Victoria & Alfred Hotel", -33.9058, 18.4206, "The Table Bay Hotel Group", "V&A Waterfront, Cape Town", "hotel", 2, 3200, "Warehouse hotel on the working harbour."),
  stay("stay_ct_commodore", "The Commodore Hotel", -33.9046, 18.4184, "Southern Sun", "V&A Waterfront, Cape Town", "hotel", 2, 2100, "Harbour hotel above the clock tower."),
  stay("stay_ct_cloud9", "Cloud 9 Boutique Hotel", -33.9298, 18.4084, "Cloud 9 Boutique Hotel", "Tamboerskloof, Cape Town", "hotel", 2, 2600, "Small hotel on the lower slopes."),
  stay("stay_ct_blackheath", "Blackheath Lodge", -33.9114, 18.3936, "Blackheath Lodge", "Sea Point, Cape Town", "guesthouse", 2, 1900, "Victorian guesthouse two streets from the promenade."),
  stay("stay_ct_ashanti", "Ashanti Gardens", -33.9316, 18.4098, "Ashanti", "Gardens, Cape Town", "guesthouse", 2, 420, "Busy Gardens backpacker and rooms."),
  stay("stay_ct_splendida", "La Splendida", -33.9092, 18.3914, "La Splendida", "Mouille Point, Cape Town", "guesthouse", 2, 1700, "Sea-facing rooms on Beach Road."),
  stay("stay_ct_cliftonhouse", "Clifton Villa", -33.9396, 18.3762, "Clifton Stays", "Clifton, Cape Town", "house", 8, 8900, "Whole villa above Fourth Beach."),
  stay("stay_ct_bantry", "Bantry Bay House", -33.9268, 18.3788, "Bantry Bay Stays", "Bantry Bay, Cape Town", "house", 6, 5400, "Atlantic house on the Bantry Bay bend."),
  stay("stay_ct_obs", "Observatory Loft House", -33.9388, 18.4686, "Observatory Stays", "Observatory, Cape Town", "house", 6, 2100, "Whole house near the Lower Main Road cafes."),
  stay("stay_ct_woodstock", "Woodstock Warehouse House", -33.9274, 18.4462, "Woodstock Stays", "Woodstock, Cape Town", "house", 6, 2400, "Converted warehouse house near the Neighbourgoods market."),
  stay("stay_ct_harbourapt", "Harbour Bridge Apartments", -33.9068, 18.4182, "Harbour Bridge", "V&A Waterfront, Cape Town", "apartment", 4, 2600, "Self-catering apartments over the working harbour."),
  stay("stay_ct_capequarter", "Cape Quarter Suites", -33.9176, 18.4184, "Cape Quarter", "De Waterkant, Cape Town", "apartment", 4, 2200, "Apartment suites in the De Waterkant square."),
  stay("stay_ct_oepsand", "Oep ve Koep Camp", -33.2278, 18.3312, "West Coast National Park", "Langebaan, Cape Town", "camp", 4, 980, "West Coast cottages a drive from the city."),

  stay("stay_jhb_michelangelo", "The Michelangelo", -26.1074, 28.0548, "Legacy Hotels", "Sandton, Johannesburg", "hotel", 2, 3600, "Italianate hotel on Nelson Mandela Square."),
  stay("stay_jhb_hilton", "Hilton Sandton", -26.1062, 28.0578, "Hilton", "Sandton, Johannesburg", "hotel", 2, 2800, "Business hotel beside Sandton City."),
  stay("stay_jhb_hyatt", "Hyatt Regency Johannesburg", -26.1452, 28.0416, "Hyatt", "Rosebank, Johannesburg", "hotel", 2, 3100, "Rosebank hotel on Oxford Road."),
  stay("stay_jhb_melrose", "African Pride Melrose Arch", -26.1332, 28.0684, "Protea Hotels", "Melrose Arch, Johannesburg", "hotel", 2, 2400, "Hotel inside the Melrose Arch precinct."),
  stay("stay_jhb_citylodge", "City Lodge Sandton", -26.1086, 28.0602, "City Lodge Hotels", "Sandton, Johannesburg", "hotel", 2, 1600, "Practical rooms in the Sandton core."),
  stay("stay_jhb_parktonian", "Parktonian All-Suite", -26.1812, 28.0376, "City Lodge Hotels", "Braamfontein, Johannesburg", "apartment", 4, 1400, "Suite hotel above the Braamfontein ridge."),
  stay("stay_jhb_curiocity", "Curiocity Joburg", -26.1978, 28.0472, "Curiocity", "Maboneng, Johannesburg", "guesthouse", 2, 520, "Maboneng backpacker and rooms."),
  stay("stay_jhb_47on", "47 on Westcliff", -26.1688, 28.0326, "47 on Westcliff", "Westcliff, Johannesburg", "guesthouse", 2, 1600, "Ridge guesthouse near the zoo."),
  stay("stay_jhb_saxonwold", "Saxonwold House", -26.1556, 28.0348, "Saxonwold Stays", "Saxonwold, Johannesburg", "house", 6, 2200, "Family house under the jacarandas."),
  stay("stay_jhb_parkview", "Parkview Family House", -26.1542, 28.0286, "Parkview Stays", "Parkview, Johannesburg", "house", 8, 2600, "Whole house near the Johannesburg Zoo."),
  stay("stay_soweto_vilakazi", "Vilakazi Street House", -26.2386, 27.9072, "Soweto Homestays", "Orlando West, Soweto", "house", 6, 1400, "Township house on the Vilakazi strip."),

  stay("stay_dbn_hilton", "Hilton Durban", -29.8548, 31.0296, "Hilton", "Durban CBD", "hotel", 2, 2100, "City hotel beside the International Convention Centre."),
  stay("stay_dbn_protea", "Protea Hotel Edward", -29.8596, 31.0384, "Marriott", "South Beach, Durban", "hotel", 2, 1700, "Art-deco hotel on the Golden Mile."),
  stay("stay_dbn_coastlands", "Coastlands Musgrave", -29.8448, 30.9936, "Coastlands", "Musgrave, Durban", "hotel", 2, 1300, "Ridge hotel above the Berea."),
  stay("stay_dbn_addison", "The Addison", -29.8288, 31.0146, "The Addison", "Morningside, Durban", "guesthouse", 2, 980, "Florida Road boutique rooms."),
  stay("stay_dbn_beachhouse", "Addington Beach House", -29.8684, 31.0392, "Durban Beach Stays", "South Beach, Durban", "house", 8, 2400, "Whole house a short walk from Addington."),
  stay("stay_umh_pearlapt", "Pearls of Umhlanga", -29.7258, 31.0864, "Pearls of Umhlanga", "Umhlanga", "apartment", 4, 2800, "Sea-facing apartments on the Umhlanga promenade."),
  stay("stay_umh_cabana", "Cabana Beach", -29.7272, 31.0852, "Southern Sun", "Umhlanga", "hotel", 2, 2200, "Family hotel on Umhlanga beach."),

  stay("stay_stb_olan", "Oude Werf Townhouse", -33.9376, 18.8618, "Oude Werf Collection", "Stellenbosch", "guesthouse", 2, 1500, "Townhouse rooms off Church Street."),
  stay("stay_stb_devonvalley", "Devon Valley Hotel", -33.9186, 18.8246, "Devon Valley Hotel", "Stellenbosch", "hotel", 2, 2400, "Valley hotel in the Stellenbosch vines."),
  stay("stay_stb_apartment", "Dorpsig Suites", -33.9354, 18.8588, "Dorpsig", "Stellenbosch", "apartment", 4, 1600, "Self-catering suites in the village."),
  stay("stay_fh_leeu", "Leeu House", -33.9108, 19.1198, "Leeu Collection", "Franschhoek", "hotel", 2, 6200, "Village house-hotel on Huguenot Street."),
  stay("stay_fh_lafontaine", "La Fontaine Guest House", -33.9084, 19.1216, "La Fontaine", "Franschhoek", "guesthouse", 2, 1800, "Garden rooms in the Franschhoek village."),

  stay("stay_pta_farminn", "Farm Inn", -25.7316, 28.3184, "Farm Inn", "Silverton, Pretoria", "lodge", 2, 1600, "Thatched lodge on the eastern edge of Pretoria."),
  stay("stay_pta_apartment", "Menlyn Apartments", -25.7836, 28.2764, "Menlyn Stays", "Menlyn, Pretoria", "apartment", 4, 1500, "Self-catering apartments by Menlyn Park."),
  stay("stay_pta_houseeast", "Waterkloof Ridge House", -25.7788, 28.2462, "Waterkloof Stays", "Waterkloof, Pretoria", "house", 8, 2100, "Ridge house south of the Union Buildings."),

  stay("stay_gqe_admiral", "The Admiral Hotel", -33.9736, 25.6508, "The Admiral", "Humewood, Gqeberha", "hotel", 2, 1600, "Beach-suburb hotel near King's Beach."),
  stay("stay_gqe_hacklewood", "Hacklewood Hill", -33.9688, 25.5986, "Hacklewood Hill", "Walmer, Gqeberha", "guesthouse", 2, 1800, "Manor guesthouse in Walmer."),
  stay("stay_gqe_apt", "Boardwalk Suites", -33.9846, 25.6692, "Sun International", "Gqeberha", "apartment", 4, 1700, "Apartment-style suites at the Boardwalk."),

  stay("stay_knysna_belvidere", "Belvidere Manor", -34.0468, 22.9986, "Belvidere Manor", "Belvidere, Knysna", "hotel", 2, 2600, "Manor cottages on the Knysna lagoon."),
  stay("stay_knysna_house2", "Leisure Isle House", -34.0624, 23.0468, "Leisure Isle Stays", "Leisure Isle, Knysna", "house", 8, 3200, "Whole house on the Knysna lagoon island."),
  stay("stay_plett_apt", "Beacon Island Suites", -34.0566, 23.3772, "Beacon Island", "Plettenberg Bay", "apartment", 4, 2400, "Sea suites on the Plett rocks."),

  stay("stay_kruger_satara", "Satara Rest Camp", -24.3928, 31.7796, "South African National Parks", "Satara, Kruger National Park", "camp", 4, 1900, "Central Kruger rest camp bungalows."),
  stay("stay_kruger_lower", "Lower Sabie Rest Camp", -25.1198, 31.9164, "South African National Parks", "Lower Sabie, Kruger National Park", "camp", 4, 2000, "Riverside rest camp in southern Kruger."),
];
