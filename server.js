const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const db = require('./db.js');
const _ = require('underscore');

var app = express()

if ('development' == app.get('env')) {
    console.log("Rejecting node tls");
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
//app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '')));

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get('/', function (req, res, next) {
    res.sendFile('index.html', { root: __dirname });
});

app.get('/upcoming', (req, res) => {
    res.json({ 'itworks': 'yes' });
});


app.get('/getLead30Dias/:id', function (req, res) {
    var id = parseInt(req.params.id, 10);
    console.log("id", id);
    var command = 'SP_GetLead30Dias';
    console.log("command", command);
    db.executeGetById(id, command, function (err, rows) {
        if (err) {
            res.status(500).json({ error: err }).send();
        } else {
            res.json(rows);
        }
    });
});

app.get('/getLead12Meses/:id', function (req, res) {
    var id = parseInt(req.params.id, 10);
    var command = 'SP_GetLead12Meses';
    db.executeGetById(id, command, function (err, rows) {
        if (err) {
            res.status(500).json({ error: err }).send();
        } else {
            res.json(rows);
        }
    });
});

app.get('/getLike30Dias/:id', function (req, res) {
    var id = parseInt(req.params.id, 10);
    console.log("id", id);
    var command = 'SP_GetLike30Dias';
    db.executeGetById(id, command, function (err, rows) {
        if (err) {
            res.status(500).json({ error: err }).send();
        } else {
            res.json(rows);
        }
    });
});

app.get('/getLeadsMapa/:id', function (req, res) {
    var id = parseInt(req.params.id, 10);
    var command = 'SP_GetLeadsMapa';
    db.executeGetById(id, command, function (err, rows) {
        if (err) {
            res.status(500).json({ error: err }).send();
        } else {
            res.json(rows);
        }
    });
});

app.get('/getLeadCountMonth/:id', function (req, res) {
    var id = parseInt(req.params.id, 10);
    var command = 'SP_GetLeadCountMonth';
    db.executeGetById(id, command, function (err, rows) {
        if (err) {
            res.status(500).json({ error: err }).send();
        } else {
            res.json(rows);
        }
    });
});

app.get('/getCostoCampania/:id', function (req, res) {

    var id = parseInt(req.params.id, 10);
    var command = 'SP_GetCostoCampania'

    db.executeGetById(id, command, function (err, rows) {
        if (err) {
            res.status(500).json({ error: err }).send();
        } else {
            res.json(rows);
        }
    });
});

app.get('/getLeadById/:id', function (req, res) {
    var id = parseInt(req.params.id, 10);
    var command = 'SP_GetLeadById';
    db.executeGetById(id, command, function (err, rows) {
        if (err) {
            res.status(500).json({ error: err }).send();
        } else {
            res.json(rows);
        }
    });
});

app.get('/getReporteWeb', function (req, res) {
    var id = parseInt(req.query.param1, 10);
    console.log(id);
    var command = 'SP_GetReporteWeb';
    db.executeGetById(id, command, function (err, rows) {
        if (err) {
            res.status(500).json({ error: err }).send();
        } else {
            res.json(rows);
        }
    });
});

app.get('/getUserById/:id', function (req, res) {
    var id = parseInt(req.params.id, 10);
    var command = 'SP_GetUsuarioById';
    db.executeGetById(id, command, function (err, rows) {
        if (err) {
            res.status(500).json({ error: err }).send();
        } else {
            res.json(rows);
        }
    });
});

app.get('/getUserByEmail/:email', function (req, res) {
    var email = "'" + req.params.email + "'";
    var command = 'SP_GetUsuarioByEmail';
    db.executeGetById(email, command, function (err, rows) {
        if (err) {
            res.status(500).json({ error: err }).send();
        } else {
            res.json(rows);
        }
    });
});

app.get('/getLeadsReport/:id/:finicio/:ffin/:filtro', function (req, res) {

    var urlArray = req.url.split('/');
    var id = urlArray[2];
    var finicio = "'" + urlArray[3] + "'";
    var ffin = "'" + urlArray[4] + "'";
    var filtroTemp = urlArray[5];
    var filtro = filtroTemp.split('_').join(' ');
    var command = 'SP_RPT_Leads2';

    db.executeGetSpByDate(id, finicio, ffin, filtro, command, function (err, rows) {
        if (err) {
            res.status(500).json({ error: err }).send();
        } else {
            res.json(rows);
        }
    });
});

app.get('/getLeadsReportPagination/:id/:finicio/:ffin/:filtro/:min/:max', function (req, res) {


    const id = req.params.id;
    const finicio = '' + req.params.finicio;
    const ffin = '' + req.params.ffin;
    const filtro = req.params.filtro;
    const min = req.params.min;
    const max = req.params.max;
    const command = 'SP_RPT_LeadsPagination';

    db.executeGetLeadsPagination(id, finicio, ffin, filtro, command, min, max)
        .then(rows => {
            res.json(rows);
            res.status(200);
        }, (err) => {
            res.status(500).json({error: err}).send();
        })
        .catch(err => {
            res.status(500).json({error: err}).send();
        });
});

app.get('/facebook', function (req, res) {
    db.facebook(req.query.param1, req.query.param2, function (err, rows) {
        if (err) {
            res.send('Error');
        } else {
            res.send(rows);
        }
    });
});

app.get('/verificarPopup', function (req, res) {
    db.verificarPopup(req.query.param1, function (err, rows) {
        if (err) {
            res.send('Error');
        } else {
            res.send(rows);
        }
    });
});



//POST methods
/*app.post('/calificaLead/:id/:calificacion', function (req, res) {
    //var body = _.pick(req.body, 'claveid', 'calificacion');
    var command = 'SP_CalificaLead';
    db.executeModifyLead(parseInt(req.params.id, 10), req.params.calificacion, command, function (err, rows) {
        if (err) {
            res.status(500).json({ error: err }).send();
        } else {
            res.json(rows);
        }
    });
});*/

app.get('/calificaLead/:clave/:classification', function (req, res) {
    /* console.log('pinche putita', req);
    const body = _.pick(req.body, 'clave', 'classification'); */

    const command = 'SP_CalificaLead';
    const classification = req.params.classification;
    const clave = req.params.clave

    db.executeModifyLead(clave, classification, command, function (err, rows) {
        if (err) {
            res.status(500).json({ error: err }).send();
        } else {
            res.json(rows).status(200);
        }
    });
});

app.get('/clasificaLead/:clave/:classification', function (req, res) {
    /* console.log('pinche putita', req);
    const body = _.pick(req.body, 'clave', 'classification'); */

    const command = 'SP_ClasificaLead';
    const classification = req.params.classification;
    const clave = req.params.clave

    db.executeModifyLead(clave, classification, command, function (err, rows) {
        if (err) {
            res.status(500).json({ error: err }).send();
        } else {
            res.json(rows).status(200);
        }
    });
});
//POST methods

app.get('/leerLead/:leadId/:userId', function (req, res) {

    db.executeLeerLead(req.params.leadId, req.params.userId, function (err, rows) {
        if (err) {
            res.status(500).json({ error: err }).send();
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
app.use(function (req, res) {
    res.sendStatus(404);
    /*
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
    */
});

module.exports = app;
