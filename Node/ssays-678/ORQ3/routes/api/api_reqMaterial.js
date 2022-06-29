// api_reqMaterial.js

const router = require('express').Router();

const { reqMaterialesModel,User,sucursalModel,productosModel, reqMaterialDetalleModel } = require('../../db');

const {check,validationResult} = require('express-validator');

const { Op } = require("sequelize");

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// Sucursales
reqMaterialesModel.belongsTo(sucursalModel,{
	as : 'Detalle', foreignKey 	: 'IdSucursal',targetKey: 'IdSucursal',
});
// Detalle
reqMaterialesModel.belongsTo(reqMaterialDetalleModel,{
	as : 'DetReq', foreignKey 	: 'IdRequerimientoCab',targetKey: 'IdRequerimientoCab',
});
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// Revisar sincronia entre guia de remisión y req de materiales
router.post('/check_req_guiarem', async (req,res)=>{
    // NroReq, NroGuia
    var $response = {};
	$response.estado = 'OK';
	$response.data = [];
    var $where = {};
    
    if( req.body.NroReq != '' )
    {
        const $dataReq = await reqMaterialesModel.findOne({
            where : {
                IdRequerimientoCab : req.body.NroReq
            }
        });

        if( $dataReq )
        {
            $response.data = $dataReq;
            if( $dataReq.NroGuia == '' || $dataReq.NroGuia == null )
            {
                // asignamos la guia enviada
                await reqMaterialesModel.update( { 'NroGuia' : req.body.NroGuia  },{
                    where : { IdRequerimientoCab : req.body.NroReq }
                });
            }
            // Lo marcamos como procesado
            await reqMaterialesModel.update({ C041 :'SYNC' },{
                where : { IdRequerimientoCab : req.body.NroReq }
            });
            
        }
    }
    

	res.json($response);
});

