const message = "Message from my module";

const location = "Heemskerk";

const greetMe = name => {
  console.log(`Hi, ${name}`);
};

export { message, greetMe, location as default };
