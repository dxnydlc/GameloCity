
// api_auth.js



var _NombreDoc = 'api_auth';
const router = require('express').Router();
const {check,validationResult} = require('express-validator');
const { Op } = require("sequelize");

const dotenv = require('dotenv');
dotenv.config();
// >>>>>>>>>>>>>    SPARKPOST   >>>>>>>>>>>>>
const SparkPost = require('sparkpost')
const clientMail    = new SparkPost(process.env.SPARKPOST_SECRET);

// >>>>>>>>>>>>>    MOMENT      >>>>>>>>>>>>>
const moment = require('moment');
//var moment = require('moment-timezone');
//moment().tz("America/Lima").format();
// moment().format('YYYY-MM-DD HH:mm:ss');

// >>>>>>>>>>>>>    NEXMO       >>>>>>>>>>>>>
const Nexmo         = require('nexmo');
const BitlyClient   = require('bitly').BitlyClient;
const bitly         = new BitlyClient(process.env.BITLY_API);

// LEER EXCEL
const reader = require('xlsx');

// Modelos
const { errorLogModel } = require('../../dbA');
const { User, sequelize, accesoModuloModel } = require('../../db');



const bcrypt = require('bcryptjs');
const jwt = require('jwt-simple');



var _Requeridos = [
    check('UserName' ,'Ingrese nombre de usuario').not().isEmpty(),
    check('DNI' ,'Ingrese DNI').not().isEmpty(),
    check('Password' ,'Ingrese contraseña').not().isEmpty()
];




//////////////////////////////////////////////
//              LOGIN DE USUARIO            //
//////////////////////////////////////////////

// -------------------------------------------

router.post('/signin', _Requeridos , async (req,res)=>{
	// UserName, Password, DNI, Modulo

	const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}

	var _response 	 = {};
    _response.codigo = 200;
    _response.data 	 = [];
	var _dataIN 	 = {};

	try {
		//
		// *****************************************
		// LOGIN CON ACCESO A MODULO
		const userData = await User.findOne({
			where : {
				usuario : req.body.UserName,
				dni   : req.body.DNI,
				deleted_at : { [Op.is] : null },
				estado : 1
			}
		});
		//
		if( userData ){
			//Existe correo
			// las claves existen?
			const iguales = bcrypt.compareSync(req.body.Password,userData.password);
			if( iguales ){
				const accesoModUser = await accesoModuloModel.findOne({
					where : {
						email : userData.email,
						modulo:req.body.Modulo,
						deleted_at : { [Op.is] : null },
						estado : 1
					}
				});
				if( accesoModUser ){
					// res.json({estado:'OK',token: createToken(userData) });
					var _token = createToken(userData);
					console.log(_token);
					_dataIN.user_token 	= _token;
					_dataIN.api_token 	= userData.api_token;
					_dataIN.UUID 	= userData.uu_id;
					_dataIN.Usuario = userData.usuario;
					_dataIN.Nombre  = userData.name;
					_dataIN.Puesto  = userData.puestoiso;
					_dataIN.Avatar  = userData.avatar;
					_dataIN.DNI     = userData.dni;
					_dataIN.Tipo    = userData.TipoUsuario;
					_dataIN.trabajo_ot = userData.trabajo_ot;
					_dataIN.trabajo_iniciado = userData.trabajo_iniciado;
					_dataIN.IdOT = userData.IdOT;
					//
					_response.resp = { 'titulo' : `Correcto` , 'clase' : `success` , 'texto' : `Acceso correcto.` };
					_response.data = _dataIN;
				}else{
					// res.json({estado:'ERROR',error:'Acceso a este modulo no esta permitido'});
					_response.codigo = 401;
					_response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' : `Acceso a este modulo no esta permitido.` };
				}
				
			}else{
				// res.json({estado:'ERROR',error:'Error en usuario y/o contraseña - level1'});
				_response.codigo = 401;
				_response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' : `Error en usuario y/o contraseña - level1.` };
			}
		}else{
			// res.json({estado:'ERROR',error:'Error en usuario y/o contraseña - level2'});
			_response.codigo = 401;
			_response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' : `Error en usuario y/o contraseña - level2.` };
		}
        //
    } catch (error) {
        _response.codigo = 500;
        _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${error}.` };
    }
    //
	return res.status(_response.codigo).json( _response );
});

// -------------------------------------------
// -------------------------------------------
// -------------------------------------------
// -------------------------------------------
// -------------------------------------------
// -------------------------------------------
// -------------------------------------------
// -------------------------------------------
// -------------------------------------------
// -------------------------------------------
// -------------------------------------------
// -------------------------------------------
// -------------------------------------------
// -------------------------------------------
// -------------------------------------------
// -------------------------------------------
// -------------------------------------------
// -------------------------------------------
////////////////////
// Crear un token //
////////////////////
const createToken = (user) => {
	var _fechaCaducar = moment().add(10,'hours');
	var _expiredAt = moment(_fechaCaducar).unix();
	console.log( `Fecha caducar token: ${_fechaCaducar}.`);
	//
	const payload = {
		usuarioId : user.id,
		createdAt : moment().unix(),
		expiredAt : moment().add( 1 ,'hours').unix()
	}
	console.log(`${payload.expiredAt} - ${moment().unix()}.`);
	return jwt.encode( payload , 'semilla' );
}
// -------------------------------------------
function varDump( _t )
{
    console.log( _t );
}
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
module.exports = router;
// -------------------------------------------
