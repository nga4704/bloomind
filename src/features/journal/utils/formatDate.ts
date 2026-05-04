export const formatDate = (date: string) => {
  const d = new Date(date);
  const day = d.getDate();
  const month = d.toLocaleString("en", { month: "long" });
  return { day, month };
};
