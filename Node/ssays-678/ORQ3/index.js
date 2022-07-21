
const express = require('express');
var exphbs  = require('express-handlebars');
const path = require('path');
const app = express();
var os = require('os');

// >>>>>>>>>>>>>    MOMENT      >>>>>>>>>>>>>
var moment = require('moment-timezone');
moment().tz("America/Lima").format();
// moment().format('YYYY-MM-DD HH:mm:ss');

const https = require("https");
const fs = require("fs");

const bodyParser = require('body-parser');
const apiRouter = require('./routes/api');
var cors = require('cors');
var session = require('cookie-session');

const dotenv = require('dotenv');
dotenv.config();
app.use(cors());

app.use( session({secret : 'nodeJS'}) );

app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
	defaultLayout : 'main',
	extname : '.hbs'
}));
app.set('view engine', '.hbs');
// Static files
app.use(express.static( path.join(__dirname, 'public') ));


// https://www.npmjs.com/package/mysql2#first-query
var mysql      = require('mysql2');
var connection = mysql.createConnection({
  host     : process.env.DB_host,
  user     : process.env.DB_user,
  password : process.env.DB_password,
  database : process.env.DB_database
});

connection.connect(function(err) {
	console.log( err );  
});

// __dirname

const httpsOptions = {
	key  : fs.readFileSync(`${process.env.KEY_key}`),
	cert : fs.readFileSync(`${process.env.KEY_cert}`)
};


const puerto = process.env.PORT;
var $NombreUser = '', $IdUser = '';

app.set( 'port' , process.env.PORT || puerto );

var APP_TIPO = process.env.APP_TIPO;
console.log(`Estamos en===> ${APP_TIPO}`);

var _fechitaLocal = moment().format('DD/MM/YYYY HH:mm:ss');


// El archivo SERVIDOR.JS contiene la configuración
//const server = require("./servidor.js");


/**
// *********** PRODUCCION ***********
const server = https.createServer( httpsOptions , app  )
.listen( puerto , function (){
	console.log('#############################');
	console.log('*** PR0DUCCION ***');
	console.log("Servidor iniciado puerto ****"+puerto+"****");
	console.log('SERVIDOR NODEJS - ORQUESTA3');
	console.log('#############################');
});
/**/


/**/
// *********** DEVELOP ***********
const server = app.listen( app.get('port') , () =>{
	console.log('##################################');
	console.log(`# viva la madre rusia: ${puerto}      #`);
	console.log(`# SERVIDOR NODEJS - ORQUESTA3    #`);
	console.log(`#        ${_fechitaLocal}     #`);
	console.log('##################################');
});
/**/

//console.log(server);

const SocketIO = require('socket.io');
const io = SocketIO( server );

// Cargamos Base de datos
require('./db');
const {  auditoriaSSAYSModel } = require('./dbA');

