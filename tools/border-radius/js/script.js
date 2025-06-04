// js/script.js
document.addEventListener('DOMContentLoaded', () => {
    (function () {
        'use strict';

        /**
         * Constructor function for Arrows.
         * Manages incrementing and decrementing a number.
         * @param {number} number - The initial number value.
         */
        function Arrows(number) {
            this.number = number;
        }

        /**
         * Increments the stored number by 1.
         * @param {number} y - The current value to increment.
         * @returns {number} The incremented value.
         */
        Arrows.prototype.up = function up(y) {
            this.number = y;
            return (this.number += 1);
        };

        /**
         * Decrements the stored number by 1.
         * @param {number} y - The current value to decrement.
         * @returns {number} The decremented value.
         */
        Arrows.prototype.dn = function dn(y) {
            this.number = y;
            return (this.number -= 1);
        };

        // Create an instance of the Arrows object
        const lg = new Arrows(0);

        // Get references to the "Lock All" checkbox and "Reset All" button
        const lockAllCheckbox = document.getElementById('lock-all');
        const resetAllButton = document.getElementById('reset-all');
        const simplifyCssCheckbox = document.getElementById('simplify-css');

        // Get all corner lock checkboxes
        const cornerLockCheckboxes = document.querySelectorAll('.lock-control__checkbox[data-lock-corner]');

        // Map corner names to their corresponding input elements (H, V) using their new IDs
        const cornerInputMap = {
            'top-left': {
                h: document.querySelector('#tl-h-control .arrow-control__input'),
                v: document.querySelector('#tl-v-control .arrow-control__input')
            },
            'top-right': {
                h: document.querySelector('#tr-h-control .arrow-control__input'),
                v: document.querySelector('#tr-v-control .arrow-control__input')
            },
            'bottom-left': {
                h: document.querySelector('#bl-h-control .arrow-control__input'),
                v: document.querySelector('#bl-v-control .arrow-control__input')
            },
            'bottom-right': {
                h: document.querySelector('#br-h-control .arrow-control__input'),
                v: document.querySelector('#br-v-control .arrow-control__input')
            }
        };

        // Create an array of all input elements for easy iteration
        const allRadiusInputs = [
            cornerInputMap['top-left'].h, cornerInputMap['top-left'].v,
            cornerInputMap['top-right'].h, cornerInputMap['top-right'].v,
            cornerInputMap['bottom-left'].h, cornerInputMap['bottom-left'].v,
            cornerInputMap['bottom-right'].h, cornerInputMap['bottom-right'].v
        ];


        // Variable to store the value from the last interacted input, for "Lock All"
        let lastAdjustedValue = 7; // Default initial value

        // Add event listeners to the document for click and change events
        document.addEventListener('click', updateArrows);
        document.addEventListener('change', updateArrows);

        // Event listener for the Simplify CSS checkbox
        simplifyCssCheckbox.addEventListener('change', borders);

        // Add event listeners for each corner lock checkbox
        cornerLockCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const corner = e.target.dataset.lockCorner;
                const { h: hInput, v: vInput } = cornerInputMap[corner];

                if (e.target.checked) {
                    // If this corner lock is checked, uncheck "Lock All"
                    if (lockAllCheckbox.checked) {
                        lockAllCheckbox.checked = false;
                        // When Lock All is unchecked, all other corner locks should also be unchecked
                        cornerLockCheckboxes.forEach(cb => {
                            if (cb !== e.target) {
                                cb.checked = false;
                            }
                        });
                    }
                    // Synchronize H and V values for this specific corner
                    const hValue = parseInt(hInput.value, 10) || 0;
                    vInput.value = hValue; // Sync V to H
                } else {
                    // If a corner lock is unchecked, and Lock All is active, uncheck Lock All
                    if (lockAllCheckbox.checked) {
                        lockAllCheckbox.checked = false;
                    }
                }
                borders(); // Update the display
            });
        });


        /**
         * Creates and displays a temporary "Copied!" notification popup.
         */
        function showCopyNotification() {
            let notification = document.getElementById('copyNotification');
            if (!notification) {
                notification = document.createElement('div');
                notification.id = 'copyNotification';
                notification.className = 'notification'; // Assumes .notification CSS is available
                notification.textContent = 'Copied to clipboard!';
                document.body.appendChild(notification);
            }

            notification.classList.add('notification--show'); // Assumes .notification--show CSS is available
            setTimeout(() => {
                notification.classList.remove('notification--show');
            }, 1500);
        }

        /**
         * Handles events (clicks on arrows, changes in input fields)
         * to update the corresponding input value and trigger border updates,
         * incorporating locking logic.
         * @param {Event} e - The event object.
         */
        function updateArrows(e) {
            const arrowControlContainer = e.target.closest('.arrow-control');
            const lockAllChecked = lockAllCheckbox.checked;

            if (arrowControlContainer) {
                const inputElement = arrowControlContainer.querySelector('.arrow-control__input');
                const axis = arrowControlContainer.dataset.axis; // Get the axis (h or v) from the parent control
                let currentCorner = null; // To identify which corner this input belongs to

                // Determine which corner this input belongs to
                for (const cornerName in cornerInputMap) {
                    if (cornerInputMap[cornerName].h === inputElement || cornerInputMap[cornerName].v === inputElement) {
                        currentCorner = cornerName;
                        break;
                    }
                }

                if (!inputElement || !currentCorner) {
                    console.error("Input element or its corner mapping not found.");
                    return;
                }

                let currentValue = Number(inputElement.value);
                let newValue = currentValue;

                // Calculate new value based on interaction type
                if (e.target.classList.contains('arrow-control__arrow--up')) {
                    if (currentValue < 100) {
                        newValue = lg.up(currentValue);
                    }
                } else if (e.target.classList.contains('arrow-control__arrow--down')) {
                    if (currentValue > 0) {
                        newValue = lg.dn(currentValue);
                    }
                } else if (e.target.classList.contains('arrow-control__input')) {
                    newValue = Number(inputElement.value);
                }

                // Validate and sanitize the new value
                newValue = (newValue.toString().length > 0 && Number.isInteger(+newValue)) ? Math.max(0, parseInt(newValue, 10)) : 0;

                // Update the current input element's value
                inputElement.value = newValue;

                // Update lastAdjustedValue for "Lock All"
                lastAdjustedValue = newValue;

                // --- Locking Logic Hierarchy ---
                // "Lock All" takes precedence over individual corner locks.
                if (lockAllChecked) {
                    allRadiusInputs.forEach(input => {
                        if (input !== inputElement) { // Don't update the input that just triggered the event
                            input.value = newValue;
                        }
                    });
                    // Ensure all corner locks are checked when "Lock All" is active
                    cornerLockCheckboxes.forEach(checkbox => {
                        checkbox.checked = true;
                    });
                } else {
                    // Handle individual corner H/V lock (only if "Lock All" is NOT checked)
                    const specificCornerLockCheckbox = document.querySelector(`.lock-control__checkbox[data-lock-corner="${currentCorner}"]`);

                    if (specificCornerLockCheckbox && specificCornerLockCheckbox.checked) {
                        // If the H/V lock for this specific corner is checked, synchronize its H and V values
                        const { h: hInput, v: vInput } = cornerInputMap[currentCorner];
                        if (axis === 'h') { // If current input is H, update V
                            vInput.value = newValue;
                        } else if (axis === 'v') { // If current input is V, update H
                            hInput.value = newValue;
                        }
                    }
                }
            } else if (e.target.id === 'lock-all') {
                // If "Lock All" checkbox itself was clicked
                if (lockAllCheckbox.checked) {
                    // When "Lock All" is checked, synchronize all values to the last adjusted value
                    allRadiusInputs.forEach(input => {
                        input.value = lastAdjustedValue;
                    });
                    // Check all individual corner locks
                    cornerLockCheckboxes.forEach(checkbox => {
                        checkbox.checked = true;
                    });
                } else {
                    // When "Lock All" is unchecked, uncheck all individual corner locks
                    cornerLockCheckboxes.forEach(checkbox => {
                        checkbox.checked = false;
                    });
                }
            }
            // Note: Corner lock checkbox changes are handled by their dedicated event listener above.

            // Always call borders() to update the preview after any interaction
            borders();
        }

        /**
         * Updates the border-radius style of the preview box (.border-preview)
         * and displays the corresponding CSS code.
         */
        function borders() {
            // Select the border-preview element directly by its class
            let borderPreviewElement = document.querySelector('.border-preview');
            if (!borderPreviewElement) {
                console.error("Border preview element with class 'border-preview' not found.");
                return;
            }

            const simplifyChecked = simplifyCssCheckbox.checked; // Get simplify checkbox state

            // Get all 8 values using the mapped inputs for clarity and robustness
            const tlH = parseInt(cornerInputMap['top-left'].h.value, 10) || 0;
            const tlV = parseInt(cornerInputMap['top-left'].v.value, 10) || 0;
            const trH = parseInt(cornerInputMap['top-right'].h.value, 10) || 0;
            const trV = parseInt(cornerInputMap['top-right'].v.value, 10) || 0;
            const blH = parseInt(cornerInputMap['bottom-left'].h.value, 10) || 0;
            const blV = parseInt(cornerInputMap['bottom-left'].v.value, 10) || 0;
            const brH = parseInt(cornerInputMap['bottom-right'].h.value, 10) || 0;
            const brV = parseInt(cornerInputMap['bottom-right'].v.value, 10) || 0;

            // Helper function to format radius value: '0' for 0, 'Xpx' otherwise
            const formatRadius = (value) => (value === 0 ? '0' : `${value}px`);

            // Construct the full, explicit border-radius CSS string
            const horizontalRadii = `${formatRadius(tlH)} ${formatRadius(trH)} ${formatRadius(brH)} ${formatRadius(blH)}`;
            const verticalRadii = `${formatRadius(tlV)} ${formatRadius(trV)} ${formatRadius(brV)} ${formatRadius(blV)}`;
            const explicitBorderRadiusCSS = `${horizontalRadii} / ${verticalRadii}`;

            let displayCSS = explicitBorderRadiusCSS; // Default to explicit

            // Apply simplification if checkbox is checked
            if (simplifyChecked) {
                // Check if all 8 values are identical
                const allValuesSame = (tlH === tlV && tlV === trH && trH === trV &&
                                       trV === blH && blH === blV && blV === brH && brH === brV);

                if (allValuesSame) {
                    displayCSS = formatRadius(tlH);
                }
            }

            // Apply border-radius to the preview element for visual display
            borderPreviewElement.style.borderRadius = explicitBorderRadiusCSS;

            // Update the text content of the preview box to show the generated CSS
            borderPreviewElement.innerText = `.border-radius {\n  border-radius: ${displayCSS};\n}`;
        }

        // Add event listener to copy the CSS to clipboard when the preview box is clicked
        document.querySelector('.border-preview').addEventListener('click', function (e) {
            const range = document.createRange();
            range.selectNode(this);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);

            try {
                document.execCommand('copy');
                showCopyNotification();
            } catch (err) {
                console.error('Failed to copy CSS to clipboard:', err);
            } finally {
                window.getSelection().removeAllRanges();
            }
        });

        // Event listener for "Reset All" button
        resetAllButton.addEventListener('click', () => {
            const initialValue = 7; // Or any default you prefer
            allRadiusInputs.forEach(input => {
                input.value = initialValue;
            });
            // Uncheck "Lock All" checkbox and all "Lock H/V" checkboxes
            lockAllCheckbox.checked = false;
            cornerLockCheckboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
            simplifyCssCheckbox.checked = false; // Reset simplify checkbox
            lastAdjustedValue = initialValue; // Reset last adjusted value
            borders(); // Update the display
        });

        // Initial call to set the border-radius when the script loads
        borders();

    }()); // End of self-executing function
});
