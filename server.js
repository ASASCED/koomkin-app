const express = require('express');
const path = require('path');
const request = require('request');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db.js');
const _ = require('underscore');
const KOOMKIN_KEY = 'K00mk1n@!xWz93OTkwMSwiZX';
const conf = require('./conf/conf');
const config = conf.config;

const fb = require('./firebase/conf/services/brief-service.js');

var app = express();


if ('development' == app.get('env')) {
    console.log("Rejecting node tls");
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

app.use(cors());

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

app.get('/calificaLead/:clave/:classification', function (req, res) {

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

    db.searchDemoUsers(email)
      .then(data=>{

        if(data['length']>0){

          fb.getBriefByEmail(email).then(querySnapshot => {

            querySnapshot.forEach(doc => {

              const fireBaseId = doc.data()['id'];

              if(fireBaseId){

                const supposedPassword = 'Koomkin'+data[0]['DemoUserID'];

                var logIn;

                console.log(password);
                console.log(supposedPassword)

                if(password.startsWith(supposedPassword)){
                  logIn = true
                }else{
                  logIn = false
                }

                fb.updateBriefById(fireBaseId,logIn)
                  .then((data)=>{
                    console.log(data);
                  })
                  .catch((reason)=>{console.log(reason)});
              }

            });
          });

        }else{
          console.log('DEMO USER NOT FOUND');
        }

      })
      .catch(reason => {
        console.log(reason);
      });

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

//updateBriefInformation

app.get('/updateBriefInformation/:usuario/:idProducto/:new_Producto/:new_TipoEmpresa/:new_CodigoPostal/:new_IDMembresia/:new_PorqueEresMejor/:new_ClientesTarget/:new_Correo1?/:new_Correo2?/:new_Correo3?/:new_IdSubSector?', function(req, res) {

    const usuario = parseInt(req.params.usuario, 10);
    const idProducto = parseInt(req.params.idProducto, 10);
    const new_Producto = req.params.new_Producto;
    const new_TipoEmpresa = parseInt(req.params.new_TipoEmpresa,10);
    const new_CodigoPostal = parseInt(req.params.new_CodigoPostal,10);
    let new_IDMembresia = parseInt(req.params.new_IDMembresia,10);
    const new_PorqueEresMejor = req.params.new_PorqueEresMejor;
    const new_ClientesTarget = req.params.new_ClientesTarget;
    let new_Correo1 = req.params.new_Correo1;
    let new_Correo2 = req.params.new_Correo2;
    let new_Correo3 = req.params.new_Correo3;
    let new_IdSubSector = parseInt(req.params.new_IdSubSector,10);

    if(!new_IDMembresia){
        new_IDMembresia = 'NULL';
    }

    if(!new_Correo1){
        new_Correo1 = 'NULL';
    }

    if(!new_Correo2){
        new_Correo2 = 'NULL';
    }

    if(!new_Correo3){
        new_Correo3 = 'NULL';
    }

    if(!new_IdSubSector){
        new_IdSubSector = 'NULL';
    }

    db.executeUpdateBriefInformation(usuario,idProducto,new_Producto,new_TipoEmpresa,new_CodigoPostal,new_IDMembresia,new_PorqueEresMejor,new_ClientesTarget,new_Correo1,new_Correo2,new_Correo3,new_IdSubSector) 
        .then(rows => {
            res.json(rows).status(200).send();
        })
        .catch(err => {
            res.status(500).json({ error: err }).send();
        });
});

//updateBriefInformation datos

app.get('/updateBriefDatos/:usuario/:nombre?/:aPaterno?/:aMaterno?/:fechaNac?/:idPuesto?/:cpDomicilio?/:aniosEmpresa?/:educacion?', function(req, res) {

    const usuario = parseInt(req.params.usuario, 10);
    let nombre = req.params.nombre;
    let aPaterno = req.params.aPaterno;
    let aMaterno = req.params.aMaterno;
    let fechaNac = req.params.fechaNac;
    let idPuesto = parseInt(req.params.idPuesto, 10);
    let cpDomicilio = parseInt(req.params.cpDomicilio, 10);
    let aniosEmpresa = parseInt(req.params.aniosEmpresa, 10);
    let educacion = req.params.educacion;

    if(!nombre){
        nombre = 'NULL';
    }

    if(!aPaterno){
        aPaterno = 'NULL';
    }

    if(!aMaterno){
        aMaterno = 'NULL';
    }

    if(!fechaNac){
        fechaNac = 'NULL';
    }

    if(!idPuesto){
        idPuesto = 'NULL';
    }

    if(!cpDomicilio){
        cpDomicilio = 'NULL';
    }

    if(!aniosEmpresa){
        aniosEmpresa = 'NULL';
    }

    if(!educacion){
        educacion = 'NULL';
    }

    db.updateBriefDatos(usuario,nombre,aPaterno,aMaterno,fechaNac,idPuesto,cpDomicilio,aniosEmpresa,educacion) 
        .then(rows => {
            res.json(rows).status(200).send();
        })
        .catch(err => {
            res.status(500).json({ error: err }).send();
        });
});

//updateBriefInformation Empresa

app.get('/updateBriefEmpresa/:usuario/:nombreEmpresa?/:rfcEmpresa?/:numeroEmpleados?/:numeroSocios?/:empresaFamiliar?/:regimenFiscal?/:rangoVentasAnuales?/:ventajaCompetitiva?/:idCampania', function(req, res) {

    const usuario = parseInt(req.params.usuario, 10);
    let nombreEmpresa = req.params.nombreEmpresa;
    let rfcEmpresa = req.params.rfcEmpresa;
    let numeroEmpleados = parseInt(req.params.numeroEmpleados, 10);
    let numeroSocios = parseInt(req.params.numeroSocios, 10);
    let empresaFamiliar = parseInt(req.params.empresaFamiliar, 10);
    let regimenFiscal = req.params.regimenFiscal;
    let rangoVentasAnuales = req.params.rangoVentasAnuales;
    let ventajaCompetitiva = req.params.ventajaCompetitiva;
    const idCampania = parseInt(req.params.idCampania, 10);

    if(!nombreEmpresa){
        nombreEmpresa = 'NULL';
    }

    if(!rfcEmpresa){
        rfcEmpresa = 'NULL';
    }

    if(!numeroEmpleados){
        numeroEmpleados = 'NULL';
    }

    if(!numeroSocios){
        numeroSocios = 'NULL';
    }

    if(!empresaFamiliar){
        empresaFamiliar = 'NULL';
    }

    if(!regimenFiscal){
        regimenFiscal = 'NULL';
    }

    if(!ventajaCompetitiva){
        ventajaCompetitiva = 'NULL';
    }

    if(!ventajaCompetitiva){
        ventajaCompetitiva = 'NULL';
    }

    db.updateBriefEmpresa(usuario,nombreEmpresa,rfcEmpresa,numeroEmpleados,numeroSocios,empresaFamiliar,regimenFiscal,rangoVentasAnuales,ventajaCompetitiva,idCampania) 
        .then(rows => {
            res.json(rows).status(200).send();
        })
        .catch(err => {
            res.status(500).json({ error: err }).send();
        });
});

//updateBriefInformation Cliente Objetivo Particulares

app.get('/updateBriefClienteParticular/:clientesTargetIngresosAnuales?/:clientesTargetEdad?/:clientesTargetGenero?/:clientesTargetIntereses?/:idCampania', function(req, res) {

    let clientesTargetIngresosAnuales = req.params.clientesTargetIngresosAnuales;
    let clientesTargetEdad = req.params.clientesTargetEdad;
    let clientesTargetGenero = req.params.clientesTargetGenero;
    let clientesTargetIntereses = req.params.clientesTargetIntereses;
    const idCampania = parseInt(req.params.idCampania, 10);

    console.log(clientesTargetIngresosAnuales,clientesTargetEdad,clientesTargetGenero,clientesTargetIntereses)

    if(!clientesTargetIngresosAnuales || clientesTargetIngresosAnuales == 'NULL'){
        clientesTargetIngresosAnuales = null;
    }

    if(!clientesTargetEdad || clientesTargetEdad == 'NULL'){
        clientesTargetEdad = null;
    }

    if(!clientesTargetGenero || clientesTargetGenero == 'NULL'){
        clientesTargetGenero = null;
    }

    if(!clientesTargetIntereses || clientesTargetIntereses == 'NULL'){
        clientesTargetIntereses = null;
    }
    console.log(clientesTargetIngresosAnuales,clientesTargetEdad,clientesTargetGenero,clientesTargetIntereses)

    db.updateBriefClienteParticular(clientesTargetIngresosAnuales,clientesTargetEdad,clientesTargetGenero,clientesTargetIntereses,idCampania) 
        .then(rows => {
            res.json(rows).status(200).send();
        })
        .catch(err => {
            res.status(500).json({ error: err }).send();
        });
});

//updateBriefInformation Cliente Objetivo Empresas

app.get('/updateBriefClienteEmpresas/:clientesTargetSector?/:clientesTargetCategoria?/:clientesTargetSectores?/:clientesTargetIntereses?/:idCampania', function(req, res) {

    let clientesTargetSector = req.params.clientesTargetSector;
    let clientesTargetCategoria = req.params.clientesTargetCategoria;
    let clientesTargetSectores = req.params.clientesTargetSectores;
    let clientesTargetIntereses = req.params.clientesTargetIntereses;
    const idCampania = parseInt(req.params.idCampania, 10);
    
    if(!clientesTargetSector){
        clientesTargetSector = 'NULL';
    }

    if(!clientesTargetCategoria){
        clientesTargetCategoria = 'NULL';
    }

    if(!clientesTargetSectores){
        clientesTargetSectores = 'NULL';
    }

    if(!clientesTargetIntereses){
        clientesTargetIntereses = 'NULL';
    }

    db.updateBriefClienteEmpresas(clientesTargetSector,clientesTargetCategoria,clientesTargetSectores,clientesTargetIntereses,idCampania) 
        .then(rows => {
            res.json(rows).status(200).send();
        })
        .catch(err => {
            res.status(500).json({ error: err }).send();
        });
});

//por estado

app.get('/updateCobertura/:idCampania/:idEstado/:idUsuario', function(req, res) {

    const idCampania = parseInt(req.params.idCampania, 10);
    const idEstado = parseInt(req.params.idEstado, 10);
    const idUsuario = parseInt(req.params.idUsuario, 10);

    db.updateCobertura(idCampania,idEstado,idUsuario) 
        .then(rows => {
            res.json(rows).status(200).send();
        })
        .catch(err => {
            res.status(500).json({ error: err }).send();
        });
});

//por region

app.get('/updateCoberturaRegion/:idCampania/:idEstado/:idUsuario', function(req, res) {

    const idCampania = parseInt(req.params.idCampania, 10);
    const idEstado = parseInt(req.params.idEstado, 10);
    const idUsuario = parseInt(req.params.idUsuario, 10);

    db.updateCoberturaRegion(idCampania,idEstado,idUsuario) 
        .then(rows => {
            res.json(rows).status(200).send();
        })
        .catch(err => {
            res.status(500).json({ error: err }).send();
        });
});

//updateBriefInformation Cliente Objetivo Particulares

app.get('/updateCoberturaNacional/:idCampania/:idUsuario', function(req, res) {

    const idCampania = parseInt(req.params.idCampania, 10);
    const idUsuario = parseInt(req.params.idUsuario, 10);

    db.updateCoberturaNacional(idCampania,idUsuario) 
        .then(rows => {
            res.json(rows).status(200).send();
        })
        .catch(err => {
            res.status(500).json({ error: err }).send();
        });
});

//SP_GetBriefById

app.get('/getBriefInformation/:usuario', function(req, res) {

    const usuario = parseInt(req.params.usuario, 10);

    db.executeGetBriefInformation(usuario) 
        .then(rows => {
            res.json(rows).status(200).send();
        })
        .catch(err => {
            res.status(500).json({ error: err }).send();
        });
});

//SP_GetInicioCampaña

app.get('/getInicioCampana/:usuario', function(req, res) {

    const usuario = parseInt(req.params.usuario, 10);

    db.executeGetInicioCampana(usuario) 
        .then(rows => {
            res.json(rows).status(200).send();
        })
        .catch(err => {
            res.status(500).json({ error: err }).send();
        });
});

//SP_GetLastCampania

app.get('/getLastCampania/:usuario', function(req, res) {

    const usuario = parseInt(req.params.usuario, 10);

    db.executeGetLastCampania(usuario) 
        .then(rows => {
            res.json(rows).status(200).send();
        })
        .catch(err => {
            res.status(500).json({ error: err }).send();
        });
});

//getCodigoPostal

app.get('/getCodigoPostal/:codigo', function(req, res) {

    const codigo = parseInt(req.params.codigo, 10);

    db.executeGetCodigoPostal(codigo) 
        .then(rows => {
            res.json(rows).status(200).send();
        })
        .catch(err => {
            res.status(500).json({ error: err }).send();
        });
});

//getCobertura

app.get('/getCobertura/:usuario/:campania', function(req, res) {

    const usuario = parseInt(req.params.usuario, 10);
    const campania = parseInt(req.params.campania, 10);

    db.executeGetCobertura(usuario,campania) 
        .then(rows => {
            res.json(rows).status(200).send();
        })
        .catch(err => {
            res.status(500).json({ error: err }).send();
        });
}); 

//getEstados 

app.get('/getEstados', function(req, res) {

    db.executeGetEstados() 
        .then(rows => {
            res.json(rows).status(200).send();
        })
        .catch(err => {
            res.status(500).json({ error: err }).send();
        });
});

//get tipo Empresas 

app.get('/getEmpresas', function(req, res) {

    db.executeGetEmpresas() 
        .then(rows => {
            res.json(rows).status(200).send();
        })
        .catch(err => {
            res.status(500).json({ error: err }).send();
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

//SP_InsertClickCambioInformacion

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

//PUT Methods

app.put('/actualizarUsuario', function (req, res) {

    db.updateDatosUsuario(req.query)
        .then(rows => {
            res.status(200);
            res.send(rows);
        }, (err) => {
            res.status(500);
            res.send('Error', err);
        })
        .catch(err => {
            res.status(500);
            res.send('Error', err);
        });
});

app.put('/actualizarFiscal', function (req, res) {

    db.updateDatosFiscales(req.query)
        .then(rows => {
            facturaAPIUpdateUsuario(req.query.uidf, rows[0])
                .then(result => {
                    res.status(200);
                    res.send(rows);
                }, (err) => {
                    console.log(err);
                    res.status(500);
                    res.send(err);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500);
                    res.send(err);
                })
        }, (err) => {
            console.log(err);
            res.status(500);
            res.send(err);
        })
        .catch(err => {
            console.log(err);
            res.status(500);
            res.send(err);
        });
});

app.put('/registraDatosFiscales', function (req, res) {

    const json = decodeURIComponent(req.query.json);
    const id_usuario = req.query.id;

    let UID = '';

    facturaAPICrearUsuario(json)
        .then(body => {
            if (body.status === "success") {
                UID = body.Data.UID
                db.insertDatosFiscales(JSON.parse(json), id_usuario, UID)
                    .then(result => {
                        res.status(200);
                        res.send(result);
                    }, (err) => {
                        res.status(500);
                        res.send(err);
                    })
                    .catch(err => {
                        res.status(500);
                        res.send(err);
                    });
            }
            else if (body.status === "already") {
                res.status(409);
                res.send('Usuario ya existe');
            }
        }, (err) => {
            res.status(500);
            res.send(err);
        })
        .catch(err => {
            res.status(500);
            res.send(err);
        });
});

//POST methods

//Genera el requerimiento del  ticket 

app.post('/getRequirementTicket/', function (req, res) {

    const ticket = parseInt(req.body.ticket, 10);
    const requerimiento = 0;
    const area = 6;
    const estatus = 2;
    const agente = 0;
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

app.post('/passLogin', (req, res) => {
    const body = req.body;
    const id = parseInt(body.id);
    const command = 'SP_GetUsuarioById';
    console.log(id, command)
    if (body.key === KOOMKIN_KEY) {
      db.executeSPById(command, id)
        .then(rows => {
          res.json(rows);
          res.status(200);
        }).catch(err => {
          res.status(500).json({ error: err }).send();
        });
    } else {
        res.status(401).send();
    }
});

var facturaAPICrearUsuario = (json) => {

    //const url = 'http://devfactura.in/api/v1/clients/create'
    const url = config.URL_FACTURA + '/v1/clients/create'

    var options = {
        url: url,
        method: 'POST',
        headers: {
            'F-API-KEY': config.API_KEY,
            'F-SECRET-KEY': config.SCT_KEY,
            'Content-Type': 'application/json'
        },
        body: json
    };

    return new Promise((resolve, reject) => {

        function callback(error, res, body) {
            if (!error && body.status !== "error") {
                resolve(JSON.parse(body))
            } else {
                reject(error);
            }
        }

        request(options, callback);
    });
}

var facturaAPIUpdateUsuario = (uid, rows) => {

    const url = config.URL_FACTURA + '/v1/clients/' + uid + '/update'
    var options = {
        url: url,
        method: 'POST',
        headers: {
            'F-API-KEY': config.API_KEY,
            'F-SECRET-KEY': config.SCT_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(rows)
    };

    //console.log(options)

    return new Promise((resolve, reject) => {
        function callback(error, res, body) {
            if (!error && body.status !== "error") {
                //console.log(body);
                resolve(body)
            } else {
                console.log(error);
                reject(error);
            }
        }

        request(options, callback);
    });
};


// catch 404 and forward to error handler
app.use(function (req, res) {
    res.sendStatus(404);
});

module.exports = app;



