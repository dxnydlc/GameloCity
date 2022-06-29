// middlewareHeader.js

const jwt = require('jwt-simple');
const moment = require('moment');

const checkToken = (req,res,next) => {
	
	//console.log( req.query.user_token );
	// hay token¿?
	if(! req.query.user_token ){
		return res.json({estado:'ERROR',error:'Api token no encontrado'});
	}

	const userToken = req.query.user_token;
	let payload = {};

	try{
		payload = jwt.decode(userToken,'semilla');
	}catch(err){
		return res.json({estado:'ERROR',error:'el token es incorrecto','scope':'TOKEN', 'g' : userToken });
	}

	if( payload.expiredAt < moment().unix() ){
		return res.json({estado:'ERROR',error:'El token ha expirado, vuelve a iniciar sessión','scope':'TOKEN'});
	}

	req.usuarioId = payload.usuarioId;
	

	next();
};



module.exports = {
	checkToken : checkToken
}