// ordenCompraModal.js
module.exports = (sequelize, type) => {
	return sequelize.define('utb_ordcompracab',{
		Serie : {
			type : type.INTEGER,
			primaryKey : true
		},
		IdOCCab : {
			type : type.INTEGER,
			primaryKey : true
		},
		uu_id        		: type.STRING,
	    IdClienteProv   	: type.DOUBLE,
        proveedor   		: type.STRING,
        IdSucursal    		: type.INTEGER,
		Fecha       		: type.DATEONLY,
		FechaEntrega    	: type.DATEONLY,
		Recepcion      		: type.STRING,
        Vencimiento     	: type.DATEONLY,
        Solicitante         : type.INTEGER,
        nombre_solicitante  : type.STRING,
        centro_costo       	: type.STRING,
        iddestino        	: type.INTEGER,
		destino        		: type.STRING,
		C010        		: type.INTEGER,
		Glosa        		: type.STRING,
		Atendido        	: type.STRING,
		pentrada        	: type.STRING,
		Direccion        	: type.STRING,
		NroFactura        	: type.STRING,
		IdMoneda        	: type.INTEGER,
		moneda        		: type.STRING,
		C020        		: type.STRING,
		TipoCambio        	: type.DECIMAL(20,2),
		CondicionPago       : type.INTEGER,
		condicion        	: type.STRING,
		IncIGV        		: type.INTEGER,
		C024        		: type.STRING,
		Estado        		: type.STRING,
		TotalSolesPrev      : type.DECIMAL(20,2),
		IGVSolesPrev        : type.DECIMAL(20,2),
		SubTotalSolesPrev   : type.DECIMAL(20,2),
		TotalDolares        : type.DECIMAL(20,2),
		IGVDolares        	: type.DECIMAL(20,2),
		SubTotalDolares     : type.DECIMAL(20,2),
		C032        		: type.STRING,
		C033        		: type.STRING,
		C034        		: type.STRING,
		IGVPorcentaje       : type.STRING,
		C036        		: type.STRING,
		C037        		: type.STRING,
		UsuarioAprob        : type.STRING,
		FechaMod        	: type.DATEONLY,
		UsuarioMod        	: type.STRING,
		C041        		: type.STRING,
		C042        		: type.STRING,
		C043        		: type.STRING,
		C044        		: type.STRING,
		C045        		: type.STRING,
		C046        		: type.STRING,
		C047       			: type.STRING,
		C048        		: type.STRING,
		C049       			: type.STRING,
		C050        		: type.STRING,
		IdGiro      		: type.STRING,
		C052        		: type.STRING,
		C053        		: type.STRING,
		C054        		: type.STRING,
		C055        		: type.STRING,
		C056        		: type.STRING,
		C057        		: type.STRING,
		C058        		: type.STRING,
		C059        		: type.STRING,
		token       		: type.STRING,
		SubTotalDoc 		: type.DECIMAL(20,2),
		IGVDoc        		: type.DECIMAL(20,2),
		TotalDoc        	: type.DECIMAL(20,2),
		SubTotalSoles       : type.DECIMAL(20,2),
		IGVSoles        	: type.DECIMAL(20,2),
		TotalSoles        	: type.DECIMAL(20,2),
		TipoDocOrigen       : type.STRING,
		NroDocOrigen        : type.STRING,
		DirectoCliente      : type.INTEGER,
		Entregado        	: type.INTEGER,
		UsuarioModAp        : type.STRING,
		FechaModAp        	: type.DATEONLY,
		UsuarioModAn        : type.STRING,
		FechaModAn        	: type.DATEONLY,
		motivo_anulacion    : type.STRING,
		UsuarioModAp1       : type.STRING,
		FechaModAp1        	: type.DATEONLY,
		id_empresa        	: type.INTEGER,
		empresa        		: type.STRING,

		createdAt: {
			type: type.DATE,
			field: 'created_at',
		},
		updatedAt: {
			type: type.DATE,
			field: 'updated_at'
		}
	},{
		timestamps: true,
		freezeTableName: true
	})
}