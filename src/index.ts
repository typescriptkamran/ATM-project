import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs'
import CheckboxPrompt from 'inquirer/lib/prompts/checkbox.js';
import { isBinaryOperatorToken } from 'typescript';

// Data Sturture to store customer information

interface Customer {
    name: string;
    debitCardNumber: string;
    pin: number;
    balance: number;
}

// to initialize an array to store custmer data

let customers: Customer[] = []; 

let currentCustomer: Customer | undefined = undefined;

// function to save customers data into a json format

const saveCustomerData = (data: Customer[]): void => {
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync('customerData.json', jsonData, 'utf8');
}

// implementation  wihtdraw and deposit functions here:

const withdrawMoney = async () => {
    const answer = await inquirer.prompt([{
        type: 'pasword',
        name: 'pin',
        message: 'Please enter your 4-digit PIN for withdrawal:',
        validate: (input) => {
            if(/^\d{4}$/.test(input) && parseInt(input, 10) === currentCustomer!.pin) {
                return true;
            }
            return 'Authentication failed. The pin is invalid'
        },
       

    },
    {
        type: 'input',
        name: 'amount',
        message: 'Enter withdrawal amount:',
        validate: (input) => {
            const amount = parseFloat(input);
            if (isNaN(amount) || amount <= 0 || amount > currentCustomer!.balance) {
                return 'Invalid amount. Please enter a valid amount';
            }

            return true
        }

        
    }

])
}

const depositMoney = async () => {
    const answer = await inquirer.prompt([{
        type: 'input',
        name: 'amount',
        message: 'Please enter the deposit amount :',
        validate: (input) => {
            const amount = parseFloat(input)
            if (isNaN(amount) || amount <= 0) {
                return 'Invalid amount. Please enter a valid amount';
            }
            return true        },
       

    },
    {
        type: 'input',
        name: 'amount',
        message: 'Enter withdrawal amount:',
        validate: (input) => {
            const amount = parseFloat(input);
            if (isNaN(amount) || amount <= 0 || amount > currentCustomer!.balance) {
                return 'Invalid amount. Please enter a valid amount';
            }

            return true
        }

        
    }

])
}




// ATM Menu or functionalies

const atmMenu = async () => {

    if (currentCustomer) {
        console.log(`welcome, ${currentCustomer.name}`);
        console.log(`Debit Card Number: ${currentCustomer.debitCardNumber}`);
        console.log(`Balance: ${currentCustomer.balance}`)

        const answer = await inquirer.prompt([{
            type: 'list',
            name: 'choice',
            message: `Pleas slect the option`,
            choices: ['Withdraw', 'Deposit Money','Check Balance', 'Exist'],
        
        
        }]);




        switch (answer.choice) {
            case 'Withdraw':
                withdrawMoney();
                break;
            case 'Deposit Money':
                depositMoney();
            case 'Check Balance':
                console.log(`Your current balance is: $${currentCustomer.balance}`);
                atmMenu();
                break;
            case 'Exit':
                console.log(`Thank you for using our ATM. Good Bye!`);
                break;                    
        }    
    }
}

// function to authenticate the user

const authenticateUser = async () => {
    console.log(chalk.green('Welcome to the ATM'));

    const anwers = await inquirer.prompt([{

        type: 'input',
        name: 'name',
        message: 'Enter your name',

    }])

    const existingCustomer = customers.find((c) => c.name === anwers.name)
    if (existingCustomer) {
        const pinAnswer = await inquirer.prompt([{
            type: 'password',
            name: 'pin',
            message: 'Enter your 4 digit PIN',
            validate: (input) => {
                if (/^\d{4}$/.test(input)) {
                    return true;
            }
            return 'PIN must be 4-digit number.';



        },
    }])
    if (existingCustomer.pin === parseInt (pinAnswer.pin, 10)) 
    {
        currentCustomer = existingCustomer;
        atmMenu();
        
    } else {
        console.log(chalk.red(`Authentication Failed. The PIN is incorrect`))
        console.log(chalk.yellow(`Please try again`));
        // main()
    }
  } else {
    console.log(chalk.red(`Authentication failed' That you are not an exisiting customer`));
    // main()
  }
}


// function to create a new debit card number

const generateRandomDebitCardNumber = () => {
    const cardNumber = `4`+ Array.from({ length: 15 }, () => Math.floor(Math.random() *10)).join('');
    return cardNumber;
}

// console.log(generateRandomDebitCardNumber())

// function to open a new account

const openAccount = async () => {
    console.log(chalk.green(`Welcome to the ATM`))

    const answer = await inquirer.prompt([{
        type: 'input',
        name: 'name',
        message: 'Enter your name:',
        validate: (input) => {
            // check if te name is already exist in customers

        const existingCustomer = customers.find((c) => c.name === input);
         if (existingCustomer) {

            return 'The customer wiht this name is already exists, please choose another name.'
        }
        
        return true

    }
        
    },
    {
        type:'input',
        name: `intialDeposit`,
        message: 'Please enter you initial deposit amount:',

    },
    {
        type:'password', // use the password type to hide pin Input
        name: 'pin',
        message: 'create your 4 digit pin:',
        validate: (input) => {
            if (/^\d{4}$/.test(input)) {
                return true;
            }
            return 'Pin must be a 4 digit number.';
        },

    }
])

const newCustomer: Customer = {
    name: answer.name,
    debitCardNumber: generateRandomDebitCardNumber(),
    pin: answer.pin,
    balance: answer.intialDeposit,
}

customers.push(newCustomer);
saveCustomerData(customers)
console.log(`Account created successfully for ${newCustomer.name}`);
console.log(`Your Debit Card Number is: ${newCustomer.debitCardNumber}`)
console.log(`Your initial ballance is:${newCustomer.balance} USD`)

currentCustomer = newCustomer

atmMenu()

};



// function to retrieve customer information form a JSON file

const retrieveCustomerData = (): Customer[] => {
    try {
        const jsonData = fs.readFileSync(('customerData.json'), 'utf-8');
        return JSON.parse(jsonData)
    } catch (error) {
        // if file does not exist or no data in file.
        return []
    
    }

} 

// Entery Poin
const main = async () => {
const cusomers = retrieveCustomerData() // load from JSON file

const answer = await inquirer.prompt([{
    type: 'list',
    name: 'action',
    message: 'Welcome to ATM, What would you like to do?:',
    choices: ['Open an Account', 'Authenticate as Existing Custoemr', 'exit'],

}

])

switch (answer.action) {
    case 'Open an Account':
        openAccount()
        break;
    case 'Authenticate as Existing Custoemr':
        authenticateUser();
        break;
    case 'Exit':
        console.log('Thank you for using ATM, Good bye!')
        break;
}
}


main()