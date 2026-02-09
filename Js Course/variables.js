
const username = "Aminuddin";
let email = "aminuddin.samsudin@example.com";
console.log(username);
console.log(email);
let age = 25;
console.log(age);
console.log("User [" + username + "] has an email [" + email + "] and is " + age + " years old.");
console.log("Age after 6 years is:", age + 6);
age = age + 6;
console.log("Updated age in 2026:", age);

let isloggedIn = false; // Boolean variable
console.log( age > 18 ); // true

let a = 10;
let b = 5;
console.log(a + b); // Addition
console.log(a - b); // Subtraction
console.log(a * b); // Multiplication
console.log(a / b); // Division 
console.log(a % b); // Modulus
console.log(a ** b); // Exponentiation
let product = a * b - a / b;
console.log("The result of the product is:", product);
age ++; // Increment age by 1
console.log("Age after increment:", age);
age --; // Decrement age by 1
console.log("Age after decrement:", age);

username == "Amin"; // true
console.log(username == "Amin"); // false
console.log(username != "Aminuddin"); // true
console.log(a > b); // true
console.log(a < b); // false
console.log(a >= b); // true
console.log(a <= b); // false  
console.log(a === '10') 
console.log(a == '10')
console.log('6' !== 6)

let ageAmin = 20;
if (ageAmin < 18) {
    console.log("You're still a child.");
} else {
    console.log("Woow, you're an adult now!");
}

let password = "mypass123";
if (password.length >= 10) {
    console.log("Strong password.");
} else {
    console.log("Weak password, must be at least 8 characters.");
}

if(0) {
    console.log("This will not execute");
} else {
    console.log("0 is falsy, so this block runs.");
}

let passwordAmin = "myp@ssw0rd!";
let enteredPassword = "myp@ssw0rd!";
let userRole = "admin";

if(passwordAmin === enteredPassword) {
    console.log("Access granted.");
    if(userRole === "admin") {
        console.log("Welcome, Admin! You have full access.");
    } else {
        console.log("Welcome, User! You have limited access.");
    }
} else {
    console.log("Access denied. Incorrect password.");
}

let language = "English";
if(language === "Malaysia") 
    console.log("Selamat datang!");
else if(language === "English") 
    console.log("Welcome!");
else if(language === "Spanish")
    console.log("¡Bienvenido!");
else
    console.log("We don't support this " + language + " language yet.");

//loops
let count = 0;
while(count <= 5) {
    console.log("Count is:", count);
    count++;
}

for(let i = 1; i <= 7; i++) {
    console.log("Number:", i);
}

console.log(Date());
console.log(Math.random());

function sayhello(name) {
    console.log("Hello, " + name + ",Hope you have a nice day!");
}
sayhello("Aminuddin");
sayhello("Saiful"); 

function addNumbers(num1, num2, num3) {
    console.log("The sum of " + num1 + ", " + num2 + ", and " + num3 + " is:", num1 + num2 + num3);
}

addNumbers(5, 10, 15);
addNumbers(20, 30, 40);

function multiplyNumbers(num1, num2, num3) {
    console.log("Multiply of " + num1 + ", " + num2 + ", and " + num3 + " is:", num1 * num2 * num3);
}
multiplyNumbers(3, 5, 7);