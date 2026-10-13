const express = require('express');
const cookieParser = require('cookie-parser');



const authRouter = require('./routes/auth.routes');
const accountRouter = require('../src/routes/account.route')
const transactionRoutes = require('../src/routes/transaction.route')


const app = express();
app.use(express.json())

app.use(cookieParser())


app.use("/api/auth", authRouter)
app.use("/api/account", accountRouter)
app.use("/api/transactions", transactionRoutes)


module.exports = app;