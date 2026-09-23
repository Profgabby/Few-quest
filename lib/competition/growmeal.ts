export type GrowMealCategoryCode =
  | "GM-NUR"
  | "GM-LP"
  | "GM-UP"
  | "GM-JSS"
  | "GM-SSS";

export type GrowMealCategory = {
  code: GrowMealCategoryCode;
  name: string;
  schoolLevel: "Nursery" | "Primary" | "JSS" | "SSS";
  classes: readonly string[];
  gardenCodes: readonly string[];
};

export const growMealCompetitionCategories: readonly GrowMealCategory[] = [
  {
    code: "GM-NUR",
    name: "Nursery",
    schoolLevel: "Nursery",
    classes: ["Nursery 1", "Nursery 2", "Nursery 3"],
    gardenCodes: ["N01","N02","N03","N04","N05","N06","N07","N08","N09","N10"],
  },
  {
    code: "GM-LP",
    name: "Lower Primary",
    schoolLevel: "Primary",
    classes: ["Primary 1", "Primary 2", "Primary 3"],
    gardenCodes: ["P11","P12","P13","P14","P15","P16","P17","P18","P19","P20"],
  },
  {
    code: "GM-UP",
    name: "Upper Primary",
    schoolLevel: "Primary",
    classes: ["Primary 4", "Primary 5", "Primary 6"],
    gardenCodes: ["P21","P22","P23","P24","P25","P26","P27","P28","P29","P30"],
  },
  {
    code: "GM-JSS",
    name: "Junior Secondary",
    schoolLevel: "JSS",
    classes: ["JSS 1", "JSS 2", "JSS 3"],
    gardenCodes: ["J31","J32","J33","J34","J35","J36","J37","J38","J39","J40"],
  },
  {
    code: "GM-SSS",
    name: "Senior Secondary",
    schoolLevel: "SSS",
    classes: ["SSS 1", "SSS 2", "SSS 3"],
    gardenCodes: ["S41","S42","S43","S44","S45","S46","S47","S48","S49","S50"],
  },
] as const;

export function getGrowMealCategory(schoolLevel?: string | null, classLevel?: string | null) {
  if (!schoolLevel || !classLevel) return null;
  return growMealCompetitionCategories.find(
    (category) =>
      category.schoolLevel === schoolLevel &&
      category.classes.includes(classLevel),
  ) ?? null;
}

export function isValidGrowMealClass(schoolLevel: string, classLevel: string) {
  return getGrowMealCategory(schoolLevel, classLevel) !== null;
}


export const growMealGardenDomains: Readonly<Record<string,string>> = {
  N01:"Alphabet Garden",N02:"Number Garden",N03:"Geometry Garden",N04:"Leaf Garden",N05:"Butterfly Garden",
  N06:"ReBottle Garden",N07:"MicroGrow Garden",N08:"Mini Table Garden",N09:"Sack Garden",N10:"Discovery Garden",
  P11:"Alphabet Food Garden",P12:"Number Food Garden",P13:"Geometry Garden",P14:"Leaf Garden",P15:"Pollinator Garden",
  P16:"Raised Food Garden",P17:"ReBottle Wall Garden",P18:"Sack GrowBag Garden",P19:"Ground Production Garden",P20:"Discovery Production Garden",
  P21:"Raised Food Garden",P22:"Geometry Garden",P23:"Grid Experiment Garden",P24:"Keyhole Garden",P25:"Compost Garden",
  P26:"Gravity Drip Garden",P27:"Vertical Garden",P28:"Crop Rotation Garden",P29:"Water-Smart Garden",P30:"Intro Soilless Garden",
  J31:"Production Garden",J32:"Raised Systems Garden",J33:"Grid Experiment Garden",J34:"Crop Rotation Garden",J35:"Intercropping Garden",
  J36:"Water-Smart Garden",J37:"Compost & Soil Garden",J38:"Soilless Learning Garden",J39:"Sensor-Ready Garden",J40:"Applied Systems Garden",
  S41:"Advanced Production Garden",S42:"Crop Trial Garden",S43:"Controlled Experiment Garden",S44:"Irrigation Engineering Garden",S45:"Water Productivity Garden",
  S46:"Advanced Soilless Garden",S47:"Sensor & Monitoring Garden",S48:"Smart Irrigation Demonstrator",S49:"Research & Design Garden",S50:"Integrated Food Systems Laboratory",
} as const;
