/* ver 2: mw functions for logging and authentication*/
const startupDebugger = require("debug")("app:startup");
const invokeDebugger = require("debug")("app:invoke");
const config = require('config');
const express = require('express');
const app = express();
const Joi = require('@hapi/joi');
const logger = require('./logger');
const authenticator = require('./authenticator');

app.set("view engine","pug");
app.set("views","./views");//the location where view templates are available and this is the default location.
app.use(express.json());
app.use(logger);
app.use(authenticator);
app.use(express.static("public"));


startupDebugger(`Application name:${config.get("name")}`);
startupDebugger(`mail password:${config.get("mail.password")}`)
const genres = [
  {"id":1,"name":"Action"},
  {"id":2,"name":"Horror"},
  {"id":3, "name":"Romance"}
];

app.get("/",(req,res)=>{
  res.render("index",{title:"My Express App", message:"Hello World!!"});
});

app.get("/api/genres/:id",(req,res)=>{
  invokeDebugger("GET of /api/geners/:id invoked");
  const genre = genres.find(g => g.id === parseInt(req.params.id));
  if(!genre) return res.status(404).send(`Genre with id ${req.params.id}`);
  res.send(genre);
});

app.get("/api/genres",(req,res)=>{
  invokeDebugger("GET of /api/geners/:id invoked");
  res.send(genres);
});

app.post("/api/genres/",(req,res)=>{
  invokeDebugger("POST of /api/geners/:id invoked");
  const {error} = validateGenre(req.body);
  if(error) return res.status(400).send(error.details[0].message);
  const genre = {
    "id":genres.length+1,
    "name":req.body.name
  }
  genres.push(genre);
  res.send(genre);
});
app.put("/api/genres/:id",(req,res)=>{
  invokeDebugger("PUT of /api/geners/:id invoked");
  const genre = genres.find(g => g.id === parseInt(req.params.id));
  if(!genre) return res.status(404).send(`Genre with id ${req.params.id}`);
  const {error} = validateGenre(req.body);
  if(error) return res.status(400).send(error.details[0].message);
  genre.name = req.body.name;
  res.send(genre);
});

app.delete("/api/genres/:id",(req,res)=>{
  invokeDebugger("DELETE of /api/geners/:id invoked");
  const genre = genres.find(g => g.id === parseInt(req.params.id));
  if(!genre) return res.status(404).send(`Genre with id ${req.params.id}`);
  const idx = genres.indexOf(genre);
  genres.splice(idx,1);
  res.send(genre);
});

function validateGenre(genre){
  const schema = Joi.object().keys({
    name: Joi.string().min(3).required()
  });

  return Joi.validate(genre,schema);
}


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => startupDebugger(`listening at port ${PORT}...`));
