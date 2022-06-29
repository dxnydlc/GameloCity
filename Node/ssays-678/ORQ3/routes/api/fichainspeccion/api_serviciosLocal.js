
// api_serviciosLocal


const router = require('express').Router();

const { serviciosLocalFicInpecModel,User,productosModel,formServFichaInspModel,sequelize } = require('../../../db');

const {check,validationResult} = require('express-validator');
const $arrServicios = [
    '','Desinfeccion','Desinsectación','Desratización','Control de gatos','Desinfeccion y Desratización','Limp. y Desinf. De Reservorio de Agua','Monitoreo de trampas de luz UV','Programa MIP','Control de moscas con atrayentes feromonales','Desinsectación y Desinfección','Trampa de Grasa','Manejo de residuos','Control aviar','Suministro e instalación de equipos de control de plagas','Desinsectación y Desratización','Limpieza de Pozo Séptico','Fumigación de Fosfina','Control de Otras Plagas','Desinfeccion, Desinsectación y Desratización'
];

// MOMENT
var moment = require('moment-timezone');
moment().tz("America/Lima").format();

const { Op } = require("sequelize");

serviciosLocalFicInpecModel.belongsTo(formServFichaInspModel,{
	as : 'Detalle', foreignKey 	: 'IdFichaInspeccion',targetKey: 'IdFichaInspeccion',
});



