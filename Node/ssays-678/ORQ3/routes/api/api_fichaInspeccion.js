const router = require('express').Router();
const fs = require('fs'); 

const dotenv = require('dotenv');
dotenv.config();
// SPARKPOST
const SparkPost = require('sparkpost')
const clientMail    = new SparkPost(process.env.SPARKPOST_SECRET)
// MOMENT
var moment = require('moment-timezone');
moment().tz("America/Lima").format();
// NEXMO
const Nexmo         = require('nexmo');
const BitlyClient   = require('bitly').BitlyClient;
const bitly         = new BitlyClient(process.env.BITLY_API);

// Variables BD
const { 
    fichaInspeccionModel,User,
    distrito2Model,
	departamentoModel,
	provinciaModel,
	productosModel,
	serviciosLocalFicInpecModel,
	localFichaInpecModel,
	clienteModel,
	sucursalModel,
	pteFichaInspModel,
	fichaInspFactModel,
	fichaInspCertModel
} = require('../../db');

// Variables Plantilla Mail
var MailHtml = require('../../plantillas/Correos');

const {check,validationResult} = require('express-validator');
const { Op } = require("sequelize");


//////////////////////////////////////////////////////////
//              OBTENER FICHA DE INSPECCIÓN             //
//////////////////////////////////////////////////////////
router.get('/',async(req,res)=>{

    var $response = {};
    $response.estado = 'OK';
	$response.data = await fichaInspeccionModel.findAll({
        limit : 200,
        order: [
			['idFichaInspeccion', 'DESC']
		]
    });

    res.json($response);
});
// -------------------------------------------------------


//////////////////////////////////////////////////////////
//      			SERVICIOS LOCAL     			//
//////////////////////////////////////////////////////////
router.post('/lista_servicios_local',async(req,res)=>{
	// IdFicha
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await serviciosLocalFicInpecModel.findAll({
        where : {
            IdFichaInspeccion : req.body.IdFicha,
			Estado 			  : 'Aprobado'
        },
        order : [
            ['id' , 'DESC']
        ]
    });

    res.json( $response );
});
// -------------------------------------------------------


