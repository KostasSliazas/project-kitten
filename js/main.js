/**
 * Main off "moving blocks" script created by K.S.
 * @date 07/07/2023 - 07:07:07 AM
 */
/*jshint esversion: 11 */
(function (w, d) {
  "use strict";
  // create new sound for timers with base64 encoding
  const SNDFIN = new w.Audio(
    'data:audio/mp3;base64,SUQzBABAAAAAIAAAAAwBIAUGXHIhTFRYWFgAAAAKAAAAU29mdHdhcmUA/+NIZAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAAMAAAMYAATExMTExMTE0BAQEBAQEBATExMTExMTExgYGBgYGBgYGBzc3Nzc3Nzc4aGhoaGhoaGk5OTk5OTk5OTpqampqampqa5ubm5ubm5ueDg4ODg4ODg4Pn5+fn5+fn5//////////8AAAA5TEFNRTMuMTAwAicAAAAAAAAAABQYJARFLgAAGAAADGChy0ixAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+M4ZAAKhhNbLKCcAI8YAuMZQBAAC1rM0JBjxj4E8fkMYxvwLGPAMY37QAAAD//M//PP8wwz////qeeYYYY08+egiAsAYAwBgkEHqe7//////9/9v///9///Y8///3zx8biWTQbjcmeHs0TEzdU9E4lwfeXPv8H5cHwfwQ4DB8H35QEAQ+7EHlwQBAEPicEAQBAEP5cH+CDn//B9AgBD//////yhxVecu6nZvLu6pkRdJWXpUGgJ5hpoGAoWu2DxH+CCYILUUDHEyE+TOCUN43q0HPfhJ4tz/+N4RDIdnbdjjMzgADlS0r8ZmcABUUyajcgVnSuhlVQGQX2YP9HaJprTHUXa9U07Kk2HKBQM8DioCmZP1YWa0d9naex3LTl3Xeg1Q5oMOSiBarNIEbRgFVyQMF4FBkrmxoqo8sqdNMiGn+qNelVaeo8Ihe3jh3V3ueErnWWO0DWymRU2X7pr0RrJvg7Tr3P/88O282Mh1JD+vqzdLcpsu2bGsvyw3es61vKly7vd/mt///rX8/HeH5b5+8ua3vuXebv5Y9///meH/zerpdX60vVRkM71FQ8tLggOBsgHA1Q0K+RgbmQGOkpHEBxlGlm0A9OuyhXuHLxZAMQjPO87R23hm4yRsmmYt7KY6weibozBt1fSNgLWWmt0l7vROJFz0jsKOApDJ7kipIckM5G612BIHp95sjjcONVXrSSt15BRSfOZqZQFDMOvCxOidvKUQ/JYEgiCGuTsdws3LE8+M5l21QwDDL9AP7EZqXU3/Obstda6QIY7b738ZXSRmdhodfZn+6xs1dZVt446yy3jSWc///zxwz1/aX8/536vlbgwUCkgoFJBQKN77xUohTj//HmVFYUql3u3+zNwYeIJhOlo4bMUz0cmgaEtZJ9eTL58SKL3qSo8gltT99Jo26I7q0jNKF31OQ06rJQ+flRIMZndD0X//6u3/+MoREILQQl5LOMoARZqDvJZyTgC/WknA6wC44XEJ1mj+zY9zRZ5P/////3olu1v+zEw8xgzqIJtUt8+/s0hOSWtqZi2ECHZ1J9sxSyPvsrEsruOR48SOmqw8ed3o7LNlZxQwopU2ebbmsb//65n/8dBJ/L3f/iIgtgqG0SQ9MNyH////yt1mvu/+qEo6gli/+M4RAkLKQlvLCUKZxZSEup4SZQ6hPCcnFvcZV/JFlEBckUWl0yWmiFkiIiZATCp+zVyr4hmJknv/ZmaDvi5qO1JExrD+VU0Bm3////7WO/654ehr/JO/yU23VIA0G53/////3Iu2vaIdmJhyopjqZGAwWIYR/bUpmzit71QkwoggZQ4UbeHWy5Mzf9nG0uDfLUdpL+mpr0dYsE9Escaq0qrJ//u1VX/9zA3dvJNf/8AsQhc44FyUqz/////PIVOSS22gODljWhVgO4bdVueZxtbzE6XQ6sm/+M4RBkLaQlfLBlPaRZMEscYGWCZ5JJa0VWK6toY69n1Zed2TQjCoIcfI+ceAXGhMc1HPO///N6/9N0vS2ItzRHCyh+2pz9//ROtHCoJCIcfmf////96DiJmZvKpDcf/QphxCFq9XcML4bUSEeiuPwCFuKvfMql3yKhcqU7lV2oRRI6IgowwPEfQyf//rv19KtKcBBBWTd6vXrr1//b/a36lII77f9f/////////5dzKUltu0iDowDQtgFGgNY9l5KIx1sJgpWGoUisRC23PdCOjoKp9pTDf/+M4RCcKegljLhWilZWkDuJ8OAXD/o99BaY4UkF///9Xb+9aFEJMMj/3p////X/KU5SmMxDXP////////r//1GWabbeHh3YuGAaVKC4SzCDEjjVYd1nLbcaklOc4RBJCcaGEhQTQvn7dDjHRyJh+a/1e9DzDx841T1FJjfp//73T/1oFgSZP+tFS///Tzf9+6df9v///QCbqDklsupDsgAH4urLurqlysyrshIuQiiQGiBnUxq/+iel2R0DXJ1ARNIqylKoiAnWf///+31KrRqOh0HK0y+rJ/+MoZD8K2QdfLxRtgRT63sZeUAWCf+w/4lBFTyv/9ZCO+jSOUeYJQbVErg6hSS23bIDWAAeioN2R0+clfyp5MhjOpYlnOhrUf/827nMdeRO9DlZ0KHkLHmIoDp9////Q5Gb86+ggQO7/pRPuYGxBT3A10FtSk9gExmVoSz89WAj1BbgkkpDsgAHk5+hmbMpg/+M4ZA8KjQlVLwVtkRVSEsJeEFQ+2RBCH8ISyJzfXzvrv4n4QOa6HFIEw6lXO44///qWvupVVjrKBxE0lvcHngoed//iqgbd5X/lXMgXjSJEadeKTwlWGmxRycttu2Qu2AA+YUf73MJDKGmHzii8ffl2KEikYdZzWTI3aaRDEL4VjUT///3f/6UcEmfwVLCIxd1eSb0ILhP/1r6luvLoCoaMxGwiVGzQnEYVERISnVIAwBpQAPwAHcl///5///////7dYxq3///9ls6RkyJ4olgnjdAiJMES/+M4ZCgK9gk8L6DAAJaCLnBdQqAASATC5iKDQdFB/q7///+v1U0Vom06ePpb/Xf////S+3S93simy9FVJKp0VomsmUsoBACPAH8KGDDhNEM0syer/1Qj///////1dEY1af//9dJFlpJTIxRIYXiaKRcSHUOwbIBCQDhFxYhPhaOEVPTcaJ2I//8ERZK///z1R4XY1VC1pEQMucAg8HSVAAATky8TpOuJMwaJvRTtYUqOxHMcculGbTAzu8QGVtu8Z4cOBZqaqKjv3ssZ61ZtfnKautYfveF7/+NoZDkbHeEiDMfoADg7kkARmOABe6a3jrvbusabGr++4bvVL8ANSy7j3tJfrNGhXN85rWemfZd1zefZAzF3G/GgBiwIQzBZMRB43OQ3aeNrb5IZPCUAoUvJacMRau6L3uMu1GRFI54BFuD5NFZLSXod/Ddzv6r8sx7PCP/vlBr9fz4IsZ2b/e65ze+6pbuWO/3z8csfyuX+42u2s8MrF789/Z+au3q9LYxyz72xzPveaxxsZgAMSdugyRiUj6oPAUnqwxBzWoXAEnhF+lk0JjP0V2V2K+47cl3zsv+1d1STNmM4YyvuotSXqme8K+Wd7OrSZ1dXu73jbw5hy32/d23RV3dZZY1tdUcg/e9azs2NMay3T/PzFh4blxiIsFhYKmFzsc3a4BA6oa7iV66qSrxwAiIDA0NmqXANBNUTyxWEQ3DEdT8MAAgrCxyQojQkXwuF3pZllS54a/m+XL+Ud5hQ9/6HP//mLhz/5VPvV79uphLLtNhr+9/v5d//5+Wd7mOX9t9/Xfw59XO3fp8r1jadJAmPWUEAAQIBVESFYF3T41IjTv8JoLQ6Sr/qIso2/+NIZBoP8ZkWXMVQAB+TNkAJhZgCR//WxeuTKZFf//MDws4ehlifJYcknCDdf//ikhhgGBTcWgDDoACA4aCAKOFAh6Qs/rYySdSTo//i5h0kUJ0coiZAiPIiTJoXikVlsrX///5MmJOlJi8dSLpgXTJMvHTxic2NUxqgEAxxAO/4rT/iQiz/5kfMTEnTL/9AvFFyZKBdJr//ybIEWScICTBJDlEHGZ///xXRYRCYMhAKCAdsDT4D2QAzosQNgIeh7kyYstFkv/xBUTcLLEJh9jsFmkwO4corkFIaRFTorq///8hxwgxGpkVKBqTRNl4olwmTAtk0b/apTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYZCcAAAGkAOAAAAAAA0gBwAAAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV');
  const getLocalStorageItems = (item) => {
    try {
      return JSON.parse(localStorage.getItem(item));
    } catch (error) {
      console.error("Error parsing JSON:", error.message);
      return null; // or any other default value
    }
  };
  const setLocalStorageItems = (item, value) => localStorage.setItem(item, JSON.stringify(value));
  const pindiscard = d.getElementById('pindiscard');
  const pinsave = d.getElementById('pinsave');
  const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;
  const position = d.getElementById('position');
  const clicked = d.getElementById('clicked');
  const movable = Array.from(d.getElementsByClassName("movable"));
  const movableLength = movable.length;
  const roundToTen = num => Math.ceil(num / 10) * 10;
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
  const addLeadingZero = (time) => time.toString().length < 2 ? "0" + time : time;
  const hide = elem => elem.classList.add('hide');
  const show = (elem, type) => elem.classList.remove('hide');
  const main = d.getElementById('main');
  const online = navigator.onLine;
  const getPE = elem => elem.parentElement;
  const root = d.documentElement;
  const typed = [];
  const codeDiv = d.querySelector(".wrp-container");
  const defaultPin = d.querySelector("#code");
  const shutup = d.querySelector("#shutup");
  const codeDivElms = Array.from(codeDiv.children[0].children);
  const textArea = d.getElementsByTagName("TEXTAREA")[0];
  const bg = d.querySelector("#bg-file");
  const styles = ["width", "height", "left", "top"];
  const blockDefaults = "width:90px;height:40px;left:310px;top:40px;,width:110px;height:40px;left:310px;top:0px;,width:110px;height:60px;left:310px;top:80px;,width:60px;height:60px;left:420px;top:80px;,width:160px;height:540px;left:640px;top:0px;,width:160px;height:200px;left:0px;top:180px;,width:160px;height:420px;left:480px;top:40px;,width:160px;height:160px;left:0px;top:0px;,width:150px;height:240px;left:160px;top:0px;,width:160px;height:80px;left:480px;top:460px;,width:170px;height:400px;left:310px;top:140px;,width:110px;height:40px;left:530px;top:0px;,width:110px;height:40px;left:420px;top:0px;,width:80px;height:40px;left:400px;top:40px;,width:160px;height:20px;left:0px;top:160px;,width:150px;height:300px;left:160px;top:240px;,width:160px;height:80px;left:0px;top:380px;,width:160px;height:80px;left:0px;top:460px;";
  const textAreaDefaults = "Good day. You have the ability to reposition these blocks by selecting and holding the left corner or by pressing the ` key on your keyboard. Alternatively, double-click to minimize them. Additionally, you can customize the theme, colors, and background image. If locked, to unlock, simply triple-click on the background and then click 520 (default PIN) or clear localStorage (because by using this project you will write to it data, like password and other settings)";
  const counts = {allMouseClicks:0,clicks:0};
  let isLocked = getLocalStorageItems('isLocked');
  let saved = getLocalStorageItems('mustashed') || [5, 2, 0];
  let minimized = [14];
  let mousedown = false;
  let scalingTarget = null;
  let isEnterPass = false;
  // boolean value for test is moving or not
  let moving = false;
  // target global element variable
  let target = null;
  // add all movable class eventlistener mousedown
  textArea.addEventListener("input", async (e) => {
    await delay(3000);
    setLocalStorageItems("textArea", e.target.value.trim());
  });

  // https://stackoverflow.com/questions/45071353/copy-text-string-on-click/53977796#53977796
  const copy = d.getElementById('clipboard');
  const copyToClipboard = str => {
    if (str === '0') return (copy.textContent = '');
    const el = d.createElement('textarea'); // Create a <textarea> element
    el.value = str; // Set its value to the string that you want copied
    el.setAttribute('readonly', ''); // Make it readonly to be tamper-proof
    el.style.position = 'absolute';
    el.style.left = '-9999px'; // Move outside the screen to make it invisible
    d.body.appendChild(el); // Append the <textarea> element to the HTML document
    const selected =
      d.getSelection().rangeCount > 0 ? d.getSelection().getRangeAt(0) : false; // Check if there is any content selected previously
    // Store selection if found
    // Mark as false to know no selection existed before
    el.select(); // Select the <textarea> content
    d.execCommand('copy'); // Copy - only works as a result of a user action (e.g. click events)
    copy.textContent = str;
    d.body.removeChild(el); // Remove the <textarea> element
    if (selected) { // If a selection existed before copying
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
  const aGetElms = Array.from(d.getElementsByTagName("a"));
  const aLength = aGetElms.length;
  for (let i = 0; i < aLength; i++) aGetElms[i].onclick = (e) => aClickHandler.buttonClicker(e);

  // create input timeout click handlers
  // const inputClickHandler = new ClickHandler(200);
  // const inputGetElms = Array.from(d.getElementsByTagName("input"));
  // const inputLength = inputGetElms.length;
  // for(let i = 0; i < inputLength; i++ ) inputGetElms[i].onclick = (e)=>inputClickHandler.buttonClicker(e)

  function getStyles() {
    let styleValues = [];
    for (let i = 0; i < movableLength; i++) {
      styles.forEach((value) => styleValues.push(`${value}:${movable[i].style[value]};`));
      styleValues.push(',');
    }
    return styleValues.join('');
  }

  function getOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
      left: rect.left + w.scrollX,
      top: rect.top + w.scrollY,
    };
  }


  const loopElem = async () => {
    // console.time()
    // movable.forEach(async (e) => {
    // using for loops for performance
    for (let i = 0; i < movableLength; i++) {
      const e = movable[i];
      await delay(30);
      e.style.left = roundToTen(getOffset(e).left) + "px";
      e.style.top = roundToTen(getOffset(e).top) + "px";
      e.style.position = "absolute";
      await delay(30);
      e.style.width = roundToTen(e.offsetWidth) + "px";
      e.style.height = roundToTen(e.offsetHeight) + "px";
      e.firstElementChild.title += ' (block index' + movable.indexOf(e) + ')';
      if (e.id === 'text-area') textArea.style.height = e.style.height;
      e.addEventListener("dblclick", async e => {
        if (e.target.classList.contains("movable")) {
          const index = movable.indexOf(e.target);
          let arrayOfMinimized = getLocalStorageItems("elementClass") || minimized;
          if (e.target.classList.contains("minimized")) {
            arrayOfMinimized = arrayOfMinimized.filter(c => c !== index);
            await e.target.classList.remove("minimized");
            await delay(9);
            e.target.style.width = "auto";
            e.target.style.height = "auto";
            let height = roundToTen(e.target.offsetHeight);
            let width = roundToTen(e.target.offsetWidth);
            if (e.target.id === 'text-area') height -= 20;
            await delay(9);
            e.target.style.width = width + "px";
            e.target.style.height = height + "px";

          } else if (e.target.classList.contains("movable")) {
            e.target.classList.add("minimized");
            arrayOfMinimized.push(index);
          }

          setLocalStorageItems('elementStyles', getStyles());
          setLocalStorageItems("elementClass", arrayOfMinimized);
        }
      });

      e.addEventListener("mousedown", async function (e) {
        if (e.target === this) {
          moving = true;
        }

        if (target !== null) {
          target.style.zIndex = 1;
        }

        target = this;
        target.style.zIndex = 2;
        await delay(200);
        if (moving) {
          target.classList.add("mousedown");
        }
      });
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
      const {
        h,
        m,
        // s
      } = this.getCurrentTime();
      this.clockElement.textContent = [h, m /*, s*/ ].join(':');
    }
    startTime() {
      this.updateClock();

      const gogo = setTimeout(function () {
        clearTimeout(gogo);
        this.startTime();
      }.bind(this), 6000); // when seconds update change 1000
    }
  }

  function showWeekDay() {
    const weekday = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const d = new Date();
    return weekday[d.getDay()];
  }

  function showDate() {
    let d = new Date();
    let formatter = Intl.DateTimeFormat("lt-LT", // a locale name; "default" chooses automatically
      {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      }
    );

    return formatter.format(d).slice(0, 10);
  }
  // api current list temperatures
  //const api_url_current = "https://api.open-meteo.com/v1/forecast?latitude=55.7068&longitude=21.1391&current=temperature_2m";
  // api url list temperatures
  const api_url = "https://api.open-meteo.com/v1/forecast?latitude=55.7068&longitude=21.1391&hourly=temperature_2m";
  // Defining async function
  async function getAll(url) {
    // Storing response
    const response = await fetch(url);
    // Storing data in form of JSON
    const data = await response.json();
    // no data? return
    if (!response || !data) return false;
    // set data to storage
    return setLocalStorageItems("statsData", data.hourly.temperature_2m);
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
    const stats = d.querySelector("#stats");

    // Create a new Date object
    const now = new Date();
    // Get the current hour between 0 and 23, representing the hours in a day
    const currentHour = now.getHours();

    const main = d.querySelector(".svg-holder");
    // make length shorter
    data.length = 34;
    const arrayConverted = reduceValuesDynamically(data.map(e => e.toFixed(2) * 10), 16);
    const svg = d.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("version", "1.1");
    svg.setAttribute("viewBox", "0 0 100 32");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("id", "sunshine");
    let space = 2;
    for (let i = 0; i < arrayConverted.length; i++) {
      const result = arrayConverted[i] > 0 ? 16 - arrayConverted[i] : 16 - arrayConverted[i];
      const fixed = result.toFixed(2);
      const path = d.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", "M" + space + ',' + fixed + " V 16");
      path.setAttribute("stroke-width", "2");
      path.setAttribute("data-value", data[i]);
      // add hour numbers
      if (i < 24) path.setAttribute("data-hour", i);
      // set other color of selected hour
      if (currentHour === i) path.setAttribute("style", "stroke:var(--color4)");
      //show 24hrs only solid color other transparent
      if (i > 23) path.setAttribute("class", 'tr');
      svg.appendChild(path);
      space += 3;
    }
    main.appendChild(svg);


    const output = data[currentHour] + "°C";

    main.addEventListener("mouseover", function (e) {
      // Extracting the target element from the event object
      const targetElement = e.target;

      // Checking if the target element is a 'path'
      if (targetElement.tagName === "path") {
        // Retrieving temperature and hour data attributes from the target element
        const temperature = targetElement.getAttribute("data-value") + "°C";
        const hour = targetElement.getAttribute("data-hour");

        // Setting the text content of the 'stats' element with temperature
        let statsText = temperature;

        // If hour data is available, formatting it with leading zero and appending it to statsText
        if (hour !== null) {
          const hourText = '|' + addLeadingZero(parseInt(hour)) + 'h';
          statsText += hourText;
        }

        // Setting the text content of the 'stats' element
        stats.innerText = statsText;
      }
    });
    main.addEventListener("mouseout", () => (stats.innerText = output));
    stats.innerText = output;
  }


  function applyStyles() {
    const styles = getLocalStorageItems("elementStyles") || blockDefaults;
    const mini = getLocalStorageItems("elementClass") || minimized;
    const getStyle = styles.split(",");
    for (let i = 0; i < movableLength; i++) {
      movable[i].style = getStyle[i];
      movable[i].style.position = "absolute";
      if (mini.includes(movable.indexOf(movable[i]))) {
        movable[i].classList.add("minimized");
      } else {
        movable[i].classList.remove("minimized");
      }
    }
  }


  function setTimeStamp(interval) {
    // Check if localStorage is available
    if (typeof localStorage === 'undefined') {
      console.error("localStorage is not available.");
      return false;
    }

    // Get current date in seconds
    const currentDate = Math.floor(new Date().getTime() / 1000);

    // Retrieve previous timestamp from localStorage
    const previousTimeStamp = parseInt(localStorage.getItem("timeStamp"));

    // If timestamp exists and interval has not passed, return false
    if (!isNaN(previousTimeStamp) && (currentDate - previousTimeStamp) < interval) {
      return false;
    }

    // Set new timestamp in localStorage
    localStorage.setItem("timeStamp", currentDate.toString());

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
  const longNames = ['inner peace', 'peace on earth', 'cool dudes', 'sunshine', 'someday', 'everything fine', 'night'];
  const classNameVariables = [0, "a", "b", "c", "d", "e", "f"];
  const THEME_CHANGE = arrayHelper.call(classNameVariables);

  // change main theme
  const changerClass = index => {
    themeName.textContent = longNames[index];
    if (index) root.className = classNameVariables[index];
    else root.removeAttribute("class");
    if (d.getElementById('enabled-bg').checked === true) {
      root.classList.add('bg-image');
    } else {
      root.classList.remove('bg-image');
    }
  };

  // move all blocks at once
  const loops = async (pos, val) => {
    // console.time()
    const selected = Array.from(d.getElementsByName("move")).filter(e => e.checked)[0].value;
    for (let i = 0; i < movableLength; i++) {
      const e = movable[i];
      if (e.id !== "moves") e.style[pos] = parseInt(e.style[pos]) + val * selected + "px";
      // movable.forEach(e => e.id !== "moves" && (e.style[pos] = parseInt(e.style[pos]) + val * selected + "px"));
    }
    // console.timeEnd();
    await delay(300);
    setLocalStorageItems('elementStyles', getStyles());
  };


  const moves = d.getElementById("moves");
  // toggle classList hide
  function classToggle(e) {
    if (e.isComposing || e.key === 'Unidentified') return;

    // event key or target id
    const keyCode = e.key || String.fromCharCode(e.keyCode);

    // check if it's [`] symbol and inputs not focused then toggle class
    if (keyCode === '`' && !d.querySelector("input:focus")) {
      moves.classList.toggle("hide");
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  }
  let handleMousemove = (event) => {
    position.textContent = (`${event.x}:${event.y}`);
  };
  const lockerMouseMovments = debounce(handleMousemove, 200);

  const isDisplayed = (elem) => {
    const style = w.getComputedStyle(elem);
    const isDisplay = style.getPropertyValue("display") !== 'none' ? true : false;
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
    }
  };

  // Seal the counter object
  Object.seal(counter);

  // Function to save all input values to localStorage
  const saveAllInputs = () => {
    const values = Array.from(counters, counter => getElem(counter).value);
    localStorage.setItem('K-InputValues', values.join(','));
  };

  // Flag to prevent multiple saves during a short time
  let isSaving = false;

  // Function to set items and trigger saving
  async function setItems(element) {
    if (isSaving) return;
    isSaving = true;
    element.classList.add('saved');
    await delay(500);
    await saveAllInputs();
    element.classList.remove('saved');
    isSaving = false;
  }

  // Function to highlight an element temporarily
  const hightLight = async (element) => {
    element.classList.add('max');
    await delay(200);
    element.classList.remove('max');
  };

  // Function to handle button click and adjust counter
  const increase = e => {
    const {
      target
    } = e;
    if (target.tagName !== 'BUTTON') return;

    const {
      currentTarget
    } = e;
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
    const {
      target
    } = e;
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
  const values = localStorage.getItem('K-InputValues') && localStorage.getItem('K-InputValues').split(',').map((Number) => addLeadingZero(Number));
  // console.time()

  // Initialize counters with values and event listeners
  // counters.forEach((counter, i) => {
  const countersLength = counters.length;
  for (let i = 0; i < countersLength; i++) {
    const counter = counters[i];
    const inputElement = getElem(counter);
    inputElement.value = values && values[i] || inputElement.value || inputElement.min || 1;
    counter.addEventListener('click', increase);
    inputElement.addEventListener('change', inputChange);
  }
  // });
  // console.timeEnd()

  function Repeater(time, stopCase, callback) {
    this.timesRepeated = 0;
    this.timeOut = 0;
    this.stop = () => clearTimeout(this.timeOut);
    // create inner function with arrow to not loose context of this
    const inner = () => {

      this.timeOut = setTimeout(function () {
        clearTimeout(this.timeOut);
        this.timeOut = 0;
        this.timesRepeated++;
        //if not number and true || less than stop case repeat else not
        if ((isNaN(stopCase) && stopCase) || this.timesRepeated < stopCase) inner();
        else clearTimeout(this.timeOut);
        callback();
      }.bind(this), time || 1000); // if no time defaul 1000ms (1s)
      return this;
    };
    inner(); // load inner function
  }


  function playSound() {
    SNDFIN.play();
  }


  function Counter() {
    let sec = 0,
      isCounting = false,
      timeout = 0; // timoeut timer;

    this.counterTime = d.getElementById('counter-time'); // get the output div
    this.seconds = d.getElementById('seconds');
    this.minutes = d.getElementById('minutes');
    this.hours = d.getElementById('hours');

    // calculate to seconds all inputs
    this.totalSeconds = function () {
      return Number(this.seconds.value) + Number(this.minutes.value) * 60 + Number(this.hours.value) * 60 * 60;
    };

    this.start = function () {
      // clear timeout everytime so it not dublicates (speed)
      clearTimeout(timeout);
      if (!isCounting) {
        isCounting = true;
        sec = this.totalSeconds(); // set seconds at start
      }

      // set timeout to variable for clearing later
      timeout = setTimeout(function () {
        // changing (swaping) lines can show negative values, should stay as it is
        if (sec === 0) {
          this.stop();

          if (d.getElementById('sounds-ding').checked) {
            const rep1 = new Repeater(700, 50, playSound);
            const rep2 = new Repeater(1000, 100, playSound);
            show(shutup.parentElement);
            shutup.onclick = (e) => {
              rep1.stop();
              rep2.stop();
              hide(e.target.parentElement);
              this.counterTime.textContent = addLeadingZero(this.totalSeconds()); // set seconds at start
              return;
            };
          }

          // stop and return text DONE
          this.stop();
          this.counterTime.textContent = 'DONE!'; // mission is done
          return;
        }

        // start if more than zerro
        if (sec > 0) {
          // ignition
          this.start();
          // change text content affter click
          this.counterTime.textContent = addLeadingZero(sec);
          // only -1 second when seconds are more then 0
          --sec;

        }

      }.bind(this), 1000);

    };

    this.stop = function () {
      clearTimeout(timeout);
      isCounting = false;
      timeout = 0; // timoeut timer
      this.counterTime.textContent = addLeadingZero(this.totalSeconds()); // set seconds at start
      // this.counterTime.textContent = '00';
    };

    this.reset = function () {
      // stop first timers
      this.stop();
      this.counterTime.textContent = this.seconds.value = this.minutes.value = this.hours.value = '00';
    };

    Object.defineProperty(this, 'sec', {
      get: function () {
        return sec;
      },
      set: function (value) {
        sec = value;
      }
    });

    Object.defineProperty(this, 'isCounting', {
      get: function () {
        return isCounting;
      },
    });

  }

  // set Counter global variable
  const timers = new Counter();

  async function init() {
    // set background lines by default (DEFAULTS)
    if (!localStorage.length) {
      setLocalStorageItems('theme-lines', true);
    }

    // set remembered last counter seconds
    timers.counterTime.textContent = addLeadingZero(timers.totalSeconds());

    defaultPin.title = saved;
    d.getElementById('is-online').textContent = online ? 'connected' : 'disconnected';
    d.getElementById('day-of-week').textContent = showWeekDay();
    const documentTitle = d.title;
    textArea.value = getLocalStorageItems("textArea") || textAreaDefaults;

    await hide(codeDiv);
    await applyStyles();
    await loopElem();

    // codeDivElms.forEach(e => {
    const codeDivElmsLength = codeDivElms.length;
    for (let i = 0; i < codeDivElmsLength; i++) {

      codeDivElms[i].onclick = (e) => {
        e.stopPropagation(); //prevent from parent clicks
        typed.push(codeDivElms.indexOf(e.target));
        if (isEnterPass === false && typed.length === saved.length && typed.every((v, i) => v === saved[i])) {
          setLocalStorageItems('isLocked', (isLocked = false));

          d.title = documentTitle;
          hide(codeDiv);
          show(main);
          d.removeEventListener('mousemove', lockerMouseMovments);
        }
      };
    }
    // });

    const NUM = parseInt(getLocalStorageItems("theme")) || 0;
    THEME_CHANGE.value = NUM;
    changerClass(NUM);
    styleRoot();
    setColors();

    d.getElementById("today").innerHTML = showDate();

    // renew clock if only displayed
    if (isDisplayed(d.getElementById("clock").parentElement)) {
      const clock = new Clock("clock");
      clock.startTime();
    }

    d.body.style.visibility = 'visible';


    // remove lines if set to false in local storage by default show them
    const isCheckedLines = getLocalStorageItems("theme-lines");
    const bgToggle = d.getElementById('bg-toggle');

    if (isCheckedLines) {
      bgToggle.checked = true;
      main.classList.add('lines');
    } else {
      bgToggle.checked = false;
      main.classList.remove('lines');
    }

    // remove default bg by default true
    const isCheckedBg = getLocalStorageItems("theme-bg");
    const enabledBg = d.getElementById('enabled-bg');
    
    if (isCheckedBg) {
      enabledBg.checked = true;
      root.classList.add('bg-image');
    } else {
      enabledBg.checked = false;
      root.classList.remove('bg-image');
    }

    // remove default repeating
    const isRepeatingBg = getLocalStorageItems("bg-repeat");
    const repeatToggle = d.getElementById('repeat-toggle');

    if (isRepeatingBg) {
      repeatToggle.checked = true;
      main.classList.add('bg-repeat');
    } else {
      repeatToggle.checked = false;
      main.classList.remove('bg-repeat');
    }

    if (isLocked) {
      d.title = 'New Tab';
      hide(main);
    } else {
      show(main);
    }
    // const tryOnce = new Repeater(700, 1, async ()=>{
    //   tryOnce.stop()
    //is time 43m passed and we are online?
    if (setTimeStamp(43) && online) {
      await getAll(api_url);
      await stats(getLocalStorageItems("statsData"));
      return false;
    }
    // })

  }

  function setColors() {
    const compStyles = w.getComputedStyle(root);
    const colors = d.querySelectorAll("#colors input[type=color]");
    const arrayColors = [];
    const colorsLength = colors.length;
    // colors.forEach(async (e, i) => {
    for (let i = 0; i < colorsLength; i++) {
      const e = colors[i];
      const compValue = compStyles.getPropertyValue("--color" + i);
      e.value = e.title = compValue;
      const label = getPE(e).getElementsByTagName('label')[0];
      label.innerText = compValue.toUpperCase();
      label.addEventListener('click', (event) => {
        event.preventDefault();
        copyToClipboard(compValue.toUpperCase());
      });

      e.addEventListener("input", (event) => {
        const label = getPE(event.target).getElementsByTagName('label')[0];
        label.innerText = event.target.value.toUpperCase();
        const index = Array.from(colors).indexOf(event.target);
        arrayColors[index] = `--color${index}:${event.target.value}`;
        setLocalStorageItems("custom-theme", arrayColors.filter(Boolean));
        styleRoot();
      });
      // });
    }
  }


  function styleRoot() {
    const styleItems = ["bg-theme", "custom-theme"];
    const arrayOfItems = styleItems.map((item) => getLocalStorageItems(item)).filter(Boolean).flat();
    d.documentElement.style.cssText = arrayOfItems.join(';');
  }


  function contextMenuFun(e) {
    e.preventDefault();

    if (e.target.tagName === "MAIN") {
      e.preventDefault();
      THEME_CHANGE.decrement(); // eslint-disable-line
      changerClass(THEME_CHANGE.value);
      //set local storage only when user click
      setLocalStorageItems("theme", THEME_CHANGE.value);
      setColors();
    }

    if ((e.target.textContent || e.target.value) && e.target.tagName !== 'BUTTON' && (e.target.getAttribute('type') && e.target.getAttribute('type').toUpperCase() !== 'BUTTON' && e.target.getAttribute('type').toUpperCase() !== 'SUBMIT' && e.target.getAttribute('type').toUpperCase() !== 'RESET') || e.target.tagName.toLowerCase() === 'textarea' || e.target.id === 'clipboard') {
      copyToClipboard(e.target.textContent || e.target.value);
    }

  }
  const classNamesForRotations = [0, 'r1', 'r2', 'r3'];
  const rotations = arrayHelper.call(classNamesForRotations);

  function rootClick(e) {
    const target = e.target.id;
    if (target === "gt") THEME_CHANGE.decrement();
    if (target === "lt") THEME_CHANGE.increment();

    if (target === "left") loops("left", -1);
    if (target === "right") loops("left", 1);
    if (target === "top") loops("top", -1);
    if (target === "bottom") loops("top", 1);

    if (target === "start") timers.start();
    if (target === "stop") timers.stop();
    if (target === "reset") timers.reset();

    if (e.target.tagName === "BUTTON" && e.target.parentElement.classList.contains('counter')) {
      if (timers.isCounting) {
        timers.stop();
        timers.start();
      }
      timers.counterTime.textContent = addLeadingZero(timers.totalSeconds());
    }


    if (target === "lt" || target === "gt") {
      changerClass(THEME_CHANGE.value);
      setLocalStorageItems("theme", THEME_CHANGE.value);
      setColors();
    }

    if (target === 'rotate90') {
      main.classList.remove('r' + rotations.value);
      rotations.increment();
      //remove class and return (defaul class)
      if (rotations.value === 0) return;
      main.classList.add(classNamesForRotations[rotations.value]);
    }
    if (target === 'controls-hide') moves.classList.add('hide');

    if (target === "custom-theme" || target === "bg-toggle" || target === "reset-all" || target === "bg-theme") {
      e.target.removeAttribute("style");
      localStorage.removeItem(target);
      styleRoot();
    }

    if (target === "reset-all") {
      localStorage.clear();
      root.removeAttribute("class");
      setColors();
      changerClass(0);
      applyStyles();
      textArea.removeAttribute('style');
    }
    // set att once theme lines class and item of localStorage
    if (target === "bg-toggle") {
      if (!main.classList.contains('lines') && e.target.checked) {
        setLocalStorageItems('theme-lines', true);
        main.classList.add('lines');
      } else {
        setLocalStorageItems('theme-lines', false);
        main.classList.remove('lines');
      }
    }

    if (target === 'enabled-bg') {
      const repeatBg = d.getElementById('repeat-toggle');
      if (!root.classList.contains('bg-image') && e.target.checked) {
        setLocalStorageItems('theme-bg', true);
        root.classList.add('bg-image');
      } else {
        repeatBg.checked = false;
        main.classList.remove('bg-repeat');
        setLocalStorageItems('bg-repeat', false);

        root.classList.remove('bg-image');
        setLocalStorageItems('theme-bg', false);
      }
    }
    if (target === 'repeat-toggle') {
      const bg = d.getElementById('enabled-bg');
      if (!main.classList.contains('bg-repeat') && e.target.checked) {
        bg.checked = true;
        setLocalStorageItems('bg-repeat', true);
        main.classList.add('bg-repeat');
        setLocalStorageItems('theme-bg', true);
        root.classList.add('bg-image');
      } else {
        // bg.checked = false
        main.classList.remove('bg-repeat');
        setLocalStorageItems('bg-repeat', false);
        // root.classList.remove('bg-image');
        // setLocalStorageItems('theme-bg', false);
      }
    }
    if (target === "custom-theme") setColors();
    if (target === "bg-theme") bg.value = "";

    // only for locking system
    if (target === "lock") {
      setLocalStorageItems('isLocked', (isLocked = true));
      hide(main);
      d.title = 'New Tab';
      counts.clicks = 0;
    }

    if (target === "code") {
      typed.length = 0;
      show(codeDiv);
      isEnterPass = true;
    }

    if (target === "pinsave" && typed.length) {
      setLocalStorageItems('mustashed', typed);
      isEnterPass = false;
      saved = getLocalStorageItems('mustashed');
      defaultPin.title = saved;
      hide(codeDiv);
    }
    if (target === "pindiscard") {
      hide(codeDiv);
    }
    const isLockedScreen = getLocalStorageItems('isLocked');
    // count clicked
    counts.clicks++;
    if (e.target.className !== "container" && counts.clicks > 2 && isLockedScreen) {
      counts.clicks = typed.length = 0; // RESET array length and count when not container clicked
      d.addEventListener('mousemove', lockerMouseMovments);
      show(codeDiv);
    } 

    // show statistics about mouse
    counts.allMouseClicks++;
    clicked.textContent = counts.allMouseClicks;

    if (isEnterPass) {
      show(pindiscard);
      show(pinsave);
    } else {
      hide(pinsave);
      hide(pindiscard);
    }
  }


  function dblclickFun(e) {
    if (e.target === copy) e.target.textContent = "";
    //if (e.target.tagName === "TEXTAREA") e.target.value = "";
  }


  function bgChange(e) {
    const inputValue = e.target.files[0];
    const reader = new FileReader();

    reader.addEventListener("load", async () => {
      const fileString = `--bg:url(${reader.result})`;
      await delay(200);
      setLocalStorageItems("bg-theme", fileString);
      styleRoot();
    }, false);

    if (inputValue) reader.readAsDataURL(inputValue);
  }


  const mouseMoves = (e) => {
    e.style.left = roundToTen(cursorPositions.x) + "px";
    e.style.top = roundToTen(cursorPositions.y) + "px";
  };

  const cursorPositions = {
    y: 0,
    x: 0
  };

  function mouseMoveEvents(z) {
    if (!moving || target === null || !target.classList.contains("movable")) return;
    cursorPositions.x = z.clientX - 10;
    cursorPositions.y = z.clientY - 10;
    // check if height exceeded of main when moving element
    if (main.offsetHeight < z.clientY + target.offsetHeight) {
      w.scrollTo(0, cursorPositions.y);
    }

    mouseMoves(target);
  }


  function mouseUpEvents(e) {
    moving = false;

    const eventTarget = e.target;
    // Make opacity (highlight).5 for links with class "movable" till next refresh(like visited)
    if (eventTarget.tagName === "A") eventTarget.style.opacity = ".5";
    // GLOBAL target!!!
    if (!target) return;
    const peTarget = getPE(target);
    const targetClass = peTarget ? peTarget.className : null;

    if (targetClass) {
      target.classList.remove("mousedown");
      setLocalStorageItems('elementStyles', getStyles());
    }

    try {
      if (scalingTarget && peTarget && scalingTarget.tagName === "TEXTAREA" && scalingTarget !== null) {
        const peScalingTarget = getPE(scalingTarget);
        scalingTarget.style.height = peScalingTarget.style.height = roundToTen(peScalingTarget.offsetHeight) + "px";
        peScalingTarget.style.width = roundToTen(peScalingTarget.offsetWidth) + "px";
        setLocalStorageItems('elementStyles', getStyles());
      }
    } catch (error) {
      console.log({
        error
      });
    }
  }

  async function mouseDownEvents(e) {
    cursorPositions.x = e.clientX;
    cursorPositions.y = e.clientY;
    scalingTarget = e.target;
    if (scalingTarget.tagName === "TEXTAREA") {
      mousedown = true;
      const computedStyles = w.getComputedStyle(scalingTarget);
      const height = await computedStyles.getPropertyValue('height');
      const width = await computedStyles.getPropertyValue('width');

      scalingTarget.style.width = roundToTen(parseInt(width)) + "px";
      scalingTarget.style.height = roundToTen(parseInt(height)) + "px";

      const parentElement = getPE(scalingTarget);
      parentElement.style.width = "auto";
      parentElement.style.height = "auto";
    }
  }

  function debounce(func, delay) {
    let timeoutId;

    return function () {
      const context = this;
      const args = arguments;

      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(context, args);
      }, delay);
    };
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


  // events listeners
  bg.addEventListener("change", bgChange);
  w.addEventListener("keyup", classToggle);
  d.addEventListener("dblclick", dblclickFun);
  d.addEventListener("mousemove", throttle(mouseMoveEvents, 70));
  d.addEventListener("mousedown", mouseDownEvents);
  d.addEventListener("mouseup", mouseUpEvents);
  d.addEventListener("DOMContentLoaded", init /*, { once: true }*/ );
  root.addEventListener("click", rootClick);
  root.addEventListener("contextmenu", contextMenuFun);

  const BEEP_AUDIO = new w.Audio("data:audio/mp3;base64,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");
  const CALC = d.getElementById("calculator");
  const CALC_SCREEN = d.getElementById("src");
  CALC_SCREEN.value = 0;
  let n1 = [];
  let n2 = 0;
  let op = null;
  let lastop = null;
  let result = 0;

  const sound = () => {
    BEEP_AUDIO.play();
    w.navigator.vibrate(30);
  };

  const add = (n, o) => n + o;
  const sub = (n, o) => n - o;
  const div = (n, o) => n / o;
  const mul = (n, o) => n * o;
  const res = (n) => n;

  const cals = {
    "/": div,
    "×": mul,
    "+": add,
    "-": sub,
    "=": res,
  };

  const cal = (num1, num2, calback) => {
    if (typeof calback === "function") {
      const n1 = num1.toString().split(".")[1];
      const n2 = num2.toString().split(".")[1];
      const len1 = (n1 && n1.length) || 0;
      const len2 = (n2 && n2.length) || 0;
      if (lastop !== "/") {
        return parseFloat(calback(Number(num1), Number(num2)).toFixed(len1 + len2));
      }
      return calback(Number(num1), Number(num2));
    }
  };

  const btn = (e) => {
    // e.preventDefault()
    // e.stopPropagation()
    // if don't mach input or screen or esaund return
    if (!e.target.matches("input") || e.target.id === "esound" || e.target.id === "src") {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    CALC_SCREEN.classList.add("blink");

    // if checked sound play that creapy sound
    if (d.getElementById("esound").checked) sound();

    // set operator when target is fun
    if (e.target.dataset.fun) op = e.target.value;

    // when number pressed push to array number
    if (e.target.dataset.num) {
      op = null;
      if (n1[0] === "0" && n1[1] !== ".") n1.length = 0;
      n1.push(e.target.value);
    }

    // operator delete last number
    if (op === "⌫") {
      n1 = result
        .toString(10)
        .substring(0, 14)
        .replace(/[^0-9]/g, ".")
        .split("");
      n1.pop();
      if (n1.join("").charAt(n1.join("").length - 1) === ".") n1.pop();
    }

    // if no number set 0
    if (!n1.length) n1 = ["0"];
    if (op === "," && !n1.includes(".")) n1.push(".");
    result = n1.join("");

    // operator is /*+-=
    if (op === "/" || op === "×" || op === "+" || op === "-" || op === "=") {
      if (n2 && lastop) {
        result = cal(Number(n2), Number(result), cals[lastop]);
      }
      lastop = res(op);
      if (n1[0] === '0' && n1.length === 1) return;
      n2 = result;
      n1.length = 0;
    }

    // operator clear all
    if (op === "C") {
      op = lastop = null;
      result = n2 = n1.length = 0;
    }

    // convert to string and change lenth 
    if (result.toString().length > 10) result = result.toString(10).substring(0, 14);

    CALC_SCREEN.value = isFinite(result) ? result : "ERROR";
    //e.stopImmediatePropagation()
  };

  CALC.addEventListener("mousedown", (e) => btn(e));
  CALC.addEventListener("mouseup", (e) => {
    const screenTimeout = setTimeout(() => {
      clearTimeout(screenTimeout);
      CALC_SCREEN.classList.remove("blink");
    }, 7);
  }); // blink screen number


  // ////////////////////////////

    // make refresh after midnigth 00:00

          function timeUntilMidnight() {
            const now = new Date();
            const nextMidnight = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() + 1, // next day
                0, 0, 0, 0 // at 00:00:00
            );
            return nextMidnight - now;
        }

        function scheduleMidnightRefresh() {
            const msUntilMidnight = timeUntilMidnight();
            setTimeout(function() {
                location.reload(); // Refresh the page
            }, msUntilMidnight);

            // Optional: Adjust the timeout every minute to stay accurate
            setTimeout(scheduleMidnightRefresh, 60000);
        }

        window.onload = function() {
            scheduleMidnightRefresh();
        };
})(window, document);
