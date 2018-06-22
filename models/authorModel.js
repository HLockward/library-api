const connection = require('../dbConnection');

class AuthorModel {
    constructor(){

    }

    getAuthors (callback){
        if(connection){
            connection.query("select * from authors ", (err, rows) =>{
                if(err){
                    throw err;
                }else{
                    callback(null,rows);
                }
            });
        }
    };

    getAuthorById(id,callback){
        if(connection){
            connection.query('select a.* from authors  as a where a.ID =?',id,
            (err, row) => {
                if(err){
                    throw err;
                }else{
                    callback(null,row);
                }
            });
        }
    };

    insertAuthor(data, callback){
        if(connection){
            connection.query('INSERT INTO authors  SET ?',data, (err, result) => {
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

    updateAuthor(id,data, callback){
        if(connection){
            connection.query('UPDATE authors  SET ? WHERE id =?',[data,id],(err, result) =>{
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

    deleteAuthor(id,callback){
        if(connection){
            connection.query('DELETE FROM library.authors  WHERE ID =?',id,(err,result) => {
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

module.exports = AuthorModel;