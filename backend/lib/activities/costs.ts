const zar = (amount: number) => Math.round(amount * 100);

const DEFAULT_ACTIVITY_COST_CENTS = zar(120);

/** Ticket or entry estimates in cents, per person. Free places are 0. */
export const ACTIVITY_COST_CENTS: Record<string, number> = {
  act_table_mountain: zar(420),
  act_va_waterfront: 0,
  act_two_oceans: zar(220),
  act_robben_island: zar(600),
  act_kirstenbosch: zar(100),
  act_bokaap: zar(20),
  act_castle: zar(50),
  act_district_six: zar(45),
  act_signal_hill: 0,
  act_lions_head: 0,
  act_camps_bay: 0,
  act_groot_constantia: zar(150),
  act_chapmans_peak: zar(50),
  act_boulders: zar(180),
  act_cape_point: zar(380),
  act_stellenbosch_museum: zar(40),
  act_apartheid_museum: zar(150),
  act_constitution_hill: zar(100),
  act_mandela_house: zar(80),
  act_gold_reef_city: zar(250),
  act_maropeng: zar(220),
  act_ushaka: zar(280),
  act_moses_mabhida: zar(80),
  act_durban_botanic: 0,
  act_paarl_taal: zar(60),
  act_franschhoek_motor: zar(120),
  act_george_museum: zar(30),
  act_knysna_heads: 0,
  act_plettenberg_robberg: zar(80),
  act_mossel_point: 0,
  act_hermanus_cliff: 0,
  act_cango_caves: zar(180),
  act_union_buildings: 0,
  act_voortrekker: zar(100),
  act_freedom_park: zar(80),
  act_neighbourgoods: 0,
  act_cradle_sterkfontein: zar(220),
  act_pmb_tatham: zar(30),
  act_howick_falls: 0,
  act_umhlanga_lighthouse: 0,
  act_stlucia_isimu: zar(50),
  act_richards_bay_game: zar(40),
  act_newcastle_fort: zar(20),
  act_el_aquarium: zar(40),
  act_pe_boardwalk: 0,
  act_pe_donkin: 0,
  act_jbay_point: 0,
  act_mthatha_nelson: zar(40),
  act_makhanda_observatory: zar(30),
  act_naval_hill: zar(50),
  act_olo_bloem: zar(30),
  act_qwaqwa_campus: 0,
  act_witsieshoek: zar(40),
  act_golden_gate: zar(220),
  act_bethlehem_museum: zar(20),
  act_welkom_phakisa: zar(80),
  act_harrismith_platberg: zar(40),
  act_lowveld_garden: zar(50),
  act_mbombela_stadium: zar(60),
  act_sudwala: zar(120),
  act_chimp_eden: zar(200),
  act_casterbridge: 0,
  act_gods_window: zar(80),
  act_bourkes_luck: zar(80),
  act_three_rondavels: zar(80),
  act_pilgrims_rest: zar(30),
  act_skukuza_rest: zar(460),
  act_emalahleni_witbank_dam: zar(40),
  act_middelburg_dam: zar(20),
  act_sun_city_valley: zar(280),
  act_pilanesberg: zar(120),
  act_rustenburg_kgaswane: zar(60),
  act_potch_owl: zar(40),
  act_mahikeng_museum: zar(20),
  act_polokwane_game: zar(50),
  act_polokwane_art: zar(20),
  act_tzaneen_dam: 0,
  act_hoedspruit_endangered: zar(250),
  act_phalaborwa_gate: zar(460),
  act_makhado_soutpansberg: 0,
  act_big_hole: zar(150),
  act_kimberley_club: zar(150),
  act_upington_kalahari: zar(30),
  act_augrabies: zar(220),
  act_springbok_goegap: zar(60),
  act_harare_gardens: 0,
  act_national_gallery_zim: zar(50),
  act_kopje_harare: 0,
};

export function activityCostCents(activityId: string) {
  return ACTIVITY_COST_CENTS[activityId] ?? DEFAULT_ACTIVITY_COST_CENTS;
}

const HOURLY_HOURS: Record<string, number> = {
  act_groot_constantia: 1,
  act_table_mountain: 1.5,
  act_robben_island: 3.5,
  act_moses_mabhida: 1,
  act_cango_caves: 1.5,
  act_sudwala: 1,
  act_gold_reef_city: 4,
  act_ushaka: 3,
  act_sun_city_valley: 3,
};

export function activityPricing(activityId: string, kind: "activity" | "food") {
  if (kind === "food") {
    return { priceUnit: "visit" as const, typicalHours: 1.5 };
  }
  if (HOURLY_HOURS[activityId] != null) {
    return {
      priceUnit: "hour" as const,
      typicalHours: HOURLY_HOURS[activityId],
    };
  }
  if (activityCostCents(activityId) === 0) {
    return { priceUnit: "visit" as const, typicalHours: 1 };
  }
  return { priceUnit: "visit" as const, typicalHours: 2 };
}

export function placePartyCostCents(
  unitCents: number,
  travellers: number,
  pricing: { priceUnit: "visit" | "hour"; typicalHours: number },
) {
  if (pricing.priceUnit === "hour") {
    return Math.round(unitCents * pricing.typicalHours * travellers);
  }
  return unitCents * travellers;
}
