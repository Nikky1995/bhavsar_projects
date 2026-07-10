const CDN_BASE =
  "https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@8d907bc/topojson/states";

/** Maps @aryanjsx/indiamap state codes to india-maps-data TopoJSON slugs. */
export const STATE_TOPO_SLUGS: Record<string, string> = {
  AP: "andhra-pradesh",
  AR: "arunachal-pradesh",
  AS: "assam",
  BR: "bihar",
  CT: "chhattisgarh",
  GA: "goa",
  GJ: "gujarat",
  HR: "haryana",
  HP: "himachal-pradesh",
  JH: "jharkhand",
  KA: "karnataka",
  KL: "kerala",
  MP: "madhya-pradesh",
  MH: "maharashtra",
  MN: "manipur",
  ML: "meghalaya",
  MZ: "mizoram",
  NL: "nagaland",
  OR: "odisha",
  PB: "punjab",
  RJ: "rajasthan",
  SK: "sikkim",
  TN: "tamil-nadu",
  TG: "telangana",
  TR: "tripura",
  UP: "uttar-pradesh",
  UT: "uttarakhand",
  WB: "west-bengal",
  AN: "andaman-and-nicobar-islands",
  CH: "chandigarh",
  DD: "dnh-and-dd",
  DL: "delhi",
  JK: "jammu-and-kashmir",
  LA: "ladakh",
  LD: "lakshadweep",
  PY: "puducherry",
};

export function getStateTopoUrl(stateCode: string): string | null {
  const slug = STATE_TOPO_SLUGS[stateCode];
  return slug ? `${CDN_BASE}/${slug}.json` : null;
}
