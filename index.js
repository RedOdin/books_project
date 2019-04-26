const express = require("express");
const mysql = require('mysql');
var expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const fs = require("fs");

module.exports.urlencodedParser = bodyParser.urlencoded({ extended: false });
const app = express();
const connectionString = 'mysql://root:@localhost:3306/books?charset=utf8_general_ci&timezone=-0700';

const tables = ['users', 'books', 'ratings'];

var db = mysql.createConnection(connectionString);

const databaseName = 'books';
const upCaseDataBase = databaseName[0].toUpperCase() + databaseName.slice(1);
const opInsert = 'Insert';
const opUpdate = 'Update';
const internalErrorMessage = 'Oops, some internal issues occured... Please, try again!';
const OK = 200;
const CREATED = 201;
const NO_CONTENT = 204;
const BAD_REQUEST = 400;
const INTERNAL_SERVER_ERROR = 500;

db.connect((err) => {
    if (err) {
        throw(err);
    }
});

const sqlFile = fs.readFileSync('./public/create_tables.sql').toString();
const arrSql = sqlFile.split('\r\n\r\n');
for (let i in arrSql) {
    const query = db.query(arrSql[i], (err, results) => {
        if (err) {
            console.log(arrSql[i]);
            throw(err);

        }
    });
}

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;

    while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
    }
    return {
        param : formParam,
        msg   : msg,
        value : value
    };
  }
}));

module.exports.insertRow = function(table, newValues) {
    const sql = `INSERT INTO ${table} SET ${newValues};`;
    const query = db.query(sql, (err, results) => {
        let statusCode = 0;
        err ? statusCode = INTERNAL_SERVER_ERROR : statusCode = CREATED;
        return statusCode;
    });
}

module.exports.deleteRow = function(table, condition) {
    const sql = `DELETE FROM ${table} WHERE ${condition};`;
    const query = db.query(sql, (err, results) => {
        let statusCode = 0;
        err ? statusCode = INTERNAL_SERVER_ERROR : statusCode = NO_CONTENT;
        return statusCode;
    });
}

module.exports.updateRow = function(table, newValues, condition) {
    const sql = `UPDATE ${table} SET ${newValues} WHERE ${condition};`;
    const query = db.query(sql, (err, results) => {
        let statusCode = 0;
        err ? statusCode = INTERNAL_SERVER_ERROR : statusCode = NO_CONTENT;
        return statusCode;
    });
}

app.get('/', function(req, res) {
    res.render('index', {database: upCaseDataBase,
        tables: tables});
});

const routerTable1 = require(`./routes/${tables[0]}`);
const routerTable2 = require(`./routes/${tables[1]}`);
const routerTable3 = require(`./routes/${tables[2]}`);

app.use(`/${tables[0]}`, routerTable1);
app.use(`/${tables[1]}`, routerTable2);
app.use(`/${tables[2]}`, routerTable3);

module.exports.upCaseDataBase = upCaseDataBase;
module.exports.opInsert = opInsert;
module.exports.opUpdate = opUpdate;
module.exports.internalErrorMessage = internalErrorMessage;
module.exports.OK = OK;
module.exports.CREATED = CREATED;
module.exports.NO_CONTENT = NO_CONTENT;
module.exports.BAD_REQUEST = BAD_REQUEST;
module.exports.INTERNAL_SERVER_ERROR = INTERNAL_SERVER_ERROR;
module.exports.db = db;

app.listen(3001);
