const connection = require('../dbConnection');

class BookModel {
    constructor(){

    }

    getBooks(callback){
        if(connection){
            connection.query("select * from books", (err, rows) =>{
                if(err){
                    throw err;
                }else{
                    callback(null,rows);
                }
            });
        }
    };

    getBookById(id,callback){
        if(connection){
            connection.query('select b.* from books as b where b.ID =?',id,
            (err, row) => {
                if(err){
                    throw err;
                }else{
                    callback(null,row);
                }
            });
        }
    };

    insertBook(data, callback){
        if(connection){
            connection.query('INSERT INTO books SET ?',data, (err, result) => {
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

    updateBook(id,data, callback){
        if(connection){
            connection.query('UPDATE books SET ? WHERE id =?',[data,id],(err, result) =>{
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

}

module.exports = BookModel;