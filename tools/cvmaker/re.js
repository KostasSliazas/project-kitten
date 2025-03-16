/*jshint esversion: 11 */
/* ECMASCRIPT_2020 */
(function (document) {
  'use strict';
  /**
   * Manages drag-and-drop functionality for draggable elements within a container.
   */
  class DraggableManager {
    /**
     * Creates a DraggableManager instance.
     * @param {string} containerSelector - CSS selector for the container element.
     * @param {string} draggableSelector - CSS selector for the draggable elements.
     */
    constructor(containerSelector, draggableSelector) {
      this.container = document.querySelector(containerSelector);
      this.draggable = Array.from(this.container.querySelectorAll(draggableSelector));
      this.draggedElement = null; // The currently dragged element
    }
    /**
     * Initializes the drag-and-drop functionality by attaching event listeners.
     */
    initialize() {
      this.draggable.forEach(draggable => {
        // Enable drag-and-drop events on each draggable element
        // draggable.setAttribute('draggable', 'true'); // Uncomment if elements aren't draggable by default
        draggable.addEventListener('dragstart', this.handleDragStart.bind(this));
        draggable.addEventListener('dragover', this.handleDragOver.bind(this));
        draggable.addEventListener('drop', this.handleDrop.bind(this));
      });
    }
    /**
     * Handles the drag start event.
     * @param {DragEvent} event - The dragstart event.
     */
    handleDragStart(event) {
      this.draggedElement = event.target; // Store reference to the element being dragged
      event.dataTransfer.setData('text/plain', ''); // Required for Firefox compatibility
    }
    /**
     * Handles the drag over event.
     * @param {DragEvent} event - The dragover event.
     */
    handleDragOver(event) {
      event.preventDefault(); // Allow dropping by preventing the default behavior
    }
    /**
     * Handles the drop event, swaps elements, and updates the DOM.
     * @param {DragEvent} event - The drop event.
     */
    handleDrop(event) {
      const targetElement = event.currentTarget; // The element on which the drop occurred

      // Ensure there's a valid dragged element and avoid dropping on itself
      if (this.draggedElement && this.draggedElement !== targetElement && this.draggedElement.tagName === 'DIV') {
        const targetIndex = this.draggable.indexOf(targetElement); // Get index of the drop target
        const draggedIndex = this.draggable.indexOf(this.draggedElement); // Get index of the dragged element

        // Swap elements in the array to maintain logical order
        [this.draggable[draggedIndex], this.draggable[targetIndex]] = [this.draggable[targetIndex], this.draggable[draggedIndex]];

        // Update the visual order of the draggable elements in the container
        this.container.innerHTML = ''; // Clear the container
        this.draggable.forEach(draggable => this.container.appendChild(draggable)); // Re-append in new order
      }
    }
  }
  // Initialize DraggableManager
  const draggableManager = new DraggableManager('#cv', '.section');
  draggableManager.initialize();

  /**
   * Helper function to create an HTML element with optional text and attributes.
   * @param {string} tag - The tag name of the HTML element (e.g., 'div', 'span').
   * @param {string} [text=''] - The text content to be set for the element (optional).
   * @param {Object} [attributes={}] - An optional object of key-value pairs for setting element attributes.
   * @returns {HTMLElement} The created HTML element.
   */
  function createHTMLElement(tag, text = '', attributes = {}) {
    // Create the HTML element using the provided tag name
    const element = document.createElement(tag);

    // If text is provided, set the text content of the element
    if (text) {
      element.textContent = text;
    }

    // If attributes are provided and is an object, loop through and set them
    if (attributes && typeof attributes === 'object') {
      Object.entries(attributes).forEach(([key, value]) => {
        // Set each attribute on the element
        element.setAttribute(key, value);
      });
    }

    // Return the created element
    return element;
  }

  // Initialize elements if the stylesheet is not already added
  if (!document.getElementById('style')) {
    // Get the <head> element of the document
    const head = document.getElementsByTagName('head')[0];

    // Create a <link> element for the stylesheet
    const link = document.createElement('link');

    // Set attributes for the <link> element
    link.id = 'style'; // Unique ID for the link element
    link.rel = 'stylesheet'; // Set the relation to 'stylesheet'
    link.type = 'text/css'; // Specify the type of the linked file
    link.href = 'style.css?v=2'; // Path to the CSS file (with versioning query parameter)
    link.media = 'all'; // The stylesheet applies to all media types
    link.className = 'remove'; // Class name for possible future removal/styling

    // Append the <link> element to the <head> of the document
    head.appendChild(link);

    // Disable the context menu (right-click) on the document
    document.oncontextmenu = function () {
      return false; // Prevent default context menu
    };
  }

  // Initialize the body and select the first '.section' element
  const body = document.body;

  // create buton wraper div
  const buttonsWrap = {
    class: 'fixe remove r',
    href: '#',
  };

  // Create div for buttons place
  const wraper = createHTMLElement('div', '', buttonsWrap);
  body.prepend(wraper);

  // Create default class for buttons
  const classButtons = 'save border-solid shd';

  // Button configuration for 'close' button in blocks
  const button = {
    class: classButtons,
    href: '#',
    id: 'close',
  };

  // Prepend 'close' button to the first block
  const infoButton = createHTMLElement('button', 'about', button);
  wraper.appendChild(infoButton);

  // Create and configure the 'Save CV' button
  const saveCV = 'Save HTML';
  const buttonSave = {
    class: classButtons,
    href: '#',
  };
  // Create 'Save CV' button and append to the body
  const elms = createHTMLElement('button', saveCV, buttonSave);
  wraper.appendChild(elms);
  elms.onclick = html; // Attach click event for saving

    // Create and configure the 'Save JSON' button
  const saveJSON = 'Save JSON';
  const buttonJSON = {
    class: classButtons,
    href: '#',
  };

  // Create 'Save CV' button and append to the body
  const jsonButton = createHTMLElement('button', saveJSON, buttonJSON);
  wraper.appendChild(jsonButton);
  jsonButton.onclick = json; // Attach click event for saving

  // Create 'info' div and its children for additional information display
  const infoDiv = createHTMLElement('div', '', {
    id: 'info',
    class: 'remove',
    style: 'display:none', // Initially hidden
  });
  const infoContent = createHTMLElement('div', '', { id: 'info-content' });
  const spanElement = createHTMLElement('span', 'CLOSE', {
    class: 'btn border-solid shd',
  });
  infoContent.appendChild(spanElement);

  // Info text content explaining user instructions
  const infoTextContent = `Please do not close this window until your work is saved, as no information is stored in the database. To save your text, simply press 'Enter' after editing. You can change the language level by double-clicking with your mouse. For the best experience, please ensure your photo is sized at 100x128 pixels. To optimize loading times, reduce the file size of your photo as much as possible. You can rearrange blocks by dragging.`;
  const infoTextDiv = createHTMLElement('div', infoTextContent, {
    id: 'info-text',
  });
  // Append the info content to the infoDiv and insert at the beginning of the body
  infoDiv.appendChild(infoContent);
  infoDiv.appendChild(infoTextDiv);
  body.insertBefore(infoDiv, body.firstChild);

  // Add 'minus' and 'plus' buttons to other blocks for manipulation
  const elem = document.querySelectorAll('.section');
  const buttonPlus = {
    href: '#',
  };

  elem.forEach((e, i) => {
    if (i > 0) {
      // 'minus' button
      buttonPlus.class = 'remove shd border-solid wbg w24 rem';
      e.appendChild(createHTMLElement('button', '-', buttonPlus));

      // 'plus' button
      buttonPlus.class += 'remove shd border-solid wbg w24 add';
      e.appendChild(createHTMLElement('button', '+', buttonPlus));
    }
  });

  // Create the fake file input button for file selection
  const fakeButtonHtml = createHTMLElement('div', 'Select File', {
    id: 'fake-button',
    class: 'remove border-solid',
  });
  const fileInput = createHTMLElement('input', '', {
    id: 'image-file',
    name: 'image-file',
    type: 'file',
  });
  fileInput.onchange = fileSelected; // Handle file change event
  fakeButtonHtml.appendChild(fileInput);

  // Create and configure the 'Import JSON' button
  const importButtonText = 'Import JSON';
  const importButtonConfig = {
    class: 'import border-solid shd remove',
    id: 'importButton',
  };

  // Create the hidden file input for JSON files
  const fileInputConfig = {
    type: 'file',
    id: 'fileInput',
    accept: '.json',
    style: 'display: none;', // Hidden input field
    class: 'remove',
  };

  // Create the "Import JSON" button and hidden file input
  const importButton = createHTMLElement('button', importButtonText, importButtonConfig);
  const fileJSONInput = createHTMLElement('input', '', fileInputConfig);

  // Append both the import button and file input to the body
  wraper.appendChild(importButton);
  body.appendChild(fileJSONInput);

  // HTML structure for the upload form with several hidden fields and progress info
  const uploadFormHtml = `
  <div id="dele" class="remove">
    <form action="" enctype="multipart/form-data" id="upload_form" method="post" name="upload_form">
      <div id="fileinfo">
        <div id="file-name"></div>
        <div id="file-size"></div>
        <div id="file-type"></div>
        <div id="file-dimensions"></div>
      </div>
      <div id="error">File not supported! bmp, gif, jpeg, png, tiff</div>
      <div id="error2">An error occurred while uploading the file</div>
      <div id="abort">The upload has been canceled</div>
      <div id="warn-size">The file is too large.</div>
      <div id="progress_info">
        <div id="progress"></div>
        <div id="progress_percent">&nbsp;</div>
        <div class="clear_both"></div>
        <div>
          <div id="speed">&nbsp;</div>
          <div id="remaining">&nbsp;</div>
          <div id="b_transferred">&nbsp;</div>
          <div class="clear_both"></div>
        </div>
        <div id="upload_response"></div>
      </div>
    </form>
  </div>
`;

  // Insert the upload form HTML in the header
  document.getElementById('header').insertAdjacentHTML('afterbegin', uploadFormHtml);

  // Add the file selection button to the photo section
  const heading = document.getElementById('he');
  const preview = document.getElementById('preview');
  const photo = document.getElementById('photo');
  photo.appendChild(fakeButtonHtml);

  // Add click event listener to toggle the visibility of the 'info' div
  document.querySelectorAll('#close, #info-content').forEach(function (element) {
    element.addEventListener('click', function (e) {
      e.preventDefault();
      // Toggle the display of the info div
      infoDiv.style.display = infoDiv.style.display === 'none' ? '' : 'none';
    });
  });

  /**
   * Helper function to create a link element based on input value and its id.
   * @param {HTMLInputElement} input - The input element containing the value to be used for the link.
   * @returns {HTMLAnchorElement} The created <a> tag with the appropriate href and text.
   */
  const createLink = input => {
    let href = '';

    // Check the input's id to determine the type of link to create
    if (input.id === 'email') {
      // For email input, create a 'mailto' link
      href = `mailto:${input.value.replace(/\s+/g, '')}`;
    } else if (input.id === 'number') {
      // For phone number input, create a 'tel' link
      href = `tel:${input.value.replace(/\s+/g, '')}`;
    } else if (input.id === 'url') {
      // For URL input, check if the value starts with 'http://' or 'https://'
      if (/^https?:\/\//.test(input.value)) {
        // If the input already contains a valid URL with 'http://' or 'https://', use it as is
        href = input.value;
      } else {
        // Otherwise, prepend 'http://' to the value
        href = `http://${input.value}`;
      }
    } else if (input.value && /https?:\/\//.test(input.value)) {
      // For any input value that matches a simple URL pattern (http/https)
      href = input.value;
    }

    // Create the <a> tag with the constructed href
    const link = document.createElement('a');
    link.href = href; // Set the href attribute of the <a> tag
    link.textContent = input.value; // Set the visible text of the link to the input value
    link.target = '_blank'; // Ensure the link opens in a new tab
    link.rel = 'noopener noreferrer nofollow'; // Apply safe and nofollow attributes for security

    // Return the created <a> element
    return link;
  };

  /**
   * Function to replace an input element with a heading (h2 or h3) and preserve its class, id, and value.
   * @param {HTMLInputElement} input - The input element to be replaced.
   * @param {string} tagName - The tag name of the heading (either 'h2' or 'h3').
   * @returns {HTMLElement} The newly created heading element (h2 or h3).
   */
  function replaceElementWithHeading(input, tagName) {
    // Create a new heading element (either h2 or h3)
    const heading = document.createElement(tagName);

    // Preserve the class and id attributes from the input element (if they exist)
    if (input.className) heading.setAttribute('class', input.className); // Preserve class on the heading
    if (input.id) heading.setAttribute('id', input.id); // Preserve id on the heading

    // Set the text content of the heading from the input value (trim any surrounding whitespace)
    if (input.value) heading.textContent = input.value.trim();

    // Replace the input element with the newly created heading
    input.parentNode.replaceChild(heading, input);

    // Return the newly created heading element
    return heading;
  }

  /**
   * Function to process form inputs and replace certain elements with headings or links.
   * It updates the document title with the name value and replaces text inputs with h2 or h3 headings.
   * It also handles the creation of links for email, phone number, and URLs.
   */
  function outs() {
    // Select all 'select' elements and 'input' elements excluding the file input
    const cvInputs = document.querySelectorAll('select, input:not(#image-file)');

    // Select the element with the ID 'name' for title and heading updates
    const nameElement = document.querySelector('#name');

    // If the name element exists, update the document title and heading
    if (nameElement) {
      // Get the name from the input's value or text content
      const name = nameElement.value || nameElement.textContent;

      // Update the document's title to the name
      document.title = name;

      // Update the heading element's text content with the name
      heading.children[0].textContent = name;

      // Optionally, you can save the data to localStorage (commented out)
      // localStorage.setItem(nameElement.innerText.replace(/\s+/g, ''), JSON.stringify(jsonData));
    }

    // Iterate over each input or select element
    cvInputs.forEach(input => {
      let tagName = input.classList.contains('left') ? 'h2' : 'h3'; // Decide whether to use h2 or h3 based on class

      // Handle text input elements
      if (input.tagName === 'INPUT' && input.type === 'text') {
        // Replace the text input with a heading (h2 or h3)
        const newElement = replaceElementWithHeading(input, tagName);

        // If the input is an email or number, replace it with a link
        if (input.id === 'email' || input.id === 'number') {
          newElement.innerHTML = ''; // Clear any existing content in the heading
          newElement.appendChild(createLink(input)); // Add a link inside the heading
        }
        // If the input is a URL (http/https), create a regular link
        else if (input.id === 'url' || (input.value && /https?:\/\//.test(input.value))) {
          newElement.innerHTML = ''; // Clear existing content
          newElement.appendChild(createLink(input)); // Append the link inside the heading
        }
      }

      // Handle select elements by replacing them with the selected option's value
      else if (input.tagName === 'SELECT') {
        input.parentElement.innerText = input.options[input.selectedIndex].value; // Set parent element's text to selected option
      }
    });
  }

  // let oTimer = 0;
  //let iBytesUploaded = 0;
  //let iBytesTotal = 0;
  //let iPreviousBytesLoaded = 0;
  const iMaxFilesize = 1048576;
  let sResultFileSize = '';

  /*  function secondsToTime(secs) {
    let hr = Math.floor(secs / 3600);
    let min = Math.floor((secs - hr * 3600) / 60);
    let sec = Math.floor(secs - hr * 3600 - min * 60);
    if (hr < 10) {
      hr = '0' + hr;
    }
    if (min < 10) {
      min = '0' + min;
    }
    if (sec < 10) {
      sec = '0' + sec;
    }
    if (hr) {
      hr = '00';
    }
    return hr + ':' + min + ':' + sec;
  }*/

  const fileinfo = document.getElementById('fileinfo');
  const upload_response = document.getElementById('upload_response');
  const error = document.getElementById('error');
  const error2 = document.getElementById('error2');
  const abort = document.getElementById('abort');
  const warnSize = document.getElementById('warn-size');

  function bytesToSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB'];
    if (bytes === 0) return 'n/a';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
  }

  function fileSelected() {
    fileinfo.style.display = 'none';
    upload_response.style.display = 'none';
    error.style.display = 'none';
    error2.style.display = 'none';
    abort.style.display = 'none';
    warnSize.style.display = 'none';
    const oFile = document.getElementById('image-file').files[0];
    const rFilter = /^(image\/bmp|image\/gif|image\/jpeg|image\/png|image\/tiff)$/i;
    if (!rFilter.test(oFile.type)) {
      error.style.display = 'block';
      return;
    }
    if (oFile.size > iMaxFilesize) {
      warnSize.style.display = 'block';
      return;
    }
    const oImage = document.getElementById('preview');
    const oReader = new FileReader();
    oReader.onload = function (e) {
      oImage.src = e.target.result;
      oImage.onload = function () {
        sResultFileSize = bytesToSize(oFile.size);
        fileinfo.style.display = 'block';
        document.getElementById('file-name').innerHTML = 'Name: ' + oFile.name;
        document.getElementById('file-size').innerHTML = 'Size: ' + sResultFileSize;
        document.getElementById('file-type').innerHTML = 'Type: ' + oFile.type;
        document.getElementById('file-dimensions').innerHTML = 'Dimension: ' + oImage.naturalWidth + ' x ' + oImage.naturalHeight;
      };
    };
    oReader.readAsDataURL(oFile);
  }

  /*  function startUploading() {
      iPreviousBytesLoaded = 0;
      document.getElementById('upload_response').style.display = 'none';
      document.getElementById('error').style.display = 'none';
      document.getElementById('error2').style.display = 'none';
      document.getElementById('abort').style.display = 'none';
      document.getElementById('warn-size').style.display = 'none';
      document.getElementById('progress_percent').innerHTML = '';
      const oProgress = document.getElementById('progress');
      oProgress.style.display = 'block';
      oProgress.style.width = '0px';
      const vFD = new FormData(document.getElementById('upload_form'));
      const oXHR = new XMLHttpRequest();
      oXHR.upload.addEventListener('progress', uploadProgress, !1);
      oXHR.addEventListener('load', uploadFinish, !1);
      oXHR.addEventListener('error', uploadError, !1);
      oXHR.addEventListener('abort', uploadAbort, !1);
      oXHR.open('POST', 'upload.php');
      oXHR.send(vFD);
      oTimer = setInterval(doInnerUpdates, 300);
    } */
  /*
  function doInnerUpdates() {
    const iCB = iBytesUploaded;
    let iDiff = iCB - iPreviousBytesLoaded;
    if (iDiff === 0) return;
    iPreviousBytesLoaded = iCB;
    iDiff = iDiff * 2;
    const iBytesRem = iBytesTotal - iPreviousBytesLoaded;
    const secondsRemaining = iBytesRem / iDiff;
    let iSpeed = iDiff.toString() + 'B/s';
    if (iDiff > 1024 * 1024) {
      iSpeed =
        (Math.round((iDiff * 100) / (1024 * 1024)) / 100).toString() + 'MB/s';
    } else if (iDiff > 1024) {
      iSpeed = (Math.round((iDiff * 100) / 1024) / 100).toString() + 'KB/s';
    }
    document.getElementById('speed').innerHTML = iSpeed;
    document.getElementById('remaining').innerHTML =
      '| ' + secondsToTime(secondsRemaining);
  }

function uploadProgress(e) {
    if (e.lengthComputable) {
      iBytesUploaded = e.loaded;
      iBytesTotal = e.total;
      const iPercentComplete = Math.round((e.loaded * 100) / e.total);
      const iBytesTransferred = bytesToSize(iBytesUploaded);
      document.getElementById('progress_percent').innerHTML =
        iPercentComplete.toString() + '%';
      document.getElementById('progress').style.width =
        (iPercentComplete * 4).toString() + 'px';
      document.getElementById('b_transferred').innerHTML = iBytesTransferred;
      if (iPercentComplete === 100) {
        const oUploadResponse = document.getElementById('upload_response');
        oUploadResponse.innerHTML = '<h1>Please wait...processing</h1>';
        oUploadResponse.style.display = 'block';
      }
    } else {
      document.getElementById('progress').innerHTML = 'unable to compute';
    }
  }

	function uploadFinish(e) {
    const oUploadResponse = document.getElementById('upload_response');
    oUploadResponse.innerHTML = e.target.responseText;
    oUploadResponse.style.display = 'block';
    document.getElementById('progress_percent').innerHTML = '100%';
    document.getElementById('progress').style.width = '400px';
    document.getElementById('file-size').innerHTML = sResultFileSize;
    document.getElementById('remaining').innerHTML = '| 00:00:00';
    clearInterval(oTimer);
  }

  function uploadError(e) {
    document.getElementById('error2').style.display = 'block';
    clearInterval(oTimer);
  }

  function uploadAbort(e) {
    document.getElementById('abort').style.display = 'block';
    clearInterval(oTimer);
  } */

  /**
   * Function to dynamically generate a title based on the given key and parent section.
   * It uses a set of mappings for different sections (e.g., basics, education, work) and returns a capitalized title.
   *
   * @param {string} key - The specific key for the item (e.g., 'name', 'email').
   * @param {string} parent - The section that the key belongs to (e.g., 'basics', 'education').
   * @returns {string} The dynamic title based on the key and parent.
   */
  const getDynamicTitle = (key, parent) => {
    // Convert key or parent to lowercase for consistent handling (if either is undefined, use the other)
    const text = key || parent;

    // Mappings for specific sections with titles for keys
    const sections = {
      basics: {
        name: 'Name / Surname',
        label: 'Profession Field',
        email: 'Email Address',
        phone: 'Phone Number',
        url: 'Homepage',
        website: 'Website',
        summary: 'Summary',
        default: 'Personal Details',
      },
      education: {
        area: 'Key Subjects / Professional Skills',
        studyType: 'Qualification',
        institution: 'Institution Name',
        score: 'Qualification Level',
        url: "Institution's Homepage",
        default: 'Education',
      },
      work: {
        website: "Employer's Homepage",
        location: 'Employer Address',
        name: 'Employer Name',
        position: 'Profession or Position',
        url: "Employer's Homepage",
        summary: 'Main Activities and Responsibilities',
        highlights: 'Key Achievements',
        default: 'Work Experience',
      },
      skills: {
        name: 'Skill Name',
        level: 'Skill Level',
        keywords: 'Skill Keywords',
        default: 'Skills',
      },
      languages: {
        language: 'Language',
        fluency: 'Fluency Level',
        default: 'Languages',
      },
      projects: {
        name: 'Project Name',
        description: 'Project Description',
        startDate: 'Start Date',
        endDate: 'End Date',
        highlights: 'Key Highlights',
        url: 'Project URL',
        default: 'Projects',
      },
      awards: {
        title: 'Award Title',
        date: 'Award Date',
        awarder: 'Awarder',
        summary: 'Award Summary',
        default: 'Awards',
      },
      certificates: {
        name: 'Certificate Name',
        date: 'Date Issued',
        issuer: 'Issued By',
        url: 'Certificate URL',
        default: 'Certificates',
      },
    };

    // Defaults for sections outside the main ones
    const defaults = {
      url: 'Webpage',
      network: 'Online Presence',
    };

    // Retrieve the title based on the section and key
    const sectionTitles = sections[parent];
    const result = sectionTitles ? sectionTitles[key] || sectionTitles.default : defaults[text] || text;

    // Capitalize the first letter of the resulting text and return it
    return result.charAt(0).toUpperCase() + result.slice(1);
  };

  /**
   * Function to loop through the top-level keys of an object and apply a handler to each key-value pair.
   *
   * @param {Object} obj - The object whose top-level keys and values will be processed.
   * @param {Function} handlers - A function to process each key-value pair. It should accept the key and value as parameters and return a result.
   * @returns {Array} An array containing the results of applying the handler to each key-value pair.
   */
  function getTopLevelKeys(obj, handlers) {
    const result = []; // Initialize an empty array to store the processed data

    // Return an empty array if the provided object is not a valid object
    if (typeof obj !== 'object' || obj === null) {
      return result;
    }

    // Loop through all top-level keys of the object
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        // Ensure the key belongs to the object, not its prototype
        const data = handlers(key, obj[key]); // Call the handler function with key and value
        result.push(data); // Add the result of the handler to the result array
      }
    }

    return result; // Return the array of processed key-value pairs
  }

  /**
   * Function to join nested arrays and objects into a single string.
   *
   * @param {any} input - The input can be a primitive value, an array, or an object.
   * @returns {string} A string representing the joined data, with nested structures flattened into a single string.
   */
  function joinData(input) {
    if (Array.isArray(input)) {
      // If it's an array, recursively join each element and then join the array elements with a comma
      return input.map(item => joinData(item)).join(', ');
    } else if (typeof input === 'object' && input !== null) {
      // If it's an object, recursively join each key-value pair with "key: value" format
      return Object.entries(input)
        .map(([key, value]) => `${key}: ${joinData(value)}`) // Join key-value pairs
        .join(', '); // Join all pairs with a comma
    } else {
      // For primitive values (e.g., string, number, boolean), convert them to a string
      return String(input);
    }
  }

  /**
   * Handles dynamic creation of HTML elements based on data passed.
   * It processes each top-level key-value pair, skipping certain keys (e.g., 'meta'),
   * and recursively processes nested structures like arrays or objects.
   *
   * @param {string} key - The key of the current section being processed (e.g., 'basics', 'education').
   * @param {Object|Array|string|number|boolean} value - The value associated with the key. Can be an object, array, or primitive value.
   *
   * @returns {void}
   * This function does not return a value. It directly modifies the DOM by appending generated HTML elements.
   *
   * @example
   * const data = { basics: { name: 'John Doe', email: 'johndoe@example.com' } };
   * handlers('basics', data.basics);
   * // This will create and append HTML elements like <div class="section">...</div> to the DOM.
   */
  function handlers(key, value) {
    if (value.length === 0 || key === 'meta') {
      return; // Skip 'meta' key or empty array (all block)
    }

    const blockDiv = createHTMLElement('div', '', {
      class: 'section',
      draggable: 'true',
    });
    const section = createHTMLElement('section');
    section.appendChild(
      createHTMLElement('h2', getDynamicTitle('', key), {
        class: 'left num hm bold',
      })
    );
    blockDiv.appendChild(section);
    const dateTracker = createDateTracker(); // Create once for the whole object

    // Recursive function to loop through objects or arrays
    const loopObjectOrArray = (value, parentKey) => {
      // Create a container for nested structures

      const inner = createHTMLElement('div', '', { class: key });

      if (Array.isArray(value)) {
        // Handle arrays
        value.forEach(item => loopObjectOrArray(item, parentKey));
        return;
      }

      if (typeof value === 'object' && value !== null) {
        // Iterate through object keys
        for (const subKey in value) {
          if (value.hasOwnProperty(subKey)) {
            const subValue = value[subKey];

            if (subKey === 'image') {
              preview.src = subValue;
              continue; // Skip 'image' key
            }

            // Handle non-date key-value pairs
            const title = getDynamicTitle(subKey, parentKey);
            const pairSection = createHTMLElement('section');

            if (typeof subValue === 'object' && subValue !== null) {
              if (subValue.length && subKey !== 'profiles') {
                let combinedData = joinData(JSON.parse(JSON.stringify(subValue)));
                pairSection.appendChild(
                  createHTMLElement('h2', subKey, {
                    class: 'left',
                  })
                );
                pairSection.appendChild(
                  createHTMLElement('h3', combinedData, {
                    class: 'right',
                  })
                );
                inner.appendChild(pairSection);
                blockDiv.appendChild(inner);
                continue;
              }
              // Recursive call for nested structures
              loopObjectOrArray(subValue, subKey);
            } else {
              // Handle primitive values
              if (subKey === 'startDate' || subKey === 'endDate') {
                const date = dateTracker(String(subValue), subKey);
                if (date) {
                  const dateSection = createHTMLElement('section');
                  dateSection.appendChild(
                    createHTMLElement('h2', 'Dates', {
                      class: 'left',
                    })
                  );

                  dateSection.appendChild(
                    createHTMLElement('h3', date, {
                      class: 'right',
                    })
                  );
                  inner.appendChild(dateSection);
                }
                continue;
              }

              const boldFields = ['name', 'email', 'phone']; // These fields should be bolded

              const object = {
                class: 'right',
              };
              if (boldFields.includes(subKey)) {
                object.class += ' bold'; // Add 'bold' to the existing class string if in boldFields
              } else {
                object.class = object.class.replace(' bold', ''); // Remove 'bold' class if not in boldFields
              }
              // working with custom top values
              if (parentKey === 'basics') {
                object.id = subKey;

                if (subKey === 'name') {
                  document.title = subValue;
                }
              }

              pairSection.appendChild(
                createHTMLElement('h2', title, {
                  class: 'left',
                })
              );
              pairSection.appendChild(createHTMLElement('h3', subValue, object));
              inner.appendChild(pairSection);
              blockDiv.appendChild(inner); // Append inner block to main block
            }
          }
        }
      }
    };

    // Start recursive processing
    loopObjectOrArray(value, key);

    // Append the completed block to the container
    const container = document.getElementById('cv');
    container.appendChild(blockDiv);
  }

  /**
   * Generates and appends HTML content to the DOM based on the provided JSON data.
   * This function clears the current content inside the container and then processes the data
   * to generate dynamic HTML elements according to the structure of the JSON object.
   * It relies on the `getTopLevelKeys` function and the `handlers` function for processing the data.
   *
   * @param {Object} data - The JSON object containing the data to generate HTML from.
   * The structure of the data is expected to have top-level keys representing different sections
   * (e.g., "basics", "education", "work", etc.), each containing nested data.
   *
   * @returns {void}
   * This function does not return a value. It directly modifies the DOM by clearing the
   * existing content and appending the newly generated HTML elements.
   *
   * @example
   * const jsonData = {
   *   basics: {
   *     name: 'John Doe',
   *     email: 'johndoe@example.com',
   *     phone: '123-456-7890',
   *   },
   *   education: {
   *     institution: 'University of Example',
   *     qualification: 'Bachelor of Example Studies',
   *   },
   * };
   * generateHTMLFromJson(jsonData);
   * // This will clear the current content and generate HTML from the provided `jsonData`.
   */
  function generateHTMLFromJson(data) {
    const container = document.getElementById('cv');
    container.innerHTML = ''; // Clear existing content
    getTopLevelKeys(data, handlers); // Generate HTML based on the data
  }

  /**
   * Creates a date tracker that can track date ranges (start and end dates).
   * This function returns a closure that can be used to record start and end dates,
   * pairing them together when appropriate, and handling cases where an end date
   * is provided before the start date.
   *
   * It stores unpaired start dates until an end date is provided, then pairs them together.
   * If an end date is provided without a matching start date, it temporarily holds the end date
   * until the corresponding start date is given.
   *
   * @returns {function} The date tracker function. This function takes two parameters:
   *   `date` (the date to be recorded) and `type` (either 'startDate' or 'endDate').
   *   It returns the formatted date range if both start and end dates are paired,
   *   or null if a complete date range is not yet formed.
   *
   * @example
   * const dateTracker = createDateTracker();
   * const startDate = dateTracker('2024-01-01', 'startDate'); // No pair, returns null
   * const endDate = dateTracker('2024-12-31', 'endDate'); // Pairs with startDate, returns "2024-01-01 — 2024-12-31"
   *
   * const startDate2 = dateTracker('2025-01-01', 'startDate'); // No pair, returns null
   * const endDate2 = dateTracker('2025-12-31', 'endDate'); // Pairs with startDate2, returns "2025-01-01 — 2025-12-31"
   */
  function createDateTracker() {
    let pendingEndDate = null; // To hold an endDate if given before a startDate
    const dateRanges = []; // To track complete start and end date pairs

    return function (date, type) {
      if (type === 'startDate') {
        // If there's a pending endDate, create a pair immediately
        if (pendingEndDate) {
          const range = {
            startDate: date,
            endDate: pendingEndDate,
          };
          dateRanges.push(range);
          pendingEndDate = null; // Clear pending endDate
          return `${range.startDate} — ${range.endDate}`; // Return the pair
        }

        // Otherwise, start a new range
        dateRanges.push({
          startDate: date,
          endDate: null,
        });
        return null; // No complete pair to return yet
      }

      if (type === 'endDate') {
        // Find the last unpaired range with a startDate
        const lastRange = dateRanges.find(range => range.startDate && !range.endDate);

        if (lastRange) {
          // Pair this endDate with the unpaired startDate
          lastRange.endDate = date;
          return `${lastRange.startDate} — ${lastRange.endDate}`; // Return the pair
        } else {
          // No unpaired startDate, store the endDate temporarily
          pendingEndDate = date;
          return null; // Wait for a matching startDate
        }
      }

      // If input is invalid, return null
      return null;
    };
  }

  /**
   * Event listener for the "Import" button. Triggers the file input's click event
   * when the "Import" button is clicked, allowing the user to select a file.
   */
  document.getElementById('importButton').addEventListener('click', () => {
    document.getElementById('fileInput').click(); // Trigger file input on button click
  });

  /**
   * Event listener for the file input change event. This function is triggered
   * when a user selects a file. It reads the file content, attempts to parse it as JSON,
   * and then generates HTML from the parsed JSON data.
   *
   * @param {Event} event - The change event from the file input.
   */
  document.getElementById('fileInput').addEventListener('change', function (event) {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      const reader = new FileReader(); // Create a new FileReader to read the file
      reader.onload = function (e) {
        try {
          const jsonData = JSON.parse(e.target.result); // Parse the JSON file content
          generateHTMLFromJson(jsonData); // Generate HTML from JSON
        } catch (err) {
          alert('Invalid JSON file'); // Notify user if the JSON is invalid
          console.error('Error parsing JSON:', err); // Log the error for debugging
        }
      };
      reader.readAsText(file); // Read the file content as text
    }
  });

  /**
   * The main data structure representing a user's profile, including their personal
   * details, work experience, education, skills, and more. This structure is intended
   * to be populated with specific data and used to generate HTML content dynamically.
   *
   * @typedef {Object} JsonData
   * @property {Object} basics - Contains the basic information of the user.
   * @property {string} basics.name - The user's name.
   * @property {string} basics.label - The user's professional title or role.
   * @property {string} basics.image - The URL of the user's profile image.
   * @property {string} basics.email - The user's email address.
   * @property {string} basics.phone - The user's phone number.
   * @property {string} basics.url - The user's personal or professional website URL.
   * @property {string} basics.summary - A brief summary or description of the user.
   * @property {Object} basics.location - The user's location details.
   * @property {string} basics.location.address - The user's address.
   * @property {string} basics.location.postalCode - The postal code of the user's location.
   * @property {string} basics.location.city - The city of the user's location.
   * @property {string} basics.location.countryCode - The country code of the user's location.
   * @property {string} basics.location.region - The region or state of the user's location.
   * @property {Array} basics.profiles - A list of the user's social or professional profiles (e.g., LinkedIn, GitHub).
   * @property {Array} work - An array of the user's work experience.
   * @property {Array} volunteer - An array of the user's volunteer experiences.
   * @property {Array} education - An array of the user's educational history.
   * @property {Array} awards - An array of the user's awards and recognitions.
   * @property {Array} certificates - An array of certificates earned by the user.
   * @property {Array} publications - An array of the user's publications or articles.
   * @property {Array} skills - An array of the user's professional skills.
   * @property {Array} languages - An array of languages spoken by the user.
   * @property {Array} interests - An array of the user's personal interests.
   * @property {Array} references - An array of references or recommendations.
   * @property {Array} projects - An array of the user's projects.
   */

  /**
   * Example of the `jsonData` object containing the user's personal information.
   * It includes categories such as basics, work, education, skills, and more.
   * The values for each field are initially set as empty strings or empty arrays.
   * This object is used as a template for populating and generating HTML content.
   *
   * @type {JsonData}
   */
  const jsonData = {
    basics: {
      name: '',
      label: '',
      image: '',
      email: '',
      phone: '',
      url: '',
      summary: '',
      location: {
        address: '',
        postalCode: '',
        city: '',
        countryCode: '',
        region: '',
      },
      profiles: [],
    },
    work: [],
    volunteer: [],
    education: [],
    awards: [],
    certificates: [],
    publications: [],
    skills: [],
    languages: [],
    interests: [],
    references: [],
    projects: [],
  };

  /**
   * Extracts the basic personal information (name, email, phone, etc.)
   * from the HTML document and populates the `jsonData.basics` object.
   */
  function extractBasics() {
    const label = document?.getElementById('label')?.textContent.trim() || null;
    const name = document?.getElementById('name')?.textContent.trim() || null;
    const email = document?.getElementById('email')?.getElementsByTagName('a')[0]?.textContent.replace(/\s+/g, '') || null;
    const phone = document?.getElementById('number')?.getElementsByTagName('a')[0]?.textContent.replace(/\s+/g, '') || null;
    const address = document?.getElementById('address')?.textContent.trim() || null;
    const image = document?.getElementById('preview')?.src || null;
    const url = document?.getElementById('url').getElementsByTagName('a')[0]?.href.trim() || null;
    const postalCode = document?.getElementById('postal-code')?.textContent.trim() || null;
    const city = document?.getElementById('city')?.textContent.trim() || null;
    const countryCode = document?.getElementById('country-code')?.textContent.trim() || null;
    const region = document?.getElementById('region')?.textContent.trim() || null;
    const summary = document?.getElementById('summary')?.textContent.trim() || null;

    // Only add the fields if they exist
    if (name) jsonData.basics.name = name;
    if (label) jsonData.basics.label = label;
    if (image) jsonData.basics.image = image;
    if (email) jsonData.basics.email = email;
    if (phone) jsonData.basics.phone = phone;
    if (url) jsonData.basics.url = url;
    if (summary) jsonData.basics.summary = summary;

    // Handling location
    if (address || city) {
      jsonData.basics.location = {};
      if (address) jsonData.basics.location.address = address;
      if (postalCode) jsonData.basics.location.postalCode = postalCode;
      if (city) jsonData.basics.location.city = city;
      if (countryCode) jsonData.basics.location.countryCode = countryCode;
      if (region) jsonData.basics.location.region = region;
    }
  }

  /**
   * Extracts work experience data from the document and populates the `jsonData.work` array.
   */
  function extractWorkExperience() {
    const workElements = [...document.getElementsByClassName('work')];

    workElements.forEach(work => {
      let workExperience = {};
      const dateStart = work?.getElementsByTagName('h3')[0]?.textContent.trim() || null;
      const dateEnd = work?.getElementsByTagName('h3')[1]?.textContent.trim() || null;
      const position = work?.getElementsByTagName('h3')[2]?.textContent.trim() || null;
      const name = work?.getElementsByTagName('h3')[4]?.textContent.trim() || null;
      const highlights = work?.getElementsByTagName('h3')[5]?.textContent.trim() || null;
      const summary = work?.getElementsByTagName('h3')[3]?.textContent.trim() || null;
      const url = work?.getElementsByTagName('h3')[6]?.getElementsByTagName('a')[0]?.href || null;

      // Only add fields if they exist
      if (name) workExperience.name = name;
      if (position) workExperience.position = position;
      if (url) workExperience.url = url;
      if (dateStart) workExperience.startDate = matchAndConvert(dateStart);
      if (dateEnd) workExperience.endDate = matchAndConvert(dateEnd);
      if (summary) workExperience.summary = summary;
      if (highlights) workExperience.highlights = [highlights];

      if (Object.keys(workExperience).length > 0) {
        jsonData.work.push(workExperience);
      }
    });
  }

  /**
   * Extracts education information from the document and populates the `jsonData.education` array.
   */
  function extractEducation() {
    const educationSections = [...document.getElementsByClassName('education')];

    educationSections.forEach(eduSection => {
      let education = {};
      const dateStart = eduSection?.getElementsByTagName('h3')[0]?.textContent.trim() || null;
      const dateEnd = eduSection?.getElementsByTagName('h3')[1]?.textContent.trim() || null;
      const studyType = eduSection?.getElementsByTagName('h3')[2]?.textContent.trim() || null;
      const area = eduSection?.getElementsByTagName('h3')[3]?.textContent.trim() || null;
      const institution = eduSection?.getElementsByTagName('h3')[4]?.textContent.trim() || null;
      const score = eduSection?.getElementsByTagName('h3')[5]?.textContent.trim() || null;
      const url = eduSection?.getElementsByTagName('h3')[6]?.getElementsByTagName('a')[0]?.href || null;

      // Only add fields if they exist
      if (institution) education.institution = institution;
      if (url) education.url = url;
      if (area) education.area = area;
      if (studyType) education.studyType = studyType;
      if (dateStart) education.startDate = matchAndConvert(dateStart);
      if (dateEnd) education.endDate = matchAndConvert(dateEnd);
      if (score) education.score = score;

      if (Object.keys(education).length > 0) {
        jsonData.education.push(education);
      }
    });
  }

  /**
   * Extracts skills information from the document and populates the `jsonData.skills` array.
   */
  function extractSkills() {
    const skillElements = [...document.getElementsByClassName('skills')];

    skillElements.forEach(skill => {
      let skillData = {};

      const level = skill?.getElementsByClassName('right')[0]?.textContent.trim() || null;
      const keywordsInput = skill?.getElementsByClassName('right')[1]?.textContent.trim() || null;
      const name = skill?.getElementsByClassName('left')[0]?.textContent.trim() || null;

      // Convert keywords into an array (comma-separated values)
      const keywordsArray = keywordsInput ? keywordsInput.split(',').map(keyword => keyword.trim()) : [];

      if (name) skillData.name = name;
      if (level) skillData.level = level;
      if (keywordsArray.length > 0) skillData.keywords = keywordsArray;

      if (Object.keys(skillData).length > 0) {
        jsonData.skills.push(skillData);
      }
    });
  }

  /**
   * Extracts languages information from the document and populates the `jsonData.languages` array.
   */
  function extractLanguages() {
    const languageElements = [...document.querySelectorAll('.languages section')];

    languageElements.forEach(lang => {
      let languageData = {};

      const language = lang.querySelector('.left')?.textContent.trim() || null;
      const fluency = lang.querySelector('.right')?.textContent.trim() || null;

      if (language) languageData.language = language;
      if (fluency) languageData.fluency = fluency;

      if (Object.keys(languageData).length > 0) {
        jsonData.languages.push(languageData);
      }
    });
  }

  /**
   * Generates the current date in the format YYYY-MM-DD.
   *
   * @returns {string} The current date in YYYY-MM-DD format.
   */
  function generateDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Matches and converts a date string in the format YYYY-MM-DD or YYYY-MM to the standard date format (YYYY-MM-DD).
   *
   * @param {string} dateString - The date string to be matched and converted.
   * @returns {string|null} The formatted date in YYYY-MM-DD or null if the date format is invalid.
   */
  function matchAndConvert(dateString) {
    const regex = /^([1-2][0-9]{3})(?:-([0-1][0-9])(?:-([0-3][0-9]))?)?$/;
    const match = dateString.match(regex);
    if (!match) return null;

    const year = parseInt(match[1], 10);
    const month = match[2] ? parseInt(match[2], 10) : 1; // Default to January
    const day = match[3] ? parseInt(match[3], 10) : 1; // Default to the 1st day

    const date = new Date(year, month - 1, day); // JavaScript months are 0-indexed
    if (date.getFullYear() === year && date.getMonth() + 1 === month && date.getDate() === day) {
      return `${year.toString().padStart(4, '0')}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    }
    return null;
  }

  /**
   * Checks if the given string contains only letters and spaces, and removes any accents or diacritical marks.
   * If the string is valid (after removing accents), it returns the string with spaces replaced by hyphens and appends '-CV'.
   * If the string contains any invalid characters, returns `null`.
   *
   * @param {string} str - The string to check and process.
   * @returns {string|null} The transformed string with spaces replaced by hyphens and '-CV' appended, or `null` if the input is invalid.
   */
  function containsOnlyLetters(str) {
    const normalizedStr = removeAccents(str); // Remove accents from the input string
    if (/^[a-zA-Z\s]+$/.test(normalizedStr)) {
      // Check if the string contains only English letters and spaces
      return normalizedStr?.replace(/\s/g, '-') + '-CV'; // Replace spaces with hyphens and append '-CV'
    } else {
      return null; // Return null if the string contains invalid characters
    }
  }

  /**
   * Removes accents and diacritical marks from the given string.
   * This function normalizes the string to a decomposed form and removes any diacritical marks.
   *
   * @param {string} str - The string from which accents will be removed.
   * @returns {string} The string without accents or diacritical marks.
   */
  function removeAccents(str) {
    return str
      .normalize('NFD') // Normalize the string to decomposed form
      .replace(/[\u0300-\u036f]/g, ''); // Remove all diacritical marks
  }

  /**
   * Generates and downloads an HTML and JSON file based on user data.
   * This function:
   * - Sets a default file name or generates one based on user input.
   * - Cleans up unnecessary HTML elements (removes elements with the 'remove' class and disables draggable elements).
   * - Extracts relevant data from the page (languages, skills, basics, work experience, and education).
   * - Exports the data in both HTML and JSON formats.
   *
   * @function
   * @returns {void} This function does not return any value. It triggers the download of an HTML file and a JSON file.
   */
  function html() {
    // Set default file name
    const nameElement = document.querySelector('#name');
    const defaultTextNode = 'cv-';

    const name = containsOnlyLetters(nameElement.textContent) || defaultTextNode;
    const date = generateDate();

    // Clone the HTML content
    const htmlElement = document.querySelector('html');
    const clonedHtml = htmlElement.cloneNode(true);

    // Remove elements with the 'remove' class and draggable attribute
    clonedHtml.querySelectorAll('.remove').forEach(function (element) {
      element.parentNode.removeChild(element);
    });

    clonedHtml.querySelectorAll('[draggable="true"]').forEach(e => e.removeAttribute('draggable'));

    // Get the outer HTML of the cloned document
    let htmlString = clonedHtml.outerHTML;
    htmlString = `<!DOCTYPE html>\n${htmlString}`;

    // Extract data from the page
    extractLanguages();
    extractSkills();
    extractBasics();
    extractWorkExperience();
    extractEducation();

    // Trigger the download of the HTML file
    download(`${name}-${date}`, htmlString);
  }

  function json(){
    // Set default file name
    const nameElement = document.querySelector('#name');
    const defaultTextNode = 'cv-json-';
    const name = containsOnlyLetters(nameElement.textContent) || defaultTextNode;
    const date = generateDate();
    // Export the data as JSON
    exportToJson(jsonData, `${name}-${date}.json`);
  }
  /**
   * Triggers the download of an HTML file.
   *
   * @param {string} fileName - The name of the file to be downloaded.
   * @param {string} html - The HTML content to be saved in the file.
   */
  function download(fileName, html) {
    const pom = document.createElement('a');
    document.body.appendChild(pom);
    pom.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(html));
    pom.setAttribute('download', `${fileName}.html`);
    pom.target = '_blank';

    if (document.createEvent) {
      const event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      });
      pom.dispatchEvent(event);
    } else {
      pom.click();
      pom.remove();
    }
  }

  /**
   * Exports the provided data as a downloadable JSON file.
   *
   * @param {Object} data - The data to be exported as JSON.
   * @param {string} [fileName='data.json'] - The name of the JSON file.
   */
  function exportToJson(data, fileName = 'data.json') {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;

    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);
  }

  /**
   * Event listener for mouseup event to update the content of options.
   */
  document.addEventListener('mouseup', e => {
    const target = e.target;
    if (target.tagName === 'OPTION') {
      target.parentNode.parentNode.innerHTML = target.value;
    }
  });

  /**
   * Event listener for keyup event to trigger a function when Enter is pressed.
   */
  document.addEventListener('keyup', function (e) {
    if (e.key === 'Enter') {
      outs();
    }
  });

  /**
   * Event listener for double click on editable fields to insert a select dropdown.
   */
  document.body.addEventListener('dblclick', function (e) {
    if (e.target.classList.contains('edit')) {
      e.preventDefault();

      const selectHtml = `
      <select>
        <option value="A1 – Breakthrough">A1 – Breakthrough</option>
        <option value="A2 – Elementary">A2 – Elementary</option>
        <option value="B1 – Threshold">B1 – Threshold</option>
        <option value="B2 – Vantage">B2 – Vantage</option>
        <option value="C1 – Effective Operational Proficiency">C1 – Effective Operational Proficiency</option>
        <option value="C2 – Mastery">C2 – Mastery</option>
      </select>
    `;

      e.target.insertAdjacentHTML('afterbegin', selectHtml);
    }
  });

  /**
   * Event listener for click events on the document to handle adding/removing elements
   * and editing content.
   */
  document.body.addEventListener(
    'click',
    function (e) {
      const target = e.target;

      if (target.classList.contains('rem')) {
        // Remove elements based on their class and conditions
        handleRemove(target);
      } else if (target.classList.contains('add')) {
        // Add new elements based on their class and conditions
        handleAdd(target);
      } else if (target.tagName === 'H3' || target.tagName === 'H2' || target.parentNode.id === 'number' || target.parentNode.id === 'email') {
        // Replace text content with an input field for editing
        handleEdit(target);
      } else if (target.tagName !== 'SELECT' && target.tagName !== 'INPUT') {
        // Run all to make text not inputs function
        outs();
      }
    },
    true
  );

  /**
   * Handles the removal of elements from the DOM.
   *
   * @param {Element} target - The element that was clicked.
   */
  function handleRemove(target) {
    if (target.parentNode.classList.contains('tables')) {
      const row = target.parentNode.getElementsByClassName('row');
      const last = row[row.length - 1];
      if (row.length === 3) target.parentNode.remove();
      return row.length > 3 && last.remove();
    }
    if (target?.parentNode.getElementsByTagName('div').length === 1) {
      target?.parentNode.remove();
    }
    target?.parentNode.getElementsByTagName('div')[0]?.remove();
  }

  /**
   * Handles the addition of new elements to the DOM.
   *
   * @param {Element} target - The element that was clicked.
   */
  function handleAdd(target) {
    if (target.parentNode.classList.contains('tables')) {
      const row = target.parentNode.getElementsByClassName('row');
      const last = row[row.length - 1];
      return last.parentNode.appendChild(last.cloneNode(true));
    }
    const node = target?.parentNode.getElementsByTagName('div')[0];
    const copy = node.cloneNode(true);
    node.before(copy);
  }

  /**
   * Handles editing text elements by replacing them with input fields.
   *
   * @param {Element} target - The element that was clicked.
   */
  function handleEdit(target) {
    const input = document.createElement('input');
    if (target.id) input.setAttribute('id', target.id);
    if (target.className) input.setAttribute('class', target.className);
    input.setAttribute('type', 'text');
    input.value = target.textContent;
    target.replaceWith(input);
    input.select();
    input.focus();
  }
})(document);
