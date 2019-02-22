const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
var cors = require('cors')
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
app.use(cors())

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

app.get('/getDiasRestantes/:id', function (req, res) {

    var id = parseInt(req.params.id, 10);
    const command = 'SP_DIAS_RESTANTES_CAMP';

    db.executeGetById(id, command, function (err, rows) {
        if (err) {
            res.status(500).json({ error: err }).send();
        } else {
            res.json(rows);
        }
    });
});


app.get('/getUrlAudio/:id', function (req, res) {

    var id = parseInt(req.params.id, 10);
    const command = 'SP_GetUrlAudio';

    db.executeGetById(id, command, function (err, rows) {
        if (err) {
            res.status(500).json({ error: err }).send();
        } else {
            res.json(rows);
        }
    });
});

app.get('/getRecurrementPayment/:id', function (req, res) {
    
    const id = req.params.id;

    db.executePostRecurringPayment(id)
         .then(rows => {
            res.json(rows).status(200).send();
        })
        .catch(err => {
            res.status(500).json({ error: err }).send();
        });
    });

app.get('/getInfoPago/:uuid', function (req, res) {
    
    const uuid = req.params.uuid;

    db.executeGetInfoPago(uuid)
         .then(rows => {
            res.json(rows).status(200).send();
        })
        .catch(err => {
            res.status(500).json({ error: err }).send();
        });
    });


app.get('/getLeadCalls/:id', function (req, res) {

    var id = parseInt(req.params.id, 10);
    const command = 'SP_GetLeadCalls';

    db.executeGetById(id, command, function (err, rows) {
        if (err) {
            res.status(500).json({ error: err }).send();
        } else {
            res.json(rows);
        }
    });
});

app.get('/getCountLeadCalls/:id', function (req, res) {

    var id = parseInt(req.params.id, 10);
    const command = 'SP_CountLeadCalls';

    db.executeGetById(id, command, function (err, rows) {
        if (err) {
            res.status(500).json({ error: err }).send();
        } else {
            res.json(rows);
        }
    });
});

//Obtiene las encuestas

app.get('/getSurvey/:id', function (req, res) {

    var id = parseInt(req.params.id, 10);
    const command = 'SP_getSurvey';

    db.executeGetById(id, command, function (err, rows) {
        if (err) {
            res.status(500).json({ error: err }).send();
        } else {
            res.json(rows);
        }
    });
});


//Obtiene la informacion de mail por cliente 

app.get('/getMailCliente/:id', function (req, res) {

    var id = parseInt(req.params.id, 10);

    db.executeGetMailCliente(id)
        .then(rows => {
            res.json(rows).status(200).send();
        })
        .catch(err => {
            res.status(500).json({ error: err }).send();
        });
});

//Genera el ticket 

app.get('/getTicket/:id/:fecha/:descripcion', function (req, res) {

    const id = parseInt(req.params.id, 10);
    const agente = 0;
    const fecha = req.params.fecha;
    const canal = 5;
    const satisfaccion = 6;
    const descripcion = req.params.descripcion;
    const correoExterno = 0;
    const command = 'spI_hp_CrearTicket_Bis';
    

    db.executeGenerateTicket(command,id,agente,fecha,canal,satisfaccion,descripcion,correoExterno)
        .then(rows => {
            res.json(rows).status(200).send();
        })
        .catch(err => {
            res.status(500).json({ error: err }).send();
        });
});

//Genera el requerimiento del  ticket 

app.post('/getRequirementTicket/', function (req, res) {


    const ticket = parseInt(req.body.ticket, 10);
    const requerimiento = 0;
    const area = 6;
    const estatus = 2;
    const agente = 0;
    console.log('comentario',req.body.comentario);
    const comentario = req.body.comentario;
    const satisfaccion = 6;
    const bandera = 1;
    const command = 'spI_hp_CrearRequerimiento_Bis';

    db.executeGetTicket(command,ticket,requerimiento,area,estatus,agente,comentario,satisfaccion,bandera)
        .then(rows => {
            res.json(rows).status(200).send();
        })
        .catch(err => {
            res.status(500).json({ error: err }).send();
        });
});


