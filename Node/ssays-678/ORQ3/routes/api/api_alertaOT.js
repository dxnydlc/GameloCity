// api_alertaOT:
var _NombreDoc = 'api_alertaOT';

const router = require('express').Router();
const {check,validationResult} = require('express-validator');
const { Op } = require("sequelize");

const dotenv = require('dotenv');
dotenv.config();
// >>>>>>>>>>>>>    SPARKPOST   >>>>>>>>>>>>>
const SparkPost = require('sparkpost')
const clientMail    = new SparkPost(process.env.SPARKPOST_SECRET);

var validatorCorreo = require("email-validator");

// >>>>>>>>>>>>>    MOMENT      >>>>>>>>>>>>>
var moment = require('moment-timezone');
moment().tz("America/Lima").format();
// moment().format('YYYY-MM-DD HH:mm:ss');

// >>>>>>>>>>>>>    NEXMO       >>>>>>>>>>>>>
const Nexmo         = require('nexmo');
const BitlyClient   = require('bitly').BitlyClient;
const bitly         = new BitlyClient(process.env.BITLY_API);

// WHATSAPP
const config = require("./whatsapp.js");
const tokenWS = config.token, apiUrlWS = config.apiUrl;
const fetch = require('node-fetch');
var _LogoSSAYS = 'https://api2.ssays-orquesta.com/logo-ssays-2019-2.png';

// LEER EXCEL
const reader = require('xlsx');

// Modelos
const { errorLogModel } = require('../../dbA');

const { User, otModel, OSModel, sequelize } = require('../../db31');

var _fechaLatFormat = "%d/%m/%Y %H:%i",_fechaONlyLatFormat = "%d/%m/%Y";

const { mail_boleta } = require( './mail_plantillas' );

// Controlador
const helpersController  = require('../../controllers/helpersController');
//const estadoDocController = require('../../controllers/estadoDocController');

