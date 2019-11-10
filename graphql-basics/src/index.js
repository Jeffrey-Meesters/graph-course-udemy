import currentLocation, { message, greetMe } from "./myModule";
import addNumbers, { subtract } from "./math";
console.log(message);
console.log(currentLocation);
greetMe("you");

const outcome = addNumbers(3, 4);
console.log(outcome);

const uitslag = subtract(4, 3);
console.log(uitslag);
