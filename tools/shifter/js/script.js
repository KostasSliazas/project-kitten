/* jshint esversion: 6 */
(() => {
  'use strict';

  /*** ===========================
   *  CONSTANTS & SELECTORS
   *  =========================== */
  const main = document.querySelector('#main');
  const addButton = document.querySelector('#add');
  const cloneButton = document.querySelector('#clone');
  const exportToExcel = document.querySelector('#export');
  const inputNumber = document.querySelector('#number');
  const addTextButton = document.getElementById('add-text-to-selected');
  const breakCheckbox = document.getElementById('break');
  const textInput = document.querySelector('#text');
  const output = document.getElementById('output');
  const sumTableButton = document.getElementById('sum-table');

  // Today's date (used as default row label)
  const today = new Date();
  const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  // Variables used for counting
  const variableIDs = ['C1', 'C2', 'C3', 'C4', 'C5'];

  /*** ===========================
   *  UTILITY FUNCTIONS
   *  =========================== */
  const table = () => document.getElementById('table');
  const getValue = (selector) => document.querySelector(selector)?.value ?? '';
  const isEmpty = (id) => {
    const element = document.getElementById(id);
    return element && element.children.length === 0 && element.textContent.trim() === '';
  };
  const capitalize = (word) => word ? word.charAt(0).toUpperCase() + word.slice(1) : '';
  const createElement = (tag, content = '') => {
    const el = document.createElement(tag);
    el.innerHTML = content;
    return el;
  };

  const updateCloneButtonState = () => {
    const t = table();
    cloneButton.disabled = !(t && t.querySelectorAll('tr').length > 0);
  };

  // Safe delay helper (used by counters/highlight/save)
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  /*** ===========================
   *  GLOBAL RECALC (call everywhere)
   *  centralised: updates counts, sums and persists
   *  =========================== */
  const recalc = () => {
    countSelected();
    sumTableByVariables();
    saveTable();
    updateCloneButtonState();
  };

  /*** ===========================
   *  TEXT HANDLING (dblclick add text)
   *  =========================== */
  const addText = (e) => {
    e.preventDefault();
    const text = textInput.value;
    if (!text) return;

    const cell = e.currentTarget;

    // only select non-first cells
    if (cell.cellIndex !== 0 && !cell.classList.contains('selected')) {
      cell.classList.add('selected');
    }

    // Apply text (with optional break)
    applyTextToCell(cell, text, breakCheckbox.checked);

    // After both changes, update counts, sum, and save table
    recalc();
  };

  /*** ===========================
   *  STORAGE NAMESPACE
   *  =========================== */
  class StorageNamespace {
    constructor(namespace) {
      this.namespace = namespace;
    }

    setItem(key, value) {
      localStorage.setItem(`${this.namespace}:${key}`, JSON.stringify(value));
    }

    getItem(key, defaultValue = null) {
      const val = localStorage.getItem(`${this.namespace}:${key}`);
      return val !== null ? JSON.parse(val) : defaultValue;
    }

    removeItem(key) {
      localStorage.removeItem(`${this.namespace}:${key}`);
    }

    clear() {
      Object.keys(localStorage)
      .filter(k => k.startsWith(this.namespace + ':'))
      .forEach(k => localStorage.removeItem(k));
    }
  }
  const loopStorage = new StorageNamespace('table');

  const saveTable = () => {
    const t = table();
    if (!t) return;

    const data = Array.from(t.rows).map(row => {
      const cells = Array.from(row.cells);
      const dataCells = cells.slice(0, -4); // exclude last 4 control cells
      const rowData = dataCells.map(cell => ({
        html: cell.innerHTML,        // save HTML with <br>
        selected: cell.classList.contains('selected')
      }));

      // Add last 4 cells as plain text (controls)
      const controlCells = cells.slice(-4).map(cell => ({ html: cell.innerHTML }));
      return rowData.concat(controlCells);
    });

    loopStorage.setItem('tableData', data);
  };

  const addTextToSelected = () => {
    const selectedCells = main.querySelectorAll('.selected');
    if (!selectedCells.length) return;
    const text = textInput.value;
    const addBreak = breakCheckbox.checked;
    selectedCells.forEach((cell) => applyTextToCell(cell, text, addBreak));

    recalc();
  };

  /*** ===========================
   *  APPLY TEXT TO CELL (no auto-select for first cell)
   *  =========================== */
  const applyTextToCell = (cell, text, addBreak = false) => {
    if (!text) return;

    // Split input text into individual variables (space-separated)
    const variables = text.split(/\s+/).map(v => v.trim()).filter(Boolean);

    let cellContent = cell.innerHTML;

    // FIX: create plain-text version for duplicate check
    const plainText = cellContent.replace(/<br\s*\/?>/gi, " ");

    variables.forEach(variable => {
      const regex = new RegExp(`\\b${variable}\\b`, 'i'); // check if variable exists

      // use plainText instead of cellContent for duplicate detection
      if (!regex.test(plainText)) {

        // Add break if requested and not already added
        if (addBreak && !cell.dataset.breakAdded) {
          cellContent += (cellContent ? '<br>' : '') + variable;
          cell.dataset.breakAdded = 'true';
        } else {
          cellContent += (cellContent ? ' ' : '') + variable;
          cell.dataset.breakAdded = '';
        }
      }
    });

    cell.innerHTML = cellContent;

    // Ensure the cell is selected (but not the first cell)
    if (cell.cellIndex !== 0 && !cell.classList.contains('selected')) {
      cell.classList.add('selected');
    }

    // Update counts, totals, and save table
    recalc();
  };

  /*** ===========================
   *  TABLE CELL INTERACTIONS
   *  =========================== */
  const toggleClass = (e) => {
    e.preventDefault();
    const cell = e.currentTarget;
    // do not toggle first cell
    if (cell.cellIndex === 0) return;
    cell.classList.toggle('selected');
    recalc(); // updates variable totals immediately and saves
  };

  const removeElement = function () {
    const row = this.closest('tr'); // ensures we get the correct row
    if (!row) return;
    row.remove();

    inputNumber.disabled = !isEmpty('table'); // enable input if table is empty
    updateCloneButtonState();
    recalc();
  };

  let counter = 0;
  const filler = () => {
    const val = textInput.value;
    const firstNum = Number(val[0]);
    counter += firstNum;
    return counter % firstNum === 0 ? 1 : 0;
  };

  const getAllDivs = (btn) => {
    const [, ...listOfAll] = btn.parentElement.children;
    listOfAll.length -= 4;
    return listOfAll;
  };

  const nextElement = function () {
    const elements = getAllDivs(this);
    if (elements.length < 2) return;
    const lastText = elements[elements.length - 1].innerText;
    for (let i = elements.length - 1; i > 0; i--) {
      elements[i].innerText = elements[i - 1].innerText;
    }
    elements[0].innerText = lastText;
    recalc();
  };

  const prevElement = function () {
    const elements = getAllDivs(this);
    if (elements.length < 2) return;
    const firstText = elements[0].innerText;
    for (let i = 0; i < elements.length - 1; i++) {
      elements[i].innerText = elements[i + 1].innerText;
    }
    elements[elements.length - 1].innerText = firstText;
    recalc();
  };

  const countSelected = () => {
    const t = table();
    if (!t) return;
    Array.from(t.rows).forEach(row => {
      const selectedCells = row.querySelectorAll('td.selected').length;
      const countCell = row.querySelector('td[data-control="count"]');
      if (countCell) countCell.textContent = selectedCells;
    });
  };

  /*** ===========================
   *  VARIABLE SUMMATION
   *  =========================== */
  const getVariableValue = (name) => {
    const el = document.getElementById(name.toUpperCase());
    return el ? parseFloat(el.value) || 0 : 0;
  };

  const sumTableByVariables = () => {
    const t = table();
    if (!t) return;

    let total = 0;
    const found = {};

    const cells = t.querySelectorAll('td');

    for (let i = 0; i < cells.length; i++) {
      const html = cells[i].innerHTML.toUpperCase();

      // match variables like C1, C2, C3, C4, C5 anywhere in the cell
      const match = html.match(/\bC[1-5]\b/);

      if (match) {
        const variable = match[0];
        const val = getVariableValue(variable);

        // safe decimal addition
        total = Number((total + val).toFixed(10));

        found[variable] = (found[variable] || 0) + 1;
      }
    }

    const details = Object.keys(found)
    .map((key) => `${key} × ${found[key]} = ${getVariableValue(key) * found[key]}`);

    output.innerHTML = `
    <div class="section-title">Variables found: ${details || 'None'}</div>
    <div class="section-title">Total sum:${total}</div>`;
  };

  /*** ===========================
   *  TABLE & ROW CREATION
   *  =========================== */
  const createRow = (days, name) => {
    let t = table();
    if (!t) {
      t = document.createElement('table');
      t.id = 'table';
      t.cellPadding = '0';
      t.cellSpacing = '0';
      main.appendChild(t);
    }

    const row = document.createElement('tr');
    const rowFragment = document.createDocumentFragment();

    const nameCell = createElement('td', capitalize(name));
    nameCell.addEventListener('dblclick', addText);
    row.appendChild(nameCell);

    const totalDays = Number(days) >= 28 && Number(days) <= 31 ? Number(days) : 31;
    const textValue = textInput.value;

    for (let i = 1; i <= totalDays; i++) {
      let fill = i < 10 ? `0${i}` : i;
      if (textValue.includes('+')) fill = filler();
      else if (textValue) fill = textValue;

      const cell = createElement('td', fill);
      cell.align = 'center';
      cell.addEventListener('click', toggleClass);
      cell.addEventListener('dblclick', addText);
      row.appendChild(cell);
    }

    const controls = [
      { text: 'remove', control: 'remove', handler: removeElement },
      { text: '<', control: 'prev', handler: prevElement },
      { text: '>', control: 'next', handler: nextElement },
      { text: '0', control: 'count', handler: countSelected }
    ];

    controls.forEach(({ text, control, handler }) => {
      const ctrl = createElement('td', text);
      ctrl.dataset.control = control;
      ctrl.addEventListener('click', handler);
      row.appendChild(ctrl);
    });

    rowFragment.appendChild(row);
    t.appendChild(rowFragment);

    // ensure UI state is consistent after row creation
    recalc();
  };

  /*** ===========================
   *  EXPORT TO EXCEL
   *  =========================== */
  const inlineTableStyles = (table) => {
    Array.from(table.rows).forEach((row) => {
      Array.from(row.cells).forEach((cell) => {
        const text = cell.textContent.trim().toLowerCase();
        if (['remove', '<', '>'].includes(text)) {
          cell.remove();
          return;
        }
        cell.setAttribute('valign', 'top'); // top-aligned
        if (cell.classList.contains('selected')) {
          cell.setAttribute('bgcolor', '#777777');
        }
        if (cell.dataset.control === 'count') {
          cell.setAttribute('bgcolor', '#eeeeee');
        }
      });
    });
    return table;
  };

  const tableToExcel = (() => {
    const uri = 'data:application/vnd.ms-excel;base64,';
    const template = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
    xmlns:x="urn:schemas-microsoft-com:office:excel"
    xmlns="http://www.w3.org/TR/REC-html40">
    <head>
    <!--[if gte mso 9]>
    <xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
    <x:Name>{worksheet}</x:Name>
    <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
    </x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml>
    <![endif]-->
    <meta charset="UTF-8"/>
    </head><body><table border="1" style="border-collapse:collapse;">{table}</table></body></html>`;

    const base64 = (s) => {
      const utf8Bytes = new TextEncoder().encode(s);
      return btoa(String.fromCharCode(...utf8Bytes));
    };

    const format = (s, c) => s.replace(/{(\w+)}/g, (_, key) => c[key]);

    // NEW → generate timestamp + random part
    const exportName = (name) => {
      const d = new Date();
      const pad = (n) => String(n).padStart(2, '0');

      const timestamp =
      d.getFullYear() + '-' +
      pad(d.getMonth() + 1) + '-' +
      pad(d.getDate()) + '-' +
      pad(d.getHours()) + '-' +
      pad(d.getMinutes());

      const rnd = Math.random().toString(36).slice(2, 8);

      return (name || 'worksheet') + '-' + timestamp + '-' + rnd + '.xls';
    };

    return (table, name) => {
      if (!table.nodeType) table = document.getElementById(table);

      const clone = inlineTableStyles(table.cloneNode(true));
      const ctx = { worksheet: name || 'Worksheet', table: clone.innerHTML };

      const link = document.createElement('a');
      link.download = exportName(name);
      link.href = uri + base64(format(template, ctx));
      link.click();
    };
  })();

  /*** ===========================
   *  EVENT BINDINGS
   *  =========================== */
  addTextButton.addEventListener('click', addTextToSelected);
  exportToExcel.addEventListener('click', () => tableToExcel('table'));
  sumTableButton?.addEventListener('click', sumTableByVariables);

  addButton.addEventListener('click', () => {
    const number = getValue('#number');
    const name = isEmpty('table') ? formattedDate : getValue('#name');
    createRow(number, name);
    inputNumber.disabled = true;
    updateCloneButtonState();
    // ensure totals and save after adding
    recalc();
  });

  /*** ===========================
   *  VARIABLE INPUT CLICK TO TEXT
   *  =========================== */
  variableIDs.forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      const setVariable = () => {
        textInput.value = id.toUpperCase(); // replace previous text
      };

      // Clicking the input itself
      input.addEventListener('click', setVariable);

      // Clicking the label also works
      const label = input.closest('label');
      if (label) {
        label.addEventListener('click', (e) => {
          e.preventDefault(); // prevent default label behavior
          setVariable();
          recalc();
        });
      }

      input.addEventListener('input', recalc);   // triggers as user types
      input.addEventListener('change', recalc);  // triggers on blur or manual change
    }
  });

  /*** ===========================
   *  CLONE ROW
   *  =========================== */
  cloneButton.addEventListener('click', function () {
    const t = table();
    if (!t) return;
    const rows = t.getElementsByTagName('tr');
    if (!rows.length) return;

    const lastRow = rows[rows.length - 1];
    const clone = lastRow.cloneNode(true);

    const cells = clone.querySelectorAll('td');
    cells.forEach((cell) => {
      const text = cell.textContent.trim().toLowerCase();

      // First cell (name) should only have dblclick for addText (no toggle)
      if (cell.cellIndex === 0) {
        cell.addEventListener('dblclick', addText);
        return;
      }

      // controls are the last 4 cells
      if (!['remove', '<', '>'].includes(text) && cell.dataset.control !== 'count') {
        cell.addEventListener('click', toggleClass);
        cell.addEventListener('dblclick', addText);
      }

      if (text === 'remove') cell.addEventListener('click', removeElement);
      else if (text === '<') cell.addEventListener('click', prevElement);
      else if (text === '>') cell.addEventListener('click', nextElement);
    });

      t.appendChild(clone);
      // ensure totals and save after cloning
      recalc();
  });

  /*** ===========================
   *  LOAD TABLE FROM STORAGE
   *  =========================== */
  const loadTable = () => {
    const data = loopStorage.getItem('tableData', []);
    if (!data.length) return;

    data.forEach(rowData => {
      const name = rowData[0]?.text || '';
      const days = rowData.length - 5; // first cells only, excluding last 4 controls
      createRow(days, name);

      const t = table();
      const row = t.rows[t.rows.length - 1];

      rowData.forEach((cellData, i) => {
        row.cells[i].innerHTML = cellData.html || '';
        // restore selection only if it's not a control cell and not the first cell
        if (i > 0 && i < row.cells.length - 4 && cellData.selected) {
          row.cells[i].classList.add('selected');
        }
      });
    });

    recalc();
  };

  /*** ===========================
   *  CLEAR CELL TEXT ON RIGHT-CLICK
   *  =========================== */
  const enableClearOnRightClick = () => {
    const t = table();
    if (!t) return;

    t.addEventListener('contextmenu', (e) => {
      const cell = e.target.closest('td');
      if (!cell || cell.dataset.control) return; // ignore control cells

      e.preventDefault(); // prevent default browser context menu
      cell.innerHTML = '';          // clear text
      cell.classList.remove('selected'); // unselect
      cell.dataset.breakAdded = '';      // reset break flag

      recalc();
    });
  };

  /*** ===========================
   *  INITIALIZATION
   *  =========================== */
  document.addEventListener('DOMContentLoaded', () => {
    const tableData = loopStorage.getItem('tableData', null);

    if (tableData && tableData.length > 0) {
      // Load table from localStorage if data exists
      loadTable();
      enableClearOnRightClick();
    } else if (main.innerHTML.trim() === '') {
      // No saved data, create default row
      createRow(getValue('#number'), formattedDate);
      inputNumber.disabled = true;
      enableClearOnRightClick();
    }

    // always ensure totals are correct on startup
    recalc();
  });

  // ----------------------
  // DECIMAL COUNTER LOGIC USING table's StorageNamespace
  // ----------------------

  // Step-safe decimal increment/decrement helper (prevents floating point artifacts)
  const stepFix = (value, step, dir) => {
    const v = Number(value);
    const s = Number(step) || 1;

    const decimals = Math.max(
      (value.toString().split('.')[1] || '').length,
                              (step.toString().split('.')[1] || '').length
    );

    const newVal = dir === 'inc' ? v + s : v - s;
    return Number(newVal.toFixed(decimals));
  };

  // Counter state (basic defaults)
  const counterState = {
    min: 0,
    max: 100,
    step: 0,
    value: 0,
    set number(n) {
      if (typeof n !== 'number') return;
      if (n > this.max) return;
      if (n < this.min) return;
      this.value = n;
    },
    get number() { return this.value; }
  };

  Object.seal(counterState);

  // Flag to prevent multiple saves
  let isCounterSaving = false;

  // Select all number inputs (treat all input[type="number"] as counters)
  const counterInputs = document.querySelectorAll('input[type="number"]');

  // Save all counter inputs using loopStorage
  const saveAllCounterInputs = () => {
    const values = Array.from(counterInputs, inp => inp.value);
    loopStorage.setItem('counterValues', values);
  };

  // Set items and trigger save (debounced)
  async function setCounterItems(el) {
    if (isCounterSaving) return;
    isCounterSaving = true;
    el?.classList?.add('saved');
    await delay(500);
    saveAllCounterInputs();
    el?.classList?.remove('saved');
    isCounterSaving = false;
  }

  // Highlight function (min/max reached)
  const highlightCounter = async el => {
    el.classList.add('max');
    await delay(200);
    el.classList.remove('max');
  };

  // Button click handler (+ / —)
  const adjustCounter = e => {
    const target = e.target;
    if (target.tagName !== 'BUTTON') return;

    const inputEl = target.parentElement.querySelector('input[type="number"]');
    if (!inputEl) return;
    counterState.number = parseFloat(inputEl.value);
    counterState.step = parseFloat(inputEl.step) || 0.1;

    if (target.textContent === '—') {
      const next = stepFix(inputEl.value, inputEl.step || counterState.step, 'dec');
      const min = parseFloat(inputEl.min) || counterState.min;
      if (next >= min) {
        inputEl.value = next;
      } else return highlightCounter(target);
    }

    if (target.textContent === '+') {
      const next = stepFix(inputEl.value, inputEl.step || counterState.step, 'inc');
      const max = parseFloat(inputEl.max) || counterState.max;
      if (next <= max) {
        inputEl.value = next;
      } else return highlightCounter(target);
    }

    setCounterItems(target.parentElement);
  };

  // Input manual change handler
  const counterInputChange = e => {
    const inputEl = e.target;
    let val = parseFloat(inputEl.value);
    const min = parseFloat(inputEl.min) || counterState.min;
    const max = parseFloat(inputEl.max) || counterState.max;

    if (isNaN(val) || val < min) val = min;
    if (val > max) val = max;

    // normalize to step precision
    const step = parseFloat(inputEl.step) || counterState.step;
    const decimals = Math.max((step.toString().split('.')[1] || '').length, (val.toString().split('.')[1] || '').length);
    inputEl.value = Number(val.toFixed(decimals));

    setCounterItems(inputEl.parentElement);
  };

  // Initialize counters with saved values
  const savedValues = loopStorage.getItem('counterValues', []);

  counterInputs.forEach((inputEl, index) => {
    inputEl.value = (savedValues && savedValues[index] !== undefined) ? savedValues[index] : (inputEl.value || inputEl.min || 0.1);

    // attach button click handler on parent (if parent contains +/- buttons)
    inputEl.parentElement?.addEventListener('click', adjustCounter);

    // attach input change handler
    inputEl.addEventListener('change', counterInputChange);
  });

})();
