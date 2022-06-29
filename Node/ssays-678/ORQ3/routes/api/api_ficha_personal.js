// api_ficha_personal.js

const router = require('express').Router();
var moment = require('moment-timezone');
moment().tz("America/Lima").format();

const { fichaPersonalModel,User,reqPersonalModel } = require('../../db');

const {check,validationResult} = require('express-validator');
const { Op } = require("sequelize");

//////////////////////////////////////////////////////////
//      			OBTENER ULTIMOS 100     			//
//////////////////////////////////////////////////////////
router.get('/',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await fichaPersonalModel.findAll({
        order : [
            ['Descripcion' , 'ASC']
        ]
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			    OBTENER LISTA     			    //
//////////////////////////////////////////////////////////
router.get('/lista/:IdReq',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await fichaPersonalModel.findAll({
        where : {
            IdReqPersonal : req.params.IdReq
        },
        order : [
            ['nombres' , 'ASC']
        ]
    });
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			    AGREGAR ALMACEN       			//
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
    $response.data = await fichaPersonalModel.create(req.body);
    $response.data = await fichaPersonalModel.findOne({
        where : {
            IdAlmacen : req.body.IdAlmacen
        }
    });

	res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                      CHECK FICHA REQ                 //
//////////////////////////////////////////////////////////
router.post('/check', async (req,res)=>{
    // IdReq
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var IdReqPersonal = req.body.IdReq;

    var NroItems = await fichaPersonalModel.count({
        where: {
            IdReqPersonal : req.body.IdReq
        }
    });
    
    var ItemsFicha = await fichaPersonalModel.findAll({
        where : {
            IdReqPersonal : req.body.IdReq ,
            deleted_at : { [Op.is] : null },
            nombres : {[Op.ne] : '* Por cubrir *' },
            dni : {[Op.ne] : '' }
        }
    });
    // *
    var dataEntidad = await reqPersonalModel.findOne({
        where : {
            IdReqPersonal : req.body.IdReq ,
            deleted_at : { [Op.is] : null },
            Estado : 'Aprobado'
        }
    });
    if( dataEntidad )
    {
        var Cantidad = parseInt( dataEntidad.Cantidad ), indice = 1;
        var _pendientes = Cantidad - NroItems;
        console.log(`Faltan : ${_pendientes}`);
        if( _pendientes > 0 ){
            for (let index = 0; index < _pendientes; index++) {
                var insertar = {};
                insertar.IdReqPersonal  = req.body.IdReq;
                insertar.nombres        = '* Por cubrir *';
                insertar.fuente         = '-';
                insertar.dni            = '';
                insertar.indice         = indice;
                insertar.asignacion_familiar = dataEntidad.asignacion_familiar;
                insertar.unidad_local    = `${dataEntidad.nombre_cliente} - ${dataEntidad.nombre_sucursal}`;
                insertar.sueldo          = parseInt(dataEntidad.Salario);
                insertar.puesto          = dataEntidad.PuestoIso;
                insertar.turno_elegido   = dataEntidad.Horario;
                insertar.inicio_contrato = dataEntidad.FechaPresentacion;
                insertar.id_cliente      = dataEntidad.Cliente;
                insertar.cliente         = dataEntidad.nombre_cliente;
                insertar.id_sucursal     = dataEntidad.Sucursal;
                insertar.sucursal        = dataEntidad.nombre_sucursal;
                insertar.id_puesto       = dataEntidad.idPuestoIso;
                //
                await fichaPersonalModel.create( insertar )
                .catch(function (err) {
                    console.log(err);
                    $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;
                    res.json( $response );
                });
                //
                indice++;
                
            }
        }
        // if( ItemsFicha.length == 0 ){
        //     // no tiene fichas! vamos a crearle
        //     var Cantidad = parseInt( dataEntidad.Cantidad ), indice = 1;
        //     for (let index = 0; index < Cantidad; index++) {
        //         var insertar = {};
        //         insertar.IdReqPersonal  = req.body.IdReq;
        //         insertar.nombres        = '* Por cubrir *';
        //         insertar.fuente         = '-';
        //         insertar.dni            = '';
        //         insertar.indice         = indice;
        //         insertar.asignacion_familiar = dataEntidad.asignacion_familiar;
        //         insertar.unidad_local    = `${dataEntidad.nombre_cliente} - ${dataEntidad.nombre_sucursal}`;
        //         insertar.sueldo          = parseInt(dataEntidad.Salario);
        //         insertar.puesto          = dataEntidad.PuestoIso;
        //         insertar.turno_elegido   = dataEntidad.Horario;
        //         insertar.inicio_contrato = dataEntidad.FechaPresentacion;
        //         insertar.id_cliente      = dataEntidad.Cliente;
        //         insertar.cliente         = dataEntidad.nombre_cliente;
        //         insertar.id_sucursal     = dataEntidad.Sucursal;
        //         insertar.sucursal        = dataEntidad.nombre_sucursal;
        //         insertar.id_puesto       = dataEntidad.idPuestoIso;
        //         //
        //         fichaPersonalModel.create( insertar )
        //         .catch(function (err) {
        //             console.log(err);
        //             $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;
        //             res.json( $response );
        //         });
        //         //
        //         indice++;
                
        //     }
        //     ItemsFicha = await fichaPersonalModel.findAll({
        //         where : {
        //             IdReqPersonal : req.body.IdReq ,
        //             deleted_at : { [Op.is] : null },
        //             nombres : {[Op.ne] : '* Por cubrir *' },
        //             dni : {[Op.ne] : '' }
        //         }
        //     });
        // }
        var estado_reclutamiento = '';
        if( dataEntidad.Cantidad == ItemsFicha.length )
        {
            estado_reclutamiento = 'Completado';
        }
        if( dataEntidad.Cantidad > ItemsFicha.length )
        {
            estado_reclutamiento = 'Pendiente';
        }
        if( dataEntidad.Cantidad < ItemsFicha.length )
        {
            estado_reclutamiento = 'Completado*';
        }
        console.log(`Revisando req personal ==> ${req.body.IdReq}, Cant.${dataEntidad.Cantidad}, Items.${ItemsFicha.length} `);
        // reqPersonalModel.update({
        //     estado_reclutamiento : estado_reclutamiento,
        //     cant_cubierta : ItemsFicha.length
        // },{
        //     where : {
        //         IdReqPersonal : req.body.IdReq 
        //     }
        // })
        // .catch(function (err) {
        //     // handle error;
        //     $response.estado = 'ERROR';
        //     $response.error  = err.original.sqlMessage;
        //     res.json( $response );
        // });
        //
    }else{
        //
        reqPersonalModel.update({
            estado_reclutamiento : '',
        },{
            where : {
                IdReqPersonal : req.body.IdReq 
            }
        })
        .catch(function (err) {
            // handle error;
            $response.estado = 'ERROR';
            $response.error  = err.original.sqlMessage;
            res.json( $response );
        });
    }


    res.json( $response );
});
// ------------------------------------------------------

//////////////////////////////////////////////////////////
//                      CARGAR FICHA                    //
//////////////////////////////////////////////////////////
router.post('/get_data', async (req,res)=>{
    // IdAlmacen
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    $response.data = await fichaPersonalModel.findOne({
        where : {
            IdAlmacen : req.body.IdAlmacen
        }
    });
    
    res.json( $response );
});
// ---------------------------------------

////////////////////////////////////////////////////////////
//                  ACTUALIZAR                           //
//////////////////////////////////////////////////////////
router.put('/:id', [
    check('dni' ,'Ingrese un DNI').not().isEmpty(),
    check('nombres' ,'El nombre es obligatorio').not().isEmpty(),
    check('id_responsable_proceso' ,'Seleccione reclutador').not().isEmpty(),
    check('Sexo' ,'Seleccione Sexo').not().isEmpty(),
    check('email' ,'El email es obligatorio').not().isEmpty(),
    //check('celular' ,'El celular es obligatorio').not().isEmpty(),
], async (req,res)=>{
    // IdAlmacen
    //req.body.dni = parseInt(req.body.dni[0]);
    const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
    }
    
    var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );
    $response.data = [];
    
    if( req.body.fecha_entrevista == '' ){
        delete req.body.fecha_entrevista;
    }
    if( req.body.fecha_nacimiento == '' ){
        delete req.body.fecha_nacimiento;
    }
    if( req.body.edad == '' ){
        delete req.body.edad;
    }
    if( req.body.num_hijos == '' ){
        delete req.body.num_hijos;
    }
    // * //  
    delete req.body.fin_contrato;
    req.body.estado_ficha   = 'PER_PRUEBA';
    req.body.fecha_cubierto = moment().format('YYYY-MM-DD HH:mm:ss'),
	await fichaPersonalModel.update(req.body,{
		where : { 
            id : req.body.id
        }
    })
    .catch(function (err) {
        console.log(err);
        //$response.estado = 'ERROR';
        //$response.error  = err.original.sqlMessage;
        //res.json( $response );
    });
    // REVISAR EL ESTADO...
    var ItemsFicha = await fichaPersonalModel.findAll({
        where : {
            IdReqPersonal : req.body.IdReqPersonal ,
            deleted_at : { [Op.is] : null },
            estado_ficha : { [Op.ne]: 'POR_CUBRIR' } 
        }
    });
    var dataEntidad = await reqPersonalModel.findOne({
        where : {
            IdReqPersonal : req.body.IdReqPersonal ,
            deleted_at : { [Op.is] : null }
        }
    });
    var estado_reclutamiento = '';
    if( dataEntidad.Cantidad == ItemsFicha.length )
    {
        estado_reclutamiento = 'Completado';
    }
    if( dataEntidad.Cantidad > ItemsFicha.length )
    {
        estado_reclutamiento = 'Pendiente';
    }
    if( dataEntidad.Cantidad < ItemsFicha.length )
    {
        estado_reclutamiento = 'Completado*';
    }

    reqPersonalModel.update({
        estado_reclutamiento : estado_reclutamiento ,
        cant_cubierta : ItemsFicha.length
    },{
        where : {
            IdReqPersonal : req.body.IdReqPersonal 
        }
    })
    .catch(function (err) {
        // handle error;
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });
    // **********************************************
    
        $response.data = await fichaPersonalModel.findOne({
            where : {
                id : req.body.id
            }
        });
    
    // Data usuario
    var preUsuario = await User.findOne({
        where : {
            dni : req.body.dni
        }
    });
    if( preUsuario ){
        //
    }else{
       
        var insertUsuario = {};
        insertUsuario.uu_id     = await renovarToken();
        insertUsuario.name      = req.body.nombres;
        var _uuid               = await renovarToken();
        var email               = req.body.dni+'_'+_uuid+'_@ssays.com.pe'
        insertUsuario.email     = email;
        insertUsuario.emailalternativo = req.body.email
        insertUsuario.celular       = req.body.celular
        insertUsuario.estado    = 1;
        //delete req.body.dni;        
        insertUsuario.codemp    = req.body.dni;
        insertUsuario.dni       = req.body.dni
        insertUsuario.api_token = 0;
        insertUsuario.password  = req.body.dni;
        insertUsuario.source    = 'NODE_RECLUTAMIENTO';
        insertUsuario.password  = req.body.NombreU;
        insertUsuario.password  = req.body.ApellidoPaterno;
        insertUsuario.password  = req.body.ApellidoMaterno;
        insertUsuario.Sexo  = req.body.Sexo;
        if(insertUsuario.fechanacimiento)
            insertUsuario.fechanacimiento = req.body.fecha_nacimiento;
        
        //console.log(insertUsuario);
        await User.create( insertUsuario )
        .catch(function (err) {
            // handle error;
            $response.estado = 'ERROR';
            $response.error  = err.original.sqlMessage;
            res.json( $response );
        });
    }
   
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  ELIMINAR HABITACION                //
//////////////////////////////////////////////////////////
router.delete('/:uuid', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';

    var _Entidad = await fichaPersonalModel.findOne({
        where : {
            uu_id : req.params.uuid
        }
    });

    if( _Entidad ){
        var IdReq = _Entidad.IdReqPersonal;
        $response.IdReq = IdReq;
        $response.Id = _Entidad.id;
        
        $response.persona = _Entidad.nombres;
        await fichaPersonalModel.destroy({
            where : {
                uu_id : req.params.uuid
            }
        });
        //
        var NroItems = await fichaPersonalModel.count({
            where: {
                IdReqPersonal : IdReq
            }
        });
        var ItemsFicha = await fichaPersonalModel.findAll({
            where : {
                IdReqPersonal   : IdReq ,
                deleted_at      : { [Op.is] : null },
                nombres         : {[Op.ne] : '* Por cubrir *' },
                dni             : {[Op.ne] : '' }
            }
        });
        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        var _dataRP = await reqPersonalModel.findOne({
            where : {
                IdReqPersonal : IdReq ,
                deleted_at : { [Op.is] : null },
                Estado : 'Aprobado'
            }
        });
        if( _dataRP ){
            var Cantidad = parseInt( _dataRP.Cantidad ), indice = NroItems + 1;
            var _pendientes = parseInt( Cantidad - NroItems );

            if( _pendientes > 0 ){
                // Creamos la ficha de personal en blanco
                var insertar = {};
                insertar.uu_id = await renovarToken();
                insertar.IdReqPersonal  = IdReq;
                insertar.nombres        = '* Por cubrir *';
                insertar.fuente         = '-';
                insertar.dni            = '';
                insertar.indice         = indice;
                insertar.asignacion_familiar = _dataRP.asignacion_familiar;
                insertar.unidad_local    = `${_dataRP.nombre_cliente} - ${_dataRP.nombre_sucursal}`;
                insertar.sueldo          = parseInt(_dataRP.Salario);
                insertar.puesto          = _dataRP.PuestoIso;
                insertar.turno_elegido   = _dataRP.Horario;
                insertar.inicio_contrato = _dataRP.FechaPresentacion;
                insertar.id_cliente      = _dataRP.Cliente;
                insertar.cliente         = _dataRP.nombre_cliente;
                insertar.id_sucursal     = _dataRP.Sucursal;
                insertar.sucursal        = _dataRP.nombre_sucursal;
                insertar.id_puesto       = _dataRP.idPuestoIso;
                //
                await fichaPersonalModel.create( insertar )
                .catch(function (err) {
                    console.log(err);
                    $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;
                    res.json( $response );
                });
                //
            }
        }
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