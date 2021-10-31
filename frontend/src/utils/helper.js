export const isLongInteger = (x) => x > -1*Math.pow(2, 31) && x < Math.pow(2, 31);
export const isPrime = (x) => {
  if (x === 2) return true;
  for(let i = 2; i < x - 1; i++) {
    if (x % i === 0) return false
  }

  return true;
}

export const gcd = (a, b) => {
  if ((typeof a !== 'number') || (typeof b !== 'number')) 
    return false;
  a = Math.abs(a);
  b = Math.abs(b);
  while(b) {
    var t = b;
    b = a % b;
    a = t;
  }
  return a;

}

export const isCoprime = (a, b) => {
  return new Promise((resolve) => {
    resolve(gcd(a, b) === 1)
  })
}