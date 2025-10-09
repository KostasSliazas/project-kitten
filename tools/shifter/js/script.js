/* jshint esversion: 6 */
(function () {
  'use strict';
  const main = document.querySelector('#main');
  const addButton = document.querySelector('#add');
  const exportToExcel = document.querySelector('#export');
  const inputNumber = document.querySelector('#number');

  // Toggle "selected" class
  function toggleClass(e) {
    e.stopPropagation();
    e.preventDefault();
    e.currentTarget.classList.toggle('selected');
  }

  let counter = 0;

  const filler = () => {
    const val = getValue('#text');
    const firstNum = val[0];
    counter += Number(firstNum);
    return (counter % firstNum === 0) ? 1 : 0;
  };

  const getValue = (element) => document.querySelector(element).value;

  const isEmpty = (el) => {
    const element = document.getElementById(el);
    return element.children.length === 0 && element.textContent.trim() === '';
  };

  const removeElement = function () {
    this.parentElement.remove();
    inputNumber.disabled = !isEmpty('table');
  };

  function addText(e) {
    e.stopPropagation();
    e.preventDefault();
    e.currentTarget.innerText = getValue('#text');
    return e.currentTarget.innerText;
  }

  const addTextToSelected = () => {
    const selected = main.querySelectorAll('.selected');
    selected.forEach((element) => {
      element.innerText = getValue('#text');
    });
  };

  // Factory function for creating elements
  const createElement = (tag, content) => {
    const el = document.createElement(tag);
    el.innerHTML = content;
    return el;
  };

  const getAllDivs = function (e) {
    const [, ...listOfAll] = e.parentElement.children;
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

  const capitalize = (word) => {
    if (!word) return '';
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  // Create table row
  const createRow = (days, name) => {
    if (!name || name.length === 0) return;

    let table;
    if (main.children.length > 0) {
      table = document.getElementsByTagName('table')[0];
    } else {
      table = document.createElement('table');
      table.id = 'table';
      table.setAttribute('cellpadding', '0');
      table.setAttribute('cellspacing', '0');
      table.style.gridTemplateColumns = `repeat(${Number(days) + 4}, minmax(20px, 1fr))`;
    }

    const rowFragment = document.createDocumentFragment();
    const line = createElement('tr', '');
    rowFragment.appendChild(line);

    // Name cell
    const nameElement = createElement('td', capitalize(name));
    nameElement.addEventListener('dblclick', (e) => addText.call(nameElement, e));
    line.appendChild(nameElement);

    // Day cells
    const totalDays = Number(days) >= 28 && Number(days) <= 31 ? Number(days) : 31;
    for (let i = 1; i <= totalDays; i++) {
      let fill = i < 10 ? `0${i}` : i;
      const textValue = getValue('#text');
      if (textValue.indexOf('+') > 0) {
        fill = filler();
      } else if (textValue.length > 0) {
        fill = textValue;
      }

      const elem = createElement('td', fill);
      elem.align = 'center';
      elem.className = 'Name';
      elem.onclick = toggleClass;
      elem.ondblclick = addText;
      line.appendChild(elem);
    }

    // Control cells
    const remove = createElement('td', 'remove');
    const left = createElement('td', '<');
    const right = createElement('td', '>');
    remove.onclick = (e) => removeElement.call(remove, e);
    left.onclick = (e) => prevElement.call(left, e);
    right.onclick = (e) => nextElement.call(right, e);
    line.appendChild(remove);
    line.appendChild(left);
    line.appendChild(right);

    table.appendChild(rowFragment);
    main.appendChild(table);
  };

  // Inline table styles for Excel
  const inlineTableStyles = (table) => {
    Array.from(table.rows).forEach((row) => {
      Array.from(row.cells).forEach((cell) => {
        const cs = getComputedStyle(cell);

        if (cs.backgroundColor && cs.backgroundColor !== 'rgba(0, 0, 0, 0)') {
          cell.setAttribute('bgcolor', cs.backgroundColor);
        }

        if (cs.width && cs.width !== 'auto' && cs.width !== '0px') {
          const widthPx = parseInt(cs.width, 10);
          if (!isNaN(widthPx)) {
            cell.setAttribute('width', widthPx);
            cell.style.width = widthPx + 'px';
          }
        }
      });
    });
  };

  // Export table to Excel
  const tableToExcel = (() => {
    const uri = 'data:application/vnd.ms-excel;base64,';
    const template = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
    xmlns:x="urn:schemas-microsoft-com:office:excel"
    xmlns="http://www.w3.org/TR/REC-html40">
    <head>
    <!--[if gte mso 9]>
    <xml>
    <x:ExcelWorkbook>
    <x:ExcelWorksheets>
    <x:ExcelWorksheet>
    <x:Name>{worksheet}</x:Name>
    <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
    </x:ExcelWorksheet>
    </x:ExcelWorksheets>
    </x:ExcelWorkbook>
    </xml>
    <![endif]-->
    <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
    </head>
    <body>
    <table>{table}</table>
    </body>
    </html>`;

    const base64 = (s) => {
      const utf8Bytes = new TextEncoder().encode(s); // UTF-8 bytes
      let binary = '';
      utf8Bytes.forEach((b) => (binary += String.fromCharCode(b)));
      return window.btoa(binary);
    };

    const format = (s, c) => s.replace(/{(\w+)}/g, (m, p) => c[p]);

    return (table, name) => {
      if (!table.nodeType) table = document.getElementById(table);
      inlineTableStyles(table);
      const ctx = { worksheet: name || 'Worksheet', table: table.innerHTML };
      window.location.href = uri + base64(format(template, ctx));
    };
  })();


  document.getElementById('add-text-to-selected').addEventListener('click', addTextToSelected);
  exportToExcel.addEventListener('click', () => tableToExcel('table'));

  addButton.addEventListener('click', () => {
    if (isEmpty('table')) {
      createRow(getValue('#number'), formattedDate);
      inputNumber.disabled = !isEmpty('table');
    } else {
      createRow(getValue('#number'), getValue('#name'));
    }
  });

  // Today's date
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;

  if (main.innerHTML.trim() === '') {
    createRow(getValue('#number'), formattedDate);
  }
})();
