// api_accidentes.js

const router = require('express').Router();

const { responsableModel,User,archiGoogleModel } = require('../../db');

const {check,validationResult} = require('express-validator');


//////////////////////////////////////////////////////////
//      			OBTENER ULTIMOS 100     			//
//////////////////////////////////////////////////////////
router.get('/:token',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );
    //console.log(req.params.token);
	$response.data = await responsableModel.findAll({
        where : {
            Estado : 'Activo',
            Token : req.params.token
        },
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
    
	$response.data = await responsableModel.findAll({
        where : {
            Estado : 'Activo'
        },
        order : [
            ['id' , 'DESC']
        ],
        limit : 200
    });
    //console.log($response);
    //console.log("hola");
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////
//          CREAR  RESPONSABLE          //
//////////////////////////////////////////
router.post('/', [
    check('IdRsp' ,'Selecciona un responsable').not().isEmpty()
] ,async (req,res)=>{

	const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}
	
	var $response    = {};
    $response.estado = 'OK';
    $response.data   = {};
    var $userData    = await getUserData( req.headers['api-token'] );

    //req.body.CreadoPor = $userData.name;
    req.body.Estado = "Activo";
    console.log(req.body);
    
    await responsableModel.create(req.body)
    .catch(function (err) {
        
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });

    var _dataGuardado = await responsableModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });
    //console.log(_dataGuardado);
    if( _dataGuardado ){
        var _Codigo = await pad_with_zeroes( _dataGuardado.id , 5 );
        _Codigo = 'R'+_Codigo;
        await responsableModel.update({
            Codigo : _Codigo
        },{
            where  : {
                uu_id : req.body.uu_id
            }
        })
        .catch(function (err) {
            captueError( err.original , req.body );
            //console.log(_NombreDoc);
            $response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
        });
    }

    $response.item = await responsableModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });
    
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

    $response.data = await responsableModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
    
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
    check('IdRsp' ,'Seleccione un responsable').not().isEmpty()
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
/*
    // Auditoria
    delete req.body.CreadoPor;
    delete req.body.AnuladoPor;
    req.body.ModificadoPor = $userData.name;
*/
    var IdRsp = parseInt( req.body.IdRsp );
    if( isNaN( IdRsp ) ){
        req.body.IdRsp = 0;
    }
    //console.log(req.body.id);
    delete req.body.id;
    //console.log(req.body);
	await responsableModel.update(req.body,{
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
    await responsableModel.findOne({
        where : {
            uu_id : req.params.uuid
        }
    })
    .then(function(item){
        $response.item = item;
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

    // Auditoria
    //delete req.body.CreadoPor;
    //delete req.body.ModificadoPor;
    //req.body.anulado_por = $userData.name;
/*
    req.body.DNIAnulado = $userData.dni;
    req.body.AnuladoPor = $userData.name;
    
    console.log(req.body.DNIAnulado);
    $anuladoPor = $userData.name;
*/
  
	await responsableModel.update({
        Estado      : 'Anulado',
       // AnuladoPor  : $anuladoPor
    },{
		where : { 
            uu_id : req.params.uuid
        }
    });

    // obtener los datos
    $response.item = await responsableModel.findOne({
        where : { 
            uu_id : req.params.uuid
        }
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
function pad_with_zeroes( number , length )
{
    var my_string = '' + number;
    while (my_string.length < length) {
        my_string = '0' + my_string;
    }
    return my_string;
}

module.exports = router;