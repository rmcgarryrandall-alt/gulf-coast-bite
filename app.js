(() => {
  "use strict";

  const SAMPLE_PATHS = [
    "M10 114 C82 164 114 172 188 82 S318 6 384 74 S510 170 646 88",
    "M10 132 C74 178 120 146 194 64 S328 18 390 92 S528 156 646 68",
    "M10 144 C88 168 128 118 204 48 S334 40 404 112 S532 140 646 48"
  ];

  const TARGET_ICONS = {
    Redfish: `<svg viewBox="0 0 150 82" role="img" aria-label="Redfish silhouette"><path class="fish-body" d="M18 42 3 18l4 26-4 22 16-20c20 19 68 22 105 2 8-4 15-10 22-16-8-6-16-10-25-13C84 7 39 15 18 42Z"/><path class="fish-detail" d="M29 39c25-14 58-15 91-4M49 24l12 12m-13 23 14-13m43-27 9 15"/><circle class="redfish-tail-spot" cx="27" cy="39" r="5.2"/><circle class="fish-eye" cx="133" cy="29" r="2.3"/></svg>`,
    "Speckled trout": `<svg viewBox="0 0 160 72" role="img" aria-label="Speckled trout silhouette"><path class="fish-body" d="M19 37 3 17l5 21-5 19 17-16c27 13 78 17 119-2 7-3 13-7 18-12-7-5-14-8-22-10C91 7 43 18 19 37Z"/><path class="fish-detail" d="M31 34c31-10 69-10 105-2M55 19l11 12m-9 21 13-13m46-22 11 12"/><g class="trout-spots"><circle cx="69" cy="23" r="2.5"/><circle cx="81" cy="20" r="2"/><circle cx="94" cy="23" r="2.5"/><circle cx="105" cy="19" r="2"/><circle cx="116" cy="23" r="2.4"/></g><circle class="fish-eye" cx="143" cy="25" r="2.2"/></svg>`
  };

  const FIELD_LOG_ICON = `<svg viewBox="0 0 64 64" aria-hidden="true"><path class="field-paper" d="M17 10.5h28c2.8 0 5 2.2 5 5v36H17c-2.8 0-5-2.2-5-5v-31c0-2.8 2.2-5 5-5Z"/><path d="M20 10.5v41M16 18h8M16 25h8M16 32h8M16 39h8M16 46h8"/><path class="field-fish" d="M29 32c4.5-5 11.7-6.2 17-2.6l4.5-3.1-1 5.2 1 5.2-4.5-3.1c-5.3 3.6-12.5 2.4-17-2.6Z"/><circle cx="43.1" cy="30.7" r=".9"/><path class="field-accent" d="m36.5 43.5 13-13m-2.7-1.8 4.5 4.5m-16.7 12.2-1.1 4.2 4.2-1.1"/></svg>`;

  const SPOT_SKETCHES = [
    `<svg viewBox="0 0 118 58" aria-hidden="true"><path d="M4 45c15-5 25-16 34-32m7 33c10-12 24-17 39-13 12 3 20 10 30 11M3 50c19-4 34-4 50 0 18 5 39 4 61-2M65 27l7-9 6 10m-3-9v17"/><path class="spot-soft" d="M8 39c12 2 20 0 29-8M18 46c12-1 21-5 27-12"/></svg>`,
    `<svg viewBox="0 0 118 58" aria-hidden="true"><path d="M3 47c15-2 27-8 37-18 11-10 25-12 40-5 12 6 22 13 35 14M4 52c22-5 42-4 60 1 18 4 34 1 50-6M22 39l-2-13m8 9-2-18m60 20 2-17m5 20 1-13"/><path class="spot-soft" d="M10 42c14-1 24-5 32-12m18 2c10 0 18 4 26 10"/></svg>`,
    `<svg viewBox="0 0 118 58" aria-hidden="true"><path d="M3 49c21-8 40-8 58 0 17 7 35 6 54-2M7 42c17-6 32-6 46 0M68 43h38M79 40V22h17v18M76 22h23m-15-1 3-9h5l3 9M108 43c-1-9 1-16 6-22m-5 11-5-6m7-1 5-5"/><path class="spot-soft" d="M16 34c10-4 19-4 28 0"/></svg>`
  ];

  const REGULATIONS = {
    florida: {
      label: "Florida Panhandle",
      agency: "Florida FWC",
      url: "https://myfwc.com/fishing/saltwater/recreational/",
      species: [
        { name: "Redfish", size: "18–27\" TL slot", bag: "1 daily", note: "4-fish vessel limit · open year-round" },
        { name: "Speckled trout", size: "15–19\" TL slot", bag: "3 daily", note: "Closed February · one over 19\" per vessel, or per shore angler" },
        { name: "Flounder", size: "14\" TL minimum", bag: "5 daily", note: "Closed Oct. 15–Nov. 30" },
        { name: "Sheepshead", size: "12\" TL minimum", bag: "8 daily", note: "50-fish vessel limit during March and April" },
        { name: "Florida pompano", size: "11\" FL minimum", bag: "6 daily", note: "Open year-round" }
      ]
    },
    alabama: {
      label: "Coastal Alabama",
      agency: "Outdoor Alabama",
      url: "https://www.outdooralabama.com/fishing/saltwater-recreational-size-creel-limits",
      species: [
        { name: "Redfish", size: "16–26\" TL slot", bag: "3 daily", note: "Alabama state waters" },
        { name: "Speckled trout", size: "15–22\" TL slot", bag: "6 daily", note: "One fish over 22\" allowed" },
        { name: "Flounder", size: "14\" TL minimum", bag: "5 daily", note: "Closed throughout November" },
        { name: "Sheepshead", size: "12\" FL minimum", bag: "8 daily", note: "Alabama state waters" },
        { name: "Florida pompano", size: "12\" TL minimum", bag: "3 daily", note: "Alabama state waters" }
      ]
    }
  };

  const LOCATIONS = {
    pensacola: {
      stateRules: "florida",
      name: "Pensacola Bay Area, FL",
      short: "Pensacola",
      scoreAdjust: -4,
      target: "Speckled trout",
      bait: "Popping cork · live shrimp",
      note: "Start with moving water in Pensacola Bay. East Bay and Santa Rosa Sound offer protected grass, points, and dock shade.",
      toughVerdict: "Pick a bay. Hunt a clean seam.",
      lat: 30.4,
      lon: -87.21,
      tideStation: "8729909",
      tempStation: "8729840",
      buoyStation: "42012",
      alertZones: ["GMZ655", "GMZ675"],
      spots: [
        { name: "Pensacola Bay", detail: "Bridges · pass seams", rating: "Best bet", tip: "Fish the slower side of bridge current and the edges of pass water. At night, work the shadow line rather than the brightest water." },
        { name: "East Bay", detail: "Grass points · drains", rating: "Protected", tip: "Follow the cleanest shoreline and focus on grass points, creek mouths, and small drains when the tide begins moving." },
        { name: "Santa Rosa Sound", detail: "Flats · dock shade", rating: "Early", tip: "Start on shallow grass at first light, then shift to channel edges and shaded docks as the sun and boat traffic build." }
      ],
      shops: [
        { area: "Pensacola Beach approach", name: "Gulf Breeze Bait & Tackle", description: "Long-running full-line saltwater shop serving Pensacola Beach and Gulf Breeze. Call for today’s live-bait selection.", phone: "850-932-6789", address: "825 Gulf Breeze Pkwy, Gulf Breeze, FL 32561", website: "https://www.facebook.com/GBBaitandTackle/" },
        { area: "Southwest Pensacola", name: "Gray’s Tackle & Guide Service", description: "Live shrimp, sand fleas, fiddler crabs, bull minnows, frozen bait, and inshore tackle.", phone: "850-492-2666", address: "13019 Sorrento Rd Ste 2, Pensacola, FL 32507", website: "https://www.facebook.com/graystackle/" }
      ]
    },
  perdido: {
      stateRules: "florida",
      name: "Perdido Key, FL",
      short: "Perdido Key",
      scoreAdjust: 0,
      target: "Redfish",
      bait: "Live shrimp · gold spoon",
      note: "Moving water around the pass. Work oyster edges and shaded docks.",
      toughVerdict: "Slow bite. Work the protected docks.",
      lat: 30.294,
      lon: -87.44,
      tideStation: "8730667",
      tempStation: "8729840",
      buoyStation: "42012",
      alertZones: ["GMZ650", "GMZ655", "GMZ670", "GMZ675"],
      spots: [
        { name: "Perdido Pass", detail: "Incoming tide · jetties", rating: "Best bet", tip: "Set up on the current seam—not the fastest water—and work shrimp or a paddletail close to the rocks." },
        { name: "Old River", detail: "Protected · docks", rating: "Steady", tip: "A good wind fallback. Skip the dead water and focus on shaded docks with visible current." },
        { name: "Johnson Beach", detail: "Surf edge · troughs", rating: "Early", tip: "Walk the first trough at daylight. Look for clean water, bait showers, and cuts through the bar." }
      ],
      shops: [
        { area: "Perdido Key", name: "Entertainer Bait & Tackle", description: "Live and frozen bait, tackle, drinks, and ice near the island approach.", phone: "850-417-0588", address: "13506 Perdido Key Dr, Pensacola, FL 32507", website: "https://www.visitpensacola.com/directory/entertainer-bait-and-tackle/" },
        { area: "Perdido Key approach", name: "Gray’s Tackle & Guide Service", description: "Live shrimp, sand fleas, fiddler crabs, bull minnows, frozen bait, and inshore tackle.", phone: "850-492-2666", address: "13019 Sorrento Rd Ste 2, Pensacola, FL 32507", website: "https://www.facebook.com/graystackle/" }
      ]
    },
  "orange-beach": {
      stateRules: "alabama",
      name: "Orange Beach, AL",
      short: "Orange Beach",
      scoreAdjust: 3,
      target: "Redfish",
      bait: "Shrimp · ¼ oz jighead",
      note: "Clean incoming water at Alabama Point. Slide into the Ono canals as boat traffic builds.",
      toughVerdict: "Stay tucked in. Try the canals.",
      lat: 30.27,
      lon: -87.57,
      tideStation: "8730667",
      tempStation: "8735180",
      buoyStation: "42012",
      alertZones: ["GMZ650", "GMZ670"],
      spots: [
        { name: "Alabama Point", detail: "Pass edge · jetties", rating: "Best bet", tip: "Fish the color change on an incoming tide. Give the rocks room and wear a PFD if you are in a small boat." },
        { name: "Ono Island", detail: "Canals · dock shade", rating: "Steady", tip: "Pitch shrimp or a small paddletail beneath shaded docks, then move after a few clean presentations." },
        { name: "Cotton Bayou", detail: "Grass · creek mouths", rating: "Falling", tip: "On a falling tide, work creek mouths where bait drains out over grass and shell." }
      ],
      shops: [
        { area: "Orange Beach", name: "J&M Tackle", description: "Long-running local outfitter with live shrimp and minnows, rods, reels, and offshore tackle.", phone: "251-981-5460", address: "25125 Canal Rd, Orange Beach, AL 36561", website: "https://jmtackle.com/" },
        { area: "Orange Beach", name: "Caribe Marina Dock Store", description: "Live bait, inshore and offshore tackle, fuel, drinks, and last-minute boat supplies.", phone: "251-980-8410", address: "28101 Perdido Beach Blvd, Orange Beach, AL 36561", website: "https://caribemarina.com/dock_store/" }
      ]
    },
  "gulf-shores": {
    stateRules: "alabama",
    name: "Gulf Shores, AL",
    short: "Gulf Shores",
    scoreAdjust: 2,
    target: "Speckled trout",
    bait: "Live shrimp \u00b7 popping cork",
    note: "Work Little Lagoon on moving water and the beach at first light. The pier holds bait when the surf is clean.",
    toughVerdict: "Fish the lagoon. Skip the surf.",
    lat: 30.246,
    lon: -87.7,
    tideStation: "8731439",
    tempStation: "8735180",
    buoyStation: "42012",
    alertZones: ["GMZ650", "GMZ670"],
    spots: [
      { name: "Little Lagoon Pass", detail: "Moving tide \u00b7 seams", rating: "Best bet", tip: "Fish the current seams on either side of the pass while the tide moves. Shrimp under a cork or a small jig worked close to the rocks." },
      { name: "Gulf State Park Pier", detail: "Pilings \u00b7 bait schools", rating: "Steady", tip: "Follow the bait schools down the pier and fish the up-current side of the pilings. Let the sabiki traffic tell you what the bait is." },
      { name: "Bon Secour", detail: "River mouth \u00b7 grass", rating: "Protected", tip: "When the Gulf is blown out, the river mouth and grass edges stay fishable. Work a paddletail along the drops." }
    ],
    shops: [
      { area: "Gulf Shores", name: "Hooked Up Bait & Tackle", description: "Locally owned shop with live shrimp, dead bait, tackle, and honest pier and surf reports.", phone: "(251) 955-5550", address: "100 E 20th Ave, Gulf Shores, AL 36542", website: "https://www.gulfshores.com/things-to-do/hooked-up-bait-tackle/" },
      { area: "West Beach", name: "Beach Bum Outdoors", description: "Fresh local live bait\u2014shrimp, bull minnows, and fiddler crabs\u2014plus surf and inshore tackle.", phone: "(251) 699-1822", address: "3041 W 1st St, Gulf Shores, AL 36542", website: "https://beachbumoutdoors.com" }
    ]
  },
  mobile: {
      stateRules: "alabama",
      name: "Mobile Bay, AL",
      short: "Mobile Bay",
      scoreAdjust: -2,
      target: "Speckled trout",
      bait: "Live croaker · soft plastics",
      note: "Trout stack along the bars when the tide starts moving. Follow the clean water up the bay.",
      toughVerdict: "Play the wind. Find a lee shoreline.",
      lat: 30.44,
      lon: -88.01,
      weatherPoints: [
        { lat: 30.2535, lon: -88.1127 },
        { lat: 30.565, lon: -88.088 }
      ],
      tideStation: "8735180",
      tempStation: "8735180",
      buoyStation: "42012",
      alertZones: ["GMZ650", "GMZ670"],
      spots: [
        { name: "Dixey Bar", detail: "Bay mouth · bar edge", rating: "Best bet", tip: "Set up on the edge rather than the crown. Watch the wind against tide—this water can stack up fast." },
        { name: "The Causeway", detail: "Rips · grass edges", rating: "Steady", tip: "Look for visible rips at drains and bridge structure. A shrimp under a cork keeps you above snags." },
        { name: "Middle Bay Light", detail: "Shell · structure", rating: "Moving", tip: "Fish the down-current side of shell and structure with enough weight to stay near bottom." }
      ],
      shops: [
        { area: "South Mobile Bay", name: "Jemison’s Bait & Tackle", description: "Bait, tackle, launch access, and an early start for Mobile Bay and Dauphin Island trips.", phone: "251-873-0003", address: "16871 Dauphin Island Pkwy, Coden, AL 36523", website: "https://www.facebook.com/JemisonsBaitandTackle/" },
        { area: "Eastern Shore", name: "Fisherman’s Discount", description: "Fairhope bait shop established in 1988 with shrimp, minnows, mullet, fiddler crabs, and fresh and frozen bait.", phone: "251-928-4887", address: "8438 US-98, Fairhope, AL 36532", website: "https://fishermansdiscount.com/" }
      ]
    },
  dauphin: {
    stateRules: "alabama",
    name: "Dauphin Island, AL",
    short: "Dauphin Island",
    scoreAdjust: 1,
    target: "Redfish",
    bait: "Live shrimp \u00b7 \u00bc oz jighead",
    note: "The island fishes on current. Bridge pilings, the west end cuts, and the bay side behind the island all turn on when the water moves.",
    toughVerdict: "Rough out front. Fish the back bays.",
    lat: 30.251,
    lon: -88.109,
    tideStation: "8735180",
    tempStation: "8735180",
    buoyStation: "42012",
    alertZones: ["GMZ650", "GMZ670"],
    spots: [
      { name: "Dauphin Island Bridge", detail: "Pilings \u00b7 channel edge", rating: "Best bet", tip: "Fish the down-current side of the pilings and the channel edges. Sheepshead hold tight to the concrete; trout stage off the shadow line." },
      { name: "West End", detail: "Surf \u00b7 cuts", rating: "Moving", tip: "Walk the bars and cuts on a falling tide. Pompano and reds ride the troughs when the surf turns green." },
      { name: "Aloe Bay", detail: "Docks \u00b7 protected", rating: "Steady", tip: "On a hard wind the bay side stays fishable. Pitch shrimp around dock shade and the little drains." }
    ],
    shops: [
      { area: "Dauphin Island", name: "Island Bait and Tackle", description: "Island shop with live and frozen bait, tackle, and current island fishing reports.", phone: "(251) 349-2974", address: "650 Lemoyne Dr, Dauphin Island, AL 36528", website: "https://www.facebook.com/p/Island-Bait-Tackle-61578209551106/" },
      { area: "Dauphin Island Causeway", name: "Jemison’s Bait & Tackle", description: "Bait, tackle, launch access, and an early start for Mobile Bay and Dauphin Island trips.", phone: "251-873-0003", address: "16871 Dauphin Island Pkwy, Coden, AL 36523", website: "https://www.facebook.com/JemisonsBaitandTackle/" }
    ]
  }
  };

  // ── GCB Content Engine v2 · species calendar ─────────────────────────────
  // Month weights are Jan→Dec, 0–10. loc factors multiply per location key.
  const SPECIES = [
    {
      key: "redfish", name: "Redfish", icon: "Redfish",
      months: [6, 6, 7, 8, 8, 7, 7, 7, 9, 10, 9, 7],
      loc: { pensacola: 1, perdido: 1.15, "orange-beach": 1.15, "gulf-shores": 1, mobile: 1.05, dauphin: 1.1 },
      baits: ["live shrimp", "a gold spoon", "cut mullet", "a paddletail on a ¼ oz jighead"],
      how: ["worked along oyster edges and dock shade", "drifted through the pass seam", "fished slow across shell and grass points", "pitched tight to structure on the moving tide"],
      note: "Reds forgive weather better than anything else here. Find moving water and a current seam.",
      fallNote: "Big schools of bull reds stage around the passes in fall. Heavier leader, bigger baits, and keep the fight short in warm water."
    },
    {
      key: "trout", name: "Speckled trout", icon: "Speckled trout",
      months: [4, 3, 6, 8, 9, 8, 6, 6, 8, 9, 8, 5],
      closed: { florida: [2] },
      loc: { pensacola: 1.15, perdido: 1, "orange-beach": 1, "gulf-shores": 1.05, mobile: 1.2, dauphin: 1 },
      baits: ["live shrimp under a popping cork", "a soft plastic on a ⅛ oz jighead", "live croaker", "a topwater at first light"],
      how: ["over grass in 2–5 feet", "along the bar edges while the tide moves", "on the shadow lines around lights and docks", "at creek mouths draining on the falling tide"],
      note: "Trout are a timing fish. The first two hours of light and the first hour of moving tide do most of the work.",
      summerNote: "Summer trout feed early and slide deep by mid-morning. Be on the water at gray light.",
      winterNote: "Cold water stacks trout in deep holes and rivers. Slow everything down and fish the warm afternoons."
    },
    {
      key: "flounder", name: "Flounder", icon: "Flounder",
      months: [3, 3, 5, 6, 7, 7, 6, 7, 8, 9, 8, 3],
      closed: { florida: [10, 11], alabama: [11] },
      loc: { pensacola: 1, perdido: 1.05, "orange-beach": 1, "gulf-shores": 1, mobile: 1.1, dauphin: 1.1 },
      baits: ["a bull minnow on a Carolina rig", "a white grub bounced on bottom", "live shrimp dragged slow", "a mud minnow at the drop-off"],
      how: ["at creek mouths and drains on the falling tide", "along channel edges and dock pilings", "on sandy pockets next to structure", "at the pass on the last of the outgoing"],
      note: "Flounder sit where moving water drops bait over an edge. Work the bottom slow and set the hook late."
    },
    {
      key: "sheepshead", name: "Sheepshead", icon: "Sheepshead",
      months: [7, 9, 10, 8, 5, 3, 3, 3, 4, 5, 6, 7],
      loc: { pensacola: 1.1, perdido: 1, "orange-beach": 1.05, "gulf-shores": 0.95, mobile: 1, dauphin: 1.15 },
      baits: ["fiddler crabs", "live shrimp on a small strong hook", "barnacles scraped from the pilings", "a piece of fresh oyster"],
      how: ["tight to bridge and dock pilings", "on the jetty rocks with just enough weight to hold", "around channel markers and rubble", "straight down against the structure"],
      note: "The convict fish bites soft and steals well. Small strong hooks, tight line, and set on the tap you barely feel.",
      springNote: "Late winter into spring is the spawn. The biggest sheepshead of the year stack on jetties and bridge legs right now."
    },
    {
      key: "pompano", name: "Florida pompano", icon: "Pompano",
      months: [2, 3, 7, 9, 8, 5, 4, 4, 6, 7, 5, 2],
      surf: true,
      loc: { pensacola: 0.9, perdido: 1.2, "orange-beach": 1.1, "gulf-shores": 1.15, mobile: 0.4, dauphin: 1.1 },
      baits: ["sand fleas", "fresh peeled shrimp", "Fishbites on a two-hook pompano rig", "a small banana jig"],
      how: ["in the first trough at daylight", "on the bars and cuts where green water pushes in", "behind the shorebreak on a moving tide", "hopped slowly across clean sand"],
      note: "Pompano want clean, green surf and moving water. If the water is brown, save the sand fleas for another tide."
    },
    {
      key: "spanish", name: "Spanish mackerel", icon: "Spanish mackerel",
      months: [0, 0, 3, 7, 8, 8, 7, 7, 8, 6, 2, 0],
      surf: true,
      loc: { pensacola: 1.05, perdido: 1.05, "orange-beach": 1, "gulf-shores": 1.1, mobile: 0.8, dauphin: 1 },
      baits: ["a silver spoon behind a swivel", "a Gotcha plug worked fast", "a straw rig trolled along the beach", "live LYs when you can net them"],
      how: ["under diving birds along the beachfront", "through the pass on the incoming", "off the pier at first light", "wherever bait showers on the surface"],
      note: "Spanish follow the bait and the birds tell you where. Fast retrieves, long casts, and a trace of wire or heavy mono."
    },
    {
      key: "blackdrum", name: "Black drum", icon: "Black drum",
      months: [8, 8, 7, 5, 4, 3, 3, 3, 4, 5, 6, 8],
      loc: { pensacola: 1, perdido: 1, "orange-beach": 0.95, "gulf-shores": 0.95, mobile: 1.15, dauphin: 1.05 },
      baits: ["fresh dead shrimp on bottom", "a half blue crab", "fiddler crabs near the rocks", "cut bait soaked patiently"],
      how: ["around bridge pilings and rubble", "on shell bottom in the bays", "in the deeper holes on cold days", "near the same rocks the sheepshead use"],
      note: "Drum feed by smell and feel, so bait quality beats presentation. A cold, ugly day is a fine drum day.",
      winterNote: "When fronts shut the flashy fish down, black drum keep eating. The winter drum bite is the most dependable game in town."
    },
    {
      key: "whitetrout", name: "White trout", icon: "White trout",
      months: [2, 2, 3, 4, 5, 7, 8, 8, 8, 6, 4, 2],
      loc: { pensacola: 1.05, perdido: 0.95, "orange-beach": 0.9, "gulf-shores": 0.9, mobile: 1.2, dauphin: 1.1 },
      baits: ["fresh shrimp on a two-drop rig", "a small jig tipped with shrimp", "cut squid when the pinfish allow", "a sabiki full of bull minnows"],
      how: ["over deeper shell and channel edges", "under the lights after dark", "straight below the boat in 10–20 feet", "off the deeper piers on summer evenings"],
      note: "Nobody brags about white trout and everybody eats them. Fast action, kid-proof, and a fine fish fry."
    },
    {
      key: "mangrove", name: "Mangrove snapper", icon: "Mangrove snapper",
      months: [0, 0, 0, 2, 4, 7, 9, 9, 7, 4, 1, 0],
      loc: { pensacola: 1, perdido: 1.1, "orange-beach": 1.05, "gulf-shores": 0.95, mobile: 0.7, dauphin: 0.9 },
      baits: ["small live shrimp on light fluorocarbon", "scaled sardines", "live pilchards", "a small piece of cut bait drifted back"],
      how: ["around dock pilings and seawalls", "on the jetty rocks with the bait drifting natural", "under the bridges on slack-to-moving water", "anywhere barnacled structure meets current"],
      note: "Summer mangroves are smart. Downsize the leader, hide the hook, and let the bait drift like it fell off the rocks."
    }
  ];

  const SPECIES_BY_NAME = Object.fromEntries(SPECIES.map((s) => [s.name, s]));

  function speciesClosedHere(species, location, monthIdx) {
    const closures = species.closed?.[location.stateRules];
    return Array.isArray(closures) && closures.includes(monthIdx + 1);
  }

  function pickTargets(location, day) {
    const monthIdx = Number(day.dateISO.slice(5, 7)) - 1;
    const windSpeed = windSpeedFor(day);
    const stormy = /thunder|storm/i.test(day.weatherFull || day.weather || "");
    const tidePoints = day.parts?.tide ?? 24;
    const water = state.data[state.locationKey]?.water ?? day.water ?? null;
    const seed = copySeed(location, day);
    const scored = SPECIES.map((species) => {
      let weight = (species.months[monthIdx] || 0) * (species.loc[state.locationKey] ?? species.loc[Object.keys(species.loc)[0]] ?? 1);
      if (speciesClosedHere(species, location, monthIdx)) weight = 0;
      if (species.surf && windSpeed >= 14) weight *= 0.3;
      if (species.surf && windSpeed >= 10) weight *= 0.7;
      if (stormy && species.surf) weight *= 0.4;
      if (species.key === "redfish" && tidePoints >= 30) weight *= 1.2;
      if (species.key === "flounder" && tidePoints >= 30) weight *= 1.15;
      if (water != null) {
        if (water <= 58 && ["sheepshead", "blackdrum"].includes(species.key)) weight *= 1.3;
        if (water <= 58 && ["spanish", "mangrove", "whitetrout"].includes(species.key)) weight *= 0.4;
        if (water >= 85 && species.key === "trout") weight *= 0.85;
      }
      // Deterministic daily jitter so near-ties rotate through the week.
      const jitter = 0.85 + (stableIndex(`${seed}|${species.key}`, 1000) / 1000) * 0.3;
      return { species, weight: weight * jitter };
    }).filter((entry) => entry.weight > 0.4).sort((a, b) => b.weight - a.weight);
    if (!scored.length) {
      const red = SPECIES[0];
      return { primary: red, backup: SPECIES_BY_NAME["Black drum"], monthIdx };
    }
    return { primary: scored[0].species, backup: scored[1]?.species || null, monthIdx };
  }

  // ── GCB Content Engine v2 · copy banks ───────────────────────────────────
  const COPY_HISTORY_KEY = "gcb-copy-history-v2";

  function readCopyHistory() {
    try {
      const stored = JSON.parse(localStorage.getItem(COPY_HISTORY_KEY) || "{}");
      return { headlines: Array.isArray(stored.headlines) ? stored.headlines : [], notes: Array.isArray(stored.notes) ? stored.notes : [] };
    } catch { return { headlines: [], notes: [] }; }
  }

  function rememberCopy(kind, value) {
    try {
      const history = readCopyHistory();
      if (history[kind][0] === value) return;
      history[kind] = [value, ...history[kind].filter((item) => item !== value)].slice(0, 6);
      localStorage.setItem(COPY_HISTORY_KEY, JSON.stringify(history));
    } catch { /* best effort */ }
  }

  function freshPick(options, seed, recent) {
    if (!options.length) return "";
    const start = stableIndex(seed, options.length);
    for (let step = 0; step < options.length; step += 1) {
      const candidate = options[(start + step) % options.length];
      if (!recent.includes(candidate)) return candidate;
    }
    return options[start];
  }

  const HEADLINES = {
    storm: ["Storm window. Watch the sky.", "Weather first. Fish the safe window.", "Storms around. Short trips only.", "Radar up. Pick your moment.", "Fish between the cells. Respect the sky.", "Rough sky. Quick, careful trips."],
    bigWind: ["Wind up. Stay protected.", "Breezy water. Work the lee shore.", "Blowing hard. Hug the lee.", "Whitecaps out front. Fish the back.", "Big breeze. Short casts.", "Play the wind. Find clean water.", "Wind-driven day. Tuck in tight."],
    hot: ["Green light. Go.", "Everything lines up.", "Prime water. Long morning.", "Strong tide, soft wind. Go early.", "Textbook morning. Do not sleep in.", "Big window. Clear the calendar.", "As good as it gets here.", "All of it working. Fish it hard.", "The good kind of morning.", "Bite is on. Be there at gray light."],
    good: ["Good water. Early bite.", "Solid setup. Start early.", "Moving water. Good morning.", "Honest morning bite ahead.", "Good swing. Ride the tide.", "Steady pull, steady bite.", "Fish the turn. It will pay.", "Real chances early. Take them.", "Clean water, moving bait.", "Better than average. Get out."],
    fair: ["Workable water. Pick the window.", "Half a chance. Take it.", "Grind it out. Stay mobile.", "Fish the turn, skip the slack.", "One good window. Make it count.", "Fish smart, not long.", "Slower day. Fish still eat.", "Pick your spots. Keep moving.", "Short trip, sharp focus.", "Earn it today."],
    slow: ["Slow water. Pick the turn.", "Tough sledding. Go light.", "Thin bite. Downsize everything.", "Scout day. Save the fuel.", "Quiet water. Lower the bar.", "Not much swing. Keep it short.", "Work for every bite today.", "Better days ahead. Sneak a window."],
    bigTide: ["Moving water. Work the seams.", "Strong swing. Follow the current.", "Big water moving. Stay on it.", "The tide does the work today."],
    smallTide: ["Small tide. Fish the change.", "Slow water. Pick the turn.", "Neap tide. Time the turns.", "Thin current. Hunt the drains."],
    clouds: ["Soft light. Solid bite.", "Cloud cover. Longer window.", "Gray sky, longer morning.", "Low light. Stretch the bite."],
    falling: ["Glass is falling. Fish now.", "Pressure sliding. Beat the front.", "Front coming. Fish ahead of it."],
    rising: ["Post-front water. Slow it down.", "Blue sky, tight bite. Go small.", "High pressure. Fish deep and slow."],
    bigMoon: ["Big moon. Big water.", "Spring tides. Strong seams."],
    coldSnap: ["Cold water. Slow hands.", "Winter rules. Deep and slow."],
    hotWater: ["Bath water. Dawn or nothing.", "Hot water. First light only."]
  };

  function headlineFor(location, day) {
    const windSpeed = windSpeedFor(day);
    const tidePoints = day.parts?.tide ?? 0;
    const sky = (day.weatherFull || day.weather || "").toLowerCase();
    const seed = copySeed(location, day);
    const water = state.data[state.locationKey]?.water ?? day.water ?? null;
    const trend = state.data[state.locationKey]?.baroTrend || "steady";
    const moon = moonPhaseFor(new Date(`${day.dateISO}T12:00:00`));

    let pool;
    if (/thunder|storm/.test(sky)) pool = HEADLINES.storm.slice();
    else if (windSpeed >= 18) pool = HEADLINES.bigWind.slice();
    else if (day.score >= 80) pool = HEADLINES.hot.slice();
    else if (day.score >= 65) pool = HEADLINES.good.slice();
    else if (day.score >= 45) pool = HEADLINES.fair.slice();
    else pool = HEADLINES.slow.concat([location.toughVerdict]);

    if (windSpeed < 18 && !/thunder|storm/.test(sky)) {
      if (tidePoints >= 32) pool = pool.concat(HEADLINES.bigTide);
      if (tidePoints <= 16) pool = pool.concat(HEADLINES.smallTide);
      if (day.score >= 60 && /cloud|overcast/.test(sky)) pool = pool.concat(HEADLINES.clouds);
      if (trend === "falling") pool = pool.concat(HEADLINES.falling);
      if (trend === "rising" && day.score < 75) pool = pool.concat(HEADLINES.rising);
      if (/full|new/i.test(moon.name)) pool = pool.concat(HEADLINES.bigMoon);
      if (water != null && water <= 56) pool = pool.concat(HEADLINES.coldSnap);
      if (water != null && water >= 87 && day.score >= 55) pool = pool.concat(HEADLINES.hotWater);
    }

    const local = locationFlavor();
    if (local && day.score >= 45 && windSpeed < 18 && !/thunder|storm/.test(sky)) {
      if (stableIndex(`${seed}|lochl`, 5) < 2) pool = local.headlines.slice();
      else pool = pool.concat(local.headlines);
    }
    const history = state.dayIndex === 0 ? readCopyHistory().headlines.slice(0, 4) : [];
    const headline = freshPick(pool, seed, history);
    if (state.dayIndex === 0 && state.status === "live") rememberCopy("headlines", headline);
    return headline;
  }

  // ── Field note composer ───────────────────────────────────────────────────
  function dailyFieldNote(location, day) {
    const windSpeed = windSpeedFor(day);
    const tidePoints = day.parts?.tide ?? 0;
    const sky = (day.weatherFull || day.weather || "").toLowerCase();
    const seed = copySeed(location, day);
    const targets = pickTargets(location, day);
    const species = targets.primary;
    const fish = species.name.toLowerCase();
    const bait = deterministicPick(species.baits, `${seed}|bait`);
    const how = deterministicPick(species.how, `${seed}|how`);
    const spotIndex = windSpeed >= 15 ? 1 : tidePoints >= 28 ? 0 : /clear|sunny/.test(sky) ? 2 : day.dayIdx;
    const spot = location.spots[spotIndex % location.spots.length];
    const trend = state.data[state.locationKey]?.baroTrend || "steady";
    const water = state.data[state.locationKey]?.water ?? day.water ?? null;
    const moon = moonPhaseFor(new Date(`${day.dateISO}T12:00:00`));
    const monthIdx = targets.monthIdx;

    const opening = day.score >= 80
      ? deterministicPick([
        `Strong setup for ${fish}. Start at ${spot.name} with ${bait}, ${how}.`,
        `Everything points to ${fish} today. Be at ${spot.name} before sunrise with ${bait}.`,
        `A morning to take seriously. ${species.name} first at ${spot.name}, ${bait} ${how}.`,
        `${species.name} should feed hard. Work ${bait} ${how} and stay until the current quits.`,
        `Prime ${fish} water. ${spot.name} first, ${bait} ready, and no second cup of coffee.`
      ], `${seed}|open`)
      : day.score >= 65
        ? deterministicPick([
          `The pieces line up for ${fish}. Make ${spot.name} the first stop with ${bait}.`,
          `Solid chance at ${fish} on the moving water. Try ${bait} ${how}.`,
          `A dependable morning if you fish it in order: ${spot.name} first, ${bait} ${how}.`,
          `Good sheet of water for ${fish}. Let ${spot.name} be the first read and adjust from there.`,
          `${species.name} are the call today. ${bait.charAt(0).toUpperCase() + bait.slice(1)} ${how} should get bit.`
        ], `${seed}|open`)
        : day.score >= 45
          ? deterministicPick([
            `A selective bite, but ${fish} will eat. Start at ${spot.name} with ${bait}.`,
            `Middle-of-the-road water. Give ${fish} thirty minutes at ${spot.name}, then move.`,
            `Not a banner day, but ${bait} ${how} should find a few ${fish}.`,
            `Keep it honest and stay mobile. ${species.name} first at ${spot.name}, then follow the bait.`,
            `One good window in this one. Spend it on ${fish} with ${bait}.`
          ], `${seed}|open`)
          : deterministicPick([
            `Expect to work for each bite. Start protected around ${spot.name} with ${bait} for ${fish}.`,
            `A scouting kind of day. Cover water near ${spot.name} and mark it for a better tide.`,
            `Thin bite likely. Two committed stops beat running the coast; start at ${spot.name}.`,
            `Low-percentage day. Keep the trip short and drop ${bait} where ${fish} ought to be.`,
            `Grinder's day. ${species.name} ${how} is the most honest bet going.`
          ], `${seed}|open`);

    const tideEvent = day.highTime && day.highTime !== "—" ? `the ${day.highTime} high` : day.lowTime && day.lowTime !== "—" ? `the ${day.lowTime} low` : day.window;
    const tide = tidePoints >= 30
      ? deterministicPick([
        `Good water movement; center the trip on ${day.window}.`,
        `The tide has enough swing to organize bait, so protect the ${day.window} window.`,
        `Plenty of current today. Let the swing around ${tideEvent} set the schedule.`,
        `Bait moves when the water moves; stay on it through ${day.window}.`,
        `Strong swing on the sheet; the current around ${tideEvent} will do half the work.`,
        `Real current today. The window at ${day.window} is worth guarding jealously.`,
        `Water will be moving hard around ${tideEvent}; build the morning backward from that.`
      ], `${seed}|tide`)
      : tidePoints <= 18
        ? deterministicPick([
          `Limited tide range; save the best casts for the turn around ${tideEvent}.`,
          `Water movement is modest. Fish the change near ${tideEvent}, then keep moving.`,
          `Neap-ish tide. The short burst of current near ${tideEvent} is the whole ballgame.`,
          `Small swing today, so drains and pinch points concentrate what current there is.`,
          `Not much tide to work with; hunt the spots that squeeze current out of nothing.`,
          `Soft tide day. Structure and shade matter more than the clock.`,
          `The swing is thin, which puts a premium on the minutes around ${tideEvent}.`
        ], `${seed}|tide`)
        : deterministicPick([
          `Moderate tide movement puts the best opportunity around ${day.window}.`,
          `The tide is workable rather than strong; concentrate effort on ${day.window}.`,
          `Enough current to matter around ${tideEvent}. Fish it rather than the slack.`,
          `A middling swing. Plan the first stop to line up with ${day.window}.`,
          `An average tide, honestly fished, beats a big one slept through; ${day.window} is the shift.`,
          `Decent movement around ${tideEvent}; not a flood, but enough to line the fish up.`,
          `Workable current through ${day.window}, then a long slack worth skipping.`
        ], `${seed}|tide`);

    const wind = /thunder|storm/.test(sky)
      ? deterministicPick(["Watch radar and leave yourself room to get off the water early.", "Fish between the cells and do not argue with lightning."], `${seed}|wind`)
      : windSpeed <= 8
        ? deterministicPick([
          "Light wind should leave clean, easy-to-read water.",
          "Calm wind favors long casts and subtle presentations.",
          "Slick water, so watch for nervous bait instead of birds.",
          "Barely a ripple; quiet approaches will out-fish noisy ones.",
          "Near-calm conditions, so every wake and every splash carries; fish like a heron.",
          "Glassy early. Downsize the leader and let the bait do the talking.",
          "Light air means honest sight-fishing; sunglasses matter more than lure color."
        ], `${seed}|wind`)
        : windSpeed <= 14
          ? deterministicPick([
            `The ${day.wind} mph breeze is manageable; favor the lee edge.`,
            `Enough wind to stack bait on the windward shorelines, so check them first.`,
            `Use the ${day.wind} mph wind for controlled drifts along protected edges.`,
            `A honest breeze today. The lee side stays readable; the open water goes dirty first.`,
            `Workable wind; drift the edges with it instead of fighting it on the trolling motor.`,
            `The breeze will put a walking chop on open water, which usually helps more than it hurts.`,
            `Enough wind to move the boat; set up drifts that end where the fish should be.`
          ], `${seed}|wind`)
          : deterministicPick([
            `With ${day.wind} mph, stay protected and shorten each cast.`,
            `The wind makes lee shorelines the whole game today.`,
            `That breeze will dirty the open water; find the clean seam and stay on it.`,
            `Big wind, small water: canals, lee banks, and tight structure.`,
            `Wind like this compresses the fishable water to a few protected pockets; commit to them.`,
            `Blowy. Anchor more, run less, and let the wind pin the bait for you.`,
            `A day for the sheltered third of the map; the open water is a spray ride, not a fishery.`
          ], `${seed}|wind`);

    const flavors = [];
    if (trend === "falling") flavors.push("The barometer is sliding, and fish often feed hard ahead of a front.");
    if (trend === "rising") flavors.push("Pressure is building behind the front; slow down and fish tight to structure.");
    if (/full|new/i.test(moon.name)) flavors.push(`The ${moon.name.toLowerCase()} brings bigger tides and well-defined current seams.`);
    if (/quarter/i.test(moon.name)) flavors.push(`Neap tides around the ${moon.name.toLowerCase()}, so pick the moving hours carefully.`);
    if (water != null && water >= 86) flavors.push(`Water is ${water}°, so oxygen and effort both run short by mid-morning.`);
    if (water != null && water <= 56) flavors.push(`At ${water}° the fish move half-speed. Crawl the bait and expect soft bites.`);
    if (monthIdx >= 8 && monthIdx <= 10 && species.key === "redfish" && species.fallNote) flavors.push(species.fallNote);
    if ((monthIdx >= 5 && monthIdx <= 7) && species.key === "trout" && species.summerNote) flavors.push(species.summerNote);
    if ((monthIdx <= 1 || monthIdx === 11) && species.winterNote) flavors.push(species.winterNote);
    if ((monthIdx >= 1 && monthIdx <= 3) && species.key === "sheepshead" && species.springNote) flavors.push(species.springNote);
    if (!flavors.length && /cloud|overcast/.test(sky)) flavors.push(deterministicPick([
      "Cloud cover should stretch the bite past the usual morning cutoff.",
      "Gray sky buys you an extra hour of shallow water; use it.",
      "The overcast keeps fish shallower and braver than the calendar says they should be.",
      "Soft light all morning, so the shallow bite may never fully shut off."
    ], `${seed}|skyline`));
    if (!flavors.length && /sun|clear/.test(sky)) flavors.push(deterministicPick([
      "Bright sky by mid-morning means shade lines and depth become the play.",
      "High sun will push fish to shade and depth; the early window is the honest one.",
      "Clear sky day: fish fast early, then slow and deep once the glare sets in.",
      "Full sun by nine, so treat the first light hours as the whole trip."
    ], `${seed}|skyline`));
    const flavor = flavors.length ? deterministicPick(flavors, `${seed}|flavor`) : "";

    const backup = targets.backup && targets.backup.key !== species.key
      ? deterministicPick([
        `If the ${fish} won't cooperate, ${targets.backup.name.toLowerCase()} are the fallback.`,
        `${targets.backup.name} make an honest plan B today.`,
        ""
      ], `${seed}|backup`)
      : "";

    const closer = deterministicPick([
      "After first light, follow the cleanest water toward shade and depth.",
      "As the sun climbs, shift to shade, depth, or faster current.",
      "Log what you catch; the pattern is worth more than the fish.",
      "When the water quits moving, so should you.",
      "If bait shows on top, everything else can wait.",
      "Check the nearest dock shade before you run home.",
      "Leave fish to find fish is a lie; stay until they quit.",
      "The second-best spot with moving water beats the best spot without it."
    ], `${seed}|close`);

    const local = locationFlavor();
    const localLine = local && stableIndex(`${seed}|uselocal`, 10) < 8
      ? deterministicPick(local.lines, `${seed}|local`)
      : "";
    const closerPool = local ? [closer, ...local.closers] : [closer];
    const finalCloser = deterministicPick(closerPool, `${seed}|finalclose`);
    const arrangement = stableIndex(`${state.locationKey}|${day.dateISO}|shape`, 3);
    const order = arrangement === 0
      ? [opening, tide, wind, localLine, flavor, backup, finalCloser]
      : arrangement === 1
        ? [opening, localLine, wind, tide, flavor, backup, finalCloser]
        : [opening, wind, tide, flavor, localLine, backup, finalCloser];
    const note = order.filter(Boolean).join(" ");
    if (state.dayIndex === 0 && state.status === "live") rememberCopy("notes", String(stableIndex(note, 999983)));
    return note;
  }

  // ── Weekly narrative ──────────────────────────────────────────────────────
  function weeklyNarrative(location, days) {
    if (!days || days.length < 3) return "";
    const seed = `${location.short}|${days[0].dateISO}|week`;
    const ranked = days.map((day, index) => ({ day, index })).sort((a, b) => b.day.score - a.day.score);
    const best = ranked[0];
    const worst = ranked[ranked.length - 1];
    const bestName = best.index === 0 ? "today" : best.day.label;
    const worstName = worst.index === 0 ? "today" : worst.day.label;
    const moonNow = moonPhaseFor(new Date(`${days[0].dateISO}T12:00:00`));
    const spread = best.day.score - worst.day.score;

    const opener = deterministicPick([
      `Looking across the week, ${bestName} is the morning to protect: a ${best.day.score} bite score with ${best.day.weather.toLowerCase()} and the best window at ${best.day.window}.`,
      `The week's high-water mark is ${bestName} — score ${best.day.score}, ${best.day.weather.toLowerCase()}, best water ${best.day.window}.`,
      `If you only get one trip this week, make it ${bestName}: ${best.day.score} score and a ${best.day.window} window.`
    ], seed);

    const caution = spread >= 18
      ? deterministicPick([
        ` The drop-off day is ${worstName} (${worst.day.score}); save errands for it.`,
        ` ${worstName.charAt(0).toUpperCase() + worstName.slice(1)} looks like the skip day at ${worst.day.score}.`,
        ` Plans are made for breaking, but ${worstName} at ${worst.day.score} is the one to trade away.`
      ], `${seed}|caution`)
      : deterministicPick([
        " The scores run close all week, so let wind and your schedule pick the morning.",
        " No dramatic swings in the sheet this week; any calm morning is playable.",
        ""
      ], `${seed}|caution`);

    const moonBit = /full|new/i.test(moonNow.name)
      ? ` The ${moonNow.name.toLowerCase()} means spring tides: more current, stronger seams, and a shorter, harder bite.`
      : /quarter/i.test(moonNow.name)
        ? ` A ${moonNow.name.toLowerCase()} moon keeps the tides modest, so the moving hours are precious.`
        : deterministicPick([
          ` The moon is ${moonNow.name.toLowerCase()}, building toward bigger water.`,
          ""
        ], `${seed}|moon`);

    const weekend = days.slice(0, 7).map((day, index) => ({ day, index })).filter(({ day }) => /^(Saturday|Sunday)$/.test(day.label));
    let weekendBit = "";
    if (weekend.length) {
      const bestWeekend = weekend.sort((a, b) => b.day.score - a.day.score)[0];
      weekendBit = deterministicPick([
        ` For the weekend crowd, ${bestWeekend.day.label} is the better half (${bestWeekend.day.score}).`,
        ` If you're limited to the weekend, ${bestWeekend.day.label} gets the nod at ${bestWeekend.day.score}.`,
        ""
      ], `${seed}|weekend`);
    }
    return opener + caution + moonBit + weekendBit;
  }

  // ── Season watch ─────────────────────────────────────────────────────────
  const SEASON_WATCH = [
    { // January
      arriving: ["Sheepshead staging on structure"], peaking: ["Black drum", "Redfish in the holes"], fading: ["White trout"],
      note: "Deep, slow, and patient wins the month. Trout stack in rivers and dredged holes, sheepshead start crowding the bridge legs, and black drum bite through the ugliest fronts. Watch for the warmest afternoon of the week rather than the prettiest morning.",
      tip: "Afternoon water on a sunny January day can run several degrees warmer than sunrise water. Fish bankers' hours."
    },
    { // February
      arriving: ["Big spawning sheepshead"], peaking: ["Sheepshead", "Black drum"], fading: [],
      note: "Sheepshead month. The spawn gathers the biggest convicts of the year on jetties, bridges, and markers, and they bite best on the warming trend between fronts. Florida trout are closed for harvest this month, which makes the structure bite the main event.",
      tip: "Bring twice the fiddler crabs you think you need. The pilings tax you one crab at a time."
    },
    { // March
      arriving: ["Pompano in the surf", "Spanish mackerel scouts"], peaking: ["Sheepshead", "Redfish on the flats"], fading: ["The deep winter pattern"],
      note: "The switch flips this month. The first green-water pompano show along the beaches, sheepshead finish their spawn, and redfish slide out of the holes onto warming flats. Every south-wind afternoon pushes more warm water and more bait inside.",
      tip: "The first 70° week wakes the flats up. Watch water temperature like a stock ticker."
    },
    { // April
      arriving: ["Spanish mackerel in numbers", "The first trout push"], peaking: ["Pompano run"], fading: ["Sheepshead"],
      note: "April is the fairest month on this coast: pompano in the troughs, Spanish under the birds, trout waking up over the grass, and reds everywhere in between. Bait schools return to the passes and everything with fins follows them in.",
      tip: "Carry a spoon rigged and ready. When Spanish blow up bait mid-drift, seconds count."
    },
    { // May
      arriving: ["Big gator trout", "Mangrove snapper"], peaking: ["Speckled trout", "Spanish mackerel"], fading: ["Pompano (moving through)"],
      note: "Prime trout time. The biggest specks of the year prowl shallow at first light before boat traffic builds, and topwater at gray light is as good as it gets. Snapper start creeping onto the docks and jetties as the water pushes past 75°.",
      tip: "The gator trout window is the half hour before you can see your topwater clearly. Set the alarm accordingly."
    },
    { // June
      arriving: ["Tarpon rolling the beaches", "White trout on the piers"], peaking: ["Trout early", "Mangrove snapper"], fading: [],
      note: "Summer pattern locks in: everything happens early or late. Trout feed hard at dawn then slide to deeper grass, mangroves get thick around every barnacled piling, and the first tarpon of the year roll down the beach in the calm mornings.",
      tip: "By 10 AM the bite belongs to shade, depth, and current. Before 7 AM it belongs to you."
    },
    { // July
      arriving: [], peaking: ["Mangrove snapper", "White trout at night"], fading: ["Mid-day everything"],
      note: "Hot water splits the day in two: a short, honest dawn bite and a fine night bite under the lights. Mangrove snapper are at their thickest and smartest, and the passes at daybreak hold everything that swims. Watch for afternoon storms building fast.",
      tip: "Night fishing under dock lights beats grinding the mid-day heat. Shrimp, light line, quiet approach."
    },
    { // August
      arriving: ["The first mullet schools"], peaking: ["Mangrove snapper", "Redfish in the passes"], fading: [],
      note: "The dog days, fished at the edges. Bull reds start gathering around the passes ahead of fall, snapper stay thick on structure, and the first finger-mullet schools hint at what September brings. Storms rearrange the sandbars weekly; scout the surf after each blow.",
      tip: "Follow the mullet. Every predator on this coast is about to do the same."
    },
    { // September
      arriving: ["The mullet run", "Bull redfish schools"], peaking: ["Redfish", "Flounder feeding up"], fading: ["Summer crowds"],
      note: "The mullet run turns the beach and the passes into a moving buffet. Bull reds school on the bars, flounder feed hard ahead of their fall move, and the first north winds clean the bays. The crowds leave; the fish don't.",
      tip: "A finger mullet fished near any pass in September is never a wasted cast."
    },
    { // October
      arriving: ["Fall trout in the bays", "Pompano's second run"], peaking: ["Bull redfish", "Flounder run"], fading: ["Mangrove snapper"],
      note: "October is the payoff month: cool nights, clean water, big tides, and every inshore fish feeding like it's rent day. The flounder run peaks as fish stack at the passes on their way out — check your state's closure dates before keeping one.",
      tip: "First cold front week: fish the day before the front like it's the last day of the season. It fishes like it."
    },
    { // November
      arriving: ["The winter drum bite"], peaking: ["Bull reds", "Trout schooling deep"], fading: ["Spanish mackerel"],
      note: "The transition month. Trout gang up in deeper holes as the shallows cool, bull reds linger at the passes, and sheepshead start drifting back to structure. Flounder are closed in Alabama all month (and Florida through Nov 30) — plan accordingly.",
      tip: "Birds working over deep bay water in November usually means trout underneath. Ease in, cut the motor early."
    },
    { // December
      arriving: ["Sheepshead returning to structure"], peaking: ["Black drum", "Redfish in the holes"], fading: ["The fall run"],
      note: "Quiet water and honest fishing. The winter pattern sets: deep holes, slow presentations, warm afternoons over sunrise heroics. Black drum and sheepshead carry the month, with redfish schooled up and sight-fishable on the calm, clear days.",
      tip: "Winter reds school tight and spook easy. One good cast beats five fast ones."
    }
  ];

  // ── GCB Content Engine v2 · render modules ───────────────────────────────
  const EXTRA_ICONS = {
    "Flounder": `<svg viewBox="0 0 150 82" role="img" aria-label="Flounder silhouette"><path class="fish-body" d="M20 44 6 34l5 12-4 12 14-9c14 12 44 16 78 8 16-4 28-10 36-18-9-9-22-14-38-16-33-4-64 3-77 15Z"/><path class="fish-detail" d="M32 42c22-8 52-9 84-2M44 33l8 9m-6 16 9-9m30-14 7 9m8-11 5 8"/><circle class="fish-eye" cx="118" cy="34" r="2.2"/><circle class="fish-eye" cx="126" cy="40" r="2.2"/></svg>`,
    "Sheepshead": `<svg viewBox="0 0 150 82" role="img" aria-label="Sheepshead silhouette"><path class="fish-body" d="M24 45 8 30l6 14-5 14 15-11c9 14 30 22 52 20 25-2 45-14 54-30-9-13-28-21-50-21-30 0-56 13-72 34Z"/><path class="fish-detail" d="M52 21v42M68 17v50M84 16v52M100 18v46M114 23v36"/><circle class="fish-eye" cx="126" cy="34" r="2.3"/></svg>`,
    "Pompano": `<svg viewBox="0 0 150 82" role="img" aria-label="Pompano silhouette"><path class="fish-body" d="M28 42 8 26l8 16-7 17 19-13c10 15 30 24 50 23 23-1 42-14 52-31-11-14-30-22-52-21-27 1-50 12-62 25Z"/><path class="fish-detail" d="M40 39c24-11 56-12 84-2M64 15l6 14m20 36 8-13m14-32 8 12"/><circle class="fish-eye" cx="124" cy="30" r="2.2"/></svg>`,
    "Spanish mackerel": `<svg viewBox="0 0 150 82" role="img" aria-label="Spanish mackerel silhouette"><path class="fish-body" d="M18 40 4 28l4 13-3 12 13-9c16 10 48 14 80 8 15-3 27-8 37-15-10-8-24-13-41-15-34-4-66 2-76 14Z"/><path class="fish-detail" d="M30 38c26-8 60-9 92-1M52 24l7 9m-4 18 8-8"/><g class="trout-spots"><circle cx="72" cy="34" r="2.2"/><circle cx="86" cy="30" r="2"/><circle cx="98" cy="35" r="2.2"/><circle cx="110" cy="30" r="2"/></g><circle class="fish-eye" cx="130" cy="32" r="2"/></svg>`,
    "Black drum": `<svg viewBox="0 0 150 82" role="img" aria-label="Black drum silhouette"><path class="fish-body" d="M26 46 10 32l6 13-5 13 15-9c8 12 26 20 46 20 26 0 48-13 58-30-10-12-28-19-48-20-29-1-56 10-72 27Z"/><path class="fish-detail" d="M58 20v44M74 17v50M90 18v46M106 22v38M118 56c2 3 5 5 8 5m-14-3c1 2 3 4 5 5"/><circle class="fish-eye" cx="122" cy="33" r="2.3"/></svg>`,
    "White trout": `<svg viewBox="0 0 160 72" role="img" aria-label="White trout silhouette"><path class="fish-body" d="M19 37 3 17l5 21-5 19 17-16c27 13 78 17 119-2 7-3 13-7 18-12-7-5-14-8-22-10C91 7 43 18 19 37Z"/><path class="fish-detail" d="M31 34c31-10 69-10 105-2M55 19l11 12m-9 21 13-13m46-22 11 12"/><circle class="fish-eye" cx="143" cy="25" r="2.2"/></svg>`,
    "Mangrove snapper": `<svg viewBox="0 0 150 82" role="img" aria-label="Mangrove snapper silhouette"><path class="fish-body" d="M24 44 8 30l6 13-5 13 15-10c10 13 30 21 50 20 25-1 45-13 55-29-9-12-26-19-46-20-30-2-58 9-75 27Z"/><path class="fish-detail" d="M36 41c24-10 56-11 86-3M56 22l9 11m-7 20 10-10m32-20 8 10M112 30l10-6"/><circle class="fish-eye" cx="122" cy="32" r="2.3"/></svg>`
  };

  function targetIconFor(name) {
    return TARGET_ICONS[name] || EXTRA_ICONS[name] || TARGET_ICONS.Redfish;
  }

  function renderTarget(location, day) {
    const targets = pickTargets(location, day);
    const species = targets.primary;
    const seed = copySeed(location, day);
    const bait = deterministicPick(species.baits, `${seed}|bait`);
    el("target-species").textContent = species.name;
    el("target-fish-icon").innerHTML = targetIconFor(species.name);
    const baitLine = bait.replace(/^(a|an) /, "");
    el("target-bait").textContent = baitLine.charAt(0).toUpperCase() + baitLine.slice(1);
    const why = el("target-why");
    if (why) why.textContent = species.note;
    const alt = el("target-backup");
    if (alt) alt.textContent = targets.backup ? `Also working: ${targets.backup.name}` : "";
  }

  function renderWeekly(location, days) {
    const summary = el("weekly-summary");
    if (!summary) return;
    summary.textContent = state.status === "live" && days.length >= 3
      ? weeklyNarrative(location, days)
      : "The weekly read is generated from the live NOAA and NWS feed once it loads.";
  }

  function renderSeasonWatch(location) {
    const container = el("season-watch-content");
    if (!container) return;
    const monthIdx = new Date().getMonth();
    const entry = SEASON_WATCH[monthIdx];
    const monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][monthIdx];
    const list = (items) => items.length ? items.map((item) => `<li>${escapeHTML(item)}</li>`).join("") : "<li>Quiet for now</li>";
    container.innerHTML = `
      <div class="season-columns">
        <div><span>Arriving</span><ul>${list(entry.arriving)}</ul></div>
        <div><span>Peaking</span><ul>${list(entry.peaking)}</ul></div>
        <div><span>Fading</span><ul>${list(entry.fading)}</ul></div>
      </div>
      <p class="season-note">${escapeHTML(entry.note)}</p>
      <p class="season-tip"><strong>${escapeHTML(monthName)} tip:</strong> ${escapeHTML(entry.tip)}</p>`;
    const label = el("season-watch-month");
    if (label) label.textContent = `${monthName} on the water`;
  }

  // ── Live look (beach cams) ────────────────────────────────────────────────
  const CAMS = {
    pensacola: { id: "890WmHX7h6U", label: "Pensacola Beach · SRIA East Cam", src: "Santa Rosa Island Authority", link: "https://visitpensacolabeach.com/web-cams-east-view/" },
    perdido: { id: "Qoouv_9QG5Q", label: "Perdido Key · Live Beach Cam", src: "ENCO Electronic Systems", link: "https://www.youtube.com/watch?v=Qoouv_9QG5Q" },
    "orange-beach": { id: "5Ijk8QsR-nw", label: "Orange Beach · Live Beach Cam", src: "FOX10 News", link: "https://www.youtube.com/watch?v=5Ijk8QsR-nw" },
    "gulf-shores": { id: "pJqrjIuvGFE", label: "Gulf beachfront · Turquoise Place Cam", src: "Spectrum Resorts", link: "https://www.youtube.com/watch?v=pJqrjIuvGFE" },
    mobile: { id: "N5wWOVOTHmQ", label: "Fairhope Pier · Mobile Bay Cam", src: "City of Fairhope", link: "https://www.youtube.com/watch?v=N5wWOVOTHmQ" },
    dauphin: { id: "Kckw310hYgA", label: "Dauphin Island Sea Lab · Live Cam", src: "FOX10 News · Dauphin Island Sea Lab", link: "https://www.youtube.com/watch?v=Kckw310hYgA" }
  };
  let lastCamKey = null;

  function renderLiveLook() {
    const media = el("livelook-media");
    if (!media) return;
    const cam = CAMS[state.locationKey];
    const section = el("livelook");
    if (!cam) { if (section) section.hidden = true; return; }
    if (section) section.hidden = false;
    if (state.locationKey === lastCamKey) return;
    lastCamKey = state.locationKey;
    el("livelook-label").textContent = `Live look · ${cam.label}`;
    el("livelook-attr").innerHTML = `Source: <a href="${escapeHTML(cam.link)}" target="_blank" rel="noopener">${escapeHTML(cam.src)}</a>`;
    media.innerHTML = `<div class="livelook-play" role="button" tabindex="0" aria-label="Play live camera"><img alt="${escapeHTML(cam.label)}" src="https://i.ytimg.com/vi/${cam.id}/hqdefault.jpg" loading="lazy"><span class="livelook-button" aria-hidden="true"><span></span></span><span class="livelook-badge">LIVE</span></div>`;
    const play = media.querySelector(".livelook-play");
    const go = () => { media.innerHTML = `<iframe src="https://www.youtube.com/embed/${cam.id}?autoplay=1" title="${escapeHTML(cam.label)}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen loading="lazy"></iframe>`; };
    play.addEventListener("click", go);
    play.addEventListener("keydown", (event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); go(); } });
  }

  // ── Community catch board ────────────────────────────────────────────────
  const BOARD_API = "/.netlify/functions/catches";

  function boardCard(entry) {
    const when = new Date(entry.at);
    const date = `${when.getMonth() + 1}/${when.getDate()}`;
    const place = entry.privacy === "area" || !entry.water ? escapeHTML(entry.region || "") : `${escapeHTML(entry.water)} · ${escapeHTML(entry.region || "")}`;
    let html = "<article>";
    if (entry.hasPhoto) html += `<img loading="lazy" alt="${escapeHTML(entry.species)}" src="${BOARD_API}?img=${encodeURIComponent(entry.id)}" class="board-photo">`;
    html += `<span>${date} · ${escapeHTML(entry.name)}</span>`;
    html += `<h3>${escapeHTML(entry.species)} <small>${entry.length && entry.length !== "—" ? `${escapeHTML(entry.length)} in` : ""}</small></h3>`;
    html += `<p>${place}${entry.score ? ` · bite ${escapeHTML(entry.score)}` : ""}</p>`;
    if (entry.note && entry.note !== "No field note") html += `<blockquote>“${escapeHTML(entry.note)}”</blockquote>`;
    return html + "</article>";
  }

  function renderCatchOfTheWeek(entries) {
    const slot = el("catch-week");
    if (!slot) return;
    const weekAgo = Date.now() - 10 * 864e5;
    const candidates = entries.filter((entry) => new Date(entry.at).getTime() > weekAgo);
    const pool = candidates.length ? candidates : entries;
    if (!pool.length) { slot.hidden = true; return; }
    const best = pool.slice().sort((a, b) =>
      (b.hasPhoto ? 1 : 0) - (a.hasPhoto ? 1 : 0)
      || (parseFloat(b.length) || 0) - (parseFloat(a.length) || 0)
      || new Date(b.at) - new Date(a.at)
    )[0];
    slot.hidden = false;
    const when = new Date(best.at);
    slot.innerHTML = `
      ${best.hasPhoto ? `<img alt="${escapeHTML(best.species)}" src="${BOARD_API}?img=${encodeURIComponent(best.id)}" loading="lazy">` : `<span class="catch-week-stamp" aria-hidden="true">${targetIconFor(best.species)}</span>`}
      <div>
        <p class="eyebrow">Catch of the week</p>
        <h3>${escapeHTML(best.species)}${best.length && best.length !== "—" ? ` · ${escapeHTML(best.length)}"` : ""}</h3>
        <p>${escapeHTML(best.name)} · ${escapeHTML(best.water || best.region || "")} · ${when.getMonth() + 1}/${when.getDate()}</p>
        ${best.note && best.note !== "No field note" ? `<blockquote>“${escapeHTML(best.note)}”</blockquote>` : ""}
      </div>`;
  }

  async function loadBoard() {
    const list = el("board-list");
    if (!list) return;
    try {
      const response = await fetch(BOARD_API, { cache: "no-store" });
      const payload = await response.json();
      const entries = payload?.catches || [];
      const empty = el("board-empty");
      if (!entries.length) {
        list.innerHTML = "";
        if (empty) empty.hidden = false;
        renderCatchOfTheWeek([]);
        return;
      }
      if (empty) empty.hidden = true;
      list.innerHTML = entries.map(boardCard).join("");
      renderCatchOfTheWeek(entries);
      renderLeaderboard(entries);
    } catch { /* board is progressive enhancement */ }
  }

  // ── Share-to-board fields in the catch modal ─────────────────────────────
  let sharePhotoData = "";
  let sharePhotoBusy = false;

  function resizeSharePhoto(file, done) {
    const image = new Image();
    image.onload = () => {
      try {
        let { width, height } = image;
        const max = 1280;
        if (width > max || height > max) {
          if (width > height) { height = Math.round(height * max / width); width = max; }
          else { width = Math.round(width * max / height); height = max; }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width; canvas.height = height;
        canvas.getContext("2d").drawImage(image, 0, 0, width, height);
        let data = canvas.toDataURL("image/jpeg", 0.78);
        if (data.length > 430000) data = canvas.toDataURL("image/jpeg", 0.55);
        if (data.length > 430000) {
          const smaller = document.createElement("canvas");
          smaller.width = Math.round(width * 0.7); smaller.height = Math.round(height * 0.7);
          smaller.getContext("2d").drawImage(image, 0, 0, smaller.width, smaller.height);
          data = smaller.toDataURL("image/jpeg", 0.55);
        }
        done(data.length <= 430000 ? data : "");
      } catch { done(""); }
      URL.revokeObjectURL(image.src);
    };
    image.onerror = () => done("");
    image.src = URL.createObjectURL(file);
  }

  function setupShareFields() {
    const optIn = el("share-optin");
    if (!optIn) return;
    const fields = el("share-fields");
    optIn.addEventListener("change", () => {
      fields.classList.toggle("share-enabled", optIn.checked);
      fields.querySelectorAll("input,select").forEach((input) => { input.disabled = !optIn.checked; });
    });
    el("share-photo").addEventListener("change", (event) => {
      sharePhotoData = "";
      const file = event.target.files && event.target.files[0];
      const status = el("share-status");
      if (!file) { sharePhotoBusy = false; return; }
      sharePhotoBusy = true;
      status.textContent = "Preparing photo…";
      resizeSharePhoto(file, (data) => {
        sharePhotoData = data;
        sharePhotoBusy = false;
        status.textContent = data ? "Photo ready." : "Couldn’t read that photo — use a JPG or PNG file.";
      });
    });
  }

  function submitShare(form) {
    if (!el("share-optin")?.checked) return;
    const location = LOCATIONS[state.locationKey];
    const privacy = el("share-privacy").value;
    const payload = {
      optIn: true,
      name: el("share-name").value || "",
      species: String(form.get("species") || "").trim(),
      length: String(form.get("length") || "").trim(),
      region: location.short,
      water: privacy === "area" ? "" : String(form.get("spot") || ""),
      privacy,
      note: String(form.get("note") || "").trim(),
      score: String(el("bite-score").textContent || ""),
      tide: el("high-tide-time").textContent !== "—" ? `high ${el("high-tide-time").textContent}` : "",
      photo: sharePhotoData
    };
    let attempts = 0;
    const send = () => {
      if (sharePhotoBusy && attempts < 20) { attempts += 1; window.setTimeout(send, 400); return; }
      payload.photo = sharePhotoData;
      fetch(BOARD_API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
        .then(() => { sharePhotoData = ""; window.setTimeout(loadBoard, 1200); showToast("Shared. Your catch appears on the board after a quick review."); })
        .catch(() => {});
    };
    send();
  }

  // ── Barometer + observed wind + wave fallback (folded from patches) ─────
  async function fetchBaro(location) {
    const station = location.tempStation || "8729840";
    const response = await getJSON(`https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=air_pressure&application=gulfcoastbite&station=${station}&date=recent&units=english&time_zone=lst_ldt&format=json`);
    const data = response?.data;
    if (!data || !data.length) throw new Error("No pressure data");
    const last = Number(data[data.length - 1].v);
    const earlier = Number(data[Math.max(0, data.length - 31)].v);
    const delta = last - earlier;
    return {
      inHg: (last * 0.02953).toFixed(2),
      trend: delta <= -0.6 ? "falling" : delta >= 0.6 ? "rising" : "steady"
    };
  }

  async function fetchObservedWind(location) {
    const station = location.tempStation || "8729840";
    const response = await getJSON(`https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=wind&application=gulfcoastbite&station=${station}&date=latest&units=english&time_zone=lst_ldt&format=json`);
    const observation = response?.data?.[0];
    if (!observation || observation.s === "") throw new Error("No wind observation");
    const observedAt = new Date(observation.t.replace(" ", "T"));
    const age = Date.now() - observedAt.getTime();
    if (age < 0 || age >= 75 * 60000) throw new Error("Stale wind observation");
    return { label: `${observation.dr || ""} ${Math.round(parseFloat(observation.s) * 1.15078)}`.trim() };
  }

  async function fetchWaveFallback(location) {
    const point = await getJSON(`https://api.weather.gov/points/${location.lat},${location.lon}`);
    const grid = await getJSON(point.properties.forecastGridData);
    const values = grid?.properties?.waveHeight?.values;
    if (!values || !values.length) throw new Error("No wave data");
    const now = Date.now();
    let current = null;
    for (const value of values) {
      const starts = new Date(value.validTime.split("/")[0]).getTime();
      if (starts <= now) current = value.value; else break;
    }
    if (current == null) current = values[0].value;
    const feet = current * 3.28084;
    return { height: feet < 1 ? Number(feet.toFixed(1)) : Math.round(feet), period: null };
  }

  function renderBaro() {
    const baro = state.data[state.locationKey]?.baro;
    if (!baro) return;
    el("baro-pressure").textContent = `${baro.inHg} inHg`;
    el("baro-label").textContent = `Pressure · ${baro.trend.charAt(0).toUpperCase()}${baro.trend.slice(1)}`;
  }

  // ── GCB Wave 1 · trends, condition capture, journal patterns ─────────────

  // Snapshot the conditions shown right now, stored with each logged catch so
  // personal patterns can emerge over time.
  function captureConditions() {
    const data = state.data[state.locationKey];
    const day = (currentDays() || [])[state.dayIndex] || {};
    const moon = day.dateISO ? moonPhaseFor(new Date(`${day.dateISO}T12:00:00`)) : null;
    const score = parseInt(el("bite-score")?.textContent, 10);
    return {
      score: Number.isFinite(score) ? score : (day.score ?? null),
      water: data?.water ?? day.water ?? null,
      wind: day.wind || null,
      windDir: (day.wind || "").match(/^[A-Z]{1,3}/)?.[0] || null,
      windMph: Number((day.wind || "").match(/\d+/)?.[0]) || null,
      tideHigh: day.highTime && day.highTime !== "—" ? day.highTime : null,
      tideLow: day.lowTime && day.lowTime !== "—" ? day.lowTime : null,
      moon: moon?.name || null,
      baroTrend: data?.baroTrend || null,
      weather: day.weatherFull || day.weather || null,
      month: day.dateISO ? Number(day.dateISO.slice(5, 7)) : (new Date().getMonth() + 1),
      loc: state.locationKey
    };
  }

  // ── 7-day bite trend chart ───────────────────────────────────────────────
  function renderTrend(days) {
    const chart = el("trend-chart");
    const caption = el("trend-caption");
    if (!chart) return;
    if (!days || !days.length) {
      caption.textContent = "The seven-day outlook loads with the live NOAA / NWS feed.";
      return;
    }
    const week = days.slice(0, 7);
    const max = Math.max(...week.map((d) => d.score), 60);
    const min = Math.min(...week.map((d) => d.score), 40);
    const span = Math.max(1, max - min);
    const bars = week.map((day, index) => {
      const pct = 18 + Math.round(((day.score - min) / span) * 72);
      const band = day.score >= 80 ? "hot" : day.score >= 65 ? "good" : day.score >= 45 ? "fair" : "slow";
      const dow = day.label === "Today" ? "Today" : (day.date.split("·")[0] || day.label).trim();
      const selected = index === state.dayIndex ? " is-selected" : "";
      return `<button type="button" class="trend-bar ${band}${selected}" data-trend-day="${index}" style="--h:${pct}%" aria-label="${escapeHTML(day.date)}, bite score ${day.score}">
        <span class="trend-score">${day.score}</span>
        <span class="trend-fill"></span>
        <span class="trend-dow">${escapeHTML(dow)}</span>
      </button>`;
    }).join("");
    chart.innerHTML = bars;
    chart.querySelectorAll("[data-trend-day]").forEach((b) => b.addEventListener("click", () => selectDay(Number(b.dataset.trendDay), true)));

    const ranked = week.map((d, i) => ({ d, i })).sort((a, b) => b.d.score - a.d.score);
    const best = ranked[0];
    const bestName = best.i === 0 ? "Today" : (best.d.date.split("·")[0] || best.d.label).trim();
    const data = state.data[state.locationKey];
    const wt = data?.waterTrend;
    const wtBit = wt && wt.dir !== "steady" ? ` Water is ${wt.dir} (${wt.now}°F).` : (data?.water != null ? ` Water is holding near ${data.water}°F.` : "");
    caption.textContent = `Best morning this week: ${bestName} at ${best.d.score}, window ${best.d.window}.${wtBit}`;

    const legend = el("trend-watertemp");
    if (legend) {
      const now = data?.water ?? null;
      const arrow = wt ? (wt.dir === "rising" ? " ↑" : wt.dir === "falling" ? " ↓" : "") : "";
      legend.textContent = now != null ? `Water ${now}°F${arrow}` : "Water —°F";
    }
  }

  async function fetchWaterTrend(location) {
    const station = location.tempStation;
    const response = await getJSON(`https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=water_temperature&application=gulfcoastbite&station=${station}&date=recent&units=english&time_zone=lst_ldt&format=json`);
    const data = response?.data;
    if (!data || data.length < 6) throw new Error("No water series");
    const clean = data.filter((d) => d.v !== "" && !Number.isNaN(Number(d.v)));
    if (clean.length < 6) throw new Error("Sparse water series");
    const now = Number(clean[clean.length - 1].v);
    const earlier = Number(clean[Math.max(0, clean.length - Math.min(clean.length - 1, 72))].v);
    const delta = now - earlier;
    return { now: Math.round(now), dir: delta >= 1.2 ? "rising" : delta <= -1.2 ? "falling" : "steady", delta: Math.round(delta * 10) / 10 };
  }

  // ── Your patterns (private journal analysis) ─────────────────────────────
  const MONTH_ABBR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  function topOf(counts) {
    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return entries.length ? entries[0] : null;
  }

  function renderYourPatterns() {
    const panel = el("your-patterns");
    if (!panel) return;
    const catches = state.catches || [];
    if (catches.length < 3) { panel.hidden = true; return; }
    panel.hidden = false;

    const species = {}, spots = {};
    let biggest = null;
    const withCond = catches.filter((c) => c.conditions);
    catches.forEach((c) => {
      const sp = (c.species || "").trim(); if (sp) species[sp] = (species[sp] || 0) + 1;
      const loc = (c.spot || "").trim(); if (loc) spots[loc] = (spots[loc] || 0) + 1;
      const len = parseFloat(c.length);
      if (Number.isFinite(len) && (!biggest || len > parseFloat(biggest.length))) biggest = c;
    });

    const tiles = [];
    tiles.push(`<div><span>Logged</span><strong>${catches.length}</strong><small>catches</small></div>`);
    const topSp = topOf(species);
    if (topSp) tiles.push(`<div><span>Most caught</span><strong>${escapeHTML(topSp[0])}</strong><small>${topSp[1]}× logged</small></div>`);
    const topSpot = topOf(spots);
    if (topSpot) tiles.push(`<div><span>Best water</span><strong>${escapeHTML(topSpot[0])}</strong><small>${topSpot[1]} catches</small></div>`);
    if (biggest) tiles.push(`<div><span>Personal best</span><strong>${escapeHTML(biggest.length)}"</strong><small>${escapeHTML(biggest.species)}</small></div>`);

    // Condition patterns only appear once catches carry captured conditions.
    let condLine = "";
    if (withCond.length >= 3) {
      const scores = withCond.map((c) => c.conditions.score).filter((s) => Number.isFinite(s));
      const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
      const moons = {}, winds = {}, tides = {}, months = {};
      withCond.forEach((c) => {
        const k = c.conditions;
        if (k.moon) moons[k.moon] = (moons[k.moon] || 0) + 1;
        if (k.windDir) winds[k.windDir] = (winds[k.windDir] || 0) + 1;
        const tide = k.baroTrend ? k.baroTrend : null;
        if (tide) tides[tide] = (tides[tide] || 0) + 1;
        if (k.month) { const m = MONTH_ABBR[k.month - 1]; months[m] = (months[m] || 0) + 1; }
      });
      const bits = [];
      if (avgScore != null) bits.push(`you catch on days scoring around <strong>${avgScore}</strong>`);
      const tw = topOf(winds); if (tw && tw[1] >= 2) bits.push(`most often on a <strong>${tw[0]}</strong> wind`);
      const tm = topOf(moons); if (tm && tm[1] >= 2) bits.push(`around the <strong>${tm[0].toLowerCase()}</strong>`);
      const tmon = topOf(months); if (tmon && tmon[1] >= 2) bits.push(`your hot month is <strong>${tmon[0]}</strong>`);
      if (bits.length) condLine = `<p class="patterns-insight">Your pattern so far: ${bits.join(", ")}.</p>`;
    } else {
      condLine = `<p class="patterns-insight patterns-building">Keep logging — once a few catches carry their conditions, this shows the tide, wind, and moon you catch best on.</p>`;
    }

    panel.innerHTML = `<div class="patterns-head"><p class="eyebrow">Your patterns</p></div><div class="patterns-tiles">${tiles.join("")}</div>${condLine}`;
  }

  // ── Location voice · makes the six waters read like six different places ─
  const LOCATION_FLAVOR = {
    pensacola: {
      headlines: ["Bay's talking. Listen early.", "Three Mile kind of morning.", "Sound side. First light."],
      lines: [
        "Watch the shadow lines under Three Mile before the sun gets over the span.",
        "If the bay chops up, the sound behind Pickens stays honest.",
        "Bob Sikes gets picked over by 8; be the first one on the shadow line or skip it.",
        "The East Bay grass drains hold bait even when the big bay is rolling.",
        "Check the color change where the pass meets the bay; the clean side wins.",
        "A slow troll down the Scenic Highway bluffs finds the schools the bridges miss."
      ],
      closers: ["The bay rewards the first boat, not the best one.", "If Three Mile is a parking lot, East Bay never is."]
    },
    perdido: {
      headlines: ["Pass water. Go look.", "Old River morning.", "Johnson Beach is calling."],
      lines: [
        "The jetty seam at Perdido Pass sorts itself out about an hour into the push.",
        "Boat traffic ruins Old River by 9; the docks fish best before the rentals wake up.",
        "Walk Johnson Beach until you find the cut; don't cast until you do.",
        "The Ono side stays clean when the pass gets washed out.",
        "The flats behind the state park hold reds that never see the pass crowd.",
        "Check the tide line at the Theo Baars bridge on your way in; it tells you the day."
      ],
      closers: ["The pass gives you one good hour. Be in position for it.", "When in doubt on the Key, fish shade and current and keep quiet."]
    },
    "orange-beach": {
      headlines: ["Point's on. Move now.", "Canal morning. Stay tucked.", "Cotton Bayou early."],
      lines: [
        "Alabama Point clears first on the incoming; the color line is your starting gun.",
        "The Ono canals are a fallback, not a consolation; big reds winter and summer both.",
        "Watch for bait balls off Robinson Island as traffic pushes fish off the flats.",
        "Terry Cove docks hold fish through the middle of the day when the pass dies.",
        "Cotton Bayou's grass edge fishes best before the tour boats start their runs.",
        "The rock line off the point taxes tackle; bring double leaders and go anyway."
      ],
      closers: ["Beat the charter fleet out or fish behind them; there's no in-between here.", "The point turns on fast and off faster. Stay ready to run."]
    },
    "gulf-shores": {
      headlines: ["Lagoon first. Always.", "Pier's holding bait.", "Bon Secour backup."],
      lines: [
        "Little Lagoon Pass pinches all the current on the island; time the turn and be there.",
        "Watch what the pier regulars are throwing before you rig; they've been on it since dawn.",
        "The lagoon's west end mud warms first and wakes up first.",
        "Bon Secour's river mouth saves the day every time the Gulf blows out.",
        "The surf between the pier and the state park recuts after every storm; scout before you commit.",
        "Fort Morgan's flats are a run, but they fish empty on weekdays."
      ],
      closers: ["The pier tells the truth about the beach. Walk it before you commit.", "When the Gulf says no, the lagoon usually says yes."]
    },
    mobile: {
      headlines: ["Causeway rips are working.", "Delta water moving.", "Bay's flat. Run the rigs."],
      lines: [
        "The causeway rips show you exactly where the water is moving; fish the visible seams.",
        "The gas rigs sort by wind; pick the rig with current pushing bait against the legs.",
        "Birds over deep shell in the middle bay mean trout under them nine times out of ten.",
        "The delta's warm-water outflows carry bait even on the ugliest days.",
        "Dixey Bar is a sea state call; the fish are there, the question is whether you should be.",
        "Watch the river stage; a rising Mobile River muddies the north bay before the south feels it."
      ],
      closers: ["This bay is big water; fish the piece of it that's moving, not the piece that's close.", "On Mobile Bay the birds do the scouting. Let them."]
    },
    dauphin: {
      headlines: ["Bridge current's right.", "West end walk day.", "Back bays are clean."],
      lines: [
        "The bridge fishes in lanes; find the piling with current seam and shadow together.",
        "The west end cuts re-carve after every blow; the newest cut is usually the fishiest.",
        "Aloe Bay stays workable on a hard south wind when the front beach is lost.",
        "Sand Island's bar line holds bull reds that the bridge crowd never sees.",
        "The grass behind the island is the calm-day sight-fishing card; ease in, push pole or drift.",
        "Check the Katrina Cut rocks on a moving tide; big fish patrol the rubble line."
      ],
      closers: ["The island fishes on current, period. No movement, no bite, no exceptions.", "One island, four fisheries. Pick by the wind, not by habit."]
    }
  };

  function locationFlavor() {
    return LOCATION_FLAVOR[state.locationKey] || null;
  }

  // ── Water watch · red tide status for local waters (FWC HAB samples) ─────
  const HAB_QUERY_URL = "https://gis.myfwc.com/mapping/rest/services/Open_Data/Recent_Harmful_Algal_Bloom__HAB__Events_2024_present/MapServer/7/query";
  // Bounding box: Dauphin Island to Navarre, nearshore band.
  const HAB_BBOX = { xmin: -88.45, ymin: 29.9, xmax: -86.75, ymax: 30.75 };

  function habSeverity(text) {
    const t = String(text || "").toLowerCase();
    if (/high/.test(t)) return 4;
    if (/medium|moderate/.test(t)) return 3;
    if (/low/.test(t)) return 2;
    if (/very low|present|background/.test(t)) return 1;
    if (/not present|not observed|none/.test(t)) return 0;
    return 1;
  }

  async function fetchRedTide() {
    const since = Date.now() - 30 * 864e5;
    const params = new URLSearchParams({
      where: "1=1",
      geometry: JSON.stringify({ ...HAB_BBOX, spatialReference: { wkid: 4326 } }),
      geometryType: "esriGeometryEnvelope",
      inSR: "4326",
      spatialRel: "esriSpatialRelIntersects",
      outFields: "SAMPLE_DATE,LOCATION,NAME,COUNT_",
      orderByFields: "SAMPLE_DATE DESC",
      resultRecordCount: "60",
      f: "json"
    });
    const response = await getJSON(`${HAB_QUERY_URL}?${params}`);
    const rows = (response.features || []).map((f) => f.attributes)
      .filter((a) => a.SAMPLE_DATE && a.SAMPLE_DATE >= since)
      .filter((a) => /karenia/i.test(a.NAME || ""));
    if (!rows.length) return { state: "clear", samples: 0 };
    let worst = { severity: 0 };
    rows.forEach((a) => {
      const severity = habSeverity(a.COUNT_);
      if (severity >= worst.severity) worst = { severity, location: a.LOCATION, count: a.COUNT_, when: a.SAMPLE_DATE };
    });
    return { state: worst.severity >= 2 ? "active" : "background", samples: rows.length, worst };
  }

  function renderWaterWatch() {
    const box = el("water-watch");
    if (!box) return;
    const status = state.redTide;
    if (!status) {
      box.innerHTML = `<span class="ww-dot ww-unknown" aria-hidden="true"></span><div><strong>Red tide</strong><small>Checking FWC's latest local samples… <a href="https://myfwc.com/research/redtide/statewide/" target="_blank" rel="noopener">FWC statewide status ↗</a></small></div>`;
      return;
    }
    if (status.error) {
      box.innerHTML = `<span class="ww-dot ww-unknown" aria-hidden="true"></span><div><strong>Red tide</strong><small>Live sample feed unavailable. Check <a href="https://myfwc.com/research/redtide/statewide/" target="_blank" rel="noopener">FWC's statewide status ↗</a></small></div>`;
      return;
    }
    if (status.state === "clear") {
      box.innerHTML = `<span class="ww-dot ww-clear" aria-hidden="true"></span><div><strong>Red tide: none reported locally</strong><small>No Karenia brevis samples in Panhandle-area waters in FWC's last 30 days of data. <a href="https://myfwc.com/research/redtide/statewide/" target="_blank" rel="noopener">FWC status ↗</a></small></div>`;
    } else if (status.state === "background") {
      box.innerHTML = `<span class="ww-dot ww-back" aria-hidden="true"></span><div><strong>Red tide: background levels only</strong><small>${status.samples} recent local sample${status.samples === 1 ? "" : "s"}, none above low concentration. <a href="https://myfwc.com/research/redtide/statewide/" target="_blank" rel="noopener">FWC status ↗</a></small></div>`;
    } else {
      const when = status.worst?.when ? new Date(status.worst.when).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "";
      box.innerHTML = `<span class="ww-dot ww-active" aria-hidden="true"></span><div><strong>Red tide detected in area sampling</strong><small>${escapeHTML(status.worst?.count || "Elevated")} — ${escapeHTML(status.worst?.location || "local waters")}${when ? " · " + when : ""}. Verify before fishing or wading: <a href="https://myfwc.com/research/redtide/statewide/" target="_blank" rel="noopener">FWC status ↗</a></small></div>`;
    }
  }

  async function loadWaterWatch() {
    if (!el("water-watch")) return;
    try { state.redTide = await fetchRedTide(); }
    catch { state.redTide = { error: true }; }
    renderWaterWatch();
  }

  // ── Community leaderboard (last 30 days of shared catches) ──────────────
  function renderLeaderboard(entries) {
    const box = el("board-leaders");
    if (!box) return;
    const monthAgo = Date.now() - 30 * 864e5;
    const recent = entries.filter((e) => new Date(e.at).getTime() > monthAgo);
    if (recent.length < 3) { box.hidden = true; return; }
    const byAngler = {};
    let big = null;
    recent.forEach((e) => {
      const name = (e.name || "Angler").trim();
      byAngler[name] = (byAngler[name] || 0) + 1;
      const len = parseFloat(e.length);
      if (Number.isFinite(len) && (!big || len > parseFloat(big.length))) big = e;
    });
    const top = Object.entries(byAngler).sort((a, b) => b[1] - a[1]).slice(0, 3);
    box.hidden = false;
    box.innerHTML = `<span class="leaders-label">This month on the board</span>
      <div class="leaders-row">
        ${top.map(([name, n], i) => `<div><span>${["Most catches", "Runner-up", "Third"][i]}</span><strong>${escapeHTML(name)}</strong><small>${n} shared</small></div>`).join("")}
        ${big ? `<div><span>Biggest fish</span><strong>${escapeHTML(big.length)}" ${escapeHTML(big.species)}</strong><small>${escapeHTML(big.name)}</small></div>` : ""}
      </div>`;
  }

  // ── Bite alert signup (interim transport: FormSubmit → owner inbox) ─────
  function setupAlerts() {
    const form = el("alerts-form");
    if (!form) return;
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const status = el("alerts-status");
      const email = el("alert-email").value.trim();
      if (!email) return;
      status.textContent = "Signing you up…";
      fetch("https://formsubmit.co/ajax/r.mcgarryrandall@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: "Bite alert signup — " + el("alert-loc").value,
          type: "bite-alert-signup",
          email,
          location: el("alert-loc").value,
          mode: el("alert-mode").value,
          page: location.href
        })
      }).then((r) => {
        if (!r.ok) throw new Error("send failed");
        form.reset();
        status.textContent = "You're on the list. First alerts start rolling out this month.";
      }).catch(() => {
        status.textContent = "Couldn't sign you up just now — email r.mcgarryrandall@gmail.com and we'll add you by hand.";
      });
    });
  }

  const state = {
    locationKey: "perdido",
    redTide: null,
    dayIndex: 0,
    spotIndex: 0,
    status: "loading",
    catches: [],
    data: Object.create(null),
    pending: Object.create(null),
    lastFocus: null
  };

  const el = (id) => document.getElementById(id);
  const escapeHTML = (value) => String(value ?? "").replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
  const pad = (n) => (n < 10 ? `0${n}` : String(n));
  const ymd = (d) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
  const isoDay = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const dateLabel = (d) => `${["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()]} · ${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][d.getMonth()]} ${d.getDate()}`;
  const weekdayName = (d) => ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][d.getDay()];

  function moonPhaseFor(date) {
    const synodicMonth = 29.53058867;
    const knownNewMoon = Date.UTC(2000, 0, 6, 18, 14);
    const age = ((date.getTime() - knownNewMoon) / 864e5 % synodicMonth + synodicMonth) % synodicMonth;
    const index = Math.round(age / synodicMonth * 8) % 8;
    return [
      { name: "New moon", icon: "🌑" },
      { name: "Waxing crescent", icon: "🌒" },
      { name: "First quarter", icon: "🌓" },
      { name: "Waxing gibbous", icon: "🌔" },
      { name: "Full moon", icon: "🌕" },
      { name: "Waning gibbous", icon: "🌖" },
      { name: "Last quarter", icon: "🌗" },
      { name: "Waning crescent", icon: "🌘" }
    ][index];
  }

  const SOLUNAR_TIME_ZONE = "America/Chicago";
  const SOLUNAR_RAD = Math.PI / 180;
  const SOLUNAR_DAY_MS = 864e5;
  const SOLUNAR_CACHE = new Map();
  const SOLUNAR_CLOCK = new Intl.DateTimeFormat("en-US", {
    timeZone: SOLUNAR_TIME_ZONE,
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });
  const SOLUNAR_ZONE_PARTS = new Intl.DateTimeFormat("en-US", {
    timeZone: SOLUNAR_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23"
  });

  function addISODays(dateISO, amount) {
    const date = new Date(`${dateISO}T12:00:00Z`);
    date.setUTCDate(date.getUTCDate() + amount);
    return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
  }

  function zonedDateTime(dateISO, hour = 0, minute = 0) {
    const [year, month, day] = dateISO.split("-").map(Number);
    const target = Date.UTC(year, month - 1, day, hour, minute, 0);
    let instant = target;
    for (let pass = 0; pass < 2; pass += 1) {
      const values = Object.fromEntries(SOLUNAR_ZONE_PARTS.formatToParts(new Date(instant)).filter((part) => part.type !== "literal").map((part) => [part.type, Number(part.value)]));
      const observed = Date.UTC(values.year, values.month - 1, values.day, values.hour, values.minute, values.second);
      instant += target - observed;
    }
    return new Date(instant);
  }

  function moonAltitudeAt(date, lat, lon) {
    const days = date.getTime() / SOLUNAR_DAY_MS - .5 + 2440588 - 2451545;
    const meanLongitude = SOLUNAR_RAD * (218.316 + 13.176396 * days);
    const meanAnomaly = SOLUNAR_RAD * (134.963 + 13.064993 * days);
    const meanDistance = SOLUNAR_RAD * (93.272 + 13.22935 * days);
    const longitude = meanLongitude + SOLUNAR_RAD * 6.289 * Math.sin(meanAnomaly);
    const latitude = SOLUNAR_RAD * 5.128 * Math.sin(meanDistance);
    const obliquity = SOLUNAR_RAD * 23.4397;
    const rightAscension = Math.atan2(Math.sin(longitude) * Math.cos(obliquity) - Math.tan(latitude) * Math.sin(obliquity), Math.cos(longitude));
    const declination = Math.asin(Math.sin(latitude) * Math.cos(obliquity) + Math.cos(latitude) * Math.sin(obliquity) * Math.sin(longitude));
    const sidereal = SOLUNAR_RAD * (280.16 + 360.9856235 * days) + SOLUNAR_RAD * lon;
    const hourAngle = sidereal - rightAscension;
    const phi = SOLUNAR_RAD * lat;
    let altitude = Math.asin(Math.sin(phi) * Math.sin(declination) + Math.cos(phi) * Math.cos(declination) * Math.cos(hourAngle));
    const refractionBase = Math.max(0, altitude);
    altitude += .0002967 / Math.tan(refractionBase + .00312536 / (refractionBase + .08901179));
    return altitude;
  }

  function compactTimeRange(center, halfMinutes) {
    const start = SOLUNAR_CLOCK.format(new Date(center.getTime() - halfMinutes * 60000));
    const end = SOLUNAR_CLOCK.format(new Date(center.getTime() + halfMinutes * 60000));
    const startSuffix = start.match(/ (AM|PM)$/)?.[1];
    const endSuffix = end.match(/ (AM|PM)$/)?.[1];
    return startSuffix && startSuffix === endSuffix ? `${start.replace(/ (AM|PM)$/, "")}–${end}` : `${start}–${end}`;
  }

  function pickDayPeriods(events, start, end, halfMinutes, limit = 2) {
    const halfWindow = halfMinutes * 60000;
    const noon = (start.getTime() + end.getTime()) / 2;
    return events
      .filter((event) => event.time.getTime() + halfWindow > start.getTime() && event.time.getTime() - halfWindow < end.getTime())
      .sort((a, b) => {
        const aInside = a.time >= start && a.time < end ? 1 : 0;
        const bInside = b.time >= start && b.time < end ? 1 : 0;
        return bInside - aInside || Math.abs(a.time.getTime() - noon) - Math.abs(b.time.getTime() - noon);
      })
      .slice(0, limit)
      .sort((a, b) => a.time - b.time);
  }

  function calculateSolunarPeriods(dateISO, lat, lon) {
    const key = `${dateISO}|${lat.toFixed(4)}|${lon.toFixed(4)}`;
    if (SOLUNAR_CACHE.has(key)) return SOLUNAR_CACHE.get(key);

    const start = zonedDateTime(dateISO);
    const end = zonedDateTime(addISODays(dateISO, 1));
    const step = 5 * 60000;
    const sampleStart = start.getTime() - 14 * 3600000;
    const sampleEnd = end.getTime() + 14 * 3600000;
    const samples = [];
    for (let time = sampleStart; time <= sampleEnd; time += step) {
      samples.push({ time, altitude: moonAltitudeAt(new Date(time), lat, lon) });
    }

    const transits = [];
    for (let index = 1; index < samples.length - 1; index += 1) {
      const previous = samples[index - 1].altitude;
      const current = samples[index].altitude;
      const next = samples[index + 1].altitude;
      const isHigh = current > previous && current >= next;
      const isLow = current < previous && current <= next;
      if (!isHigh && !isLow) continue;
      const denominator = previous - 2 * current + next;
      const offset = denominator ? Math.max(-1, Math.min(1, .5 * (previous - next) / denominator)) : 0;
      transits.push({
        time: new Date(samples[index].time + offset * step),
        label: isHigh ? "Moon overhead" : "Moon underfoot"
      });
    }

    const horizon = .133 * SOLUNAR_RAD;
    const horizonEvents = [];
    for (let index = 1; index < samples.length; index += 1) {
      const previous = samples[index - 1];
      const current = samples[index];
      const rising = previous.altitude < horizon && current.altitude >= horizon;
      const setting = previous.altitude >= horizon && current.altitude < horizon;
      if (!rising && !setting) continue;
      const fraction = (horizon - previous.altitude) / (current.altitude - previous.altitude);
      horizonEvents.push({
        time: new Date(previous.time + Math.max(0, Math.min(1, fraction)) * step),
        label: rising ? "Moonrise" : "Moonset"
      });
    }

    const result = {
      major: pickDayPeriods(transits, start, end, 60),
      minor: pickDayPeriods(horizonEvents, start, end, 30)
    };
    SOLUNAR_CACHE.set(key, result);
    return result;
  }

  function fmtClock(hour, minute) {
    const suffix = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${pad(minute)} ${suffix}`;
  }

  function fmtT(value) {
    const match = /(\d{2}):(\d{2})$/.exec(value || "");
    return match ? fmtClock(Number(match[1]), Number(match[2])) : value;
  }

  function fmtHourDecimal(value) {
    let hour = (value + 24) % 24;
    let whole = Math.floor(hour);
    let minute = Math.round((hour - whole) * 60 / 5) * 5;
    if (minute === 60) { minute = 0; whole = (whole + 1) % 24; }
    return { h: whole, m: minute };
  }

  function sunriseHour(d, lat, lon) {
    const radians = Math.PI / 180;
    const day = Math.floor((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(d.getFullYear(), 0, 0)) / 864e5);
    const lngHour = lon / 15;
    const approx = day + (6 - lngHour) / 24;
    const mean = .9856 * approx - 3.289;
    const longitude = (mean + 1.916 * Math.sin(mean * radians) + .02 * Math.sin(2 * mean * radians) + 282.634 + 360) % 360;
    let ascension = (Math.atan(.91764 * Math.tan(longitude * radians)) / radians + 360) % 360;
    ascension += 90 * Math.floor(longitude / 90) - 90 * Math.floor(ascension / 90);
    ascension /= 15;
    const sinDeclination = .39782 * Math.sin(longitude * radians);
    const cosDeclination = Math.cos(Math.asin(sinDeclination));
    const cosHour = (Math.cos(90.833 * radians) - sinDeclination * Math.sin(lat * radians)) / (cosDeclination * Math.cos(lat * radians));
    if (cosHour > 1 || cosHour < -1) return 6;
    const hourAngle = (360 - Math.acos(cosHour) / radians) / 15;
    const localMean = hourAngle + ascension - .06571 * approx - 6.622;
    let utc = (localMean - lngHour) % 24;
    if (utc < 0) utc += 24;
    let local = (utc - d.getTimezoneOffset() / 60) % 24;
    if (local < 0) local += 24;
    return local;
  }

  function parseWind(speed, direction) {
    const values = (speed || "").match(/\d+/g) || [8];
    const average = Math.round(values.reduce((sum, value) => sum + Number(value), 0) / values.length);
    return { avg: average, label: `${direction || ""} ${average}`.trim() };
  }

  function hourOf(value) {
    const match = /(\d{2}):(\d{2})$/.exec(value || "");
    return match ? Number(match[1]) + Number(match[2]) / 60 : 9;
  }

  function scoreParts(range, windAverage, precipitation, forecast) {
    const tide = Math.round(Math.max(6, Math.min(40, 24 * range)));
    const wind = windAverage <= 7 ? 35 : Math.round(Math.max(4, 35 - (windAverage - 7) * 2.4));
    const text = (forecast || "").toLowerCase();
    let sky = /thunder|storm/.test(text) ? 4 : /heavy rain/.test(text) ? 8 : /rain|showers|drizzle/.test(text) ? 12 : /partly|mostly cloudy|overcast|broken|cloud/.test(text) ? 25 : /sunny|clear|fair/.test(text) ? 18 : 16;
    sky = Math.max(0, Math.round(sky - .12 * (precipitation || 0)));
    return { score: Math.max(15, Math.min(97, tide + wind + sky)), tide, wind, sky };
  }

  function stableIndex(seed, length) {
    let hash = 2166136261;
    for (const char of String(seed)) {
      hash ^= char.charCodeAt(0);
      hash = Math.imul(hash, 16777619);
    }
    return Math.abs(hash >>> 0) % length;
  }

  function deterministicPick(options, seed) {
    return options[stableIndex(seed, options.length)];
  }

  function windSpeedFor(day) {
    return Number((day.wind || "").match(/\d+/)?.[0] || 0);
  }

  function copySeed(location, day) {
    return [location.short, day.dateISO, day.score, day.parts?.tide, day.parts?.wind, day.parts?.sky, day.wind, day.weatherFull || day.weather].join("|");
  }


  function shortWeather(value) {
    const text = (value || "").toLowerCase();
    if (/thunder/.test(text)) return "T-storms";
    if (/freezing/.test(text)) return "Freezing";
    if (/heavy rain/.test(text)) return "Heavy rain";
    if (/rain|showers/.test(text)) return "Showers";
    if (/drizzle/.test(text)) return "Drizzle";
    if (/fog|haze/.test(text)) return "Fog";
    if (/snow|sleet|wintry/.test(text)) return "Snow";
    if (/partly sunny|partly cloudy|mostly sunny/.test(text)) return "Partly cloudy";
    if (/mostly cloudy|overcast|broken clouds/.test(text)) return "Cloudy";
    if (/cloud/.test(text)) return "Clouds";
    if (/sunny|fair/.test(text)) return "Sunny";
    if (/clear/.test(text)) return "Clear";
    const word = text.split(" ")[0] || "Weather";
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  function noteFor(forecast, windAverage) {
    if (/thunder|storm|rain/i.test(forecast || "")) return "Storms in the forecast. Fish the early window and watch the radar between moves.";
    if (windAverage <= 8) return "Light wind early—glassy pockets before the sea breeze fills in.";
    if (windAverage <= 14) return "A workable breeze. Start the lee shorelines and follow the moving tide.";
    return "Wind builds fast—stay protected and fish tight to structure.";
  }


  function windowFor(d, lat, lon, events) {
    const sunrise = sunriseHour(d, lat, lon);
    const target = sunrise + 1;
    let best = null;
    let distance = Infinity;
    events.forEach((event) => {
      const hour = hourOf(event.t);
      if (hour >= 4.5 && hour <= 13.5 && Math.abs(hour - target) < distance) {
        distance = Math.abs(hour - target);
        best = hour;
      }
    });
    if (best === null) best = target;
    const start = Math.max(4.75, best - 1.5);
    const end = start + 3;
    const a = fmtHourDecimal(start);
    const b = fmtHourDecimal(end);
    const aHour = a.h % 12 || 12;
    const bHour = b.h % 12 || 12;
    const sameSuffix = (a.h >= 12) === (b.h >= 12);
    const first = sameSuffix ? `${aHour}:${pad(a.m)}` : `${aHour}:${pad(a.m)} ${a.h >= 12 ? "PM" : "AM"}`;
    return `${first}–${bHour}:${pad(b.m)} ${b.h >= 12 ? "PM" : "AM"}`;
  }

  async function getJSON(url) {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 12000);
    try {
      const response = await fetch(url, { signal: controller.signal, headers: { Accept: "application/geo+json, application/json" } });
      if (!response.ok) throw new Error(`${response.status} from ${url}`);
      return response.json();
    } finally {
      window.clearTimeout(timeout);
    }
  }

  async function fetchWave(station) {
    return getJSON(`/api/waves?station=${encodeURIComponent(station)}`);
  }

  async function fetchMarineAlerts(zones) {
    const responses = await Promise.all(zones.map((zone) => getJSON(`https://api.weather.gov/alerts/active/zone/${zone}`).catch(() => ({ features: [] }))));
    const seen = new Set();
    return responses.flatMap((response) => response.features || []).filter((feature) => {
      const event = feature.properties?.event || "";
      const relevant = /small craft|gale|storm|hurricane|tropical|special marine|hazardous seas/i.test(event);
      if (!relevant || seen.has(feature.id)) return false;
      seen.add(feature.id);
      return true;
    });
  }

  function sampleDays(location) {
    const today = new Date();
    const samples = [
      { weather: "Clear", score: 82, parts: { tide: 33, wind: 31, sky: 18 }, air: 84, wind: "ESE 8", water: 82, tide: "High tide", tideTime: "9:42 AM", highTime: "9:42 AM", lowTime: "5:18 PM", window: "7:30–10:30 AM" },
      { weather: "Showers", score: 74, parts: { tide: 34, wind: 28, sky: 12 }, air: 81, wind: "SE 11", water: 81, tide: "High tide", tideTime: "10:31 AM", highTime: "10:31 AM", lowTime: "6:04 PM", window: "6:45–9:15 AM" },
      { weather: "Partly cloudy", score: 68, parts: { tide: 30, wind: 20, sky: 18 }, air: 86, wind: "S 14", water: 83, tide: "High tide", tideTime: "11:18 AM", highTime: "11:18 AM", lowTime: "6:51 PM", window: "5:50–8:20 AM" }
    ];
    return samples.map((sample, index) => {
      const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + index);
      const score = Math.max(15, Math.min(97, sample.score + location.scoreAdjust));
      return { ...sample, score, label: index === 0 ? "Today" : weekdayName(date), date: dateLabel(date), dateISO: isoDay(date), note: index === 0 ? location.note : "Start early, watch the wind, and use the cleanest moving water you can find.", curve: null, events: [], dayIdx: index };
    });
  }

  async function loadLocation(key) {
    if (state.data[key]) return state.data[key];
    if (state.pending[key]) return state.pending[key];
    const location = LOCATIONS[key];
    const today = new Date();
    state.pending[key] = (async () => {
      let daily;
      let hourly;
      let weatherError;
      const weatherPoints = [{ lat: location.lat, lon: location.lon }, ...(location.weatherPoints || [])];
      for (const weatherPoint of weatherPoints) {
        try {
          const point = await getJSON(`https://api.weather.gov/points/${weatherPoint.lat},${weatherPoint.lon}`);
          [daily, hourly] = await Promise.all([
            getJSON(point.properties.forecast),
            getJSON(point.properties.forecastHourly)
          ]);
          break;
        } catch (error) {
          weatherError = error;
        }
      }
      if (!daily || !hourly) throw weatherError || new Error("No live weather grid available");
      const [curve, highLow, waterResponse] = await Promise.all([
        getJSON(`https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=predictions&station=${location.tideStation}&begin_date=${ymd(today)}&range=168&datum=MLLW&units=english&time_zone=lst_ldt&interval=30&format=json`),
        getJSON(`https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=predictions&station=${location.tideStation}&begin_date=${ymd(today)}&range=192&datum=MLLW&units=english&time_zone=lst_ldt&interval=hilo&format=json`),
        getJSON(`https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=water_temperature&station=${location.tempStation}&date=latest&units=english&time_zone=lst_ldt&format=json`).catch(() => null)
      ]);
      const water = waterResponse?.data?.[0] ? Math.round(Number(waterResponse.data[0].v)) : null;
      const currentPeriod = hourly.properties.periods[0];
      const currentWind = parseWind(currentPeriod.windSpeed, currentPeriod.windDirection);
      const days = [];

      for (let index = 0; index < 7; index += 1) {
        const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + index);
        const iso = isoDay(date);
        const period = daily.properties.periods.find((item) => item.isDaytime && item.startTime.slice(0, 10) === iso) || daily.properties.periods.find((item) => item.startTime.slice(0, 10) === iso);
        const points = (curve.predictions || []).filter((item) => item.t.slice(0, 10) === iso);
        const events = (highLow.predictions || []).filter((item) => item.t.slice(0, 10) === iso);
        if (!period && !points.length) break;
        const values = points.map((item) => Number(item.v));
        const range = values.length ? Math.max(...values) - Math.min(...values) : 1.2;
        const wind = parseWind(period?.windSpeed, period?.windDirection);
        const precipitation = period?.probabilityOfPrecipitation?.value || 0;
        const forecast = period?.shortForecast || "";
        const label = forecast.split(/ then /i)[0];
        const highEvent = events.find((event) => event.type === "H");
        const lowEvent = events.find((event) => event.type === "L");
        const tideEvent = highEvent || lowEvent;
        const parts = scoreParts(range, wind.avg, precipitation, forecast);
        days.push({
          label: index === 0 ? "Today" : weekdayName(date),
          date: dateLabel(date),
          dateISO: iso,
          weather: shortWeather(forecast),
          weatherFull: label,
          score: parts.score,
          parts,
          window: windowFor(date, location.lat, location.lon, events),
          air: index === 0 ? currentPeriod.temperature : period?.temperature ?? "—",
          wind: index === 0 ? currentWind.label : wind.label,
          water,
          tide: tideEvent ? (tideEvent.type === "H" ? "High tide" : "Low tide") : "Tide",
          tideTime: tideEvent ? fmtT(tideEvent.t) : "—",
          highTime: highEvent ? fmtT(highEvent.t) : "—",
          lowTime: lowEvent ? fmtT(lowEvent.t) : "—",
          note: noteFor(forecast, wind.avg),
          curve: points,
          events,
          dayIdx: index
        });
      }
      if (!days.length) throw new Error("No forecast days returned");
      const [wave, marineAlerts, baro, obsWind, waterTrend] = await Promise.all([
        fetchWave(location.buoyStation).catch(() => fetchWaveFallback(location).catch(() => null)),
        fetchMarineAlerts(location.alertZones).catch(() => []),
        fetchBaro(location).catch(() => null),
        fetchObservedWind(location).catch(() => null),
        fetchWaterTrend(location).catch(() => null)
      ]);
      if (obsWind && days[0]) days[0].wind = obsWind.label;
      const result = { days, water, wave, marineAlerts, baro, baroTrend: baro?.trend || "steady", waterTrend, updated: new Date() };
      state.data[key] = result;
      delete state.pending[key];
      return result;
    })().catch((error) => {
      delete state.pending[key];
      throw error;
    });
    return state.pending[key];
  }

  function currentDays() {
    return state.data[state.locationKey]?.days || sampleDays(LOCATIONS[state.locationKey]);
  }

  function buildPath(points) {
    if (!points || points.length < 2) return "";
    const values = points.map((point) => Number(point.v));
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min || .5;
    const x = (index) => 10 + 636 * index / (points.length - 1);
    const y = (value) => 154 - (value - min) / span * 124;
    let path = `M${x(0).toFixed(1)} ${y(values[0]).toFixed(1)}`;
    for (let index = 0; index < points.length - 1; index += 1) {
      const x1 = x(index);
      const y1 = y(values[index]);
      const x2 = x(index + 1);
      const y2 = y(values[index + 1]);
      path += ` Q${x1.toFixed(1)} ${y1.toFixed(1)} ${((x1 + x2) / 2).toFixed(1)} ${((y1 + y2) / 2).toFixed(1)}`;
    }
    path += ` L646 ${y(values.at(-1)).toFixed(1)}`;
    return path;
  }

  function markerFor(points, isToday, events) {
    if (!points || points.length < 2) return { x: 340, y: 39 };
    let fraction;
    if (isToday) {
      const now = new Date();
      fraction = (now.getHours() + now.getMinutes() / 60) / 24;
    } else {
      const event = events?.find((item) => item.type === "H") || events?.[0];
      fraction = event ? hourOf(event.t) / 24 : .4;
    }
    fraction = Math.max(0, Math.min(1, fraction));
    const values = points.map((point) => Number(point.v));
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min || .5;
    const fractionalIndex = fraction * (points.length - 1);
    const index = Math.floor(fractionalIndex);
    const value = values[index] + (values[Math.min(points.length - 1, index + 1)] - values[index]) * (fractionalIndex - index);
    return { x: 10 + 636 * fraction, y: 154 - (value - min) / span * 124 };
  }

  function renderLocations() {
    el("location-controls").innerHTML = Object.entries(LOCATIONS).map(([key, location]) => `<button type="button" data-location="${key}" class="${key === state.locationKey ? "selected" : ""}" aria-pressed="${key === state.locationKey}">${escapeHTML(location.short)}</button>`).join("");
    el("location-controls").querySelectorAll("button").forEach((button) => button.addEventListener("click", () => selectLocation(button.dataset.location)));
  }

  function renderDays(days) {
    const start = state.dayIndex < 3 ? 0 : Math.min(state.dayIndex - 2, Math.max(0, days.length - 3));
    el("day-buttons").innerHTML = days.slice(start, start + 3).map((day, offset) => {
      const index = start + offset;
      return `<button type="button" data-day="${index}" class="${index === state.dayIndex ? "selected" : ""}" aria-pressed="${index === state.dayIndex}" aria-label="${escapeHTML(day.label)}, bite score ${day.score} of 100"><span class="ds-info"><span class="ds-day">${escapeHTML(day.label)}</span><b>${escapeHTML(day.weather)}${day.air != null && day.air !== "—" ? ` · ${escapeHTML(day.air)}°` : ""}</b></span><span class="ds-score"><em>${day.score}</em><small>Bite</small></span></button>`;
    }).join("");
    el("day-buttons").querySelectorAll("button").forEach((button) => button.addEventListener("click", () => selectDay(Number(button.dataset.day), false)));
  }

  function renderScoreFactors(parts) {
    const factors = [["Tide", parts.tide, 40], ["Wind", parts.wind, 35], ["Sky", parts.sky, 25]];
    el("bite-factors").innerHTML = factors.map(([name, value, max]) => `<div class="bf-row"><span class="bf-label">${name}</span><span class="bf-track"><span class="bf-fill" style="width:${Math.round(value / max * 100)}%"></span></span><b>${value}</b></div>`).join("");
  }

  function renderTide(day, index) {
    const live = day.curve?.length > 1;
    const path = live ? buildPath(day.curve) : SAMPLE_PATHS[Math.min(index, 2)];
    const marker = live ? markerFor(day.curve, day.dayIdx === 0, day.events) : { x: 340 + 32 * Math.min(index, 2), y: 39 };
    el("tide-line").setAttribute("d", path);
    el("tide-fill").setAttribute("d", `${path} L646 158 L10 158 Z`);
    el("tide-marker").setAttribute("x1", marker.x);
    el("tide-marker").setAttribute("x2", marker.x);
    el("tide-dot").setAttribute("cx", marker.x);
    el("tide-dot").setAttribute("cy", marker.y);
  }

  function renderSpots(location) {
    el("spot-list").innerHTML = location.spots.map((spot, index) => `<button type="button" data-spot="${index}" class="${index === state.spotIndex ? "selected" : ""}" aria-pressed="${index === state.spotIndex}"><span class="spot-sketch" aria-hidden="true">${SPOT_SKETCHES[index % SPOT_SKETCHES.length]}</span><strong>${escapeHTML(spot.name)}</strong><small>${escapeHTML(spot.detail)}</small><em>${escapeHTML(spot.rating)}</em></button>`).join("");
    el("spot-list").querySelectorAll("button").forEach((button) => button.addEventListener("click", () => {
      state.spotIndex = Number(button.dataset.spot);
      renderSpots(location);
      updateCatchSpotOptions(location);
    }));
    const selected = location.spots[state.spotIndex];
    el("spot-detail").innerHTML = `<strong>${escapeHTML(selected.name)}:</strong> ${escapeHTML(selected.tip)}`;
  }

  function mapURL(address) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  }

  function renderShops(location) {
    el("shop-list").innerHTML = location.shops.map((shop) => `<article class="shop-card"><span>${escapeHTML(shop.area)} · Live bait</span><h3>${escapeHTML(shop.name)}</h3><p>${escapeHTML(shop.description)}<br>${escapeHTML(shop.address)}</p><div class="shop-actions"><a href="tel:+1${shop.phone.replace(/\D/g, "")}">Call ${escapeHTML(shop.phone)}</a><a href="${escapeHTML(mapURL(shop.address))}" target="_blank" rel="noopener">Directions ↗</a><a href="${escapeHTML(shop.website)}" target="_blank" rel="noopener">Shop details ↗</a></div></article>`).join("");
  }

  function renderRegulations(location) {
    const rules = REGULATIONS[location.stateRules];
    el("regulations-state").textContent = rules.label;
    el("regulations-list").innerHTML = rules.species.map((fish) => `<article><h3>${escapeHTML(fish.name)}</h3><div><span>Legal size</span><strong>${escapeHTML(fish.size)}</strong></div><div><span>Bag limit</span><strong>${escapeHTML(fish.bag)}</strong></div><p>${escapeHTML(fish.note)}</p></article>`).join("");
    const link = el("regulations-link");
    link.href = rules.url;
    link.textContent = `Verify with ${rules.agency} ↗`;
  }

  function renderSolunar(location, day, moon) {
    const periods = calculateSolunarPeriods(day.dateISO, location.lat, location.lon);
    const cards = [
      { kind: "major", number: "I", period: periods.major[0], halfMinutes: 60 },
      { kind: "major", number: "II", period: periods.major[1], halfMinutes: 60 },
      { kind: "minor", number: "I", period: periods.minor[0], halfMinutes: 30 },
      { kind: "minor", number: "II", period: periods.minor[1], halfMinutes: 30 }
    ];
    const container = el("solunar-periods");
    container.innerHTML = cards.map(({ kind, number, period, halfMinutes }) => {
      const time = period ? compactTimeRange(period.time, halfMinutes) : "—";
      const detail = period?.label || `No second ${kind} event in this local day`;
      return `<article class="solunar-period ${kind}" aria-label="${escapeHTML(`${kind} period ${number}, ${time}, ${detail}`)}"><span>${escapeHTML(kind)} period ${number}</span><strong>${escapeHTML(time)}</strong><small>${escapeHTML(detail)}</small></article>`;
    }).join("");
    container.setAttribute("aria-busy", "false");
    el("solunar-summary").textContent = `${day.date} · ${moon.name}. Major windows span two hours; minor windows span one hour.`;
    el("solunar-location").textContent = `Calculated for ${location.name} · Central local time · astronomical estimate`;
  }

  function renderOutlook(days) {
    const top = days.map((_, index) => index).sort((a, b) => days[b].score - days[a].score).slice(0, 3).sort((a, b) => a - b);
    el("outlook-days").innerHTML = top.map((index) => { const day = days[index]; return `<button type="button" data-outlook-day="${index}" class="${index === state.dayIndex ? "selected" : ""}" aria-label="Show ${escapeHTML(day.date)} conditions, bite score ${day.score}"><span>${escapeHTML(day.date)}</span><div class="outlook-score"><strong>${day.score}</strong><em>Bite score</em></div><small>${escapeHTML(day.window)}</small></button>`; }).join("");
    el("outlook-days").querySelectorAll("button").forEach((button) => button.addEventListener("click", () => selectDay(Number(button.dataset.outlookDay), true)));
  }

  function renderStatus() {
    const status = el("data-status");
    const dotClass = state.status === "loading" ? "loading" : state.status === "error" ? "error" : "";
    if (state.status === "live") {
      const updated = state.data[state.locationKey].updated;
      status.innerHTML = `<span class="live-dot"></span> Live conditions · NOAA / NWS · updated ${fmtClock(updated.getHours(), updated.getMinutes())}`;
      el("report-status").textContent = "Live report";
    } else if (state.status === "loading") {
      status.innerHTML = `<span class="live-dot ${dotClass}"></span> Fetching live conditions…`;
      el("report-status").textContent = "Loading";
    } else {
      status.innerHTML = `<span class="live-dot ${dotClass}"></span> Live feed unavailable · showing sample conditions`;
      el("report-status").textContent = "Sample report";
    }
    const refreshButton = el("refresh-conditions");
    refreshButton.disabled = state.status === "loading";
  }

  function renderMarineConditions() {
    const data = state.data[state.locationKey];
    const wave = data?.wave;
    el("wave-height").innerHTML = wave ? `${wave.height} <i>ft</i>${wave.period ? `<small>${wave.period}s</small>` : ""}` : `— <i>ft</i>`;
    const alert = data?.marineAlerts?.[0];
    const banner = el("marine-alert");
    if (!alert) {
      banner.hidden = true;
      banner.innerHTML = "";
      return;
    }
    const props = alert.properties;
    const expires = props.ends ? new Date(props.ends).toLocaleString([], { weekday: "short", hour: "numeric", minute: "2-digit" }) : "until further notice";
    banner.hidden = false;
    const zone = (props.affectedZones || []).map((url) => String(url).split("/").pop()).find((id) => /^GMZ\d+$/i.test(id)) || LOCATIONS[state.locationKey].alertZones[0];
    const detailsURL = zone ? `https://marine.weather.gov/MapClick.php?zoneid=${zone.toLowerCase()}` : "https://www.weather.gov/mob/marine";
    banner.innerHTML = `<span aria-hidden="true">!</span><div><strong>${escapeHTML(props.event)}</strong><small>${escapeHTML(props.headline || "Active NWS marine alert")} · through ${escapeHTML(expires)}</small></div><a href="${escapeHTML(detailsURL)}" target="_blank" rel="noopener">NWS marine forecast ↗</a>`;
  }

  function render() {
    const location = LOCATIONS[state.locationKey];
    const days = currentDays();
    state.dayIndex = Math.max(0, Math.min(state.dayIndex, days.length - 1));
    const day = days[state.dayIndex];
    el("header-date").textContent = day.date;
    el("header-location").textContent = location.name;
    el("hero-meta").textContent = `${day.date} · ${location.name}`;
    const headline = headlineFor(location, day);
    const verdictParts = headline.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [headline];
    const headlineLength = headline.replace(/\s+/g, " ").trim().length;
    el("verdict").classList.toggle("headline-medium", headlineLength >= 27 && headlineLength < 35);
    el("verdict").classList.toggle("headline-long", headlineLength >= 35);
    el("verdict").innerHTML = verdictParts.map((part) => `<span>${escapeHTML(part.trim())}</span>`).join(" ");
    el("bite-score").textContent = day.score;
    el("score-ring").style.setProperty("--score", `${3.6 * day.score}deg`);
    el("score-ring").setAttribute("aria-label", `Bite score ${day.score} out of 100`);
    el("best-window").textContent = `Best window · ${day.window}`;
    el("air-temp").textContent = `${day.air ?? "—"}°F`;
    el("wind-speed").innerHTML = `${escapeHTML(day.wind || "—")} <i>mph</i>`;
    const water = state.data[state.locationKey]?.water ?? day.water;
    el("water-temp").textContent = `${water ?? "—"}°F`;
    el("high-tide-time").textContent = day.highTime || (day.tide === "High tide" ? day.tideTime : "—");
    el("low-tide-time").textContent = day.lowTime || (day.tide === "Low tide" ? day.tideTime : "—");
    const moon = moonPhaseFor(new Date(`${day.dateISO}T12:00:00`));
    el("moon-icon").textContent = moon.icon;
    el("moon-phase").textContent = moon.name;
    renderSolunar(location, day, moon);
    el("tide-station-label").textContent = `${location.spots[0].name} tide`;
    el("tide-event-label").textContent = `${day.highTime || "—"} high · ${day.lowTime || "—"} low`;
    renderTarget(location, day);
    el("field-note").textContent = `“${dailyFieldNote(location, day)}”`;
    el("field-note-source").textContent = state.status === "live"
      ? state.dayIndex === 0
        ? "— Generated from today’s NOAA / NWS report"
        : "— Generated from the selected NOAA / NWS forecast"
      : state.status === "loading"
        ? "— Loading today’s live field note…"
        : "— Sample field note · live feed unavailable";
    renderLocations();
    renderDays(days);
    renderScoreFactors(day.parts);
    renderTide(day, state.dayIndex);
    renderSpots(location);
    renderShops(location);
    renderRegulations(location);
    renderOutlook(days);
    renderWeekly(location, days);
    renderTrend(days);
    renderSeasonWatch(location);
    renderLiveLook();
    renderBaro();
    renderStatus();
    renderMarineConditions();
  }

  async function selectLocation(key) {
    if (!LOCATIONS[key] || key === state.locationKey) return;
    state.locationKey = key;
    state.dayIndex = 0;
    state.spotIndex = 0;
    state.status = state.data[key] ? "live" : "loading";
    render();
    if (state.data[key]) return;
    try {
      await loadLocation(key);
      if (state.locationKey === key) { state.status = "live"; render(); }
    } catch (error) {
      console.warn("Live conditions unavailable", error);
      if (state.locationKey === key) { state.status = "error"; render(); }
    }
  }

  async function refreshLocation(manual = false) {
    const key = state.locationKey;
    if (state.pending[key]) return;
    const previous = state.data[key];
    delete state.data[key];
    state.status = "loading";
    renderStatus();
    try {
      await loadLocation(key);
      if (state.locationKey === key) {
        state.status = "live";
        render();
        if (manual) showToast("Live conditions and bite score refreshed.");
      }
    } catch (error) {
      console.warn("Live conditions refresh unavailable", error);
      if (previous) state.data[key] = previous;
      if (state.locationKey === key) {
        state.status = previous ? "live" : "error";
        render();
        if (manual) showToast("Refresh unavailable. Keeping the last live report.");
      }
    }
  }

  function setupConditionRefresh() {
    el("refresh-conditions").addEventListener("click", () => refreshLocation(true));
    window.setInterval(() => refreshLocation(false), 30 * 60 * 1000);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState !== "visible") return;
      const updated = state.data[state.locationKey]?.updated;
      if (updated && Date.now() - updated.getTime() >= 30 * 60 * 1000) refreshLocation(false);
    });
  }

  function selectDay(index, moveToConditions) {
    state.dayIndex = index;
    render();
    if (moveToConditions) el("conditions").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function readCatches() {
    try {
      const stored = JSON.parse(localStorage.getItem("gulf-coast-bite-catches") || "[]");
      state.catches = Array.isArray(stored) ? stored.filter((item) => item && typeof item === "object").slice(0, 60) : [];
    } catch {
      state.catches = [];
    }
  }

  function saveCatches() {
    try { localStorage.setItem("gulf-coast-bite-catches", JSON.stringify(state.catches)); }
    catch { showToast("The catch saved for this visit, but private storage is blocked."); }
  }

  function renderCatches() {
    renderYourPatterns();
    if (!state.catches.length) {
      el("catch-content").innerHTML = `<div class="empty-ledger"><span class="field-icon field-log-icon" aria-hidden="true">${FIELD_LOG_ICON}</span><div><h3>No catches logged yet.</h3><p>Your catches stay private on this device. Log the first fish to start learning your water.</p></div></div>`;
      return;
    }
    el("catch-content").innerHTML = `<div class="catch-list">${state.catches.map((entry) => `<article><button class="delete-catch" type="button" data-delete-catch="${escapeHTML(entry.id)}" aria-label="Delete ${escapeHTML(entry.species)} catch">×</button><span>${escapeHTML(entry.date)}</span><h3>${escapeHTML(entry.species)} <small>${entry.length && entry.length !== "—" ? `${escapeHTML(entry.length)} in` : ""}</small></h3><p>${escapeHTML(entry.spot)} · ${escapeHTML(entry.region)}</p><blockquote>“${escapeHTML(entry.note || "No field note")}”</blockquote></article>`).join("")}</div>`;
    el("catch-content").querySelectorAll("[data-delete-catch]").forEach((button) => button.addEventListener("click", () => {
      state.catches = state.catches.filter((entry) => String(entry.id) !== button.dataset.deleteCatch);
      saveCatches();
      renderCatches();
      showToast("Catch removed from this device.");
    }));
  }

  function updateCatchSpotOptions(location) {
    const select = el("catch-spot");
    select.innerHTML = location.spots.map((spot) => `<option value="${escapeHTML(spot.name)}">${escapeHTML(spot.name)}</option>`).join("");
    select.value = location.spots[state.spotIndex].name;
  }

  function openCatchModal() {
    const location = LOCATIONS[state.locationKey];
    state.lastFocus = document.activeElement;
    el("catch-species").value = el("target-species").textContent || location.target;
    updateCatchSpotOptions(location);
    el("catch-backdrop").hidden = false;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => el("catch-species").focus());
  }

  function closeCatchModal() {
    el("catch-backdrop").hidden = true;
    document.body.style.overflow = "";
    el("catch-form").reset();
    if (state.lastFocus instanceof HTMLElement) state.lastFocus.focus();
  }

  let toastTimer;
  function showToast(message) {
    const toast = el("toast");
    toast.textContent = message;
    toast.hidden = false;
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => { toast.hidden = true; }, 3200);
  }

  function setupCatchLog() {
    document.querySelectorAll("[data-open-catch]").forEach((button) => button.addEventListener("click", openCatchModal));
    document.querySelectorAll("[data-close-catch]").forEach((button) => button.addEventListener("click", closeCatchModal));
    el("catch-backdrop").addEventListener("mousedown", (event) => { if (event.target === el("catch-backdrop")) closeCatchModal(); });
    document.addEventListener("keydown", (event) => { if (event.key === "Escape" && !el("catch-backdrop").hidden) closeCatchModal(); });
    el("catch-form").addEventListener("submit", (event) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      const location = LOCATIONS[state.locationKey];
      submitShare(form);
      state.catches.unshift({
        id: Date.now(),
        species: String(form.get("species") || location.target).trim(),
        spot: String(form.get("spot") || location.spots[state.spotIndex].name),
        region: location.short,
        length: String(form.get("length") || "—").trim() || "—",
        note: String(form.get("note") || "No field note").trim() || "No field note",
        date: new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date()),
        conditions: captureConditions()
      });
      state.catches = state.catches.slice(0, 60);
      saveCatches();
      renderCatches();
      closeCatchModal();
      showToast("Catch saved to your private field journal.");
    });
  }

  function setupPrivacyChoice() {
    const banner = el("privacy-banner");
    const choice = localStorage.getItem("gcb-analytics-consent");
    if (!choice) banner.hidden = false;
    document.querySelectorAll("[data-privacy-settings]").forEach((button) => button.addEventListener("click", () => { banner.hidden = false; }));
    document.querySelectorAll("[data-analytics-accept]").forEach((button) => button.addEventListener("click", () => {
      localStorage.setItem("gcb-analytics-consent", "accepted");
      banner.hidden = true;
      if (typeof window.gcbLoadAnalytics === "function") window.gcbLoadAnalytics();
    }));
    document.querySelectorAll("[data-analytics-decline]").forEach((button) => button.addEventListener("click", () => {
      localStorage.setItem("gcb-analytics-consent", "declined");
      banner.hidden = true;
      document.cookie.split(";").map((cookie) => cookie.split("=")[0].trim()).filter((name) => name.startsWith("_ga")).forEach((name) => {
        document.cookie = `${name}=; Max-Age=0; path=/; domain=.gulfcoastbite.com`;
        document.cookie = `${name}=; Max-Age=0; path=/`;
      });
    }));
  }

  function setupScoreHelp() {
    const backdrop = el("score-backdrop");
    const open = (event) => {
      state.lastFocus = event.currentTarget;
      backdrop.hidden = false;
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => backdrop.querySelector("[data-close-score]").focus());
    };
    const close = () => {
      backdrop.hidden = true;
      document.body.style.overflow = "";
      if (state.lastFocus instanceof HTMLElement) state.lastFocus.focus();
    };
    document.querySelectorAll("[data-open-score]").forEach((button) => button.addEventListener("click", open));
    document.querySelectorAll("[data-close-score]").forEach((button) => button.addEventListener("click", close));
    backdrop.addEventListener("mousedown", (event) => { if (event.target === backdrop) close(); });
    document.addEventListener("keydown", (event) => { if (event.key === "Escape" && !backdrop.hidden) close(); });
  }

  function setupNavigation() {
    const links = [...document.querySelectorAll("nav a[href^='#']")];
    const sections = links.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);
    let scheduled = false;
    const update = () => {
      const marker = window.scrollY + Math.min(300, window.innerHeight * .32);
      let current = sections[0];
      sections.forEach((section) => {
        if (section.offsetTop <= marker && section.offsetTop > current.offsetTop) current = section;
      });
      const hashSection = sections.find((section) => `#${section.id}` === window.location.hash);
      if (hashSection && Math.abs(window.scrollY - hashSection.offsetTop) < 12) current = hashSection;
      links.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${current.id}`));
      scheduled = false;
    };
    window.addEventListener("scroll", () => {
      if (!scheduled) { scheduled = true; window.requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener("hashchange", update);
    update();
  }

  async function init() {
    readCatches();
    renderCatches();
    setupCatchLog();
    setupShareFields();
    loadBoard();
    window.setInterval(loadBoard, 5 * 60 * 1000);
    setupAlerts();
    renderWaterWatch();
    loadWaterWatch();
    window.setInterval(loadWaterWatch, 60 * 60 * 1000);
    setupScoreHelp();
    setupPrivacyChoice();
    setupNavigation();
    setupConditionRefresh();
    render();
    try {
      await loadLocation(state.locationKey);
      state.status = "live";
    } catch (error) {
      console.warn("Live conditions unavailable", error);
      state.status = "error";
    }
    render();
  }

  init();
})();

