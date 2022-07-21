const jwt = require('jwt-simple');
const moment = require('moment');

const checkToken = (req,res,next) => {

	var _response = {};
    _response.codigo = 200;
	
	// hay token¿?
	if(! req.headers['user-token'] )
	{
		_response.resp   = { 'titulo' : `Correcto` , 'clase' : `error` , 'texto' : `Api token no encontrado.` };
		_response.scope  = 'TOKEN';
		_response.codigo = 401;
		return res.status(_response.codigo).json( _response );
		return res.json({estado:'ERROR',error:'Api token no encontrado'});
	}

	const userToken = req.headers['user-token'];
	let payload = {};

	try{
		payload = jwt.decode(userToken,'semilla');

		var dateString = moment.unix( payload.expiredAt ).format('YYYY-MM-DD HH:mm:ss');

		console.log( `${dateString} >>>>>` );
	}catch(err){
		_response.resp   = { 'titulo' : `Correcto` , 'clase' : `error` , 'texto' : `El token es incorrecto.` };
		_response.scope  = 'TOKEN';
		_response.codigo = 401;
		return res.status(_response.codigo).json( _response );
	}

	if( payload.expiredAt < moment().unix() )
	{
		//
		_response.resp = { 'titulo' : `Correcto` , 'clase' : `error` , 'texto' : `El token ha expirado, vuelve a iniciar sessión.` };
		_response.scope  = 'TOKEN';
		_response.codigo = 401;
		return res.status(_response.codigo).json( _response );
	}

	req.usuarioId = payload.usuarioId;
	

	next();
};



module.exports = {
	checkToken : checkToken
}