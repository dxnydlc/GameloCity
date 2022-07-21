const router = require('express').Router();
const bcrypt = require('bcryptjs');
const {User,accesoModuloModel} = require('../../db');

const moment = require('moment');
const jwt = require('jwt-simple');


const {check,validationResult} = require('express-validator');


// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//////////////
// Registro //
//////////////
router.post('/register', [
		check('username' ,'El nombre de usuario es obligatorio').not().isEmpty(),
		check('password' ,'El password es obligatorio').not().isEmpty(),
		check('email' ,'El correo es incorrecto').isEmail()
	] , async (req,res)=>{

		const errors = validationResult(req);

		if( ! errors.isEmpty() ){
			return res.status(422).json({ errores : errors.array() });
		}

		req.body.password = bcrypt.hashSync(req.body.password, 10);
		const user = await User.create(req.body);
		res.json(user);
});

// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
///////////
// Login //
///////////
router.post('/login', async (req,res)=>{
	// email, password, dni
	const { Op } = require("sequelize");
	if( req.body.modulo == '' ){
		// SOLO LOGIN
		const userData = await User.findOne({where : {
			email : req.body.email,
			dni   : req.body.dni,
			deleted_at : { [Op.is] : null }
		}});
		//
		if( userData ){
			//Existe correo
			// las claves existen?
			const iguales = bcrypt.compareSync(req.body.password,userData.password);
			if( iguales ){
				res.json({estado:'OK',token: createToken(userData) });
			}else{
				res.json({error:'Error en usuario y/o contraseña - level1'});
			}
		}else{
			res.json({error:'Error en usuario y/o contraseña - level2'});
		}
		// *****************************************
	}else{
		// *****************************************
		// LOGIN CON ACCESO A MODULO
		const userData = await User.findOne({
			where : {
				email : req.body.email,
				dni   : req.body.dni,
				deleted_at : { [Op.is] : null },
				estado : 1
			}
		});
		//
		if( userData ){
			//Existe correo
			// las claves existen?
			const iguales = bcrypt.compareSync(req.body.password,userData.password);
			if( iguales ){
				const accesoModUser = await accesoModuloModel.findOne({
					where : {
						email:userData.email,
						modulo:req.body.modulo,
						deleted_at : { [Op.is] : null },
						estado : 1
					}
				});
				if( accesoModUser ){
					res.json({estado:'OK',token: createToken(userData) });
				}else{
					res.json({estado:'ERROR',error:'Acceso a este modulo no esta permitido'});
				}
				
			}else{
				res.json({estado:'ERROR',error:'Error en usuario y/o contraseña - level1'});
			}
		}else{
			res.json({estado:'ERROR',error:'Error en usuario y/o contraseña - level2'});
		}
	}
});

// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

// -------------------------------------------------------------

///////////
// Login por USARIO //
///////////

router.post('/login_usuario', async (req,res)=>{
	// UserName, Password, DNI, Modulo

	const { Op } = require("sequelize");

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
					_dataIN.user_token 	= _token;
					_dataIN.api_token 	= userData.api_token;
					_dataIN.UUID 	= userData.uu_id;
					_dataIN.Usuario = userData.usuario;
					_dataIN.Nombre  = userData.name;
					_dataIN.Puesto  = userData.puestoiso;
					_dataIN.Avatar  = userData.avatar;
					_dataIN.Tipo    = userData.TipoUsuario;
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

// -------------------------------------------------------------

//////////////////////////////////////////////////////////
//                  BUSCAR EN DOCUMENTO                 //
//////////////////////////////////////////////////////////
router.post('/login_out', async (req,res)=>{
    // 
    var _response = {};
    _response.codigo = 200;
    _response.data = [];

    try {
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Se cerró la sessión.` };
    } catch (error) {
        _response.codigo = 500;
        _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${error}.` };
    }

    return res.status(_response.codigo).json( _response );
    //
    res.json( $response );
});
// -------------------------------------------------------------

// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
// Login sin clave...
router.post('/f82e4a1c304baef7d2e36eec01f99688', async (req,res)=>{

	// uuid
	const { Op } = require("sequelize");
	const userData = await User.findOne({
		where : {
			uu_id   : req.body.uuid,
		}
	});

	res.json({estado:'OK',token: createToken(userData) });

});
// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

// -------------------------------------------------------------

////////////////////
// Crear un token //
////////////////////
const createToken = (user) => {
	const payload = {
		usuarioId : user.id,
		createdAt : moment().unix(),
		expiredAt : moment().add(10,'hours').unix()
	}
	return jwt.encode(payload,'semilla');
}
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------

module.exports = router;