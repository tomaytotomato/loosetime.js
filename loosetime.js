/**
 * Loosetime.js
 * 
 * Author: Bruce Taylor URL: www.loosetime.com Date: 22/07/2014 License: MIT
 * License, open source - NOTE - Still need to refactor out the jQuery in this
 * version -
 */

var looseconfig =
{
    // change these values to set how loosetime creates default input elements
    "format" : "DD/MM/YY HH24:MM:SS.s",
    "value" : "DD/MM/YY 00:00.00",
    "class" : "input",
    "delims" : new Array('/', '-', '_', '.', '|', ',', ' ', ':')
};

function loosetime(a, b, c, d, e)
	{
		
		var format = a;
		var appendLoc = b;
		var inputVal = c;
		var inputName = d;
		var inputClass = e;
		var inputLength;
		
		// parse the time format passed in
		try
			{
				
				if (typeof (format) == 'undefined')
					{
						format = looseconfig.format;
					}
				else
					{
						format = parseDateTime(format);
					}
				
				
				// check inputVal given
				try
					{
						if (typeof (inputVal) == 'undefined')
							{
								inputVal = looseconfig.value;
							}
						
						inputLength = inputVal.length - 2;
						
						// construct input element
						var input = document.createElement("input");
						input.setAttribute("name", inputName);
						input.setAttribute("maxlength", inputLength);
						input.setAttribute("size", inputLength);
						input.setAttribute("value", inputVal);
						input.setAttribute("type", "input");
						input.setAttribute("class", inputClass);
						input.setAttribute("onkeypress", "dateTimeRules(event)");
						input.setAttribute("onclick", "resetCursorPos(event)");
						input.setAttribute("loosetime", format);
						
						// append loosetime to the designated element in the DOM
						try
							{
								var element = document.getElementById(appendLoc);
								element.appendChild(input);
							}
						// catch omition of append location
						catch (e)
							{
								window.alert("Error, no Element given to append loosetime to.")

							}
					}
				
				// catch newVal exception
				catch (e)
					{
						window.alert("Error, Value is invalid." + e.toString());
					}
			}
		// catch format exception
		catch (e)
			{
				window.alert("Error, Date format missing or invalid.");
			}
	}
/*
 * Parses datetime given by user and provides a string to be used for validation
 * e.g. for DD/MM/YYYY HH24:mm:SS.s --> 31/12/2999 23:59:59:9999
 */
function parseDateTime(parseStr)
	{
		var validString = "";
		var res = parseStr.split(/[\/\/:.\s]/g);
		// console.log(res.length);
		for (var i = 0; i < res.length; i++)
			{
				// console.log(res[i]);
				switch (res[i])
					{
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
				// add delimiter
				validString += "/";
			}
		
		return validString;
	}

/*
 * Sets the cursor position on user click of input element
 */
function resetCursorPos(e)
	{
		var e = window.event || e;
		var input = e.target || e.srcElement;
		
		input.selectionStart = 0;
		input.selectionEnd = 0;
	}

/*
 * Validates user input against constraints given in time format
 */
function dateTimeRules(e)
	{
		
		var event = window.event || e;
		var input = event.target || event.srcElement;
		
		// if user does not enter tab or backspace then move input
		// cursor pos
		if (event.charCode >= 48 && event.charCode <= 57)
			{
				
				var delims = looseconfig.delims;
				
				// get input cursor position
				var sel = input.selectionStart;
				var val = input.value;
				explode = val.split("");
				var char = event.charCode - 48;
				if (sel <= input.maxLength + 1)
					{
						
						// get value of char pos in loosetime attribute
						
						var thisChar = input.getAttribute('loosetime').charAt(sel);
						// if position is on delimiter, jump to next
						// position
						
						if (delims.indexOf(explode[sel]) != -1)
							{
								explode = val.split("");
								explode[sel + 1] = event.charCode - 48;
								val = explode.join("");
								newsel = sel + 2;
							}
						
						// move cursor to next position
						else
							{
								// if input value > loosetime char,
								// prevent movement
								
								// replace char infront of cursor pos
								explode = val.split("");
								explode[sel] = event.charCode - 48;
								val = explode.join("");
								newsel = sel + 1;
								
							}
						
						input.value = val;
						input.selectionStart = newsel;
						input.selectionEnd = newsel;
						
						// non numeric chars will be ignored, input
						// cursor pos will stay
					}
			}
	}
