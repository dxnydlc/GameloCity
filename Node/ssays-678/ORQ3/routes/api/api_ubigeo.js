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
    $response.data = [];

    $response.data = await departamentoModel.findAll({
        order : [
            [ 'name' , 'ASC' ]
        ]
    });
    $response.results = $response.data;

	res.json($response);
});
// -------------------------------------------------------

/////////////////////////////////////////////////////////
//                  SELECT2 PROVINCIAS                 //
/////////////////////////////////////////////////////////
router.post('/provincia/:Idepa', async (req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    
    $response.data = await provinciaModel.findAll({
        order : [
            [ 'name' , 'ASC' ]
        ],
        where : {
            department_id : req.params.Idepa
        }
    });
    $response.results = $response.data;

	res.json($response);
});
// -------------------------------------------------------

/////////////////////////////////////////////////////////
//                  SELECT2 DISTRITO                   //
/////////////////////////////////////////////////////////
router.post('/distrito/:IdProv', async (req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    $response.data = await distrito2Model.findAll({
        order : [
            [ 'name' , 'ASC' ]
        ],
        where : {
            province_id : req.params.IdProv
        }
    });
    $response.results = $response.data;

	res.json($response);
});
// -------------------------------------------------------


/////////////////////////////////////////////////////////
//                  SELECT2 DISTRITO                   //
/////////////////////////////////////////////////////////
router.post('/get/:Ubigeo', async (req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.encontrado = 'NO';
    $response.data = [];
    $response.dep  = '';
    $response.prov = '';
    $response.dist = '';

    var _Entidad = await distrito2Model.findOne({
        order : [
            [ 'name' , 'ASC' ]
        ],
        where : {
            id : req.params.Ubigeo
        }
    }).catch(function (err) {
        // handle error;
        $response.estado = 'ERROR';
        $response.error  = err.original.sqlMessage;
        res.json( $response );
    });
    if( _Entidad )
    {
        $response.dist = _Entidad.name;
        $response.encontrado = 'SI';
        // Depa
        var _DetaDat = await departamentoModel.findOne({
            where : {
                id : _Entidad.department_id
            }
        }).catch(function (err) {
            // handle error;
            $response.estado = 'ERROR';
            $response.error  = err.original.sqlMessage;
            res.json( $response );
        });
        if( _DetaDat ){
            $response.dep  = _DetaDat.name;
        }
        // Prov
        var _ProvDat = await provinciaModel.findOne({
            where : {
                id : _Entidad.province_id
            }
        }).catch(function (err) {
            // handle error;
            $response.estado = 'ERROR';
            $response.error  = err.original.sqlMessage;
            res.json( $response );
        });
        if( _DetaDat ){
            $response.prov  = _ProvDat.name;
        }
    }
    $response.results = $response.data;

	res.json($response);
});
// -------------------------------------------------------


module.exports = router;