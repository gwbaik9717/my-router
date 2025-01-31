export const getURLObjFromPath = (path: string) => {
  const dummyUrl = "https://developer.mozilla.org";
  return new URL(path, dummyUrl);
};
