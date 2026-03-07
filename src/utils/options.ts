export function getOptionItemByValue(
  options: (OptionItem & Record<string, any>)[] | undefined,
  value: any,
) {
  return options?.find((item) => item.value === value);
}

export function getOptionLabelByValue(
  options: OptionItem[] | undefined,
  value: any,
) {
  return options?.find((item) => item.value === value)?.text || "";
}

export const heightOptions = (() => {
  const options = [] as OptionItem[];
  for (let i = 140; i <= 220; i += 1) {
    options.push({
      text: `${i}cm`,
      value: `${i}`,
    });
  }
  return options;
})();

export const birthYearOptions = (() => {
  const options = [] as OptionItem[];
  const currentYear = new Date().getFullYear();
  for (let i = currentYear - 60; i <= currentYear - 15; i++) {
    options.push({
      text: `${i}年`,
      value: `${i}`,
    });
  }
  return options;
})();

export const whetherOptions = [
  {
    text: "是",
    value: 1,
  },
  {
    text: "否",
    value: 0,
  },
];
