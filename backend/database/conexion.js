const mysql = require('mysql2');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'macbookpassword',
        database:'rifa',
    }
);

db.connect((err)=>{
    if(err) {
        throw err;
    }

    console.log('Base de datos Conectada')

});

module.exports = db;
