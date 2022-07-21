const router = require('express').Router();

const { 
    distrito2Model,
	departamentoModel,
    provinciaModel 
} = require('../../db');



//////////////////////////////////////////////////////////
//                  SELECT2 DEPARTAMENTOS               //
//////////////////////////////////////////////////////////
router.post('/departamento', async (req,res)=>{
    var $response = {};
    $response.estado = 'OK';

    $response.results = await departamentoModel.findAll({
        order : [
            [ 'name' , 'ASC' ]
        ]
    });

	res.json($response);
});
// -------------------------------------------------------

/////////////////////////////////////////////////////////
//                  SELECT2 PROVINCIAS                 //
/////////////////////////////////////////////////////////
router.post('/provincia/:Idepa', async (req,res)=>{
    var $response = {};
    $response.estado = 'OK';

    $response.results = await provinciaModel.findAll({
        order : [
            [ 'name' , 'ASC' ]
        ],
        where : {
            department_id : req.params.Idepa
        }
    });

	res.json($response);
});
// -------------------------------------------------------

/////////////////////////////////////////////////////////
//                  SELECT2 DISTRITO                   //
/////////////////////////////////////////////////////////
router.post('/distrito/:IdProv', async (req,res)=>{
    var $response = {};
    $response.estado = 'OK';

    $response.results = await distrito2Model.findAll({
        order : [
            [ 'name' , 'ASC' ]
        ],
        where : {
            province_id : req.params.IdProv
        }
    });

	res.json($response);
});
// -------------------------------------------------------

module.exports = router;