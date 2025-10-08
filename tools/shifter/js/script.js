(function () {
  'use strict'
  const main = document.querySelector('#main')
  const addButton = document.querySelector('#add')
  const exportToExcel = document.querySelector('#export')
  const inputNumber = document.querySelector('#number')

  function toggleClass (e) {
    e.stopPropagation()
    e.preventDefault()
    this.classList.toggle('selected')
  }

  let counter = 0

  function filler (e) {
    const val = getValue('#text')
    const firstNum = val[0]
    const lastNum = val[2]
    counter += Number(firstNum)
    return (counter % firstNum === 0) ? 1 : 0
  }

  function getValue (element) {
    return document.querySelector(element).value
  }

  function isEmpty(el) {
    const element = document.getElementById(el)
    return element.children.length === 0 && element.textContent.trim() === "";
  }

  function removeElement () {
    this.parentElement.remove()
    inputNumber.disabled = !isEmpty('table');
  }

  function addText (e) {
    e.stopPropagation()
    e.preventDefault()
    if (this.innerText.length) this.innerText = ''
    else return this.innerText = getValue('#text')
  }

  function addTextToSelected () {
    const selected = main.querySelectorAll('.selected')
    selected.forEach(element => (element.innerText = getValue('#text')))
  }

  function CreateOneWindow (element, data) {
    this.element = document.createElement(element)
    this.element.innerHTML = data
    return this.element
  }

  const increase = (function () {
    let counter = 0
    return function () { counter += 1; return counter }
  })()

  const getAllDivs = function (e) {
    const [a, ...listOfAll] = e.parentElement.children
    listOfAll.length = listOfAll.length - 3
    return listOfAll
  }

  function nextElement() {
    const elements = getAllDivs(this);
    if (elements.length < 2) return; // No need to rotate if less than 2 elements
  
    const lastText = elements[elements.length - 1].innerText;
  
    // Shift each element's text content to the next one
    for (let i = elements.length - 1; i > 0; i--) {
      elements[i].innerText = elements[i - 1].innerText;
    }
  
    // Move the last element's text to the first
    elements[0].innerText = lastText;
  }
  
  function prevElement() {
    const elements = getAllDivs(this);
    if (elements.length < 2) return;
  
    const firstText = elements[0].innerText;
  
    // Shift each element's text content to the previous one
    for (let i = 0; i < elements.length - 1; i++) {
      elements[i].innerText = elements[i + 1].innerText;
    }
  
    // Move the first element's text to the last
    elements[elements.length - 1].innerText = firstText;
  }

  function capitalize(word) {
    if (!word) return "";
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  function CreateRow (days, name) {
    if (name.length > 0) {
      let table
      if (main.children.length > 0) {
        table = document.getElementsByTagName('table')[0]
      } else {
        table = document.createElement('table')
        table.id = 'table'
        table.setAttribute('cellpadding', '0')
        table.setAttribute('cellspacing', '0')
        table.style.gridTemplateColumns = `repeat(${Number(days) + 4}, minmax(20px, 1fr))`
      }
      this.days = typeof Number(days) === 'number' && days >= 28 && days <= 31 ? Number(days) : 31
      this.row = document.createDocumentFragment()
      this.line = new CreateOneWindow('tr', '')
      this.row.appendChild(this.line)
      const nameElement = new CreateOneWindow('td', capitalize(name))
      nameElement.addEventListener('dblclick', addText.bind(nameElement))
      this.line.appendChild(nameElement)
      for (let i = 1; i <= this.days; i++) {
        let fill = i < 10 ? `0${i}` : i
        if (getValue('#text').indexOf('+') > 0) {
          fill = filler(i)
        } else if (getValue('#text').length > 0) {
          fill = getValue('#text')
        }
        const elem = new CreateOneWindow('td', fill)
        elem.align = 'center'
        elem.className = 'Name'
        elem.onclick = toggleClass.bind(elem)
        elem.ondblclick = addText.bind(elem)
        this.line.appendChild(elem)
      }
      const remove = new CreateOneWindow('td', 'remove')
      const left = new CreateOneWindow('td', '<')
      const right = new CreateOneWindow('td', '>')
      right.onclick = nextElement.bind(right)
      left.onclick = prevElement.bind(left)
      remove.onclick = removeElement.bind(remove)

      this.line.appendChild(remove)
      this.line.appendChild(left)
      this.line.appendChild(right)
      table.appendChild(this.row)
      main.appendChild(table)
    }
  }

  function inlineTableStyles(table) {
    Array.from(table.children).forEach(e => {
      Array.from(e.children).forEach(cell => {
      const cs = getComputedStyle(cell);
      // Background
      // if (['<', '>', 'remove'].includes(cell.textContent.trim())) {
      //   cell.remove();
      // }
      if (cs.backgroundColor && cs.backgroundColor !== "rgba(0, 0, 0, 0)") {
        cell.setAttribute("bgcolor", cs.backgroundColor);
      }

   });  });
  }

  const tableToExcel = (function () {
    const uri = 'data:application/vnd.ms-excel;base64,'
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

    const base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
    const format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p] }) }
    return function (table, name) {
      if (!table.nodeType) table = document.getElementById(table)
      inlineTableStyles(table)
      const ctx = { worksheet: name || 'Worksheet', table: table.innerHTML }

      window.location.href = uri + base64(format(template, ctx))
    }
  })()
  document.getElementById('add-text-to-selected').addEventListener('click', addTextToSelected)
  exportToExcel.addEventListener('click', () => tableToExcel('table'))

  addButton.addEventListener('click', () => {
    if (isEmpty('table')) {
      new CreateRow (getValue('#number'), formattedDate)
      inputNumber.disabled = !isEmpty('table');
    }
  else
     new CreateRow(getValue('#number'), getValue('#name'))

  })

  // Get today's date
  const today = new Date();
  // Format YYYY-MM-DD
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // months start at 0
  const day = String(today.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;

      if (main.innerHTML.trim() === "") {
        new CreateRow (getValue('#number'), formattedDate)
      }

})()
