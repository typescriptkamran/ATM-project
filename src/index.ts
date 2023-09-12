import inquirer from 'inquirer';
import chalk from 'chalk';

// Data Sturture to store customer information

interface Customer {
    name: string;
    debitCardNumber: string;
    Pin: number;
    balance: number;
}

// to initialize an array to store custmer data

let custmers: Customer[] = []; 