var express = require('express');
var router = express.Router();
const sql = require('mssql');

const config = {
  user: 'grossi.marco', 
  password: 'xxx123#', 
  server: "213.140.22.237", 
  database: 'grossi.marco', 
}

router.get('/', function(req, res, next){
    res.render('update', {
        title: 'Aggiorna una unità.',
    })
})

router.post('/up', function (req, res, next) { 
  let unit = req.body;
  if (!unit.Unit || !unit.Attributo || !unit.Valore ) {  //Qui dovremmo testare tutti i campi della richiesta
    res.status(500).json({success: false, message:'Error while connecting database', error:err});
    return;
  }
  let sqlUpdate = `UPDATE dbo.[cr-unit-attributes] SET ${unit.Attributo} = '${unit.Valore}' WHERE Unit = '${unit.Unit}'`
  executeQuery(res, sqlUpdate, next, unit);
});

let executeQuery = function (res, query, next, unit) {
  sql.connect(config, function (err) {
    if (err) { //Display error page
      console.log("Error while connecting database :- " + err);
      res.status(500).json({success: false, message:'Error while connecting database', error:err});
      return;
    }
    var request = new sql.Request(); // create Request object
    request.query(query, function (err, result) { //Display error page
      if (err) {
        console.log("Error while querying database :- " + err);
        res.status(500).json({success: false, message:'Error while querying database', error:err});
        sql.close();
        return;
      }
      renderPug(res);
      return;
    });
  });
}

function renderPug(res)
{
    res.redirect('/');
}

module.exports = router;