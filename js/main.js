/**
 * Main off "moving blocks" script created by K.S.
 * @date 07/07/2023 - 07:07:07 AM
 */
/* eslint-disable no-undef */
/*jshint esversion: 11 */
(function (w, d) {
  'use strict';
  /**
   * Global error handler for uncaught runtime errors.
   *
   * @param {string | Event} message - The error message or event object.
   * @param {string} [source] - The URL of the script where the error occurred (if applicable).
   * @param {number} [lineno] - The line number in the script where the error occurred (if applicable).
   * @param {number} [colno] - The column number in the script where the error occurred (if applicable).
   * @param {Error} [error] - The actual Error object associated with the error (if available).
   */
  w.onerror = (message, source, lineno, colno, error) => {
    console.error('Critical error detected:', message);
    console.error('Source:', source, 'Line:', lineno, 'Column:', colno, 'Error object:', error);

    alert('A critical error occurred. The page will stop working.');

    // Prevent further execution by throwing a critical error
    throw new Error('Stopping execution due to critical failure.');
  };

  /**
   * Utility for managing localStorage with namespacing.
   */
  const StorageNamespace = {
    /**
     * The current namespace for all storage operations.
     * @type {string}
     */
    namespace: 'project-kitten',

    /**
     * Constructs the full key by prefixing it with the namespace.
     * @private
     * @param {string} key - The key to namespace.
     * @returns {string} - The namespaced key.
     */
    _getKey(key) {
      return `${this.namespace}:${key}`;
    },

    /**
     * Saves a value to localStorage under the namespaced key.
     * @param {string} key - The key to store the value under.
     * @param {*} value - The value to store. It will be serialized to JSON.
     */
    setItem(key, value) {
      w.localStorage.setItem(this._getKey(key), JSON.stringify(value));
    },
    removeItem(key) {
      w.localStorage.removeItem(this._getKey(key));
    },
    /**
     * Retrieves a value from localStorage.
     * @param {string} key - The key to retrieve the value for.
     * @return {Object|null} - The deserialized value (an object or array) if successful, or `null` if the key doesn't exist or deserialization fails.
     */
    getItem(key) {
      const item = w.localStorage.getItem(this._getKey(key));
      if (item === null) {
        return null; // No item found, return null
      }

      try {
        // Safely parse the item (it is now guaranteed to be a string)
        const parsedItem = /** @type {Object|null} */ (JSON.parse(item));
        return parsedItem;
      } catch (e) {
        console.error(`Error parsing JSON for key "${key}":`, e);
        return null;
      }
    },

    /**
     * Clears all values under the current namespace from w.localStorage.
     */
    clear() {
      Object.keys(w.localStorage).forEach(key => {
        if (key.startsWith(`${this.namespace}:`)) {
          w.localStorage.removeItem(key);
        }
      });
    },

    /**
     * Retrieves all keys under the current namespace.
     * @returns {Array<string>} - An array of keys within the namespace, with the namespace prefix removed.
     */
    keys() {
      return Object.keys(w.localStorage) // Object.keys should return an array of strings
        .filter(key => key.startsWith(`${this.namespace}`))
        .map(key => key.replace(`${this.namespace}`, ''));
    },
  };

  function debounce(func, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  }

  function monitorOnlineStatus(callback) {
    const debouncedCallback = debounce(callback, 340);
    const updateStatus = () => debouncedCallback(online());
    w.addEventListener('online', updateStatus);
    w.addEventListener('offline', updateStatus);
    // Perform an initial check
    updateStatus();
  }

  const root = d.documentElement;
  const version = 7;
  const negativeOrPositive = number => (number > 0 ? `+${number}` : `${number}`);
  const main = d.getElementById('main');
  const overlay = d.getElementById('overlay');
  const onlineElement = d.getElementById('is-online');
  const hide = elem => elem.classList.add('hide');
  const show = elem => elem.classList.remove('hide');
  const online = () => w.navigator.onLine;
  //icon images encoded base64
  const icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAB9VBMVEUAAABIcoqFtMv////BztXD0Nc1UmY3VWgULD8WL0IBCxcCDBknRVpvi5uMo7CPpbF5k6I6WW20w8vR2+DS2+DV3uLc4+fm6+7q7/Hr7/Hn7O/d5ejS2+C1w8tPcYXU3eLW3+NUdYiDmqjM1tzP2d6EnKlviZnY4OXa4uZxjJudsLvt8fPt8fOfsr24xs719/j1+Pm7yNDCztX3+vr4+vvDz9XDz9b4+vvEz9a9ytH2+Pm+ytKjtcDu8vTu8vSltsAMOFLY4OTY4OQYQluqu8TS2+Dn7e+oucKwwMjj6ez7/P35+/zj6eyxwMmWqrXJ1Nrh5+re5enX4OTl6+7r7/Hg5+rJ1NqWqrZad4iTqLSitL6br7qMo69ad4nZ4ubV3+Tz9/j+///////y9ffV3uPa4+fW4OXV3uT09/jc5Ojq7/Hp7vHq7e/v8fHw8fLu8PHw9PXe5OZUWVtMT1DQ1dfT19lBQ0VlaWva4OP9///U2t0gJikJDA6hq7Cvt7wLDhAdIiTJ0NT1+PmhrrWPnKPf5eni5+rm6+6ToKedqbDj6u34+vvw8/XX3+PR2+HGzM+cpKiosbagp6vT2t2+zNTN2N3z9vf9/v7b4ubx9favtblJVFpPWV9SXWPU2dvb4ufe5ej5+/vv8/TO2d/P2uDR2+D5+vofzWmlAAAAXnRSTlMAAAAAAAAAAAAAAAAEEBscEwU2lZyPpsjX2M2rljcJs7UJEMjKEQ7Exg8n3+ApTfX2UmL7+2Rl/GZX+Fku4+QvBZyeBivT1Cw4xf39xjkYbbbX3d3Xt24ZCRsiIhsJ/hk8XwAAALBJREFUGNM9jrsOwjAMRX1rK6QNqAMMTAgJFj6AGRYmRhb+D7Exs4D4HKRuMNCqIBryaDmDZZ/cJAY5YOB5Nr7nHB1vq3HHBCs/hCBwQSKitYZ1EDFEnGCurQ/YRjiIuqKWsg7CX6a2RNHLjOv7g5xsFKlSQ4zc22NiTpgpdYRSRDF9uMO5F4v4bTYzHUsRyBq7//JH3KC+G2Dvp2sBnAWkP9t/4qQqv01WhgQO5kX0AyBgJBBTng0fAAAAAElFTkSuQmCC';
  const emptyIcon = 'data:image/x-icon;base64,AAABAAEAEBACAAEAAQCwAAAAFgAAACgAAAAQAAAAIAAAAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';

  // Generate a random integer between min (inclusive) and max (exclusive)
  const getRandomInRange = (min, max) => Math.floor(Math.random() * (max - min)) + min;

  const getIndexOfItem = (arr, item) => arr.indexOf(item);

  // Common action to be performed after 19 hours
  function performNightThemeChange() {
    const theme = getRandomFromArray(nightThemes);
    const index = getIndexOfItem(classNameVariables, theme);
    changerClass(index);
  }

  // Use getRandomInRange to select a random item from an array
  const getRandomFromArray = arr => arr[getRandomInRange(0, arr.length)];

  function isLocking() {
    // create a new HTML link element
    const link = d.createElement('link');
    link.rel = 'icon';
    link.type = 'image/x-icon';
    const rootLocked = StorageNamespace.getItem('is-locked');
    if (rootLocked) {
      setTimeout(() => {
        d.title = 'New Tab'; // change title (document)
        d.getElementById('loader').style.display = 'none'; // Hide the loader
        link.href = emptyIcon;
        root.style.background = 'none';
      }, 7);
      hide(main);
    } else {
      d.title = 'Project-K'; // change title (document)
      link.href = icon;
      show(main);
    }
    d.head.appendChild(link);
  }

  isLocking();
  // create new sound for timers with base64 encoding
  const soundCalculator = new w.Audio('data:audio/mpeg;base64,SUQzBAAAAAAAIlRTU0UAAAAOAAADTGF2ZjYxLjEuMTAwAAAAAAAAAAAAAAD/4zjAAAAAAAAAAAAASW5mbwAAAA8AAAADAAABsACqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqrV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dX///////////////////////////////////////////8AAAAATGF2YzYxLjMuAAAAAAAAAAAAAAAAJAKgAAAAAAAAAbBUn6+GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/4xjEAA0BSphRQcAB0DAP/////+MYxj/gADPPPPPPPPPDCkhh2GcOJBJf8zGMwi4jBKrts7cuL2AAAABH/4ekAMMWP6BwAAP/4xjEBw7JnvR5gKAC0v6KqKTfGfAwoE386CAYFSgOL/OjlEkAkEQE1JlJ6KLAFFCct+INIibGiJoy7/6DRkMARKr/////////4xjEBgzBamABwcAA8Quf+8eayrUstqPs5U+pSBBmQa1l4oqqawLEnKd6XalT/S7uPMqYBA1UeEWWTEFNRTMuMTAwqqqqqqo=');
  const setCheckboxChecked = (checkboxId, isChecked) => (d.getElementById(checkboxId).checked = isChecked);
  const pinElem = d.getElementById('pin-card');
  const pinSaveElem = d.getElementById('pin-save');
  // const position = d.getElementById('position');
  const clicked = d.getElementById('clicked');
  const movable = Array.from(d.getElementsByClassName('movable'));
  const movableLength = movable.length;
  const roundToTen = num => Math.ceil(num / 12) * 12;
  const delay = ms => new Promise(resolve => w.setTimeout(resolve, ms));
  const addLeadingZero = time => (time.toString().length < 2 ? '0' + time : time);
  const getPE = elem => elem.parentElement;
  const typed = [];
  const codeDiv = d.querySelector('.wrp-container');
  const defaultPin = d.querySelector('#code');
  const done = d.querySelector('#done');
  const start = d.querySelector('#start');
  const codeDivElms = Array.from(codeDiv.children[0].children);
  const textarea = d.getElementsByTagName('TEXTAREA')[0];
  const bg = d.querySelector('#bg-file');
  const styles = ['width', 'height', 'left', 'top'];
  const blockDefaults = 'width:960px;height:48px;left:192px;top:0px;,width:384px;height:48px;left:360px;top:48px;,width:108px;height:48px;left:684px;top:48px;,width:132px;height:48px;left:900px;top:48px;,width:108px;height:48px;left:684px;top:72px;,width:324px;height:84px;left:192px;top:96px;,width:168px;height:72px;left:516px;top:96px;,width:168px;height:168px;left:516px;top:144px;,width:168px;height:144px;left:516px;top:312px;,width:168px;height:96px;left:516px;top:456px;,width:168px;height:144px;left:516px;top:528px;,width:36px;height:144px;left:1128px;top:432px;,width:156px;height:252px;left:360px;top:180px;,width:168px;height:96px;left:516px;top:648px;,width:168px;height:564px;left:192px;top:180px;,width:120px;height:48px;left:1032px;top:48px;,width:108px;height:48px;left:792px;top:48px;,width:156px;height:48px;left:360px;top:72px;,width:168px;height:48px;left:516px;top:72px;,width:156px;height:312px;left:360px;top:432px;,width:960px;height:48px;left:192px;top:24px;,width:168px;height:48px;left:192px;top:48px;,width:168px;height:48px;left:192px;top:72px;,width:144px;height:96px;left:684px;top:648px;,width:144px;height:264px;left:684px;top:144px;,width:144px;height:48px;left:684px;top:96px;,width:156px;height:336px;left:828px;top:408px;,width:156px;height:144px;left:828px;top:96px;,width:168px;height:72px;left:984px;top:672px;,width:168px;height:480px;left:984px;top:96px;,width:156px;height:168px;left:828px;top:240px;,width:168px;height:96px;left:984px;top:576px;,width:144px;height:240px;left:684px;top:408px;'
  const textAreaDefaults = ' Good day. You have the ability to reposition these blocks by clicking (□ or ▭) and holding (the left) corner or by pressing the ` key on your keyboard. ([ctrl]+[`]=Reset to Defaults) Alternatively, double-click (▭) to maximize them or minimize (□). You can also change the theme by right-clicking (context menu) and customize the colors and background image through the user interface. If locked, you can unlock it by clicking a few times on the background and then entering the default PIN: 520. Alternatively, you can clear the localStorage (since this project stores data such as PIN(password) and other settings in localStorage).';
  const counts = {
    allMouseClicks: 0,
    clicks: 0,
  };
  let saved = StorageNamespace.getItem('carbine') || [5, 2, 0];
  let minimized = [17,1,21,22,20,0,2,11,18,4];
  let mousedown = false;
  let scalingTarget = null;
  let isEnterPass = false;
  const state = {
    target: null,
    moving: false,
  };
  // add all movable class eventlistener mousedown
  textarea.addEventListener('input', async e => {
    await delay(3000);
    StorageNamespace.setItem('textarea', e.target.value.trim());
  });

  // https://stackoverflow.com/questions/45071353/copy-text-string-on-click/53977796#53977796
  const copy = d.getElementById('clipboard');
  const copyToClipboard = str => {
    if (str === '0') return (copy.textContent = '');
    const el = d.createElement('textarea'); // Create a <textarea> element
    el.value = str; // Set its value to the string that you want copied
    el.readOnly = true; // Make it readonly to be tamper-proof
    el.style.position = 'absolute';
    el.style.left = '-9999px'; // Move outside the screen to make it invisible
    d.body.appendChild(el); // Append the <textarea> element to the HTML document
    const selected = d.getSelection().rangeCount > 0 ? d.getSelection().getRangeAt(0) : false; // Check if there is any content selected previously
    // Store selection if found
    // Mark as false to know no selection existed before
    el.select(); // Select the <textarea> content
    d.execCommand('copy'); // Copy - only works as a result of a user action (e.g. click events)
    copy.textContent = str;
    d.body.removeChild(el); // Remove the <textarea> element
    if (selected) {
      // If a selection existed before copying
      d.getSelection().removeAllRanges(); // Unselect everything on the HTML document
      d.getSelection().addRange(selected); // Restore the original selection
    }
  };

  function ClickHandler(time) {
    let clicked = false;
    // this.delay = function(ms) { return new Promise(resolve => setTimeout(resolve, ms)) }
    this.buttonClicker = async function (e) {
      if (clicked === true) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }
      clicked = true;
      await delay(time);
      clicked = false;
    };
  }

  // create click handlers timeouts for A tag
  const aClickHandler = new ClickHandler(700);
  const aGetElms = Array.from(d.getElementsByTagName('a'));
  const aLength = aGetElms.length;
  for (let i = 0; i < aLength; i++) aGetElms[i].onclick = e => aClickHandler.buttonClicker(e);

  function getStyles() {
    let styleValues = [];
    for (let i = 0; i < movableLength; i++) {
      (function (i, styleValues) {
        styles.forEach(value => styleValues.push(`${value}:${movable[i].style[value]};`));
        styleValues.push(',');
      })(i, styleValues);
    }
    return styleValues.join('');
  }

  function getOffset(e) {
    const rect = e.getBoundingClientRect();
    return {
      left: rect.left + w.scrollX,
      top: rect.top + w.scrollY,
    };
  }

  let clickTimeout = null;
  const clickDelay = 520; // Time in milliseconds

  const loopElem = widthMatch => {
    // console.time()
    // movable.forEach(async (e) => {
    // using for loops for performance
    for (let i = 0; i < movableLength; i++) {
      (function (w, i, widthMatch, clickTimeout, minimized, getOffset, getStyles) {
        const e = movable[i];
        // await delay(30);
        if (widthMatch) {
          const { left, top } = getOffset(e); // Pass e as an argument
          e.style.left = roundToTen(left) + 'px';
          e.style.top = roundToTen(top) + 'px';
          e.style.position = 'absolute';
          // await delay(30);
          e.style.width = roundToTen(e.offsetWidth) + 'px';
          e.style.height = roundToTen(e.offsetHeight) + 'px';
        }
        if (e.firstElementChild) e.firstElementChild.title = ' (block index' + movable.indexOf(e) + ')';
        if (e.id === 'text-area') textarea.style.height = e.style.height;
        e.addEventListener('dblclick', e => {
          if (clickTimeout) {
            w.clearTimeout(clickTimeout);
            clickTimeout = null;
          }

          if (e.target.classList.contains('movable')) {
            const widthMatch = w.matchMedia('(min-width: 960px)').matches;
            const index = movable.indexOf(e.target);
            let arrayOfMinimized = [...(StorageNamespace.getItem('element-class') || minimized)];
            if (e.target.classList.contains('minimized')) {
              arrayOfMinimized = arrayOfMinimized.filter(c => c !== index);
              e.target.classList.remove('minimized');
              e.target.style.width = 'auto';
              e.target.style.height = 'auto';
              let height = roundToTen(e.target.offsetHeight);
              let width = roundToTen(e.target.offsetWidth);
              if (e.target.id === 'text-area') height -= 24;
              e.target.style.width = width + 'px';
              e.target.style.height = height + 'px';
              //add popup overlay
            } else if (e.target.classList.contains('movable')) {
              e.target.classList.add('minimized');
              arrayOfMinimized.push(index);
            }
            if (widthMatch) {
              StorageNamespace.setItem('element-styles', getStyles());
            }
            StorageNamespace.setItem('element-class', arrayOfMinimized);
          }
        });
        e.addEventListener('mousedown', function (e) {
          if (e.target === this) {
            state.moving = true;
          }

          if (state.target !== null) {
            state.target.style.zIndex = 1;
          }

          state.target = this;
          state.target.style.zIndex = 2;

          if (!clickTimeout) {
            // If no pending click, set a timeout for single click action
            clickTimeout = w.setTimeout(() => {
              // console.log('Single click action');

              if (state.moving) {
                state.target.classList.add('down');
                root.classList.add('move');
                main.classList.add('bg-lines');
              }
              clickTimeout = null;
            }, clickDelay);
          }
        });
      })(w, i, widthMatch, clickTimeout, minimized, getOffset, getStyles);
      // console.timeEnd()
    }
  };

  class Clock {
    constructor(clockElementId) {
      this.clockElement = d.getElementById(clockElementId);
    }
    formatTimeUnit(unit) {
      return unit < 10 ? `0${unit}` : unit;
    }
    getCurrentTime() {
      const day = new Date();
      return {
        m: this.formatTimeUnit(day.getMinutes()),
        s: this.formatTimeUnit(day.getSeconds()),
        h: this.formatTimeUnit(day.getHours()),
      };
    }
    updateClock() {
      const { h, m, s } = this.getCurrentTime();
      this.clockElement.textContent = [h, m, s].join(':');
    }
    startTime() {
      this.updateClock();

      const gogo = w.setTimeout(
        function () {
          w.clearTimeout(gogo);
          this.startTime();
        }.bind(this),
        1000
      ); // when minutes update change 6000
    }
  }

  function showWeekDay() {
    const weekday = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const d = new Date();
    return weekday[d.getDay()];
  }

  function showDate() {
    let d = new Date();
    let formatter = Intl.DateTimeFormat(
      'lt-LT', // a locale name; "default" chooses automatically
      {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      }
    );

    return formatter.format(d).slice(0, 10);
  }
  // api current list temperatures
  //const api_url_current = "https://api.open-meteo.com/v1/forecast?latitude=55.7068&longitude=21.1391&current=temperature_2m";
  // api url list temperatures
  const api_url = 'https://api.open-meteo.com/v1/forecast?latitude=55.7068&longitude=21.1391&hourly=temperature_2m';
  // Defining async function
  async function getAll(url) {
    // Storing response
    const response = await w.fetch(url);
    // Storing data in form of JSON
    const data = await response.json();
    // no data? return
    if (!response || !data) return false;
    // set data to storage
    return StorageNamespace.setItem('temperature', data.hourly.temperature_2m);
  }

  // round values replace for better showing stats
  function reduceValuesDynamically(arr, max) {
    if (arr.length === 0) return arr; // Return an empty array if input array is empty
    const maxInArray = Math.max(...arr.map(value => Math.abs(value)));
    const percentage = maxInArray > max ? ((maxInArray - max) / maxInArray) * 100 : 0;
    const factor = 1 - percentage / 100;
    const resultArray = arr.map(value => Math.min(value * factor, max));
    return resultArray;
  }

  //stats for TEMPERATURE api
  function stats(data) {
    // no data? return
    if (!data) return;
    const stats = d.querySelector('#stats');

    // Create a new Date object
    const now = new Date();
    // Get the current hour between 0 and 23, representing the hours in a day
    const currentHour = now.getHours();

    const main = d.querySelector('.svg-holder');
    // make length shorter
    data.length = 34;
    const arrayConverted = reduceValuesDynamically(
      data.map(e => e.toFixed(2) * 10),
      8
    );
    const svg = d.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('version', '1.1');
    svg.setAttribute('viewBox', '0 0 100 16');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('id', 'sunshine');
    let space = 2;
    for (let i = 0; i < arrayConverted.length; i++) {
      const result = arrayConverted[i] > 0 ? 8 - arrayConverted[i] : 8 - arrayConverted[i];
      const fixed = result.toFixed(2);
      const path = d.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', 'M' + space + ',' + fixed + ' V 8');
      path.setAttribute('stroke-width', '2');
      path.setAttribute('data-value', data[i]);
      // add hour numbers
      if (i < 24) path.setAttribute('data-hour', i);
      // set other color of selected hour
      if (currentHour === i) path.setAttribute('style', 'stroke:var(--color4)');
      //show 24hrs only solid color other transparent
      if (i > 23) path.setAttribute('class', 'tr');
      svg.appendChild(path);
      space += 3;
    }
    main.appendChild(svg);

    const output = negativeOrPositive(data[currentHour]) + '°C';

    main.addEventListener('mouseover', function (e) {
      // Extracting the target element from the event object
      const targetElement = e.target;

      // Checking if the target element is a 'path'
      if (targetElement.tagName === 'path') {
        // Retrieving temperature and hour data attributes from the target element
        const temperature = negativeOrPositive(targetElement.getAttribute('data-value'));

        const hour = targetElement.getAttribute('data-hour');

        // Setting the text content of the 'stats' element with temperature
        let statsText = temperature + '°C';

        // If hour data is available, formatting it with leading zero and appending it to statsText
        if (hour !== null) {
          const hourText = '|' + addLeadingZero(parseInt(hour)) + 'h';
          statsText += hourText;
        }

        // Setting the text content of the 'stats' element
        stats.innerText = statsText;
      }
    });
    main.addEventListener('mouseout', () => (stats.innerText = output));
    stats.innerText = output;
  }

  function applyStyles(defaults, widthMatch) {
    const styles = StorageNamespace.getItem('element-styles') || blockDefaults;
    const minimizedElements = StorageNamespace.getItem('element-class') || minimized;
    const getStyle = styles.split(',');
    for (let i = 0; i < movableLength; i++) {
      if (widthMatch) {
        movable[i].style = getStyle[i];
        movable[i].style.position = 'absolute';
      }
      if (defaults) {
        if (minimized.includes(movable.indexOf(movable[i]))) {
          movable[i].classList.add('minimized');
        } else {
          movable[i].classList.remove('minimized');
        }
      } else {
        // add minimized class if found index in array
        if (minimizedElements.includes(movable.indexOf(movable[i]))) {
          movable[i].classList.add('minimized');
        }
      }
    }
  }

  function setTimeStamp(interval) {
    // Check if localStorage is available
    if (typeof localStorage === 'undefined') {
      w.console.error('localStorage is not available.');
      return false;
    }

    // Get current date in seconds
    const currentDate = Math.floor(new Date().getTime() / 1000);

    // Retrieve previous timestamp from localStorage
    const previousTimeStamp = parseInt(StorageNamespace.getItem('time-stamp'));

    // If timestamp exists and interval has not passed, return false
    if (!isNaN(previousTimeStamp) && currentDate - previousTimeStamp < interval) {
      return false;
    }

    // Set new timestamp in localStorage
    StorageNamespace.setItem('time-stamp', currentDate.toString());

    // Return true to indicate that interval has passed
    return true;
  }

  // for theme changing
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

  const themeName = d.getElementById('theme-name');
  const longNames = ['inner peace', 'peace on earth', 'cool dudes', 'sunshine', 'someday', 'everything fine', 'night', 'green', 'happiness', 'jupiter', 'Karma', 'lightness', 'marigold', 'neutral', 'optimistic', 'paradise', 'colored calcium', 'respect', 'silver'];
  const classNameVariables = [0, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y'];
  const nightThemes = ['b', 'd', 'f', 'g', 'o', 'p', 'q', 'r', 't', 'v', 'y'];
  const THEME_CHANGE = arrayHelper.call(classNameVariables);

  // change main theme
  const changerClass = index => {
    themeName.textContent = longNames[index] || 'other';
    if (index) root.className = classNameVariables[index];
    else root.className = 'default';

    if (d.getElementById('bg-image').checked === true) {
      root.classList.add('bg-image');
    } else {
      root.classList.remove('bg-image');
    }
  };

  // move all blocks at once
  const loops = async (pos, val) => {
    // console.time()
    const selected = Array.from(d.getElementsByName('move')).filter(e => e.checked)[0].value;
    for (let i = 0; i < movableLength; i++) {
      const e = movable[i];
      if (e.id !== 'moves') e.style[pos] = parseInt(e.style[pos]) + val * selected + 'px';
      // movable.forEach(e => e.id !== "moves" && (e.style[pos] = parseInt(e.style[pos]) + val * selected + "px"));
    }
    // console.timeEnd();
    await delay(300);
    StorageNamespace.setItem('element-styles', getStyles());
  };

  const moves = d.getElementById('moves');
  // toggle classList hide
  function classToggle(e) {
    if (e.isComposing || e.key === 'Unidentified') return;

    // event key or target id
    const keyCode = e.key || String.fromCharCode(e.keyCode);

    if ((e.ctrlKey || e.metaKey) && keyCode === '`') {
      // Prevent the default reload
      e.preventDefault();
      // clear local storage
      StorageNamespace.clear();
      w.location.reload(); // This reloads the page after your actions
      // check if it's [`] symbol and inputs not focused then toggle class
    } else if (keyCode === '`' && !d.querySelector('input:focus')) {
      moves.classList.toggle('hide');
      e.preventDefault();
    }
  }

  const isDisplayed = elem => {
    const style = w.getComputedStyle(elem);
    const isDisplay = style.getPropertyValue('display') !== 'none' ? true : false;
    return isDisplay;
  };
  // Retrieve all counter elements
  const counters = d.querySelectorAll('.timers');
  // Function to get the input element from a counter element
  const getElem = e => e.querySelector('input');
  // Counter object definition
  const counter = {
    min: 1,
    max: 100,
    number: 0,
    numberMinus1() {
      return this.number - 1;
    },
    numberPlus1() {
      return this.number + 1;
    },

    set numbers(number) {
      // Use Math.abs to ensure the correct comparison
      if (number > Math.abs(this.max || number < this.min)) return;
      this.number = number;
    },
    get numbers() {
      return this.number;
    },
  };

  // Seal the counter object
  Object.seal(counter);

  // Function to save all input values to localStorage
  const saveAllInputs = () => {
    const values = Array.from(counters, counter => getElem(counter).value);
    StorageNamespace.setItem('input-values', values.join(','));
  };

  // Flag to prevent multiple saves during a short time
  let isSaving = false;

  // Function to set items and trigger saving
  async function setItems(element) {
    if (isSaving) return;
    isSaving = true;
    element.classList.add('saved');
    await delay(500);
    saveAllInputs();
    element.classList.remove('saved');
    isSaving = false;
  }

  // Function to highlight an element temporarily
  const hightLight = async element => {
    element.classList.add('max');
    await delay(200);
    element.classList.remove('max');
  };

  // Function to handle button click and adjust counter
  const increase = e => {
    const { target } = e;
    if (target.tagName !== 'BUTTON') return;

    const { currentTarget } = e;
    const inputElement = getElem(currentTarget);
    counter.numbers = parseInt(inputElement.value);

    if (target.textContent === '—') {
      if ((inputElement.min || counter.min) < counter.numbers) {
        counter.numbers = inputElement.value = addLeadingZero(counter.numberMinus1());
      } else return hightLight(target);
    }

    if (target.textContent === '+') {
      if (parseInt(inputElement.max || counter.max) > counter.numbers) {
        counter.numbers = inputElement.value = addLeadingZero(counter.numberPlus1());
      } else return hightLight(target);
    }
    setItems(currentTarget.parentElement);
  };

  // Function to handle input value change
  const inputChange = e => {
    const { target } = e;
    if (isNaN(parseInt(target.value)) || (Math.max(parseInt(target.min)) || counter.min) > parseInt(target.value)) {
      target.value = target.min || counter.min;
    } else if ((Math.max(parseInt(target.max)) || counter.max) < parseInt(target.value)) {
      target.value = target.max || counter.max;
    } else {
      target.value = addLeadingZero(target.value);
    }
    setItems(target.parentElement);
  };

  // Retrieve input values from localStorage
  const values =
    StorageNamespace.getItem('input-values') &&
    StorageNamespace.getItem('input-values')
      .split(',')
      .map(Number => addLeadingZero(Number));
  // console.time()

  // Initialize counters with values and event listeners
  // counters.forEach((counter, i) => {
  const countersLength = counters.length;
  for (let i = 0; i < countersLength; i++) {
    const counter = counters[i];
    const inputElement = getElem(counter);
    inputElement.value = (values && values[i]) || inputElement.value || inputElement.min || 1;
    counter.addEventListener('click', increase);
    inputElement.addEventListener('change', inputChange);
  }
  // });
  // console.timeEnd()

  function Repeater(time, stopCase, callback) {
    this.timesRepeated = 0;
    this.timeOut = 0;
    this.stop = () => w.clearTimeout(this.timeOut);
    // create inner function with arrow to not loose context of this
    const inner = () => {
      this.timeOut = w.setTimeout(
        function () {
          w.clearTimeout(this.timeOut);
          this.timeOut = 0;
          this.timesRepeated++;
          //if not number and true || less than stop case repeat else not
          if ((isNaN(stopCase) && stopCase) || this.timesRepeated < stopCase) inner();
          else w.clearTimeout(this.timeOut);
          callback();
        }.bind(this),
        time || 1000
      ); // if no time default 1000ms (1s)
      return this;
    };
    inner(); // load inner function
  }

  function playSound() {
    soundCalculator.play();
  }

  function Counter() {
    let startTime = null;
    let lastUpdateTime = null;
    let remainingSeconds = 0;
    let isCounting = false;
    let animationFrameId = null;

    this.counterTime = d.getElementById('counter-time');
    this.seconds = d.getElementById('seconds');
    this.minutes = d.getElementById('minutes');
    this.hours = d.getElementById('hours');

    this.totalSeconds = function () {
        return (
            Number(this.seconds.value) +
            Number(this.minutes.value) * 60 +
            (this.hours ? Number(this.hours.value) * 3600 : 0)
        );
    };

    const updateCounter = (timestamp) => {
        if (!startTime) {
            startTime = timestamp;
            lastUpdateTime = timestamp;
        }

        let elapsed = (timestamp - lastUpdateTime) / 1000; // Elapsed time in seconds
        if (elapsed >= 1) {
            remainingSeconds -= Math.floor(elapsed);
            lastUpdateTime = timestamp;
            this.counterTime.textContent = '-' + addLeadingZero(Math.max(remainingSeconds, 0));
        }

        if (remainingSeconds > 0) {
            animationFrameId = requestAnimationFrame(updateCounter);
        } else {
            this.complete();
        }
    };

    this.start = function () {
        if (!isCounting) {
            isCounting = true;
            startTime = performance.now();
            lastUpdateTime = startTime;
            remainingSeconds = this.totalSeconds();
            this.counterTime.textContent = '-' + addLeadingZero(remainingSeconds);
            animationFrameId = requestAnimationFrame(updateCounter);
        }
    };

    this.stop = function () {
        isCounting = false;
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
        startTime = null;
        this.counterTime.textContent = addLeadingZero(this.totalSeconds());
        d.getElementById('start').innerText = 'Start';
    };

    this.reset = function () {
        this.stop();
        this.counterTime.textContent = this.seconds.value = this.minutes.value = '00';
        if (this.hours) this.hours.value = '00';
    };

    this.complete = function () {
        this.stop();
        this.counterTime.textContent = 'DONE!';
        if (d.getElementById('sounds-ding').checked) {
            const rep1 = new Repeater(100, 50, playSound);
            const rep2 = new Repeater(1000, 100, playSound);
            show(done.parentElement);
            done.onclick = (e) => {
                rep1.stop();
                rep2.stop();
                hide(e.target.parentElement);
                this.counterTime.textContent = addLeadingZero(this.totalSeconds());
            };
        }
    };

    Object.defineProperties(this, {
        remainingSeconds: {
            get: function () {
                return remainingSeconds;
            },
        },
        isCounting: {
            get: function () {
                return isCounting;
            },
        },
    });
}


  // set Counter global variable
  const timers = new Counter();

  function toggleClassFromStorage(storageKey, element) {
    const isChecked = StorageNamespace.getItem(storageKey);
    setCheckboxChecked(storageKey, isChecked);
    element.classList.toggle(storageKey, isChecked);
    return isChecked; // Return the value of the storage key
  }

  function updateOnlineStatusUI(isOnline) {
    if (isOnline) {
      onlineElement.classList.remove('small');
      onlineElement.textContent = 'connected';
    } else {
      onlineElement.classList.add('small');
      onlineElement.textContent = 'disconnected';
    }
  }
  async function init() {
    // lines background
    toggleClassFromStorage('bg-lines', main);
    toggleClassFromStorage('bg-image', root);
    toggleClassFromStorage('bg-repeat', main);
    toggleClassFromStorage('mode-cute', d.body);
    toggleClassFromStorage('mode-popup', d.body);
    toggleClassFromStorage('mode-numbering', d.body);
    if (toggleClassFromStorage('mode-night', d.body)) doAfter19h(performNightThemeChange);

    // set remembered last counter seconds
    timers.counterTime.textContent = addLeadingZero(timers.totalSeconds());

    defaultPin.title = saved;

    d.getElementById('day-of-week').textContent = showWeekDay();
    const documentTitle = d.title;

    const loacalStorageText = StorageNamespace.getItem('textarea');

    textarea.value = loacalStorageText ? loacalStorageText : typeof typeText(textarea, textAreaDefaults) === 'string'? typeText(textarea, textAreaDefaults) : '';
    const widthMatch = w.matchMedia('(min-width: 960px)').matches;
    const storageVersion = StorageNamespace.getItem('version');
    if (version !== storageVersion) {
      StorageNamespace.clear();
      StorageNamespace.setItem('version', version);

      root.removeAttribute('class');
      root.removeAttribute('style');
      textarea.removeAttribute('style');
      setColors();
      changerClass(0);
      applyStyles(true, widthMatch);
      loopElem(widthMatch);
      centerElements();
      //reload versions
      // w.location.reload(); // This reloads the page after your actions
    } else {
      applyStyles(false, widthMatch);
      loopElem(widthMatch);
    }

    hide(codeDiv);

    // const isLocked = StorageNamespace.getItem('is-locked');
    const codeDivElmsLength = codeDivElms.length;
    for (let i = 0; i < codeDivElmsLength; i++) {
      (function (i, d, isLocking, isEnterPass, saved) {
        codeDivElms[i].onclick = e => {
          e.stopPropagation(); //prevent from parent clicks
          typed.push(codeDivElms.indexOf(e.target));
          if (isEnterPass === false && typed.length === saved.length && typed.every((v, i) => v === saved[i])) {
            StorageNamespace.setItem('is-locked', false);

            d.title = documentTitle;
            hide(codeDiv);
            show(main);
            isLocking();
          }
        };
      })(i, d, isLocking, isEnterPass, saved);
    }

    const NUM = parseInt(StorageNamespace.getItem('theme')) || 0;
    THEME_CHANGE.value = NUM;
    changerClass(NUM);
    styleRoot();
    setColors();

    // renew clock if only displayed
    if (isDisplayed(d.getElementById('clock').parentElement)) {
      const clock = new Clock('clock');
      clock.startTime();
    }

    d.getElementById('today').innerHTML = showDate();
    d.getElementById('loader').style.display = 'none'; // Hide the loader
    d.getElementById('content').style.visibility = 'visible'; // Show the content
    resizeElementToFullSize();

    //is time 43m passed and we are online?
    if (setTimeStamp(77) && online) {
      await getAll(api_url);
    }
    // show the data to user
    stats(StorageNamespace.getItem('temperature'));
        // events listeners
    bg.addEventListener('change', bgChange);
    root.addEventListener('click', rootClick);
    root.addEventListener('contextmenu', contextMenuFun);
    d.addEventListener('dblclick', dblclickFun);
    d.addEventListener('mousemove', throttle(mouseMoveEvents, 70));
    d.addEventListener('mousedown', mouseDownEvents);
    d.addEventListener('mouseup', mouseUpEvents);
  }

  // const concat = (...arrays) => [].concat(...arrays.filter(Array.isArray));

  async function typeText(textarea, text, delayMs = 70) {
    for (let i = 0; i < text.length; i++) {
      await delay(delayMs);            // wait before next char, don't append delay!
      textarea.value += text[i];       // append single character
      textarea.scrollTop = textarea.scrollHeight;
    }
  }


  function setColors() {
    const compStyles = w.getComputedStyle(root);
    const colors = d.querySelectorAll('#colors input[type=color]');
    const arrayColors = [];
    const colorsLength = colors.length;
    const rootStyle = styleRoot;

    for (let i = 0; i < colorsLength; i++) {
      const e = colors[i];
      const compValue = compStyles.getPropertyValue('--color' + i).toUpperCase();
      arrayColors[i] = `--color${i}:${compValue}`;
      e.value = e.title = compValue;
      const label = getPE(e).getElementsByTagName('label')[0];
      label.innerText = compValue;

      e.addEventListener('input', event => {
        const target = event.target;
        const label = getPE(target).getElementsByTagName('label')[0];
        label.innerText = target.value.toUpperCase();
        const index = Array.from(colors).indexOf(target);
        arrayColors[index] = `--color${index}:${target.value.toUpperCase()}`;
        StorageNamespace.setItem('custom-theme', arrayColors.filter(Boolean));
        rootStyle();
      });
    }
  }

  function styleRoot() {
    const styleItems = ['bg-image', 'custom-theme'];
    const arrayOfItems = styleItems
      .map(item => StorageNamespace.getItem(item))
      .filter(Boolean)
      .flat();
    root.style.cssText = arrayOfItems.join(';');
  }

  function contextMenuFun(e) {
    e.preventDefault();

    if (e.target.tagName === 'MAIN') {
      e.preventDefault();
      THEME_CHANGE.decrement();
      changerClass(THEME_CHANGE.value);
      //set local storage only when user click
      StorageNamespace.setItem('theme', THEME_CHANGE.value);
      setColors();
    }

    if (((e.target.textContent || e.target.value) && e.target.tagName !== 'BUTTON' && e.target.getAttribute('type') && e.target.getAttribute('type').toUpperCase() !== 'BUTTON' && e.target.getAttribute('type').toUpperCase() !== 'SUBMIT' && e.target.getAttribute('type').toUpperCase() !== 'RESET') || e.target.tagName.toLowerCase() === 'p' || e.target.tagName.toLowerCase() === 'i' || e.target.tagName.toLowerCase() === 'textarea' || e.target.id === 'clipboard') {
      copyToClipboard(e.target.textContent || e.target.value);
    }
  }
  const classNamesForRotations = [0, 'r1', 'r2', 'r3'];
  const rotations = arrayHelper.call(classNamesForRotations);

  function rootClick(e) {
    const clickedElement = e.target;
    const target = clickedElement.id;

    if (clickedElement.tagName == 'H1' && d.body.classList.contains('mode-popup')) {
      overlay.classList.toggle('hide', !overlay.classList.contains('hide'));
    }

    if (target === 'gt') THEME_CHANGE.decrement();
    if (target === 'lt') THEME_CHANGE.increment();

    if (target === 'left') loops('left', -1);
    if (target === 'right') loops('left', 1);
    if (target === 'top') loops('top', -1);
    if (target === 'bottom') loops('top', 1);
    // do not alow click button when popup not closed
    if (target === 'start' && !done.parentElement.classList.contains('hide')) return;

    if (target === 'start' && !timers.isCounting) {
      timers.start();
      start.innerText = 'Stop';
    } else if (target === 'done' || (target === 'start' && timers.isCounting)) {
      timers.stop();
    }
    if (target === 'reset') {
      //remove from localStorage values (input-values)
      StorageNamespace.removeItem('input-values');
      timers.reset();
    }

    if (e.target.tagName === 'BUTTON' && e.target.parentElement.classList.contains('counter')) {
      if (timers.isCounting) {
        timers.stop();
        timers.start();
      }
      timers.counterTime.textContent = addLeadingZero(timers.totalSeconds());
    }

    if (target === 'lt' || target === 'gt') {
      changerClass(THEME_CHANGE.value);
      StorageNamespace.setItem('theme', THEME_CHANGE.value);
      setColors();
    }
    if (target === 'center-elements') {
      centerElements();
    }

    if (target === 'rotate90') {
      main.classList.remove('r' + rotations.value);
      rotations.increment();
      //remove class and return (default class)
      if (rotations.value === 0) return;
      main.classList.add(classNamesForRotations[rotations.value]);
    }
    if (target === 'controls-hide') moves.classList.add('hide');

    if (target === 'custom-theme' || target === 'bg-toggle' || target === 'reset-all' || target === 'bg-image') {
      e.target.removeAttribute('style');
      StorageNamespace.removeItem(target);
      styleRoot();
    }

    if (target === 'reset-all') {
      StorageNamespace.clear();
      root.removeAttribute('class');
      root.removeAttribute('style');
      textarea.removeAttribute('style');
      setColors();
      changerClass(0);
      applyStyles(true, false);
      // loopElem();
      // centerElements();
    }
    // set att once theme lines class and item of localStorage
    const bgLines = 'bg-lines';
    if (target === bgLines) {
      if (!main.classList.contains('bgLines') && e.target.checked) {
        StorageNamespace.setItem(bgLines, true);
        main.classList.add(bgLines);
      } else {
        StorageNamespace.setItem(bgLines, false);
        main.classList.remove(bgLines);
      }
    }

    // set cuteMode  theme lines class and item of localStorage
    const cuteMode = 'mode-cute';
    if (target === cuteMode) {
      if (!main.classList.contains(cuteMode) && e.target.checked) {
        StorageNamespace.setItem(cuteMode, true);
        d.body.classList.add(cuteMode);
      } else {
        StorageNamespace.setItem(cuteMode, false);
        d.body.classList.remove(cuteMode);
      }
    }

    // set mode-popup
    const popupMode = 'mode-popup';
    if (target === popupMode) {
      if (!main.classList.contains(popupMode) && e.target.checked) {
        StorageNamespace.setItem(popupMode, true);
        d.body.classList.add(popupMode);
      } else {
        StorageNamespace.setItem(popupMode, false);
        d.body.classList.remove(popupMode);
      }
    }

    // set mode-night mode
    const numberingMode = 'mode-numbering';
    if (target === numberingMode) {
      if (!main.classList.contains(numberingMode) && e.target.checked) {
        StorageNamespace.setItem(numberingMode, true);
        d.body.classList.add(numberingMode);
      } else {
        StorageNamespace.setItem(numberingMode, false);
        d.body.classList.remove(numberingMode);
      }
    }

    // set mode-night mode
    const dayNight = 'mode-night';
    if (target === dayNight) {
      if (!main.classList.contains(dayNight) && e.target.checked) {
        StorageNamespace.setItem(dayNight, true);
        // d.body.classList.add(dayNight);
        doAfter19h(performNightThemeChange);
      } else {
        StorageNamespace.setItem(dayNight, false);
        // d.body.classList.remove(dayNight);
      }
    }

    if (target === 'bg-image') {
      const repeatBg = d.getElementById('bg-repeat');
      if (!root.classList.contains('bg-image') && e.target.checked) {
        StorageNamespace.setItem('bg-image', true);
        root.classList.add('bg-image');
      } else {
        repeatBg.checked = false;
        main.classList.remove('bg-repeat');
        StorageNamespace.setItem('bg-repeat', false);

        root.classList.remove('bg-image');
        StorageNamespace.setItem('bg-image', false);
      }
    }
    if (target === 'bg-repeat') {
      const bg = d.getElementById('bg-image');
      if (!main.classList.contains('bg-repeat') && e.target.checked) {
        bg.checked = true;
        StorageNamespace.setItem('bg-repeat', true);
        main.classList.add('bg-repeat');
        StorageNamespace.setItem('bg-image', true);
        root.classList.add('bg-image');
      } else {
        // bg.checked = false
        main.classList.remove('bg-repeat');
        StorageNamespace.setItem('bg-repeat', false);
        // root.classList.remove('bg-image');
        // StorageNamespace.setItem('theme-bg', false);
      }
    }
    if (target === 'custom-theme') setColors();
    if (target === 'bg-image') bg.value = '';

    // only for locking system
    if (target === 'lock') {
      StorageNamespace.setItem('is-locked', true);
      hide(main);
      d.title = 'New Tab';
      counts.clicks = 0;
      isLocking();
    }

    if (target === 'code') {
      typed.length = 0;
      show(codeDiv);
      isEnterPass = true;
    }

    if (target === 'pin-save' && typed.length) {
      StorageNamespace.setItem('carbine', typed);
      isEnterPass = false;
      saved = StorageNamespace.getItem('carbine');
      defaultPin.title = saved;
      hide(codeDiv);
    }
    if (target === 'pin-card') {
      hide(codeDiv);
    }
    const isLockedScreen = StorageNamespace.getItem('is-locked');
    // count clicked
    counts.clicks++;
    if (e.target.className !== 'container' && counts.clicks > 2 && isLockedScreen) {
      counts.clicks = typed.length = 0; // RESET array length and count when not container clicked
      show(codeDiv);
    }

    // show statistics about mouse
    counts.allMouseClicks++;
    clicked.textContent = counts.allMouseClicks;

    if (isEnterPass) {
      show(pinElem);
      show(pinSaveElem);
    } else {
      hide(pinSaveElem);
      hide(pinElem);
    }

    // Check if the clicked element is one of the search inputs
    const searchInputs = ['duckduckgo', 'google', 'ecosia'];
    if (searchInputs.includes(target)) {
      const inputElement = document.getElementById(target);
      if (inputElement) {
        inputElement.value = ''; // Clear the input value
      }
    }
  }

  function dblclickFun(e) {
    if (e.target === copy) e.target.textContent = '';
    //if (e.target.tagName === "TEXTAREA") e.target.value = "";
    if (e.target.classList.contains('movable')) {
      resizeElementToFullSize();
    }
  }

  function bgChange(e) {
    const inputValue = e.target.files[0];
    const reader = new w.FileReader();

    reader.addEventListener(
      'load',
      () => {
        const fileString = `--bg:url(${reader.result || 'none'})`;
        StorageNamespace.setItem('bg-image', fileString);
        styleRoot();
      },
      false
    );

    if (inputValue) reader.readAsDataURL(inputValue);
  }

  const mouseMoves = e => {
    e.style.left = roundToTen(cursorPositions.x) + 'px';
    e.style.top = roundToTen(cursorPositions.y + root.scrollTop) + 'px';
  };

  const cursorPositions = {
    y: 0,
    x: 0,
  };

  function mouseMoveEvents(event) {
    const { moving, target } = state;
    // Exit early if not moving or target is invalid or not 'movable'
    if (!moving || !target || !target.classList.contains('movable')) return;
    // Calculate the cursor position with an offset
    cursorPositions.x = event.clientX - 12;
    cursorPositions.y = event.clientY - 12;

    // Update scroll position to keep the target element visible while moving
    root.scrollTo(cursorPositions.x, cursorPositions.y);

    // Trigger the actions related to moving the target and resizing
    mouseMoves(target);
    resizeElementToFullSize();
  }

  function mouseUpEvents(e) {
    const eventTarget = e.target;
    // Make opacity (highlight).5 for links with class "movable" till next refresh(like visited)
    if (eventTarget.tagName === 'A') {
      if (d.hasFocus()) {
        eventTarget.style.opacity = '.5';
        // Default behavior: let the browser handle navigation
      } else {
        e.preventDefault(); // Block navigation
        alert('Please activate the tab before clicking the link.');
      }
    }
    state.moving = false;

    // GLOBAL target!!!
    if (!state.target) return;
    const peTarget = getPE(state.target);
    const targetClass = peTarget ? peTarget.className : null;
    const widthMatch = w.matchMedia('(min-width: 960px)').matches;

    if (targetClass && widthMatch) {
      state.target.classList.remove('down');
      root.classList.remove('move');
      if (!d.getElementById('bg-lines').checked) main.classList.remove('bg-lines');
      StorageNamespace.setItem('element-styles', getStyles());
    }

    try {
      if (scalingTarget && peTarget && scalingTarget.tagName === 'TEXTAREA' && scalingTarget !== null) {
        const peScalingTarget = getPE(scalingTarget);
        scalingTarget.style.height = peScalingTarget.style.height = roundToTen(peScalingTarget.offsetHeight) + 'px';
        peScalingTarget.style.width = roundToTen(peScalingTarget.offsetWidth) + 'px';
        StorageNamespace.setItem('element-styles', getStyles());
      }
    } catch (error) {
      w.console.log({
        error,
      });
    }
  }

  function mouseDownEvents(e) {
    cursorPositions.x = e.clientX;
    cursorPositions.y = e.clientY;

    scalingTarget = e.target;
    if (scalingTarget.tagName === 'TEXTAREA') {
      mousedown = true;

      const computedStyles = w.getComputedStyle(scalingTarget);
      const height = computedStyles.getPropertyValue('height');
      const width = computedStyles.getPropertyValue('width');
      const parentElement = getPE(scalingTarget);

      scalingTarget.style.width = roundToTen(parseInt(width)) + 'px';
      scalingTarget.style.height = roundToTen(parseInt(height)) + 'px';

      parentElement.style.width = 'auto';
      parentElement.style.height = 'auto';
    }
  }

  function centerElements() {
    const container = document.getElementById('main');
    const elements = document.querySelectorAll('.movable');

    let leftmost = Number.POSITIVE_INFINITY;
    let rightmost = Number.NEGATIVE_INFINITY;

    // Find the leftmost and rightmost positions
    elements.forEach(el => {
      const left = el.getBoundingClientRect().left - container.getBoundingClientRect().left;
      const right = left + el.offsetWidth;

      leftmost = Math.min(leftmost, left);
      rightmost = Math.max(rightmost, right);
    });

    // Calculate the center position
    const containerWidth = container.offsetWidth;
    const totalWidth = rightmost - leftmost;
    const centerPosition = (containerWidth - totalWidth) / 2;

    // Move elements to center
    elements.forEach(el => {
      const currentLeft = el.getBoundingClientRect().left - container.getBoundingClientRect().left;
      const newLeft = currentLeft - leftmost + centerPosition;
      el.style.left = `${Math.floor(newLeft / 12) * 12}px`; // round more to left
    });
    StorageNamespace.setItem('element-styles', getStyles());
  }

  function throttle(func, delay) {
    let lastCallTime = 0;

    return function () {
      const now = new Date().getTime();

      if (now - lastCallTime >= delay) {
        func.apply(null, arguments);
        lastCallTime = now;
      }
    };
  }

   // Constants for audio and theme management
    const BEEP_AUDIO_DATA = "data:audio/mp3;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAAFAAAGUACFhYWFhYWFhYWFhYWFhYWFhYWFvb29vb29vb29vb29vb29vb29vb3T09PT09PT09PT09PT09PT09PT0+np6enp6enp6enp6enp6enp6enp//////////////////////////8AAAAKTEFNRTMuMTAwBEgAAAAAAAAAABUgJAMGQQABmgAABlAiznawAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uwxAAABLQDe7QQAAI8mGz/NaAB0kSbaKVYOAAwuD4PwfB8Hw/g+D8H35QMcEOCfnOXD/P8oCAIHENuMju+K0IbGizcAgIAAAAK4VMEjUtBpa3AZfMmIR0mGUiMIgAmWcP4BVTLDKgwkbAod3goJAukMKBwAy4dIFA2yISQtJvqrpysRZSSAUsr8lZCk1uZg52mtN87MLyao5llXvhptc8GS6aIo0703I8n2ZbhSy74/B/XSXNbTtJh0tpIk4vIw2lm1NwflLnhxaaIJnAZKbuAAABVYLjjg+ymRd5mSSKuZ3WVX8W6s7lvNO8/zKm+Z6mW02zlTdx4zJHBHKeq2ef800B1u448/4BUC5////HlKaLHHGrDLkyZ5Acpp1/GrKX9osYetf+ONWljzBpdafwJoGVoFOerIAAz/dYdC17v69x2iVP00C+SIXp/TNB1DOl/GGNvqSHae7susU29FEYw3I4lurLGlUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQCSzgAACrP+KA4i/0UP2beg5/+ryIAgQm/6CfSqTEFNRTMuMTAwqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpMQU1FMy4xMDCqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqkxBTUUzLjEwMKqqqqqqqqqqqqqqqqr/+2DE1AANAL1X/YwAKNkS6fQmNJyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr/+xDE5IDCpD1DIB3nQBwFKGAAiMSqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/7EMTWA8AAAf4AAAAgAAA/wAAABKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqo";
  const BEEP_AUDIO = new w.Audio(BEEP_AUDIO_DATA);

  const soundToggle = d.querySelector('.calculator__button--sound');
  const calculator = d.querySelector('.calculator__wrapper');
  const calcScreen = d.querySelector('.calculator__screen');
  calcScreen.value = 0;

  let n1 = [];
  let n2 = 0;
  let op = null;
  let last = null;
  let result = 0;

  const sound = () => {
    BEEP_AUDIO.play();
    if (typeof w.navigator.vibrate === 'function') {
      w.navigator.vibrate(30);
    }
  };

  const add = (n, o) => n + o;
  const sub = (n, o) => n - o;
  const div = (n, o) => n / o;
  const mul = (n, o) => n * o;
  const res = n => n;

  const calc = {
    '÷': div,
    '×': mul,
    '+': add,
    '-': sub,
    '=': res,
  };

  const cal = (num1, num2, callback) => {
    if (typeof callback === 'function') {
      const n1 = num1.toString().split('.')[1];
      const n2 = num2.toString().split('.')[1];
      const len1 = (n1 && n1.length) || 0;
      const len2 = (n2 && n2.length) || 0;
      if (last !== '÷') {
        return parseFloat(callback(Number(num1), Number(num2)).toFixed(len1 + len2));
      }
      return callback(Number(num1), Number(num2));
    }
  };

function btn(e) {
  const target = e.target;

  // Ignore clicks on non-button elements or excluded inputs
  const isIgnoredElement =
  !target.matches('input') ||
  target.classList.contains('calculator__button--sound') ||
  target.classList.contains('calculator__screen');

  if (isIgnoredElement) {
    e.preventDefault();
    e.stopPropagation();
    return;
  }

  if (soundToggle?.checked) {
    sound();
  }

  // Blink the screen to indicate input activity
  calcScreen.classList.add('blink');

  const targetValue = target.value;

  const isOperator = isNaN(parseFloat(targetValue));

  if (isOperator) {
    if (targetValue !== op) {
      op = targetValue;
    } else {
      return; // Ignore repeated operator
    }
  } else {
    op = null;

    if (targetValue === '.' && n1.includes('.')) return;

    if (n1[0] === '0' && n1[1] !== '.') {
      n1.length = 0;
    }

    n1.push(targetValue);
  }

  // Handle backspace (⌫)
  if (op === '⌫') {
    n1.pop(); // Remove last digit
    if (!n1.length || (n1.length === 1 && n1[0] === '')) {
      n1 = ['0']; // Default back to zero if empty
    }
    op = null;
  }

  // Ensure input is never fully empty; default to 0
  if (n1.length === 0) n1 = ['0'];

  // Handle decimal point (,) input, only if not already present
  if (op === ',' && !n1.includes('.')) {
    n1.push('.');
  }

  // Convert current number array into a string result
  result = n1.join('');

  // Handle operator actions (÷, ×, +, -, =) and perform calculation
  if (op === '÷' || op === '×' || op === '+' || op === '-' || op === '=') {
    // If a previous number (n2) and operator exist, calculate result
    if (n2 !== null && last !== null) {
      result = cal(Number(n2), Number(result), calc[last]);
    }

    last = res(op);  // Store current operator for next calculation

    // If input is not just zero, update n2 with the result
    if (!(n1.length === 1 && n1[0] === '0')) {
      n2 = result;
    }

    n1.length = 0; // Clear input for next number
  }

  // Handle clear (C): reset all calculator state
  if (op === 'C') {
    op = last = null;
    result = n2 = n1.length = 0;
  }

  // Truncate result to max 10 characters
  if (result.toString().length > 10) result = result.toString(10).substring(0, 10);

  // Display the result in the screen, or show 'ERROR' if invalid
  calcScreen.value = isFinite(result) ? result : 'ERROR';
}


  calculator.addEventListener('mousedown', e => btn(e));

  let screenTimeout;
  calculator.addEventListener('mouseup', () => {
    if (screenTimeout) w.clearTimeout(screenTimeout);
    screenTimeout = w.setTimeout(() => {
      calcScreen.classList.remove('blink');
    }, 7);
  });


  // ////////////////////////////

  // make refresh after midnight 00:00

  function timeUntilMidnight() {
    const now = new Date();
    const nextMidnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1, // next day
      0,
      0,
      0,
      0 // at 00:00:00
    );
    return nextMidnight - now;
  }

  function scheduleMidnightRefresh() {
    const msUntilMidnight = timeUntilMidnight();
    w.setTimeout(function () {
      w.location.reload(); // Refresh the page
    }, msUntilMidnight);

    // Optional: Adjust the timeout every minute to stay accurate
    w.setTimeout(scheduleMidnightRefresh, 60000);
  }

  w.onload = function () {
    scheduleMidnightRefresh();
  };

  function doAfter19h(action) {
    const now = new Date();
    const currentHour = now.getHours();

    if (currentHour >= 19) {
      action(); // Execute the specified action if it's after 19:00
    } else {
      const timeUntil19h = new Date(now.setHours(19, 0, 0, 0)) - new Date();
      setTimeout(action, timeUntil19h); // Schedule the action for 19:00
    }
  }

  // Function to resize the element
  function resizeElementToFullSize() {
    // reset main style remove all styles
    main.removeAttribute('style');
    if (w.matchMedia('(max-width: 960px)').matches) return;
    // Get the full size of the viewport and document
    const fullHeight = Math.max(w.innerHeight, root.scrollHeight);
    // Set the element's height
    main.style.height = `${fullHeight+48}px`;
  }

  if ('serviceWorker' in navigator) {
    try {
      navigator.serviceWorker
        .register('/project-kitten/sw.js?v=7')
        .then(registration => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(error => {
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

  console.log('%c🐾Welcome to the Cuddle Zone of Coding!🐾\n%cKeep your coding paws steady and have fun!', 'font-size: 20px; background-color: #f7f7f7; color: #000000; padding: 0 4px; border-radius: 5px;', 'font-size: 16px; background-color: #e0e6ed; color: #000000; padding: 0 4px; border-radius: 5px;');

  textarea.addEventListener('wheel', function(e) {
    e.target.scrollTop += Math.sign(e.deltaY) * 24;
  },{passive: true});

  d.addEventListener('DOMContentLoaded', init /*, { once: true }*/);
  w.addEventListener('keyup', classToggle);
  w.addEventListener('focus', () => monitorOnlineStatus(updateOnlineStatusUI));
  let resizeTimeout;
  w.addEventListener('resize', function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const widthMatch = w.matchMedia('(min-width: 960px)').matches;

      if (widthMatch) {
        const styles = StorageNamespace.getItem('element-styles') || blockDefaults;
        const getStyle = styles.split(',');
        for (let i = 0; i < movableLength; i++) {
          if (widthMatch) {
            movable[i].style = getStyle[i];
            movable[i].style.position = 'absolute';
          }
        }
      } else {
        movable.forEach(e => e.removeAttribute('style'));
      }
      resizeElementToFullSize();
    }, 200);
  });
})(window, document);
