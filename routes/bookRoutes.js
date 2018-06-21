const BookModel = require('../models/bookModel');
const Joi = require('joi');

const bookModel = new BookModel();

const bookRoutes = (app) =>
{

    app.get('/', (req, res) => res.send('Welcome to my API!!'));

    const books = [
        {id: 1, name: "como la has cagado", author: "Harold Lockward"},
        {id: 2, name: "por que ser responsable no deja", author: "Harold Lockward"},
        {id: 3, name: "vive la vida como un perro", author:"Harold Lockward"}
      ];
      
      const validateBook = (book) => {
        const schema = {
          name: Joi.string().min(5).max(100).required(),
          description: Joi.string(),
          author_id: Joi.number().required(),
          gender_id: Joi.number().required(),
          created_by: Joi.number().required()
        };
        return Joi.validate(book, schema);
      }
      
      
      
      app.get('/api/books', (req,res) => {
        bookModel.getBooks((err, data) => {
          res.json(data);
        });
      });
      
      app.get('/api/books/:id', (req,res) => {
        const id = parseInt(req.params.id);
        if(isNaN(id)){
          return res.json(500,{"msg":"The id must be numeric"});
        }
        bookModel.getBookById(id,(err,data) =>{
          if(typeof data === 'undefined' || data.length < 1){
            return res.status(404).send("The book with the given ID was not Found.");
          }
          res.json(data);
        });
      });
      
      app.post('/api/books',(req,res) =>{
        
        const {error} = validateBook(req.body);
        
        if(error){
          return res.status(400).send(error.details[0].message);
        }
      
        const book = {
          id: null,
          name: req.body.name,
          description: req.body.description,
          author_id: req.body.author_id,
          gender_id: req.body.gender_id,
          created_by: req.body.created_by,
          created_at : null
        };
       
        bookModel.insertBook(book,(err,data) =>{
          if(typeof data === 'undefined' || data.insertId){
            res.json({
              success: true,
              msg: 'Book inserted',
              data:data
            });
          }else{
            res.status(500).json({
              success: false,
              msg: 'Error'
            });
          }
        });
      });
      
      
      app.put('/api/books/:id', (req,res) =>{
        const id = parseInt(req.params.id);
        if(isNaN(id)){
          return res.json(500,{"msg":"The id must be numeric"});
        }

        const book = {
          name: req.body.name,
          description: req.body.description,
          author_id: req.body.author_id,
          gender_id: req.body.gender_id,
          created_by: req.body.created_by
        };

        bookModel.getBookById(id,(err,data) =>{
          if(typeof data === 'undefined' || data.length < 1){
            return res.status(404).send("The book with the given ID was not Found.");
          }

          bookModel.updateBook(id,book,(err,data) =>{
            if(typeof data === 'undefined' || data){
              res.json({
                success: true,
                msg: 'Book updated',
                data:data
              });
            }else{
              res.status(500).json({
                success: false,
                msg: 'Error'
              });
            }
          });

          
        });

        
      /*
        const {error} = validateBook(req.body);
        
        if(error){
          return res.status(400).send(error.details[0].message); 
        }
      
        book.name = req.body.name;
        res.json(book);*/
      
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
      
};

module.exports = bookRoutes;