// api_resultadoEmo.js

const router = require('express').Router();

const { resultadoEmoModel,User, archiGoogleModel } = require('../../db');

const {check,validationResult} = require('express-validator');

const { Op } = require("sequelize");

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
resultadoEmoModel.belongsTo(archiGoogleModel,{
	as : 'DetEMO001', foreignKey 	: 'id_archivo',targetKey: 'id',
});
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//////////////////////////////////////////////////////////
//      			OBTENER ULTIMOS 100     			//
//////////////////////////////////////////////////////////
router.get('/:uuid',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await resultadoEmoModel.findAll({
        where : {
            id_empresa : req.params.uuid
        }
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			BUSCAR RESULTADO       			//
//////////////////////////////////////////////////////////
router.post('/buscar', async (req,res)=>{
    // dni, inicio, fin, nombre, clinica
	
	var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $userData = await getUserData( req.headers['api-token'] );

    if( req.body.dni != '' )
    {
        //
        var $arOSs = [];
		var $IdOSs = req.body.dni;
		$arOSs = $IdOSs.split(',');
		const dataOS = await resultadoEmoModel.findAll({
			order: [
				[ 'usuario' , 'DESC']
			],
			where : {
				dni : $arOSs
			},
            include: [{
                model   : archiGoogleModel,
                as      : 'DetEMO001'
            }]
		});
		$response.data = dataOS;
        //
    }else{
        //
        // buscar por otros parametros...
		var $where = {};
        $where.emision = { [Op.gte ]: req.body.inicio,[Op.lte ]: req.body.fin };
		
		// Nombres
		if( req.body.nombre != '' ){
			$where.usuario = { [Op.like] : '%'+req.body.nombre+'%' };
		}
		// clinica
		if( req.body.clinica != '' ){
			$where.clinica = { [Op.like] : '%'+req.body.clinica+'%' };
		}

		const dataOS = await resultadoEmoModel.findAll({
			order: [
				[ 'usuario' , 'DESC' ]
			],
			where : $where ,
            include: [{
                model   : archiGoogleModel,
                as      : 'DetEMO001'
            }]
		});
		$response.data = dataOS;
        //
    }

	res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			AGREGAR RESULTADO       			//
//////////////////////////////////////////////////////////
router.post('/', [
    check('nombre' ,'El nombre es obligatorio').not().isEmpty(),
    check('dni' ,'El DNI es obligatorio').not().isEmpty(),
] ,async (req,res)=>{

	const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}
	
	var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );

    req.body.creado_por = $userData.name;
    $response.data = await resultadoEmoModel.create(req.body);
    $response.data = await resultadoEmoModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });

	res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////
//          CARGAR RESULTADO            //
//////////////////////////////////////////
router.post('/get_data', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    $response.data = await resultadoEmoModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
    
    res.json( $response );
});
// ---------------------------------------

//////////////////////////////////////////
//       ACTUALIZAR RESULTADO            //
//////////////////////////////////////////
router.put('/:uuid', [
    check('usuario' ,'El nombre es obligatorio').not().isEmpty(),
    check('dni' ,'El DNI es obligatorio').not().isEmpty(),
], async (req,res)=>{

    const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
    }
    
    var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );
    $response.data = [];

    // Auditoria
    delete req.body.creado_por;
    delete req.body.anulado_por;
    req.body.editado_por = $userData.name;

	await resultadoEmoModel.update(req.body,{
		where : { 
            uu_id : req.params.uuid 
        }
    });
    $response.data = await resultadoEmoModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////
//       ELIMINAR RESULTADO            //
//////////////////////////////////////////
router.delete('/:uuid', async (req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $userData = await getUserData( req.headers['api-token'] );

    // Auditoria

	await resultadoEmoModel.destroy({
		where : { 
            uu_id : req.params.uuid 
        }
    });
    var $dataEntidad = await resultadoEmoModel.findOne({
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