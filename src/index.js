import inquirer from 'inquirer';
import chalk from 'chalk';
// to initialize an array to store custmer data
let custmers = [];
// for each custmer data in the array
let currentCustomer = undefined;
// function to create a new debit card number
const generateRandomDebitCardNumber = () => {
    const cardNumber = `4` + Array.from({ length: 15 }, () => Math.floor(Math.random() * 10)).join('');
    return cardNumber;
};
// console.log(generateRandomDebitCardNumber())
// function to open a new account
const openAccount = async () => {
    console.log(chalk.green(`Welcome to the ATM`));
    const answer = await inquirer.prompt([{
            type: 'input',
            name: 'name',
            message: 'Enter your name:',
            validate: (input) => {
                // check if te name is already exist in customers
                const existingCustomer = customers.find((c) => c.name === input);
                if (existingCustomer) {
                    return 'The customer wiht this name is already exists, please choose another name.';
                }
            }
        }]);
};
