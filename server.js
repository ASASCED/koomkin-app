//import * as express from 'express';
//import * as path from 'path';
//import * as favicon from 'serve-favicon';
//import * as logger from 'morgan';
//import * as cookieParser from 'cookie-parser';
//import * as bodyParser from 'body-parser';
//import * as db from './db';
//import * as _ from 'underscore';
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const db = require('./db.js');
const _ = require('underscore');

let app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
//app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, '')));

app.get('/upcoming', (req, res) => {
    res.json({'itworks': 'yes'});
});

app.get('/', (req, res, next) => {
    res.sendFile('index.html', {root: __dirname});
});

app.get('/getLead30Dias/:id',(req, res)  =>  {
    let id = parseInt(req.params.id, 10);
    let command = 'SP_GetLead30Dias';
    db.executeGetById(id, command,  (err, rows) =>  {
        if (err) {
            res.status(500).json({error: err}).send();
        } else {
            res.json(rows);
        }
    });
});

app.get('/getLead12Meses/:id', (req, res)  => {
    let id = parseInt(req.params.id, 10);
    let command = 'SP_GetLead12Meses';
    db.executeGetById(id, command, (err, rows) =>  {
        if (err) {
            res.status(500).json({error: err}).send();
        } else {
            res.json(rows);
        }
    });
});

app.get('/getLike30Dias/:id', (req, res) => {
    let id = parseInt(req.params.id, 10);
    let command = 'SP_GetLike30Dias';
    db.executeGetById(id, command, (err, rows)  => {
        if (err) {
            res.status(500).json({error: err}).send();
        } else {
            res.json(rows);
        }
    });
});

app.get('/getLeadsMapa/:id', (req, res)  =>  {
    let id = parseInt(req.params.id, 10);
    let command = 'SP_GetLeadsMapa';
    db.executeGetById(id, command, (err, rows)  =>  {
        if (err) {
            res.status(500).json({error: err}).send();
        } else {
            res.json(rows);
        }
    });
});

app.get('/getLeadCountMonth/:id',  (req, res) =>  {
    let id = parseInt(req.params.id, 10);
    let command = 'SP_GetLeadCountMonth';
    db.executeGetById(id, command,  (err, rows) =>  {
        if (err) {
            res.status(500).json({error: err}).send();
        } else {
            res.json(rows);
        }
    });
});

app.get('/getCostoCampania/:id',(req, res) =>  {
    let id = parseInt(req.params.id, 10);
    let command = 'SP_GetCostoCampania';
    db.executeGetById(id, command, (err, rows) =>  {
        if (err) {
            res.status(500).json({error: err}).send();
        } else {
            res.json(rows);
        }
    });
});

app.get('/getLeadCountMonth/:id', (req, res) =>  {
    let id = parseInt(req.params.id, 10);
    let command = 'SP_GetLeadCountMonth';
    db.executeGetById(id, command,  (err, rows) =>  {
        if (err) {
            res.status(500).json({error: err}).send();
        } else {
            res.json(rows);
        }
    });
});

app.get('/getLeadById/:id',(req, res) =>  {
    let id = parseInt(req.params.id, 10);
    let command = 'SP_GetLeadById';
    db.executeGetById(id, command,(err, rows) =>  {
        if (err) {
            res.status(500).json({error: err}).send();
        } else {
            res.json(rows);
        }
    });
});

app.get('/getReporteWeb', (req, res) =>  {
    let id = parseInt(req.query.param1, 10);
    console.log(id);
    let command = 'SP_GetReporteWeb';
    db.executeGetById(id, command,(err, rows) =>  {
        if (err) {
            res.status(500).json({error: err}).send();
        } else {
            res.json(rows);
        }
    });
});

app.get('/getUserById/:id',(req, res) =>  {
    let id = parseInt(req.params.id, 10);
    let command = 'SP_GetUsuarioById';
    db.executeGetById(id, command, (err, rows) =>  {
        if (err) {
            res.status(500).json({error: err}).send();
        } else {
            res.json(rows);
        }
    });
});

app.get('/getLeadsReport/:id/:finicio/:ffin/:filtro',  (req, res) =>  {

    let urlArray = req.url.split('/');
    let id = urlArray[2];
    let finicio = urlArray[4];
    let ffin = urlArray[3];
    let filtroTemp = urlArray[5];
    let filtro = filtroTemp.split('_').join(' ');
    let command = 'SP_RPT_Leads2';

    db.executeGetSpByDate(id, finicio, ffin, filtro, command,(err, rows) =>  {
        if (err) {
            res.status(500).json({error: err}).send();
        } else {
            res.json(rows);
        }
    });
});

app.get('/getLeadsPages/:id/:finicio/:ffin/:filtro',(req, res) =>  {

    let urlArray = req.url.split('/');
    let id = urlArray[2];
    let finicio = urlArray[4];
    let ffin = urlArray[3];
    let filtroTemp = urlArray[5];
    let filtro = filtroTemp.split('_').join(' ');
    let command = 'SP_RPT_LeadPages';

    db.executeGetSpByDate(id, finicio, ffin, filtro, command,(err, rows) =>  {
        if (err) {
            res.status(500).json({error: err}).send();
        } else {
            res.json(rows);
        }
    });
});

app.get('/facebook', (req, res) =>  {
    db.facebook(req.query.param1,req.query.param2, (err, rows) =>  {
       if (err) {
        res.send('Error');
       } else {
         res.send(rows);
       }
   });  
});

app.get('/verificarPopup',  (req, res) =>  {
   db.verificarPopup(req.query.param1, (err, rows) =>  {
       if (err) {
        res.send('Error');
       } else {
         res.send(rows);
       }
   }); 
});



//POST methods
app.post('/calificaLead/:id/:calificacion',(req, res) =>  {
    //var body = _.pick(req.body, 'id', 'calificacion');
    let command = 'SP_CalificaLead';
    db.executeModifyLead(parseInt(req.params.id, 10), req.params.calificacion, command,(err, rows) =>  {
        if (err) {
            res.status(500).json({error: err}).send();
        } else {
            res.json(rows);
        }
    });
});

app.post('/clasificaLead/:id/:calificacion',(req, res) =>  {
    //var body = _.pick(req.body, 'id', 'calificacion');
    let command = 'SP_ClasificaLead';
    let calificacion = '';
    //console.log(body.calificacion);
    switch (parseInt(req.params.calificacion, 10)) {
        case 0: {
            calificacion = 'Descartado';
            break;
        }
        case 1: {
            calificacion = 'Sin Contacto';
            break;
        }
        case 2: {
            calificacion = 'En Proceso';
            break;
        }
        default: {
            calificacion = 'Vendido';
            break;
        }
    }
    console.log(req.params.id, calificacion);
    db.executeModifyLead(parseInt(req.params.id, 10), calificacion, command,(err, rows) =>  {
        if (err) {
            res.status(500).json({error: err}).send();
        } else {
            res.json(rows);
        }
    });
});

app.post('/leerLead/:leadId/:userId',(req, res) =>  {

    db.executeLeerLead(req.params.leadId, req.params.userId,(err, rows) =>  {
        if (err) {
            res.status(500).json({error: err}).send();
        } else {
            res.json(rows);
        }
    });
});

/*app.post('/pruebita', function(req, res){
    console.log(req.body);
    var body = _.pick(req.body, 'a', 'b');
    console.log(body);
    res.status(200).send();
});*/

// catch 404 and forward to error handler
app.use ((req, res)  => {
    res.sendStatus(404);
    /*
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
    */
});

module.exports = app;
