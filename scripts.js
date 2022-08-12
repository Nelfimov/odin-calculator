const output = document.getElementById('output');
const lastOperation = document.getElementById('last-output');
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
    lastOperation.value = output.value;
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
  if (array.length < 3) {
    alert('Not enough elements');
  } else {
    return array;
  }
}

function operate(array = []) {
  // Recursion for when array.length > 3.
  let operator;
  let preResult;
  if (array.length === 3) {
    operator = array[1];
    array.splice(1, 1);
    if (operator === '/' && parseInt(array[1]) === 0) return alert('Division by 0 is forbidden!');
    preResult = array.reduce((a, b) => mathOperator[operator](a, b));
    return output.value = preResult;
  }
  let multiplication = array.indexOf('*');
  let division = array.indexOf('/');

  // multiplcation === division only when its -1 - not in array.
  if (multiplication === division) {
    preResult = array.splice(0, 3)
    operator = preResult[1];
    preResult.splice(1, 1);
    preResult = preResult.reduce((a, b) => mathOperator[operator](a, b));
    array.splice(0, 0, preResult)
    operate(array);
  }
  if (multiplication > -1 && multiplication < division || multiplication > -1 && division === -1) {
    preResult = array.slice(multiplication - 1, multiplication + 2);
    operator = preResult[1];
    preResult.splice(1, 1);
    preResult = preResult.reduce((a, b) => mathOperator[operator](a, b));
    array.splice(multiplication - 1, 3, preResult);
    operate(array);
  }
  if (division > -1 && division < multiplication || division > -1 && multiplication === -1) {
    preResult = array.slice(division - 1, division + 2);
    operator = preResult[1];
    preResult.splice(1, 1);
    if (parseInt(preResult[1]) === 0) return alert('Division by 0 is forbidden!');
    preResult = preResult.reduce((a, b) => mathOperator[operator](a, b));
    array.splice(division - 1, 3, preResult);
    operate(array);
  }
}

resultButton.addEventListener('click', () => {
  lastOperation.value = output.value;
  let array = outputToArray(output.value);
  operate(array);
})