// websocket
io.on('connection', function(socket){
	// -------------------------------------------------------------------
	console.log('Usuario conectado a la URSS => '+socket.id+' '+os.hostname() +' '+os.platform()+' '+puerto);
	socket.on('chat message', function(msg){
		io.emit('chat message', msg);
	});
	// -------------------------------------------------------------------
	// envio de mensaje
	socket.on('chat:message' , (data)=> {
		// onsole.log('Enviando data '+data );
		io.sockets.emit('chat:message' , data );
		$NombreUser = data.username;
		$IdUser 	= data.dni;
		console.log('Enviando data '+$NombreUser+' '+data.dni+' '+data.idU );
		// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
		//insertarAudit( ' Conexión entrante' , data.dni, data.user );
		// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
		userOnLine( data.idU, $NombreUser, data.dni , data.moduloU , os.platform() , os.hostname() , socket.id, data.appU );
		/**
		var date = new Date();
		connection.query(
			'SELECT * FROM orq_usuarios_linea WHERE estado = ? AND DATE(created_at) = ?',
			[ 'ON-LINE' , date.toISOString().split('T')[0] ],
			function(err, results) {
				io.sockets.emit('chat:ejecutivo' , results );
			}
		);
		// mandamos a la lista de usuarios conectados
		io.sockets.emit('usuario:conectado' , {user:$NombreUser,dni:data.dni} );
		// Resumen de usuarios conectados
		var date = new Date();
		connection.query(
			'SELECT * FROM orq_usuarios_linea WHERE estado = ? AND DATE(created_at) = ? GROUP BY id_usuario',
			[ 'ON-LINE' , date.toISOString().split('T')[0] ],
			function(err, results) {
				io.sockets.emit('users:online' , results );
			}
		);
		/**/
	});
	// -------------------------------------------------------------------
	// Mensaje para todos orq2 y orq3
	socket.on('ejecutivo:message:orq3' , (data)=> {
		socket.broadcast.emit('ejecutivo:message:orq3' , data );
	});
	socket.on('ejecutivo:message:orq2' , (data)=> {
		console.log( data );
		socket.broadcast.emit('ejecutivo:message:orq2' , data );
	});
	// -------------------------------------------------------------------

	// Mensaje para un usuario orq2 y orq3
	socket.on('ejecutivo:usuario:msg:orq3' , (data)=> {
		socket.broadcast.emit('ejecutivo:usuario:msg:orq3' , data );
	});
	socket.on('ejecutivo:usuario:msg:orq2' , (data)=> {
		socket.broadcast.emit('ejecutivo:usuario:msg:orq2' , data );
	});

	// -------------------------------------------------------------------
	// Reinciar navegador
	socket.on('ejecutivo:usuario:reload' , (data)=> {
		console.log( data );
		socket.broadcast.emit('ejecutivo:usuario:reload' , data );
	});
	// Cerrar session usuario orq3
	socket.on('ejecutivo:cerrar:orq3' , (data)=> {
		console.log( data );
		// { dni , user }
		socket.broadcast.emit('ejecutivo:cerrar:orq3' , data );
	});

	// -------------------------------------------------------------------
	// Accion reallizada por usuario
	socket.on('accion:todos' , (data)=> {
		// dni, msg, user
		// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
		insertarAudit( data.msg , data.dni, data.user );
		// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
		console.log( data );
		var $fecha = new Date().toLocaleString("es-ES", {timeZone: "America/Lima"});
		socket.broadcast.emit('accion:todos' , {dni:data.dni,msg:data.msg,user:data.user,fecha:$fecha} );
	});

	// -------------------------------------------------------------------
	// Usuarios conectados agrupados por usuario
	socket.on('users:online' , (data)=> {
		socket.broadcast.emit('users:online' ,data);
	});

	// -------------------------------------------------------------------
	// ta escribiendo...
	socket.on('chat:typing',function( data ){
		console.log( data );
		socket.broadcast.emit('chat:typing' ,data);
	});

	// -------------------------------------------------------------------
	// Marcar ReqMaterial con Guia Remision
	socket.on('prc:marcar:rm:from:guia' , (data)=> {
		// NroGuia, IdRM, user, dni
		console.log( data );
		MarcarGR_to_RM( data.NroGuia , data.IdRM );
		var $msg = 'Aprobar GR# <b>'+data.NroGuia+'</b>',$fecha=new Date().toLocaleString("en-US", {timeZone: "America/Lima"});
		var $dataSend = {user:data.user,msg:$msg,dni:data.dni,fecha:$fecha};
		socket.broadcast.emit('accion:todos' , $dataSend );
	});
	// -------------------------------------------------------------------
	// Quitar ReqMaterial con Guia Remision
	socket.on('prc:desmarcar:rm:from:guia' , (data)=> {
		// IdRM, user, dni
		console.log( data );
		DESMarcarGR_to_RM( data.IdRM );
		var $msg = 'Anular GR# <b>'+data.NroGuia+'</b>',$fecha=new Date().toLocaleString("en-US", {timeZone: "America/Lima"});
		var $dataSend = {user:data.user,msg:$msg,dni:data.dni,fecha:$fecha};
		socket.broadcast.emit('accion:todos' , $dataSend );
	});
	// -------------------------------------------------------------------
	// Usuario desconectado
	socket.on( 'disconnect' , (data) => {
		console.log( 'Usuario salió => '+$NombreUser+'-'+$IdUser+' token:'+socket.id );
		socket.broadcast.emit('user left', {
			username: $NombreUser
		});
		userOfLine( socket.id );
		/**
		var date = new Date();
		connection.query(
			'SELECT * FROM orq_usuarios_linea WHERE estado = ? AND DATE(created_at) = ?',
			[ 'ON-LINE' , date.toISOString().split('T')[0] ],
			function(err, results) {
				io.sockets.emit('chat:ejecutivo' , results );
			}
		);
		// Resumen de usuarios conectados
		var date = new Date();
		connection.query(
			'SELECT * FROM orq_usuarios_linea WHERE estado = ? AND DATE(created_at) = ? GROUP BY id_usuario',
			[ 'ON-LINE' , date.toISOString().split('T')[0] ],
			function(err, results) {
				io.sockets.emit('users:online' , results );
			}
		);
		/**/
	});
	// -------------------------------------------------------------------

	// Clonar OT
	socket.on('ot:clonar' , (data)=> {
		// IdOT
		console.log(data);
		socket.broadcast.emit('ot:clonar' , data );
	});
	// -------------------------------------------------------------------
	// Alerta de un usuario en ficha sintomatologia
	socket.on('ficha_observada' , (data)=> {
		console.log(data);
		socket.broadcast.emit('ficha_observada' , data );
	});
	// -------------------------------------------------------------------
	// Alerta de un usuario en ficha sintomatologia
	socket.on('supervision_auth' , (data)=> {
		// Actualizar la lista de supervisión en home de operaciones.
		console.log(data);
		socket.broadcast.emit('supervision_auth' , data );
	});
	// -------------------------------------------------------------------
	// Accion realizada por usuario AUDITADA
	socket.on('accion:audit' , (data)=> {
		// dni, msg, user , serie, corr , form
		// 2022 => token, url
		// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
		var _authDatita = {
			Evento 	: data.msg, 
			serie 	: data.serie, 
			corr 	: data.corr, 
			form 	: data.form, 
			Usuario : data.user, 
			DNI 	: data.dni, 
			Token 	: data.token, 
			Url 	: data.url
		};
		// Evento, serie, corr, form, Usuario, DNI, Token, Url
		insertarAudit3( _authDatita );
		//insertarAudit2( data.msg , data.dni, data.user , data.serie, data.corr , data.form );
		// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
		console.log( data );
		socket.broadcast.emit('accion:audit' , {data} );
	});
	// -------------------------------------------------------------------
	// Emitir documento de ventas
	socket.on('emitir_doc_ventas' , (data)=> {
		// dni, user, doc
		console.log( data );
		socket.broadcast.emit('emitir_doc_ventas' , {data} );
	});
	// -------------------------------------------------------------------
	// -------------------------------------------------------------------
	// -------------------------------------------------------------------
	// -------------------------------------------------------------------
	// -------------------------------------------------------------------
	// -------------------------------------------------------------------
	// -------------------------------------------------------------------
	// -------------------------------------------------------------------
	// -------------------------------------------------------------------
	// -------------------------------------------------------------------
	// -------------------------------------------------------------------
	// -------------------------------------------------------------------
	// -------------------------------------------------------------------
	// -------------------------------------------------------------------
	// -------------------------------------------------------------------
	// -------------------------------------------------------------------
	// -------------------------------------------------------------------
	// -------------------------------------------------------------------
	// -------------------------------------------------------------------
	// -------------------------------------------------------------------
	// -------------------------------------------------------------------
	// -------------------------------------------------------------------
	// -------------------------------------------------------------------
	// -------------------------------------------------------------------
});



