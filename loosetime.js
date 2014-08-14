/**
 * Loosetime.js
 *
 *	Author: Bruce Taylor
 *	URL: www.loosetime.com
 *	Date: 22/07/2014
 *	License: MIT License, open source
 *
 * - NOTE - Still need to refactor out the jQuery in this version -
 */

var looseconfig = 
{
	//change these values to set how loosetime creates default input elements
	"format" : "DD/MM/YY HH24:MM:SS.s",
	"value" : "DD/MM/YY 00:00.00",
	"class" : "input"
};

 
function loosetime(a,b,c,d,e)
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

			if (typeof(format) == 'undefined')
			{
				format = looseconfig.format;
			}
			else
			{
				format = parseDateTime(format);
			}
			
			console.log(format);
			
			// check inputVal given
			try
			{
				if (typeof(inputVal) == 'undefined')
				{
					inputVal = looseconfig.value;
				}
				
				inputLength = inputVal.length-2;
				
				// construct input element
				var input = $("<input>",
								{
									name : inputName,
									maxlength : inputLength,
									size : inputLength,
									type : 'text',
									value : inputVal,
									class : inputClass,
									keypress : dateTimeRules,
									click : resetCursosPos,
									loosetime : format
								}
							);
				
				// append loosetime to the designated element in the DOM
				try
				{
					var element = document.getElementById(appendLoc);
					input.appendTo(element);
				}
				// catch omission of append location
				catch (e)
				{
					window.alert("Error, no DOM element given to append loosetime input to.");
				}
			}

			// catch inputVal exception
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

	/*
	 * Parses datetime given by user and provides a string to be used for validation
	 * e.g. for DD/MM/YYYY HH24:mm:SS.s --> 31/12/2999 23:59:59:9999
	 */
	function parseDateTime(parseStr)
	{
		var validString = "";
		var res = parseStr.split(/[\/\/:.\s]/g);
		//console.log(res.length);
		for (var i = 0; i < res.length; i++)
		{
			//console.log(res[i]);
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
			//add delimiter
			validString += "/";
		}

		return validString;
	}

	/*
	 * Sets the cursor position on user click of input element
	 */
	function resetCursosPos()
	{
		$(this).prop(
		{
			selectionStart : 0,
			selectionEnd : 0
		}
		);
	}

	/*
	 * Validates user input against constraints given in time format
	 */
	function dateTimeRules(event, f)
	{

		// if user does not enter tab or backspace then move input
		// cursor pos
		if (event.charCode >= 48 && event.charCode <= 57)
		{
			var delims = new Array('/', '-', '_', '.', '|', ',', ' ', ':');

			// get input cursor position
			var sel = $(this).prop('selectionStart');
			var val = $(this).val();
			explode = val.split("");
			var input = event.charCode - 48;
			if (sel <= $(this).prop('maxlength') + 1)
			{
				// get value of char pos in loosetime attribute

				var thisChar = $(this).attr('loosetime').charAt(sel);
				// if position is on delimiter, jump to next position


				if ($.inArray(explode[sel], delims) != -1)
				{
					explode = val.split("");
					explode[sel + 1] = event.charCode - 48;
					val = explode.join("");
					newsel = sel + 2;
				}

				//move cursor to next position
				else
				{
					// if input value > loosetime char, prevent movement

					//replace char infront of cursor pos
					explode = val.split("");
					explode[sel] = event.charCode - 48;
					val = explode.join("");
					newsel = sel + 1;

				}

				$(this).prop(
				{
					value : val,
					selectionStart : newsel,
					selectionEnd : newsel

				}
				);

				// non numeric chars will be ignored, input cursor pos will stay
			}
		}
	}

}