//////////////////////////////////////////////////////////
//     	REVISAR CLIENTE Y LOCAL Y ENVIAR FICHA     		//
//////////////////////////////////////////////////////////
router.post('/check_cliente_send',async(req,res)=>{
	// IdFicha, uuid (servicio)
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
	var $userData = await getUserData( req.headers['api-token'] );
	var IdFicha   = req.body.IdFicha;

	var Servicio = await serviciosLocalFicInpecModel.findOne({
        where : {
            uu_id : req.body.uuid,
        }
    });
	if( Servicio ){
		var DataFicha = await fichaInspeccionModel.findOne({
			where : {
				idFichaInspeccion : req.body.IdFicha
			}
		});
		if( DataFicha ){
			// vamos a ver si el cliene ya existe
			var esCliente = await clienteModel.findOne({
				where : { 
					IdClienteProv : DataFicha.DocCliente 
				}
			});
			if(! esCliente ){
				// No existe, vamos a crearlo
				var datosCliente = {};
				datosCliente.uu_id = await renovarToken();
				datosCliente.Tipo = 3;// Cliente y proveedor
				if( DataFicha.TipoDocumento == 'RUC' ){
					datosCliente.tipo_cliente = 'juridico';
					datosCliente.RUC = DataFicha.DocCliente;
				}else{
					datosCliente.tipo_cliente = 'natural';
					datosCliente.DNI = DataFicha.DocCliente;
				}
				//console.log(DataFicha.DireccionFiscal);
				datosCliente.Razon 		= DataFicha.NomCliente
				datosCliente.Direccion 	= DataFicha.DireccionFiscal;
				datosCliente.ReferenciaDireccion = '';
				datosCliente.IdMoneda 	= 1;
				datosCliente.moneda 	= 'PEN';
				datosCliente.Telefono 	= DataFicha.Telefono;
				datosCliente.Estado 	= 1;
				datosCliente.UsuarioMod = $userData.dni;
				datosCliente.FechaMod 	= moment().format('YYYY-MM-DD HH:mm:ss');
				datosCliente.Movil 		= DataFicha.MovilSolicitante;
				datosCliente.Email 		= '-';
				datosCliente.EmailContacto = DataFicha.EmailSolicitante;
				datosCliente.Contacto 	= DataFicha.NomSolicitante;
				datosCliente.IdGiro 	= DataFicha.idGiro;
				datosCliente.nombre_giro= DataFicha.giro;
				datosCliente.NombreComercial = DataFicha.NomComercial;
				//datosCliente.IdCentro 		= DataFicha.ssss;
				//datosCliente.centro_costos 	= DataFicha.ssss;
				datosCliente.TipoCliente = 'Estandar';
				datosCliente.AgenteRet 	 = 'NO';
				datosCliente.Urbanizacion = DataFicha.Urbanizacion;
				datosCliente.idUbigeo 	= DataFicha.Ubigeo;
				datosCliente.ubigeo 	= DataFicha.ubigeo_texto;
				datosCliente.Pais 		= 'PE';
				datosCliente.Departamento = DataFicha.Departamento;
				datosCliente.Provincia 	= DataFicha.Provincia;
				datosCliente.Distrito 	= DataFicha.Distrito;
				datosCliente.TipoDir 	= DataFicha.TipoDir;
				datosCliente.NombreCalle= DataFicha.NombreCalle;
				datosCliente.NroCalle 	= DataFicha.NroCalle;
				datosCliente.OtrosCalle = DataFicha.OtrosCalle;
				datosCliente.EjecutivoCuentas 		= $userData.dni;
				datosCliente.NombreEjecutivoCuentas 	= $userData.name;
				datosCliente.CodMoneda 		= 'PEN';
				datosCliente.NombreMoneda 	= 'Nuevos Soles PEN';
				datosCliente.IdClienteProv = DataFicha.DocCliente;
				datosCliente.lat = DataFicha.lat;
				datosCliente.lng = DataFicha.lng;
				datosCliente.tags = DataFicha.IdFichaInsp;
				await clienteModel.create( datosCliente ).catch(function (err) {
					$response.estado = 'ERROR';
					$response.error  = err.original.sqlMessage;
					res.json( $response );
				});
			}
			// Set ID cliente creado o no!
			$response.IdCliente = DataFicha.DocCliente;
			// -
			var _dataClienteNew = await clienteModel.findOne({
				where : { 
					uu_id : DataFicha.uu_id 
				}
			});
			if( _dataClienteNew ){
				// Local/es
				var IdLocal = Servicio.IdLocal;
				var dataPreLocal = await localFichaInpecModel.findOne({
					where : {
						id : IdLocal
					}
				});
				if( dataPreLocal ){
					if( dataPreLocal.Origen == 'Nuevo' ){
						var insertLocal = {};
						var IdSucursal = await sucursalModel.max('IdSucursal') + 1;
						insertLocal.IdSucursal 	= IdSucursal;
						insertLocal.uu_id 			= await renovarToken();
						insertLocal.IdClienteProv 	= dataPreLocal.IdClienteProv;
						insertLocal.nombre_cliente 	= dataPreLocal.Razon;
						insertLocal.Descripcion 	= dataPreLocal.NombreLocal;
						insertLocal.Direccion		= dataPreLocal.Direccion;
						insertLocal.Contacto	= dataPreLocal.Contacto;
						insertLocal.IdUbigeo	= dataPreLocal.Distrito;
						insertLocal.Pais		= 'PE';
						insertLocal.Departamento= dataPreLocal.Departamento;
						insertLocal.Provincia	= dataPreLocal.Provincia;
						insertLocal.Distrito	= dataPreLocal.Distrito;
						insertLocal.TipoDir		= dataPreLocal.TipoDir;
						insertLocal.NombreCalle	= dataPreLocal.NombreCalle;
						insertLocal.NroCalle	= dataPreLocal.NroCalle;
						insertLocal.OtrosCalle	= dataPreLocal.OtrosCalle;
						insertLocal.Urbanizacion= dataPreLocal.Distrito;
						insertLocal.MontoImplementos 		= 0;
						insertLocal.MontoIndumentarias 		= 0;
						insertLocal.MontoLineaInstitucional = 0;
						insertLocal.MontoMax 		= 0;
						insertLocal.UsuarioModOSA	= $userData.dni;
						insertLocal.FechaModOSA		= moment().format('YYYY-MM-DD HH:mm:ss');
						insertLocal.lat				= dataPreLocal.lat;
						insertLocal.lng				= dataPreLocal.lng;
						await sucursalModel.crate( insertLocal ).catch(function (err) {
							$response.estado = 'ERROR';
							$response.error  = err.original.sqlMessage;
							res.json( $response );
						});
						var LocalCreado = await sucursalModel.findOne({
							where : {
								uu_id : insertLocal.uu_id
							}
						});
						if( LocalCreado ){
							// Marcar el ID del local en el local
							await localFichaInpecModel.update({
								IdLocalOrigin : LocalCreado.IdSucursal
							},{
								where : {
									id : IdLocal
								}
							});
							// Actualizar Nro locales en cliente
							const NroLocales = await sucursalModel.count({
								where: {
									IdClienteProv : DataFicha.DocCliente
								}
							});
							await clienteModel.upate({
								locales : NroLocales
							},{
								where : {
									IdClienteProv : DataFicha.DocCliente
								}
							});
							// Set ID local creado o no!
							$response.IdLocal = LocalCreado.IdSucursal;
							// -
						}
					}
				}
			}else{
				// Set ID local creado o no!
				$response.IdLocal = Servicio.IdLocal;
				// -
			}
			
			// se erminó de veritifcar cliente y local
			// Enviar Emilio
			if( DataFicha )
			{
				var $body = MailHtml.body_FichaInspec( $userData , DataFicha , Servicio );
				clientMail.transmissions.send({
					content: {
						from    : {
							name : 'Robot de Orquesta',
							email : 'robot@ssays-orquesta.com'
						},
						subject : `Ficha inspección #${IdFicha} para su atención`,
						html    : $body
					},
					recipients: [
					  {address: 'ddelacruz@ssays-orquesta.com' }
					]
				  })
				  .then(data => {
					console.log('Woohoo! You just sent your first mailing!')
					console.log(data)
				  })
				  .catch(err => {
					console.log('Whoops! Something went wrong')
					console.log(err)
				});
			}
			
		
		}
			

	}

    res.json( $response );
});
// -------------------------------------------------------


//////////////////////////////////////////////////////////
//    OBTENER DATA DE LA FICHA Y DEL LOCAL,SERVICIO     //
//////////////////////////////////////////////////////////
router.post('/data_ficha', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.cliente 	= [];
	$response.local 	= [];
	$response.servicio 	= [];
	$response.ficha 	= [];

    $response.data = await claseProdModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
    
    res.json( $response );
});
// ---------------------------------------


