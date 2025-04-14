export const combineClass = (...classes) => {
  return classes.filter(Boolean).join(" ");
}