//////////////////////////////////////////////////////////
//      			OBTENER ULTIMOS 100     			//
//////////////////////////////////////////////////////////
router.get('/',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );
    console.log("listar ficha2");
	$response.data = await serviciosLocalFicInpecModel.findAll({
        order : [
            ['Descripcion' , 'ASC']
        ]
    });

    

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			SERVICIO LOCAL BY UUID     			//
//////////////////////////////////////////////////////////
router.post('/by_uuid',async(req,res)=>{
	// IdFicha
    //console.log("1");
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );
    //console.log("SERVICIO LOCAL BY UUID");
    console.log(req.body);
	$response.data = await serviciosLocalFicInpecModel.findOne({
        where : {
            uu_id : req.body.uuid
        },
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			OBTENER LISTA     			//
//////////////////////////////////////////////////////////
router.get('/lista/:IdFicha',async(req,res)=>{
    console.log("OBTENER LISTA ");
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await serviciosLocalFicInpecModel.findAll({
        where : {
            IdFichaInspeccion : req.params.IdFicha,
        },
        order : [
            ['local' , 'ASC']
        ]
    });
    // IdServicio : {[ Op.notIn ] : [6] }
    /*
    on: {
        //col1: sequelize.where(sequelize.col("orq_fichainsp_local_servicios.IdLocal"), "=", sequelize.col("orq_ficha_insp_form_servicios.IdLocal")),
        //col2: sequelize.where(sequelize.col("ModelA.col2"), "=", sequelize.col("ModelB.col2"))
    },
    */

    $response.song = 'I feel Love.mp3';

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      OBTENER LISTA PARA TABLITAS DE FORM             //
//////////////////////////////////////////////////////////
router.get('/tablas/:IdFicha',async(req,res)=>{
    console.log("3");
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

    // Producto, Tanque_Cisterna

	$response.Producto = await serviciosLocalFicInpecModel.findAll({
        where : {
            IdFichaInspeccion : req.params.IdFicha,
            Tipo : 'Producto'
        },
        order : [
            ['id' , 'DESC']
        ]
    });
    $response.Tanque_Cisterna = await serviciosLocalFicInpecModel.findAll({
        where : {
            IdFichaInspeccion : req.params.IdFicha,
            Tipo : 'Tanque_Cisterna'
        },
        order : [
            ['id' , 'DESC']
        ]
    });
    $response.Pozo_Septico = await serviciosLocalFicInpecModel.findAll({
        where : {
            IdFichaInspeccion : req.params.IdFicha,
            Tipo : 'Pozo_Septico'
        },
        order : [
            ['id' , 'DESC']
        ]
    });
    $response.Residuos = await serviciosLocalFicInpecModel.findAll({
        where : {
            IdFichaInspeccion : req.params.IdFicha,
            Tipo : 'Residuos'
        },
        order : [
            ['id' , 'DESC']
        ]
    });
    // IdServicio : {[ Op.notIn ] : [6] }

    $response.song = 'I feel Love.mp3';

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//          	AGREGAR SERVICIO LOCAL       			//
//////////////////////////////////////////////////////////
router.post('/', [
        check('IdLocal' ,'Es necesario guardar el local').not().isEmpty(),
        check('IdFichaInspeccion' ,'Es necesario guardar la ficha primero').not().isEmpty(),
    ] ,async (req,res)=>{
    // IdFichaInspeccion, IdLocal,local, IdServicio
	const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
    }

	var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );

    req.body.UsuarioCreado  = $userData.name;
    req.body.created_at     = moment().format('YYYY-MM-DD HH:mm:ss');

    if( req.body.Tipo != undefined ){
        switch( req.body.Tipo )
        {
            case  'Producto':
                /**
                var $dataProd = await productosModel.findOne({
                    where : {
                        IdProducto : req.body.IdProducto
                    }
                });
                if( $dataProd ){
                    req.body.Producto = $dataProd.Descripcion;
                }
                /**/
            break;
            case 'Tanque_Cisterna':
            break;
            case 'Pozo_Septico':
            break;
            case 'Residuos':
            break;
            default:
                var $indice   = parseInt( req.body.IdServicio );
                var $Servicio = await getServicio( $indice );
                req.body.Servicio = $Servicio;
            break;
        }
    }else{
        //
        console.log(`IdServicio =>`+req.body.IdServicio);
        switch( parseInt(req.body.IdServicio) ){
            case 1:
                req.body.Servicio = `Desinfeccion`;
            break;
            case 2:
                req.body.Servicio = `Desinsectación`;
            break;
            case 3:
                req.body.Servicio = `Desratización`;
            break;
            case 4:
                req.body.Servicio = `Control de gatos`;
            break;
            case 5:
                req.body.Servicio = `Desinfeccion y Desratización`;
            break;
            case 6:
                req.body.Servicio = `Limp. y Desinf. De Reservorio de Agua`;
            break;
            case 7:
                req.body.Servicio = `Monitoreo de Trampas de Luz UV`;
            break;
            case 8:
                req.body.Servicio = `Programa MIP`;
            break;
            case 9:
                req.body.Servicio = `Control de moscas con atrayentes feromonales`;
            break;
            case 10:
                req.body.Servicio = `Desinsectación y Desinfección`;
            break;
            case 11:
                req.body.Servicio = `Limpieza de trampa de Grasa`;
            break;
            case 12:
                req.body.Servicio = `Manejo de residuos`;
            break;
            case 13:
                req.body.Servicio = `Control aviar`;
            break;
            case 14:
                req.body.Servicio = `Suministro de equipos de control de plagas`;
            break;
            case 15:
                req.body.Servicio = `Desinsectación y Desratización`;
            break;
            case 16:
                req.body.Servicio = `Limpieza de Pozo Séptico`;
            break;
            case 17:
                req.body.Servicio = `Fumigación de Fosfina`;
            break;
            case 18:
                req.body.Servicio = `Control de Otras Plagas`;
            break;
            case 19:
                req.body.Servicio = `Fumigación integral`;
            break;
        }
        //
    }

    req.body.uu_id = await renovarToken();
    $response.data = await serviciosLocalFicInpecModel.create(req.body);
    /*
    // Si esta ficha ya tiene form actualizamos la data...
    var $dataExiste = await serviciosLocalFicInpecModel.findOne({
        where : {
            IdFichaInspeccion : req.body.IdFichaInspeccion,
            IdLocal : req.body.IdLocal
        }
    });
    if( $dataExiste ){
        await serviciosLocalFicInpecModel.update(req.body,{
            where : { 
                id : $dataExiste.id 
            }
        });
        $response.data = $dataExiste;
    }else{
        $response.data = await serviciosLocalFicInpecModel.create(req.body);
    }
    /**/
    if( req.body.Tipo != undefined ){
        $response.data = await serviciosLocalFicInpecModel.findAll({
            where : {
                IdFichaInspeccion : req.body.IdFichaInspeccion ,
                Tipo : req.body.Tipo
            }
        });
        //
    }else{
        //
        $response.data = await serviciosLocalFicInpecModel.findAll({
            where : {
                IdFichaInspeccion : req.body.IdFichaInspeccion
            }
        });
    }
    /**/
	res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////
//        CARGAR SERVICIO LOCAL         //
//////////////////////////////////////////
router.post('/get_data', async (req,res)=>{
    // IdFichaInspeccion, IdLocal
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    $response.data = await serviciosLocalFicInpecModel.findOne({
        where : {
            IdAlmacen : req.body.IdAlmacen
        }
    });
    
    res.json( $response );
});
// ---------------------------------------

//////////////////////////////////////////
//       ACTUALIZAR SERVICIO LOCAL      //
//////////////////////////////////////////
router.put('/:uuid', async (req,res)=>{
    // uuid
    //const errors = validationResult(req);
    //if( ! errors.isEmpty() ){
    //    return res.status(422).json({ errores : errors.array() });
    //}
    //
    var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );
    $response.data = [];
    // 
    // Auditoria
    // delete req.body.UsuarioMod;
    // delete req.body.anulado_por;
    req.body.UsuarioModificado = $userData.name;
    // El campo enviado es el monto?
    //
	await serviciosLocalFicInpecModel.update(req.body,{
		where : { 
            uu_id : req.params.uuid 
        }
    });
    //
    var $dataEntitad = await serviciosLocalFicInpecModel.findOne({
        where : {
            uu_id : req.params.uuid 
        }
    });
    // Devolver todos
    if( $dataEntitad )
    {
        // - //
        $response.data = await serviciosLocalFicInpecModel.findAll({
            where : {
                IdFichaInspeccion : $dataEntitad.IdFichaInspeccion
            },
            order : [
                ['local' , 'ASC']
            ]
        });
        // - //
    }
    //
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////
//      ELIMINAR SERVICIOS - CHECKBOX       //
//////////////////////////////////////////////
router.delete('/:id', async (req,res)=>{
    // IdFicha
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $userData = await getUserData( req.headers['api-token'] );

    // Borramos todas las anteriores... (fisicamente)
    await serviciosLocalFicInpecModel.destroy({
		where : { 
            IdServicio  : req.body.IdServicio,
            IdLocal     : req.body.IdLocal,
            IdFichaInspeccion : req.body.IdFichaInspeccion
        }
    });
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////
//    ELIMINAR SERVICIOS - ITEM TABLA       //
//////////////////////////////////////////////
router.delete('/itemtabla/:uuid', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $userData = await getUserData( req.headers['api-token'] );

    // Borramos todas las anteriores... (fisicamente)
    await serviciosLocalFicInpecModel.destroy({
		where : { 
            uu_id  : req.params.uuid,
        }
    });
    
    res.json( $response );
});
// -------------------------------------------------------


// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
async function getServicio( $i )
{
    $i = parseInt( $i );
    switch( $i )
    {
        case 1:
            return 'Desinfeccion';
        break;
        case 2:
            return 'Desinsectación';
        break;
        case 3:
            return 'Desratización';
        break;
        case 4:
            return 'Control de gatos';
        break;
        case 5:
            return 'Desinfeccion y Desratización';
        break;
        case 6:
            return 'Limp. y Desinf. De Reservorio de Agua';
        break;
        case 7:
            return 'Monitoreo de trampas de luz UV';
        break;
        case 8:
            return 'Programa MIP';
        break;
        case 9:
            return 'Control de moscas con atrayentes feromonales'
        break;
        case 10:
            return 'Desinsectación y Desinfección';
        break;
        case 11:
            return 'Limpieza de trampa de Grasa';
        break;
        case 12:
            return 'Manejo de residuos';
        break;
        case 13:
            return 'Control aviar';
        break;
        case 14:
            return 'Suministro e instalación de equipos de control de plagas';
        break;
        case 15:
            return 'Desinsectación y Desratización';
        break;
        case 16:
            return 'Limpieza de Pozo Séptico';
        break;
        case 17:
            return 'Fumigación de Fosfina';
        break;
        case 18:
            return 'Control de Otras Plagas';
        break;
        case 19:
            return 'Fumigación integral';
        break;
        default:
            return '-';
        break;
    }
    const $arrServicios = [
        '',,,,,,,,,,,,,,,,,,
    ];
}
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


module.exports = router;