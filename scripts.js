const output = document.getElementById('output');
const resultButton = document.getElementById('result');

const mathOperator = {
  '+': (a, b) => parseInt(a) + parseInt(b),
  '-': (a, b) => parseInt(a) - parseInt(b),
  '*': (a, b) => parseInt(a) * parseInt(b),
  '/': (a, b) => parseInt(a) / parseInt(b),
}

window.addEventListener('keydown', (e) => {
  if (/\d/.test(e.key)) output.value += e.key;
  if (e.key === 'Backspace') {
    let stringLength = output.value.length;
    let trimmedString;
    if (output.value[stringLength - 1] === ' ') {
      trimmedString = output.value.substring(0, stringLength - 3);
    } else {
      trimmedString = output.value.substring(0, stringLength - 1);
    }
    output.value = trimmedString;
  }
  if (e.key === 'Enter' || e.key === '=') {
    let array = outputToArray(output.value);
    operate(array);
  }
  if (e.key === 'Escape') output.value = '';
  if (Object.keys(mathOperator).includes(e.key)) output.value += ` ${e.key} `;
})

document.querySelector('button.minus').addEventListener('click', () => {
  let stringLength = output.value.length;
  let trimmedString;
  if (output.value[stringLength - 1] === ' ') {
    trimmedString = output.value.substring(0, stringLength - 3);
  } else {
    trimmedString = output.value.substring(0, stringLength - 1);
  }
  output.value = trimmedString;
})

document.querySelector('button.clear').addEventListener('click', () => {
  output.value = '';
})

document.querySelectorAll('button.digit').forEach(button => {
  button.addEventListener('click', () => {
    output.value += `${button.textContent}`;
  })
})

document.querySelectorAll('button.calculation').forEach(button => {
  button.addEventListener('click', () => {
    const calculationRegex = /[\d]/;
    if (calculationRegex.test(output.value[output.value.length - 1])) {
      output.value += ` ${button.textContent} `;
    }
  })
})

function outputToArray(string) {
  let array = string.split(' ');
  if (array[array.length - 1] === '') array.splice(array.length - 2, 2);
  if (array.length < 3) return alert('Not enough elements');
  return array;
}

function operate(array = []) {
  // Recursion for when array.length > 3.
  let operator;
  let preResult;
  if (array.length === 3) {
    operator = array[1];
    array.splice(1, 1);
    preResult = array.reduce((a, b) => mathOperator[operator](a, b));
    return output.value = preResult;
  }
  let multiplication = array.indexOf('*');
  console.log(`Multi: ${multiplication}`);
  let division = array.indexOf('/');
  console.log(`Div: ${division}`);

  // multiplcation === division only when its -1 - not in array.
  if (multiplication === division) {
    console.log(`No multi no division`);
    preResult = array.splice(0, 3)
    operator = preResult[1];
    preResult.splice(1, 1);
    preResult = preResult.reduce((a, b) => mathOperator[operator](a, b));
    console.log(`Preresult: ${preResult}`);
    array.splice(0, 0, preResult)
    console.log(array);
    operate(array);
  }
  if (multiplication > -1 && multiplication < division || multiplication > -1 && division === -1) {
    console.log(`Division`);
    preResult = array.slice(multiplication - 1, multiplication + 2);
    console.log(`Preresult array: ${preResult}`);
    operator = preResult[1];
    preResult.splice(1, 1);
    preResult = preResult.reduce((a, b) => mathOperator[operator](a, b));
    console.log(`Preresult: ${preResult}`);
    array.splice(multiplication - 1, 3, preResult);
    console.log(array);
    operate(array);
  }
  if (division > -1 && division < multiplication || division > -1 && multiplication === -1) {
    console.log(`No multi`);
    preResult = array.slice(division - 1, division + 2);
    operator = preResult[1];
    preResult.splice(1, 1);
    if (preResult[1] == 0) return alert('Division by 0 is forbidden!');
    preResult = preResult.reduce((a, b) => mathOperator[operator](a, b));
    console.log(`Preresult: ${preResult}`);
    array.splice(division - 1, 3, preResult);
    console.log(array);
    operate(array);
  }
}

let exampleArray = ['12', '+', '7', '-', '5', '*', '3'];
console.log(exampleArray);
operate(exampleArray);

// let exampleArray2 = ['2', '0'];
// console.log(exampleArray2);
// operate(exampleArray2);

resultButton.addEventListener('click', () => {
  let array = outputToArray(output.value);
  operate(array);
})