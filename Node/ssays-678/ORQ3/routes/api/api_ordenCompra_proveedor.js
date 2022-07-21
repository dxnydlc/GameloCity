// api_ordenCompra_proveedor.js

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
//const { ordenCompraModal, User, utbClienteModel } = require('../../db');
const { ordenCompraModal, User, utbClienteModel } = require('../../db31');


// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


//////////////////////////////////////////////////////////
//      			OBTENER ULTIMOS 100     			//
//////////////////////////////////////////////////////////
router.get('/',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await ordenCompraModal.findAll({
        order : [
            ['IdPedCompraCab' , 'DESC']
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
    // IdClienteProv
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.proveedor = [];
    $response.reporte = [];
    var $where = {};
    
    if( req.body.IdClienteProv ){
        // Buscamos por IdClienteProv
        $where.IdClienteProv = req.body.IdClienteProv;
        $where.Estado      = {[Op.in]:['Aprobado', 'revisado']}
        
        
        $response.proveedor = await ordenCompraModal.findAll({
           
            where : $where
        });

        var leng = $response.proveedor.length;
        for( $i = 0; $i < $response.proveedor.length; $i++ )
        {
            if($i == 0){
                fecha_inicial = $response.proveedor[$i].Fecha;
                idProveedor = $response.proveedor[$i].IdClienteProv;
                proveedor = $response.proveedor[$i].proveedor;

            }
            if($i < leng){
                fecha_fin = $response.proveedor[$i].Fecha;

                
            }
          
        }
        
        //console.log(idProveedor+','+fecha_inicial+','+proveedor+','+fecha_fin);
        $response.reporte.push(idProveedor+','+fecha_inicial+','+proveedor+','+fecha_fin);
        
    }
    
    res.json( $response );
});

// -------------------------------------------------------
//////////////////////////////////////////////////////////////
//		SELECT PARA PROVEEDORES [ RAZON SOCIAL ]			//
//////////////////////////////////////////////////////////////
router.get('/proovs2_select2',async(req,res)=>{

    var $response = {};
	$response.estado = 'OK';
	$response.results = [];
    var $where = {};
	const { Op } = require("sequelize");
	var $number = req.query.q;
	$where.Estado = 1;
 
	var $select = [
		['IdClienteProv','id'] , 
		[ 'Razon' , 'text' ] ,
		'Razon','IdClienteProv'
	];
	if( isNaN( $number ) )
	{
		// Buscar por texto
		$where.Razon = { [Op.like ] : '%'+req.query.q+'%' };
	}
	else
	{
		// BUscar por DNI
		$where.IdClienteProv = req.query.q;
	}

    $response.results = await utbClienteModel.findAll({
        attributes : $select,
        where : $where
    });

	res.json( $response );
});


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


module.exports = router;