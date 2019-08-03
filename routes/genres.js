const express = require('express');
const router = express.Router();
const invokeDebugger = require("debug")("app:invoke");
const Joi = require('@hapi/joi');

const genres = [
  {"id":1,"name":"Action"},
  {"id":2,"name":"Horror"},
  {"id":3, "name":"Romance"}
];

router.get("/:id",(req,res)=>{
  invokeDebugger("GET of /api/geners/:id invoked");
  const genre = genres.find(g => g.id === parseInt(req.params.id));
  if(!genre) return res.status(404).send(`Genre with id ${req.params.id}`);
  res.send(genre);
});

router.get("/",(req,res)=>{
  invokeDebugger("GET of /api/geners/:id invoked");
  res.send(genres);
});

router.post("/",(req,res)=>{
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
router.put("/:id",(req,res)=>{
  invokeDebugger("PUT of /api/geners/:id invoked");
  const genre = genres.find(g => g.id === parseInt(req.params.id));
  if(!genre) return res.status(404).send(`Genre with id ${req.params.id} not found`);
  const {error} = validateGenre(req.body);
  if(error) return res.status(400).send(error.details[0].message);
  genre.name = req.body.name;
  res.send(genre);
});

router.delete("/:id",(req,res)=>{
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

module.exports = router;
