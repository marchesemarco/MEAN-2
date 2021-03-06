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
    res.render('addUnit', {
        title: 'Aggiungi una unità.',
    })
})

router.post('/add', function (req, res, next) { 
  let unit = req.body;
  if (!unit.Unit || !unit.Cost || !unit.Hit_Speed || !unit.Speed || !unit.Deploy_Time || !unit.Range || !unit.Target || !unit.Count  || !unit.Transport || !unit.Type || !unit.Rarity) {  //Qui dovremmo testare tutti i campi della richiesta
    res.status(500).json({success: false, message:'Error while connecting database', error:err});
    return;
  }
  let sqlInsert = `INSERT INTO dbo.[cr-unit-attributes]
                     VALUES ('${unit.Unit}','${unit.Cost}','${unit.Hit_Speed}','${unit.Speed}','${unit.Deploy_Time}','${unit.Range}','${unit.Target}','${unit.Count}','${unit.Transport}','${unit.Type}','${unit.Rarity}')`;
  executeQuery(res, sqlInsert, next, unit);
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
      renderPug(res, unit);
      return;
    });
  });
}

function renderPug(res, unit)
{
    let re = unit
    res.render('dettagli', {
          title: `Unità aggiunta: ${re.Unit}`,
          re: re,
    });
}

module.exports = router;