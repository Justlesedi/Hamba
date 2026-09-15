import type { Activity } from "../../types/activity";

function activity(
  id: string,
  name: string,
  latitude: number,
  longitude: number,
  company: string,
  operatingHours: string,
  area: string,
): Activity {
  return { id, name, latitude, longitude, company, operatingHours, area };
}

export const CITY_ACTIVITIES: Activity[] = [
  activity("act_paarl_taal", "Taal Monument", -33.637, 19.015, "Afrikaanse Taal en Kultuurvereniging", "08:00–17:00 daily", "Paarl"),
  activity("act_franschhoek_motor", "Franschhoek Motor Museum", -33.908, 19.117, "L'Ormarins", "10:00–17:00, closed Saturday", "Franschhoek"),
  activity("act_george_museum", "George Museum", -33.9642, 22.4581, "Garden Route District Municipality", "09:00–16:30 Monday–Friday", "George"),
  activity("act_knysna_heads", "The Knysna Heads", -34.077, 23.061, "Knysna Municipality", "Open 24 hours", "Knysna"),
  activity("act_plettenberg_robberg", "Robberg Nature Reserve", -34.105, 23.387, "CapeNature", "07:00–18:00 daily", "Plettenberg Bay"),
  activity("act_mossel_point", "The Point, Mossel Bay", -34.1835, 22.1468, "Mossel Bay Municipality", "Open 24 hours", "Mossel Bay"),
  activity("act_hermanus_cliff", "Hermanus Cliff Path", -34.421, 19.245, "Overstrand Municipality", "Sunrise to sunset", "Hermanus"),
  activity("act_cango_caves", "Cango Caves", -33.392, 22.215, "Oudtshoorn Municipality", "09:00–16:00 daily", "Oudtshoorn"),

  activity("act_union_buildings", "Union Buildings", -25.7403, 28.2119, "Department of Public Works", "Gardens 06:00–18:00 daily", "Pretoria"),
  activity("act_voortrekker", "Voortrekker Monument", -25.7764, 28.1756, "Voortrekker Monument Heritage Site", "08:00–17:00 daily", "Pretoria"),
  activity("act_freedom_park", "Freedom Park", -25.761, 28.188, "Freedom Park Trust", "08:00–16:30 daily", "Pretoria"),
  activity("act_neighbourgoods", "Neighbourgoods Market", -26.1978, 28.0326, "Neighbourgoods", "09:00–15:00 Saturday", "Braamfontein, Johannesburg"),
  activity("act_cradle_sterkfontein", "Sterkfontein Caves", -26.0156, 27.7344, "Cradle of Humankind", "09:00–16:00 daily", "Gauteng"),

  activity("act_pmb_tatham", "Tatham Art Gallery", -29.6015, 30.3799, "Msunduzi Municipality", "10:00–17:00 Tuesday–Sunday", "Pietermaritzburg"),
  activity("act_howick_falls", "Howick Falls", -29.4878, 30.2386, "uMngeni Municipality", "Open 24 hours", "Howick"),
  activity("act_umhlanga_lighthouse", "Umhlanga Lighthouse", -29.728, 31.0884, "Transnet National Ports Authority", "Viewable from the promenade daily", "Umhlanga"),
  activity("act_stlucia_isimu", "iSimangaliso Estuary Boardwalk", -28.381, 32.414, "iSimangaliso Wetland Park Authority", "05:00–19:00 daily", "St Lucia"),
  activity("act_richards_bay_game", "Richards Bay Game Reserve", -28.786, 32.078, "City of uMhlathuze", "06:00–18:00 daily", "Richards Bay"),
  activity("act_newcastle_fort", "Fort Amiel Museum", -27.767, 29.931, "Newcastle Municipality", "09:00–16:00 Monday–Friday", "Newcastle"),

  activity("act_el_aquarium", "East London Museum", -33.0168, 27.9088, "Buffalo City Museum", "09:00–16:30 Monday–Friday", "East London"),
  activity("act_pe_boardwalk", "Boardwalk Casino complex", -33.985, 25.67, "Sun International", "Shops 09:00–19:00 daily", "Gqeberha"),
  activity("act_pe_donkin", "Donkin Reserve", -33.9617, 25.6199, "Nelson Mandela Bay Municipality", "Open 24 hours", "Gqeberha"),
  activity("act_jbay_point", "Supertubes, Jeffreys Bay", -34.0485, 24.9306, "Kouga Municipality", "Open 24 hours", "Jeffreys Bay"),
  activity("act_mthatha_nelson", "Nelson Mandela Museum", -31.5884, 28.7906, "Nelson Mandela Museum", "09:00–16:00 Monday–Friday", "Mthatha"),
  activity("act_makhanda_observatory", "Makhanda Observatory Museum", -33.3106, 26.5254, "Rhodes University / Albany Museum", "09:00–16:30 Monday–Friday", "Makhanda"),

  activity("act_naval_hill", "Naval Hill Planetarium", -29.1006, 26.231, "University of the Free State", "08:00–16:30 Monday–Friday", "Bloemfontein"),
  activity("act_olo_bloem", "Oliewenhuis Art Museum", -29.094, 26.214, "National Museum Bloemfontein", "08:00–17:00 Monday–Friday", "Bloemfontein"),
  activity("act_qwaqwa_campus", "University of the Free State Qwaqwa Campus", -28.5412, 28.8169, "University of the Free State", "08:00–16:30 Monday–Friday", "Phuthaditjhaba, QwaQwa"),
  activity("act_witsieshoek", "Witsieshoek Mountain Lodge lookout", -28.564, 28.89, "Witsieshoek Mountain Lodge", "08:00–17:00 daily", "QwaQwa Drakensberg"),
  activity("act_golden_gate", "Golden Gate Highlands National Park", -28.506, 28.616, "South African National Parks", "06:00–18:00 daily", "Near Phuthaditjhaba"),
  activity("act_bethlehem_museum", "Bethlehem Museum", -28.2308, 28.3075, "Dihlabeng Municipality", "08:00–16:00 Monday–Friday", "Bethlehem"),
  activity("act_welkom_phakisa", "Phakisa Freeway", -27.904, 26.713, "Motorsport South Africa", "Event days; offices 08:00–16:00", "Welkom"),
  activity("act_harrismith_platberg", "Platberg Nature Reserve", -28.2735, 29.141, "Maluti-a-Phofung Municipality", "07:00–17:00 daily", "Harrismith"),

  activity("act_lowveld_garden", "Lowveld National Botanical Garden", -25.4446, 30.9696, "South African National Biodiversity Institute", "08:00–17:00 daily", "Mbombela"),
  activity("act_mbombela_stadium", "Mbombela Stadium", -25.4616, 30.9304, "Mbombela Stadium", "Tours 09:00–16:00 Monday–Friday", "Mbombela"),
  activity("act_sudwala", "Sudwala Caves", -25.3706, 30.6994, "Sudwala Caves", "08:30–16:30 daily", "Near Mbombela"),
  activity("act_chimp_eden", "Chimp Eden", -25.421, 30.987, "Jane Goodall Institute South Africa", "10:00–16:00 daily", "Umhloti Nature Reserve, Mbombela"),
  activity("act_casterbridge", "Casterbridge Lifestyle Centre", -25.3305, 31.0112, "Casterbridge", "Shops 09:00–17:00 daily", "White River"),
  activity("act_gods_window", "God's Window", -24.875, 30.891, "Mpumalanga Tourism and Parks Agency", "07:00–17:00 daily", "Graskop"),
  activity("act_bourkes_luck", "Bourke's Luck Potholes", -24.572, 30.811, "Mpumalanga Tourism and Parks Agency", "07:00–17:00 daily", "Blyde River Canyon"),
  activity("act_three_rondavels", "Three Rondavels viewpoint", -24.573, 30.807, "Mpumalanga Tourism and Parks Agency", "07:00–17:00 daily", "Blyde River Canyon"),
  activity("act_pilgrims_rest", "Pilgrim's Rest", -24.905, 30.757, "Pilgrim's Rest Museum", "09:00–16:00 daily", "Pilgrim's Rest"),
  activity("act_skukuza_rest", "Skukuza Rest Camp", -24.9924, 31.5928, "South African National Parks", "Gates 06:00–17:30, season dependent", "Kruger National Park"),
  activity("act_emalahleni_witbank_dam", "Witbank Dam Nature Reserve", -25.889, 29.191, "Emalahleni Local Municipality", "07:00–17:00 daily", "eMalahleni"),
  activity("act_middelburg_dam", "Middelburg Dam", -25.7758, 29.508, "Steve Tshwete Local Municipality", "Sunrise to sunset", "Middelburg"),

  activity("act_sun_city_valley", "Valley of Waves", -25.3406, 27.0944, "Sun International", "09:00–18:00 daily", "Sun City"),
  activity("act_pilanesberg", "Pilanesberg National Park", -25.26, 27.08, "North West Parks Board", "06:00–18:00 daily", "Pilanesberg"),
  activity("act_rustenburg_kgaswane", "Kgaswane Mountain Reserve", -25.715, 27.2, "North West Parks Board", "06:00–18:00 daily", "Rustenburg"),
  activity("act_potch_owl", "Potchefstroom Dam Resort", -26.7158, 27.103, "JB Marks Local Municipality", "07:00–18:00 daily", "Potchefstroom"),
  activity("act_mahikeng_museum", "Mafikeng Museum", -25.8658, 25.6402, "Mahikeng Local Municipality", "08:00–16:00 Monday–Friday", "Mahikeng"),

  activity("act_polokwane_game", "Polokwane Game Reserve", -23.87, 29.47, "Polokwane Municipality", "07:00–16:30 daily", "Polokwane"),
  activity("act_polokwane_art", "Polokwane Art Museum", -23.907, 29.456, "Polokwane Municipality", "09:00–16:00 Monday–Friday", "Polokwane"),
  activity("act_tzaneen_dam", "Tzaneen Dam", -23.82, 30.17, "Greater Tzaneen Municipality", "Sunrise to sunset", "Tzaneen"),
  activity("act_hoedspruit_endangered", "Hoedspruit Endangered Species Centre", -24.354, 30.952, "HESC", "08:00–16:30 daily", "Hoedspruit"),
  activity("act_phalaborwa_gate", "Phalaborwa Gate, Kruger", -23.945, 31.165, "South African National Parks", "Gate hours 05:30–18:00, season dependent", "Phalaborwa"),
  activity("act_makhado_soutpansberg", "Soutpansberg lookout", -23.05, 29.9, "Makhado Local Municipality", "Sunrise to sunset", "Makhado"),

  activity("act_big_hole", "The Big Hole", -28.7384, 24.7761, "Kimberley Big Hole", "08:00–17:00 daily", "Kimberley"),
  activity("act_kimberley_club", "Kimberley Mine Museum", -28.738, 24.776, "Kimberley Big Hole", "08:00–17:00 daily", "Kimberley"),
  activity("act_upington_kalahari", "Kalahari Orange Museum", -28.457, 21.242, "Dawid Kruiper Municipality", "09:00–17:00 Monday–Friday", "Upington"),
  activity("act_augrabies", "Augrabies Falls National Park", -28.591, 20.341, "South African National Parks", "07:00–18:00 daily", "Near Upington"),
  activity("act_springbok_goegap", "Goegap Nature Reserve", -29.691, 17.964, "Northern Cape Nature Conservation", "08:00–16:00 daily", "Springbok"),

  activity("act_harare_gardens", "Harare Gardens", -17.8249, 31.0492, "City of Harare", "Open 24 hours", "Harare"),
  activity("act_national_gallery_zim", "National Gallery of Zimbabwe", -17.8244, 31.0498, "National Gallery of Zimbabwe", "09:00–17:00 Tuesday–Sunday", "Harare"),
  activity("act_kopje_harare", "Harare Kopje", -17.8316, 31.0445, "City of Harare", "Sunrise to sunset", "Harare"),
];
