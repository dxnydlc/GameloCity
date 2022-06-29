// api_bitacoraSuper.js

var _NombreDoc = 'api_bitacoraSuper';
const router = require('express').Router();
const {check,validationResult} = require('express-validator');
const { Op } = require("sequelize");

const dotenv = require('dotenv');
dotenv.config();
// >>>>>>>>>>>>>    SPARKPOST   >>>>>>>>>>>>>
const SparkPost = require('sparkpost')
const clientMail    = new SparkPost(process.env.SPARKPOST_SECRET)
// >>>>>>>>>>>>>    MOMENT      >>>>>>>>>>>>>
var moment = require('moment-timezone');
moment().tz("America/Lima").format();
// moment().format('YYYY-MM-DD HH:mm:ss');
// >>>>>>>>>>>>>    NEXMO       >>>>>>>>>>>>>
const Nexmo         = require('nexmo');
const BitlyClient   = require('bitly').BitlyClient;
const bitly         = new BitlyClient(process.env.BITLY_API);

// Modelos
const { errorLogModel } = require('../../dbA');
const { bitacoraSuperModel, User, archiGoogleModel,sucursalModel, apoyoDataModel, bitacoraBloqueModel, bitacoraAreaModel, bitacoraTrabajoModel, bitacoraDetalleModel } = require('../../db');



