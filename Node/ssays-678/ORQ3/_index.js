const express = require('express');
const path = require('path');
const app = express();
var os = require('os');

const https = require("https");
const fs = require("fs");

const bodyParser = require('body-parser');
const apiRouter = require('./routes/api');
var cors = require('cors');

// https://www.npmjs.com/package/mysql2#first-query
var mysql      = require('mysql2');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'ssays01'
});

connection.connect(function(err) {
	console.log( err );  
});

const httpsOptions = {
  key  : fs.readFileSync(__dirname+"/ssl/ssaysorquesta/star.ssays-orquesta.com.crt"),
  cert : fs.readFileSync(__dirname+"/ssl/ssaysorquesta/STAR_ssays-orquesta_com_key.key")
};


const puerto = 315;
var $NombreUser = '', $IdUser = '';


app.use(cors());
require('./db');
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({extended:true}));


app.set( 'port' , process.env.PORT || puerto );


/**
const server = https.createServer( httpsOptions , app  )
	.listen( puerto , function (){
		console.log(`Sirviendo a la union sovietica!`);
	}
);
/**/

const server = app.listen( app.get('port') , () =>{
        console.log('viva la madre rusia!');
});

const SocketIO = require('socket.io');
const io = SocketIO( server );

// websocket
io.on('connection', function(socket){
	// -------------------------------------------------------------------
	console.log('Usuario conectado a la URSS => '+socket.id+' '+os.hostname() +' '+os.platform()+' ');
	socket.on('chat:message', function(msg){
		console.log("reciending chato:"+msg);
		io.emit('chat message', msg);
	});
	// -------------------------------------------------------------------
	// -------------------------------------------------------------------
	// -------------------------------------------------------------------
	// -------------------------------------------------------------------
	// -------------------------------------------------------------------
});



// cargando archivo
// app.use( express.static( path.join( __dirname , 'public' ) ) );
//



app.use('/api',apiRouter);

app.get('/',(req,res)=>{
	res.send('hola mundo');
});

app.get('/chato',(req,res)=>{
	//res.send('hola mundo chato');
	res.sendFile( __dirname+"/public/index.html" )
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
/* &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& */
/* &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& */

