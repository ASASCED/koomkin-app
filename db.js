const Connection = require('tedious').Connection;
const Request = require('tedious').Request;
const conf = require('./conf/conf');
const config = conf.config;
const tp = require('tedious-promises');
const http = require('http');
tp.setConnectionConfig(config);

let db = {};


db.searchDemoUsers = function (email) {

  updatequerystring = "select * from CATUSUARIO WHERE EMAIL = '"+email+"' AND DemoUserID IS NOT NULL;";

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

db.executeGetById = function (id, command, callback) {

    var connection = new Connection(config);
    var result = [];

    connection.on('connect', function (err) {

        var Request = require('tedious').Request;
        var requestStr = `Execute ${command} ${id}`;

        console.log(requestStr);


        request = new Request(requestStr, function (err, rowCount) {
            if (err) {
                callback(err);
            } else {
                callback(null, result);
            }
            connection.close();
        });

        request.on('row', function (columns) {
            var item = {};
            columns.forEach(function (column) {
                item[column.metadata.colName] = column.value;
            });
            result.push(item);
        });

        connection.execSql(request);
    });
}

db.executeSPById = function (command, id) {

  const requestStr = "Execute " + command + " " + id;

  return new Promise((resolve, reject) => {
    tp.sql(requestStr)
      .execute()
      .then(results => {
        resolve(results);
      })
      .fail(err => {
        console.log(err);
        reject(err);
      });
  });
};

db.executeGetSpByDate = function (id, finicio, ffin, filtro, command, callback) {
    var connection = new Connection(config);
    var result = [];

    connection.on('connect', function (err) {

        var Request = require('tedious').Request;
        var requestStr = `exec ${command} ${finicio}, ${ffin}, ${id}, '${filtro}'`;
        //var requestStr = 'exec SP_RPT_LeadPages \"12-04-2017\", \"12-25-2017\", 2, \"Todos los recibidos\"';
        //requestStr.log(requestStr);

        request = new Request(requestStr, function (err, rowCount) {
            if (err) {
                console.log(requestStr);
                callback(err);
            } else {
                callback(null, result);
            }
            connection.close();
        });

        request.on('row', function (columns) {
            var item = {};
            columns.forEach(function (column) {
                item[column.metadata.colName] = column.value;
            });
            result.push(item);
        });

        connection.execSql(request);
    });
}

db.executeGetLeadsPagination = function (id, finicio, ffin, filtro, command, min, max) {

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

db.executeModifyLead = function (clave, classification, command, callback) {
    var connection = new Connection(config);
    var result = [];

    connection.on('connect', function (err) {

        var Request = require('tedious').Request;

        var requestStr = `exec ${command} '${classification}', ${clave} `;
        console.log(requestStr);
        request = new Request(requestStr, function (err, rowCount) {
            if (err) {
                callback(err);
            } else {
                callback(null, result);
            }
            connection.close();
        });

        request.on('row', function (columns) {

            var item = {};
            columns.forEach(function (column) {
                item[column.metadata.colName] = column.value;
            });
            result.push(item);
        });

        connection.execSql(request);
    });
}

db.executeModifyLead2 = function (command, clave, classification, canal, callback) {
  var connection = new Connection(config);
  var result = [];

  connection.on('connect', function (err) {

    var Request = require('tedious').Request;

    var requestStr = `exec ${command} '${classification}', ${clave}, '${canal}' `;
    console.log(requestStr);
    request = new Request(requestStr, function (err, rowCount) {
      if (err) {
        callback(err);
      } else {
        callback(null, result);
      }
      connection.close();
    });

    request.on('row', function (columns) {

      var item = {};
      columns.forEach(function (column) {
        item[column.metadata.colName] = column.value;
      });
      result.push(item);
    });

    connection.execSql(request);
  });
}

db.executeLeerLead = function (leadId, userId, callback) {
    var connection = new Connection(config);
    var result = [];

    connection.on('connect', function (err) {

        var Request = require('tedious').Request;

        var requestStr = `exec SP_MarcarLeadLeido '${leadId}', ${userId} `;

        request = new Request(requestStr, function (err, rowCount) {
            if (err) {
                callback(err);
            } else {
                callback(null, result);
            }
            connection.close();
        });

        request.on('row', function (columns) {

            var item = {};
            columns.forEach(function (column) {
                item[column.metadata.colName] = column.value;
            });
            result.push(item);
        });

        connection.execSql(request);
    });
}

db.facebook = function(usuario,tipo,callback){
	var connection = new Connection(config);
	var result = [];
	//var newdata = [];
	
	connection.on('connect', function(err) {
		
		var Request = require('tedious').Request;
		//var TYPES = require('tedious').TYPES;

		var requestStr = "Execute SP_GetFacebookInfo " + usuario ;
		
		request = new Request(requestStr, function(err,rowCount) {
			if (err) {
                callback(err);
            } else {
                //callback(null, result);
				if(result[0] != null){
					
					console.log(result[0]);
				
					var AjaxRequest = require('ajax-request');
					
					var sinceMonth,sinceDay,untilDay,untilMonth
					
					if(result[0].since.getMonth() < 9){
						sinceMonth = "0" + (Number(result[0].since.getMonth())+1)
					}else{
						sinceMonth = (Number(result[0].since.getMonth())+1)
					}
					
					if(result[0].since.getDay() < 9){
						sinceDay = "0" + (Number(result[0].since.getDay())+1)
					}else{
						sinceDay = (Number(result[0].since.getDay())+1)
					}
					
					if(result[0].until.getMonth() < 9){
						untilMonth = "0" + (Number(result[0].until.getMonth())+1)
					}else{
						untilMonth = (Number(result[0].until.getMonth())+1)
					}
					
					if(result[0].until.getDay() < 9){
						//if(result[0].until.getDay() == 0){
						//	untilDay = "30"
						//}else{
							untilDay = "0" + (Number(result[0].until.getDay())+1)
						//}
						
					}else{
						untilDay = (Number(result[0].until.getDay())+1)
					}
					
					console.log('http://localhost:5000/facebook/CampaignInsights?criteria='+tipo+'&campaign_id='+result[0].id_campaign+'&tipo_empresa='+result[0].tipo_empresa+'&since='+result[0].since.getFullYear()+"-"+sinceMonth+"-"+sinceDay+'&until='+result[0].until.getFullYear()+"-"+untilMonth+"-"+untilDay);

					AjaxRequest({
						url: 'http://localhost:5000/facebook/CampaignInsights?criteria='+tipo+'&campaign_id='+result[0].id_campaign+'&tipo_empresa='+result[0].tipo_empresa+'&since='+result[0].since.getFullYear()+"-"+sinceMonth+"-"+sinceDay+'&until='+result[0].until.getFullYear()+"-"+untilMonth+"-"+untilDay,
					method:'GET'},
					  function(err2,res,body2){
						if (err2) {
							callback(null,err2);
						} else {
							callback(null,body2)
						}
					  });
					//connection.close();
				}else{
					callback({"d":"false"});
				}
            }
			connection.close();
		});
		
		request.on('row', function(columns) {

			var item = {}; 
	        columns.forEach(function (column) { 
	            item[column.metadata.colName] = column.value; 
	        }); 
	        result.push(item);
		});

		connection.execSql(request);
		//connection.close();
	});
}

//getIntentoSesion
db.executeModifyRegister = function (command, email, password) {

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
db.executeAccesoReporte = function (command, id, acceso, dispositivo, sistema, idioma) {

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
db.executeLoginReporte = function (command, id, acceso, dispositivo, sistema) {

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
db.executeInsertaRegistro = function (command, usuario, pagina, acceso) {

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
db.executeInsertarRegistro = function (command, usuario, id, acceso) {

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
db.executeInsertRegister = function (command, usuario, id, acceso, dispositivo) {

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
db.executeInsertRegisterChat = function (command, usuario, id, acceso, dispositivo, metodo) {

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

db.PostRegisterDeviceId = function (IdUsuario, IdDevice,  callback) {

    var connection = new Connection(config);
    var result = [];

    connection.on('connect', function (err) {

        var Request = require('tedious').Request;
        var DevicePlatform = "Android"

        console.log("INSERT INTO dbo.userMobileDevices (IdUsuario, IdDevice, DevicePlatform, LoginDate) VALUES ('"+IdUsuario+"','"+IdDevice+"','"+DevicePlatform+"','"+getDateTime()+"')");

        request = new Request("INSERT INTO dbo.userMobileDevices (IdUsuario, IdDevice, DevicePlatform, LoginDate) VALUES ('"+IdUsuario+"','"+IdDevice+"','"+DevicePlatform+"','"+getDateTime()+"')",
            function (err, rowCount) {
            if (err) {
                callback(err);
            } else {
                callback(null, result);
            }
            connection.close();
        });
        request.on('row', function (columns) {
            var item = {};
            columns.forEach(function (column) {
                item[column.metadata.colName] = column.value;
            });
            result.push(item);
        });
        connection.execSql(request);
    });
}

db.PostRegisterDeviceId2 = function (IdUsuario, IdDevice, Platform ,callback) {

    var connection = new Connection(config);
    var result = [];

    connection.on('connect', function (err) {

        var Request = require('tedious').Request;
        var DevicePlatform = Platform;

        console.log("INSERT INTO dbo.userMobileDevices (IdUsuario, IdDevice, DevicePlatform, LoginDate) VALUES ('"+IdUsuario+"','"+IdDevice+"','"+DevicePlatform+"','"+getDateTime()+"')");
        request = new Request("INSERT INTO dbo.userMobileDevices (IdUsuario, IdDevice, DevicePlatform, LoginDate) VALUES ('"+IdUsuario+"','"+IdDevice+"','"+DevicePlatform+"','"+getDateTime()+"')",
            function (err, rowCount) {
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


db.UpdateDeviceId2 = function (IdUsuario, IdDevice) {

    updatequerystring = "UPDATE dbo.UserMobileDevices SET IdUsuario = "+IdUsuario+" WHERE IdDevice = '"+IdDevice+"';";

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

db.UpdateDeviceId = function (IdUsuario, IdDevice, callback) {

    var connection = new Connection(config);
    var result = [];

    connection.on('connect', function (err) {
        var Request = require('tedious').Request;
        updatequerystring = "UPDATE dbo.UserMobileDevices SET IdUsuario = "+IdUsuario+" WHERE IdDevice = '"+IdDevice+"';";
        request = new Request(updatequerystring,
            function (err, rowCount) {
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

db.executeGetBanner = function (command,idUsuario) {

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


db.executeFechaEntradaBanner = function (idReporteBanner,canal) {

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


db.executeGetEficiency = function (idUsuario) {

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

db.executeGetEficiencyType = function (cuartaPantalla) {

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

db.executeGetEficiencyRanking = function (cuartaPantalla) {

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

db.executeInteresBanner = function (interes,idReporteBanner,uuidPase) {

    var requestStr = '';

    if(interes==='1') {
        requestStr = `UPDATE dbo.Tbl_ReporteBanner SET interesado = 1, fechaClickInteresBanner = GETDATE() WHERE idReporteBanner = '${idReporteBanner}' and (interesado IS NULL OR interesado = 0);`;
    } else if(interes==='0') {
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


db.executeInteresBannerReporte = function (interes,idReporteBanner,uuidPase) {

    var requestStr = '';

    if(interes==='1') {
        requestStr = `UPDATE dbo.Tbl_ReporteBanner SET interesado = 1, fechaClickInteresBanner = GETDATE() WHERE idReporteBanner = '${idReporteBanner}' and (interesado IS NULL OR interesado = 0);`;
    } else if(interes==='0') {
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
db.executeCambiarMensaje = function (command, usuario, acceso, mensaje) {

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
db.executeClickBanner = function (command, usuario, acceso, tipobanner) {

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

db.executeClickTip = function (command, usuario, tipid, acceso) {

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

db.executeClickTooltip = function (command, usuario, tooltipname, acceso) {

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

db.executeClickCancelar = function (command, usuario, acceso) {

    const requestStr = `exec ${command} ${usuario}, '${acceso}' `;

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
db.executeGenerateTicket = function (command, idUsuario, agente, fecha, canal ,satisfaccion ,descripcion , correoExterno) {

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

db.executeGetTicket = function (command, ticket,  requerimiento ,area  ,estatus , agente, comentario, satisfaccion,bandera) {

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

//updateAgenda

db.executeUpdateAgenda = function (idUsuario,idTicket,estatusOptimizacion) {

    const requestStr = `insert into Tbl_AgendaOptimizaciones (idUsuario, idTicket, estatusOptimizacion) values (${idUsuario},${idTicket}, '${estatusOptimizacion}')`;

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

db.executeUpdateHabilitado = function (idReporteBanner) {

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

db.executeGetMailCliente = function (idUsuario) {

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

db.executeGetTips = function (tip1,tip2,tip3) {

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

db.executeGetInfoPago = function (uuid) {

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

db.executePostRecurringPayment = function (idUsuario) {

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


db.updateDatosFiscales = function (body) {

    const str = body.uid + ", '" + body.f_nombre + "', '" + body.f_apaterno + "', '" + body.f_amaterno + "', '" + body.f_email + "', '" +
      body.f_telefono + "', '" + body.rfc + "', '" + body.razon_social + "', '" + body.calle + "', '" + body.n_exterior + "', '" +
      body.n_interior + "', '" + body.cp + "', '" + body.colonia + "', 156, " + body.estado + ", '" + body.ciudad + "', '" + body.delegacion + "'";
  
    const requestStr = "Execute SP_UpdateDatosFiscales " + str;
  
    return new Promise((resolve, reject) => {
      tp.sql(requestStr)
        .execute()
        .then(results => {
          resolve(results)
        })
        .fail(err => {
          console.log(err)
          reject(err)
        });
    });
  
  }
  
  db.updateDatosUsuario = function (body) {
  
    const str = body.uid + ", '" + body.nombre + "', '" + body.apaterno + "', '" + body.amaterno + "', '" + body.empresa + "', '" + body.email + "', '" +
      body.telefono + "', '" + body.celular + "'";
  
    const requestStr = "Execute SP_UpdateUsuario " + str;
  
    return new Promise((resolve, reject) => {
      tp.sql(requestStr)
        .execute()
        .then(results => {
          resolve(results)
        })
        .fail(err => {
          console.log(err)
          reject(err)
        });
    });
  }
  
  db.insertDatosFiscales = function (body, id, uid) {
  
    const d = body
    const nombre = d.nombre
    const apaterno = d.apaterno
    const amaterno = d.amaterno
    const email = d.email
    const telefono = d.telefono
    const rfc = d.rfc
    const rz = d.razons
    const calle = d.calle
    const nexterior = d.numero_exterior
    const ninterno = d.numero_interior
    const cp = d.codpos
    const colonia = d.colonia
    const estado = d.estado_n
    const ciudad = d.ciudad
    const delegacion = d.delegacion
  
    var requestStr = `Execute kad_spI_InsertaDatosFiscales ${id}, '${nombre}', '${apaterno}', '${amaterno}', '${email}', '', '',`;
    requestStr += `'${telefono}', '${rfc}', '${rz}', '${calle}', '${nexterior}', '${ninterno}', '${cp}', '${colonia}', ${estado}, 156, '${ciudad}', '${delegacion}', '${uid}'`;
  
    return new Promise((resolve, reject) => {
      tp.sql(requestStr)
        .execute()
        .then(results => {
          resolve(results)
        })
        .fail(err => {
          console.log(err)
          reject(err)
        });
    });
  }

//Inserta las respuestas encuestas

db.executePutAnswer = function (idUsuario,idPregunta,respuesta,comentario,canal) {

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


db.executeGetWords = function (idUsuario) {

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

db.executeGetWordsType = function (cuartaPantalla) {

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

db.executeGetTopTen = function () {

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


db.executeGetBriefInformation = function (idUsuario) {

    const requestStr = `Exec SP_GetBriefById ${idUsuario}`;
    
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

db.executeGetLastCampania = function (idUsuario) {

    const requestStr = `select top 1 * from tbl_tuCampania where IDUSUARIO = ${idUsuario} order by IDCampania desc`;
    
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

db.executeUpdateBriefInformation = function (idUsuario,idProducto,new_Producto,new_TipoEmpresa,new_CodigoPostal,new_IDMembresia,new_PorqueEresMejor,new_ClientesTarget,new_Correo1,new_Correo2,new_Correo3,new_IdSubSector,idEstado ) {

    var requestStr = '';

    if(idEstado == 'NULL') {
        console.log('entro');
        requestStr = `Update TBL_CATALOGOPRODUCTOS set NOMBRE = '${new_Producto}' where IDUSUARIO = ${idUsuario} and ID_PRODUCTO = ${idProducto}; 
        Update TBL_BRIEF set ID_TIPOEMPRESA = ${new_TipoEmpresa} , CODIGOPOSTAL = ${new_CodigoPostal} where IDUSUARIO = ${idUsuario};
        Update tbl_direccionGoogle set cp = ${new_CodigoPostal} where IDUSUARIO = ${idUsuario};
        Insert into tbl_tuCampania (IDMembresia,
                                    IDUSUARIO,
                                    PorqueEresMejor,
                                    ClientesTarget,
                                    Correo1,
                                    Correo2,
                                    Correo3,
                                    IdSubSector)
                                values (
                                    ${new_IDMembresia},
                                    ${idUsuario},
                                    '${new_PorqueEresMejor}',
                                    '${new_ClientesTarget}',
                                    '${new_Correo1}',
                                    '${new_Correo2}',
                                    '${new_Correo3}',
                                    ${new_IdSubSector});
        select top 1 * from tbl_tuCampania where IDUSUARIO = ${idUsuario} order by IDCampania desc`;                       

    } else if(idEstado != 'NULL') {
        console.log('entro if');

        requestStr = `Update TBL_CATALOGOPRODUCTOS set NOMBRE = '${new_Producto}' where IDUSUARIO = ${idUsuario} and ID_PRODUCTO = ${idProducto}; 
                            Update TBL_BRIEF set ID_TIPOEMPRESA = ${new_TipoEmpresa} , CODIGOPOSTAL = ${new_CodigoPostal}, IDESTADO = ${idEstado} where IDUSUARIO = ${idUsuario};
                            Update tbl_direccionGoogle set cp = ${new_CodigoPostal} where IDUSUARIO = ${idUsuario};
                            Insert into tbl_tuCampania (IDMembresia,
                                                    IDUSUARIO,
                                                    PorqueEresMejor,
                                                    ClientesTarget,
                                                    Correo1,
                                                    Correo2,
                                                    Correo3,
                                                    IdSubSector)
                                                values (
                                                    ${new_IDMembresia},
                                                    ${idUsuario},
                                                    '${new_PorqueEresMejor}',
                                                    '${new_ClientesTarget}',
                                                    '${new_Correo1}',
                                                    '${new_Correo2}',
                                                    '${new_Correo3}',
                                                    ${new_IdSubSector});
                        select top 1 * from tbl_tuCampania where IDUSUARIO = ${idUsuario} order by IDCampania desc`;   
                        
    }
    
    console.log(requestStr);

        return new Promise((resolve, reject) => {
            tp.sql(requestStr)
                .execute()
                .then(results => {
                    console.log(results);
                    resolve(results);
                })
                .catch(err => {
                    console.log(err);
                    reject(err);
                });
        });
};

//getDataComplement
db.executeGetByClave = function (command, clave) {
    console.log(clave)
    const requestStr = `exec ${command} ${clave}`;
  
    console.log(requestStr);
  
    return tp.sql(requestStr)
              .execute()
  };

//getDataComplement
db.executeGetLeadsAgregados = function (idUsuario) {

    const requestStr = `SELECT COUNT(Canal) as LeadsAgregados FROM TACotizacion WHERE IdUsuarioRecibio = ${idUsuario} and Canal = 'Reporte';`;

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

db.updateBriefDatos = function (idUsuario, nombre, aPaterno, aMaterno, fechaNac, idPuesto, cpDomicilio, aniosEmpresa, educacion) {

    const requestStr = `Update CATUSUARIO set NOMBRE = '${nombre}', APEPATERNO = '${aPaterno}', APEMATERNO = '${aMaterno}' where IDUSUARIO = ${idUsuario};
    update TBL_BRIEF set FECHANACIMIENTO = '${fechaNac}', ID_PUESTO = ${idPuesto}, CodigoPostalDomicilio = ${cpDomicilio}, AniosEmpresa = ${aniosEmpresa}, Educacion = '${educacion}' where IDUSUARIO = ${idUsuario};`;
    
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

db.updateBriefEmpresa = function (idUsuario, nombreEmpresa, rfcEmpresa, numeroEmpleados, numeroSocios, empresaFamiliar, regimenFiscal, rangoVentasAnuales, ventajaCompetitiva, idCampania) {

    const requestStr = `Update CATUSUARIO set NOMEMPRESACOMPRADOR = '${nombreEmpresa}'  where IDUSUARIO = ${idUsuario};
    update TBL_BRIEF set RFCEMPRESA = '${rfcEmpresa}', NumeroEmpleados = ${numeroEmpleados}, NumeroSocios = ${numeroSocios}, EmpresaFamiliar = ${empresaFamiliar}, RegimenFiscal = '${regimenFiscal}', RangoVentasAnuales = '${rangoVentasAnuales}' where IDUSUARIO = ${idUsuario};
    update tbl_TuCampania set VentajaCompetitiva = '${ventajaCompetitiva}' where IDCampania = ${idCampania};`;
    
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

db.updateBriefClienteParticular = function ( clientesTargetIngresosAnuales, clientesTargetEdad, clientesTargetGenero, clientesTargetIntereses, idCampania) {

    const requestStr = `update tbl_TuCampania set ClientesTargetIngresosAnuales = '${clientesTargetIngresosAnuales}', ClientesTargetEdad = '${clientesTargetEdad}', ClientesTargetGenero = '${clientesTargetGenero}', ClientesTargetIntereses = '${clientesTargetIntereses}' where IDCampania = ${idCampania}`;    
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

db.updateBriefClienteEmpresas= function ( clientesTargetSector, clientesTargetCategoria, clientesTargetSectores, clientesTargetIntereses, idCampania) {

    const requestStr = `update tbl_TuCampania set ClientesTargetSector = '${clientesTargetSector}', ClientesTargetCategoria = '${clientesTargetCategoria}', ClientesTargetSectores = '${clientesTargetSectores}', ClientesTargetIntereses = '${clientesTargetIntereses}' where IDCampania = ${idCampania}`;    
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

db.updateCobertura = function (idCampania,idEstado,idUsuario) {

    const requestStr = `insert into tbl_TuCampaniaCobertura (IDCampania,IdPAIS,IDESTADO,IDUSUARIO) VALUES (${idCampania},156,${idEstado},${idUsuario});
                        update TBL_BRIEF set IDESTADO = ${idEstado} where IDUSUARIO = ${idUsuario}`;
    
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

db.updateCoberturaRegion = function (idCampania,idEstado,idUsuario) {

    const requestStr = `insert into tbl_TuCampaniaCobertura (IDCampania,IdPAIS,IDESTADO,IDUSUARIO) VALUES (${idCampania},156,${idEstado},${idUsuario});`;
    
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

db.updateCoberturaNacional = function (idCampania,idUsuario) {

    const requestStr = `insert into tbl_TuCampaniaCobertura (IDCampania,IdPAIS,IDESTADO,IDUSUARIO) VALUES (${idCampania},156,NULL,${idUsuario});`;
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

db.executeGetInicioCampana = function (idUsuario) {

    // const requestStr = select top 1 (DATEDIFF (DAY,DATEADD(DAY,1,FInicio),GETDATE()) + 1 ) as inicioCampana from kad_Tbl_Membresias where IDUSUARIO = ${idUsuario} order by IDMembresia ASC`;

    const requestStr = `
    SELECT CAT.idUsuario, PAG.Monto, PAG.idPago, PAG.idProspecto AS 'UltimoProspecto', PAGP.idProspecto AS 'PenultimoProspecto', ULTIMAMEM.DiasPagados AS 'UltimoDiasPagados', (PENMEM.DiasPagaDos + PENMEM.DiasRegalados)  AS 'PenultimoDiasPagados',ULTIMAMEM.Finicio AS 'UltimaFInicio',PENMEM.Finicio AS 'PenultimaFInicio',PRIMEM.Finicio AS 'FInicio', DATEDIFF(DAY,PENMEM.Finicio,ULTIMAMEM.Finicio) DiasDif,(DATEDIFF (DAY,DATEADD(DAY,1,ULTIMAMEM.FInicio),GETDATE()) + 1 ) as inicioCampana, DATEDIFF(DAY,DATEDIFF(DAY,PENMEM.Finicio,ULTIMAMEM.Finicio) ,(PENMEM.DiasPagaDos + PENMEM.DiasRegalados)) duracion FROM CATUSUARIO CAT
    OUTER APPLY (SELECT TOP 1 * FROM kad_Tbl_PagosClientesKoomkinAdmin PAG
			WHERE PAG.idUsuario = CAT.idUsuario
			AND estatus='A'
			ORDER BY idPago DESC) PAG
    OUTER APPLY (SELECT TOP 1 * FROM kad_Tbl_PagosClientesKoomkinAdmin PAGP
			WHERE PAGP.idUsuario = CAT.idUsuario
			AND estatus='A'
            AND PAGP.idProspecto NOT IN
            (SELECT TOP 1 IDPROSPECTO FROM kad_Tbl_PagosClientesKoomkinAdmin PAG WHERE PAG.idUsuario= CAT.idUsuario AND estatus='A' ORDER BY idPago DESC)
            ORDER BY idPago DESC)PAGP
    OUTER APPLY (SELECT TOP 1 * FROM kad_Tbl_PagosClientesKoomkinAdmin PAGI
            WHERE PAGI.idUsuario = CAT.idUsuario
            AND estatus='A'
            AND PAGI.idProspecto NOT IN
            (SELECT TOP 1 IDPROSPECTO FROM kad_Tbl_PagosClientesKoomkinAdmin PAG WHERE PAG.idUsuario= CAT.idUsuario AND estatus='A' ORDER BY idPago DESC)
            ORDER BY idPago ASC)PAGI
    LEFT JOIN kad_Tbl_Membresias ULTIMAMEM ON ULTIMAMEM.IDPROSPECTO=PAG.idProspecto
    LEFT JOIN kad_Tbl_Membresias PENMEM ON PENMEM.idProspecto=PAGP.idProspecto
    LEFT JOIN kad_Tbl_Membresias PRIMEM ON PRIMEM.idProspecto=PAGI.idProspecto
    WHERE CAT.idUsuario = ${idUsuario}`;

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

db.executeGetCobertura = function (idUsuario, idCampania) {

    const requestStr = `select * from tbl_tucampaniacobertura where IDUSUARIO = ${idUsuario} and IDCampania = ${idCampania}`;
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

db.executeLastUpdateMembership = function (RecurringPaymentID, RecurringPaymentUUID) {

    const requestStr = `select top 1 * from RecurringPaymentUpsell where RecurringPaymentID = ${RecurringPaymentID} and RecurringPaymentUUID = '${RecurringPaymentUUID}' order by ID desc`;
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

db.executeUpdateMembership = function (RecurringPaymentID, RecurringPaymentUUID, amount) {

    const requestStr = `insert into RecurringPaymentUpsell (RecurringPaymentID,RecurringPaymentUUID,Amount,Enabled,RegistrationDate)
    VALUES (${RecurringPaymentID},'${RecurringPaymentUUID}','${amount}',1,GETDATE());
    
    select top 1 * from RecurringPaymentUpsell where RecurringPaymentID = ${RecurringPaymentID} and RecurringPaymentUUID = '${RecurringPaymentUUID}' order by ID desc`;
        
    return new Promise((resolve, reject) => {
        tp.sql(requestStr)
        .execute()
        .then(results => {
            resolve(results);
        })
        .catch(err => {
            reject(err);
        });
    });
};

db.executeCancelUpdateMembership = function (RecurringPaymentID) {

    const requestStr = `UPDATE RecurringPaymentUpsell SET CancellationDate = GETDATE(),Enabled = 0 WHERE RecurringPaymentID = ${RecurringPaymentID} and ID = (select top 1 ID from RecurringPaymentUpsell where RecurringPaymentID = ${RecurringPaymentID} order by ID desc);`

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

db.executeGetEstados = function () {

    const requestStr = `select IDESTADO,NOMBRE From CATESTADO where IDPAIS = 156`;
    
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

db.executeGetEmpresas = function () {

    const requestStr = `select ID_TIPOEMPRESA,TIPOEMPRESA from TBL_CATALOGOTIPOEMPRESA`;
    
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

db.executeGetCodigoPostal = function (cp) {

    const requestStr = `select CP, Estado From Tbl_SEPOMEX where CP = ${cp}`;
        
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

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;

}


module.exports = db;

