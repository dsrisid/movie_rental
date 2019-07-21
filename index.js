const express = require('express');
const app = express();
const Joi = require('@hapi/joi');
app.use(express.json());

const genres = [
  {"id":1,"name":"Action"},
  {"id":2,"name":"Horror"},
  {"id":3, "name":"Romance"}
];

app.get("/api/genres/:id",(req,res)=>{
  console.log("/api/genres/:id");
  const genre = genres.find(g => g.id === parseInt(req.params.id));
  if(!genre) return res.status(404).send(`Genre with id ${req.params.id}`);
  res.send(genre);
});

app.get("/api/genres",(req,res)=>{
  res.send(genres);
});

app.post("/api/genres/",(req,res)=>{
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
  const genre = genres.find(g => g.id === parseInt(req.params.id));
  if(!genre) return res.status(404).send(`Genre with id ${req.params.id}`);
  const {error} = validateGenre(req.body);
  if(error) return res.status(400).send(error.details[0].message);
  genre.name = req.body.name;
  res.send(genre);
});

app.delete("/api/genres/:id",(req,res)=>{
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
app.listen(PORT, () => console.log(`listening at port ${PORT}...`));
