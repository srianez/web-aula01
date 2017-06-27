const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const dbFolder = __dirname + '/db';
const contatosDbPath = dbFolder + '/contatos.json';

var app = express();

var tryRead = function(path, callback) {
    fs.readFile(path, 'utf8', function (err, contatos) {
        if (err) return callback([]);
        var contatosJSON = [];
        try {
            contatosJSON = JSON.parse(contatos);
        } catch (error) { }

        return callback(contatosJSON);
    });
}

if (!fs.existsSync(dbFolder)) {
    fs.mkdirSync(dbFolder);
}

app.use(express.static(path.join(__dirname,'dist')));

app.listen(process.env.PORT || 3000, function () {
    console.log('escutanto a porta 3000');
});

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

app.post('/api/contato', function (req, res) {
  //console.log(JSON.stringify(req.body));
  
  tryRead(contatosDbPath, function(contatos) {
      
      contatos.push(req.body);

      fs.writeFile(contatosDbPath, JSON.stringify(contatos), function (err) {
          if (err) {
              res.status(500).json({error: 'Erro. tente novamente mais tarde!'});
              return;
          }

          res.status(200).json({ success: true});
      });
  });
  
});


app.get('/api/artigos', function(req, res) {
    const artigosDbPath = dbFolder + '/artigos.json';
    tryRead(artigosDbPath, function(artigos){
        res.status(200).json(artigos);
    });
});

app.get('/api/artigo/*', function(req,res){
    const artigosDbPath = dbFolder + '/artigos.json';
    tryRead(artigosDbPath, function(artigos){

        var artigo = artigos.filter((artigo) => {
           return parseInt(artigo.id) == parseInt(req.params[0]);
        });

        res.status(200).json(artigo[0]);
    });
});

app.get('*', function (req, res) {
    res.status(404).send({error: 'API Not Found'});
});

