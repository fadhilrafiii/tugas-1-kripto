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

export const isCoprime = (x, y) => {
  try {
    let a = parseInt(x);
    let b = parseInt(y);

    if (isNaN(a)) throw new Error(`${x} is not a number!`);
    if (isNaN(b)) throw new Error(`${y} is not a number!`);
    return new Promise((resolve) => {
     resolve(gcd(a, b) === 1);
    });
  } catch (err) {
    alert(err || 'Error has occured!')
  }
}

export const downloadTxtFile = (content) => {
  const element = document.createElement("a");
  const file = new Blob([content], { type: "text/plain" });
  element.href = URL.createObjectURL(file);
  const fileName = prompt('Give filename to downloaded file: ')
  element.download = `${fileName}.txt`;
  document.body.appendChild(element); // Required for this to work in FireFox
  element.click();
};