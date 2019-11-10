import currentLocation, { message, greetMe } from "./myModule";
import addNumbers, { subtract } from "./math";
console.log(message);
console.log(currentLocation);
greetMe("you");

console.log(addNumbers(3, 4));
console.log(subtract(4, 3));
