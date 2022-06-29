// api_accidentes.js

const router = require('express').Router();

// Modelos
const { accidenteModel,User,puestoIsoModel,sucursalModel,archiGoogleModel } = require('../../db');
const { errorLogModel } = require('../../dbA');

const {check,validationResult} = require('express-validator');


//////////////////////////////////////////////////////////
//      			OBTENER ULTIMOS 100     			//
//////////////////////////////////////////////////////////
router.get('/',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );
  
	$response.data = await accidenteModel.findAll({
        order : [
            ['id' , 'DESC']
        ],
        limit : 200
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			OBTENER LISTA     			//
//////////////////////////////////////////////////////////
router.get('/lista',async(req,res)=>{
    var $response    = {};
    $response.estado = 'OK';
    $response.data   = [];
    $response.ut     = await getUserData( req.headers['api-token'] );

	$response.data = await accidenteModel.findAll({
        where : {
            Estado : 'Activo'
        },
        order : [
            ['id' , 'DESC']
        ],
        limit : 200
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////
//          CREAR  ACCIDENTES           //
//////////////////////////////////////////
router.post('/', [
    check('IdCliente' ,'Seleccione un cliente').not().isEmpty(),
    check('IdContratista' ,'Seleccione un contratista').not().isEmpty(),
    check('IdTrabajador' ,'Seleccione un trabajador').not().isEmpty()
] ,async (req,res)=>{

	const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}

	var $response    = {};
    $response.estado = 'OK';
    $response.data   = {};
    var $userData    = await getUserData( req.headers['api-token'] );

    if(! req.body.Fecha_inicio_investigacion ){
        delete req.body.Fecha_inicio_investigacion;
    }

    req.body.CreadoPor = $userData.name;
    await accidenteModel.create(req.body)
    .catch(function (err) {
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });
    $response.data = await accidenteModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    })
    .catch(function (err) {
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });
    // Marcando archivos 
    if( $response.data ){
        // Marcando archivos...
        await archiGoogleModel.update({
            correlativo : $response.data.id
        },{
            where  : {
                token   : $response.data.uu_id,
                modulo  : 'SST',
                formulario : 'ACCIDENTES'
            }
        })
        .catch(function (err) {
            $response.estado = 'ERROR';
            $response.error  = err.original.sqlMessage;
            res.json( $response );
        });
    }

	res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////
//          CARGAR ACCIDENTES           //
//////////////////////////////////////////
router.post('/get_data', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    $response.data = await accidenteModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
    /*
    if($response.data){
        $response.medidas = await medidasCorrectivasModel.findAll({
            where : {
                Token : req.body.uuid
            }
        });

        $response.responsable = await responsableModel.findAll({
            where : {
                Token : req.body.uuid
            }
        });
    }
    */
   console.log($response.data);
    res.json( $response );
});
/*
router.post('/get_data', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.puestos = [];
    $response.locales = [];
    $response.adjuntos = [];
    var Entidad = [];

    await accidenteModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    }).then(function(item){
        Entidad = item;
        console.log(Entidad);
    })
    .catch(function (err) {
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });
    if( Entidad )
    {
            // Archivos
            await archiGoogleModel.findAll({
                where : {
                    modulo : 'SST', formulario : 'ACCIDENTES', correlativo : Entidad.id
                }
            })
            .then(function(item){
                $response.adjuntos = item;
            })
            .catch(function (err) {
                $response.estado = 'ERROR';
                $response.error  = err.original.sqlMessage;
                res.json( $response );
            });
            // Puestos by Areas
            var Puestos = {};
            await puestoIsoModel.findAll({
                where : {
                    IdArea : Entidad.IdArea
                }
            })
            .then(function(item){
                Puestos = item;
            })
            .catch(function (err) {
                $response.estado = 'ERROR';
                $response.error  = err.original.sqlMessage;
                res.json( $response );
            });
            if( Puestos ){
                $response.puestos = Puestos;
            }
            // Locales by clientes
            var Locales = {};
            await sucursalModel.findAll({
                where : {
                    IdClienteProv : Entidad.IdCliente
                }
            })
            .then(function(item){
                Locales = item;
            })
            .catch(function (err) {
                $response.estado = 'ERROR';
                $response.error  = err.original.sqlMessage;
                res.json( $response );
            });
            if( Locales ){
                $response.locales = Locales;
            }
            $response.data = Entidad;
    }
    
    
    res.json( $response );
});
*/
// ---------------------------------------

//////////////////////////////////////////
//       ACTUALIZAR ACCIDENTES          //
//////////////////////////////////////////
router.put('/:uuid', [
    check('IdCliente' ,'Seleccione un cliente').not().isEmpty(),
    check('IdContratista' ,'Seleccione una empresa').not().isEmpty(),
    check('IdTrabajador' ,'Seleccione un trabajador').not().isEmpty()
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
    delete req.body.CreadoPor;
    delete req.body.AnuladoPor;
    req.body.ModificadoPor = $userData.name;

    var IdResponsable = parseInt( req.body.IdResponsable );
    if( isNaN( IdResponsable ) ){
        req.body.IdResponsable = 0;
    }

	await accidenteModel.update(req.body,{
		where : { 
            uu_id : req.params.uuid 
        }
    })
    .then(function(item){
        //
    })
    .catch(function (err) {
        // handle error;
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });
    await accidenteModel.findOne({
        where : {
            uu_id : req.params.uuid
        }
    })
    .then(function(item){
        $response.data = item;
    })
    .catch(function (err) {
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////
//       ELIMINAR ACCIDENTES            //
//////////////////////////////////////////
router.delete('/:uuid', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $userData = await getUserData( req.headers['api-token'] );

  
	await accidenteModel.update({
        Estado      : 'Anulado',
       // AnuladoPor  : $anuladoPor
    },{
		where : { 
            uu_id : req.params.uuid 
        }
    });

    // obtener los datos
    $response.item = await accidenteModel.findOne({
        order : [
            ['id' , 'DESC']
        ],
        limit : 200
    });

    res.json( $response );
});

// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                   BORRAR ADJUNTO                     //
//////////////////////////////////////////////////////////
router.post('/del_file', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    var _Editad = await archiGoogleModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    })
    .catch(function (err) {
        captueError( err.original , req.body );
        $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
    });

    if( _Editad ){
        await archiGoogleModel.destroy({
            where : {
                uu_id : req.body.uuid
            }
        });
    }
    // Listar los demas archivos
    $response.data = await archiGoogleModel.findAll({
        where : {
            token   : _Editad.token,
            modulo  : 'SST',
            formulario : 'ACCIDENTES'
        }
    });
    
    res.json( $response );
});
// -------------------------------------------------------


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