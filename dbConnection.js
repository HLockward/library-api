const mysql = require('mysql');

const libraryCredential = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'library'
};

const connection = mysql.createConnection(libraryCredential);

module.exports = connection;