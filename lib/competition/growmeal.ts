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
