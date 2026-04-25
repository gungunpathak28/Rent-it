export const dynamicPrice = (basePrice, demand) => {
  let finalPrice = basePrice;

  if (demand === "HIGH") {
    finalPrice = basePrice * 1.2; // increase
  }

  if (demand === "LOW") {
    finalPrice = basePrice * 0.9; // decrease
  }

  return Math.round(finalPrice);
};
