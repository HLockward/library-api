const connection = require('../dbConnection');

class UserModel {
    constructor(){

    }

    getUsers (callback){
        if(connection){
            connection.query("select * from users ", (err, rows) =>{
                if(err){
                    throw err;
                }else{
                    callback(null,rows);
                }
            });
        }
    };

    getUserById(id,callback){
        if(connection){
            connection.query('select a.* from users  as a where a.ID =?',id,
            (err, row) => {
                if(err){
                    throw err;
                }else{
                    callback(null,row);
                }
            });
        }
    };

    insertUser(data, callback){
        if(connection){
            connection.query('INSERT INTO users  SET ?',data, (err, result) => {
                if(err) {
                    throw err;
                }else{
                    callback(null, {
                        'insertId': result.insertId
                    })
                }
            });
        }
    }

    updateUser(id,data, callback){
        if(connection){
            connection.query('UPDATE users  SET ? WHERE id =?',[data,id],(err, result) =>{
                if(err){
                    throw err;
                }else{
                    callback(null,{
                        msg: result.message
                    })
                }
            });
        }
    }

    deleteUser(id,callback){
        if(connection){
            connection.query('DELETE FROM library.users  WHERE ID =?',id,(err,result) => {
                if(err){
                    throw err;
                }else{
                    callback('null',{
                        msg: result.message
                    })
                }
            });
        }
    }

}

module.exports = UserModel;