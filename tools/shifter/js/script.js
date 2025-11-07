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

  // Today's date (used as default row label)
  const today = new Date();
  const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const updateCloneButtonState = () => {
    const table = document.getElementById('table');
    const hasRows = table && table.querySelectorAll('tr').length > 0;
    cloneButton.disabled = !hasRows;
  };

  /*** ===========================
   *  UTILITY FUNCTIONS
   *  =========================== */
  const getValue = (selector) => document.querySelector(selector).value;

  const isEmpty = (id) => {
    const element = document.getElementById(id);
    return element.children.length === 0 && element.textContent.trim() === '';
  };

  const capitalize = (word) =>
  word ? word.charAt(0).toUpperCase() + word.slice(1) : '';

  const createElement = (tag, content = '') => {
    const el = document.createElement(tag);
    el.innerHTML = content;
    return el;
  };

  /*** ===========================
   *  EVENT HANDLERS
   *  =========================== */
  const toggleClass = (e) => {
    e.preventDefault();
    e.currentTarget.classList.toggle('selected');
  };

  const addText = (e) => {
    e.preventDefault();
    e.currentTarget.innerText = getValue('#text');
  };

  const addTextToSelected = () => {
    const selected = main.querySelectorAll('.selected');
    const text = getValue('#text');
    selected.forEach((el) => (el.innerText = text));
  };

  const removeElement = function () {
    this.parentElement.remove();
    inputNumber.disabled = !isEmpty('table');
    updateCloneButtonState();
  };

  let counter = 0;
  const filler = () => {
    const val = getValue('#text');
    const firstNum = Number(val[0]);
    counter += firstNum;
    return counter % firstNum === 0 ? 1 : 0;
  };

  const getAllDivs = (btn) => {
    const [, ...listOfAll] = btn.parentElement.children;
    listOfAll.length -= 3;
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

  /*** ===========================
   *  TABLE & ROW CREATION
   *  =========================== */
  const createRow = (days, name) => {
    let table = main.querySelector('table');
    if (!table) {
      table = document.createElement('table');
      table.id = 'table';
      table.cellPadding = '0';
      table.cellSpacing = '0';
      table.style.gridTemplateColumns = `repeat(${Number(days) + 4}, minmax(20px, 1fr))`;
      main.appendChild(table);
    }

    const row = document.createElement('tr');
    const rowFragment = document.createDocumentFragment();

    // Name cell
    const nameCell = createElement('td', capitalize(name));
    nameCell.addEventListener('dblclick', addText);
    row.appendChild(nameCell);

    // Days
    const totalDays = Number(days) >= 28 && Number(days) <= 31 ? Number(days) : 31;
    const textValue = getValue('#text');

    for (let i = 1; i <= totalDays; i++) {
      let fill = i < 10 ? `0${i}` : i;
      if (textValue.includes('+')) {
        fill = filler();
      } else if (textValue) {
        fill = textValue;
      }

      const cell = createElement('td', fill);
      cell.align = 'center';
      cell.addEventListener('click', toggleClass);
      cell.addEventListener('dblclick', addText);
      row.appendChild(cell);
    }

    // Controls
    const controls = [
      { text: 'remove', handler: removeElement },
      { text: '<', handler: prevElement },
      { text: '>', handler: nextElement }
    ];

    controls.forEach(({ text, handler }) => {
      const ctrl = createElement('td', text);
      ctrl.id = text;
      ctrl.addEventListener('click', handler);
      row.appendChild(ctrl);
    });

    rowFragment.appendChild(row);
    table.appendChild(rowFragment);
  };

  /*** ===========================
   *  EXPORT TO EXCEL
   *  =========================== */
  const inlineTableStyles = (table) => {
    Array.from(table.rows).forEach((row) => {
      Array.from(row.cells).forEach((cell) => {
        const cs = getComputedStyle(cell);

        if (['remove', '<', '>'].includes(cell.textContent.toLowerCase())) {
          cell.remove();
          return;
        }

        if (cs.backgroundColor && cs.backgroundColor !== 'rgba(0, 0, 0, 0)') {
          cell.setAttribute('bgcolor', '#eee');
        }

        const widthPx = parseInt(cs.width, 10);
        if (!isNaN(widthPx) && widthPx > 0) {
          cell.setAttribute('width', widthPx);
          cell.style.width = `${widthPx}px`;
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
    </head><body><table>{table}</table></body></html>`;

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

  addButton.addEventListener('click', () => {
    const number = getValue('#number');
    const name = isEmpty('table') ? formattedDate : getValue('#name');
    createRow(number, name);
    inputNumber.disabled = true;
    updateCloneButtonState();
  });

  cloneButton.addEventListener('click', function () {
    const table = document.getElementById('table');
    if (!table) return;

    const rows = table.getElementsByTagName('tr');
    if (!rows.length) return;

    const lastRow = rows[rows.length - 1];
    const clone = lastRow.cloneNode(true);

    // Reattach all event listeners
    const cells = clone.querySelectorAll('td');
    cells.forEach((cell) => {
      const text = cell.textContent.trim().toLowerCase();

      // Regular day cells
      if (!['remove', '<', '>'].includes(text)) {
        cell.addEventListener('click', toggleClass);
        cell.addEventListener('dblclick', addText);
      }

      // Control cells
      if (text === 'remove') {
        cell.addEventListener('click', removeElement);
      } else if (text === '<') {
        cell.addEventListener('click', prevElement);
      } else if (text === '>') {
        cell.addEventListener('click', nextElement);
      }
    });

    table.appendChild(clone);
  });

  /*** ===========================
   *  INITIALIZATION
   *  =========================== */
  if (main.innerHTML.trim() === '') {
    createRow(getValue('#number'), formattedDate);
    inputNumber.disabled = true;
  }
})();
