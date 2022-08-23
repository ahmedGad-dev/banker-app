'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-07-26T17:01:17.194Z",
    "2020-07-28T23:36:17.929Z",
    "2020-08-01T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};
const accounts = [account1, account2];



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

let currentAccount, timer;
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const formatDisplayDates = (date) =>{
    const calculateDaysPassed = (date1, date2) => Math.round(Math.abs(date2 - date1) / (24 * 60 * 60 * 1000))
    const daysPassed = calculateDaysPassed(new Date(), date)
    if(daysPassed === 0) return 'Today'
    if(daysPassed === 1) return 'yesterday'
    if(daysPassed <= 7 ) return `${daysPassed} days ago`
    else{
      const day = `${date.getDay()}`.padStart(2 , 0)
      const month = `${date.getMonth() + 1 }`.padStart(2 , 0)
      const year = date.getFullYear()
      return `${day}/${month}/${year}`
    }
}


const startLogOutTimer = () => {
  let time = 300
  const tick = () => {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`

    if(time === 0){
      clearInterval(timer)
      containerApp.style.opacity = 0;
      labelWelcome.textContent = "Login to start"
    }   
    
    time--
  }
     
     tick()
     timer = setInterval(tick, 1000)
}


const displayMovements = (account , sort = false) => {
  containerMovements.innerHTML = ''

  const movs = sort ?  account.movements.slice().sort((a,b) => a - b) : account.movements
  
  movs.forEach((movement, index) => {
    const type = movement > 0 ? 'deposit' : 'withdrawal'

    //Setting the current date
    const date = new Date(account.movementsDates[index])
    const displayDate = formatDisplayDates(date)

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${index + 1} ${type}</div>
      <div class="movements__date">${displayDate}</div>
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
  account.balance = balance
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
       
      // mainatinaning the timer
      if(timer) clearInterval(timer);      
      timer = startLogOutTimer()
      updateUI(currentAccount)
    }

   //create the dates
   const now = new Date()
   const day = `${now.getDay()}`.padStart(2 , 0)
   const month = `${now.getMonth() + 1 }`.padStart(2 , 0)
   const year = now.getFullYear()
   const hour = now.getHours()
   const minutes = now.getMinutes()
   labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minutes}`
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

     currentAccount.movementsDates.push(new Date().toISOString())
     recieverAccount.movementsDates.push(new Date().toISOString())

     updateUI(currentAccount)

    // clearInterval(timer)
    // timer = startLogOutTimer()
})

btnLoan.addEventListener('click' , (e) => {
  e.preventDefault()
  const amount = +(Math.floor(inputLoanAmount.value))  //The plus sign turn it to an integer

  if(amount > 0 && currentAccount.movements.some(move => move >= amount * 0.1 )){
    setTimeout(() => {
      currentAccount.movements.push(amount)
      currentAccount.movementsDates.push(new Date().toISOString())
     
       // reset timer
   //   clearInterval(timer)
   //   timer = startLogOutTimer() 

      updateUI(currentAccount)
    }, 3000)
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

