/* jshint esversion: 11 */

(() => {
  'use strict';

  // ------------------------------
  // CONSTANTS & SELECTORS
  // ------------------------------
  const DATA_CELLS_END_OFFSET = 4; // last N cells in each row are controls and must NOT be counted
  const main = document.querySelector('#main');
  const addButton = document.querySelector('#add');
  const cloneButton = document.querySelector('#clone');
  const exportToExcel = document.querySelector('#export');

  const inputNumber = document.querySelector('#number');
  const addTextButton = document.getElementById('add-text-to-selected');
  const breakCheckbox = document.getElementById('break');
  const name = document.getElementById('name');
  const textInput = document.querySelector('#text');
  const sumTableButton = document.getElementById('sum-table');
  const exportJsonButton = document.getElementById('export-json');
  const importJsonButton = document.getElementById('import-json');
  const importFileInput = document.getElementById('import-file');

  const variableIDs = ['C1','C2','C3','C4','C5'];

  const today = new Date();
  const formattedDate = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
  // Safe delay helper (used by counters/highlight/save)
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
  // ------------------------------
  // STORAGE NAMESPACE
  // ------------------------------
  class StorageNamespace {
    constructor(namespace){ this.namespace = namespace; }
    setItem(key, value){ localStorage.setItem(`${this.namespace}:${key}`, JSON.stringify(value)); }
    getItem(key, defaultValue = null){
      const val = localStorage.getItem(`${this.namespace}:${key}`);
      return val !== null ? JSON.parse(val) : defaultValue;
    }
    removeItem(key){ localStorage.removeItem(`${this.namespace}:${key}`); }
  }
  const loopStorage = new StorageNamespace('table');
  // ONE unified timestamp filename generator
  const exportFilename = (base = "export", ext = "json") => {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");

    const stamp =
    d.getFullYear() + "-" +
    pad(d.getMonth() + 1) + "-" +
    pad(d.getDate()) + "-" +
    pad(d.getHours()) + "-" +
    pad(d.getMinutes()) + "-" +
    pad(d.getSeconds());

    const randomID = Math.random().toString(36).substring(2, 8).toUpperCase();

    return `${base}-${stamp}-${randomID}.${ext}`;
  };

  // ------------------------------
  // UTILITIES
  // ------------------------------
  const table = () => document.getElementById('table');
  const createElement = (tag, html='') => { const e = document.createElement(tag); e.innerHTML = html; return e; };
  const getVariableValue = name => {
    const el = document.getElementById(name.toUpperCase());
    return el ? (parseFloat(el.value) || 0) : 0;
  };

  // central recalc helper
  const recalc = () => {
    sumTableByVariables();
    saveTable();
  };

  // ------------------------------
  // ROW SUM & SELECTED COUNT (uses DATA_CELLS_END_OFFSET)
  // ------------------------------
  const updateRowCounts = row => {
    const cells = row.querySelectorAll("td");
    const limit = cells.length - DATA_CELLS_END_OFFSET;

    let total = 0;
    let selected = 0;

    for (let i = 0; i < limit; i++) {
      const cell = cells[i];

      // count selected
      if (cell.classList.contains("selected")) {
        selected++;
      }

      // detect variables C1..C5
      const text = (cell.innerHTML || '')
      .replace(/<br\s*\/?>/gi, ' ')
      .toUpperCase();

      const matches = text.match(/\bC[1-5]\b/g);

      if (matches) {
        for (let j = 0; j < matches.length; j++) {
          total += getVariableValue(matches[j]);
        }
      }
    }

    const countCell =
    row.querySelector('td[data-control="count"]') ||
    cells[cells.length - 1];

    if (countCell) {
      countCell.textContent = `${selected}/${total}`;
    }
  };


  const sumTableByVariables = () => {
    const t = table();
    if (!t) return;
    Array.from(t.rows).forEach(updateRowCounts);
  };

  // ------------------------------
  // APPLY TEXT TO CELL (dblclick or add-to-selected)
  // ------------------------------
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
  // ------------------------------
  // CELL INTERACTIONS (click/dblclick handlers)
  // ------------------------------
  const toggleClass = (e) => {
    const cell = e.currentTarget;
    // do not toggle first cell nor control cells
    if (!cell || cell.cellIndex === 0) return;
    // Prevent toggling control cells (last N)
    const cells = cell.parentElement.querySelectorAll('td');
    if (cell.cellIndex >= cells.length - DATA_CELLS_END_OFFSET) return;

    cell.classList.toggle('selected');
    recalc();
  };

  const addTextHandler = (e) => {
    const cell = e.currentTarget;
    // only apply to non-control cells
    const cells = cell.parentElement.querySelectorAll('td');
    if (cell.cellIndex >= cells.length - DATA_CELLS_END_OFFSET) return;
    applyTextToCell(cell, textInput.value, breakCheckbox.checked);
  };

  const removeRow = function () {
    const row = this.closest('tr');
    if (!row) return;
    row.remove();
    recalc();
  };

  const prevElement = function () {
    const row = this.closest('tr');
    if (!row) return;

    const cells = row.querySelectorAll('td');
    const dataCells = Array.prototype.slice.call(cells, 1, -DATA_CELLS_END_OFFSET);
    if (dataCells.length < 2) return;

    const firstHTML = dataCells[0].innerHTML;
    const firstClass = dataCells[0].className;

    for (let i = 0; i < dataCells.length - 1; i++) {
      dataCells[i].innerHTML = dataCells[i + 1].innerHTML;
      dataCells[i].className = dataCells[i + 1].className;
    }

    const last = dataCells.length - 1;
    dataCells[last].innerHTML = firstHTML;
    dataCells[last].className = firstClass;

    recalc();
  };

  const nextElement = function () {
    const row = this.closest('tr');
    if (!row) return;

    const cells = row.querySelectorAll('td');
    const dataCells = Array.prototype.slice.call(cells, 1, -DATA_CELLS_END_OFFSET);
    if (dataCells.length < 2) return;

    const last = dataCells.length - 1;
    const lastHTML = dataCells[last].innerHTML;
    const lastClass = dataCells[last].className;

    for (let i = last; i > 0; i--) {
      dataCells[i].innerHTML = dataCells[i - 1].innerHTML;
      dataCells[i].className = dataCells[i - 1].className;
    }

    dataCells[0].innerHTML = lastHTML;
    dataCells[0].className = lastClass;

    recalc();
  };




  // ------------------------------
  // CLONE ROW (reattach event handlers, clear selected classes on data cells)
  // ------------------------------
  const cloneRow = () => {
    const t = table();
    if (!t) return;

    const rows = t.getElementsByTagName('tr');
    if (!rows.length) return;

    const lastRow = rows[rows.length - 1];
    const clone = lastRow.cloneNode(true);

    const cells = clone.querySelectorAll('td');

    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i];

      // First cell: dblclick → addTextHandler
      if (i === 0) {
        cell.addEventListener('dblclick', addTextHandler);
        continue;
      }

      // Data cells: click + dblclick
      if (i < cells.length - DATA_CELLS_END_OFFSET) {
        cell.addEventListener('click', toggleClass);
        cell.addEventListener('dblclick', addTextHandler);
        continue;
      }

      // Control cells
      const ctl = (cell.textContent || '').trim();
      if (ctl === 'remove') cell.addEventListener('click', removeRow);
      else if (ctl === '>') cell.addEventListener('click', nextElement);
      else if (ctl === '<') cell.addEventListener('click', prevElement);
    }

    t.appendChild(clone);
    recalc();
  };


  // ------------------------------
  // CREATE ROW (attach events correctly)
  // ------------------------------
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

    const nameCell = createElement('td', name || '');
    // nameCell: dblclick to add text (same handler style)
    nameCell.addEventListener('dblclick', addTextHandler);
    row.appendChild(nameCell);

    // data cells
    for (let i = 1; i <= days; i++) {
      let text = (!textInput.value) ? i : textInput.value;
      const cell = createElement('td', text);
      cell.align = 'center';
      cell.style.textAlign = 'center';
      cell.addEventListener('click', toggleClass);
      cell.addEventListener('dblclick', addTextHandler);
      row.appendChild(cell);
    }

    // controls (last DATA_CELLS_END_OFFSET cells)
    const controls = [
      { text: 'remove', control: 'remove', handler: removeRow },
      { text: '<', control: 'prev', handler: prevElement },
      { text: '>', control: 'next', handler: nextElement },
      { text: '0', control: 'count', handler: null } // display cell
    ];

    controls.forEach(c => {
      const ctrl = createElement('td', c.text);
      ctrl.dataset.control = c.control;
      if (c.handler) ctrl.addEventListener('click', c.handler);
      row.appendChild(ctrl);
    });

    t.appendChild(row);
    recalc();
  };

  // ------------------------------
  // CONTEXT MENU: right-click to clear cell (skip control cells)
  // ------------------------------
  const enableClearOnRightClick = () => {
    const t = table();
    if (!t) return;
    t.addEventListener('contextmenu', (e) => {
      const cell = e.target.closest('td');
      if (!cell) return;
      // skip control cells
      const cells = cell.parentElement.querySelectorAll('td');
      if (cell.cellIndex >= cells.length - DATA_CELLS_END_OFFSET) return;

      e.preventDefault();
      cell.innerHTML = '';
      cell.classList.remove('selected');
      delete cell.dataset.breakAdded;
      recalc();
    });
  };

  // ------------------------------
  // SAVE / LOAD TABLE (data cells only, exclude last N controls)
  // ------------------------------
  const saveTable = () => {
    const t = table();
    if (!t) return;

    const data = Array.from(t.rows).map(row => {
      const cells = Array.from(row.cells);
      return cells
      .slice(0, cells.length - DATA_CELLS_END_OFFSET)
      .map(cell => ({
        html: cell.innerHTML,
        selected: cell.classList.contains("selected")
      }));
    });
    loopStorage.setItem("tableData", data);
  };

  const loadTable = () => {
    const data = loopStorage.getItem("tableData", []);

    // remove existing table to avoid duplicate rows/cells
    const old = table();
    if (old) old.remove();

    if (!Array.isArray(data) || data.length === 0) {
      // nothing saved
      return;
    }

    data.forEach(rowData => {
      // rowData.length = number of data cells (including name cell)
      const numData = rowData.length;
      const name = rowData[0]?.html || '';

      // createRow expects 'days' = number of data cells minus 1 (because it creates nameCell + days data cells)
      createRow(Math.max(0, numData - 1), name.value || formattedDate);

      const t = table();
      const row = t.rows[t.rows.length - 1];

      // restore content & selection for data cells only
      for (let i = 0; i < numData; i++) {
        const cellData = rowData[i];
        if (!cellData) continue;
        const cell = row.cells[i];
        if (!cell) continue;
        cell.innerHTML = cellData.html || '';
        if (cellData.selected) cell.classList.add('selected');
        else cell.classList.remove('selected');
      }
    });

    recalc();
  };


  // ------------------------------
  // JSON IMPORT / EXPORT
  // ------------------------------
  exportJsonButton?.addEventListener('click', () => {
    const t = table();
    if (!t) return;
    const data = Array.from(t.rows).map(row => {
      const cells = Array.from(row.cells);
      return cells.slice(0, -DATA_CELLS_END_OFFSET).map(cell => ({
        html: cell.innerHTML,
        selected: cell.classList.contains('selected')
      }));
    });
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = exportFilename(name.value || "data-table", "json");
    a.click();
    URL.revokeObjectURL(url);
  });

  importJsonButton?.addEventListener('click', () => importFileInput.click());
  importFileInput?.addEventListener('change', function () {
    const file = this.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const json = JSON.parse(e.target.result);
        if (!Array.isArray(json)) throw new Error('Invalid JSON');
        // clear previous table and store then load
        const t = table();
        if (t) t.remove();
        loopStorage.setItem('tableData', json);
        loadTable();
      } catch (err) {
        console.error('Import JSON error:', err);
        alert('Invalid JSON file!');
      }
    };
    reader.readAsText(file);
  });

  // ------------------------------
  // EXPORT TO EXCEL (cloned html)
  // ------------------------------
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

    return (table) => {
      if (!table.nodeType) table = document.getElementById(table);

      const clone = inlineTableStyles(table.cloneNode(true));
      const ctx = { worksheet: name || 'Worksheet', table: clone.innerHTML };

      const link = document.createElement('a');
      link.download = exportFilename(name.value || "worksheet", "xls");
      link.href = uri + base64(format(template, ctx));
      link.click();
    };
  })();
  exportToExcel?.addEventListener('click', () => tableToExcel('table'));

  // ------------------------------
  // VARIABLE INPUT CLICK (C1..C5): put id into text input
  // ------------------------------
  variableIDs.forEach(id => {
    const inp = document.getElementById(id);
    if (!inp) return;
    const setVar = (e) => {
      e?.preventDefault();
      textInput.value = id.toUpperCase();
    };
    inp.addEventListener('click', setVar);

    // if label exists, clicking label also sets variable and recalcs
    const label = inp.closest('label');
    if (label) {
      label.addEventListener('click', (e) => {
        e.preventDefault();
        setVar();
        recalc();
      });
    }

    // also trigger recalc on input change (value changes of variables affect sums)
    inp.addEventListener('input', recalc);
    inp.addEventListener('change', recalc);
  });

  // ------------------------------
  // INIT
  // ------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    const data = loopStorage.getItem('tableData', null);
    if (data && Array.isArray(data) && data.length > 0) {
      loadTable();
    } else {
      createRow(Number(inputNumber.value) || 31, name.value || formattedDate);
    }
    enableClearOnRightClick();
  });

  addButton?.addEventListener('click', () => {
    createRow(Number(inputNumber.value) || 31, name.value || formattedDate);
  });

  cloneButton?.addEventListener('click', cloneRow);

  addTextButton?.addEventListener('click', () => {
    const sel = main.querySelectorAll('.selected');
    if (!sel.length) return;
    sel.forEach(cell => applyTextToCell(cell, textInput.value, breakCheckbox.checked));
  });

  sumTableButton?.addEventListener('click', () => {
    recalc();
    saveTable();
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
