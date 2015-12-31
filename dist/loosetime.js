/**
 * Loosetime.js
 *
 * Author: Bruce Taylor
 * URL: brucetaylor.xyz
 * Date: 31/12/2015
 * License: MIT License, Open source
 */
/*global document, console, window  */
var loosetime = (function () {
    "use strict";

    /**
     * looseconfig provides rules and placeholder values to allow loosetime to work with missing arguments
     * @type {{format: string, value: string, class: string, delims: string[]}}
     */
    var looseconfig = {
        "format": "DD/MM/YY HH24:MM:SS.s",
        "value": "DD/MM/YY 00:00.00",
        "class": "input",
        "delims": ['/', '-', '_', '.', '|', ',', ' ', ':']
    };

    /**
     * resetCursorPos sets the caret to position zero allowing the user to easily type in dates
     * @param element
     */
    function resetCursorPos(element) {
        element.selectionStart = 0;
        element.selectionEnd = 0;
    }

    /**
     * parseDateTime creates a string to validate against for the given DateTime format
     * @param dateTime
     * @returns {string}
     */
    function parseDateTime(dateTime) {
        var validString = "",
            splitDateTime = dateTime.split(/[\/\/:.\s]/g);
        splitDateTime.forEach(function (stringvalidationSegment) {
            switch (stringvalidationSegment) {
                case "DD":
                    validString += "31";
                    break;
                case "MM":
                    validString += "12";
                    break;
                case "YY":
                    validString += "99";
                    break;
                case "YYYY":
                    validString += "2999";
                    break;
                case "HH24":
                    validString += "23";
                    break;
                case "HH12":
                    validString += "11";
                    break;
                case "mm":
                    validString += "59";
                    break;
                case "SS":
                    validString += "59";
                    break;
                case "s":
                    validString += "99";
                    break;
            }
            validString += "/";
        });
        return validString;
    }

    /**
     * dateTimeRules is where the magic happens, it intercepts the keypress and validates it against the current input
     * @param e event
     * @param target
     */
    function dateTimeRules(e, target) {
        var event = window.event || e,
            input = target,
            delims,
            validationSegment,
            inputvalidationSegment,
            newSel,
            thisChar,
            explode,
            char,
            sel,
            val;
        if (event.charCode >= 48 && event.charCode <= 57) { //user enters a number
            delims = looseconfig.delims;
            sel = input.selectionStart;
            val = input.value;
            explode = val.split("");
            char = event.charCode - 48;
            if (sel <= input.maxLength + 1) {
                thisChar = input.getAttribute('data-loosetime').charAt(sel);
                if (!Number(thisChar)) { //if we hit a delimeter check the validation char after it
                    thisChar = input.getAttribute('data-loosetime').charAt(sel + 1);
                }
                if (delims.indexOf(explode[sel]) !== -1) {
                    validationSegment = input.getAttribute('data-loosetime').substring(sel + 1, sel + 3);
                    if (char <= thisChar && !thisChar.isNaN) {
                        //need to evaluate the number validationSegment in the delimeter
                        explode = val.split("");
                        explode[sel + 1] = event.charCode - 48;
                        val = explode.join("");
                        newSel = sel + 2;
                    } else {
                        newSel = sel;
                    }
                } else {
                    validationSegment = input.getAttribute('data-loosetime').substring(sel === 0 ? 0 : sel - 1, sel === 0 ? sel + 2 : sel + 1);
                    inputvalidationSegment = input.value.charAt(sel === 0 ? 0 : sel - 1);
                    if (sel > 0) {
                        inputvalidationSegment = inputvalidationSegment.concat(char);
                        if (inputvalidationSegment <= validationSegment && !thisChar.isNaN) {
                            explode = val.split("");
                            explode[sel] = event.charCode - 48;
                            val = explode.join("");
                            newSel = sel + 1;
                        } else {
                            newSel = sel;
                        }
                    }
                    else {
                        if (char <= input.getAttribute('data-loosetime').charAt(sel)) {
                            explode = val.split("");
                            explode[sel] = event.charCode - 48;
                            val = explode.join("");
                            newSel = sel + 1;
                        }
                        else {
                            newSel = sel;
                        }
                    }
                }
                input.value = val;
                input.selectionStart = newSel;
                input.selectionEnd = newSel;
            }
        }
    }

    /**
     * constructor for loosetime
     * @param format
     * @param target
     * @param inputVal
     * @param inputName
     * @param inputClass
     */
    function init(format, target, inputVal, inputName, inputClass) {
        var inputLength,
            element,
            input;
        try {
            if (format === "undefined") {
                format = looseconfig.format;
            } else {
                format = parseDateTime(format);
            }
            try {
                if (inputVal === "undefined") {
                    inputVal = looseconfig.value;
                }
                inputLength = inputVal.length - 2;
                input = document.createElement("input");
                input.setAttribute("name", inputName);
                input.setAttribute("maxlength", inputLength);
                input.setAttribute("size", inputLength);
                input.setAttribute("value", inputVal);
                input.setAttribute("type", "input");
                input.setAttribute("class", inputClass);
                input.setAttribute("data-loosetime", format);
                input.addEventListener("click", function () {
                    resetCursorPos(this);
                });
                input.addEventListener("keypress", function (e) {
                    dateTimeRules(e, this);
                });
                try {
                    element = document.getElementById(target);
                    element.appendChild(input);
                } catch (e) {
                    console.error("Error, no element given to append loosetime to.");
                }
            } catch (e) {
                console.error("Error, value is invalid." + e.toString());
            }
        } catch (e) {
            console.error("Error, date format missing or invalid.");
        }
    }

    return init; //return constructor
})();


