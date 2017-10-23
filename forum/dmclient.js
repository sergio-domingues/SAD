var dm = require ('./dm_remote.js');

//Asignamos el host y el puerto mediante la funcion auxiliar que implementamos
var HOST = getHostByArg();
var PORT = getPortByArg();

//Funcion auxiliar para procesar los argumentos y conocer el puerto a conectarse
function getPortByArg(){
	//Recojemos los parametros con slice a partir del segundo elemento de la peticion
	var args = process.argv.slice(2);
	
	//Valor por defecto para el puerto
	var port = 9000;
	
	//console.log("Port " + port);

    if(args.length > 0){
		//Procesamos el array de parametros para conocer el par host:puerto
		var aux = args[0]
		var args_split = aux.split(":");

		//Asignamos a port el valor posterior a la aparicion del separador :
		port = args_split[1];
		
		//console.log("Port " + port);
    }

    return port;
}

//Funcion auxiliar para procesar los argumentos y conocer el host a conectarse
function getHostByArg(){
	//Recojemos los parametros con slice a partir del segundo elemento de la peticion
	var args = process.argv.slice(2);

	//Valor por defecto para el host
	var host = '127.0.0.1';
	
	//console.log("Host " + host);

    if(args.length > 0){
		//Procesamos el array de parametros para conocer el par host:puerto
		var aux = args[0]
		var args_split = aux.split(":");

		//Asignamos a host el valor anterior a la aparicion del separador :
		host = args_split[0];
		
		//console.log("Host " + host);
    }

    return host;
}


dm.Start(HOST, PORT, function () {
    // Write the command to the server 
   	dm.getSubjectList (function (ml) {
   		console.log ("here it is:")
   		console.log (JSON.stringify(ml));
   	});
});
