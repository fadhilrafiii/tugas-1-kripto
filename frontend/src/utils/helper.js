export const isLongInteger = (x) => x > -1*Math.pow(2, 31) && x < Math.pow(2, 31);
export const isPrime = (x) => {
  if (x === 2) return true;
  for(let i = 2; i < x - 1; i++) {
    if (x % i === 0) return false
  }

  return true;
}