//getDataProveedores
app.get('/getDataProveedores/:uuid/:acceso/:dispositivo', function (req, res) {
    const uuid = req.params.uuid;
    const acceso = req.params.acceso;
    const dispositivo = req.params.dispositivo;

    const command = 'SP_DataProveedores';
    db.executeInsertarRegisteros(command, uuid, acceso, dispositivo)
        .then(rows => {
            res.status(200).json(rows).send();
        })
        .catch(err => {
            res.status(500).json({ error: err }).send();
        });

});

app.get('/getObtieneContactoCte/:id', function (req, res) {
    var id = parseInt(req.params.id, 10);
    var command = 'SP_ObtieneContactoSexCte';
    db.executeGetById(id, command, function (err, rows) {
        if (err) {
            res.status(500).json({ error: err }).send();
        } else {
            res.json(rows);
        }
    });
});

app.get('/datosFiscales', function (req, res) {

    const id = req.query.id
    const command = 'SP_GetDatosFiscalesByUserId'

    db.executeSPById(command, id)
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

app.get('/datosPagos', function (req, res) {

    const id = req.query.id
    const command = 'SP_GetPagosByUserId'

    db.executeSPById(command, id)
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

app.get('/getLead30Dias/:id', function (req, res) {
    var id = parseInt(req.params.id, 10);
    var command = 'SP_GetLead30Dias';
    //console.log("command", command);
    db.executeGetById(id, command, function (err, rows) {
        if (err) {
            res.status(500).json({ error: err }).send();
        } else {
            res.json(rows);
        }
    });
});

app.get('/getLike90Dias/:id', function (req, res) {
    var id = parseInt(req.params.id, 10);
    var command = 'SP_GetLike90Dias';
    //console.log("command", command);
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


app.get('/getObtieneContactoSexCte/:id', function (req, res) {
    var id = parseInt(req.params.id, 10);
    var command = 'SP_ObtieneContactoSexCte';
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
    const command = 'SP_RPT_LeadsPagination_Messages';

    db.executeGetLeadsPagination(id, finicio, ffin, filtro, command, min, max)
        .then(rows => {
            res.json(rows);
            res.status(200);
        }, (err) => {
            res.status(500).json({ error: err }).send();
        })
        .catch(err => {
            res.status(500).json({ error: err }).send();
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

app.get('/facebook/checkLeadComplement', function (req, res) {
    var user_id = req.query.user_id;
    //var cot_id = req.query.cot_id;
    var email = req.query.email;

    //checkLeadComplement(user_id, cot_id)
    checkLeadComplement(user_id, email)
        .then(response => {
            // console.log('res', response);
            res.status(200).send(response);
        })
        .catch(err => {
            // console.log('err', err);
            res.status(500).send(err);
        });
});

var checkLeadComplement = (user_id, email) => {

    let url = 'http://187.162.208.218:5000/facebook/checkLeadComplement?'
    // let url = 'http://187.162.208.218:5001/facebook/checkLeadComplement?'
    // let url = 'http://localhost:5001/facebook/checkLeadComplement?'
    // console.log(url);
    console.log('pene');
    return new Promise((resolve, reject) => {
        //request(url + "user_id=" + user_id + "&cot_id=" + cot_id,
        request(url + "user_id=" + user_id + "&email=" + email,
            function (error, response, body) {
                if (!error) {
                    resolve(body);
                } else {
                    reject(error);
                }
            });
    });
};


app.get('/verificarPopup', function (req, res) {
    db.verificarPopup(req.query.param1, function (err, rows) {
        if (err) {
            res.send('Error');
        } else {
            res.send(rows);
        }
    });
});


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

app.get('/calificaLead2/:clave/:classification/:canal', function (req, res) {
    /* console.log('pinche putita', req);
    const body = _.pick(req.body, 'clave', 'classification'); */

    const command = 'SP_CalificaLead2';
    const classification = req.params.classification;
    const clave = req.params.clave
    const canal = req.params.canal;

    db.executeModifyLead2(command, clave, classification, canal, function (err, rows) {
        if (err) {
            res.status(500).json({ error: err }).send();
        } else {
            res.json(rows).status(200);
        }
    });
});

app.get('/clasificaLead2/:clave/:classification/:canal', function (req, res) {
    /* console.log('pinche putita', req);
    const body = _.pick(req.body, 'clave', 'classification'); */

    const command = 'SP_ClasificaLead2';
    const classification = req.params.classification;
    const clave = req.params.clave
    const canal = req.params.canal;

    db.executeModifyLead2(command, clave, classification, canal, function (err, rows) {
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

app.get('/getIntentoSesion/:email/:password', function (req, res) {
    const email = req.params.email;
    const password = req.params.password;
    const command = 'SP_IntentoSesion';
    db.executeModifyRegister(command, email, password)
        .then(rows => {
            res.json(rows).status(200).send();
        })
        .catch(err => {
            res.status(500).json({ error: err }).send();
        });
});

app.get('/getAccesoReporte/:id/:acceso/:dispositivo/:sistema/:idioma', function (req, res) {
    const id = req.params.id;
    const acceso = req.params.acceso;
    const dispositivo = req.params.dispositivo;
    const sistema = req.params.sistema;
    const idioma = req.params.idioma;

    var command = 'SP_AccesoReporte';
    db.executeAccesoReporte(command, id, acceso, dispositivo, sistema, idioma)
        .then(rows => {
            res.json(rows).status(200).send();
        })
        .catch(err => {
            res.status(500).json({ error: err }).send();
        });
});

app.get('/getLoginReporte/:id/:acceso/:dispositivo/:sistema', function (req, res) {
    const id = req.params.id;
    const acceso = req.params.acceso;
    const dispositivo = req.params.dispositivo;
    const sistema = req.params.sistema;

    var command = 'SP_LoginReporte';
    db.executeLoginReporte(command, id, acceso, dispositivo, sistema)
        .then(rows => {
            res.json(rows).status(200).send();
        })
        .catch(err => {
            res.status(500).json({ error: err }).send();
        });
});

app.get('/getInsertClickPagina/:usuario/:pagina/:acceso', function (req, res) {
    const usuario = req.params.usuario;
    const pagina = req.params.pagina;
    const acceso = req.params.acceso;

    const command = 'SP_InsertClickPagina';

    db.executeInsertaRegistro(command, usuario, pagina, acceso)
        .then(rows => {
            res.json(rows).status(200).send();
        })
        .catch(err => {
            res.status(500).json({ error: err }).send();
        });
});

app.get('/getInsertClickFiltro/:usuario/:pagina/:acceso', function (req, res) {
    const usuario = req.params.usuario;
    const pagina = req.params.pagina;
    const acceso = req.params.acceso;

    const command = 'SP_InsertClickFiltro';

    db.executeInsertaRegistro(command, usuario, pagina, acceso)
        .then(rows => {
            res.json(rows).status(200).send();
        })
        .catch(err => {
            res.status(500).json({ error: err }).send();
        });
});

app.get('/getLeadComplement/:clave', function (req, res) {

    const clave = req.params.clave;
    const command = 'SP_RPT_GetComplement';

    db.executeGetByClave(command, clave)
        .then(rows => {
            res.json(rows).status(200)
        })
        .catch(err => {
            res.status(500).json({ error: err }).send();
        });
});

app.get('/getInsertClickLead/:usuario/:id/:acceso', function (req, res) {
    const usuario = req.params.usuario;
    const id = req.params.id;
    const acceso = req.params.acceso;

    const command = 'SP_InsertClickLead';
    db.executeInsertarRegistro(command, usuario, id, acceso)
        .then(rows => {
            res.json(rows).status(200).send();
        })
        .catch(err => {
            res.status(500).json({ error: err }).send();
        });
});

app.get('/getInsertClickLlamar/:usuario/:id/:acceso/:dispositivo', function (req, res) {
    const usuario = req.params.usuario;
    const id = req.params.id;
    const acceso = req.params.acceso;
    const dispositivo = req.params.dispositivo;

    const command = 'SP_InsertClickLlamar';
    db.executeInsertRegister(command, usuario, id, acceso, dispositivo)
        .then(rows => {
            res.json(rows).status(200).send();
        })
        .catch(err => {
            res.status(500).json({ error: err }).send();
        });
});

app.get('/getInsertClickChat/:usuario/:id/:acceso/:dispositivo/:metodo', function (req, res) {
    const usuario = req.params.usuario;
    const id = req.params.id;
    const acceso = req.params.acceso;
    const dispositivo = req.params.dispositivo;
    const metodo = req.params.metodo;
    const command = 'SP_InsertClickChat';

    db.executeInsertRegisterChat(command, usuario, id, acceso, dispositivo, metodo)
        .then(rows => {
            res.json(rows).status(200).send();
        })
        .catch(err => {
            res.status(500).json({ error: err }).send();
        });
});


app.post('/registerDeviceId/:idUsuario/:idDevice', function (req, res) {

    console.log("Registrando DeviceID");
    var idDevice = req.params.idDevice;
    var idUser = req.params.idUsuario;

    db.PostRegisterDeviceId(idUser, idDevice, function (err, rows) {
        if (err) {
            res.status(500).json({ error: err }).send();
        } else {
            console.log(JSON.stringify(rows));
            res.sendStatus(200);
        }
    });
});


app.post('/registerDeviceId/:idUsuario/:idDevice/:platform', function (req, res) {

    console.log("Registrando DeviceID2");

    var idDevice = req.params.idDevice;

    var idUser = req.params.idUsuario;

    var platform = req.params.platform;

    db.PostRegisterDeviceId2(idUser, idDevice, platform, function (err, rows) {
        if (err) {

            console.log("Device already registered. updating userID");
            // console.log(err);

            db.UpdateDeviceId2(idUser, idDevice)

                .then(rows => {
                    res.json(rows).status(200).send();
                })
                .catch(err => {
                    res.status(500).json({ error: err }).send();
                });

        } else {

            console.log(JSON.stringify(rows));
            res.sendStatus(200);

        }

    });

});

app.get('/getBanner/:idUsuario', function (req, res) {

    const id = parseInt(req.params.idUsuario, 10);
    const command = 'SP_GetBanner';

    db.executeGetBanner(command,id)
         .then(rows => {
            res.json(rows).status(200).send();
        })
        .catch(err => {
            res.status(500).json({ error: err }).send();
        });
    });


app.get('/registrarEntradaBanner/:idReporteBanner/:canal?', function (req, res) {

    const id = parseInt(req.params.idReporteBanner, 10);
    var canal = req.params.canal;

    if(!canal){

        canal = 'App'

    }

    db.executeFechaEntradaBanner(id,canal)
         .then(rows => {
            res.json(rows).status(200).send();
        })
        .catch(err => {
            res.status(500).json({ error: err }).send();
        });
    });

app.get('/getEficiency/:idUsuario', function (req, res) {

    const id = parseInt(req.params.idUsuario, 10);


    db.executeGetEficiency(id)
         .then(rows => {
            res.json(rows).status(200).send();
        })
        .catch(err => {
            res.status(500).json({ error: err }).send();
        });
    });

app.get('/getEficiencyType/:cuartaPantalla', function (req, res) {

    const idTipo = parseInt(req.params.cuartaPantalla, 10);


    db.executeGetEficiencyType(idTipo)
         .then(rows => {
            res.json(rows).status(200).send();
        })
        .catch(err => {
            res.status(500).json({ error: err }).send();
        });
    });

app.get('/getEficiencyRanking', function (req, res) {


    db.executeGetEficiencyRanking()
         .then(rows => {
            res.json(rows).status(200).send();
        })
        .catch(err => {
            res.status(500).json({ error: err }).send();
        });
    });

app.get('/getWordsType/:cuartaPantalla', function (req, res) {

    const idTipo = parseInt(req.params.cuartaPantalla, 10);


    db.executeGetWordsType(idTipo)
         .then(rows => {
            res.json(rows).status(200).send();
        })
        .catch(err => {
            res.status(500).json({ error: err }).send();
        });
    });

app.get('/getWords/:idUsuario', function (req, res) {

    const id = parseInt(req.params.idUsuario, 10);

    db.executeGetWords(id)
         .then(rows => {
            res.json(rows).status(200).send();
        })
        .catch(err => {
            res.status(500).json({ error: err }).send();
        });
    });

app.get('/getTopTen', function (req, res) {

    db.executeGetTopTen()
         .then(rows => {
            res.json(rows).status(200).send();
        })
        .catch(err => {
            res.status(500).json({ error: err }).send();
        });
    });

app.get('/getAnswer/:idUsuario/:idPregunta/:respuesta/:comentario/:canal', function (req, res) {

    const idUsuario = parseInt(req.params.idUsuario, 10);
    const idPregunta = parseInt(req.params.idPregunta, 10);
    const respuesta = parseInt(req.params.respuesta, 10);
    const comentario = req.params.comentario;
    const canal = req.params.canal;

    db.executePutAnswer(idUsuario,idPregunta,respuesta,comentario,canal)
         .then(rows => {
            res.json(rows).status(200).send();
        })
        .catch(err => {
            res.status(500).json({ error: err }).send();
        });
    });

app.get('/getTips/:idtip1/:idtip2/:idtip3' , function (req, res) {

    const tip1 = parseInt(req.params.idtip1, 10);
    const tip2 = parseInt(req.params.idtip2, 10);
    const tip3 = parseInt(req.params.idtip3, 10);


    db.executeGetTips(tip1,tip2,tip3)
         .then(rows => {
            res.json(rows).status(200).send();
        })
        .catch(err => {
            res.status(500).json({ error: err }).send();
        });
    });

//update banner habilitado

app.get('/getUpdateBanner/:id', function (req, res) {

    const id = parseInt(req.params.id, 10);

    db.executeUpdateHabilitado(id).then(rows => {
            res.json(rows).status(200).send();
        })
        .catch(err => {
            res.status(500).json({ error: err }).send();
        });
    });



app.get('/registrarInteresBanner/:interes/:idReporteBanner/:uuidPase/:canal?', function (req, res) {
    
    const interes = req.params.interes;
    const idReporteBanner = req.params.idReporteBanner;
    const uuidPase = req.params.uuidPase;

    db.executeInteresBanner(interes,idReporteBanner,uuidPase)
         .then(rows => {
            res.json(rows).status(200).send();
        })
        .catch(err => {
            res.status(500).json({ error: err }).send();
        });
    });


app.get('/cambiarMensaje/:usuario/:acceso/:mensaje', function (req, res) {
    
    const command = 'SP_InsertCambiarMensaje';
    const usuario = parseInt(req.params.usuario, 10);
    const acceso = req.params.acceso;
    const mensaje = req.params.mensaje;

    db.executeCambiarMensaje(command,usuario,acceso,mensaje)
         .then(rows => {
            res.json(rows).status(200).send();
        })
        .catch(err => {
            res.status(500).json({ error: err }).send();
        });
    });


app.get('/clickBanner/:usuario/:acceso/:tipobanner', function (req, res) {
    
    const command = 'SP_InsertClickBanner';
    const usuario = parseInt(req.params.usuario, 10);
    const acceso = req.params.acceso;
    const tipobanner = parseInt(req.params.tipobanner, 10);

    db.executeClickBanner(command,usuario,acceso,tipobanner)
         .then(rows => {
            res.json(rows).status(200).send();
        })
        .catch(err => {
            res.status(500).json({ error: err }).send();
        });
    });

app.get('/clickTip/:usuario/:tipid/:acceso', function (req, res) {
    
    const command = 'SP_InsertClickTip';
    const usuario = parseInt(req.params.usuario, 10);
    const tipid = parseInt(req.params.tipid, 10);
    const acceso = req.params.acceso;

    db.executeClickTip(command,usuario,tipid,acceso)
         .then(rows => {
            res.json(rows).status(200).send();
        })
        .catch(err => {
            res.status(500).json({ error: err }).send();
        });
    });

app.get('/clickTooltip/:usuario/:tooltipname/:acceso', function (req, res) {
    
    const command = 'SP_InsertClickTooltip';
    const usuario = parseInt(req.params.usuario, 10);
    const tooltipname = req.params.tooltipname;
    const acceso = req.params.acceso;

    db.executeClickTooltip(command,usuario,tooltipname,acceso)
         .then(rows => {
            res.json(rows).status(200).send();
        })
        .catch(err => {
            res.status(500).json({ error: err }).send();
        });
    });

app.get('/clickCambioInformacion/:usuario/:tipo/:acceso', function(req, res) {

    const command = 'SP_InsertClickCambioInformacion';
    const usuario = parseInt(req.params.usuario, 10);
    const tipo = req.params.tipo;
    const acceso = req.params.acceso;

    db.executeInsertaRegistro(command, usuario, tipo, acceso) 
        .then(rows => {
            res.json(rows).status(200).send();
        })
        .catch(err => {
            res.status(500).json({ error: err }).send();
        });
});

// catch 404 and forward to error handler
app.use(function (req, res) {
    res.sendStatus(404);
});

module.exports = app;