// ====================================================
// ====================================================
// ====================================================
// ====================================================
// ====================================================
//////////////////////////////////////////////////////////
//      			OBTENER ULTIMOS 200     			//
//////////////////////////////////////////////////////////
router.get('/',async(req,res)=>{
    var _response = {};
    _response.codigo = 200;
	
    try {
        _response.data = [];
        _response.ut   = await helpersController.getUserData( req.headers['api-token'] );
        //
        _response.data = await execQuery( [] , 200  );
        //
    } catch (error) {
        helpersController.captueError( '' , `>>>${error}` );
        _response.codigo = 500;
        _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${error}.` };
    }
    //
	return res.status(_response.codigo).json( _response );
	
});
// ====================================================
// -------------------------------------------------------------

async function execQuery( _where , _limit  )
{
    //
    var _dataResp = [];
    var _editItem = [ sequelize.fn('CONCAT' , '<button data-id="', sequelize.col('IdOT') , '" data-uuid="', sequelize.col('uu_id') ,'" data-estado="', sequelize.col('Estado') ,'" type="button" class=" getData btn btn-block btn-primary btn-xs"><i class="fa fa-edit" ></i></button>') , 'Editar' ];
    //var _DelItem =  [ sequelize.fn('CONCAT' , '<button data-id="', sequelize.col('id') , '" data-uuid="', sequelize.col('uu_id') ,'" data-nombre="', sequelize.col(_NOmbre) ,'" type="button" class=" docDelete btn btn-block btn-danger btn-xs"><i class="fa fa-close" ></i></button>') , 'Anular' ];

    var _atributos = [
        _editItem,
        'IdOT',
        [ sequelize.fn('DATE_FORMAT' ,sequelize.col('Fecha') , _fechaONlyLatFormat ) , 'Fecha'],
        ['nombre_cliente','Cliente'],
		['local','Sucursal'],
		['TipoServicio','T.Serv'],
		['NroAplicacion','Nro Aplicación'],
		['NroOS','Nro OS'],
		['NroCertificado','Nro Certificado'],
		['SubEstado','SubEstado'],
		['Estado','Estado'],
		['MotivoAnulacion','Motivo Anulación'],
		['Descripcion','T.Serv'],
		[ sequelize.fn('DATE_FORMAT' ,sequelize.col('updated_at') , _fechaLatFormat ) , 'Modificado'],       
        'Estado',
        
    ];
    //
    _dataResp = await otModel.findAll({
        attributes : _atributos ,
        order : [
            ['Fecha' , 'DESC']
        ],
        where : _where,
        limit : _limit
    })
    return _dataResp;
    //
}


// ====================================================
// ----------------------------------------------------
// Buscar OT trabajo
// -------------------------------------------------------
router.post('/buscar_ot', async (req,res)=>{
    // Inicio, Fin, IdCli, IdLocal, Ubigeo
    var _response = {};
    _response.codigo = 200;

    _response.locales = [];
    _response.data    = [];
	_response.dataOT    = [];
    _response.files   = [];
	
    try {
        //
        var _where = {};//OS
		
       // _where.Estado = 'Aprobado';
        _where.FechaMySQL = { [Op.gte ]: req.body.Inicio, [Op.lte ]: req.body.Fin };
				
		if( req.body.NroOS )        {
            _where.IdOS = req.body.NroOS;			
        }
		if(req.body.NroOt)
        {
			var temIdOT = req.body.NroOt;	
        }
		if( req.body.IdCli )
        {
            _where.IdClienteProv = req.body.IdCli;
        }
        if( req.body.IdLocal )
        {
            _where.IdLocal = req.body.IdLocal;
        }
        if( req.body.Dist )
        {
            _where.idUbigeo = req.body.Dist;
        }
	
		// Buscar por IdOT
		if( temIdOT ){		
			var _arrIdOT = [];
			var $ids = temIdOT;
			_arrIdOT = $ids.split(',');
			var  _otDatA = await otModel.findAll({
			
				where: { 
					IdOT : { [Op.in]: _arrIdOT },
					FechaMySQL : { [Op.gte ]: req.body.Inicio, [Op.lte ]: req.body.Fin }
				}
			});
			var _arrIdOT = [];
			if( _otDatA )
			{
				for (let index = 0; index < _otDatA.length; index++) {
					const rs = _otDatA[index];
					_arrIdOT.push( rs.IdOT );
					_arrIdOT.push( req.body.Inicio );
					_arrIdOT.push( req.body.Fin );	
				
				}
				// Ahora buscamos las OTs
				_response.data = await execQuery( 
					{ IdOT : { [Op.in]: _arrIdOT }, 
					FechaMySQL: {[Op.gte ]: req.body.Inicio, [Op.lte ]: req.body.Fin} } , 2000  
					);
			}
		}else{
			var _osDatA = await OSModel.findAll({
				attributes:[ 'IdOS' ],
				where: _where
			});
			var _arrIdOS = [];
			//var _arFechaOT = [req.body.Inicio, req.body.Fin];
			
			if( _osDatA )
			{
				for (let index = 0; index < _osDatA.length; index++) {
					const rs = _osDatA[index];
					_arrIdOS.push( rs.IdOS );
					_arrIdOS.push( req.body.Inicio );
					_arrIdOS.push( req.body.Fin );	
				
				}
				// Ahora buscamos las OTs de las OS
				_response.data = await execQuery( 
											{ NroOS : { [Op.in]: _arrIdOS }, 
											FechaMySQL: {[Op.gte ]: req.body.Inicio, [Op.lte ]: req.body.Fin} } , 2000  
											);	
			}
		}

        //
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Ok.` };
        //
    } catch (error) {
        //varDump(`Error: ${error}.`);
        _response.codigo = 500;
        _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${error}.` };
    }

    return res.status(_response.codigo).json( _response );
    //
});

// ----------------------------------------------------
// -------------------------------------------------------------
//////////////////////////////////////////////////////////
//                  CARGAR DOCUMENTO                    //
//////////////////////////////////////////////////////////
router.post('/get_data', async (req,res)=>{
    // uuid
    var _response = {};
    _response.codigo = 200;

    _response.locales = [];
    _response.data    = [];
    _response.files   = [];
	
    try {
        //
        var _Entidad = await otModel.findOne({
            where : {
                uu_id : req.body.uuid
            }
        })
        .catch(function (err) {
            helpersController.captueError( err.original , req.body );
            _response.codigo = 400;
            _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  err.original.sqlMessage };
        });
        //
        _response.data = _Entidad;
        
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Se cargaron los datos del documento: ${_Entidad.Codigo}.` };
        //
    } catch (error) {
        varDump(`Error: ${error}.`);
        _response.codigo = 500;
        _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${error}.` };
    }

    return res.status(_response.codigo).json( _response );
    //
});

// ----------------------------------------------------
// -------------------------------------------------------------
//////////////////////////////////////////////////////////
//                  ACTUALIZAR DOCUMENTO                //
//////////////////////////////////////////////////////////
router.put('/:uuid', 
[
	check('cboEstado' ,'Ingrese Estado').not().isEmpty(),
    check('MotivoAnulacion' ,'Ingrese Motivo de anulación').not().isEmpty()
], async (req,res)=>{
    // uuid
    var _response = {};
	var motivo;
	_response.data = [];
	//var $IdOT= req.body.IdOT;
    _response.codigo = 200;
	
    try {
        
        //var $userData = await helpersController.getUserData( req.headers['api-token'] );
        
        //
		if(req.body.cbtMotivo == 'Otros'){
			motivo = req.body.motivo;
		}else{
			motivo = req.body.cbtMotivo;
		}
		
		delete req.body.IdOT;
        await otModel.update({
			Estado : req.body.estado,
			MotivoAnulacion : motivo
		},{
            where : { 
                uu_id : req.body.uu_id
            }
        })
        .catch(function (err) {
            helpersController.captueError( err.original , req.body );
            _response.codigo = 400;
            _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  err.original.sqlMessage };
        });
        
        _response.item = await otModel.findOne({
            where : {
                uu_id : req.body.uu_id
            }
        });
		
		var fecha = moment(_response.item.updated_at).format('YYYY-MM-DD HH:mm:ss');
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Se actualizó el documento ${req.body.IdOT} correctamente.` };
        //
    } catch (error) {
        helpersController.captueError( '' , `>>>${error}` );
		//console.log(error);
        _response.codigo = 500;
        _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${error}.` };
    }

	//res.json( _response );
	return res.status(_response.codigo).json( _response );
});



// ----------------------------------------------------

// -------------------------------------------------------------
//////////////////////////////////////////////////////////
//                  ENVIAR WHATSSAP                //
//////////////////////////////////////////////////////////
router.post('/enviar_whatssap_ot',async(req,res)=>{
	
    // IdOT, estado, motivo, fechaModificacion, uu_id
    var $response = {};
	$response.estado = 'OK';
	$response.data = [];
    var fechaModificacion =  moment(req.body.fechaModificacion).format('YYYY-MM-DD HH:mm:ss');
	
	var $userData = await getUserData( req.headers['api-token'] );
	//var $DNI = $userData.dni;
	var $name = $userData.name;

	if(req.body.motivo){
		// Ahora enviamos el mensaje de texto	
		_arrCelular = ['945033750', '989309500']; // celulares a enviar // ing. karla: 989309500 - señor antonio: 977195937
		
		for(let i = 0; i < _arrCelular.length; i++)
		{
			var $celular = _arrCelular[i];
			
				if( $celular.length == 9 )
				{		
					
					const from = 'SSAYS SAC';
					var to   = '51'+$celular;
					// Enviar WhatsApp			
					var descripcion = `Área de SISTEMAS-SSAYS SAC: Usuario:${$name}, Nro OT: ${req.body.IdOT}, Estado: ${req.body.estado}, Motivo: ${req.body.motivo}, Fecha anulado: ${fechaModificacion}`;
					
					// Enviando texto
					var _envioCel = await apiChatApi( 'sendMessage', { phone : to , body: descripcion });
					
					if( _envioCel )
						{
							if( _envioCel.sent == true )
							{
								console.log(`OT => MSG ENVIADO CORRECTAMENTE: ${to}`);
							
							}
						}
				}
		}
	}	

			res.json( $response );
});



// ----------------------------------------------------

// -------------------------------------------------------
async function renovarToken()
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

// -------------------------------------------------------
async function getUserData( $token )
{
    var $data;
    $data = await User.findOne({
        attributes: ['id', 'uu_id','name', 'email','dni','api_token','id_empresa','empresa','celular'],
        where : {
            api_token : $token
        }
    });
    return $data;
}

// -------------------------------------------------------
async function apiChatApi( method , params ){
    const options = {};
    options['method'] = "POST";
    if( params != '' ){
        options['body'] = JSON.stringify(params);
    }
    options['headers'] = { 'Content-Type': 'application/json' };
    
    const url = `${apiUrlWS}${method}?token=${tokenWS}`; 
    const apiResponse = await fetch(url, options);

    const jsonResponse = await apiResponse.json();
    return jsonResponse;
}


// -------------------------------------------------------
async function captueError( error , post )
{
    var _envio       = JSON.stringify(post);
    var _descripcion = JSON.stringify(error);
    var _uuid = await renovarToken();
    await errorLogModel.create({
        uu_id  : _uuid,
        modulo : _NombreDoc,
        descripcion : _descripcion,
        envio : _envio
    })
    .catch(function (err) {
        console.log(_NombreDoc);
        console.log(err);
    });
}
// -------------------------------------------------------
// -------------------------------------------------------

// -------------------------------------------------------
function pad_with_zeroes( number , length )
{
    var my_string = '' + number;
    while (my_string.length < length) {
        my_string = '0' + my_string;
    }
    return my_string;
}
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------

module.exports = router;
