//api_backend.js

const router = require('express').Router();

const { Film,User,otModel } = require('../../db');



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


// SELECT2 bsucar colaborador (DNI)
router.get('/src_usuarios', async (req,res)=>{
	//
	const film = await User.findAll(req.body);
	res.json(film);
	//
});

// -----------------------------------------------



// Acceso modulo
router.post('/acceso_modulo', async (req,res)=>{
	//
	const film = await Film.create(req.body);
	res.json(film);
	//
});

// Obtener todos
router.get('/',async(req,res)=>{
	const films = await Film.findAll();
	res.json( films );
});

// Agregar pelicula
router.post('/', async (req,res)=>{
	const film = await Film.create(req.body);
	res.json(film);
});

// Actualizar
router.put('/:filmID', async (req,res)=>{
	await Film.update(req.body,{
		where : {id:req.params.filmID}
	});
	res.json({success:'se ha modificado'});
});

// Borrar !!!!
router.delete('/:filmID', async (req,res)=>{
	await Film.destroy({
		where : {id:req.params.filmID}
	});
	res.json({success:'se ha borrado la pelicula'});
});




module.exports = router;
