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
            connection.query(`select b.* from books as b where b.ID = ${id}`,
            (err, row) => {
                if(err){
                    throw err;
                }else{
                    callback(null,row);
                }
            });
        }
    };
}

module.exports = BookModel;