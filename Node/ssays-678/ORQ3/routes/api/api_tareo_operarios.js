// api_tareo_operarios.js

const router = require('express').Router();

const { tareoModel,User,tareoDetalle3Model } = require('../../db');

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

	$response.data = await tareoModel.findAll({
        order : [
            ['id' , 'DESC']
        ],
        limit : 200
    });

    res.json( $response );
});
// -------------------------------------------------------


//////////////////////////////////////////
//          BUSCAR CLASE            //
//////////////////////////////////////////
router.post('/buscar', async (req,res)=>{
    // id, nombre
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $where = {};

    if( req.body.id != '' ){
        // Buscamos por ID
        $where.id = req.body.id;
        //
        $response.data = await tareoModel.findAll({
            order : [
                ['id' , 'DESC']
            ],
            where : $where
        });
        //
    }else{
        // Buscamos por nombre
        $where.Descripcion = { [Op.like] : '%'+req.body.nombre+'%' }
        //
        $response.data = await tareoModel.findAll({
            order : [
                ['id' , 'DESC']
            ],
            where : $where
        });
    }

    
    res.json( $response );
});
// ---------------------------------------


//////////////////////////////////////////////////////////
//      			OBTENER LISTA     			//
//////////////////////////////////////////////////////////
router.get('/lista',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await tareoModel.findAll({
        where : {
            Estado : 'Activo'
        },
        order : [
            ['id' , 'DESC']
        ],
        limit : 100
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			AGREGAR CLASE       			//
//////////////////////////////////////////////////////////
router.post('/', [
    check('Inicio' ,'Ingrese día de Inicio').not().isEmpty(),
    check('Fin' ,'Inrse día de Fin').not().isEmpty(),
    check('Mes' ,'Seleccione mes').not().isEmpty(),
    check('Anio' ,'Ingrese Anio').not().isEmpty(),
    check('IdCliente' ,'Seleccione cliente').not().isEmpty(),
    check('IdLocal' ,'Seleccione local').not().isEmpty(),
    check('Nombre' ,'Ingrese Nombre').not().isEmpty(),
] ,async (req,res)=>{

	const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}
	
	var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );
    var _FechaInicio = '', _FechaFin, _Mes = '';

    switch (req.body.Mes) {
        case 'Enero':
            _Mes = '01';
        break;
        case 'Febrero':
            _Mes = '02';
        break;
        case 'Marzo':
            _Mes = '03';
        break;
        case 'Abril':
            _Mes = '04';
        break;
        case 'Mayo':
            _Mes = '05';
        break;
        case 'Junio':
            _Mes = '06';
        break;
        case 'Julio':
            _Mes = '07';
        break;
        case 'Agosto':
            _Mes = '08';
        break;
        case 'Septiembre':
            _Mes = '09';
        break;
        case 'Octubre':
            _Mes = '10';
        break;
        case 'Noviembre':
            _Mes = '11';
        break;
        case 'Diciembre':
            _Mes = '12';
        break;
    }
    var _Inicio = await pad_with_zeroes( req.body.Inicio , 2);
    var _Fin = await pad_with_zeroes( req.body.Fin , 2);
    _FechaInicio = req.body.Anio+'-'+_Mes+'-'+_Inicio;
    _FechaFin = req.body.Anio+'-'+_Mes+'-'+_Fin;
    console.log(`${_FechaInicio} , ${_FechaFin}`);

    req.body.FechaInicio = _FechaInicio;
    req.body.FechaFin = _FechaFin;
    req.body.IdUsuarioCreado = $userData.dni;
    req.body.CreadoPor       = $userData.name;

    //
    $response.data = await tareoModel.create(req.body)
    .catch(function (err) {
        // handle error;
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });

    $response.item = await tareoModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });

    // >>>>>>>>>>> AHORA CREAMOS EL DETALLE
    var IdTareo = $response.item.id;
    var _PersonalCliente = await User.findAll({
        where : {
            cliente  : req.body.IdCliente,
            sucursal : req.body.IdLocal
        }
    });
    if( _PersonalCliente ){
        
        // _insertDetalle.IdCliente= req.body.IdCliente;
        // _insertDetalle.Cliente  = req.body.Cliente;
        // _insertDetalle.IdLocal  = req.body.IdLocal;
        // _insertDetalle.Local    = req.body.Local;

        for (let index = 0; index < _PersonalCliente.length; index++) {
            const rs = _PersonalCliente[index];
            var _insertDetalle = {};
            _insertDetalle.uu_id = await renovarToken();
            _insertDetalle.IdTareo  = IdTareo;
            _insertDetalle.DNI      = rs.dni;
            _insertDetalle.Nombre   = rs.name;
            //console.log(_insertDetalle);
            await tareoDetalle3Model.create(_insertDetalle)
            .catch(function (err) {
                $response.estado = 'ERROR';
                $response.error  = err.original.sqlMessage;
                res.json( $response );
            });
        }
    }
    // Listado
    var _columns = [];
    _columns.push('id');
    _columns.push('DNI');
    _columns.push('Nombre');
    _Inicio = parseInt( req.body.Inicio ), _Fin = parseInt( req.body.Fin );
    for (let index = _Inicio; index <= _Fin; index++) {
        console.log(`>>>>>> ${index}`);
        const _diax = await pad_with_zeroes( index , 2 );
        _columns.push(`Dia${_diax}`);
    }
    var _detalleMarcacion = await tareoDetalle3Model.findAll({
        where : {
            IdTareo
        },
        attributes : _columns
    });
    $response.detalle = _detalleMarcacion;
    console.log(_columns);


	res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////
//          CARGAR CLASE            //
//////////////////////////////////////////
router.post('/get_data', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    $response.data = await tareoModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
    
    res.json( $response );
});
// ---------------------------------------

//////////////////////////////////////////
//       ACTUALIZAR CLASE          //
//////////////////////////////////////////
router.put('/:uuid', [
    check('Nombre' ,'El nombre es obligatorio').not().isEmpty(),
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

	await tareoModel.update(req.body,{
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
    
    $response.item = await tareoModel.findOne({
        where : {
            uu_id : req.params.uuid
        }
    });

    $response.data = await tareoModel.findAll({
        order : [
            ['id' , 'DESC']
        ]
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////
//       ELIMINAR CLASE            //
//////////////////////////////////////////
router.delete('/:uuid', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $userData = await getUserData( req.headers['api-token'] );

    // Auditoria
    delete req.body.UsuarioMod;
    // delete req.body.editado_por;
    req.body.UsuarioMod = $userData.name;

    $anuladoPor = $userData.name;

	await tareoModel.update({
        Estado      : 0,
        UsuarioMod  : $userData.dni,
        nombre_usuario  : $userData.name,
    },{
		where : { 
            uu_id : req.params.uuid 
        }
    });
    
    $response.item = await tareoModel.findOne({
        where : {
            uu_id : req.params.uuid
        }
    });

    $response.data = await tareoModel.findAll({
        order : [
            ['Nombre' , 'ASC']
        ]
    });
    
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
// -------------------------------------------------------
async function pad_with_zeroes(number, length) {

    var my_string = '' + number;
    while (my_string.length < length) {
        my_string = '0' + my_string;
    }

    return my_string;

}
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------

module.exports = router;