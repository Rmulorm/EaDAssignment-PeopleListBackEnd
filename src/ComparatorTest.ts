import DateComparator from "./types/DateComparator";
import NumberComparator from "./types/NumberComparator";
import StringComparator from "./types/StringComparator";

let date1 = new Date('01/01/2018');
let date2 = new Date('01/01/2019');
console.log(date1.toDateString() + " " + date2.toDateString() + " -> " + new DateComparator().compare(date1, date2));

date2 = new Date('01/01/2017');

console.log(date1.toDateString() + " " + date2.toDateString() + " -> " + new DateComparator().compare(date1, date2));

date2 = new Date('01/01/2018');

console.log(date1.toDateString() + " " + date2.toDateString() + " -> " + new DateComparator().compare(date1, date2));

let number1 = 1;
let number2 = 2;

console.log(number1 + " " + number2 + " -> " + new NumberComparator().compare(number1, number2));

number2 = 0;

console.log(number1 + " " + number2 + " -> " + new NumberComparator().compare(number1, number2));

number2 = 1;

console.log(number1 + " " + number2 + " -> " + new NumberComparator().compare(number1, number2));

let string1 = "b";
let string2 = "a";

console.log(string1 + " " + string2 + " -> " + new StringComparator().compare(string1, string2));

string2 = "c";

console.log(string1 + " " + string2 + " -> " + new StringComparator().compare(string1, string2));

string2 = "b";

console.log(string1 + " " + string2 + " -> " + new StringComparator().compare(string1, string2));

string1 = "abc";
string2 = "acb";

console.log(string1 + " " + string2 + " -> " + new StringComparator().compare(string1, string2));

string1 = "ab1 2";
string2 = "ab1 2";

console.log(string1 + " " + string2 + " -> " + new StringComparator().compare(string1, string2));