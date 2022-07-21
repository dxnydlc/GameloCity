// api_logLogin

const router = require('express').Router();

const { logLoginModel, User } = require('../../db');

const { Op } = require("sequelize");

// ------------------------------------------------
// Validar Ip
router.get('/validar_ip/:ip',async(req,res)=>{

    var $response       = {};
    $response.estado    = 'OK';
    $response.encontrado = 'NO';
    $response.data      = [];
	var $where          = {};

	var $equipoIP = await logLoginModel.findOne({
        where : { 
			equipo : { [Op.like ] : `%${req.params.ip}%` }  
		}
    });
    if( $equipoIP )
    {
		$response.encontrado = 'SI';
		$response.data 		 = $equipoIP;
    }
	res.json( $response );
});

// ------------------------------------------------

//////////////////////////////////////////////////////////
//      			OBTENER ULTIMOS 100     			//
//////////////////////////////////////////////////////////
router.get('/',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await logLoginModel.findAll({
        order : [
            ['id' , 'DESC']
        ],
		limit : 200
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//          			BUSCAR CLASE            		//
//////////////////////////////////////////////////////////
router.post('/buscar', async (req,res)=>{
    // dni, inicio, fin, modulo, agrupar
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $where = {};

    if( req.body.dni != '' ){
        // Buscamos por ID
        $where.dni = req.body.dni;
        //
    }
	$where.created_at = { [Op.gte ]: req.body.inicio+' 00:00:01',[Op.lte ]: req.body.fin+' 23:59:59' };
	// Buscamos por nombre
	if( req.body.modulo != '' ){
		$where.modulo = req.body.modulo;
	}

	// Agrupar¿?
	if( req.body.agrupar != '' ){
		$response.data = await logLoginModel.findAll({
			order : [
				['id' , 'DESC']
			],
			where : $where ,
			group : req.body.agrupar
		});
	}else{
		$response.data = await logLoginModel.findAll({
			order : [
				['id' , 'DESC']
			],
			where : $where
		});
	}

    
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

    $response.data = await logLoginModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                      UPDATE IP                       //
//////////////////////////////////////////////////////////
router.post('/actualiza', async (req,res)=>{
    // uuid, ip
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    $response.data = await logLoginModel.update({
        equipo : req.body.ip
    },{
        where : {
            uu_id : req.body.uuid
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
// ------------------------------------------------

module.exports = router;
