# _loosetime_


##About

loosetime.js provides users with the ability to enter Dates and Times without having to worry about the formatting or navigating a Datetime picker.

## Motivation

Datetime pickers are great for when you don't exactly know what Date or Time you are wanting, however
in situations were you know what it is e.g. your date of birth , they can be a right hinderance
clicking and navigating to find the right date. 
loosetime.js lets you just enter the date or time without having to worry.


## Code Example

loosetime.js currently uses 5 parameters for it to work properly:

`loosetime("date/time format", "location to append to on DOM", "pre set value", "element name", "class name");`

e.g.

`loosetime("HH24:mm:SS", "form1", "15:34:03", "time1", "input_class");`


## Datetime string components

HH24, HH12, MM, SS, S

DD, mm, YYYY

## Installation

For the vanilla version:

Download loosetime.js and reference it in your HTML head like so

`<script type="text/javascript" src="<path>/loosetime.js"></script>`

For the jQuery version:

Download loosetime.jquery.js and reference it along with jQuery 1.9.1 , as below

`<script type="text/javascript" src="loosetime.js"></script>`
`<script src="http://code.jquery.com/jquery-1.9.1.js"></script>`

## License

MIT License

## Contact

brucetaylor.xyz