export const CATEGORY_GROUPS = [
  { value: "men", label: "مردانه" },
  { value: "women", label: "زنانه" },
  { value: "kids", label: "بچگانه" },
  { value: "smart", label: "ساعت هوشمند" },
  { value: "couple", label: "ست مردانه و زنانه" },
  { value: "wall", label: "ساعت دیواری" },
] as const;

export type CategoryGroupValue = (typeof CATEGORY_GROUPS)[number]["value"];

export const CATEGORY_GROUP_VALUES = CATEGORY_GROUPS.map((g) => g.value) as [
  CategoryGroupValue,
  ...CategoryGroupValue[]
];
