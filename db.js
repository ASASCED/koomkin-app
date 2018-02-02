var Connection = require('tedious').Connection
//var FB_API_VERSION = "2.10"
var config = {
    userName: 'USERKOOMKIN',
    password: 'Ag0K00M',
    //password: 'U$3rk00mk1n',
    //server: '187.162.76.74',
    //server: '192.168.5.70',
    //server:'187.188.105.90',
    server: '187.162.208.218',
  
    options: {
        port: 1439,
        //port:1433,
        //database: 'AGO_KOOMKIN'
        database: 'aaa'
    },
  
    FB_API_VERSION: "2.10"
  };

var db = {}

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

db.executeModifyLead = function (clave, classification, command, callback) {
    var connection = new Connection(config);
    var result = [];

    connection.on('connect', function (err) {

        var Request = require('tedious').Request;

        var requestStr = `exec ${command} '${classification}', ${clave} `;

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

db.verificarPopup = function(usuario,callback){
	var connection = new Connection(config);
	var result = [];
	
	connection.on('connect', function(err) {
		
		var Request = require('tedious').Request;
		//var TYPES = require('tedious').TYPES;

		var requestStr = "EXECUTE SP_muestratutorial " + usuario;
		
		request = new Request(requestStr, function(err,rowCount) {
			if (err) {
                callback(err);
            } else {
                callback(null, result);
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
	});
}

module.exports = db;

