export function generateOrderNumber(): string {
  const year = new Date().getFullYear();

  // create a short random number
  const random = Math.floor(1000 + Math.random() * 9000);

  return `ORD-${year}-${random}`;
}