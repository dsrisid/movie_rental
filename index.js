/* ver 2: mw functions for logging and authentication*/
const startupDebugger = require("debug")("app:startup");
const config = require('config');
const express = require('express');
const app = express();
const logger = require('./middleware/logger');
const genres = require('./routes/genres');
const home = require('./routes/home');
const authenticator = require('./middleware/authenticator');


app.use(express.json());
app.use(logger);
app.use(authenticator);
app.use(express.static("public"));

app.set("view engine","pug");
app.set("views","views");//the location where view templates are available and this is the default location.

startupDebugger(`Application name:${config.get("name")}`);
startupDebugger(`mail password:${config.get("mail.password")}`)

app.use("/",home);
app.use("/api/genres",genres);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => startupDebugger(`listening at port ${PORT}...`));