//////////////////////////////////////////////////////////
//              BUSCAR FICHAS DE INSPECCIÓN             //
//////////////////////////////////////////////////////////
router.post('/buscar', async (req,res)=>{
    // Ids, inicio, fin, cliente

	var $response = {};
    $response.estado = 'OK';
	
    if( req.body.Ids )
    {
        // buscamos por ids de ficha
        var $textos = req.body.Ids;
        var $arIds = $textos.split(',');

        $response.data = await fichaInspeccionModel.findAll({
            where : {
                idFichaInspeccion : $arIds
            },
            order: [
                ['idFichaInspeccion', 'DESC']
            ]
        });
    }else{
        //
        var $where = {};
		const { Op } = require("sequelize");

        $where.FechaMod = { [Op.gte ]: req.body.inicio,[Op.lte ]: req.body.fin };
        if( req.body.cliente )
        {
            $where.DocCliente = req.body.cliente;
        }
        //
        $response.data = await fichaInspeccionModel.findAll({
            where : $where,
            order: [
                ['idFichaInspeccion', 'DESC']
            ]
        });
    }

 

    res.json($response);
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//         GUARDAR FICHA DE INSPECCIÓN INICIAL          //
//////////////////////////////////////////////////////////
router.post('/' , [
    check('TipoCliente' ,'Indique si el cliente existe').not().isEmpty(),
    check('TipoDocumento' ,'Indique el tipo de documento').not().isEmpty(),
    check('NomCliente' ,'Indique el nombre del cliente').not().isEmpty(),
    check('DocCliente' ,'Indique número de documento del cliente').not().isEmpty(),
    check('NomSolicitante' ,'Indique el nombre del solicitante').not().isEmpty(),
	check('FormaContactoInicial' ,'Indique cómo contactó el cliente').not().isEmpty(),
	check('Glosa' ,'Indicar motivo').not().isEmpty(),
	check('FechaHoraContacto' ,'Indicar fecha hora contacto').not().isEmpty(),
], async (req,res)=>{
	
	console.log("guardar");
	console.log(req.body);
    var $response = {};
    $response.estado = 'OK';

    const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
    }
	
    // Auditoria
    req.body.FechaMod = moment().format('YYYY-MM-DD HH:mm:ss');
    if( req.body.RepComercial != '' )
    {
        //
    }

    var $IdFicha = await fichaInspeccionModel.max( 'idFichaInspeccion' )+1;
	req.body.idFichaInspeccion = $IdFicha;
	var _Codigo = await pad_with_zeroes( $IdFicha , 5 );
	_Codigo = 'FI'+_Codigo;
	req.body.Codigo = _Codigo;
	
	if( req.body.idGiro == '' ){
		req.body.idGiro = 0;
	}
	await fichaInspeccionModel.create(req.body)
	.then(( result ) => {
		//logger.info('Successfully established connection to database')
		$response.data = result;
		//console.log(result);
	})
	.catch((err) => {
		//esrcribeError( err );
		console.log(result);
	});
	

    var _dataGuardado = await fichaInspeccionModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });
	if( _dataGuardado ){
        var _Codigo = await pad_with_zeroes( _dataGuardado.id , 5 );
        _Codigo = 'FI'+_Codigo;
        await fichaInspeccionModel.update({
            Codigo : _Codigo
        },{
            where  : {
                uu_id : req.body.uu_id
            }
        });
    }
	_dataGuardado = await fichaInspeccionModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });
	$response.data = _dataGuardado;

    // Enviar correo¿?
    if( req.body.RepComercial != null )
    {
        // LINK BITLY
        var $urlDestino = process.env.URL_TECNICO+'/ficha/inspeccion/'+$IdFicha, $urlUso = '';
        try{
            //$response.url_bitly = await bitly.shorten($url);
            //console.log( $response.url_bitly );
            await bitly
            .shorten($urlDestino)
            .then(function(result) {
                //console.log(result);
                $urlUso = ''+result.link;
            })
            .catch(function(error) {
                console.error(error);
            });
        }catch( error ){
            console.log(error);
        }
        // Obtener datos del usuario
        var $dataUser = await User.findOne({
            where : {
                dni : req.body.RepComercial
            }
        });
        // Obtener datos de la ficha
        var $dataFicha = await fichaInspeccionModel.findOne({
            where : {
                idFichaInspeccion : $IdFicha
            }
        });
        // Enviar Emilio
        if( $dataUser && $dataFicha )
        {
            var $body = getBody_RepComercial_Ficha( $dataUser,$dataFicha , $urlUso );
            clientMail.transmissions.send({
                content: {
                  from    : {
					  name : 'Robot de Orquesta',
					  email : 'robot@ssays-orquesta.com'
				  },
                  subject : `Ficha inspección #${$IdFicha} asignada`,
                  html    : $body
                },
                recipients: [
                  {address: $dataUser.email }
                ]
              })
              .then(data => {
                console.log('Woohoo! You just sent your first mailing!')
                console.log(data)
              })
              .catch(err => {
                console.log('Whoops! Something went wrong')
                console.log(err)
			});
        }
    }
    

	res.json($response);
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//              CARGAR FICHA DE INSPECCION              //
//////////////////////////////////////////////////////////
router.post('/get', async (req,res)=>{
    // id 
	//console.log("Ficha inspección")
    var $response = {};
    $response.estado = 'OK';
    $response.encontrado = 'NO';
    $response.departamento = [];
    $response.provincia = [];
    $response.distrito = [];
	//console.log(req.body);
    $response.data = await fichaInspeccionModel.findOne({
        where : {
            idFichaInspeccion : req.body.id
        }
    });
    
    if( $response.data )
    {
        var $rs = $response.data;
        $response.encontrado = 'SI';
        // Departamentos
        $response.departamento = await departamentoModel.findAll({
            order : [
                [ 'name' , 'ASC' ]
            ]
        });
        // Provincias
        if( $rs.Provincia != undefined )
        {
            $response.provincia = await provinciaModel.findAll({
                order : [
                    [ 'name' , 'ASC' ]
                ],
                where : {
                    department_id : $rs.Departamento
                }
            });
        }
        // Distritos
        if( $rs.Distrito != undefined )
        {
            $response.distrito = await distrito2Model.findAll({
                order : [
                    [ 'name' , 'ASC' ]
                ],
                where : {
                    province_id : $rs.Provincia
                }
            });
        }
    }
    
    res.json($response);
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//         UPDATE FICHA DE INSPECCIÓN INICIAL          	//
//////////////////////////////////////////////////////////
/**
router.put('/:filmID', async (req,res)=>{

    var $response = {};
    $response.estado = 'OK';

	await fichaInspeccionModel.update(req.body,{
		where : { idFichaInspeccion : req.params.filmID }
    });
    
    $response.data = await fichaInspeccionModel.findOne({
        where : {
            idFichaInspeccion : req.params.filmID
        }
    });
    
    res.json($response);
});
/**/

//////////////////////////////////////////////////////////
//         UPDATE FICHA DE INSPECCIÓN FINAL          	//
//////////////////////////////////////////////////////////
//check('Departamento' ,'Departamento es obligatorio').not().isEmpty(),
//check('Provincia' ,'Provincia es obligatorio').not().isEmpty(),
//check('Distrito' ,'Distrito es obligatorio').not().isEmpty(),
//check('NombreCalle' ,'Nombre de calle es obligatorio').not().isEmpty(),
//check('NroCalle' ,'Número de calle es obligatorio').not().isEmpty(),
router.put('/:filmID', [
    check('TipoCliente' ,'Indique si el cliente existe').not().isEmpty(),
    check('TipoDocumento' ,'Indique el tipo de documento').not().isEmpty(),
    check('NomCliente' ,'Indique el nombre del cliente').not().isEmpty(),
    check('DocCliente' ,'Indique número de documento del cliente').not().isEmpty(),
    check('NomSolicitante' ,'Indique el nombre del solicitante').not().isEmpty(),
    check('FormaContactoInicial' ,'Indique cómo contactó el cliente').not().isEmpty(),
	check('idGiro' ,'Ingrese un giro').not().isEmpty(),
	check('Glosa' ,'Indicar motivo').not().isEmpty(),
	check('FechaHoraContacto' ,'Indicar fecha hora contacto').not().isEmpty(),
] ,async (req,res)=>{

    const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
    }

    var $response = {};
    $response.estado = 'OK';

    //console.log('Giro=>'+req.body.idGiro);
    if( isNaN( req.body.idGiro ) )
    {
        delete req.body.idGiro;
    }

	await fichaInspeccionModel.update(req.body,{
		where : { idFichaInspeccion : req.params.filmID }
    });

    var $IdFicha = req.params.filmID;
    // Enviar correo¿?
    if( req.body.RepComercial != null )
    {
        // LINK BITLY
        var $urlDestino = process.env.URL_TECNICO+'/ficha/inspeccion/'+$IdFicha, $urlUso = '';
        //console.log( $urlDestino );
        try{
            //$response.url_bitly = await bitly.shorten($url);
            //console.log( $response.url_bitly );
            await bitly
            .shorten($urlDestino)
            .then(function(result) {
                //console.log(result);
                $urlUso = ''+result.link;
            })
            .catch(function(error) {
                console.error(error);
            });
        }catch( error ){
            console.log(error);
        }
        // Obtener datos del usuario
        var $dataUser = await User.findOne({
            where : {
                dni : req.body.RepComercial
            }
        });
        // Obtener datos de la ficha
        var $dataFicha = await fichaInspeccionModel.findOne({
            where : {
                idFichaInspeccion : $IdFicha
            }
        });
        // Enviar Emilio
        if( $dataUser && $dataFicha )
        {
            var $body = getBody_RepComercial_Ficha( $dataUser,$dataFicha , $urlUso );
            clientMail.transmissions.send({
                content: {
                  from    : {
                      name : 'Robot de Orquesta',
                      email : 'robot@ssays-orquesta.com'
                  },
                  subject : `Ficha inspección #${$IdFicha} asigada`,
                  html    : $body
                },
                recipients: [
                  {address: $dataUser.email }
                ]
              })
              .then(data => {
                console.log('Woohoo! You just sent your first mailing!')
                console.log(data)
              })
              .catch(err => {
                console.log('Whoops! Something went wrong')
                console.log(err)
              });
        }
    }
    
    $response.data = await fichaInspeccionModel.findOne({
        where : {
            idFichaInspeccion : req.params.filmID
        }
    });
    
    res.json($response);
});

//////////////////////////////////////////////////////////
//         ACEPTAR FICHA DE INSPECCIÓN INICIAL          //
//////////////////////////////////////////////////////////

router.post('/aceptar_ficha', async (req,res)=>{
    // id
    var $response = {};
    $response.estado = 'OK';

	const film = await fichaInspeccionModel.update({
        Estado : 'Digitado'
    },{
        where : {
            idFichaInspeccion : req.body.id
        }
    });
    
    res.json($response);
});

// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			LISTA PRODUCTOS       				//
//////////////////////////////////////////////////////////
router.post('/lista_productos' ,async (req,res)=>{
	// productos
	var $response = {}, $where = {};
    $response.estado = 'OK';
	var $userData = await getUserData( req.headers['api-token'] );
	var $ArrProductos = [ 7210,702,705,3469,8142,5094,7796,3195,8880,5269,5270,7085,7086,8947,4306,7463 ];

	req.body.UsuarioMod = $userData.name;
	$where.IdProducto = { [Op.in ]: $ArrProductos };

    $response.data = await productosModel.findAll({
        where : $where
    });

	res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
// 					GET LISTA PRODUCTOS       			//
//////////////////////////////////////////////////////////
router.post('/get_lista_productos' ,async (req,res)=>{
	// IdFicha
	var $response = {}, $where = {};
    $response.estado = 'OK';
	var $userData = await getUserData( req.headers['api-token'] );
	var $ArrProductos = [ 7210,702,705,3469,8142,5094,7796,3195,8880,5269,5270,7085,7086,8947,4306,7463 ];

	req.body.UsuarioMod = $userData.name;
	//$where.IdProducto = { [Op.in ]: $ArrProductos };

    $response.data = await serviciosLocalFicInpecModel.findAll({
        where : {
			IdFichaInspeccion : req.body.IdFicha,
			Tipo : 'Producto'
		}
    });

	res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//    OBTENER DATA DE LA FICHA Y DEL LOCAL,SERVICIO     //
//////////////////////////////////////////////////////////
router.post('/importar', async (req,res)=>{
    // Vamos a devolver los datos de la ficha de inspección para importarlos en la OS
	// IdFicha , IdServ, IdLocal
    var $response 		= {};
    $response.estado 	= 'OK';
	$response.encontrado= 'NO';
    $response.data 		= [];
	$response.local 	= [];
	$response.servicio 	= [];
	$response.form 		= [];
	$response.pte 		= [];
	$response.facturacion = [];
	$response.certificado = [];

    var _Entidad = await fichaInspeccionModel.findOne({
        where : {
            idFichaInspeccion : req.body.IdFicha
        }
    });
	$response.data = _Entidad;
	if( _Entidad )
	{
		$response.encontrado= 'SI';
		// Local
		var LocalData = await localFichaInpecModel.findOne({
			where : {
				id : req.body.IdLocal
			}
		});
		$response.local = LocalData;
		// Formulario servicio
		var Servicios = await serviciosLocalFicInpecModel.findOne({
			where : {
				id : req.body.IdServ
			}
		});
		$response.servicio = Servicios;
		// PTE
		var PTE = await pteFichaInspModel.findOne({
			where : {
				IdFichaInspeccion : req.body.IdFicha ,
				Estado : 'Activo'
			}
		});
		$response.pte = PTE;
		// Facturacion
		var Facturacion = await fichaInspFactModel.findOne({
			where : {
				idFichaInspeccion : req.body.IdFicha
			}
		});
		$response.facturacion = Facturacion;
		// Certificado
		var Certificado = await fichaInspCertModel.findOne({
			where : {
				idFichaInspeccion : req.body.IdFicha
			}
		});
		$response.certificado = Certificado;
	}
    
    res.json( $response );
});
// ---------------------------------------


// Borrar !!!!
router.delete('/:filmID', async (req,res)=>{
	await Film.destroy({
		where : {id:req.params.filmID}
	});
	res.json({success:'se ha borrado la pelicula'});
});


//////////////////////////////////////////////////////////
//     EVNAR CORREO REP COMERCIAL ASIGNADO A FICHA      //
//////////////////////////////////////////////////////////
function getBody_RepComercial_Ficha( $DataUser,$dataFicha , $link )
{
    /**
    var $body = `<p>
        Hola ${$DataUser.name}<br/><br/>Se asignó una ficha de inspección para usted como representante comercial para el cliente
        <strong>${$dataFicha.NomCliente}</strong>,con contacto <i>${$dataFicha.NomSolicitante}</i><br/><br/>
        Solicita lo siguiente:<br/>${$dataFicha.Glosa}
        <br/><br/>Para aceptar la ficha y revisar los datos de la misma ingrese al siguiente link: ${$link}
        <br/><br/>Gracias por su atención.
    </p>`;
    /**/
    var $body = `
    <!doctype html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
	<head>
		<!-- NAME: GDPR SUBSCRIBER ALERT -->
		<!--[if gte mso 15]>
		<xml>
			<o:OfficeDocumentSettings>
			<o:AllowPNG/>
			<o:PixelsPerInch>96</o:PixelsPerInch>
			</o:OfficeDocumentSettings>
		</xml>
		<![endif]-->
		<meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
		<title>Ficha de inspección asignada #${$dataFicha.idFichaInspeccion}</title>
        
    <style type="text/css">
		p{
			margin:10px 0;
			padding:0;
		}
		table{
			border-collapse:collapse;
		}
		h1,h2,h3,h4,h5,h6{
			display:block;
			margin:0;
			padding:0;
		}
		img,a img{
			border:0;
			height:auto;
			outline:none;
			text-decoration:none;
		}
		body,#bodyTable,#bodyCell{
			height:100%;
			margin:0;
			padding:0;
			width:100%;
		}
		.mcnPreviewText{
			display:none !important;
		}
		#outlook a{
			padding:0;
		}
		img{
			-ms-interpolation-mode:bicubic;
		}
		table{
			mso-table-lspace:0pt;
			mso-table-rspace:0pt;
		}
		.ReadMsgBody{
			width:100%;
		}
		.ExternalClass{
			width:100%;
		}
		p,a,li,td,blockquote{
			mso-line-height-rule:exactly;
		}
		a[href^=tel],a[href^=sms]{
			color:inherit;
			cursor:default;
			text-decoration:none;
		}
		p,a,li,td,body,table,blockquote{
			-ms-text-size-adjust:100%;
			-webkit-text-size-adjust:100%;
		}
		.ExternalClass,.ExternalClass p,.ExternalClass td,.ExternalClass div,.ExternalClass span,.ExternalClass font{
			line-height:100%;
		}
		a[x-apple-data-detectors]{
			color:inherit !important;
			text-decoration:none !important;
			font-size:inherit !important;
			font-family:inherit !important;
			font-weight:inherit !important;
			line-height:inherit !important;
		}
		.templateContainer{
			max-width:600px !important;
		}
		a.mcnButton{
			display:block;
		}
		.mcnImage,.mcnRetinaImage{
			vertical-align:bottom;
		}
		.mcnTextContent{
			word-break:break-word;
		}
		.mcnTextContent img{
			height:auto !important;
		}
		.mcnDividerBlock{
			table-layout:fixed !important;
		}
	/*
	@tab Page
	@section Heading 1
	@style heading 1
	*/
		h1{
			/*@editable*/color:#222222;
			/*@editable*/font-family:Helvetica;
			/*@editable*/font-size:40px;
			/*@editable*/font-style:normal;
			/*@editable*/font-weight:bold;
			/*@editable*/line-height:150%;
			/*@editable*/letter-spacing:normal;
			/*@editable*/text-align:center;
		}
	/*
	@tab Page
	@section Heading 2
	@style heading 2
	*/
		h2{
			/*@editable*/color:#222222;
			/*@editable*/font-family:Helvetica;
			/*@editable*/font-size:34px;
			/*@editable*/font-style:normal;
			/*@editable*/font-weight:bold;
			/*@editable*/line-height:150%;
			/*@editable*/letter-spacing:normal;
			/*@editable*/text-align:left;
		}
	/*
	@tab Page
	@section Heading 3
	@style heading 3
	*/
		h3{
			/*@editable*/color:#444444;
			/*@editable*/font-family:Helvetica;
			/*@editable*/font-size:22px;
			/*@editable*/font-style:normal;
			/*@editable*/font-weight:bold;
			/*@editable*/line-height:150%;
			/*@editable*/letter-spacing:normal;
			/*@editable*/text-align:left;
		}
	/*
	@tab Page
	@section Heading 4
	@style heading 4
	*/
		h4{
			/*@editable*/color:#999999;
			/*@editable*/font-family:Georgia;
			/*@editable*/font-size:20px;
			/*@editable*/font-style:italic;
			/*@editable*/font-weight:normal;
			/*@editable*/line-height:125%;
			/*@editable*/letter-spacing:normal;
			/*@editable*/text-align:left;
		}
	/*
	@tab Header
	@section Header Container Style
	*/
		#templateHeader{
			/*@editable*/background-color:#F2F2F2;
			/*@editable*/background-image:none;
			/*@editable*/background-repeat:no-repeat;
			/*@editable*/background-position:center;
			/*@editable*/background-size:cover;
			/*@editable*/border-top:0;
			/*@editable*/border-bottom:0;
			/*@editable*/padding-top:36px;
			/*@editable*/padding-bottom:0;
		}
	/*
	@tab Header
	@section Header Interior Style
	*/
		.headerContainer{
			/*@editable*/background-color:#FFFFFF;
			/*@editable*/background-image:none;
			/*@editable*/background-repeat:no-repeat;
			/*@editable*/background-position:center;
			/*@editable*/background-size:cover;
			/*@editable*/border-top:0;
			/*@editable*/border-bottom:0;
			/*@editable*/padding-top:45px;
			/*@editable*/padding-bottom:45px;
		}
	/*
	@tab Header
	@section Header Text
	*/
		.headerContainer .mcnTextContent,.headerContainer .mcnTextContent p{
			/*@editable*/color:#808080;
			/*@editable*/font-family:Helvetica;
			/*@editable*/font-size:16px;
			/*@editable*/line-height:150%;
			/*@editable*/text-align:left;
		}
	/*
	@tab Header
	@section Header Link
	*/
		.headerContainer .mcnTextContent a,.headerContainer .mcnTextContent p a{
			/*@editable*/color:#007E9E;
			/*@editable*/font-weight:normal;
			/*@editable*/text-decoration:underline;
		}
	/*
	@tab Body
	@section Body Container Style
	*/
		#templateBody{
			/*@editable*/background-color:#F2F2F2;
			/*@editable*/background-image:none;
			/*@editable*/background-repeat:no-repeat;
			/*@editable*/background-position:center;
			/*@editable*/background-size:cover;
			/*@editable*/border-top:0;
			/*@editable*/border-bottom:0;
			/*@editable*/padding-top:0;
			/*@editable*/padding-bottom:0;
		}
	/*
	@tab Body
	@section Body Interior Style
	*/
		.bodyContainer{
			/*@editable*/background-color:#FFFFFF;
			/*@editable*/background-image:none;
			/*@editable*/background-repeat:no-repeat;
			/*@editable*/background-position:center;
			/*@editable*/background-size:cover;
			/*@editable*/border-top:0;
			/*@editable*/border-bottom:0;
			/*@editable*/padding-top:0;
			/*@editable*/padding-bottom:45px;
		}
	/*
	@tab Body
	@section Body Text
	*/
		.bodyContainer .mcnTextContent,.bodyContainer .mcnTextContent p{
			/*@editable*/color:#808080;
			/*@editable*/font-family:Helvetica;
			/*@editable*/font-size:16px;
			/*@editable*/line-height:150%;
			/*@editable*/text-align:left;
		}
	/*
	@tab Body
	@section Body Link
	*/
		.bodyContainer .mcnTextContent a,.bodyContainer .mcnTextContent p a{
			/*@editable*/color:#007E9E;
			/*@editable*/font-weight:normal;
			/*@editable*/text-decoration:underline;
		}
	/*
	@tab Footer
	@section Footer Style
	*/
		#templateFooter{
			/*@editable*/background-color:#F2F2F2;
			/*@editable*/background-image:none;
			/*@editable*/background-repeat:no-repeat;
			/*@editable*/background-position:center;
			/*@editable*/background-size:cover;
			/*@editable*/border-top:0;
			/*@editable*/border-bottom:0;
			/*@editable*/padding-top:0;
			/*@editable*/padding-bottom:36px;
		}
	/*
	@tab Footer
	@section Footer Interior Style
	*/
		.footerContainer{
			/*@editable*/background-color:#333333;
			/*@editable*/background-image:none;
			/*@editable*/background-repeat:no-repeat;
			/*@editable*/background-position:center;
			/*@editable*/background-size:cover;
			/*@editable*/border-top:0;
			/*@editable*/border-bottom:0;
			/*@editable*/padding-top:45px;
			/*@editable*/padding-bottom:45px;
		}
	/*
	@tab Footer
	@section Footer Text
	*/
		.footerContainer .mcnTextContent,.footerContainer .mcnTextContent p{
			/*@editable*/color:#FFFFFF;
			/*@editable*/font-family:Helvetica;
			/*@editable*/font-size:12px;
			/*@editable*/line-height:150%;
			/*@editable*/text-align:center;
		}
	/*
	@tab Footer
	@section Footer Link
	*/
		.footerContainer .mcnTextContent a,.footerContainer .mcnTextContent p a{
			/*@editable*/color:#FFFFFF;
			/*@editable*/font-weight:normal;
			/*@editable*/text-decoration:underline;
		}
	@media only screen and (min-width:768px){
		.templateContainer{
			width:600px !important;
		}

}	@media only screen and (max-width: 480px){
		body,table,td,p,a,li,blockquote{
			-webkit-text-size-adjust:none !important;
		}

}	@media only screen and (max-width: 480px){
		body{
			width:100% !important;
			min-width:100% !important;
		}

}	@media only screen and (max-width: 480px){
		.mcnRetinaImage{
			max-width:100% !important;
		}

}	@media only screen and (max-width: 480px){
		.mcnImage{
			width:100% !important;
		}

}	@media only screen and (max-width: 480px){
		.mcnCartContainer,.mcnCaptionTopContent,.mcnRecContentContainer,.mcnCaptionBottomContent,.mcnTextContentContainer,.mcnBoxedTextContentContainer,.mcnImageGroupContentContainer,.mcnCaptionLeftTextContentContainer,.mcnCaptionRightTextContentContainer,.mcnCaptionLeftImageContentContainer,.mcnCaptionRightImageContentContainer,.mcnImageCardLeftTextContentContainer,.mcnImageCardRightTextContentContainer,.mcnImageCardLeftImageContentContainer,.mcnImageCardRightImageContentContainer{
			max-width:100% !important;
			width:100% !important;
		}

}	@media only screen and (max-width: 480px){
		.mcnBoxedTextContentContainer{
			min-width:100% !important;
		}

}	@media only screen and (max-width: 480px){
		.mcnImageGroupContent{
			padding:9px !important;
		}

}	@media only screen and (max-width: 480px){
		.mcnCaptionLeftContentOuter .mcnTextContent,.mcnCaptionRightContentOuter .mcnTextContent{
			padding-top:9px !important;
		}

}	@media only screen and (max-width: 480px){
		.mcnImageCardTopImageContent,.mcnCaptionBottomContent:last-child .mcnCaptionBottomImageContent,.mcnCaptionBlockInner .mcnCaptionTopContent:last-child .mcnTextContent{
			padding-top:18px !important;
		}

}	@media only screen and (max-width: 480px){
		.mcnImageCardBottomImageContent{
			padding-bottom:9px !important;
		}

}	@media only screen and (max-width: 480px){
		.mcnImageGroupBlockInner{
			padding-top:0 !important;
			padding-bottom:0 !important;
		}

}	@media only screen and (max-width: 480px){
		.mcnImageGroupBlockOuter{
			padding-top:9px !important;
			padding-bottom:9px !important;
		}

}	@media only screen and (max-width: 480px){
		.mcnTextContent,.mcnBoxedTextContentColumn{
			padding-right:18px !important;
			padding-left:18px !important;
		}

}	@media only screen and (max-width: 480px){
		.mcnImageCardLeftImageContent,.mcnImageCardRightImageContent{
			padding-right:18px !important;
			padding-bottom:0 !important;
			padding-left:18px !important;
		}

}	@media only screen and (max-width: 480px){
		.mcpreview-image-uploader{
			display:none !important;
			width:100% !important;
		}

}	@media only screen and (max-width: 480px){
	/*
	@tab Mobile Styles
	@section Heading 1
	@tip Make the first-level headings larger in size for better readability on small screens.
	*/
		h1{
			/*@editable*/font-size:30px !important;
			/*@editable*/line-height:125% !important;
		}

}	@media only screen and (max-width: 480px){
	/*
	@tab Mobile Styles
	@section Heading 2
	@tip Make the second-level headings larger in size for better readability on small screens.
	*/
		h2{
			/*@editable*/font-size:26px !important;
			/*@editable*/line-height:125% !important;
		}

}	@media only screen and (max-width: 480px){
	/*
	@tab Mobile Styles
	@section Heading 3
	@tip Make the third-level headings larger in size for better readability on small screens.
	*/
		h3{
			/*@editable*/font-size:20px !important;
			/*@editable*/line-height:150% !important;
		}

}	@media only screen and (max-width: 480px){
	/*
	@tab Mobile Styles
	@section Heading 4
	@tip Make the fourth-level headings larger in size for better readability on small screens.
	*/
		h4{
			/*@editable*/font-size:18px !important;
			/*@editable*/line-height:150% !important;
		}

}	@media only screen and (max-width: 480px){
	/*
	@tab Mobile Styles
	@section Boxed Text
	@tip Make the boxed text larger in size for better readability on small screens. We recommend a font size of at least 16px.
	*/
		.mcnBoxedTextContentContainer .mcnTextContent,.mcnBoxedTextContentContainer .mcnTextContent p{
			/*@editable*/font-size:14px !important;
			/*@editable*/line-height:150% !important;
		}

}	@media only screen and (max-width: 480px){
	/*
	@tab Mobile Styles
	@section Header Text
	@tip Make the header text larger in size for better readability on small screens.
	*/
		.headerContainer .mcnTextContent,.headerContainer .mcnTextContent p{
			/*@editable*/font-size:16px !important;
			/*@editable*/line-height:150% !important;
		}

}	@media only screen and (max-width: 480px){
	/*
	@tab Mobile Styles
	@section Body Text
	@tip Make the body text larger in size for better readability on small screens. We recommend a font size of at least 16px.
	*/
		.bodyContainer .mcnTextContent,.bodyContainer .mcnTextContent p{
			/*@editable*/font-size:16px !important;
			/*@editable*/line-height:150% !important;
		}

}	@media only screen and (max-width: 480px){
	/*
	@tab Mobile Styles
	@section Footer Text
	@tip Make the footer content text larger in size for better readability on small screens.
	*/
		.footerContainer .mcnTextContent,.footerContainer .mcnTextContent p{
			/*@editable*/font-size:14px !important;
			/*@editable*/line-height:150% !important;
		}

}</style></head>
    <body>
		<!--*|IF:MC_PREVIEW_TEXT|*-->
            <!--[if !gte mso 9]>
            <!---->
            <span class="mcnPreviewText" style="display:none; font-size:0px; line-height:0px; max-height:0px; max-width:0px; opacity:0; overflow:hidden; visibility:hidden; mso-hide:all;">
            Hola ${$DataUser.name}, Se asignó una ficha de inspección para usted como representante comercial para el cliente ${$dataFicha.NomCliente}, con contacto ${$dataFicha.NomSolicitante}.
            </span>
            <!--<![endif]-->
		<!--*|END:IF|*-->
        <center>
            <table align="center" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable">
                <tr>
                    <td align="center" valign="top" id="bodyCell">
                        <!-- BEGIN TEMPLATE // -->
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
							<tr>
								<td align="center" valign="top" id="templateHeader">
									<!--[if (gte mso 9)|(IE)]>
									<table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;">
									<tr>
									<td align="center" valign="top" width="600" style="width:600px;">
									<![endif]-->
									<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer">
										<tr>
                                			<td valign="top" class="headerContainer"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnImageBlock" style="min-width:100%;">
    <tbody class="mcnImageBlockOuter">
            <tr>
                <td valign="top" style="padding:9px" class="mcnImageBlockInner">
                    <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" class="mcnImageContentContainer" style="min-width:100%;">
                        <tbody><tr>
                            <td class="mcnImageContent" valign="top" style="padding-right: 9px; padding-left: 9px; padding-top: 0; padding-bottom: 0; text-align:center;">
                                
                                    
                                <img align="center" alt="" src="https://api2.ssays-orquesta.com/logo-ssays-2019-2.png" width="196" style="max-width:196px; padding-bottom: 0; display: inline !important; vertical-align: bottom;" class="mcnImage">
                                    
                                
                            </td>
                        </tr>
                    </tbody></table>
                </td>
            </tr>
    </tbody>
</table></td>
										</tr>
									</table>
									<!--[if (gte mso 9)|(IE)]>
									</td>
									</tr>
									</table>
									<![endif]-->
								</td>
                            </tr>
							<tr>
								<td align="center" valign="top" id="templateBody">
									<!--[if (gte mso 9)|(IE)]>
									<table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;">
									<tr>
									<td align="center" valign="top" width="600" style="width:600px;">
									<![endif]-->
									<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer">
										<tr>
                                			<td valign="top" class="bodyContainer"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;">
    <tbody class="mcnTextBlockOuter">
        <tr>
            <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
              	<!--[if mso]>
				<table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
				<tr>
				<![endif]-->
			    
				<!--[if mso]>
				<td valign="top" width="600" style="width:600px;">
				<![endif]-->
                <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
                    <tbody><tr>
                        
                        <td valign="top" class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;">
                            <h3>Hola ${$DataUser.name}</h3><br>
                            <p>
                                Se asignó una ficha de inspección para usted como representante comercial para el cliente
                                <strong>${$dataFicha.NomCliente}</strong>,con contacto <i>${$dataFicha.NomSolicitante}</i><br/><br/>
                                Solicita lo siguiente:<br/>${$dataFicha.Glosa}
                                <br/><br/>Gracias por su atención.
                            </p>
                        </td>
                    </tr>
                </tbody></table>
				<!--[if mso]>
				</td>
				<![endif]-->
                
				<!--[if mso]>
				</tr>
				</table>
				<![endif]-->
            </td>
        </tr>
    </tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnDividerBlock" style="min-width:100%;">
    <tbody class="mcnDividerBlockOuter">
        <tr>
            <td class="mcnDividerBlockInner" style="min-width: 100%; padding: 9px 18px 0px;">
                <table class="mcnDividerContent" border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;">
                    <tbody><tr>
                        <td>
                            <span></span>
                        </td>
                    </tr>
                </tbody></table>
<!--            
                <td class="mcnDividerBlockInner" style="padding: 18px;">
                <hr class="mcnDividerContent" style="border-bottom-color:none; border-left-color:none; border-right-color:none; border-bottom-width:0; border-left-width:0; border-right-width:0; margin-top:0; margin-right:0; margin-bottom:0; margin-left:0;" />
-->
            </td>
        </tr>
    </tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnButtonBlock" style="min-width:100%;">
    <tbody class="mcnButtonBlockOuter">
        <tr>
            <td style="padding-top:0; padding-right:18px; padding-bottom:18px; padding-left:18px;" valign="top" align="center" class="mcnButtonBlockInner">
                <table border="0" cellpadding="0" cellspacing="0" class="mcnButtonContentContainer" style="border-collapse: separate !important;border-radius: 3px;background-color: #00ADD8;">
                    <tbody>
                        <tr>
                            <td align="center" valign="middle" class="mcnButtonContent" style="font-family: Helvetica; font-size: 18px; padding: 18px;">
                                <a class="mcnButton " title="Update Settings" href="${$link}" target="_self" style="font-weight: bold;letter-spacing: -0.5px;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;">Revisar ficha</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    </tbody>
</table></td>
										</tr>
									</table>
									<!--[if (gte mso 9)|(IE)]>
									</td>
									</tr>
									</table>
									<![endif]-->
								</td>
                            </tr>
                            <tr>
								<td align="center" valign="top" id="templateFooter">
									<!--[if (gte mso 9)|(IE)]>
									<table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;">
									<tr>
									<td align="center" valign="top" width="600" style="width:600px;">
									<![endif]-->
									<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer">
										<tr>
                                			<td valign="top" class="footerContainer"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;">
    <tbody class="mcnTextBlockOuter">
        <tr>
            <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
              	<!--[if mso]>
				<table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
				<tr>
				<![endif]-->
			    
				<!--[if mso]>
				<td valign="top" width="600" style="width:600px;">
				<![endif]-->
                <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
                    <tbody><tr>
                        
                        <td valign="top" class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;">
                        
                            <em>Copyright © 2020 SSAYS SAC, All rights reserved.</em>
<br>


                        </td>
                    </tr>
                </tbody></table>
				<!--[if mso]>
				</td>
				<![endif]-->
                
				<!--[if mso]>
				</tr>
				</table>
				<![endif]-->
            </td>
        </tr>
    </tbody>
</table></td>
										</tr>
									</table>
									<!--[if (gte mso 9)|(IE)]>
									</td>
									</tr>
									</table>
									<![endif]-->
								</td>
                            </tr>
                        </table>
                        <!-- // END TEMPLATE -->
                    </td>
                </tr>
            </table>
        </center>
    </body>
</html>

    `;
    return $body
}
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
// -------------------------------------------------------
async function esrcribeError( error )
{
    var $file = './assets/errores/log.txt';
    try {
        if (fs.existsSync( $file ) ) {
            await fs.appendFile( $file , error , function (err) {
                if (err) throw err;
                console.log('Se agregó un error');
            });
        }else{
            await fs.writeFile( $file , error , function (err) {
                if (err) throw err;
                console.log('Se escribió un error');
            });
        }
    } catch(err) {
        console.error(err)
    }
        
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
// -------------------------------------------------------
// -------------------------------------------------------

module.exports = router;