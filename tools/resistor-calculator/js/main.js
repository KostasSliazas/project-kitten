/*jshint esversion: 11 */

(function(){
/**
 * Resistors 4-5 bands calculator created by K.Š.
 * @date 7/7/2023 - 12:57:36 AM
*/

function formatOutputValue(value) {
  // if (typeof value !== 'number') {
  //     throw new Error("Value must be a number.");
  // }
  if (value >= 1e6) {
      return (value / 1e6).toFixed(2) + ' MΩ';
  } else if (value >= 1e3) {
      return (value / 1e3).toFixed(2) + ' kΩ';
  } else {
      return value + ' Ω';
  }
}

// const key=value + color , 'T':tolerance --- null will be 20%
const COLORS = [
  {0: 'BLACK','T': null},
  {1: 'BROWN','T': 1},
  {2: 'RED','T': 2},
  {3: 'ORANGE','T': null},
  {4: 'YELLOW','T': null},
  {5: 'GREEN','T': 0.5},
  {6: 'BLUE','T': 0.25},
  {7: 'VIOLET','T': 0.1},
  {8: 'GREY','T': 0.05},
  {9: 'WHITE','T': null},
  {'G': 'GOLD','T': 5},
  {'S': 'SILVER','T': 10}
];

// Helper function to create an HTML element with attributes
const element = (tagName, ...attributes) => {
  const newElement = document.createElement(tagName);
  for (let i = 0; i < attributes.length; i += 2) {
    newElement.setAttribute(attributes[i], attributes[i + 1]);
  }
  return newElement;
};
// regex for clearing 000 from start of string(match only digits)
const reg = new RegExp('^0+(?=\d)|\D+', "g");
//const reg = new RegExp('(?!0)[\d]+', "g");

function createColorBand(obj, index) {
  const select = element('div', 'id', 'id' + index);
  obj.forEach((e, i) => {
    const color = Object.values(e)[0];
    const tolerance = Object.values(e)[1];
    const option = element('div', 'data-tolerance', tolerance, 'data-color', color, 'data-resistor', i, 'style', 'color:' + color + ';background-color:' + color, 'title', '(band' + (index + 1) + ')' + ' ' + color);
    option.textContent = color;
    // if (i === 0) option.className = 'selected';
    // else option.className = 'hidden';
    select.appendChild(option);
  });
  select.onclick = (e) => colorDetect(e, index);
  return select;
}

const resistorsMain = document.getElementById('resistor');
const selections = document.getElementById('resistor-output');
const switcher = document.getElementById('switch');
const outputTolerance = element('div', 'id', 'resistor-tolerance', 'class', 'outputs');
const outputValue = element('div', 'id', 'resistor-value', 'class', 'outputs');
const outputValueSpan = element('span');
const outputToleranceSpan = element('span');
const theResistor = []; // resistor values GLOBAL ARRAY
const switcherChecker = () => switcher.checked === true;
switcher.onchange = () => outputValueSpan.innerHTML = outputToleranceSpan.innerHTML = '';
outputValue.textContent = '(ohms)value:';
outputTolerance.textContent = '(%)tolerance:';

outputValue.appendChild(outputValueSpan);
outputTolerance.appendChild(outputToleranceSpan);
selections.appendChild(outputValue);
selections.appendChild(outputTolerance);


function resistorCreator() {
  // reset resistor
  theResistor.length = 0;
  //create parent element of band (line)
  const elements = element('div', 'id', 'resistor-colors');
  //assign 4 or 5 bands after checking
  let bandsOfResistor = switcherChecker() ? 4 : 5;
  //clear html element
  resistorsMain.innerHTML = '';
  // create bands (colors)
  for (let i = 0; i < bandsOfResistor; i++) {
    const bands = createColorBand(COLORS, i);
    bands.className = 'selected';
    elements.appendChild(bands);
  }
  // append to main parent element
  resistorsMain.appendChild(elements);
}

function colorDetect(e, i) {
  const eventTarget = e.target;
  // if color exist in dataset
  if (eventTarget.dataset.color) {
    const target = e.currentTarget;
    const divs = Array.from(target.getElementsByTagName('div'));
    
    // always toggle class on click
    target.classList.toggle('selected');

    if (target.classList.contains('selected')) {
      divs.forEach(e => e.className = '');
    } else {
      divs.forEach(e => e.className = 'hidden');
      // add class to selected value
      eventTarget.className = 'selected';

    
      // assign value to resistor
      theResistor[i] = parseInt(eventTarget.dataset.resistor);
      // const resistor = [...theResistor];
      const resistorReversed = [...theResistor].reverse();

      // show values when more items selected
      if (theResistor.length >= 4) {
        const fourTrue = switcherChecker();

        const fourOrFive = fourTrue ? 2 : 3;

        let powerValue = Math.pow(10, theResistor[fourOrFive]);
        let powerValueRev = Math.pow(10, resistorReversed[fourOrFive]);

        if(theResistor[fourOrFive] === 10) powerValue = 1;
        if(theResistor[fourOrFive] === 11) powerValue = 2;

        let stringToNum = parseInt(theResistor.slice(0,fourOrFive).join('').replace(reg));
        let stringToNum1 = parseInt(resistorReversed.slice(0,fourOrFive).join('').replace(reg));

        outputValueSpan.innerHTML = '<span>(if reverse:' + formatOutputValue(stringToNum1 * powerValueRev) + ')</span>' + formatOutputValue(stringToNum * powerValue);
        outputToleranceSpan.innerHTML = '<span>(if reverse:' + (COLORS[theResistor[0]].T || 20) + ')</span>' + (COLORS[theResistor[theResistor.length - 1]].T || 20);
      }
    }
  }
}

// events
document.addEventListener('DOMContentLoaded', resistorCreator);
switcher.addEventListener('change', resistorCreator);
document.addEventListener('dblclick', resistorCreator);
})();
