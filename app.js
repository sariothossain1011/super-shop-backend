const express = require("express");
const app = express();
const { readdirSync } = require("fs");
const dotenv = require('dotenv');
const path = require("path");
require("./db/conn");
dotenv.config({path:'./config.env'});

// security middleware
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require('helmet');
const morgan = require("morgan");
const xssClean = require('xss-clean');
const expressMongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const ErrorHandler = require("./middleware/ErrorHandler");

// security middleware implement
app.use(cors());
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(express.json());
app.use(xssClean());
app.use(expressMongoSanitize());
app.use(helmet());
app.use(hpp());

app.use(ErrorHandler)

app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({limit: '50mb'}))

// request rate limiting 
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

readdirSync("./routes").map((r) => app.use("/api/v1", require(`./routes/${r}`)));

module.exports = app;
