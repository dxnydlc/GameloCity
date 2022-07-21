// Requerimiento de materiales

const router = require('express').Router();

const { Film,reqMaterialesModel } = require('../../db');

// -----------------------------------------------
// -----------------------------------------------
// -----------------------------------------------
// -----------------------------------------------

// Revisar sincronia entre guia de remisión y req de materiales
router.post('/check_req_guiarem', async (req,res)=>{
    // NroReq, NroGuia
    var $response = {};
	$response.estado = 'OK';
	$response.data = [];
    var $where = {};
    
    if( req.body.NroReq != '' )
    {
        const $dataReq = await reqMaterialesModel.findOne({
            where : {
                IdRequerimientoCab : req.body.NroReq
            }
        });

        if( $dataReq )
        {
            $response.data = $dataReq;
            if( $dataReq.NroGuia == '' || $dataReq.NroGuia == null )
            {
                // asignamos la guia enviada
                await reqMaterialesModel.update( { 'NroGuia' : req.body.NroGuia  },{
                    where : { IdRequerimientoCab : req.body.NroReq }
                });
            }
            // Lo marcamos como procesado
            await reqMaterialesModel.update({ C041 :'SYNC' },{
                where : { IdRequerimientoCab : req.body.NroReq }
            });
            
        }
    }
    

	res.json($response);
});

// -----------------------------------------------
// Obtener todos
router.get('/',async(req,res)=>{
	const films = await Film.findAll();
	res.json( films );
});
// -----------------------------------------------

// Agregar pelicula
router.post('/', async (req,res)=>{
	const film = await Film.create(req.body);
	res.json(film);
});
// -----------------------------------------------

// Actualizar
router.put('/:filmID', async (req,res)=>{
	await Film.update(req.body,{
		where : {id:req.params.filmID}
	});
	res.json({success:'se ha modificado'});
});
// -----------------------------------------------

// Borrar !!!!
router.delete('/:filmID', async (req,res)=>{
	await Film.destroy({
		where : {id:req.params.filmID}
	});
	res.json({success:'se ha borrado la pelicula'});
});
// -----------------------------------------------
// -----------------------------------------------
// -----------------------------------------------
// -----------------------------------------------
// -----------------------------------------------
// -----------------------------------------------
// -----------------------------------------------
// -----------------------------------------------
// -----------------------------------------------
// -----------------------------------------------
// -----------------------------------------------
// -----------------------------------------------
// -----------------------------------------------
// -----------------------------------------------
// -----------------------------------------------
// -----------------------------------------------




module.exports = router;
