// The Division 2 — Complete Gear Data
// Covers base game through TU 21 / Year 5 Season 3

// ─── ARMOR BRANDS ────────────────────────────────────────────────────────────
// Any brand can appear in any armor slot.
export const BRANDS = [
  'Airaldi Holdings',
  'Alps Summit Armament',
  'Badger Tuff',
  'Belstone Armory',
  'Ceska Vyroba s.r.o.',
  'China Light Industries Corporation',
  'Douglas & Harding',
  'Fenris Group AB',
  'Gila Guard',
  'Grupo Sombra S.A.',
  'Hana-U Corporation',
  'Murakami Industries',
  'Overlord Armaments',
  'Petrov Defense Group',
  'Providence Defense',
  'Richter & Kaiser GmbH',
  'Rogers & Poulter',
  'Sokolov Concern',
  'Wyvern Wear',
  'Yaahl Gear',
]

// ─── GEAR SETS ────────────────────────────────────────────────────────────────
// Any gear set piece can appear in any armor slot.
export const GEAR_SETS = [
  "Aces & Eights",
  "Eclipse Protocol",
  "Empress International",
  "Flatline",
  "Foundry Bulwark",
  "Future Initiative",
  "Hard Wired",
  "Heartbreaker",
  "Hunter's Fury",
  "Negotiator's Dilemma",
  "Ongoing Directive",
  "Rigger",
  "Striker's Battlegear",
  "System Corruption",
  "Tip of the Spear",
  "True Patriot",
  "Umbra Initiative",
]

// ─── ARMOR BY SLOT ────────────────────────────────────────────────────────────
// Exotics and Named items are slot-specific.
export const GEAR_SLOTS = {
  Mask: {
    icon: '🎭',
    exotics: [
      "Coyote's Mask",
      'Vile',
    ],
    named: [
      'Matador',
      'Nimble',
      "Sadist's Mask",
    ],
  },
  Backpack: {
    icon: '🎒',
    exotics: [
      "Acosta's Go-Bag",
      'Memento',
    ],
    named: [
      'Warlord',
      'Frenzy',
    ],
  },
  Chest: {
    icon: '🦺',
    exotics: [
      'Brazos de Arcabuz',
      'Chainkiller',
      "Ridgeway's Pride",
    ],
    named: [
      'Pristine Example',
      'Airaldi Mesh Vest',
      'Hollow Man',
    ],
  },
  Gloves: {
    icon: '🧤',
    exotics: [
      "Contractor's Gloves",
    ],
    named: [
      'Boxer Gloves',
      "Sawyer's Kneeguards", // intentional — slot-correct variant
    ],
  },
  Holster: {
    icon: '🔫',
    exotics: [
      "Dodge City Gunslinger's Holster",
    ],
    named: [
      "Picaro's Holster",
    ],
  },
  Kneepads: {
    icon: '🦵',
    exotics: [
      'Ninjabike Messenger Kneepads',
      "Sawyer's Kneepads",
    ],
    named: [
      "Fox's Prayer",
    ],
  },
}

// ─── WEAPONS ─────────────────────────────────────────────────────────────────
export const WEAPONS = {
  'Assault Rifles': {
    exotic: ['Eagle Bearer', 'The Bighorn', 'Capacitor'],
    named: ["Baker's Dozen", 'Honey Badger', 'Lightstep', 'The Railsplitter'],
    standard: [
      'AK-M', 'Military AK-M', 'SOCOM AK-M',
      'M4', 'Military M4', 'SOCOM M4', 'Police M4', 'Tactical M4',
      'G36 Enhanced', 'Military G36',
      'MDR', 'Urban MDR',
      'M16A2',
      'FAL', 'SA-58',
      'CTAR-21',
      'MSBS Grot',
      'ACR', 'ACR-E',
      'CARB-7', 'Military CARB-7',
    ],
  },
  'Submachine Guns': {
    exotic: ['Chatterbox'],
    named: ['Lady Death', 'Prop', 'Scorpio'],
    standard: [
      'MP5', 'MP5 ST', 'Military MP5', 'SOCOM MP5',
      'MP7',
      'UMP-45',
      'Vector SBR .45 ACP', 'Vector SBR 9mm',
      'PP-19',
      'P90', 'SOCOM P90',
      'SMG-9', 'SMG-9 A2',
      'CMMG Banshee',
      'MPX',
    ],
  },
  'Light Machine Guns': {
    exotic: ['Pestilence'],
    named: ['Sleipnir', 'The Trapper', 'The Ravenous'],
    standard: [
      'M60', 'Military M60',
      'M249 B', 'Military M249 SAW', 'SOCOM M249 Para',
      'Negev NG-7',
      'RPK-74',
      'L86 LSW',
      'M1918 BAR',
      'MG5', 'Military MG5',
      'IWI NEGEV',
    ],
  },
  'Marksman Rifles': {
    exotic: ['Nemesis', 'Mantis', 'The White Death'],
    named: ["Ekim's Long Barrel", 'Lacerator'],
    standard: [
      'M44 Carbine', 'Classic M44', 'Custom M44',
      'SR-1',
      'SVD',
      'G28',
      'M700 Carbon', 'M700 Tactical',
      'SRS A1',
      'Covert SRS',
    ],
  },
  'Shotguns': {
    exotic: ['Sweet Dreams', 'Lullaby'],
    named: ['Kard Custom', 'Medved', 'Showstopper'],
    standard: [
      'M870', 'Military M870',
      'SPAS-12',
      'AA-12',
      'Super 90',
      'SASG-12', 'SASG-12 S',
      'KSG Shotgun',
    ],
  },
  'Rifles': {
    exotic: ['Merciless', 'Diamondback'],
    named: ['Acme', 'The Grudge', 'Virgil'],
    standard: [
      'SOCOM Mk 20 SSR', 'Military Mk 20 SSR',
      'M1A', 'M1A CQB',
      'SR-16',
      'USC .45 ACP',
      'SIG 716',
      'Police M4 Carbine',
      'Lightweight M4',
    ],
  },
  'Pistols': {
    exotic: ['Liberty', 'Burn Out'],
    named: ['Devil', 'Heel', 'Kard .45', 'Orbit'],
    standard: [
      'M9', 'Military M9',
      'M45A1',
      'PF45',
      '93R',
      'Px4 Storm',
      'D50',
      'M1911', 'MEU(SOC) Pistol',
      'Rhino 60DS',
      'Desert Eagle .357',
    ],
  },
}

// Slot config for rendering
export const ARMOR_SLOTS = ['Mask', 'Backpack', 'Chest', 'Gloves', 'Holster', 'Kneepads']
export const WEAPON_SLOTS = ['Primary', 'Secondary', 'Sidearm']
