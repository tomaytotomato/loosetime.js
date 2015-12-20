/**
 * Loosetime.js
 *
 * Author: Bruce Taylor
 * URL: brucetaylor.xyz
 * Date: 08/11/2014
 * License: MIT License, Open source
 */
//begin private closure
var loosetime = (function () {


    var looseconfig = {
        "format": "DD/MM/YY HH24:MM:SS.s",
        "value": "DD/MM/YY 00:00.00",
        "class": "input",
        "delims": ['/', '-', '_', '.', '|', ',', ' ', ':']
    };

    function init(a, b, c, d, e) {
        var format = a;
        var target = b;
        var inputVal = c;
        var inputName = d;
        var inputClass = e;
        var inputLength;
        try {
            if (typeof(format) == 'undefined') {
                format = looseconfig.format;
            } else {
                format = parseDateTime(format);
            }
            try {
                if (typeof(inputVal) == 'undefined') {
                    inputVal = looseconfig.value;
                }
                inputLength = inputVal.length - 2;
                var input = document.createElement("input");
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
                    dateTimeRules(e, this)
                });
                try {
                    var element = document.getElementById(target);
                    element.appendChild(input);
                } catch (e) {
                    window.alert("Error, no element given to append loosetime to.")
                }
            } catch (e) {
                window.alert("Error, value is invalid." + e.toString());
            }
        } catch (e) {
            window.alert("Error, date format missing or invalid.");
        }
    }

    function parseDateTime(parseStr) {
        var validString = "";
        var res = parseStr.split(/[\/\/:.\s]/g);
        for (var i = 0; i < res.length; i++) {
            switch (res[i]) {
                case"DD":
                    validString += "31";
                    break;
                case"MM":
                    validString += "12";
                    break;
                case"YY":
                    validString += "99";
                    break;
                case"YYYY":
                    validString += "2999";
                    break;
                case"HH24":
                    validString += "23";
                    break;
                case"HH12":
                    validString += "11";
                    break;
                case"mm":
                    validString += "59";
                    break;
                case"SS":
                    validString += "59";
                    break;
                case"s":
                    validString += "99";
                    break;
            }
            validString += "/";
        }
        return validString;
    }

    function resetCursorPos(element) {
        element.selectionStart = 0;
        element.selectionEnd = 0;
    }

    function dateTimeRules(e, target) {
        var event = window.event || e;
        var input = target;
        var jump = false;
        if (event.charCode >= 48 && event.charCode <= 57) {
            var delims = looseconfig.delims;
            var sel = input.selectionStart;
            var val = input.value;
            explode = val.split("");
            var char = event.charCode - 48;
            if (sel <= input.maxLength + 1) {
                var thisChar = input.getAttribute('data-loosetime').charAt(sel);
                if (!Number(thisChar)) {
                    thisChar = input.getAttribute('data-loosetime').charAt(sel + 1);
                }
                if (delims.indexOf(explode[sel]) != -1) {
                    if (char <= thisChar && !thisChar.isNaN) {
                        explode = val.split("");
                        explode[sel + 1] = event.charCode - 48;
                        val = explode.join("");
                        newsel = sel + 2;
                    } else
                        newsel = sel;
                } else {
                    console.log(thisChar);
                    if (char <= thisChar && !thisChar.isNaN) {
                        explode = val.split("");
                        explode[sel] = event.charCode - 48;
                        val = explode.join("");
                        newsel = sel + 1;
                    } else
                        newsel = sel;
                }
                input.value = val;
                input.selectionStart = newsel;
                input.selectionEnd = newsel;
            }
        }
    }

    function validator(pos, validString) {
        return validString.charAt(pos);
    }

    return init; //return constructor
})();


