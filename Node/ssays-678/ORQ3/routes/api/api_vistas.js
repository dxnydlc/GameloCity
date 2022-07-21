// api_vistas.js

const router = require('express').Router();

const { claseProdModel,User } = require('../../db');

const {check,validationResult} = require('express-validator');

const { Op } = require("sequelize");

const dotenv = require('dotenv');
dotenv.config();

var URL_NODE = process.env.URL_NODE;

//////////////////////////////////////////////////////////
//      			VISTA PERSONAL OS        			//
//////////////////////////////////////////////////////////
router.get('/personal_os/:os/:tokenos/:token',async(req,res)=>{

    var _tokenNode = '', _os = req.params.os, tokenos = req.params.tokenos;
    if( req.params.token ){
        _tokenNode = req.params.token;
    }
    res.render('personalOS' , { 'tokenNode' : _tokenNode , 'URL_NODE' : URL_NODE , 'os' : _os , 'tokenos' : tokenos } );

});
// -------------------------------------------------------


//////////////////////////////////////////////////////////
//      			VISTA PRODUCTOS OS        			//
//////////////////////////////////////////////////////////
router.get('/producto_os/:os/:tokenos/:token',async(req,res)=>{

    var _tokenNode = '', _os = req.params.os, tokenos = req.params.tokenos;
    if( req.params.token ){
        _tokenNode = req.params.token;
    }
    res.render('productosOS' , { 'tokenNode' : _tokenNode , 'URL_NODE' : URL_NODE , 'os' : _os , 'tokenos' : tokenos } );

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


module.exports = router;