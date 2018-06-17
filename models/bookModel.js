const connection = require('../dbConnection');

class BookModel {
    constructor(){

    }

    getBooks(callback){
        if(connection){
            connection.query("select * from books", (err, rows) =>{
                if(err){
                    throw error;
                }else{
                    callback(null,rows);
                }
            })
        }
    };
}

module.exports = BookModel;