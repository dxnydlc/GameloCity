const router = require('express').Router();
const {check,validationResult} = require('express-validator');
const { OS,CLIENTE,User,clienteModel,sucursalModel,personalOSModel, clienteExcluidoModel } = require('../../db');

const { Op } = require("sequelize");

var moment = require('moment-timezone');
moment().tz("America/Lima").format();


// #######################################################
OS.belongsTo(personalOSModel,{
	as : 'Detalle', foreignKey 	: 'IdOS',targetKey: 'IdOS',
});
// #######################################################



//////////////////////////////////////////////////////////
//      			OBTENER ULTIMOS 100     			//
//////////////////////////////////////////////////////////
router.get('/',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await OS.findAll({
        order : [
            ['IdOS' , 'DESC']
        ],
		limit : 200
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
// 						Buscar OS 						//
//////////////////////////////////////////////////////////
router.post('/srcOS', async (req,res)=>{

	var $response = {};
	$response.estado = 'OK';

	var $where = {};
	$where.FechaMySQL = { [Op.gte ]: req.body.inicio,[Op.lte ]: req.body.fin };

	if( req.body.IdOS != '' ){
		// Buscar por ID's
		var $arOSs = [];
		var $IdOSs = req.body.IdOS;
		$arOSs = $IdOSs.split(',');
		const dataOS = await OS.findAll({
			order: [
				['IdOS', 'DESC']
			],
			where : {
				IdOS:$arOSs
			}
		});
		$response.data = dataOS;
		res.json( $response );
	}
	else
	{
		// buscar por otros parametros...
		var $where = {};
		const { Op } = require("sequelize");

		$where.FechaMySQL = { [Op.gte ]: req.body.inicio,[Op.lte ]: req.body.fin };
		
		// Buscando por cliente
		if( req.body.cliente != '' ){
			const dataCli = await CLIENTE.findAll({ where : {id : req.body.cliente} });
			if( dataCli ){
				$where.IdClienteProv = dataCli[0].IdClienteProv;
				$response.cliente = dataCli;
			}
		}
		// Buscando por tipo de servicio
		if( req.body.tServicio != '' ){
			$where.TipoServicio = req.body.tServicio;
		}
		console.log($where);

		const dataOS = await OS.findAll({
			order: [
				['IdOS', 'DESC']
			],
			where : $where
		});
		$response.data = dataOS;
		res.json( $response );
	}
	//
	
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//          OS PENDIENTES FACTURAR CLIENTE	            //
//////////////////////////////////////////////////////////
router.post('/pendientes_facturar', async (req,res)=>{
    // IdCliente (RUC/DNI), TipoServicio
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    $response.data = await OS.findAll({
        where : {
            IdClienteProv : req.body.IdCliente,
			TipoServicio  : req.body.TipoServicio,
			Estado 		  : { [Op.in] : ['Aprobado','Finalizado','Terminado'] },
			NroFactura 	  : { [ Op.or ] : [ '' , null ] } ,
			NroBoleta 	  : { [ Op.or ] : [ '' , null ] } ,
			FechaMySQL 	  : { [Op.gte] : '2019-01-01' }
        },
		attributes: [ 'IdOS', 'nombre_cliente' , 'local' , 'FechaMySQL' , 'Estado' ]
    });
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//          TIENE PERMISO CLIENTE 	            //
//////////////////////////////////////////////////////////
router.post('/cliente_excluido', async (req,res)=>{
    // IdCliente
    var $response = {};
    $response.estado = 'OK';
	$response.encontrado = 'NO';
    $response.data = [];

    var _Entidad = await OS.findOne({
        where : {
            IdClienteProv : req.body.IdCliente,
			Estado 		  : 'Activo' ,
			FechaMySQL 	  : { [Op.lte] : '2019-01-01' }
        },
    });
	if( _Entidad )
	{
		$response.data 		 = _Entidad;
		$response.encontrado = 'SI';
	}
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
// 						Agregar OS						//
//////////////////////////////////////////////////////////
router.post('/', [
    check('IdClienteProv' ,'Seleccione un cliente').not().isEmpty(),
	check('IdLocal' ,'Seleccione una sucursal de cliente').not().isEmpty(),
] ,async (req,res)=>{

	const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}
	
	var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );

    req.body.UsuarioMod     = $userData.dni;
    req.body.nombre_usuario = $userData.name;
    var IdClaseProd = await claseProdModel.max('IdClaseProd') + 1;
    req.body.IdClaseProd = IdClaseProd;
    //
    $response.data = await claseProdModel.create(req.body)
    .catch(function (err) {
        // handle error;
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });

    $response.item = await claseProdModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });

    $response.data = await claseProdModel.findAll({
        order : [
            ['IdClaseProd' , 'DESC']
        ]
    });

	res.json( $response );
});
// -------------------------------------------------------


//////////////////////////////////////////////////////////
// 					CARGAR ORDEN SERVICIO           	//
//////////////////////////////////////////////////////////
router.post('/importar', async (req,res)=>{
    // IdOS
    var $response = {}, $data = [], $cliente = [], $locales = [], $personalOS = [];
    $response.estado = 'OK',$response.existe = 'NO';
    $response.data = [];
	$response.cliente  = [];
	$response.locales  = [];
	$response.personal = [];
	$response.clienteFact = [];
	$response.clienteCert = [];

    $data = await OS.findOne({
        where : {
            IdOS : req.body.IdOS
        }
    });
	$response.data = $data;
	if( $data ){
		$response.existe = 'SI';
		// CLiente Facturacion
		var _clienteFact = await clienteModel.findOne({
			where : {
				IdClienteProv : $data.ClienteFact
			}
		});
		$response.clienteFact = _clienteFact;
		// Data del cliente
		$response.cliente = await clienteModel.findOne({
			where : {
				IdClienteProv : $data.IdClienteProv
			}
		});
		// Cliente Certificado
		var _ClienteCert = await clienteModel.findOne({
			where : {
				IdClienteProv : $data.ClienteCert
			}
		});
		$response.clienteCert = _ClienteCert;
		// Cliente Certificado

		// Data de los locales
		$locales = await sucursalModel.findAll({
			where : {
				IdSucursal : $data.IdLocal
			}
		});
		$response.locales = $locales;
	}
	
    
    res.json( $response );
});
// -------------------------------------------------------


//////////////////////////////////////////////////////////
// 					CARGAR ORDEN SERVICIO           	//
//////////////////////////////////////////////////////////
router.post('/get_data', async (req,res)=>{
    // uuid
    var $response = {}, $data = [], $cliente = [], $locales = [], $personalOS = [];
    $response.estado = 'OK';
    $response.data = [];
	$response.cliente  = [];
	$response.locales  = [];
	$response.personal = [];
	$response.clinteFact = '';
	$response.clinteCert = '';

    $data = await OS.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
	$response.data = $data;
	if( $data ){
		// CLiente Facturacion
		$cliente = await clienteModel.findOne({
			where : {
				IdClienteProv : $data.ClienteFact
			}
		});
		$response.clinteFact = $cliente.Razon;
		// Cliente Certificado
		$cliente = await clienteModel.findOne({
			where : {
				IdClienteProv : $data.ClienteCert
			}
		});
		$response.clinteCert = $cliente.Razon;
		// Data del cliente
		$cliente = await clienteModel.findOne({
			where : {
				IdClienteProv : $data.IdClienteProv
			}
		});
		$response.cliente = $cliente;
		// Data de los locales
		$locales = await sucursalModel.findAll({
			where : {
				IdSucursal : $data.IdLocal
			}
		});
		$response.locales = $locales;
	}
	
    
    res.json( $response );
});
// -------------------------------------------------------


//////////////////////////////////////////////////////////
// 					ACTUALIZAR ORDEN SERVICIO  	        //
//////////////////////////////////////////////////////////
router.put('/:uuid', [
    check('Descripcion' ,'El nombre es obligatorio').not().isEmpty(),
], async (req,res)=>{
    // uuid
    const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
    }
    
    var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );
    $response.data = [];

    // Auditoria
    req.body.UsuarioMod     = $userData.dni;
    req.body.nombre_usuario = $userData.name;

	await claseProdModel.update(req.body,{
		where : { 
            uu_id : req.params.uuid 
        }
    })
    .catch(function (err) {
        // handle error;
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });
    
    $response.item = await claseProdModel.findOne({
        where : {
            uu_id : req.params.uuid
        }
    });

    $response.data = await claseProdModel.findAll({
        order : [
            ['IdClaseProd' , 'DESC']
        ]
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
// 			MOSTRAR ORDEN SERVICIO 11/03/2022    	    //
//////////////////////////////////////////////////////////
router.post('/get_data_os', async (req,res)=>{
    // req.body.id

    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
	$response.cli_Cert  = [];
	$response.locales  = [];
	$response.encontrado = 'SI';

	$response.data = await OS.findOne({
        where : {
            IdOS : req.body.id,
			IncCertificado: 1,
			NroCertificado : {[Op.is]: null},
			[Op.or]: [{Estado: 'Aprobado'}, {Estado: 'Finalizado'}]

        }
    });
	
	if( $response.data ){
		// CLiente Facturacion
		$response.cli_Cert = await clienteModel.findOne({
			where : {
				IdClienteProv : $response.data.ClienteFact
			}
		});

		$response.locales = await sucursalModel.findAll({
			where : {
				IdSucursal : $response.data.IdLocal
			}
		});
	}
    res.json( $response );
});
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
async function renovarToken()
{
    var length = 12;
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

module.exports = router;