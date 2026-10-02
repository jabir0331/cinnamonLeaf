// Menu item prices are stored as plain numbers (e.g. 450) - this adds the
// "LKR" currency prefix and a consistent 2-decimal display everywhere.
export const formatPrice = (price: number): string => {
  return `LKR ${price.toFixed(2)}`;
};
