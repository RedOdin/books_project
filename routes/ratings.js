const express = require('express');
const router = express.Router();
const ind = require('../index.js');
// Some information for queries
const table = 'ratings';

// Some information for UI
const columns = ['#', 'id_users', 'id_books'];
const upCaseColumns = ['#', 'Id users', 'Id books'];

// Some information for routing
const changeRoute = 'change/ratings';

// Some validation information
const loginMax = 50;
const nameMax = 50;
const passwordMin = 8;
const passwordMax = 20;

// Some validation messages
const msgLoginIncorrect = 'E-mail should be a valid email!';
const msgLoginMax = `E-mail must contain not more than ${loginMax} symbols!`;

const msgPasswordMin = `Password must contain at least ${passwordMin} symbols!`;
const msgPasswordMax = `Password must contain not more than ${passwordMax} symbols!`;
const msgPasswordAsciiOnly = 'Password may contain only ASCII symbols!';
const msgPasswordDigits = 'Password must contain at least 1 digital!';
const msgPasswordLowLatin = 'Password must contain at least 1 latin lowercase letter!';
const msgPasswordUpLatin = 'Password must contain at least 1 latin uppercase letter!';

const msgNameNotEmpty = "Name is required!";
const msgNameMax = `Name must contain not more than ${nameMax} symbols!`;
const msgNamePattern = 'Invalid name!';

router.post('/delete/:id', ind.urlencodedParser, function(req, res) {
    const statusCode = ind.deleteRow(table, `id = ${req.params.id}`)
    res.status(statusCode).redirect(`/${table}`);
});

var operation = null;
var id = 0;

router.post('/insert', ind.urlencodedParser, function(req, res) {

  operation = ind.opInsert;
  id = 0;

  res.status(ind.OK).render(changeRoute, {database: ind.upCaseDataBase,
      table: table, columns: columns, upCaseColumns: upCaseColumns,
      operation: operation, rows: null, errors: null});

});

router.post('/update/:id', ind.urlencodedParser, function(req, res) {

  operation = ind.opUpdate;
  id = req.params.id;

  const sql = `SELECT * FROM ${table} WHERE id = ${id};`;
  console.log(sql);
  const query = ind.db.query(sql, (err, rows) => {
      if (err) {
          res.status(ind.INTERNAL_SERVER_ERROR).send(internalErrorMessage);
      }
      else {
          res.status(ind.OK).render(changeRoute, {database: ind.upCaseDataBase,
              table: table, columns: columns, upCaseColumns: upCaseColumns,
              operation: operation, rows: rows, errors: null});
      }
  });

});

function validateRequest(req) {

  return req.validationErrors();

}

router.post('/save', ind.urlencodedParser, function(req, res) {
    const errors = validateRequest(req);
    if (errors) {
        res.status(ind.BAD_REQUEST).render(changeRoute, {
            database: ind.upCaseDataBase, table: table,
            columns: columns, upCaseColumns: upCaseColumns,
            operation: operation, rows: null, errors: errors});
    }
    else {

        const newValues = `id_users = "${req.body.id_users}
            ", id_books = "${req.body.id_books}"`;
        let statusCode = 0;
        if (operation == ind.opInsert) {
            statusCode = ind.insertRow(table, newValues);
        }
        else {
            statusCode = ind.updateRow(table, newValues, `id = ${id}`);
        }

        res.status(statusCode).redirect('.');

    }
});

router.use('/', ind.urlencodedParser, function(req, res) {
    const sql = `SELECT * FROM ${table} ORDER BY id ASC;`;
    const query = ind.db.query(sql, (err, rows) => {
        if (err) {
            res.status(ind.INTERNAL_SERVER_ERROR).send(ind.internalErrorMessage);
        }
        else {
            res.status(ind.OK).render('table', {database: ind.upCaseDataBase,
                table: table, columns: columns, upCaseColumns: upCaseColumns,
                rows: rows});
        }
    });
});

module.exports = router;
