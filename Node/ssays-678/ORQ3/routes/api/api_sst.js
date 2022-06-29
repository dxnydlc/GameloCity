// api_sst.js

const router = require('express').Router();
const { paHeaderModel,paDetModel } = require('../../db');


// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
paHeaderModel.belongsTo(paDetModel,{
	as : 'Detalle', foreignKey 	: 'IdPedAlmacenCab',targetKey: 'IdPedAlmacenCab',
});
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//////////////////////////////////////////////////////
// 					Buscar los PA reporte			//
//////////////////////////////////////////////////////
router.post('/rpt/pa', async (req,res)=>{
	// ids, inicio, fin, soli,auto

	var $response = {};
	$response.estado = 'OK';
	$response.data = [];
	var $where = {};

	/**/
	
	const { Op } = require("sequelize");
	/**/


	if( req.body.ids != '' )
	{
		var $ids = req.body.ids;
		var $arIds = $ids.split(',');
		//
		$response.data = await paHeaderModel.findAll({
			order: [
				['IdPedAlmacenCab', 'DESC']
			],
		    where: {
		        IdPedAlmacenCab : { [Op.in] : $arIds }
		    },
		    include: [{
		        model: paDetModel,
		        as: 'Detalle'
		    }]
		});
	}
	else
	{
		//
		$where.Fecha = { [Op.gte ]: req.body.inicio,[Op.lte ]: req.body.fin };
		if( req.body.soli )
		{
			$where.Solicitante = req.body.soli;
		}
		if( req.body.auto )
		{
			$where.AutorizadoPor = req.body.auto;
		}

		$response.data = await paHeaderModel.findAll({
			order: [
				['IdPedAlmacenCab', 'DESC']
			],
			where : $where,
		    include: [{
		        model: paDetModel,
		        as: 'Detalle'
		    }]
		});
	}
		
	/**/

	//const film = await paHeaderModel.findAll(req.body);
	res.json($response);
});
// ---------------------------------------------------





module.exports = router;
