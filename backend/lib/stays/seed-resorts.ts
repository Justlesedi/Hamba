import type { Stay } from "../../types/stay";
import { stay } from "./factory";

/** Named resorts listed as self-catering chalets: sleeps, bedrooms, kitchen, braai. */
export const RESORT_STAYS: Stay[] = [
  stay("stay_ct_lagoonbeach", "Lagoon Beach Hotel", -33.8936, 18.4902, "Lagoon Beach Hotel", "Milnerton, Cape Town", "resort", 6, 2400, "Kitchen, braai, and the beach across the lawn."),
  stay("stay_ct_bayhotel", "The Bay Hotel", -33.9518, 18.3772, "The Bay Hotel", "Camps Bay, Cape Town", "resort", 4, 4200, "Kitchenette and Camps Bay views from the chalet."),
  stay("stay_ct_president", "The President Hotel", -33.9148, 18.3872, "The President Hotel", "Sea Point, Cape Town", "resort", 4, 2100, "Kitchen and the Sea Point promenade below."),

  stay("stay_jhb_palazzo", "The Palazzo Montecasino", -26.0248, 28.0046, "Tsogo Sun", "Fourways, Johannesburg", "resort", 4, 2800, "Kitchenette, lounge, and the Montecasino pool."),
  stay("stay_jhb_doreale", "D'Oreale Grande", -26.1518, 28.3024, "Peermont", "Kempton Park, Johannesburg", "resort", 4, 2200, "Kitchen and parking at Emperors Palace."),
  stay("stay_soweto_goldreefresort", "Gold Reef City Resort", -26.2368, 28.0134, "Tsogo Sun", "Ormonde, Johannesburg", "resort", 6, 1800, "Kitchen, braai, and the theme park next door."),

  stay("stay_dbn_sibaya", "Sibaya Casino Resort", -29.6718, 31.0964, "Sun International", "uMhlanga Rocks, Durban", "resort", 6, 2100, "Kitchen, braai, and a lagoon-side resort pool."),
  stay("stay_umh_sands", "Umhlanga Sands Resort", -29.7262, 31.0868, "Southern Sun", "Umhlanga", "resort", 6, 2600, "Kitchen, braai balcony, and the promenade downstairs."),

  stay("stay_stb_spier", "Spier Hotel", -33.9678, 18.7816, "Spier", "Stellenbosch", "resort", 6, 2800, "Kitchen, braai, and the estate pool among the vines."),
  stay("stay_fh_montrochelle", "Mont Rochelle Hotel", -33.9124, 19.1172, "Virgin Limited Edition", "Franschhoek", "resort", 4, 5400, "Kitchenette and a vineyard view over the valley."),
  stay("stay_paarl_pearlvalley", "Pearl Valley Hotel", -33.7686, 18.9624, "Pearl Valley", "Paarl", "resort", 6, 3600, "Kitchen, braai patio, and golf-course access."),

  stay("stay_pta_menlynmaine", "The Capital Menlyn Maine", -25.7864, 28.2768, "The Capital", "Menlyn, Pretoria", "resort", 4, 2400, "Kitchenette in an urban resort chalet at Menlyn Maine."),

  stay("stay_gqe_pinelodge", "Pine Lodge Resort", -33.9788, 25.6486, "Pine Lodge", "Humewood, Gqeberha", "resort", 6, 1400, "Kitchen, braai, and a short walk to King's Beach."),
  stay("stay_el_hemingways", "Hemingways Hotel", -32.9686, 27.8942, "Tsogo Sun", "East London", "resort", 4, 1600, "Kitchenette and parking at the casino resort."),
  stay("stay_jbay_beachresort", "Jeffreys Bay Beach Resort", -34.0482, 24.9186, "JBay Beach Resort", "Jeffreys Bay", "resort", 6, 1500, "Kitchen, braai, and a walk to the surf point."),

  stay("stay_knysna_pezula", "Pezula Resort Hotel", -34.0668, 23.0876, "Pezula", "Knysna", "resort", 6, 4800, "Kitchen, braai deck, and Heads views from the golf estate."),
  stay("stay_plett_beaconresort", "Beacon Island Resort", -34.0572, 23.3782, "Beacon Island", "Plettenberg Bay", "resort", 6, 2800, "Kitchen and a sea-facing braai on the Plett rocks."),
  stay("stay_hermanus_arabella", "Arabella Hotel & Spa", -34.3268, 19.1372, "Arabella", "Hermanus", "resort", 6, 3200, "Kitchen, braai, and spa on the lagoon golf estate."),
  stay("stay_george_oubaai", "Oubaai Hotel Golf & Spa", -34.0186, 22.4128, "Oubaai", "George", "resort", 6, 2600, "Kitchen, braai, and course views west of George."),
  stay("stay_mossel_diazstrand", "Diaz Strand Resort", -34.1682, 22.1068, "Diaz Strand", "Mossel Bay", "resort", 8, 1800, "Full kitchen, braai, and sand at the chalet gate."),
  stay("stay_oudt_cango", "Cango Mountain Resort", -33.5486, 22.2484, "Cango Mountain Resort", "Oudtshoorn", "resort", 6, 1200, "Kitchen, braai, and mountain air on the Caves road."),

  stay("stay_bloem_ilanga", "Ilanga Estate", -29.1012, 26.1786, "Ilanga Estate", "Bloemfontein", "resort", 6, 1600, "Kitchen, braai, and a shared garden pool."),
  stay("stay_mbomb_emnotweni", "Emnotweni Sun", -25.4668, 30.9856, "Tsogo Sun", "Mbombela", "resort", 6, 1700, "Kitchen, braai, and the casino next door."),
  stay("stay_wr_krugerlodge", "Kruger Park Lodge", -25.3188, 31.0286, "Kruger Park Lodge", "White River", "resort", 8, 2400, "Full kitchen, braai, river frontage, and estate wildlife."),
  stay("stay_hazy_sabiriver", "Sabi River Sun Resort", -25.0448, 31.1126, "Tsogo Sun", "Hazyview", "resort", 6, 2200, "Kitchen, braai, and golf on the river estate near Numbi."),

  stay("stay_polok_ranch", "The Ranch Resort", -23.9786, 29.4688, "The Ranch Resort", "Polokwane", "resort", 6, 1600, "Kitchen, braai, and a bushveld pool south of town."),
  stay("stay_tzaneen_magoeba", "Magoebaskloof Hotel", -23.8786, 30.0024, "Magoebaskloof Hotel", "Tzaneen", "resort", 4, 1500, "Kitchenette, fireplace, and forest air above Tzaneen."),
  stay("stay_kim_gumtree", "Gum Tree Lodge", -28.7286, 24.7784, "Gum Tree Lodge", "Kimberley", "resort", 6, 1100, "Kitchen, braai, and shade near the Big Hole."),
  stay("stay_upington_river", "Upington River Resort", -28.4512, 21.2496, "Upington River Resort", "Upington", "resort", 6, 1300, "Kitchen, river braai, and a swim from the lawn."),

  stay("stay_suncity_cabanas", "Sun City Cabanas", -25.3418, 27.0928, "Sun International", "Sun City", "resort", 6, 1800, "Kitchenette, braai, and the Valley of Waves nearby."),
  stay("stay_kruger_gate", "Protea Hotel Kruger Gate", -24.9786, 31.4846, "Marriott", "Kruger National Park", "resort", 6, 2400, "Kitchen, braai, and the park fence at the garden."),
  stay("stay_hoeds_wildlife", "Hoedspruit Wildlife Estate Resort", -24.3486, 30.9586, "Hoedspruit Wildlife Estate", "Hoedspruit", "resort", 8, 2100, "Full kitchen, braai deck, and game through the fence."),
  stay("stay_phal_hans", "Hans Merensky Hotel & Spa", -23.9412, 31.1386, "Hans Merensky", "Phalaborwa", "resort", 6, 1900, "Kitchen, braai, and spa on the Phalaborwa golf estate."),
];
