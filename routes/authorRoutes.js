const AuthorModel = require('../models/authorModel');
const Joi = require('joi');

const authorModel = new AuthorModel();

const authorRoutes = (app) =>
{

      const validateParams = (params) =>{
        const schema = {
          id: Joi.number().required()
        }
        return Joi.validate(params,schema);
      }
      
      const validateAuthorCreation = (author) => {
        const schema = {
          name: Joi.string().min(5).max(80).required(),
          last_name: Joi.string().min(5).max(80).required(),
          description: Joi.string(),
          created_by: Joi.number().required()
        };
        return Joi.validate(author, schema);
      }
      
      const validateAuthorUpdating = (author) => {
        const schema = {
          name: Joi.string().min(5).max(80),
          last_name: Joi.string().min(5).max(80),
          description: Joi.string(),
          created_by: Joi.number()
        };
        return Joi.validate(author, schema);
      }
      
      
      app.get('/api/authors', (req,res) => {
        authorModel.getAuthors((err, data) => {
            if(typeof data === 'undefined' || data.length < 1){
                return res.status(404).send("Not data.");
            }
            res.json(data);
        });
      });
      
      app.get('/api/authors/:id', (req,res) => {

        const {error} = validateParams(req.params);
        if(error){
          return res.status(400).send(error.details[0].message);
        }

        const id = parseInt(req.params.id);

        authorModel.getAuthorById(id,(err,data) =>{
          if(typeof data === 'undefined' || data.length < 1){
            return res.status(404).send("The author with the given ID was not Found.");
          }
          res.json(data);
        });
      });
      
      app.post('/api/authors',(req,res) =>{
        
        const {error} = validateAuthorCreation(req.body);
        
        if(error){
          return res.status(400).send(error.details[0].message);
        }
      
        const author = {
          name: req.body.name,
          last_name: req.body.last_name,
          description: req.body.description,
          created_by: req.body.created_by
        };
       
        authorModel.insertAuthor(author,(err,data) =>{
          if(typeof data === 'undefined' || data.insertId){
            res.json({
              success: true,
              msg: 'author inserted',
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
      
      
      app.put('/api/authors/:id', (req,res) =>{

        const params = validateParams(req.params);
        if(params.error){
          return res.status(400).send(params.error.details[0].message);
        }
        const id = parseInt(req.params.id);

        if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
          return res.json(500,{"msg":"theres isn't value to update"}); 
        }

        const {error} = validateAuthorUpdating(req.body);
        if(error){
          return res.status(400).send(error.details[0].message);
        }
        const author = req.body;

        authorModel.getAuthorById(id,(err,data) =>{
          if(typeof data === 'undefined' || data.length < 1){
            return res.status(404).send("The author with the given ID was not Found.");
          }

          authorModel.updateAuthor(id,author,(err,data) =>{
            if(typeof data === 'undefined' || data){
              res.json({
                success: true,
                msg: 'author updated',
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
      
      app.delete('/api/authors/:id', (req,res) => {
        
        const {error} = validateParams(req.params);
        if(error){
          return res.status(400).send(error.details[0].message);
        }

        const id = parseInt(req.params.id);
      
        authorModel.getAuthorById(id,(err,data) =>{
          if(typeof data === 'undefined' || data.length < 1){
            return res.status(404).send("The author with the given ID was not Found.");
          }

          authorModel.deleteAuthor(id,(err,data) =>{
            if(typeof data === 'undefined' || data){
              res.json({
                success: true,
                msg: 'author deleted',
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

module.exports = authorRoutes;