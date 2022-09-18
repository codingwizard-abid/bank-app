"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
   owner: "Jonas Schmedtmann",
   movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
   interestRate: 1.2, // %
   pin: 1111,
};

const account2 = {
   owner: "Jessica Davis",
   movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
   interestRate: 1.5,
   pin: 2222,
};

const account3 = {
   owner: "Steven Thomas Williams",
   movements: [200, -200, 340, -300, -20, 50, 400, -460],
   interestRate: 0.7,
   pin: 3333,
};

const account4 = {
   owner: "Sarah Smith",
   movements: [430, 1000, 700, 50, 90],
   interestRate: 1,
   pin: 4444,
};

let accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
   ["USD", "United States dollar"],
   ["EUR", "Euro"],
   ["GBP", "Pound sterling"],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
/////////////////////////////////////////////////
// experiments with find

// const firstWithdrew = movements.find(mov => mov < 0);
// console.log('firstWithdrew', firstWithdrew);

// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account, 'Owner');
// for(let account of accounts){
//    if(account.owner === 'Jessica Davis'){
//       console.log(account, 'Owner');
//    }
// }

const displayMovments = function (movements) {
   containerMovements.innerHTML = "";
   movements.forEach(function (mov, idx) {
      const type = mov > 0 ? "deposit" : "withdrawal";
      const html = `
      <div class="movements__row">
         <div class="movements__type movements__type--${type}">${idx} ${type}</div>
         <div class="movements__value">${mov}€</div>
      </div>
      `;
      containerMovements.insertAdjacentHTML("afterbegin", html);
   });
};

const calcDisplayBalance = function (acc) {
   acc.balance = acc.movements.reduce((acc, crr) => acc + crr, 0);
   labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = function (acc) {
   const incomes = acc.movements
      .filter((mov) => mov > 0)
      .reduce((acc, mov) => acc + mov, 0);
   const outcomes = acc.movements
      .filter((mov) => mov < 0)
      .reduce((acc, mov) => acc + mov, 0);
   const interest = acc.movements
      .filter((mov) => mov > 0)
      .map((deposit) => (deposit * acc.interestRate) / 100)
      .filter((int) => int >= 1)
      .reduce((acc, int) => acc + int, 0);
   labelSumIn.textContent = `${incomes}€`;
   labelSumOut.textContent = `${Math.abs(outcomes)}€`;
   labelSumInterest.textContent = `${interest}€`;
};

const createUsername = function (accs) {
   accs.forEach((acc) => {
      acc.username = acc.owner
         .toLowerCase()
         .split(" ")
         .map((name) => name[0])
         .join("");
   });
};
createUsername(accounts);

const updateUI = function (acc) {
   displayMovments(acc.movements);
   calcDisplayBalance(acc);
   calcDisplaySummary(acc);
};

// event Handler
let currentAccount;
btnLogin.addEventListener("click", function (e) {
   e.preventDefault();
   currentAccount = accounts.find(
      (acc) => acc.username === inputLoginUsername.value
   );
   if (currentAccount?.pin === Number(inputLoginPin.value)) {
      labelWelcome.textContent = `Welcome back, ${
         currentAccount.owner.split(" ")[0]
      }`;
      containerApp.style.opacity = 100;
      // clear login field
      inputLoginUsername.value = inputLoginPin.value = "";
      inputLoginPin.blur();
      // display movements
      updateUI(currentAccount);
   }
});

btnTransfer.addEventListener("click", function (e) {
   e.preventDefault();
   const amount = Number(inputTransferAmount.value);
   const receiverAcc = accounts.find(
      (acc) => acc.username === inputTransferTo.value
   );

   if (
      amount > 0 &&
      receiverAcc &&
      currentAccount.balance >= amount &&
      currentAccount.username !== receiverAcc.username
   ) {
      currentAccount.movements.push(-amount);
      receiverAcc.movements.push(amount);

      //display UI
      updateUI(currentAccount);
   }
   inputTransferTo.value = inputTransferAmount.value = "";
});

btnLoan.addEventListener('click', function(e){
   e.preventDefault();
   const amount = Number(inputLoanAmount.value);
   if(amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)){
      currentAccount.movements.push(amount);
      updateUI(currentAccount);
   };
   inputLoanAmount.value = "";
});

btnClose.addEventListener("click", function (e) {
   e.preventDefault();
   if (
      inputCloseUsername.value === currentAccount.username &&
      Number(inputClosePin.value) === currentAccount.pin
   ) {
      const index = accounts.findIndex(
         (acc) => acc.username === currentAccount.username
      );
      // delete account
      accounts.splice(index, 1);
      containerApp.style.opacity = 0;
   }
   inputCloseUsername.value = inputClosePin.value = "";
});

// const calcAvgHumanAge = function (ages) {
//    const humanAges = ages.map((age) => (age <= 2 ? 2 * age : 16 + age * 4));
//    const adults = humanAges.filter((adult) => adult >= 18);
//    const avg = adults.reduce((acc, age) => acc + age, 0) / adults.length;
//    return avg;
// };
// console.log(calcAvgHumanAge([5, 2, 4, 1, 15, 8, 3]));

// const eurToUSD = 1.1;
// const totalDepositUSD = movements
//    .filter((mov) => mov > 0)
//    .map((mov) => mov * eurToUSD)
//    .reduce((acc, mov) => acc + mov);
// console.log(totalDepositUSD);

// const deposit = mov => mov > 0;
// console.log(movements.some(deposit));
// console.log(movements.filter(deposit));
// console.log(movements.every(deposit));

// flat and flatMap
// const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// const result = arr.flat().map(a => a * 2).reduce((acc, n) => acc + n);
// console.log(result);

// const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
// console.log(arrDeep.flat(2));

// const accountMovements = accounts.map(acc => acc.movements);
// const allMovements = accountMovements.flat().filter(mov => mov > 0).reduce((acc, crr) => acc + crr);
// console.log(allMovements);

const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
const maps = arr.flatMap(mp => mp);
console.log(maps);