// -------------------------------------------------------
async function tblBitacora01( _where , _limit  )
{
    //
    var _dataResp = [];
    var _NOmbre = `Cliente`;
    var _editItem = [ sequelize.fn('CONCAT' , '<button data-id="', sequelize.col('id') , '" data-uuid="', sequelize.col('uu_id') ,'" data-nombre="', sequelize.col(_NOmbre) ,'" type="button" class=" docEdit btn btn-block btn-primary btn-xs"><i class="fa fa-edit" ></i></button>') , 'Editar' ];
    var _DelItem =  [ sequelize.fn('CONCAT' , '<button data-id="', sequelize.col('id') , '" data-uuid="', sequelize.col('uu_id') ,'" data-nombre="', sequelize.col(_NOmbre) ,'" type="button" class=" docDelete btn btn-block btn-danger btn-xs"><i class="fa fa-close" ></i></button>') , 'Anular' ];

    var _atributos = [
        _editItem,
        _DelItem,
        'Codigo',
        'Cliente',
        'Local',
        [ sequelize.fn('DATE_FORMAT' ,sequelize.col('Fecha') , _fechaONlyLatFormat ) , 'Fecha'], 
        'Estado',
        [ sequelize.fn('DATE_FORMAT' ,sequelize.col('updated_at') , _fechaLatFormat ) , 'Modificado'], 
    ];
    //
    _dataResp = await bitacoraTrabajoModel.findAll({
        attributes : _atributos ,
        order : [
            ['Codigo' , 'DESC']
        ],
        where : _where,
        limit : _limit
    });
    return _dataResp;
    //
}
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			OBTENER ULTIMOS 100     			//
//////////////////////////////////////////////////////////
router.get('/',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await bitacoraSuperModel.findAll({
        order : [
            ['Codigo' , 'DESC']
        ],
        limit : 200
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  BUSCAR EN DOCUMENTO                 //
//////////////////////////////////////////////////////////
router.post('/buscar', async (req,res)=>{
    //
    // Inicio, Fin, IdCliente, IdLocal, IdSuper, Id(,)
    //
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $where = {};

    if( req.body.Id != '' ){
        // Buscamos por ID
        $where.Codigo = req.body.Id;
        //
        $response.data = await bitacoraSuperModel.findAll({
            order : [
                ['Codigo' , 'DESC']
            ],
            where : $where
        });
        //
    }else{
        // Buscamos por fecha.
        $where.Fecha = { [Op.gte ]: req.body.Inicio,[Op.lte ]: req.body.Fin };
        // Id Cliente
        if( req.body.IdCliente )
		{
			$where.IdCliente = req.body.IdCliente;
		}
        // Id Local
        if( req.body.IdLocal )
		{
			$where.IdLocal = req.body.IdLocal;
		}
        // Id Supervisor
        if( req.body.IdSuper )
		{
			$where.IdSupervisor = req.body.IdSuper;
		}
        //
        $response.data = await bitacoraSuperModel.findAll({
            order : [
                ['Codigo' , 'DESC']
            ],
            where : $where
        });
    }

    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  BUSCAR EN DOCUMENTO                 //
//////////////////////////////////////////////////////////
router.post('/reporte01', async (req,res)=>{
    //
    // Inicio, Fin, IdCliente, IdLocal, IdSuper, Id(,)
    // IdBloque, IdArea, IdTrabajo
    //
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $where = {};
    var _DataBita = {}, _dataFin = [];
    $response.escala = [];

    $where.Estado =  { [Op.in] : ['Activo','Aprobado'] };

    if( req.body.Id != '' ){
        // Buscamos por ID
        $where.Codigo = req.body.Id;
        //
        _DataBita = await bitacoraSuperModel.findAll({
            order : [
                ['Codigo' , 'DESC']
            ],
            where : $where
        });
        //
    }else{
        // Buscamos por fecha.
        $where.Fecha = { [Op.gte ]: req.body.Inicio,[Op.lte ]: req.body.Fin };
        // Id Cliente
        if( req.body.IdCliente )
		{
			$where.IdCliente = req.body.IdCliente;
		}
        // Id Local
        if( req.body.IdLocal )
		{
			$where.IdLocal = req.body.IdLocal;
		}
        // Id Supervisor
        if( req.body.IdSuper )
		{
			$where.IdSupervisor = req.body.IdSuper;
		}
        // IdBloque
        if( req.body.IdBloque )
		{
			//$where.IdBloque = req.body.IdBloque;
		}
        // IdArea
        if( req.body.IdArea )
		{
			//$where.IdAreaBloque = req.body.IdArea;
		}
        // IdTrabajo
        if( req.body.IdTrabajo )
		{
			//$where.IdTrabajo = req.body.IdTrabajo;
		}
        //
        // Bloques de esta consulta >>>>>>>>>>>>>>>>>
        _DataBloques = await bitacoraSuperModel.findAll({
            attributes : ['IdBloque', 'Bloque'],
            order : [
                ['Codigo' , 'ASC']
            ],
            where : $where ,
            group : 'IdBloque'
        });
        $response.bloques = _DataBloques;
        var _Areasd = [];
        // Escalar
        var _whereG = $where;
        var _whereAreas = $where;
        var _whereTraba = $where;
        // kkkkkkkkkkkkkkkkkkkkkkk
        var _Bloque = [], _arBloque = [];
        var _dataBloque = [];
        // kkkkkkkkkkkkkkkkkkkkkkk
        
        if( _DataBloques )
        {
            //
            for (let index = 0; index < _DataBloques.length; index++)
            {
                
                //
                var _arArea = [], _arTrabajo = [];
                //
                _dataBloque = _DataBloques[index];
                // ((??))
                delete _whereAreas.IdBloque;
                delete _whereAreas.IdAreaBloque;
                _whereAreas.IdBloque = _dataBloque.IdBloque;
                varDump( _whereAreas );
                var _AreasBloque = await bitacoraSuperModel.findAll({
                    order : [
                        ['Codigo' , 'ASC']
                    ],
                    // where : { IdBloque : _dataBloque.IdBloque },
                    where : _whereAreas,
                    group : 'IdAreaBloque'
                });
                varDump(`>>>>>>>>>>>Hay ${_AreasBloque.length} areas en este bloque: ${_dataBloque.IdBloque}`);
                //
                // Ahora traeremos los trabajos realizados por cada una de estas areas
                var _rsArea = [];
                for (let _iArea = 0; _iArea < _AreasBloque.length; _iArea++)
                {
                    _rsArea = _AreasBloque[ _iArea ];
                    // ((??))
                    _whereTraba.IdAreaBloque = _rsArea.IdAreaBloque;
                    varDump(`Area: ${_rsArea.AreaBloque}`);
                    var _dataTrabajo = await bitacoraSuperModel.findAll({
                        order : [
                            ['Codigo' , 'ASC']
                        ],
                        where : _whereTraba
                    });
                    if( _dataTrabajo )
                    {
                        for (let iTrab = 0; iTrab < _dataTrabajo.length; iTrab++)
                        {
                            const _rsTrab = _dataTrabajo[ iTrab ];
                            varDump(`Trabajo: ${_rsTrab.Trabajo}`);
                            // Files 
                            var _Files = await archiGoogleModel.findAll({
                                where : {
                                    formulario  : 'BITACORA_SUPER',
                                    correlativo : _rsTrab.id,
                                    Cod003 : _rsTrab.IdTrabajo
                                }
                            });
                            varDump(`Este trabajo tiene ${_Files.length} archivos.`);
                            _arTrabajo.push( { 'trabajo' : _rsTrab , 'files' : _Files } );
                        }
                    }
                    _arArea.push( {'area' : _rsArea , 'trabajo' : _arTrabajo } );
                }// For Area
                
                //
                // Escalando la data
                _arBloque.push({ 'bloque' : _dataBloque , 'area' : _arArea });
            }
            
        }
        $response.escala = _arBloque;
        // ********************************************
        // ********************************************
        // ********************************************
    }
    //

    //
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			    OBTENER LISTA     			    //
//////////////////////////////////////////////////////////
router.get('/lista',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await bitacoraSuperModel.findAll({
        where : {
            Estado : 'Activo'
        },
        order : [
            ['Codigo' , 'DESC']
        ],
        limit : 100
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			AGREGAR DOCUMENTO       			//
//////////////////////////////////////////////////////////
router.post('/', [
    check('Fecha' ,'Ingrese Fecha.').not().isEmpty(),
    check('IdCliente' ,'Seleccione Cliente.').not().isEmpty(),
    check('IdLocal' ,'Seleccione Sucursal cliente.').not().isEmpty(),
] ,async (req,res)=>{

	const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}
	
	var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );

    req.body.IdSupervisor = $userData.dni;
    req.body.Supervisor   = $userData.name;
    var _arFecha = [], _Fecha = req.body.Fecha;
    _arFecha = _Fecha.split('-');
    req.body.Anio = _arFecha[0];
    req.body.Mes  = _arFecha[1];

    await bitacoraSuperModel.create(req.body)
    .catch(function (err) {
        console.log(_NombreDoc);
        captueError( err.original , req.body );
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });
    var _dataGuardado = await bitacoraSuperModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });
    if( _dataGuardado )
    {
        var _Codigo = await pad_with_zeroes( _dataGuardado.id , 8 );
        _Codigo = 'BS'+_Codigo;
        await bitacoraSuperModel.update({
            Codigo : _Codigo
        },{
            where  : {
                uu_id : req.body.uu_id
            }
        })
        .catch(function (err) {
            captueError( err.original , req.body );
            console.log(_NombreDoc);
            $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
        });
        // Unir con archivos.
        await archiGoogleModel.update({
            correlativo : _dataGuardado.id ,
            Cod001 : req.body.IdBloque ,
            Cod002 : req.body.IdAreaBloque ,
            Cod003 : req.body.IdTrabajo 
        },{
            where : {
                formulario : 'BITACORA_SUPER',
                token : req.body.uu_id
            }
        });
        // Unir con detalle de Bitacora
        await bitacoraDetalleModel.update({
            CodigoHead : _Codigo
        },{
            where : {
                Token : req.body.uu_id
            }
        });
        // Unir archivos con detalle de bitacora
        await unirDetalle( _Codigo );
    }

        

    $response.item = await bitacoraSuperModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });

    escalarData( $response.item );

	res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  CARGAR DOCUMENTO                    //
//////////////////////////////////////////////////////////
router.post('/get_data', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.files = [];
    $response.locales = [];
    $response.subarea = [];

    $response.area = [];
    $response.trabajo = [];

    const _Entidad = await bitacoraSuperModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    })
    .catch(function (err) {
        captueError( err.original , req.body );
        console.log(_NombreDoc);
        $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
    });

    $response.data = _Entidad;

    if( _Entidad )
    {
        // Traer archivos
        $response.files = await archiGoogleModel.findAll({
            where : {
                formulario : 'BITACORA_SUPER',
                token : _Entidad.uu_id
            }
        });
        // Locales
        var Locales = await sucursalModel.findAll({
            where : {
                IdClienteProv : _Entidad.IdCliente,
                Estado : 1
            },
            order : [
                [ 'Descripcion' , 'ASC' ]
            ]
        });
        $response.locales = Locales;
        // Area
        var _Area = await apoyoDataModel.findAll({
            where: {
                Flag : 'AREA_DIV_DET',
                Codigo01 : _Entidad.IdBloque
            }
        });
        $response.area = _Area;
        // Trabajo
        var _Trabajo = await apoyoDataModel.findAll({
            where: {
                Flag : 'AREA_DIV_DET_3',
                Codigo02 : _Entidad.IdAreaBloque
            }
        });
        $response.trabajo = _Trabajo;
        // Apoyo data
        /*var _SubArea = await apoyoDataModel.findAll({
            where: {
                Flag : 'AREA_DIV_DET',
                Codigo01 : _Entidad.IdArea1
            }
        });
        $response.subarea = _SubArea;*/
    }
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  ACTUALIZAR DOCUMENTO                //
//////////////////////////////////////////////////////////
router.put('/:uuid', [
    check('Fecha' ,'Ingrese Fecha.').not().isEmpty(),
    check('IdCliente' ,'Seleccione Cliente.').not().isEmpty(),
    check('IdLocal' ,'Seleccione Sucursal cliente.').not().isEmpty(),
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

    var _arFecha = [], _Fecha = req.body.Fecha;
    _arFecha = _Fecha.split('-');
    req.body.Anio = _arFecha[0];
    req.body.Mes  = _arFecha[1];

    var _ID = req.body.id;
    delete req.body.id;

	await bitacoraSuperModel.update(req.body,{
		where : { 
            uu_id : req.params.uuid 
        }
    })
    .catch(function (err) {
        captueError( err.original , req.body );
	    console.log(_NombreDoc);
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });

    // Unir con archivos.
    await archiGoogleModel.update({
        correlativo : _ID ,
        Cod001 : req.body.IdBloque ,
        Cod002 : req.body.IdAreaBloque ,
        Cod003 : req.body.IdTrabajo 
    },{
        where : {
            formulario : 'BITACORA_SUPER',
            token : req.body.uu_id
        }
    });
    // Unir con detalle de Bitacora
    await bitacoraDetalleModel.update({
        CodigoHead : req.body.Codigo
    },{
        where : {
            Token : req.params.uuid 
        }
    });
    // Unir archivos con detalle de bitacora
    await unirDetalle( req.body.Codigo );
    
    $response.item = await bitacoraSuperModel.findOne({
        where : {
            uu_id : req.params.uuid
        }
    });

    escalarData( $response.item );

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  ELIMINAR DOCUMENTO                  //
//////////////////////////////////////////////////////////
router.delete('/:uuid', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $userData = await getUserData( req.headers['api-token'] );

    // Auditoria
    req.body.DNIAnulado = $userData.dni;
    req.body.AnuladoPor = $userData.name;

    $anuladoPor = $userData.name;

	await bitacoraSuperModel.update({
        Estado      : 'Anulado',
        DNIAnulado  : $userData.dni,
        AnuladoPor  : $userData.name,
    },{
		where : { 
            uu_id : req.params.uuid 
        }
    })
    .catch(function (err) {
        captueError( err.original , req.body );
        console.log(_NombreDoc);
        $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
    });
    
    $response.item = await bitacoraSuperModel.findOne({
        where : {
            uu_id : req.params.uuid
        }
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  APROBAR DOCUMENTO                   //
//////////////////////////////////////////////////////////
router.post('/aprobar', async (req,res)=>{
    // uuid
    var $response    = {};
    $response.estado = 'OK';
    $response.data   = [];
    $response.found  = ``;

    var _Entidad = await bitacoraSuperModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    })
    .catch(function (err) {
        captueError( err.original , req.body );
        console.log(_NombreDoc);
        $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
    });

    if( _Entidad.Estado == 'Activo' )
    {
        $response.found = 'SI';
        // Aprobar
        await bitacoraSuperModel.update({
            Estado : 'Aprobado'
        },{
            where : {
                uu_id : req.body.uuid
            }
        });
    }else{
        $response.found = 'NO';
    }

    _Entidad = await bitacoraSuperModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    })
    .catch(function (err) {
        captueError( err.original , req.body );
        console.log(_NombreDoc);
        $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
    });
    $response.data = _Entidad;
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  ANULAR DOCUMENTO                   //
//////////////////////////////////////////////////////////
router.post('/anular', async (req,res)=>{
    // uuid, Motivo
    var $response    = {};
    $response.estado = 'OK';
    $response.data   = [];
    $response.found  = ``;

    var _Entidad = await bitacoraSuperModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    })
    .catch(function (err) {
        captueError( err.original , req.body );
        console.log(_NombreDoc);
        $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
    });

    if( _Entidad.Estado != 'Anulado' )
    {
        $response.found = 'SI';
        // Aprobar
        await bitacoraSuperModel.update({
            Estado : 'Anulado' ,
            MotivoAnulado : req.body.Motivo
        },{
            where : {
                uu_id : req.body.uuid
            }
        });
    }else{
        $response.found = 'NO';
    }

    _Entidad = await bitacoraSuperModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    })
    .catch(function (err) {
        captueError( err.original , req.body );
        console.log(_NombreDoc);
        $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
    });
    $response.data = _Entidad;
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                CARGAR ARCHIVOS BY TOKEN              //
//////////////////////////////////////////////////////////
router.post('/files_by_token', async (req,res)=>{
    // Token
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    $response.data = await archiGoogleModel.findAll({
        where : {
            token : req.body.Token
        }
    })
    .catch(function (err) {
        captueError( err.original , req.body );
        console.log(_NombreDoc);
        $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
    });
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  CARGAR DOCUMENTO                    //
//////////////////////////////////////////////////////////
router.post('/reporte02', async (req,res)=>{
    // uuid
    // Inicio, Fin, IdCliente, IdLocal, IdSuper, Id(,)
    // IdBloque, IdArea, IdTrabajo
    //
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $where = {};
    var _DataBita = {}, _dataFin = [], _DataBloques = [];
    $response.escala = [];


    $where.Estado =  { [Op.in] : ['Activo','Aprobado'] };

    // Buscamos por fecha.
    $where.Fecha = { [Op.gte ]: req.body.Inicio,[Op.lte ]: req.body.Fin };
    // Id Cliente
    if( req.body.IdCliente )
    {
        $where.IdCliente = req.body.IdCliente;
    }
    // Id Local
    if( req.body.IdLocal )
    {
        $where.IdLocal = req.body.IdLocal;
    }
    // Id Supervisor
    if( req.body.IdSuper )
    {
        $where.IdSupervisor = req.body.IdSuper;
    }
    // IdBloque
    if( req.body.IdBloque )
    {
        $where.IdBloque = req.body.IdBloque;
    }
    // IdArea
    if( req.body.IdArea )
    {
        $where.IdAreaBloque = req.body.IdArea;
    }
    // IdTrabajo
    if( req.body.IdTrabajo )
    {
        $where.IdTrabajo = req.body.IdTrabajo;
    }
    //
    // Bloques de esta consulta >>>>>>>>>>>>>>>>>
    _DataBloques = await bitacoraSuperModel.findAll({
        attributes : ['IdBloque', 'Bloque','Codigo'],
        order : [
            ['Codigo' , 'ASC']
        ],
        where : $where ,
        // group : 'IdBloque'
    });
    
    var _arrBloques = [];
    if( _DataBloques )
    {
        var _Trabajo = [], _Area = [];
        var _arrCodigos = [];
        // devolvemo el Nro de Bloques encontrados aqui.
        for (let iBita = 0; iBita < _DataBloques.length; iBita++) {
            const _rsBita = _DataBloques[iBita];
            // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
            _arrCodigos.push( _rsBita.Codigo );
            // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        }
        varDump( _arrCodigos );
        // Ahora obtenemos los bloques
        var _dataBloques_J = await bitacoraBloqueModel.findAll({
            where : {
                IdBitacora : { [Op.in]: _arrCodigos }
            },
            group : 'IdBloque'
        });
        // Recorremos los bloques obtenidos
        for (let index = 0; index < _dataBloques_J.length; index++)
        {
            const rsBloque = _dataBloques_J[index];
            varDump(`>>>>>>>> Bloque => ${rsBloque.Bloque}`);
            // KKKKKKKKKKKKKKKKKKK Ahora obtenemos las AREAS de cada BLOQUE.  KKKKKKKKKKKKKKKKKKK
            var _dataBitArea = await bitacoraAreaModel.findAll({
                where : {
                    IdBitacora : { [Op.in]: _arrCodigos },
                    IdBloque : rsBloque.IdBloque
                },
                group : 'IdArea'
            });
            // 00000000000000 LIMPIAR ARREGLO 00000000000000
            _Area = [];
            for (let iArea = 0; iArea < _dataBitArea.length; iArea++)
            {
                const _rsArea  = _dataBitArea[iArea];
                var _dataAreaO = await bitacoraSuperModel.findOne({
                    where : { Codigo: _rsArea.IdBitacora }
                });
                varDump(`>>>>>>>> Bloque => ${rsBloque.Bloque}, Area => ${_rsArea.Area}.`);
                // KKKKKKKKKKKKKKKKKKK Ahora obtenemos los TRABAJOS de cada AREA.  KKKKKKKKKKKKKKKKKKK
                var _dataTrabajo = await bitacoraTrabajoModel.findAll({
                    where : {
                        IdBitacora : { [Op.in]: _arrCodigos },
                        IdArea : _rsArea.IdArea
                    }
                });
                // 00000000000000 LIMPIAR ARREGLO 00000000000000
                _Trabajo = [];
                for (let iTabaj = 0; iTabaj < _dataTrabajo.length; iTabaj++)
                {
                    const _rsTRabaj = _dataTrabajo[iTabaj];
                    var _dataTrabajos = await bitacoraSuperModel.findOne({
                        where : {
                            Codigo: _rsTRabaj.IdBitacora
                        }
                    });
                    var _IdBitacora = _rsTRabaj.IdBitacora;
                    var _IdBit = parseInt( _IdBitacora.replace( /^\D+/g, '') );
                    // Ahora los archivos asociados a este trabajo...
                    var _dataFiles = await archiGoogleModel.findAll({
                        where : {
                            formulario  : 'BITACORA_SUPER',
                            correlativo : _IdBit
                        }
                    });
                    _Trabajo.push({ 'trabajos' : _dataTrabajos , 'archivos' : _dataFiles });
                    varDump(`>>>>>>>> Bloque => ${rsBloque.Bloque}, Area => ${_rsArea.Area}, Tabajo => ${_rsTRabaj.Trabajo}, [${_IdBit}], con ${_dataFiles.length} archivos.`);
                }// For Trabajo
                _Area.push({ 'Area' : _dataAreaO , 'trabajo' : _Trabajo });
            }// For Areas
            _arrBloques.push({ 'bloque' : rsBloque , 'areas' : _Area });
        }// For Bloques
    }else{
        varDump(`No hay resultados en esta busqueda`);
    }

    $response.bloque = _arrBloques;
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  CARGAR DOCUMENTO                    //
//////////////////////////////////////////////////////////
async function unirDetalle( CodigoBitacora )
{
    //
    var Detalles = await bitacoraDetalleModel.findAll({
        where : {
            CodigoHead : CodigoBitacora
        }
    });
    for (let index = 0; index < Detalles.length; index++) {
        const rsD = Detalles[index];
        //
        var _NroFiles = await archiGoogleModel.count({
            where : {
                token : rsD.uu_id
            }
        });
        //
        varDump(` FFFFFFFFFFFFFFF ${rsD.Codigo} WWWWWWW ${rsD.id} RRRRRRRRRRRRR ${rsD.uu_id}. TIENE ${_NroFiles} archivos.`);
        //
        await archiGoogleModel.update(
        {
            Cod001 : rsD.Codigo ,
            correlativo : rsD.id
        },{
            where : {
                token : rsD.uu_id
            }
        }
        );
    }
    //
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
    var length = 40;
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
        attributes: ['id', 'uu_id','name', 'email','dni','api_token','id_empresa','empresa','celular','Iniciales'],
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
async function escalarData( dataBit )
{
    //
    // Borramos los datos anteiores
    await bitacoraBloqueModel.destroy({
        where : {
            Token_Bitacora : dataBit.uu_id
        }
    });
    await bitacoraAreaModel.destroy({
        where : {
            Token_Bitacora : dataBit.uu_id
        }
    });
    await bitacoraTrabajoModel.destroy({
        where : {
            Token_Bitacora : dataBit.uu_id
        }
    });
    // Generamos la union
    var _insertarG = {};
    _insertarG.uu_id     = await renovarToken();
    _insertarG.IdBloque = dataBit.IdBloque;
    _insertarG.Bloque   = dataBit.Bloque;
    _insertarG.IdBitacora       = dataBit.Codigo;
    _insertarG.Token_Bitacora   = dataBit.uu_id;
    var _dataInsert = await bitacoraBloqueModel.create( _insertarG );
    // ¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿
    _insertarG = {};
    _insertarG.uu_id     = await renovarToken();
    _insertarG.IdBitacora       = dataBit.Codigo;
    _insertarG.Token_Bitacora   = dataBit.uu_id;
    _insertarG.IdArea   = dataBit.IdAreaBloque;
    _insertarG.Area     = dataBit.AreaBloque;
    _insertarG.IdBloque = dataBit.IdBloque;
    _insertarG.Bloque   = dataBit.Bloque;
    _insertarG.IdSuperior = _dataInsert.id;
    // ¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿
    var _dataInsert = await bitacoraAreaModel.create( _insertarG );
    _insertarG = {};
    _insertarG.uu_id     = await renovarToken();
    _insertarG.IdTrabajo   = dataBit.IdTrabajo;
    _insertarG.Trabajo     = dataBit.Trabajo;
    _insertarG.IdBitacora       = dataBit.Codigo;
    _insertarG.Token_Bitacora   = dataBit.uu_id;
    _insertarG.IdArea   = dataBit.IdAreaBloque;
    _insertarG.Area     = dataBit.AreaBloque;
    _insertarG.IdSuperior = _dataInsert.id;
    await bitacoraTrabajoModel.create( _insertarG );
    // ¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿
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

module.exports = router;