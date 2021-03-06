const BookModel = require('../models/bookModel');
const Joi = require('joi');

const bookModel = new BookModel();

const bookRoutes = (app) =>
{

      const validateParams = (params) =>{
        const schema = {
          id: Joi.number().required()
        }
        return Joi.validate(params,schema);
      }
      
      const validateBookCreation = (book) => {
        const schema = {
          name: Joi.string().min(5).max(100).required(),
          description: Joi.string(),
          author_id: Joi.number().required(),
          gender_id: Joi.number().required(),
          created_by: Joi.number().required()
        };
        return Joi.validate(book, schema);
      }
      
      const validateBookUpdating = (book) => {
        const schema = {
          name: Joi.string().min(5).max(100),
          description: Joi.string(),
          author_id: Joi.number(),
          gender_id: Joi.number(),
          created_by: Joi.number()
        };
        return Joi.validate(book, schema);
      }
      
      
      app.get('/api/books', (req,res) => {
        bookModel.getBooks((err, data) => {
          if(typeof data === 'undefined' || data.length < 1){
            return res.status(404).send("Not data.");
          }
          res.json(data);
        });
      });
      
      app.get('/api/books/:id', (req,res) => {

        const {error} = validateParams(req.params);
        if(error){
          return res.status(400).send(error.details[0].message);
        }

        const id = parseInt(req.params.id);

        bookModel.getBookById(id,(err,data) =>{
          if(typeof data === 'undefined' || data.length < 1){
            return res.status(404).send("The book with the given ID was not Found.");
          }
          res.json(data);
        });
      });
      
      app.post('/api/books',(req,res) =>{
        
        const {error} = validateBookCreation(req.body);
        
        if(error){
          return res.status(400).send(error.details[0].message);
        }
      
        const book = {
          name: req.body.name,
          description: req.body.description,
          author_id: req.body.author_id,
          gender_id: req.body.gender_id,
          created_by: req.body.created_by
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

        const params = validateParams(req.params);
        if(params.error){
          return res.status(400).send(params.error.details[0].message);
        }
        const id = parseInt(req.params.id);

        if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
          return res.json(500,{"msg":"theres isn't value to update"}); 
        }

        const {error} = validateBookUpdating(req.body);
        if(error){
          return res.status(400).send(error.details[0].message);
        }
        const book = req.body;

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
      
      });
      
      app.delete('/api/books/:id', (req,res) => {
        
        const {error} = validateParams(req.params);
        if(error){
          return res.status(400).send(error.details[0].message);
        }

        const id = parseInt(req.params.id);
      
        bookModel.getBookById(id,(err,data) =>{
          if(typeof data === 'undefined' || data.length < 1){
            return res.status(404).send("The book with the given ID was not Found.");
          }

          bookModel.deleteBook(id,(err,data) =>{
            if(typeof data === 'undefined' || data){
              res.json({
                success: true,
                msg: 'Book deleted',
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
      });
      
};

module.exports = bookRoutes;