// cargando archivo
// app.use( express.static( path.join( __dirname , 'public' ) ) );



app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({extended:true}));

app.use('/api',apiRouter);

app.get('/hola',(req,res)=>{
	res.send('hola mundo');
});

app.get('/',(req,res)=>{
	//res.send('hola mundo chato');
	res.sendFile( __dirname+"/public/index.html" );
});


/* &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& */
/* &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& */
/* &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& */
/* &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& */
/* &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& */
/* &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& */
/* &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& */
function userOnLine( $idU, $nameU, $dni , $modulo ,$so, $pc , $tokenSocket , $app )
{
	//
	var date = new Date(), $return = [];
	const { QueryTypes } = require('sequelize');
	//
	var $dataInsert = {
		node_id 	: $tokenSocket,
		id_usuario 	: $idU,
		usuario 	: $nameU,
		dni 		: $dni,
		modulo 		: $modulo,
		estado 		: 'ON-LINE',
		so 		: $so,
		pc 		: $pc,
		app 	: $app,
		glosa 	: '',
		created_at : date.toISOString().split('T')[0]+' '+date.toTimeString().split(' ')[0],
		updated_at : date.toISOString().split('T')[0]+' '+date.toTimeString().split(' ')[0]
	};
	connection.query('INSERT INTO orq_usuarios_linea SET ?', $dataInsert , function(err, result) {
	if (err) throw err;
		console.log('Insertado => '+result.insertId);
	});

	return $return;
}
/* &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& */
function userOfLine( $tokenSocket )
{
	var date = new Date(), $return = [];
	const { QueryTypes } = require('sequelize');

	var $dataUpdate = [ 
		'OFF-LINE',
		date.toISOString().split('T')[0]+' '+date.toTimeString().split(' ')[0], 
		$tokenSocket 
	];

	var sql = "UPDATE orq_usuarios_linea SET estado = ?,updated_at = ? WHERE node_id = ?" ;

	// execute the UPDATE statement
	connection.query(sql, $dataUpdate, (error, results, fields) => {
		if (error){
			return console.error(error.message);
		}
		console.log('Rows affected:', results.affectedRows);
	});

	return $return;
}
/* &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& */
function MarcarGR_to_RM( $NroGuia , $IdRM )
{
	// vamos a marcar un req de materiales con una guia.
	var date = new Date(), $return = [];
	const { QueryTypes } = require('sequelize');

	var $dataUpdate = [];

	var sql = "UPDATE utb_requerimientoscab SET NroGuia = '"+$NroGuia+"' WHERE IdRequerimientoCab = "+$IdRM ;

	// execute the UPDATE statement
	connection.query(sql, $dataUpdate, (error, results, fields) => {
		if (error){
			return console.error(error.message);
		}
		console.log('Rows affected:', results.affectedRows);
	});

	return $return;
}
/* &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& */
function DESMarcarGR_to_RM( $IdRM )
{
	// vamos a des marcar un req de materiales con una guia.
	var date = new Date(), $return = [];
	const { QueryTypes } = require('sequelize');

	var $dataUpdate = [];

	var sql = "UPDATE utb_requerimientoscab SET NroGuia = NULL WHERE IdRequerimientoCab = "+$IdRM ;

	// execute the UPDATE statement
	connection.query(sql, $dataUpdate, (error, results, fields) => {
		if (error){
			return console.error(error.message);
		}
		console.log('Rows affected:', results.affectedRows);
	});

	return $return;
}
/* &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& */
function getOnLine()
{
	var date = new Date(), $return = 0;
	connection.query(
		'SELECT * FROM orq_usuarios_linea WHERE estado = ? AND DATE(created_at) = ?',
		[ 'ON-LINE' , date.toISOString().split('T')[0] ],
		function(err, results) {
			//console.log(results);
			$return = results;
			return {'hi':5};
		}
	);

	//return $return;
}
/* &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& */
async function insertarAudit( _Evento , _DNI, _Usuario )
{
	//
	var _InsertA = {};
	_InsertA.uu_id = await creaToken();
	if( _DNI ){
		_InsertA.DNI = _DNI;
	}
	if( _Usuario ){
		_InsertA.Usuario = _Usuario;
	}
	_InsertA.Modulo 	= 'INDEX';
	_InsertA.Formulario = 'General';
	_InsertA.Evento 	= _Evento;

	await auditoriaSSAYSModel.create(_InsertA);
}
/* &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& */
async function creaToken()
{
    var length = 24;
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    result += '-';
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    result += '-';
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
/* &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& */
async function insertarAudit2( _Evento , _DNI, _Usuario, _serie, _corr , _form )
{
	//
	var _InsertA = {};
	_InsertA.uu_id = await creaToken();
	if( _DNI ){
		_InsertA.DNI = _DNI;
	}
	if( _Usuario ){
		_InsertA.Usuario = _Usuario;
	}
	_InsertA.Modulo 	 = 'INDEX';
	//_InsertA.Formulario  = 'General';
	_InsertA.Evento 	 = _Evento;
	_InsertA.Serie 		 = _serie;
	_InsertA.Correlativo = _corr;
	_InsertA.Formulario  = _form;

	await auditoriaSSAYSModel.create(_InsertA);
}
/* &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& */
async function insertarAudit3( _dataAuth )
{
	// Evento, serie, corr, form, Usuario, DNI, Token, Url
	var _InsertA = {};
	_InsertA.uu_id = await creaToken();
	//
	if( _dataAuth.DNI ){
		_InsertA.DNI = _dataAuth.DNI;
	}
	if( _dataAuth.Usuario ){
		_InsertA.Usuario = _dataAuth.Usuario;
	}
	if( _dataAuth.Url ){
		_InsertA.UrlOrigen = _dataAuth.Url;
	}
	if( _dataAuth.Token ){
		_InsertA.TokenDoc = _dataAuth.Token;
	}
	_InsertA.Modulo 	 = 'INDEX';
	//_InsertA.Formulario  = 'General';
	_InsertA.Evento 	 = _dataAuth.Evento;
	_InsertA.Serie 		 = _dataAuth.serie;
	_InsertA.Correlativo = _dataAuth.corr;
	_InsertA.Formulario  = _dataAuth.form;

	await auditoriaSSAYSModel.create(_InsertA);
}
/* &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& */
