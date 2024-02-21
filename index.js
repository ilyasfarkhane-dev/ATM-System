const fs = require("fs").promises;
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const users_file = "./users.json";
let users = [];

async function readUserData() {
  try {
    const data = await fs.readFile(users_file, "utf8");
    users = JSON.parse(data);
  } catch (err) {
    console.error(`Error reading users data: ${err}`);
  }
}

const saveUsersData = () => {
  try {

    fs.writeFile(users_file, JSON.stringify(users, null, 2));
    
  } catch (err) {
    console.error(`Error writing users data: ${err}`);
  }
};

const generateUniqueId = () => {
  let accountID;
  do {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    accountID = `ACC${randomDigits}`;
  } while (users.some((user) => user.accountID === accountID));
  return accountID;
};

const generatePin = () => {
  return Math.floor(1000 + Math.random() * 9000);
};

const getUserByAccountId = async (accountId) => {
    const data = await fs.readFile(users_file, "utf8");
      users = JSON.parse(data);
  return users.find((user) => user.accountID.toString() === accountId);
};

const createUser = () => {
  rl.question("Enter your name:\n> ", async (name) => {
    const pin = generatePin();
    const accountID = generateUniqueId();

    const newUser = {
      name: name,
      pin: pin,
      accountID: accountID,
      balance: 0,
      transactions: [],
    };

    try {
      const data = await fs.readFile(users_file, "utf8");
      users = JSON.parse(data);

      users.push(newUser);

      await saveUsersData();

      console.log("User created successfully!");
      sinupSinin();
    } catch (err) {
      console.error(`Error creating user: ${err}`);
    }
  });
};

const sinupSinin = () => {
  console.log("\nWelcome:");
  console.log("1. Sign in");
  console.log("2. Sign up");
  console.log("3. Exit");

  rl.question("Enter your choice: \n>", (option) => {
    if (option == "1") {
      authenticateUser();
    } else if (option == "2") {
      createUser();
    } else if (option == "3") {
      exit();
    }
  });
};

const exit = () => {
  console.log("Thank You ❤");
  rl.close();
};

const authenticateUser = () => {
  rl.question("Enter your Account ID:\n> ", (accountId) => {
    rl.question("Enter your PIN:\n> ", (pin) => {
      const user = getUserByAccountId(accountId);
      if (user && parseInt(user.pin) === parseInt(pin)) {
        console.log(user);
        return user;
      } else {
        console.log("Invalid account ID or PIN. Please try again.");
        authenticateUser();
        return null;
      }
    });
  });

 
};

const displayMainMenu = () => {
  console.log("\nMain Menu:");
  console.log("1. Check Balance");
  console.log("2. Deposit Money");
  console.log("3. Withdraw Money");
  console.log("4. View Transaction History");
  console.log("5. Exit");
};

sinupSinin();
