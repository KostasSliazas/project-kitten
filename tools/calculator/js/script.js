/* jshint esversion: 8 */
(function (w,d) {
  "use strict";
    // Audio for button sound effect
    const BEEP_AUDIO = new w.Audio("data:audio/mp3;base64,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");

  // Function to play a beep sound and trigger device vibration if available
  const sound = () => {
    BEEP_AUDIO.play();
    if (typeof w.navigator.vibrate === 'function') {
      w.navigator.vibrate(30);
    }
  };

  const root = d.documentElement; // Root HTML element for theme changes
  const CALC = d.querySelector(".calculator"); // Calculator container
  const CALC_SCREEN = d.querySelector(".calculator__screen"); // Screen element
  CALC_SCREEN.textContent = 0; // Initialize calculator screen with zero

  // Utility function to generate a random number between min and max
  const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

  // Class name variations for different themes
  const classNameVariables = [0, "a", "b", "c", "d", "e l", "f", "g", "h l", "i n", "j n p", "k o p", "e l q"];

  // Helper object to handle cycling through themes
  const arrayHelper = function () {
    const ob = {};
    ob.value = ob.full = this.length;

    ob.increment = function () {
      this.value = this.value ? --this.value : this.full - 1;
    };

    ob.decrement = function () {
      this.value = this.value < this.full - 1 ? ++this.value : 0;
    };

    return ob;
  };

  // Initialize the theme handler using the classNameVariables
  const THEME_CHANGE = arrayHelper.call(classNameVariables);

  // Function to change the theme by updating the root element's class
  const changerClass = (e) => {
    if (e) root.className = classNameVariables[e];
    else root.removeAttribute("class");
  };

  let n1 = []; // Stores the current input number
  let n2 = 0;  // Stores the previous number for operations
  let op = null; // Stores the current operation
  let lastop = null; // Stores the last operation performed
  let result = 0; // Stores the calculation result

  // Define mathematical functions for the calculator
  const add = (n, o) => n + o;
  const sub = (n, o) => n - o;
  const div = (n, o) => n / o;
  const mul = (n, o) => n * o;
  const res = (n) => n;

  // Map operators to corresponding mathematical functions
  const cals = {
    "÷": div,
    "×": mul,
    "+": add,
    "-": sub,
    "=": res,
  };

  // Perform the calculation based on num1, num2, and the callback operator
  const cal = (num1, num2, calback) => {
    if (typeof calback === "function") {
      const n1 = num1.toString().split(".")[1];
      const n2 = num2.toString().split(".")[1];
      const len1 = (n1 && n1.length) || 0;
      const len2 = (n2 && n2.length) || 0;

      if (lastop !== "÷") {
        return parseFloat(calback(Number(num1), Number(num2)).toFixed(len1 + len2));
      }

      return calback(Number(num1), Number(num2));
    }
  };

  // Event handler for button clicks (numbers and operations)
  const btn = (e) => {
    // Ignore clicks on non-button elements
    if (!e.target.matches("input") || e.target.id === "esound" || e.target.id === "src") {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    // Add blink effect to the calculator screen
    CALC_SCREEN.classList.add("calculator__screen--blink");

    // Play sound and vibration if sound option is enabled
    if (d.getElementById("esound").checked) sound();

    const buttonValue = e.target.value; // Get the button's value

    // Check if the button is a number and append it to n1 (input number)
    if (!isNaN(parseFloat(buttonValue))) {
      op = null; // Reset the operator
      if (n1[0] === "0" && n1[1] !== ".") n1.length = 0; // Remove leading zero unless it's a decimal
      n1.push(buttonValue);
    } else {
      op = buttonValue; // Assign the operator
    }

    // Handle backspace operation (⌫)
    if (op === "⌫") {
      n1 = result
        .toString(10)
        .substring(0, 15)
        .replace(/[^0-9]/g, ".")
        .split("");
      n1.pop(); // Remove the last character
      if (n1.join("").charAt(n1.join("").length - 1) === ".") n1.pop(); // Ensure no trailing decimal
    }

    if (!n1.length) n1 = ["0"]; // Ensure there's always a number displayed
    if (op === "," && !n1.includes(".")) n1.push("."); // Add decimal point if not already present
    result = n1.join(""); // Update the result with the current input

    // Perform the calculation when an operator is pressed
    if (Object.keys(cals).includes(op)) {
      if (n2 && lastop) result = cal(Number(n2), Number(result), cals[lastop]); // Perform the calculation
      lastop = op; // Update the last operation
      if (n1[0] === "0" && n1.length === 1) return; // Prevent recalculating zero
      n2 = result; // Store the result for the next calculation
      n1.length = 0; // Reset input array
    }

    // Reset the calculator when 'C' is pressed
    if (op === "C") {
      op = lastop = null;
      result = n2 = n1.length = 0;
    }

    // Update the screen value, show "ERROR" if result is not finite
    CALC_SCREEN.textContent = !isFinite(result) ? "ERROR" : result;
  };

  // Initialize the theme on page load
  function init() {
    THEME_CHANGE.value = parseInt(localStorage.getItem("calculatorThemeNumber"));
    if (isNaN(THEME_CHANGE.value)) changerClass(random(0, THEME_CHANGE.full));
    else changerClass(THEME_CHANGE.value); // Set theme from localStorage or random

    if ('serviceWorker' in navigator) {
        try {
            navigator.serviceWorker.register('/project-kitten/calculator/sw.js?v=1')
                .then((registration) => {
                    console.log('Service Worker registered with scope:', registration.scope);
                })
                .catch((error) => {
                    if (error.message.includes("ServiceWorkerContainer.register: Script URL's scheme is not 'http' or 'https'")) {
                        return console.warn('Service Worker registration error: Insecure context. Please use HTTPS or localhost.', error);
                    }
                    console.error('Service Worker registration failed:', error);
                });
        } catch (error) {
            console.error('Unexpected error during Service Worker registration:', error);
        }
    } else {
        console.log('Service Workers are not supported in this browser.');
    }

  // Event listeners for mouse and theme changes
  CALC.addEventListener("mousedown", (e) => btn(e));

  // Remove blink effect after button release
  CALC.addEventListener("mouseup", (e) => {
    const screenTimeout = setTimeout(() => {
      clearTimeout(screenTimeout);
      CALC_SCREEN.classList.remove("calculator__screen--blink");
    }, 7);
  });

  // Increment the theme on screen click
  CALC_SCREEN.addEventListener("click", (e) => {
    e.preventDefault();
    THEME_CHANGE.increment();
    changerClass(THEME_CHANGE.value);
    localStorage.setItem("calculatorThemeNumber", THEME_CHANGE.value);
  });

  // Decrement the theme on right-click (context menu)
  CALC_SCREEN.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    THEME_CHANGE.decrement();
    changerClass(THEME_CHANGE.value);
    localStorage.setItem("calculatorThemeNumber", THEME_CHANGE.value);
  });
  }
  // Initialize theme on DOM load
  d.addEventListener("DOMContentLoaded", init);

})(window, document);