//////////////////////////////////////////////////////////
//      			OBTENER ULTIMOS 100     			//
//////////////////////////////////////////////////////////
router.get('/',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await reqMaterialesModel.findAll({
        order : [
            ['Descripcion' , 'ASC']
        ]
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			OBTENER LISTA     			//
//////////////////////////////////////////////////////////
router.get('/lista',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await reqMaterialesModel.findAll({
        where : {
            estado : 1
        },
        order : [
            ['Descripcion' , 'ASC']
        ]
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			    REPORTE 001          			//
//////////////////////////////////////////////////////////
router.post('/rpt1',async (req,res)=>{
	// Nros, inicio, fin
	var $response = {};
    $response.estado = 'OK';
    $response.data = {};
    var $userData = await getUserData( req.headers['api-token'] );

    var $where = {};
    $where.Fecha = { [Op.gte ]: req.body.inicio,[Op.lte ]: req.body.fin };
    $where.Estado = 'Aprobado';
    
    if( req.body.Nros != '' ){
		// Buscar por ID's
		var $arOSs = [];
		var $IdOSs = req.body.Nros;
        $arOSs = $IdOSs.split(',');
        var newArr = [];
        for (let index = 0; index < $arOSs.length; index++) {
            const element = $arOSs[index];
            if( element != '' ){
                newArr.push( element );
            }
        }
		$response.data = await reqMaterialesModel.findAll({
			where : {
                IdRequerimientoCab : newArr,
                Estado : 'Aprobado'
			}
		});
	}else{
        $response.data = await reqMaterialesModel.findAll({
            where : $where,
            include: [{
		        model: sucursalModel,
		        as: 'Detalle'
		    }]
		});
    }

	res.json( $response );
});
// -------------------------------------------------------


//////////////////////////////////////////////////////////
//      			    REPORTE 002          			//
//////////////////////////////////////////////////////////
router.post('/rpt2',async (req,res)=>{
	// Nros, inicio, fin, cliente, local, estado, producto, unidadn,NroGuia,IncGuia
	var $response = {};
    $response.estado = 'OK';
    $response.data = {};
    var $userData = await getUserData( req.headers['api-token'] );

    var $where = {}, $where2 = {};
    
    if( req.body.Nros != '' ){
		// Buscar por ID's
		var $arOSs = [];
		var $IdOSs = req.body.Nros;
        $arOSs = $IdOSs.split(',');
		$response.data = await reqMaterialesModel.findAll({
			where : {
                IdRequerimientoCab : $arOSs,
                // Estado : 'Aprobado'
			},
            include: [{
		        model   : reqMaterialDetalleModel,
		        as      : 'DetReq',
                where   : $where2,
		    }]
		});
	}else{
        // Fechas
        $where.Fecha = { [Op.gte ]: req.body.inicio,[Op.lte ]: req.body.fin };
        // Estado
        if( req.body.estado ){
            $where.Estado = req.body.estado;
        }
        // Cliente
        if( req.body.cliente ){
            $where.IdClienteProv = req.body.cliente;
        }
        // Local
        if( req.body.local ){
            $where.IdSucursal = req.body.local;
        }
        // Producto
        if( req.body.producto ){
            $where2.IdProducto = req.body.producto;
        }
        // Unidad negocio
        if( req.body.unidadn ){
            $where.UnidadNegocio = req.body.unidadn;
        }
        // Nro Guia
        if( req.body.NroGuia ){
            $where.NroGuia = req.body.NroGuia;
        }
        // Todas las que tienen Guia
        if( req.body.IncGuia ){
            $where.NroGuia = { [Op.not] : null , [Op.ne] : '' };
        }
        
        $response.data = await reqMaterialesModel.findAll({
            where : $where,
            include: [{
		        model   : reqMaterialDetalleModel,
		        as      : 'DetReq',
                where   : $where2,
		    }]
		});
    }
    console.log($where);
    
    $response.w = $where;
	res.json( $response );
});
// -------------------------------------------------------


//////////////////////////////////////////////////////////
//      			AGREGAR ALMACEN       			//
//////////////////////////////////////////////////////////
router.post('/', [
    check('nombre' ,'El nombre es obligatorio').not().isEmpty(),
] ,async (req,res)=>{

	const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}
	
	var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );

    req.body.UsuarioMod = $userData.name;
    $response.data = await reqMaterialesModel.create(req.body);
    $response.data = await reqMaterialesModel.findOne({
        where : {
            IdAlmacen : req.body.IdAlmacen
        }
    });

	res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////
//          CARGAR HABITACION            //
//////////////////////////////////////////
router.post('/get_data', async (req,res)=>{
    // IdAlmacen
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    $response.data = await reqMaterialesModel.findOne({
        where : {
            IdAlmacen : req.body.IdAlmacen
        }
    });
    
    res.json( $response );
});
// ---------------------------------------

//////////////////////////////////////////
//       ACTUALIZAR HABITACION            //
//////////////////////////////////////////
router.put('/:IdAlmacen', [
    check('id_ambiente' ,'Seleccione un ambiente').not().isEmpty(),
    check('nombre' ,'El nombre es obligatorio').not().isEmpty(),
], async (req,res)=>{
    // IdAlmacen
    const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
    }
    
    var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );
    $response.data = [];

    // Auditoria
    delete req.body.UsuarioMod;
    delete req.body.anulado_por;
    req.body.editado_por = $userData.name;

	await reqMaterialesModel.update(req.body,{
		where : { 
            IdAlmacen : req.params.IdAlmacen 
        }
    });
    $response.data = await reqMaterialesModel.findOne({
        where : {
            IdAlmacen : req.body.IdAlmacen
        }
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////
//       ELIMINAR HABITACION            //
//////////////////////////////////////////
router.delete('/:IdAlmacen', async (req,res)=>{
    // IdAlmacen
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $userData = await getUserData( req.headers['api-token'] );

    // Auditoria
    delete req.body.UsuarioMod;
    // delete req.body.editado_por;
    req.body.anulado_por = $userData.name;

    $anuladoPor = $userData.name;

	await reqMaterialesModel.update({
        estado      : 0,
        UsuarioMod : $anuladoPor
    },{
		where : { 
            IdAlmacen : req.params.IdAlmacen 
        }
    });
    var $dataEntidad = await reqMaterialesModel.findOne({
        where : {
            IdAlmacen : req.params.IdAlmacen 
        }
    });
    
    // obtener los datos
    console.log( $dataEntidad.id_empresa );
    if( $dataEntidad )
    {
        $response.data = await reqMaterialesModel.findAll({
            where : {
                id_empresa : $dataEntidad.id_empresa
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
