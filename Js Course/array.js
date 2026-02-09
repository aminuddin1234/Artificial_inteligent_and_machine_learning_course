//forEach method -- executes a provided function once for each array element
const food = ["apple", "carrot", "banana", "mango", "orange", "tomato"];
food.forEach( (item) => {console.log(item)} );

//map method -- creates a new array with the results of calling a provided function on every element in the calling array
const apple = food.map( (item) => "apple" );
console.log(apple);
const duplicatedFood = food.map( (item) => item + item );
console.log(duplicatedFood);

//filter method -- creates a new array with all elements that pass the test implemented by the provided function
const fruits = food.filter( (item) => item === "apple" || item === "banana" || item === "mango" || item === "orange" );
console.log(fruits);
const vegetables = food.filter( (item) => item === "carrot" || item === "tomato" );
console.log(vegetables);

//concat method -- merges two or more arrays into a new array
const vegetablesAndFruits = vegetables.concat(fruits);
console.log(vegetablesAndFruits);

//find method -- returns the value of the first element that satisfies the provided testing function
const findMango = food.find( (item) => item === "mango" );
console.log(findMango);
const findPineapple = food.find( (item) => item === "pineapple" );
console.log(findPineapple);

//findIndex method -- returns the index of the first element that satisfies the provided testing function
const bananaIndex = food.findIndex( (item) => item === "banana" );
console.log(bananaIndex);
const pineappleIndex = food.findIndex( (item) => item === "pineapple" );
console.log(pineappleIndex);

//indexOf method -- returns the first occurrence of a specified element
const food1 = ["apple", "carrot", "banana", "mango", "orange", "tomato", "banana"];
const bananaIndexof = food1.indexOf("banana");
console.log(bananaIndexof);
const pineappleIndexof = food1.indexOf("pineapple");
console.log(pineappleIndexof);

//lastIndexOf method -- returns the last occurrence of a specified element
const lastBananaIndexof = food1.lastIndexOf("banana");
console.log(lastBananaIndexof);
const lastPineappleIndexof = food1.lastIndexOf("pineapple");
console.log(lastPineappleIndexof);

//some method -- checks if at least one element in an array satisfies a condition
const hasMango = food.some( (item) => item === "mango" );
console.log(hasMango);
const hasPineapple = food.some( (item) => item === "pineapple" );
console.log(hasPineapple);

//every method -- checks if all elements in an array satisfy a condition
const allFruits = food.every( (item) => item === "apple" );
console.log(allFruits);
const allFood = food.every( (item) => item === "apple" || item === "banana" || item === "mango" || item === "orange" || item === "carrot" || item === "tomato" );
console.log(allFood);

//includes method -- checks if an array includes a certain element
const includesMango = food.includes("mango");
console.log(includesMango);
const includesPineapple = food.includes("pineapple");
console.log(includesPineapple);

//push method -- adds element at the end of the array
const newLength = food.push("grape");
console.log(food);
console.log(newLength);

//unshift method -- adds element at the beginning of the array
const newlength = food.unshift("kiwi");
console.log(food);
console.log(newlength);

//pop method -- removes the last element from an array
const lastItem = food.pop();
console.log(food);
console.log(lastItem);

//shift method -- removes the first element from an array
const firstItem = food.shift();
console.log(food);
console.log(firstItem);

//toString method -- converts an array to a string
const foodString = food.toString();
console.log(foodString);

//join method -- joins all elements of an array into a string
const foodJoined = food.join(" - ");
console.log(foodJoined);
const foodJoinedPlus = food.join(" + ");
console.log(foodJoinedPlus);

//fill method -- fills all the elements of an array from a start index to an end index with a static value
console.log(food);

//copyWithin method -- copies a sequence of array elements within the array to the position starting at a target index
const foodCopyWithin = food.copyWithin(2);
console.log(foodCopyWithin);
const foodCopyWithintargetIndexandstart  = food.copyWithin(2, 3);
console.log(foodCopyWithintargetIndexandstart);
const foodCopyWithintargetIndexstartandend  = food.copyWithin(2, 4, 5);
console.log(foodCopyWithintargetIndexstartandend);

//slice method -- returns a shallow copy of a portion of an array into a new array object selected from start to end (end not included)
const foodSlicehalf = food.slice(2);
console.log(foodSlicehalf);
const foodSlice = food.slice(1, 4);
console.log(foodSlice);

//splice method -- changes the contents of an array by removing or replacing existing elements and/or adding new elements in place
const month = ["Jan","February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
month.splice(0);
console.log(month);
month.splice(0, 1, "January");
console.log(month);

//sort method -- sorts the elements of an array in place and returns the sorted array
const numbers = [4, 2, 8, 6, 10, 12, 14, 16, 18, 20];
numbers.sort( (a, b) => a - b );
console.log(numbers);
numbers.sort( (a, b) => b - a );
console.log(numbers);

//reverse method -- reverses the order of the elements in an array in place
const number = [1, 2, 3, 4, 5, 6, 7, 8, 9];
number.reverse();
console.log(number);

//from method -- creates a new array instance from an array-like or iterable object
const str = "Hello";
const strArray = Array.from(str);
console.log(strArray);
const numSet = "12345";
const numset = Array.from(numSet, (item) => Number(item));
console.log(numset);

//isArray method -- determines whether the passed value is an array
console.log(Array.isArray(food));
console.log(Array.isArray("Not an array"));

//valueOf method -- returns the primitive value of the specified array object
const foodValue = food.valueOf();
console.log(foodValue);

//entries method -- returns a new Array Iterator object that contains the key/value pairs for each index in the array
const foodEntries = food.entries();
for (let entry of foodEntries) {
  console.log(entry);
}
console.log(foodEntries);

//keys method -- returns a new Array Iterator that contains the keys for each index in the array
const foodKeys = food.keys();
for (let key of foodKeys) {
  console.log(key);
}

//values method -- returns a new Array Iterator object that contains the values for each index in the array
const foodValues = food.values();
for (let value of foodValues) {
  console.log(value);
}

//reduce method -- executes a reducer function on each element of the array, resulting in a single output value
const numArray = [1, 2, 3, 4, 5];
const sum = numArray.reduce( (accumulator, currentValue) => accumulator + currentValue, 0 );
console.log(sum);
const product = numArray.reduce( (accumulator, currentValue) => accumulator * currentValue, 1 );
console.log(product);

//reduceRight method -- applies a function against an accumulator and each value of the array (from right-to-left) to reduce it to a single value
const numArray2 = [ 6, 7, 8, 9, 10 ];
const reversedStr = numArray2.reduceRight( (accumulator, currentValue) => accumulator + currentValue);
console.log(reversedStr);

//flat method -- creates a new array with all sub-array elements concatenated into it recursively up to the specified depth
const nestedArray = [1, 2, [3, 4, [5, [6]]]];
const flatArray1 = nestedArray.flat();
console.log(flatArray1);
const flatArray2 = nestedArray.flat(2);
console.log(flatArray2);
const flatArray3 = nestedArray.flat(3);
console.log(flatArray3);

//flatMap method -- first maps each element using a mapping function, then flattens the result into a new array
const words = [["hello world", "how are you"], ["i am fine", "goodbye"]];
const flatMappedArray = words.flatMap( (item) => {
return [ "hello world" + " " +  "how are you" + " "+ "i am fine", "goodbye"];        
});
console.log(flatMappedArray);