const express = require('express');
const Joi = require('joi');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

const books = [
  {id: 1, name: "como la has cagado", author: "Harold Lockward"},
  {id: 2, name: "por que ser responsable no deja", author: "Harold Lockward"},
  {id: 3, name: "vive la vida como un perro", author:"Harold Lockward"}
];

const validateBook = (book) => {
  const schema = {
    name: Joi.string().min(3).required()
  };
  return Joi.validate(book, schema);
}

app.get('/', (req, res) =>
    res.send('Welcome to my API!!')
);

app.get('/api/books', (req,res) => res.json(books));

app.get('/api/books/:id', (req,res) => {
  const id = parseInt(req.params.id);
  const book = books.find(b => b.id === id);
  if(!book){
   return res.status(404).send("The book with the given ID was not Found.");
  }
  res.json(book);
})

app.post('/api/books',(req,res) =>{
  
  const {error} = validateBook(req.body);
  
  if(error){
    return res.status(400).send(error.details[0].message);
  }

  const book = {
    id: books.length + 1,
    name: req.body.name
  };
  books.push(book);
  res.json(book);

});


app.put('/api/books/:id', (req,res) =>{
  const id = parseInt(req.params.id);
  const book = books.find(b => b.id === id);
  if(!book){
    return res.status(404).send("The book with the given ID was not Found.");
  } 

  const {error} = validateBook(req.body);
  
  if(error){
    return res.status(400).send(error.details[0].message); 
  }

  book.name = req.body.name;
  res.json(book);

});

app.delete('/api/books/:id', (req,res) => {
  const id = parseInt(req.params.id);
  const book = books.find(b => b.id === id);
  if(!book){
    return res.status(404).send("The book with the given ID was not Found.");
  } 

  const index = books.indexOf(book);
  books.splice(index,1);

  res.json(book);

});



app.listen(port,() =>
  console.log(`Running on PORT ${port}`)  
);

