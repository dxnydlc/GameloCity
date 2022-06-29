
// api_clientes.js

const router = require('express').Router();

const { clienteModel,User, sucursalModel, provinciaModel, departamentoModel, distrito2Model } = require('../../db');

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
    //console.log('clientes listar');
	$response.data = await clienteModel.findAll({
        order : [
            ['id' , 'DESC']
        ]
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////
//          BUSCAR CLIENTE            //
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
        $response.data = await clienteModel.findAll({
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
        $response.data = await clienteModel.findAll({
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

	$response.data = await clienteModel.findAll({
        where : {
            Estado : 1
        },
        order : [
            ['Descripcion' , 'DESC']
        ]
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			AGREGAR CLIENTE       			//
//////////////////////////////////////////////////////////
router.post('/', [
    check('Razon' ,'Ingrese una razón social').not().isEmpty(),
	check('IdGiro' ,'Seleccione un Giro').not().isEmpty(),
	check('Direccion' ,'Ingrese una dirección').not().isEmpty(),
	check('idUbigeo' ,'Seleccione distrito-').not().isEmpty(),
	check('IdClienteProv' ,'IdClienteProv es obligatorio').not().isEmpty(),
	check('Pais' ,'Seleccione un país').not().isEmpty(),
	check('Departamento' ,'Seleccione un departamento').not().isEmpty(),
	check('Provincia' ,'Seleccione una provincia').not().isEmpty(),
	check('Distrito' ,'Seleccione un distrito').not().isEmpty(),
	check('NombreCalle' ,'Ingrese un nombre de Calle').not().isEmpty(),
	check('NroCalle' ,'Ingrese un Nro Calle').not().isEmpty(),
] ,async (req,res)=>{
    
	const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}

    // Inicio contrato
    if( req.body.inicio_contrato == '' ){
        delete req.body.inicio_contrato;
    }
    // Fin contrato
    if( req.body.vencimiento_contrato == '' ){
        delete req.body.vencimiento_contrato;
    }
    // Centro de costos
    if( req.body.IdCentro == '' ){
        delete req.body.IdCentro;
    }
    // Giro IdGiro
    if( req.body.IdGiro == '' ){
        delete req.body.IdGiro;
    }
    // Grupo clientes
    if( req.body.IdGrupo == '' ){
        delete req.body.IdGrupo;
    }
    if( req.body.monto_materiales == '' ){
        delete req.body.monto_materiales;
    }
    if( req.body.monto_implementos == '' ){
        delete req.body.monto_implementos;
    }
    if( req.body.monto_indumentaria == '' ){
        delete req.body.monto_indumentaria;
    }
    if( req.body.monto_intitucional == '' ){
        delete req.body.monto_intitucional;
    }
    if( req.body.RUC == '' ){
        delete req.body.RUC;
    }
    if( req.body.DNI == '' ){
        delete req.body.DNI;
    }
	
	var $response = {};
    $response.estado = 'OK';
    $response.data   = {};
    var $userData = await getUserData( req.headers['api-token'] );

    req.body.UsuarioMod     = $userData.dni;
    //req.body.nombre_usuario = $userData.name;

    //console.log(req.body);
    req.body.Tipo = 3;
    await clienteModel.create(req.body)
    .catch(function (err) {
        
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
        
      // console.log(err);
    });

    var _dataGuardado = await clienteModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });
  
    
    if( _dataGuardado ){
        var _Codigo = await pad_with_zeroes( _dataGuardado.id , 8 );
        _Codigo = 'CL'+_Codigo;
        await clienteModel.update({
            Codigo : _Codigo
        },{
            where  : {
                uu_id : req.body.uu_id
            }
        });
       // console.log(_Codigo);
    }

    $response.data = await clienteModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });

    

	res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////
//          CARGAR CLASE            	//
//////////////////////////////////////////
router.post('/get_data', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    

    var _Entidad = await clienteModel.findOne({
        where : {
            id : req.body.id
        }
    });
    $response.data = _Entidad;
    
   // console.log($response);
    res.json( $response );
});
// ---------------------------------------

//////////////////////////////////////////////////////////
//            CARGAR CLIENTE POR IDCLIENTEPROV          //
//////////////////////////////////////////////////////////
router.post('/by_idcliente', async (req,res)=>{
    // IdCli
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.depa = [];
    $response.prov = [];
    $response.dist = [];

    var _Entidad = await clienteModel.findOne({
        where : {
            IdClienteProv : req.body.IdCli
        }
    })
    .catch(function (err) {
        captueError( err.original , req.body );
        console.log(_NombreDoc);
        $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
    });
    $response.data = _Entidad;
    $response.depa = await departamentoModel.findAll();
    if( _Entidad )
    {
        if( _Entidad.Departamento )
        {
            $response.prov = await provinciaModel.findAll({
                where : {
                    department_id : _Entidad.Departamento
                }
            });
        }
        if( _Entidad.Provincia )
        {
            $response.dist = await distrito2Model.findAll({
                where : {
                    province_id : _Entidad.Provincia
                }
            });
        }
    }
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////
//       ACTUALIZAR CLASE          		//
//////////////////////////////////////////
router.put('/:uuid', [
    check('Razon' ,'Ingrese una razón social').not().isEmpty(),
	check('IdGiro' ,'Seleccione un Giro').not().isEmpty(),
	check('Direccion' ,'Ingrese una dirección').not().isEmpty(),
	check('idUbigeo' ,'Seleccione distrito-').not().isEmpty(),
	check('IdClienteProv' ,'IdClienteProv es obligatorio').not().isEmpty(),
	//check('Pais' ,'Seleccione un país').not().isEmpty(),
	check('Departamento' ,'Seleccione un departamento').not().isEmpty(),
	check('Provincia' ,'Seleccione una provincia').not().isEmpty(),
	check('Distrito' ,'Seleccione un distrito').not().isEmpty(),
	check('NombreCalle' ,'Ingrese un nombre de Calle').not().isEmpty(),
	check('NroCalle' ,'Ingrese un Nro Calle').not().isEmpty(),
], async (req,res)=>{
    // uuid
    console.log("actualizar");
    const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
    }

    // Inicio contrato
    if( req.body.inicio_contrato == '' ){
        delete req.body.inicio_contrato;
    }
    // Fin contrato
    if( req.body.vencimiento_contrato == '' ){
        delete req.body.vencimiento_contrato;
    }
    // Centro de costos
    if( req.body.IdCentro == '' ){
        delete req.body.IdCentro;
    }
    // Giro IdGiro
    if( req.body.IdGiro == '' ){
        delete req.body.IdGiro;
    }
    // Grupo clientes
    if( req.body.IdGrupo == '' ){
        delete req.body.IdGrupo;
    }
    if( req.body.monto_materiales == '' ){
        delete req.body.monto_materiales;
    }
    if( req.body.monto_implementos == '' ){
        delete req.body.monto_implementos;
    }
    if( req.body.monto_indumentaria == '' ){
        delete req.body.monto_indumentaria;
    }
    if( req.body.monto_intitucional == '' ){
        delete req.body.monto_intitucional;
    }
    if( req.body.RUC == '' ){
        delete req.body.RUC;
    }
    if( req.body.DNI == '' ){
        delete req.body.DNI;
    }
    
    
    
    
    
    var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );
    $response.data = [];

    // Auditoria
    req.body.UsuarioMod     = $userData.dni;
    req.body.nombre_usuario = $userData.name;
    //delete req.body.id;
	await clienteModel.update(req.body,{
		where : { 
            uu_id : req.params.uuid 
        }
    })
    .catch(function (err) {
       // console.log(err);
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });
    
    $response.item = await clienteModel.findOne({
        where : {
            uu_id : req.params.uuid
        }
    });



    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////
//       ELIMINAR CLASE            		//
//////////////////////////////////////////
router.delete('/:uuid', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $userData = await getUserData( req.headers['api-token'] );

    // Auditoria
    //delete req.body.UsuarioMod;
    // delete req.body.editado_por;
    //req.body.UsuarioMod = $userData.name;

   // $anuladoPor = $userData.name;
    console.log('anulado');
	await clienteModel.update({
        Estado      : 0,
        UsuarioMod  : $userData.dni,
        nombre_usuario  : $userData.name,
    },{
		where : { 
            uu_id : req.params.uuid 
        }
    });
    
    $response.item = await clienteModel.findOne({
        where : {
            uu_id : req.params.uuid
        }
    });

    res.json( $response );
});

// ========================================
// Filtro home Buscar Clientes
router.post('/buscar/home', async (req,res)=>{
	// dni, ruc, razon
	
	var $response = {};
	$response.estado = 'OK';
	var $where = {};
	const { Op } = require("sequelize");

	// Buscar por DNI
	if( req.body.dni != '' ){
		var $DNI = req.body.dni;
		$where.DNI = $DNI;
	}
	// Buscar por RUC
	if( req.body.ruc != '' ){
		var $RUC = req.body.ruc;
		$where.RUC = $RUC;
	}
	// Buscar por razon (like)
	if( req.body.razon != '' ){
		console.log('>>>>>>>>>'+req.body.razon);
		var $nombre = req.body.razon;
		$where.Razon = { [Op.like] : '%'+req.body.razon+'%' };
	}
	// hay items en el where¿?
	let count = 0;
	for (var c in $where) {
		count = count + 1;
	}
	$response.count = count;
	$response.where = $where;
	$where.deleted_at = { [Op.is] : null };
	//
	if( count > 0 ){
		// Buscar con where
		const dataOS = await clienteModel.findAll({
			order: [
				['id', 'DESC']
			],
			where : $where
		});
		$response.data = dataOS;
	}else{
		// Listar los 200 ultimos
		const dataOS = await clienteModel.findAll({
			order: [
				['id', 'DESC']
			],
			limit : 200
		});
		$response.data = dataOS;
	}
	//
		
	//
	res.json( $response );
});
// ========================================


//////////////////////////////////////////////////////////
//  AGREGAR ID CONCAR A LOS LOCALES (NO BORRAR)         //
//////////////////////////////////////////////////////////
router.post('/make_ids_concar', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    // Todos los clientes
    var _DataClie = await clienteModel.findAll({
        order : [
            [ 'Razon' , 'ASC' ]
        ]
    });

    if( _DataClie ){
        // Locales de ese cliente
        for (let index = 0; index < _DataClie.length; index++) {
            const rsC = _DataClie[index];
            var _Locales = await sucursalModel.findAll({
                where : {
                    IdClienteProv : rsC.IdClienteProv
                },
                order : [
                    [ 'IdSucursal' , 'ASC' ]
                ]
            });
            if( _Locales )
            {
                var _Indice = 1;
                for (let G = 0; G < _Locales.length; G++) {
                    const rsD = _Locales[G];
                    var _IdConcar = await pad_with_zeroes( _Indice , 4 );
                    await sucursalModel.update({
                        IdConcar : _IdConcar
                    },{
                        where : {
                            IdSucursal : rsD.IdSucursal
                        }
                    });
                    _Indice++;
                }
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
function pad_with_zeroes( number , length )
{
    var my_string = '' + number;
    while (my_string.length < length) {
        my_string = '0' + my_string;
    }
    return my_string;
}
// -------------------------------------------------------
async function captueError( error , post )
{
    var _envio       = JSON.stringify(post);
    var _descripcion = JSON.stringify(error);
    var _uuid = await renovarToken();
    await errorLogModel.create({
        uu_id : _uuid,
        modulo : 'api_reqPersonal',
        descripcion : _descripcion,
        envio : _envio
    })
    .catch(function (err) {
        console.log(_NombreDoc);
        console.log(err);
    });
}
// -------------------------------------------------------
function varDump( _t )
{
    console.log( _t );
}
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------

module.exports = router;