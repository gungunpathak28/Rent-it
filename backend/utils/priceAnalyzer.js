export const analyzePrice = (price, category) => {
  const avgPrices = {
    "Cameras": 800,
    "Riding Gear": 500,
    "Gaming Consoles": 700,
    "Trekking Gear": 300,
    "Musical Instruments": 400
  };

  const avg = avgPrices[category] || 500;

  let status = "FAIR";
  let suggestion = price;

  const numPrice = Number(price);

  if (numPrice > avg * 1.5) {
    status = "HIGH";
    suggestion = avg;
  } else if (numPrice < avg * 0.6) {
    status = "LOW";
    suggestion = avg;
  }

  return {
    status,
    suggestedPrice: suggestion,
    avgPrice: avg
  };
};
