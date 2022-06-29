// api_EnvioBoletas.js

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
const { dineroModel,User } = require('../../db');



//////////////////////////////////////////////////////////
//                  BUSCAR EN DOCUMENTO                 //
//////////////////////////////////////////////////////////
router.post('/pendientes/rendir', async (req,res)=>{
    // Descripcion, Codigo, Estado
    var $response = {};
    $response.estado = 'OK';
    $response.count = 0;
    $response.encontrado = "NO";
    $response.data = [];
    var $where = {};
    var $userData = await getUserData( req.headers['api-token'] );

        $where.Atendido = 1;
        $where.Rendido  = { [Op.is] : null }
        $where.Fecha    = { [Op.gte]: '2020-02-03' }
        $where.Estado   = { [Op.ne] : 'Anulado' };
        $where.Solicitante = $userData.dni;
        //$where.Solicitante = $userData.dni;
      
    $response.data = await dineroModel.findAll({
        order : [
            ['Fecha' , 'DESC']
        ],
        where : $where
    });
    if( $response.data.length > 0 )
    {
        $response.encontrado = 'SI'
        $response.count = $response.data.length;
    }
   
    res.json( $response );
});
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
function pad_with_zeroes( number , length )
{
    var my_string = '' + number;
    while (my_string.length < length) {
        my_string = '0' + my_string;
    }
    return my_string;
}
// -------------------------------------------------------


module.exports = router;