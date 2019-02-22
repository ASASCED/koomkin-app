const Connection = require('tedious').Connection;
const Request = require('tedious').Request;
const conf = require('./conf/conf');
const config = conf.config;
const tp = require('tedious-promises');
const http = require('http');
tp.setConnectionConfig(config);

let db = {};

db.executeGetById = function(id, command, callback) {

    var connection = new Connection(config);
    var result = [];

    connection.on('connect', function(err) {

        var Request = require('tedious').Request;
        var requestStr = `Execute ${command} ${id}`;

        console.log(requestStr);


        request = new Request(requestStr, function(err, rowCount) {
            if (err) {
                callback(err);
            } else {
                callback(null, result);
            }
            connection.close();
        });

        request.on('row', function(columns) {
            var item = {};
            columns.forEach(function(column) {
                item[column.metadata.colName] = column.value;
            });
            result.push(item);
        });

        connection.execSql(request);
    });
}

db.executeGetSpByDate = function(id, finicio, ffin, filtro, command, callback) {
    var connection = new Connection(config);
    var result = [];

    connection.on('connect', function(err) {

        var Request = require('tedious').Request;
        var requestStr = `exec ${command} ${finicio}, ${ffin}, ${id}, '${filtro}'`;
        //var requestStr = 'exec SP_RPT_LeadPages \"12-04-2017\", \"12-25-2017\", 2, \"Todos los recibidos\"';
        //requestStr.log(requestStr);

        request = new Request(requestStr, function(err, rowCount) {
            if (err) {
                console.log(requestStr);
                callback(err);
            } else {
                callback(null, result);
            }
            connection.close();
        });

        request.on('row', function(columns) {
            var item = {};
            columns.forEach(function(column) {
                item[column.metadata.colName] = column.value;
            });
            result.push(item);
        });

        connection.execSql(request);
    });
}

