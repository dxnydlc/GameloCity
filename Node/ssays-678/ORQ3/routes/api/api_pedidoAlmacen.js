// api_pedidoAlmacen.js

const router = require('express').Router();
const { paHeaderModel, User, paDetModel, aprobacionesModel } = require('../../db');
const {check,validationResult} = require('express-validator');
var moment = require('moment-timezone');
moment().tz("America/Lima").format();
const { Op } = require("sequelize");


// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
paHeaderModel.belongsTo(paDetModel,{
	as : 'DetallePA2', foreignKey 	: 'IdPedAlmacenCab',targetKey: 'IdPedAlmacenCab',
});
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>



//////////////////////////////////////////////////////////
//      			OBTENER ULTIMOS 100     			//
//////////////////////////////////////////////////////////
router.get('/',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await paHeaderModel.findAll({
        order : [
            ['IdPedAlmacenCab' , 'DESC']
        ],
        limit : 200
    });

    res.json( $response );
});
// -------------------------------------------------------


//////////////////////////////////////////////////////////
//              BUSCAR PEDIDO DE ALMACEN                //
//////////////////////////////////////////////////////////
router.post('/buscar', async (req,res)=>{
    // NroPedidos, Soli, Auto, Glosa, Inicio, Fin, centro
    
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $where = {};

    if( req.body.NroPedidos ){
        // Buscamos por ID
        var $IdOSs = req.body.NroPedidos;
		$arOSs = $IdOSs.split(',');
        //
        $response.data = await paHeaderModel.findAll({
            order : [
                ['IdPedAlmacenCab' , 'DESC']
            ],
            where : {
                IdPedAlmacenCab : $arOSs
            }
        });
        //
    }else{
        $where.Fecha = { [Op.gte ]: req.body.Inicio,[Op.lte ]: req.body.Fin };

        // Buscamos por Glosa
        if( req.body.Glosa ){
            $where.Glosa = { [Op.like] : '%'+req.body.Glosa+'%' }
        }
        // Solicitante
        if( req.body.Soli ){
            $where.Solicitante = req.body.Soli;
        }
        // Autorizado
        if( req.body.Auto ){
            $where.AutorizadoPor = req.body.Auto;
        }

        // Centro
        if( req.body.Centro ){
            $where.IdCentro = req.body.Centro;
        }
        //
        console.log($where);
        $response.data = await paHeaderModel.findAll({
            order : [
                ['IdPedAlmacenCab' , 'DESC']
            ],
            where : $where
        });
    }

    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//              OBTENER LISTA PEDIDO DE ALMACEN         //
//////////////////////////////////////////////////////////
router.get('/lista',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await paHeaderModel.findAll({
        where : {
            Estado : 'Aprobado'
        },
        order : [
            ['IdPedAlmacenCab' , 'DESC']
        ]
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      	    AGREGAR PEDIDO DE ALMACEN 			    //
//////////////////////////////////////////////////////////
router.post('/', [
    check('Solicitante' ,'Seleccione quien solicita').not().isEmpty(),
    check('AutorizadoPor' ,'Seleccione quien autoriza').not().isEmpty(),
    check('IdCentro' ,'Seleccione un centro de costos').not().isEmpty(),
] ,async (req,res)=>{

	const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}
	
	var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );

    // Nro de items.
    // var NroItems = await paDetModel.count({
    //     where : {
    //         token : req.body.uu_id
    //     }
    // });
    // req.body.total_items= NroItems;
    req.body.UsuarioMod = $userData.name;
    req.body.Estado     = 'Digitado';
    req.body.FechaMod   = moment().format('YYYY-MM-DD HH:mm:ss');
    var IdPedAlmacenCab = await paHeaderModel.max('IdPedAlmacenCab') + 1;
    req.body.IdPedAlmacenCab = IdPedAlmacenCab;
    //
    $response.data = await paHeaderModel.create(req.body)
    .catch(function (err) {
        // handle error;
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });
    // Unir detalle
    await paDetModel.update({
        IdPedAlmacenCab : IdPedAlmacenCab
    },{
        where : {
            token : req.body.uu_id
        }
    });

    $response.item = await paHeaderModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });

	res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//              CARGAR PEDIDO DE ALMACEN                //
//////////////////////////////////////////////////////////
router.post('/get_data', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.detalle = [];

    var Entidad = await paHeaderModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
    $response.data = Entidad;
    $response.detalle = await paDetModel.findAll({
        where : {
            IdPedAlmacenCab : Entidad.IdPedAlmacenCab
        }
    });
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//              ACTUALIZAR PEDIDO DE ALMACEN            //
//////////////////////////////////////////////////////////
router.put('/:uuid', [
    check('Solicitante' ,'Seleccione quien solicita').not().isEmpty(),
    check('AutorizadoPor' ,'Seleccione quien autoriza').not().isEmpty(),
    check('IdCentro' ,'Seleccione un centro de costos').not().isEmpty(),
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

    var IdPedAlmacenCab = req.body.IdPedAlmacenCab;

    // Estado digitado...¿?
    var dataPedido = await paHeaderModel.findOne({
        where : {
            IdPedAlmacenCab : IdPedAlmacenCab
        }
    });
    if( dataPedido ){
        if( dataPedido.Estado != 'Digitado' ){
            $response.estado = 'ERROR';
            $response.error = `Este documento no se puede modificar, estado [${dataPedido.Estado}]`;
        }else{
            // Auditoria
            req.body.UsuarioMod = $userData.name;
            req.body.FechaMod   = moment().format('YYYY-MM-DD HH:mm:ss');
            //
            await paHeaderModel.update(req.body,{
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
            $response.item = await paHeaderModel.findOne({
                where : {
                    uu_id : req.params.uuid
                }
            });
        }
    }

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  ANULAR PEDIDO DE ALMACEN            //
//////////////////////////////////////////////////////////
router.post('/anular', async (req,res)=>{
    // uuid, IdPedido, motivo
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.item = [];
    var $userData = await getUserData( req.headers['api-token'] );

    var Permiso = await aprobacionesModel.findOne({
        where : {
            IdTipoDoc : 19,
            IdUser    : $userData.dni,
            anular    : 'SI'
        }
    });

    if(! Permiso ){
        $response.estado = 'ERROR';
        $response.error  = 'Su usuario no cuenta con los permisos para realizar esta acción';
        return res.json( $response );
    }

    // Estado digitado...¿?
    var dataPedido = await paHeaderModel.findOne({
        where : {
            IdPedAlmacenCab : req.body.IdPedido
        }
    });
    if( dataPedido ){
        if( dataPedido.Estado == 'Anulado' ){
            $response.estado = 'ERROR';
            $response.error = `Este documento no se puede anular, estado [${dataPedido.Estado}]`;
        }else{
            //
            await paHeaderModel.update({
                Estado       : 'Anulado',
                UsuarioModAn : $userData.name,
                MotivoAnular : req.body.motivo,
            },{
                where : { 
                    uu_id : req.body.uuid 
                }
            });
            $response.item = await paHeaderModel.findOne({
                where : {
                    uu_id : req.body.uuid
                }
            });
            //
        }
    }

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			APROBAR PEDIDO DE ALMACEN           //
//////////////////////////////////////////////////////////
router.post('/aprobar',async(req,res)=>{
    // IdPedido, uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );
    var $userData = await getUserData( req.headers['api-token'] );

    var Permiso = await aprobacionesModel.findOne({
        where : {
            IdTipoDoc : 19,
            IdUser    : $userData.dni,
            aprobar   : 'SI'
        }
    });

    if(! Permiso ){
        $response.estado = 'ERROR';
        $response.error  = 'Su usuario no cuenta con los permisos para realizar esta acción';
        return res.json( $response );
    }

	// Estado digitado...¿?
    var dataPedido = await paHeaderModel.findOne({
        where : {
            IdPedAlmacenCab : req.body.IdPedido
        }
    });
    if( dataPedido ){
        if( dataPedido.Estado != 'Digitado' ){
            $response.estado = 'ERROR';
            $response.error = `Este documento no se puede aprobar, estado [${dataPedido.Estado}]`;
        }else{
            await paHeaderModel.update({
                Estado       : 'Aprobado',
                UsuarioModAp : $userData.name,
                FechaModAp   : moment().format('YYYY-MM-DD HH:mm:ss')
            },{
                where : { 
                    uu_id : req.body.uuid 
                }
            });
            $response.item = await paHeaderModel.findOne({
                where : {
                    uu_id : req.body.uuid
                }
            });
        }
    }

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//          CRUD DETALLE DE PEDIDO ALMACEN              //
//////////////////////////////////////////////////////////
router.post('/item', async (req,res)=>{
    // id, nombre
    var $response    = {};
    $response.estado = 'OK';
    $response.data   = [];
    $response.item   = [];
    $response.items  = [];
    var $where = {}, _Items = [];

    var _IdPA = req.body.IdPedAlmacenDet;
    if( _IdPA == '' ){
        req.body.IdPedAlmacenDet = 0;
    }
    var IdPedAlmacenDet = parseInt( req.body.IdPedAlmacenDet );
    var IdPedAlmacenCab = parseInt( req.body.IdPedAlmacenCab );
    delete req.body.IdPedAlmacenDet;

    if( IdPedAlmacenCab == 0 ){
        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        if( IdPedAlmacenDet == 0 ){
            // vamos a agregar el item
            $response.a = 'Crear nuevo '+IdPedAlmacenDet;
            await paDetModel.create( req.body )
            .catch(function (err) {
                $response.estado = 'ERROR'; $response.error = err.original.sqlMessage;
                res.json( $response );
            });
        }else{
            // vamos a actualizar los datos
            $response.a = 'Actualizar '+IdPedAlmacenDet;
            await paDetModel.update( req.body , {
                where : {
                    uu_id : req.body.uu_id
                }
            } )
            .catch(function (err) {
                $response.estado = 'ERROR'; $response.error = err.original.sqlMessage;
                res.json( $response );
            });
        }
        $response.item = await paDetModel.findOne({
            where : {
                uu_id : req.body.uu_id
            }
        });
        // Items
        $response.id = IdPedAlmacenCab;
        if( IdPedAlmacenCab == 0 ){
            _Items = await paDetModel.findAll({
                where : {
                    token : req.body.token
                }
            });
        }else{
            _Items = await paDetModel.findAll({
                where : {
                    IdPedAlmacenCab : req.body.IdPedAlmacenCab
                }
            });
        }
        // Devolemos el detalle
        $response.data = _Items;
        // Devolvemos el Nro de items...
        $response.items = _Items.length;
        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    }else{
        // Estado del pedido de almacen
        var dataPedido = await paHeaderModel.findOne({
            where :{
                IdPedAlmacenCab : IdPedAlmacenCab
            }
        });
        if( dataPedido ){
            if( dataPedido.Estado != 'Digitado' ){
                $response.estado = 'ERROR';
                $response.error = 'El pedido de almacén se encuentra aprobado';
            }else{
                // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
                if( IdPedAlmacenDet == 0 ){
                    // vamos a agregar el item
                    $response.a = 'Crear nuevo '+IdPedAlmacenDet;
                    await paDetModel.create( req.body )
                    .catch(function (err) {
                        $response.estado = 'ERROR'; $response.error = err.original.sqlMessage;
                        res.json( $response );
                    });
                }else{
                    // vamos a actualizar los datos
                    $response.a = 'Actualizar '+IdPedAlmacenDet;
                    await paDetModel.update( req.body , {
                        where : {
                            uu_id : req.body.uu_id
                        }
                    } )
                    .catch(function (err) {
                        $response.estado = 'ERROR'; $response.error = err.original.sqlMessage;
                        res.json( $response );
                    });
                }
                $response.item = await paDetModel.findOne({
                    where : {
                        uu_id : req.body.uu_id
                    }
                });
                // Items
                $response.id = IdPedAlmacenCab;
                if( IdPedAlmacenCab == 0 ){
                    _Items = await paDetModel.findAll({
                        where : {
                            token : req.body.token
                        }
                    });
                }else{
                    _Items = await paDetModel.findAll({
                        where : {
                            IdPedAlmacenCab : req.body.IdPedAlmacenCab
                        }
                    });
                }
                // Devolemos el detalle
                $response.data = _Items;
                // Devolvemos el Nro de items...
                $response.items = _Items.length;
                // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            }
        }
    }
        

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//          CARGAR DETALLE DE PEDIDO DE ALMACEN         //
//////////////////////////////////////////////////////////
router.post('/get_item', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    $response.data = await paDetModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
    
    res.json( $response );
});
// //////////////////////////////////////////////////////////
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  ELIMINAR ITEMS                      //
//////////////////////////////////////////////////////////
router.post('/delitem', async (req,res)=>{
    // uuid, IdPedido, token
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.items = 0;
    var $userData = await getUserData( req.headers['api-token'] );

    var IdPedAlmacenCab = parseInt( req.body.IdPedido), token = req.body.token;

    // Estado del pedido de almacen
    var dataPedido = await paHeaderModel.findOne({
        where : {
            IdPedAlmacenCab : IdPedAlmacenCab
        }
    });
    if( dataPedido ){
        if( dataPedido.Estado != 'Digitado' ){
            $response.estado  = 'ERROR';
            $response.error   = `El pedido de almacén #${dataPedido.IdPedAlmacenCab} no se puede modificar, estado [${dataPedido.Estado}].`;
        }else{
            // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            var Item = await paDetModel.findOne({
                where : {
                    uu_id : req.body.uuid
                }
            });
            if( Item ){
                await paDetModel.destroy({
                    where : { 
                        uu_id : req.body.uuid
                    }
                });
            }
            if( IdPedAlmacenCab > 0 ){
                // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
                var NroItems = await paDetModel.count({
                    where: {
                        IdPedAlmacenCab : IdPedAlmacenCab
                    }
                });
                $response.data = await paDetModel.findAll({
                    where: {
                        IdPedAlmacenCab : IdPedAlmacenCab
                    }
                });
                await paHeaderModel.update({ total_items : NroItems },{
                    where: {
                        IdPedAlmacenCab : IdPedAlmacenCab
                    }
                });
                // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            }else{
                // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
                var NroItems = await paDetModel.count({
                    where: {
                        token : token
                    }
                });
                $response.data = await paDetModel.findAll({
                    where: {
                        token : token
                    }
                });
                // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            }
            $response.items   = NroItems;
            $response.entidad = Item;
            // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        }
    }

    

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//              REPORTE DE PEDIDO DE ALMACEN 01         //
//////////////////////////////////////////////////////////
router.post('/reporte01', async (req,res)=>{
	// ids(,) , inicio, fin, soli, auto, estado, cc, producto, glosa
	var $response = {};
	$response.estado = 'OK';
	$response.data = [];
	var $where = {}, $whereDet = {};

	if( req.body.ids != '' )
	{
		var $ids = req.body.ids;
		var $arIds = $ids.split(',');
		//
		$response.data = await paHeaderModel.findAll({
			order: [
				['IdPedAlmacenCab', 'DESC']
			],
		    where: {
		        IdPedAlmacenCab : { [Op.in] : $arIds }
		    },
		    include: [{
		        model: paDetModel,
		        as: 'DetallePA2'
		    }]
		});
    //
    }else{
    //
		$where.Fecha = { [Op.gte ]: req.body.inicio,[Op.lte ]: req.body.fin };
        // solicitante
		if( req.body.soli )
		{
			$where.Solicitante = req.body.soli;
		}
        // Autorizado
		if( req.body.auto )
		{
			$where.AutorizadoPor = req.body.auto;
		}
        // CC
        if( req.body.cc )
		{
			$where.IdCentro = req.body.cc;
		}
        // Estado
        if( req.body.estado )
		{
			$where.Estado = req.body.estado;
		}
        // Glosa
        if( req.body.glosa )
		{
			$where.Glosa = { [Op.like] : req.body.glosa };
		}
        // Producto
        if( req.body.producto )
		{
			$whereDet.IdProducto = req.body.producto;
		}
        //
		$response.data = await paHeaderModel.findAll({
			order: [
				['IdPedAlmacenCab', 'DESC']
			],
			where : $where,
		    include: [{
		        model : paDetModel,
		        as    : 'DetallePA2',
                where : $whereDet,
		    }]
		});
	}
		
	/**/

	//const film = await paHeaderModel.findAll(req.body);
	res.json($response);
});
// ---------------------------------------------------

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