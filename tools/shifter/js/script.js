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

  const addText = (e) => {
    e.preventDefault();
    const text = textInput.value;
    applyTextToCell(e.currentTarget, text, breakCheckbox.checked);
  };
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
        text: cell.textContent,
        selected: cell.classList.contains('selected')
      }));
      // Add last 4 cells as plain text (controls)
      const controlCells = cells.slice(-4).map(cell => ({ text: cell.textContent }));
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
  };
  /*** ===========================
   *  TEXT HANDLING
   *  =========================== */
  const applyTextToCell = (cell, text, addBreak = false) => {
    if (addBreak && !cell.dataset.breakAdded) {
      cell.innerHTML += '<br>' + text;
      cell.dataset.breakAdded = 'true';
    } else if (!addBreak) {
      cell.innerHTML = text;
      cell.dataset.breakAdded = '';
    }
    countSelected(); // ✅ update count automatically
    saveTable(); // ✅ save immediately
  };
  /*** ===========================
   *  TABLE CELL INTERACTIONS
   *  =========================== */
  const toggleClass = (e) => {
    e.preventDefault();
    e.currentTarget.classList.toggle('selected');
    countSelected();
      sumTableByVariables();      // updates variable totals immediately
        saveTable(); // ✅ save immediately
  };

  const removeElement = function () {
    const row = this.closest('tr'); // ensures we get the correct row
    if (!row) return;
    row.remove();

    inputNumber.disabled = !isEmpty('table'); // enable input if table is empty
    updateCloneButtonState();
    countSelected();  // update counts after removal
    saveTable();      // save immediately
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
  };

  const prevElement = function () {
    const elements = getAllDivs(this);
    if (elements.length < 2) return;
    const firstText = elements[0].innerText;
    for (let i = 0; i < elements.length - 1; i++) {
      elements[i].innerText = elements[i + 1].innerText;
    }
    elements[elements.length - 1].innerText = firstText;
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
      const text = cells[i].textContent.trim().toUpperCase();
      if (variableIDs.includes(text)) {
        const val = getVariableValue(text);
        total += val;
        found[text] = (found[text] || 0) + 1;
      }
    }

    const details = Object.keys(found)
    .map((key) => `${key} × ${found[key]} = ${getVariableValue(key) * found[key]}`)
    .join('\n');

    output.innerHTML = `
    <div class="section-title">Variables Found:</div>
    ${details || 'None found'}

    <div class="section-title">Total Sum:</div>
    ${total}
    `;
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

    return (table, name) => {
      if (!table.nodeType) table = document.getElementById(table);
      const clone = inlineTableStyles(table.cloneNode(true));
      const ctx = { worksheet: name || 'Worksheet', table: clone.innerHTML };
      window.location.href = uri + base64(format(template, ctx));
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
  });
  variableIDs.forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener('change', sumTableByVariables); // ✅ triggers on change
      input.addEventListener('input', sumTableByVariables);  // optional: triggers on typing
    }
  });

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
      if (!['remove', '<', '>'].includes(text)) {
        cell.addEventListener('click', toggleClass);
        cell.addEventListener('dblclick', addText);
      }
      if (text === 'remove') cell.addEventListener('click', removeElement);
      else if (text === '<') cell.addEventListener('click', prevElement);
      else if (text === '>') cell.addEventListener('click', nextElement);
    });

      t.appendChild(clone);
  });

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
        row.cells[i].textContent = cellData.text || '';
        // restore selection only if it's not a control cell
        if (i < row.cells.length - 4 && cellData.selected) {
          row.cells[i].classList.add('selected');
        }
      });
    });

    countSelected();      // update counts
    sumTableByVariables(); // update totals
  };


  /*** ===========================
   *  INITIALIZATION
   *  =========================== */
  const tableData = loopStorage.getItem('tableData', null);

  if (tableData && tableData.length > 0) {
    // Load table from localStorage if data exists
    loadTable();
  } else if (main.innerHTML.trim() === '') {
    // No saved data, create default row
    createRow(getValue('#number'), formattedDate);
    inputNumber.disabled = true;
  }
})();
