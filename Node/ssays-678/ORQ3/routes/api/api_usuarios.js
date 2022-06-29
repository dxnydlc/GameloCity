// api_usuarios

const router = require('express').Router();

// Plantillas Mail
const { mail_boleta } = require( './mail_plantillas' );
const bcrypt = require('bcryptjs');
const { Op } = require("sequelize");

const {check,validationResult} = require('express-validator');
// MOMENT
var moment = require('moment-timezone');
moment().tz("America/Lima").format();




// Modelos
const { User,areaModel,centroCostosModel,clienteModel,sucursalModel,puestoIsoModel } = require('../../db');









//////////////////////////////////////////////////////////
//      			OBTENER ULTIMOS 100     			//
//////////////////////////////////////////////////////////
router.get('/',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await User.findAll({
		limit : 100,
		order : [
			[ id , 'DESC' ]
		]
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			BUSCAR USUARIOS		       			//
//////////////////////////////////////////////////////////
router.post('/buscar', async (req,res)=>{
	// dni , nombre , correo, area, tipoU, estado, cc, usuario
	
	var $response = {}, $where = {};
    $response.estado = 'OK';
	var $userData = await getUserData( req.headers['api-token'] );
	
	if( req.body.dni != '' )
	{
		// Buscar por DNI
		$where.dni = req.body.dni;
	}else{
		// Buscar por otros parametros...
		// Nombre
		if( req.body.nombre ){
			// var str = req.query.nombre;
			// var res = str.replace(" ", "%");
			$where.name = { [Op.like ] : '%'+req.body.nombre+'%' };
		}
        // Estado  
        if( req.body.estado ){
			$where.estado = req.body.estado;
		}
        // Tipo de usuario  
        if( req.body.tipoU ){
			$where.TipoUsuario = req.body.tipoU;
		}
		// Correo
		if( req.body.correo ){
			$where.email = req.body.correo;
		}
		// Area
		if( req.body.area ){
			$where.id_area = req.body.area;
		}
        // Centro de costos
		if( req.body.cc ){
			$where.id_centro_costo = { [Op.not]: null };
		}
		// Usuario
        if( req.body.usuario ){
			$where.usuario = req.body.usuario;
		}
	}
    $response.w = $where;

    $response.data = await User.findAll({
		attributes : [
			'id','uu_id','name','area','unidad_negocio','puesto','email','dni','nombre_cliente','almacen','usuario','updatedAt','estado','TipoUsuario'
		],
        where : $where
    })
    .catch(function (err) {
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });

	res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			GET DATA USUARIO BY DNI   			//
//////////////////////////////////////////////////////////
router.post('/get_data_usuario', async (req,res)=>{
	// dni , nombre , correo, area
	
    var _response = {};
    _response.codigo = 200;
	var $where = {};
    _response.estado = 'OK';

    try {
        //
        var $userData = await getUserData( req.headers['api-token'] );
        _response.u = $userData;
        
        $where.dni = req.body.dni;

        _response.data = await User.findOne({
            attributes : [
                'id','uu_id','name','area','unidad_negocio','puesto','email','dni','nombre_cliente','almacen','usuario','updatedAt','estado','celular','emailalternativo', 'IdSupIniciada' , 'trabajo_ot' , 'trabajo_iniciado'
            ],
            where : $where
        });
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Data usuario.` };
        //
    } catch (error) {
        varDump(error);
        _response.codigo = 500;
        _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${error}.` };
    }

	return res.status(_response.codigo).json( _response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			GET DATA USUARIO BY DNI   			//
//////////////////////////////////////////////////////////
router.post('/get_data_loged', async (req,res)=>{
	// dni , nombre , correo, area
	
    var _response = {};
    _response.codigo = 200;
	var $where = {};
    _response.estado = 'OK';

    try {
        //
        var $userData = await getUserData( req.headers['api-token'] );
        _response.u = $userData;
        
        $where.dni = $userData.dni;

        _response.data = await User.findOne({
            attributes : [
                'id','uu_id','name','area','unidad_negocio','puesto','email','dni','nombre_cliente','almacen','usuario','updatedAt','estado','celular','emailalternativo', 'IdSupIniciada' , 'trabajo_ot' , 'trabajo_iniciado' , 'IdOT'
            ],
            where : $where
        });
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Data usuario.` };
        //
    } catch (error) {
        varDump(error);
        _response.codigo = 500;
        _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${error}.` };
    }

	return res.status(_response.codigo).json( _response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			AGREGAR USUARIO       			//
//////////////////////////////////////////////////////////
router.post('/', [
    check('dni' ,'Ingrese un DNI').not().isEmpty(),
    check('id_empresa' ,'Seleccione una empresa').not().isEmpty(),
    check('id_almacen' ,'Seleccione almacén').not().isEmpty(),
    check('unidad_negocio' ,'Seleccione unidad de negocio').not().isEmpty(),
    check('TipoUsuario' ,'Seleccione unidad de negocio').not().isEmpty(),
    check('id_centro_costo' ,'Seleccione centro de costo').not().isEmpty(),
    check('email' ,'Ingrese un correo').not().isEmpty(),
    check('email' ,'Formato de correo incorreco,').isEmail(),
    check('nombre' ,'Ingrese un nombre').not().isEmpty(),
    check('apellidop' ,'Ingrese un paterno').not().isEmpty(),
    check('apellidom' ,'Ingrese un materno').not().isEmpty(),
    check('cliente' ,'Seleccione cliente').not().isEmpty(),
    check('sucursal' ,'Seleccione local').not().isEmpty(),
    check('Iniciales' ,'Ingrese iniciales del usuario').not().isEmpty(),
] ,async (req,res)=>{

	const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}

	var $response    = {};
    $response.estado = 'OK';
    var $userData    = await getUserData( req.headers['api-token'] );

    req.body.UsuarioCreado  = $userData.name;
    req.body.created_at     =  moment().format('YYYY-MM-DD HH:mm:ss');
    // - //
    if(! req.body.fechanacimiento ){
        delete req.body.fechanacimiento;
    }
    req.body.password = 'A';
    req.body.SOURCE = 'BACKEND';
    if( req.body.uu_id == '' ){
        req.body.uu_id = await renovarToken();
    }
    req.body.api_token = await renovarToken();

    // Nombre
    var _nombre = req.body.nombre, _paterno = req.body.apellidop, _materno = req.body.apellidom;
    req.body.nombre     = _nombre.toUpperCase();
    req.body.apellidop  = _paterno.toUpperCase();
    req.body.apellidom  = _materno.toUpperCase();
    req.body.name = `${req.body.apellidop} ${req.body.apellidom} ${req.body.nombre}`;

    await User.create(req.body)
    .catch(function (err) {
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });
    if( req.body.id_centro_costo ){
        var _dataGuardado = await User.findOne({
            where : {
                uu_id : req.body.uu_id
            }
        });
        if( _dataGuardado ){
            var _Codigo = await pad_with_zeroes( _dataGuardado.id , 5 );
            _Codigo = 'USR'+_Codigo;
            await User.update({
                Codigo : _Codigo
            },{
                where  : {
                    uu_id : req.body.uu_id
                }
            });
        }
    }
    var _dataGuardado = await User.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });
    $response.data = _dataGuardado;
    $response.item = _dataGuardado;
    // - //
	res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////
//          CARGAR USUARIO            //
//////////////////////////////////////////
router.post('/get_data', async (req,res)=>{
    // id / uu_id
    var $response 		= {};
	$response.estado 	= 'OK';
	$response.encontrado= 'NO';
	$response.data 		= [];
	$response.cc 		= [];
	$response.cliente 	= [];
	$response.local 	= [];
	$response.puestoIso = [];

    $response.data = await User.findOne({
		attributes: {exclude: ['password']},
        where : {
            id : req.body.id
        }
	})
    .catch(function (err) {
        console.log(`Error usuario`);
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });
	if( $response.data ){
		$response.encontrado = 'SI';
	}
	if( $response.encontrado == 'SI' ){
		// CC
		if( $response.data.id_centro_costo ){
			$response.cc = await centroCostosModel.findOne({
				where : {
					IdCentro : $response.data.id_centro_costo
				}
			})
            .catch(function (err) {
                console.log(`Error CC`);
                $response.estado = 'ERROR';
                $response.error  = err.original.sqlMessage;
                res.json( $response );
            });
		}
		// Cliente
		console.log(`id clienente=> ${$response.data.cliente }`);
		if( $response.data.cliente ){
			var ClienteDATA = await clienteModel.findOne({
				where : {
					IdClienteProv : $response.data.cliente
				}
            })
            .catch(function (err) {
                // handle error;
                console.log(err);
            });
            $response.cliente = ClienteDATA;
        }
		// Local
		if( $response.cliente ){
			var dataLocal = await sucursalModel.findAll({
				where : {
					IdClienteProv : $response.cliente.IdClienteProv
				}
			})
            .catch(function (err) {
                // handle error;
                console.log(err);
            });
            $response.local = dataLocal;
		}
		// Puestos ISO
		if( $response.data.id_area ){
			$response.puestoIso = await puestoIsoModel.findAll({
				where : {
					IdArea : $response.data.id_area
				}
			})
            .catch(function (err) {
                console.log(`Error Puesto ISO`);
                $response.estado = 'ERROR';
                $response.error  = err.original.sqlMessage;
                res.json( $response );
            });
		}
	}
    
    res.json( $response );
});
// ---------------------------------------

//////////////////////////////////////////////////////////
//                  CARGAR USUARIO POR UUID             //
//////////////////////////////////////////////////////////
router.post('/by_und_neg', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    var _UsuariosData = await User.findAll({
        where : {
            unidad_negocio : 'SANEAMIENTO',
            estado : 1
        }
    })
    .catch(function (err) {
        captueError( err.original , req.body );
        console.log(_NombreDoc);
        $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
    });

    $response.data = _UsuariosData;
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  CARGAR USUARIO POR UUID             //
//////////////////////////////////////////////////////////
router.post('/from_uuid', async (req,res)=>{
    // uuid
    var $response 		= {};
	$response.estado 	= 'OK';
	$response.encontrado= 'NO';
	$response.data 		= [];
	$response.cc 		= [];
	$response.cliente 	= [];
	$response.local 	= [];
	$response.puestoIso = [];

    var _dataUsuario = await User.findOne({
		attributes: {exclude: ['password']},
        where : {
            uu_id : req.body.uuid
        }
	})
    .catch(function (err) {
        console.log(`Error usuario`);
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });
    $response.data = _dataUsuario;
    

	if( $response.data ){
		$response.encontrado = 'SI';
	}
	if( $response.encontrado == 'SI' ){
		// CC
		if( _dataUsuario.id_centro_costo ){
			$response.cc = await centroCostosModel.findOne({
				where : {
					IdCentro : _dataUsuario.id_centro_costo
				}
			})
            .catch(function (err) {
                console.log(`Error CC`);
                $response.estado = 'ERROR';
                $response.error  = err.original.sqlMessage;
                res.json( $response );
            });
		}
		// Cliente
		console.log(`id clienente=> ${_dataUsuario.cliente }`);
		if( _dataUsuario.cliente ){
			var ClienteDATA = await clienteModel.findOne({
				where : {
					IdClienteProv : _dataUsuario.cliente
				}
            })
            .catch(function (err) {
                // handle error;
                console.log(err);
            });
            $response.cliente = ClienteDATA;
        }
		// Local
		if( $response.cliente ){
			var dataLocal = await sucursalModel.findAll({
				where : {
					IdClienteProv : $response.cliente.IdClienteProv
				}
			})
            .catch(function (err) {
                // handle error;
                console.log(err);
            });
            $response.local = dataLocal;
		}
		// Puestos ISO
		if( _dataUsuario.id_area ){
			$response.puestoIso = await puestoIsoModel.findAll({
				where : {
					IdArea : _dataUsuario.id_area
				}
			})
            .catch(function (err) {
                console.log(`Error Puesto ISO`);
                $response.estado = 'ERROR';
                $response.error  = err.original.sqlMessage;
                res.json( $response );
            });
		}
	}
    
    res.json( $response );
});
// -------------------------------------------------------


//////////////////////////////////////////////////////////
//                  CARGAR USUARIO POR ID               //
//////////////////////////////////////////////////////////
router.post('/from_id', async (req,res)=>{
    // id
    var $response 		= {};
	$response.estado 	= 'OK';
	$response.encontrado= 'NO';
	$response.data 		= [];
	$response.cc 		= [];
	$response.cliente 	= [];
	$response.local 	= [];
	$response.puestoIso = [];

    var _dataUsuario = await User.findOne({
		attributes: {exclude: ['password']},
        where : {
            id : req.body.id
        }
	})
    .catch(function (err) {
        console.log(`Error usuario`);
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });
    $response.data = _dataUsuario;
    

	if( $response.data ){
		$response.encontrado = 'SI';
	}
	if( $response.encontrado == 'SI' ){
		// CC
		if( _dataUsuario.id_centro_costo ){
			$response.cc = await centroCostosModel.findOne({
				where : {
					IdCentro : _dataUsuario.id_centro_costo
				}
			})
            .catch(function (err) {
                console.log(`Error CC`);
                $response.estado = 'ERROR';
                $response.error  = err.original.sqlMessage;
                res.json( $response );
            });
		}
		// Cliente
		console.log(`id clienente=> ${_dataUsuario.cliente }`);
		if( _dataUsuario.cliente ){
			var ClienteDATA = await clienteModel.findOne({
				where : {
					IdClienteProv : _dataUsuario.cliente
				}
            })
            .catch(function (err) {
                // handle error;
                console.log(err);
            });
            $response.cliente = ClienteDATA;
        }
		// Local
		if( $response.cliente ){
			var dataLocal = await sucursalModel.findAll({
				where : {
					IdClienteProv : $response.cliente.IdClienteProv
				}
			})
            .catch(function (err) {
                // handle error;
                console.log(err);
            });
            $response.local = dataLocal;
		}
		// Puestos ISO
		if( _dataUsuario.id_area ){
			$response.puestoIso = await puestoIsoModel.findAll({
				where : {
					IdArea : _dataUsuario.id_area
				}
			})
            .catch(function (err) {
                console.log(`Error Puesto ISO`);
                $response.estado = 'ERROR';
                $response.error  = err.original.sqlMessage;
                res.json( $response );
            });
		}
	}
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  CARGAR 2            //
//////////////////////////////////////////////////////////
router.post('/get_data_by_dni', async (req,res)=>{
    // dni
    var $response 		= {};
	$response.estado 	= 'OK';
	$response.encontrado= 'NO';
	$response.data 		= [];
	$response.cc 		= [];
	$response.cliente 	= [];
	$response.local 	= [];
	$response.puestoIso = [];

    $response.data = await User.findOne({
		attributes: [ 'id', 'uu_id', 'name','email','celular','fechanacimiento','dni','Direccion','mail_notifi','Sexo','Firma', 'emailalternativo', 'id_area', 'idPuestoIso', 'puestoiso' ],
        where : {
            dni : req.body.dni
        }
	});
	if( $response.data ){
		$response.encontrado = 'SI';
	}
    
    res.json( $response );
});
// ---------------------------------------

//////////////////////////////////////////
//       ACTUALIZAR USUARIO             //
//////////////////////////////////////////
router.put('/:id', [
    check('dni' ,'Ingrese un DNI').not().isEmpty(),
    check('id_empresa' ,'Seleccione una empresa').not().isEmpty(),
    check('id_almacen' ,'Seleccione almacén').not().isEmpty(),
    check('unidad_negocio' ,'Seleccione unidad de negocio').not().isEmpty(),
    check('TipoUsuario' ,'Seleccione unidad de negocio').not().isEmpty(),
    check('id_centro_costo' ,'Seleccione centro de costo').not().isEmpty(),
    check('email' ,'Ingrese un correo').not().isEmpty(),
    check('email' ,'Formato de correo incorreco,').isEmail(),
    check('nombre' ,'Ingrese un nombre').not().isEmpty(),
    check('apellidop' ,'Ingrese un paterno').not().isEmpty(),
    check('apellidom' ,'Ingrese un materno').not().isEmpty(),
    check('cliente' ,'Seleccione cliente').not().isEmpty(),
    check('sucursal' ,'Seleccione local').not().isEmpty(),
], async (req,res)=>{

    const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
    }
    
    var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );
    $response.data = [];

    if(! req.body.fechanacimiento ){
        delete req.body.fechanacimiento;
    }

    // Auditoria
    delete req.body.UsuarioCreado;
    delete req.body.UsuarioAnulado;
    req.body.UsuarioModificado = $userData.name;
    req.body.updated_at =  moment().format('YYYY-MM-DD HH:mm:ss');

    if(! req.body.uu_id ){
        req.body.uu_id = await renovarToken();
    }
    if(! req.body.api_token ){
        req.body.api_token = await renovarToken();
    }

    // Nombre
    var _nombre = req.body.nombre, _paterno = req.body.apellidop, _materno = req.body.apellidom;
    req.body.nombre     = _nombre.toUpperCase();
    req.body.apellidop  = _paterno.toUpperCase();
    req.body.apellidom  = _materno.toUpperCase();
    req.body.name = `${req.body.apellidop} ${req.body.apellidom} ${req.body.nombre}`;

    // Codigo
    if( req.body.id_centro_costo ){
        var _Codigo = await pad_with_zeroes( req.body.id , 5 );
        _Codigo = 'USR'+_Codigo;
        req.body.Codigo = _Codigo;
    }


	await User.update(req.body,{
		where : { 
            id : req.params.id 
        }
    })
    .catch(function (err) {
        // handle error;
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });
    $response.item = await User.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////
//       ELIMINAR USUARIO            //
//////////////////////////////////////////
router.delete('/:id', async (req,res)=>{
    // id
    var $response    = {};
    $response.estado = 'OK';
    $response.data   = [];
    var $userData    = await getUserData( req.headers['api-token'] );

    // Auditoria
    req.body.UsuarioAnulado = $userData.name;
    req.body.estado = 0;
    //req.body.deleted_at =  moment().format('YYYY-MM-DD HH:mm:ss');

    var _dataGuardado = await User.findOne({
        where : {
            id : req.params.id
        }
    });

    if( _dataGuardado ){
        var semilla = await renovarToken_2();
        var _email = semilla+'_'+_dataGuardado.email;
        $anuladoPor = $userData.name;
        await User.update({
            email  : _email,
            estado : 0
        },{
            where : { 
                id : req.params.id 
            }
        })
        .catch(function (err) {
            $response.estado = 'ERROR';
            $response.error  = err.original.sqlMessage;
            res.json( $response );
        });
    }

    // Devolver la data+
    $response.data = await User.findAll({
		attributes : [
			'id','uu_id','name','area','unidad_negocio','puesto','email','dni','nombre_cliente','almacen','usuario','updatedAt','estado'
		],
        where : {
            id : req.params.id
        }
    })
    .catch(function (err) {
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });
    
    res.json( $response );
});

//////////////////////////////////////////
//          CARGAR USUARIO            //
//////////////////////////////////////////
router.post('/cng_pass', async (req,res)=>{
    // uuid , pass
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    var _password = bcrypt.hashSync( req.body.pass , 10 );
    console.log(_password);

    await User.update({
        password : _password
    },{
        where : {
            uu_id : req.body.uuid
        }
    });

    $response.item = await User.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });

    res.json( $response );
});
// ---------------------------------------

// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
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
async function renovarToken()
{
    var length = 25;
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
async function renovarToken_2()
{
    var length = 25;
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
   
    return result;
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
function varDump( _t )
{
    console.log( _t );
}
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------

module.exports = router;