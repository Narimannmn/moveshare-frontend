export const objectKeys = <Obj extends object>(obj: Obj): (keyof Obj)[] => {
  return Object.keys(obj) as (keyof Obj)[];
};

export const deepCopy = <T extends object>(obj: T): T | null => {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (error) {
    console.error("Error on deep copy object", error);
    return null;
  }
};
