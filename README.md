

# Splitzy

<p>A Full-Stack Group Expense Splitting Application</p> 

### Introduction
A full-stack expense spliting application, inspired by Splitwise. Built using JavaScript, PostgreSQL, Express, React & Nodejs. It is specially designed to split group expense between friends. You can add your expense details and get the expense analytics - Group Balance, Monthly amount spend, Catagory wise expense spending charts etc. <br />  

### Key Features
- Create user groups and track group expense 
- Keep track of shared expenses and settle your corresponding balances in a convenient and personalized way. 
- Get Analytical graphs to understand your expenditure trend 
- Multiple user registration.
- Authentication using JSON web token (JWT) 


### Technologies used
This project was created using the following technologies.

#### Frontend

- React JS
- Redux (for managing and centralizing application state)
- Axios (for making api calls)
- Material UI (for User Interface)
- Chart.js (To display various analytics graphs)
- React-chartjs-2  

#### Backend

- Express
- PostgreSQL
- JWT (For authentication)
- bcryptjs (for data encryption)

#### Database
PostgreSQL

## Configuration and Setup
In order to run this project locally, simply fork and clone the repository or download as zip and unzip on your machine. 
- Open the project in your prefered code editor.
- Go to terminal -> New terminal (If you are using VS code)
- Split your terminal into two (run the client on one terminal and the server on the other terminal)

In the first terminal - Setup Clinet 

```
$ cd client
$ pnpm install #(to install client-side dependencies)
$ pnpm start #(to start the client)
```

For setting up backend (root directory) 
- create a .env file in the root of your directory.
- Supply the following credentials

```
PORT=3001
PostgreSQL_URI=
ACCESS_TOKEN_SECRET=

```

Follow this tutorial to set PostgreSQL URI
Provide some random key in ACCESS_TOKEN_SECRET or you could generate one using node enter the below command in the terminal to genrate a random secret key 

```
node -e "console.log(require('crypto').randomBytes(256).toString('base64'));"
```

In the second terminal (*in the project root directory (back-end))

```
$ pnpm install (to install server-side dependencies)
& pnpm start (to start the server)
```
