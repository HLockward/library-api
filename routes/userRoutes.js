const UserModel = require('../models/userModel');
const Joi = require('joi');

const userModel = new UserModel();

const userRoutes = (app) =>
{

      const validateParams = (params) =>{
        const schema = {
          id: Joi.number().required()
        }
        return Joi.validate(params,schema);
      }
      
      const validateUserCreation = (user) => {
        const schema = {
          user_name: Joi.string().min(5).max(60).required(),
          password: Joi.string().min(5).max(60).required(),  
          name: Joi.string().min(5).max(80).required(),
          last_name: Joi.string().min(5).max(80).required(),
          created_by: Joi.number().required()
        };
        return Joi.validate(user, schema);
      }
      
      const validateUserUpdating = (user) => {
        const schema = {
          user_name: Joi.string().min(5).max(60),
          password: Joi.string().min(5).max(60),
          name: Joi.string().min(5).max(80),
          last_name: Joi.string().min(5).max(80),
          created_by: Joi.number()
        };
        return Joi.validate(user, schema);
      }
      
      
      app.get('/api/users', (req,res) => {
        userModel.getUsers((err, data) => {
            if(typeof data === 'undefined' || data.length < 1){
                return res.status(404).send("Not data.");
            }
            res.json(data);
        });
      });
      
      app.get('/api/users/:id', (req,res) => {

        const {error} = validateParams(req.params);
        if(error){
          return res.status(400).send(error.details[0].message);
        }

        const id = parseInt(req.params.id);

        userModel.getUserById(id,(err,data) =>{
          if(typeof data === 'undefined' || data.length < 1){
            return res.status(404).send("The user with the given ID was not Found.");
          }
          res.json(data);
        });
      });
      
      app.post('/api/users',(req,res) =>{

        const user = {
            user_name : req.body.user_name,
            password: req.body.password,
            name: req.body.name,
            last_name: req.body.last_name,
            created_by: req.body.created_by
        };

        const {error} = validateUserCreation(user);
        
        if(error){
          return res.status(400).send(error.details[0].message);
        }
      
        userModel.insertUser(user,(err,data) =>{
          if(typeof data === 'undefined' || data.insertId){
            res.json({
              success: true,
              msg: 'user inserted',
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
      
      
      app.put('/api/users/:id', (req,res) =>{

        if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
            return res.json(500,{"msg":"theres isn't value to update"}); 
        }

        const params = validateParams(req.params);
        if(params.error){
          return res.status(400).send(params.error.details[0].message);
        }
        const id = parseInt(req.params.id);

        userModel.getUserById(id,(err,data) =>{
            if(typeof data === 'undefined' || data.length < 1){
              return res.status(404).send("The user with the given ID was not Found.");
            }

        const {error} = validateUserUpdating(req.body);
        if(error){
          return res.status(400).send(error.details[0].message);
        }
        const user = req.body;

        

          userModel.updateUser(id,user,(err,data) =>{
            if(typeof data === 'undefined' || data){
              res.json({
                success: true,
                msg: 'user updated',
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
      
      app.delete('/api/users/:id', (req,res) => {
        
        const {error} = validateParams(req.params);
        if(error){
          return res.status(400).send(error.details[0].message);
        }

        const id = parseInt(req.params.id);
      
        userModel.getUserById(id,(err,data) =>{
          if(typeof data === 'undefined' || data.length < 1){
            return res.status(404).send("The user with the given ID was not Found.");
          }

          userModel.deleteUser(id,(err,data) =>{
            if(typeof data === 'undefined' || data){
              res.json({
                success: true,
                msg: 'user deleted',
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

module.exports = userRoutes;