db.executeGetLeadsPagination = function(id, finicio, ffin, filtro, command, min, max) {

    const requestStr = `exec ${command} ${ffin}, ${finicio}, ${id}, '${filtro}', ${min}, ${max}`;

    console.log(requestStr);

    return new Promise((resolve, reject) => {
        tp.sql(requestStr)
            .execute()
            .then(results => {
                resolve(results);
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
};

db.executeModifyLead = function(clave, classification, command, callback) {
    var connection = new Connection(config);
    var result = [];

    connection.on('connect', function(err) {

        var Request = require('tedious').Request;

        var requestStr = `exec ${command} '${classification}', ${clave} `;
        console.log(requestStr);
        request = new Request(requestStr, function(err, rowCount) {
            if (err) {
                callback(err);
            } else {
                callback(null, result);
            }
            connection.close();
        });

        request.on('row', function(columns) {

            var item = {};
            columns.forEach(function(column) {
                item[column.metadata.colName] = column.value;
            });
            result.push(item);
        });

        connection.execSql(request);
    });
}

db.executeModifyLead2 = function(command, clave, classification, canal, callback) {
    var connection = new Connection(config);
    var result = [];

    connection.on('connect', function(err) {

        var Request = require('tedious').Request;

        var requestStr = `exec ${command} '${classification}', ${clave}, '${canal}' `;
        console.log(requestStr);
        request = new Request(requestStr, function(err, rowCount) {
            if (err) {
                callback(err);
            } else {
                callback(null, result);
            }
            connection.close();
        });

        request.on('row', function(columns) {

            var item = {};
            columns.forEach(function(column) {
                item[column.metadata.colName] = column.value;
            });
            result.push(item);
        });

        connection.execSql(request);
    });
}

db.executeLeerLead = function(leadId, userId, callback) {
    var connection = new Connection(config);
    var result = [];

    connection.on('connect', function(err) {

        var Request = require('tedious').Request;

        var requestStr = `exec SP_MarcarLeadLeido '${leadId}', ${userId} `;

        request = new Request(requestStr, function(err, rowCount) {
            if (err) {
                callback(err);
            } else {
                callback(null, result);
            }
            connection.close();
        });

        request.on('row', function(columns) {

            var item = {};
            columns.forEach(function(column) {
                item[column.metadata.colName] = column.value;
            });
            result.push(item);
        });

        connection.execSql(request);
    });
}

db.facebook = function(usuario, tipo, callback) {
    var connection = new Connection(config);
    var result = [];
    //var newdata = [];

    connection.on('connect', function(err) {

        var Request = require('tedious').Request;
        //var TYPES = require('tedious').TYPES;

        var requestStr = "Execute SP_GetFacebookInfo " + usuario;

        request = new Request(requestStr, function(err, rowCount) {
            if (err) {
                callback(err);
            } else {
                //callback(null, result);
                if (result[0] != null) {

                    console.log(result[0]);

                    var AjaxRequest = require('ajax-request');

                    var sinceMonth, sinceDay, untilDay, untilMonth

                    if (result[0].since.getMonth() < 9) {
                        sinceMonth = "0" + (Number(result[0].since.getMonth()) + 1)
                    } else {
                        sinceMonth = (Number(result[0].since.getMonth()) + 1)
                    }

                    if (result[0].since.getDay() < 9) {
                        sinceDay = "0" + (Number(result[0].since.getDay()) + 1)
                    } else {
                        sinceDay = (Number(result[0].since.getDay()) + 1)
                    }

                    if (result[0].until.getMonth() < 9) {
                        untilMonth = "0" + (Number(result[0].until.getMonth()) + 1)
                    } else {
                        untilMonth = (Number(result[0].until.getMonth()) + 1)
                    }

                    if (result[0].until.getDay() < 9) {
                        //if(result[0].until.getDay() == 0){
                        //	untilDay = "30"
                        //}else{
                        untilDay = "0" + (Number(result[0].until.getDay()) + 1)
                            //}

                    } else {
                        untilDay = (Number(result[0].until.getDay()) + 1)
                    }

                    console.log('http://localhost:5000/facebook/CampaignInsights?criteria=' + tipo + '&campaign_id=' + result[0].id_campaign + '&tipo_empresa=' + result[0].tipo_empresa + '&since=' + result[0].since.getFullYear() + "-" + sinceMonth + "-" + sinceDay + '&until=' + result[0].until.getFullYear() + "-" + untilMonth + "-" + untilDay);

                    AjaxRequest({
                            url: 'http://localhost:5000/facebook/CampaignInsights?criteria=' + tipo + '&campaign_id=' + result[0].id_campaign + '&tipo_empresa=' + result[0].tipo_empresa + '&since=' + result[0].since.getFullYear() + "-" + sinceMonth + "-" + sinceDay + '&until=' + result[0].until.getFullYear() + "-" + untilMonth + "-" + untilDay,
                            method: 'GET'
                        },
                        function(err2, res, body2) {
                            if (err2) {
                                callback(null, err2);
                            } else {
                                callback(null, body2)
                            }
                        });
                    //connection.close();
                } else {
                    callback({ "d": "false" });
                }
            }
            connection.close();
        });

        request.on('row', function(columns) {

            var item = {};
            columns.forEach(function(column) {
                item[column.metadata.colName] = column.value;
            });
            result.push(item);
        });

        connection.execSql(request);
        //connection.close();
    });
}

db.verificarPopup = function(usuario, callback) {
    var connection = new Connection(config);
    var result = [];

    connection.on('connect', function(err) {

        var Request = require('tedious').Request;
        //var TYPES = require('tedious').TYPES;

        var requestStr = "EXECUTE SP_muestratutorial " + usuario;

        request = new Request(requestStr, function(err, rowCount) {
            if (err) {
                callback(err);
            } else {
                callback(null, result);
            }
            connection.close();
        });

        request.on('row', function(columns) {

            var item = {};
            columns.forEach(function(column) {
                item[column.metadata.colName] = column.value;
            });
            result.push(item);
        });

        connection.execSql(request);
    });
}

// Gerry

db.GeneraContrato = function(req) {
    console.log(req.firstname);

    const d = req
    const firstname = d.firstname
    const lastname = d.lastname
    const company_name = d.company_name
    const email = d.email
    const phone = d.phone
    const adress = d.adress
    const zip_code = d.zip_code
    const payed_days = d.payed_days
    const gift_days = d.gift_days
    const payment_ammount = d.payment_ammount

    console.log(firstname);

    var requestStr = `Execute SP_GENERA_CONTRATO '${firstname}', '${lastname}', '${company_name}', 
    '${email}', '${phone}', '${adress}', '${zip_code}', ${payed_days}, ${gift_days}, ${payment_ammount}`;

    console.log(requestStr)

    return new Promise((resolve, reject) => {
        tp.sql(requestStr)
            .execute()
            .then(results => {
                resolve(results)
            })
            .catch(err => {
                console.log(err)
                reject(err)
            });
    });
}

//getDataProveedores
db.executeInsertarRegisteros = function(command, uuid, acceso, dispositivo) {

    const requestStr = `exec ${command} '${uuid}', '${acceso}', '${dispositivo}' `;

    console.log(requestStr);

    return tp.sql(requestStr)
        .execute()
};

//getDataComplement
db.executeGetByClave = function(command, clave) {
    console.log(clave)
    const requestStr = `exec ${command} ${clave}`;

    console.log(requestStr);

    return tp.sql(requestStr)
        .execute()
};

//getIntentoSesion
db.executeModifyRegister = function(command, email, password) {

    const requestStr = `exec ${command} '${email}', '${password}' `;

    console.log(requestStr);

    return new Promise((resolve, reject) => {
        tp.sql(requestStr)
            .execute()
            .then(results => {
                resolve(results);
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
};

//getAccesoReporte
db.executeAccesoReporte = function(command, id, acceso, dispositivo, sistema, idioma) {

    const requestStr = `exec ${command} ${id}, '${acceso}', '${dispositivo}', '${sistema}', '${idioma}' `;

    console.log(requestStr);

    return new Promise((resolve, reject) => {
        tp.sql(requestStr)
            .execute()
            .then(results => {
                resolve(results);
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
};

//getLoginReporte
db.executeLoginReporte = function(command, id, acceso, dispositivo, sistema) {

    const requestStr = `exec ${command} ${id}, '${acceso}', '${dispositivo}', '${sistema}' `;

    console.log(requestStr);

    return new Promise((resolve, reject) => {
        tp.sql(requestStr)
            .execute()
            .then(results => {
                resolve(results);
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
};

//getInsertClickPagina
db.executeInsertaRegistro = function(command, usuario, pagina, acceso) {

    const requestStr = `exec ${command} ${usuario}, '${pagina}', '${acceso}' `;

    console.log(requestStr);

    return new Promise((resolve, reject) => {
        tp.sql(requestStr)
            .execute()
            .then(results => {
                resolve(results);
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
};

//getInsertClickLead
db.executeInsertarRegistro = function(command, usuario, id, acceso) {

    const requestStr = `exec ${command} ${usuario}, ${id}, '${acceso}' `;

    console.log(requestStr);

    return new Promise((resolve, reject) => {
        tp.sql(requestStr)
            .execute()
            .then(results => {
                resolve(results);
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
};

//getInsertClickLlamar
db.executeInsertRegister = function(command, usuario, id, acceso, dispositivo) {

    const requestStr = `exec ${command} ${usuario}, ${id}, '${acceso}', '${dispositivo}' `;

    console.log(requestStr);

    return new Promise((resolve, reject) => {
        tp.sql(requestStr)
            .execute()
            .then(results => {
                resolve(results);
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
};

//getInsertClickChat
db.executeInsertRegisterChat = function(command, usuario, id, acceso, dispositivo, metodo) {

    const requestStr = `exec ${command} ${usuario}, ${id}, '${acceso}', '${dispositivo}', '${metodo}' `;

    console.log(requestStr);

    return new Promise((resolve, reject) => {
        tp.sql(requestStr)
            .execute()
            .then(results => {
                resolve(results);
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
};

db.PostRegisterDeviceId = function(IdUsuario, IdDevice, callback) {

    var connection = new Connection(config);
    var result = [];

    connection.on('connect', function(err) {

        var Request = require('tedious').Request;

        var DevicePlatform = "Android"

        console.log("INSERT INTO dbo.userMobileDevices (IdUsuario, IdDevice, DevicePlatform, LoginDate) VALUES ('" + IdUsuario + "','" + IdDevice + "','" + DevicePlatform + "','" + getDateTime() + "')");

        request = new Request("INSERT INTO dbo.userMobileDevices (IdUsuario, IdDevice, DevicePlatform, LoginDate) VALUES ('" + IdUsuario + "','" + IdDevice + "','" + DevicePlatform + "','" + getDateTime() + "')",
            function(err, rowCount) {

                if (err) {

                    callback(err);

                } else {

                    callback(null, result);
                }

                connection.close();

            });

        request.on('row', function(columns) {
            var item = {};
            columns.forEach(function(column) {
                item[column.metadata.colName] = column.value;
            });
            result.push(item);
        });

        connection.execSql(request);
    });
}

db.PostRegisterDeviceId2 = function(IdUsuario, IdDevice, Platform, callback) {

    var connection = new Connection(config);
    var result = [];

    connection.on('connect', function(err) {

        var Request = require('tedious').Request;

        var DevicePlatform = Platform;

        console.log("INSERT INTO dbo.userMobileDevices (IdUsuario, IdDevice, DevicePlatform, LoginDate) VALUES ('" + IdUsuario + "','" + IdDevice + "','" + DevicePlatform + "','" + getDateTime() + "')");

        request = new Request("INSERT INTO dbo.userMobileDevices (IdUsuario, IdDevice, DevicePlatform, LoginDate) VALUES ('" + IdUsuario + "','" + IdDevice + "','" + DevicePlatform + "','" + getDateTime() + "')",
            function(err, rowCount) {

                if (err) {

                    console.log("ERROR: Dev");

                    callback(err);

                } else {

                    callback(null, result);
                }

                connection.close();

            });


        connection.execSql(request);
    });

}


db.UpdateDeviceId2 = function(IdUsuario, IdDevice) {

    updatequerystring = "UPDATE dbo.UserMobileDevices SET IdUsuario = " + IdUsuario + " WHERE IdDevice = '" + IdDevice + "';";

    console.log(updatequerystring);

    return new Promise((resolve, reject) => {
        tp.sql(updatequerystring)
            .execute()
            .then(results => {
                resolve(results);
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
};

db.UpdateDeviceId = function(IdUsuario, IdDevice, callback) {

    var connection = new Connection(config);
    var result = [];

    connection.on('connect', function(err) {
        var Request = require('tedious').Request;
        updatequerystring = "UPDATE dbo.UserMobileDevices SET IdUsuario = " + IdUsuario + " WHERE IdDevice = '" + IdDevice + "';";
        request = new Request(updatequerystring,
            function(err, rowCount) {
                if (err) {
                    console.log("ERRORRRRR UPDATE");
                    console.log(err)
                    callback(err);
                } else {
                    console.log("client id updated succesfully");
                    callback(null, result);
                }
                connection.close();
            });
        connection.execSql(request);
    });
}

db.executeGetBanner = function(command, idUsuario) {

    const requestStr = `Exec ${command} ${idUsuario}`;

    console.log(requestStr);

    return new Promise((resolve, reject) => {
        tp.sql(requestStr)
            .execute()
            .then(results => {
                resolve(results);
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
};


db.executeFechaEntradaBanner = function(idReporteBanner, canal) {

    const requestStr = `UPDATE dbo.Tbl_ReporteBanner SET fechaEntradaBanner = GETDATE() where idReporteBanner = ${idReporteBanner};
                        INSERT INTO EntradaBanner(idReporteBanner,TipoAcceso) VALUES (${idReporteBanner},'${canal}');`;


    //const requestStr = `UPDATE dbo.Tbl_ReporteBanner SET fechaEntradaBanner = GETDATE() where idReporteBanner = ${idReporteBanner};`;

    console.log(requestStr);

    return new Promise((resolve, reject) => {
        tp.sql(requestStr)
            .execute()
            .then(results => {
                resolve(results);
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
};


db.executeGetEficiency = function(idUsuario) {

    const requestStr = `select * from Eficiencia where fecha = (select max(fecha) from Eficiencia) and idusuario = ${idUsuario}`;

    return new Promise((resolve, reject) => {
        tp.sql(requestStr)
            .execute()
            .then(results => {
                resolve(results);
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
};

db.executeGetEficiencyType = function(cuartaPantalla) {

    const requestStr = `select * from Eficienciatipoempresa where fecha = (select max(fecha) from Eficiencia) and tipocuartapantalla = ${cuartaPantalla}`;

    return new Promise((resolve, reject) => {
        tp.sql(requestStr)
            .execute()
            .then(results => {
                resolve(results);
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
};

db.executeGetEficiencyRanking = function(cuartaPantalla) {

    const requestStr = `select * from EficienciaRanking`;

    return new Promise((resolve, reject) => {
        tp.sql(requestStr)
            .execute()
            .then(results => {
                resolve(results);
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
};

db.executeInteresBanner = function(interes, idReporteBanner, uuidPase) {

    var requestStr = '';

    if (interes === '1') {
        requestStr = `UPDATE dbo.Tbl_ReporteBanner SET interesado = 1, fechaClickInteresBanner = GETDATE() WHERE idReporteBanner = '${idReporteBanner}' and (interesado IS NULL OR interesado = 0);`;
    } else if (interes === '0') {
        requestStr = `UPDATE dbo.Tbl_ReporteBanner SET interesado = 0, fechaClickInteresBanner = GETDATE() WHERE idReporteBanner = '${idReporteBanner}' and interesado IS NULL;`;
    }

    console.log(requestStr);

    return new Promise((resolve, reject) => {
        tp.sql(requestStr)
            .execute()
            .then(results => {
                resolve(results);
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
};


db.executeInteresBannerReporte = function(interes, idReporteBanner, uuidPase) {

    var requestStr = '';

    if (interes === '1') {
        requestStr = `UPDATE dbo.Tbl_ReporteBanner SET interesado = 1, fechaClickInteresBanner = GETDATE() WHERE idReporteBanner = '${idReporteBanner}' and (interesado IS NULL OR interesado = 0);`;
    } else if (interes === '0') {
        requestStr = `UPDATE dbo.Tbl_ReporteBanner SET interesado = 0, fechaClickInteresBanner = GETDATE() WHERE idReporteBanner = '${idReporteBanner}' and interesado IS NULL;`;
    }

    console.log(requestStr);

    return new Promise((resolve, reject) => {
        tp.sql(requestStr)
            .execute()
            .then(results => {
                resolve(results);
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
};


//getInsertCambiarMensaje
db.executeCambiarMensaje = function(command, usuario, acceso, mensaje) {

    const requestStr = `exec ${command} ${usuario}, '${acceso}', '${mensaje}' `;

    console.log(requestStr);

    return new Promise((resolve, reject) => {
        tp.sql(requestStr)
            .execute()
            .then(results => {
                resolve(results);
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
};

//getInsertClickBanner
db.executeClickBanner = function(command, usuario, acceso, tipobanner) {

    const requestStr = `exec ${command} ${usuario}, '${acceso}', ${tipobanner} `;

    console.log(requestStr);

    return new Promise((resolve, reject) => {
        tp.sql(requestStr)
            .execute()
            .then(results => {
                resolve(results);
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
};

//getInsertClickTip

db.executeClickTip = function(command, usuario, tipid, acceso) {

    const requestStr = `exec ${command} ${usuario}, ${tipid}, '${acceso}' `;

    console.log(requestStr);

    return new Promise((resolve, reject) => {
        tp.sql(requestStr)
            .execute()
            .then(results => {
                resolve(results);
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
};

//getInsertClickTooltip

db.executeClickTooltip = function(command, usuario, tooltipname, acceso) {

    const requestStr = `exec ${command} ${usuario}, '${tooltipname}', '${acceso}' `;

    console.log(requestStr);

    return new Promise((resolve, reject) => {
        tp.sql(requestStr)
            .execute()
            .then(results => {
                resolve(results);
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
};

//getCreateTicket
db.executeGenerateTicket = function(command, idUsuario, agente, fecha, canal, satisfaccion, descripcion, correoExterno) {

    const requestStr = `exec ${command} ${idUsuario}, ${agente}, '${fecha}', ${canal}, ${satisfaccion}, '${descripcion}', ${correoExterno}`;
    console.log(requestStr);
    return new Promise((resolve, reject) => {
        tp.sql(requestStr)
            .execute()
            .then(results => {
                resolve(results);
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
};



//getCreateTicket

db.executeGetTicket = function(command, ticket, requerimiento, area, estatus, agente, comentario, satisfaccion, bandera) {

    const requestStr = `exec ${command} ${ticket}, ${requerimiento}, ${area}, ${estatus}, ${agente}, '${comentario}', ${satisfaccion}, ${bandera}`;

    return new Promise((resolve, reject) => {
        tp.sql(requestStr)
            .execute()
            .then(results => {
                resolve(results);
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
};

//UpdateHabilitado del banner

db.executeUpdateHabilitado = function(idReporteBanner) {

    const requestStr = `update tbl_reporteBanner set habilitado = 0 where idReporteBanner = ${idReporteBanner}`;

    return new Promise((resolve, reject) => {
        tp.sql(requestStr)
            .execute()
            .then(results => {
                resolve(results);
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
};

//Obtiene la informacion de mail por cliente  

db.executeGetMailCliente = function(idUsuario) {

    const requestStr = `select * from InformacionMailPorCliente where idUsuario = ${idUsuario}`;

    return new Promise((resolve, reject) => {
        tp.sql(requestStr)
            .execute()
            .then(results => {
                resolve(results);
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
};

//getTips 

db.executeGetTips = function(tip1, tip2, tip3) {

    const requestStr = `select * from CatalogoTips where TipId in (${tip1},${tip2},${tip3})`;

    return new Promise((resolve, reject) => {
        tp.sql(requestStr)
            .execute()
            .then(results => {
                resolve(results);
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
};

db.executeGetInfoPago = function(uuid) {

    const requestStr = `select p.FirstName, p.LastName, p.PhoneNumber, pl.Amount, pl.PeriodDays from RecurringPayment p join RecurringPaymentPlan pl on p.RecurringPaymentPlanID=pl.ID where p.UUID=${uuid}`;

    return new Promise((resolve, reject) => {
        tp.sql(requestStr)
            .execute()
            .then(results => {
                resolve(results);
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
};

db.executePostRecurringPayment = function(idUsuario) {

    const requestStr = `update CATUSUARIO set RecurringPayments = 0 where IDUSUARIO = ${idUsuario}`;

    return new Promise((resolve, reject) => {
        tp.sql(requestStr)
            .execute()
            .then(results => {
                resolve(results);
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });

};

//Inserta las respuestas encuestas

db.executePutAnswer = function(idUsuario, idPregunta, respuesta, comentario, canal) {

    const requestStr = `insert into Tbl_RespuestasEncuestas (idUsuario,idAgenda,idPregunta,respuesta,comentario,fechaRespuesta,idAgente,canal) values (${idUsuario},NULL,${idPregunta},${respuesta},'${comentario}',GETDATE(),NULL,'${canal}');`;

    return new Promise((resolve, reject) => {
        tp.sql(requestStr)
            .execute()
            .then(results => {
                resolve(results);
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
};


db.executeGetWords = function(idUsuario) {

    const requestStr = `select top 5 * from palabrasporcliente where idusuario = ${idUsuario}`;

    return new Promise((resolve, reject) => {
        tp.sql(requestStr)
            .execute()
            .then(results => {
                resolve(results);
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
};

db.executeGetWordsType = function(cuartaPantalla) {

    const requestStr = `select top 5 * from palabrasporpantalla where tipocuartapantalla = ${cuartaPantalla}`;

    return new Promise((resolve, reject) => {
        tp.sql(requestStr)
            .execute()
            .then(results => {
                resolve(results);
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
};

db.executeGetTopTen = function() {

    const requestStr = `select lugar , Nombre from Eficiencia where lugar <= 10 order by lugar`;

    return new Promise((resolve, reject) => {
        tp.sql(requestStr)
            .execute()
            .then(results => {
                resolve(results);
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
};


function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;

}


module.exports = db;