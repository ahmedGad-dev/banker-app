'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Ahmed Gad',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Amr Newir',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300]

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');

const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////


//Global variables

let currentAccount;
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);




const displayMovements = (account , sort = false) => {
  containerMovements.innerHTML = ''

  const movs = sort ?  account.movements.slice().sort((a,b) => a - b) : account.movements
  
  movs.forEach((movement, index) => {
    const type = movement > 0 ? 'deposit' : 'withdrawal'

    //Implementing the current date
    //const date = new Date(account.movementsDates[index])
    //const day = `${now.getDay()}`.padStart(2 , 0)
    //const month = `${now.getMonth() + 1 }`.padStart(2 , 0)
    //const year = now.getFullYear()
    //const hour = now.getHours()
    //const minutes = now.getMinutes()
    //const displayDate = `${day}/${month}/${year}, ${hour}:${minutes}`

   
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${index + 1} ${type}</div>
      <div class="movements__date"></div>
      <div class="movements__value">${movement.toFixed(2)}</div>
    </div>`

    containerMovements.insertAdjacentHTML('afterbegin', html );
  })
}

const createUserNames = (accs) => {
   accs.map((acc) => {
     return acc.userName = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('')
   })
}

const calcUserBalance = (account) => {
 const balance =  account.movements.reduce((accumalator , currentMovement ) => {
    return accumalator + currentMovement
  }, 0)
  labelBalance.textContent = `${balance} EUR`
}

const calcUserSummary = (acc) => {
  const incomes = acc.movements.filter(movement => movement > 0).reduce((accumalator, mov) =>{
    return accumalator + mov 
  }, 0)

  const outcome = acc.movements.filter(movement => movement < 0).reduce((accumalator, mov) =>{
    return accumalator + mov 
  }, 0)

  const interest =
    acc.movements.filter(movement => movement > 0 )
    .map(deposit => (deposit * acc.interestRate )/ 1000)
    .filter((num, i , arr) => num >= 1 )
    .reduce((acc,interest) =>  acc + interest, 0)
    
  labelSumIn.textContent = `${incomes.toFixed(2)}EUR`
  labelSumOut.textContent = `${Math.abs(outcome).toFixed(2)}EUR` //Math.abs remove the negative sign
  labelSumInterest.textContent = `${interest.toFixed(2)}EUR`
}
 
 createUserNames(accounts)

 const updateUI = (acc) => {
  displayMovements(acc);
  calcUserBalance(acc);
  calcUserSummary(acc) 
 }

 btnLogin.addEventListener('click', (e) => {
  e.preventDefault()
   currentAccount = accounts.find(acc => acc.userName === inputLoginUsername.value)

  if(currentAccount?.pin === Number(inputLoginPin.value)){
    labelWelcome.textContent = `Welcome back ${currentAccount.owner.split(' ')[0]}`
    containerApp.style.opacity = 100;
    inputLoginUsername.value = inputLoginPin.value = ''
    inputLoginPin.blur() 

     updateUI(currentAccount)
 }
});

btnTransfer.addEventListener('click' , (e) => {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value)
  const recieverAccount = accounts.find(acc => acc.userName === inputTransferTo.value)
  inputTransferAmount.value = inputTransferTo.value = ''
  
  if(
    amount > 0 &&
    currentAccount.balance >= amount &&
    recieverAccount?.userName !== currentAccount.userName)
     {
        currentAccount.movements.push(-amount)
        recieverAccount.movements.push(amount)
     }

     updateUI(currentAccount)
})

btnLoan.addEventListener('click' , (e) => {
  e.preventDefault()
  const amount = +(Math.floor(inputLoanAmount.value))  //The plus sign turn it to an integer

  if(amount > 0 && currentAccount.movements.some(move => move >= amount * 0.1 )){
    currentAccount.movements.push(amount)
    updateUI(currentAccount)
  }
   inputLoanAmount.value = ''
    
})

btnClose.addEventListener('click', (e) => {
  e.preventDefault()
  if(inputCloseUsername.value === currentAccount.userName && Number(inputClosePin.value) === currentAccount.pin){
       const index = accounts.findIndex(acc => {
          return acc.userName === currentAccount.userName
       })

       accounts.splice( index, 1)
       containerApp.style.opacity = 0       
  }

  inputClosePin.value = inputCloseUsername.value = ''
})

let sorted = false

btnSort.addEventListener( 'click' , (e) => {
  e.preventDefault()
  displayMovements(currentAccount, !sorted)
  sorted = !sorted
})

//ALWAYS LOGGED IN BY account1
/*currentAccount = account1
updateUI(currentAccount)
containerApp.style.opacity = 100


const now = new Date()
const day = `${now.getDay()}`.padStart(2 , 0)
const month = `${now.getMonth() + 1 }`.padStart(2 , 0)
const year = now.getFullYear()
const hour = now.getHours()
const minutes = now.getMinutes()
labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minutes}`*/

