const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const {graphqlHTTP} = require('express-graphql');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

mongoose.connect(
    process.env.DB_CONNECT,
()=>console.log('Connected to Database'));


app.get('/',(req,res)=>res.send('Check If Server Is Running'));

app.use(bodyParser.json());
app.use(cors());

const loggingMiddleware = (req, res, next) => {
    next();
}

app.use(loggingMiddleware)

const Schema = require('./graphql/hospital/schema');
const Resolver = require('./graphql/hospital/resolver');

app.use(
    '/hospital',
    graphqlHTTP({
        schema:Schema , 
        rootValue:Resolver,
        graphiql:true
    })
)

var fn = require('./TensorFlow/predict')

app.post('/predict',fn.trainAndPredict)




app.listen(process.env.PORT || 5000,console.log("Server Running"))