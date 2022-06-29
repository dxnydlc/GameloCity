//api_ot

const router = require('express').Router();

const { Film,otModel,personalOTModel,trabajoOTModel } = require('../../db');

const { Op } = require("sequelize");

otModel.hasMany( personalOTModel ,{
    as : 'Detalle', foreignKey 	: 'IdOT',targetKey: 'IdOT',
});

otModel.hasMany(
    trabajoOTModel,
    {
        targetKey: 'IdOT',
        foreignKey: 'IdOT',
        as : 'DetalleTrab'
    }
);

/**
personalOTModel.belongsTo( otModel ,{
    as : 'Detalle', foreignKey 	: 'IdOT',targetKey: 'IdOT',
});
/**/


//////////////////////////////////////////////////
//      			CLONAR OT       			//
//////////////////////////////////////////////////
router.post('/clonar', async (req,res)=>{

	var $response = {};
    $response.estado = 'OK';

    var preDatos = await otModel.findOne({
        where : {
            IdOT : req.body.IdOT
        }
    })
    .catch(function (err) {
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });
    //
    if( preDatos ){
        // Existe
        await otModel.update(req.body,{
            where : { 
                IdOT : req.body.IdOT 
            }
        })
        .catch(function (err) {
            $response.estado = 'ERROR';
            $response.error  = err.original.sqlMessage;
            res.json( $response );
        });
    }else{
        // Crear
        $response.data = await otModel.create(req.body)
        .catch(function (err) {
            $response.estado = 'ERROR';
            $response.error  = err.original.sqlMessage;
            res.json( $response );
        });
    }
    console.log(`OT #${req.body.IdOT} clonada correctamente...`);

	res.json( $response );
});
// -------------------------------------------------

// -------------------------------------------------
// Buscar OT
router.post('/get/data', async (req,res)=>{

    var $response = {};
	$response.estado = 'OK';
	$response.data = [];
    var $where = {};

    // Estado : 'Aprobado'
    $response.data = await otModel.findOne({
        where : {
            IdOT : req.body.IdReq
        },
        include: [{
            model: personalOTModel,
            as: 'Detalle'
        }]
    });

	res.json($response);
});
// ---------------------------------------------------

// Buscar OT (seleccionar ot)
router.post('/get/data/selot', async (req,res)=>{
    // fecha , cliente, ubigeo
    var $response = {};
	$response.estado = 'OK';
	$response.data = [];
    var $where = {};
    var sCliente = req.body.cliente;
    var sUbigeo = req.body.ubigeo;
    $where.FechaMySQL = req.body.fecha;
    $where.SubEstado  = { [Op.is ] : null };

    if( sCliente ){
        $where.IdClienteProv = sCliente;
    }
    if( sUbigeo ){
        $where.idUbigeo = sUbigeo;
    }

    // Estado : 'Aprobado'
    $response.data = await otModel.findAll({
        where : $where,
        include: [{
            model: trabajoOTModel,
            as: 'DetalleTrab'
        }]
    });

	res.json($response);
});

// ---------------------------------------------------

// ---------------------------------------------------
// Obtener todos
router.get('/',async(req,res)=>{
	const films = await Film.findAll({
        limit : 2
    });
	res.json( films );
});

// ---------------------------------------------------
// Agregar pelicula
router.post('/', async (req,res)=>{
	const film = await Film.create(req.body);
	res.json(film);
});

// ---------------------------------------------------
// Actualizar
router.put('/:filmID', async (req,res)=>{
	await Film.update(req.body,{
		where : {id:req.params.filmID}
	});
	res.json({success:'se ha modificado'});
});

// ---------------------------------------------------
// Borrar !!!!
router.delete('/:filmID', async (req,res)=>{
	await Film.destroy({
		where : {id:req.params.filmID}
	});
	res.json({success:'se ha borrado la pelicula'});
});

// ---------------------------------------------------
// ---------------------------------------------------
// ---------------------------------------------------
// ---------------------------------------------------
// ---------------------------------------------------
// ---------------------------------------------------


module.exports = router;
