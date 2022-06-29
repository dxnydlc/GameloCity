// docVentasDet.js

module.exports = (sequelize, type) => {
	return sequelize.define('orq_doc_ventas_det',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id 		: type.STRING,
		CodigoHead 	: type.STRING,
		Indice		: type.INTEGER,
		TipoDoc     : type.STRING,
        Serie       : type.STRING,
		Correlativo : type.STRING,

		IdServicio 	: type.INTEGER,
		Servicio 	: type.STRING,
		IdProducto  : type.STRING,
		Descripcion : type.TEXT,
		Cantidad	: type.DECIMAL(20,4),
		Moneda 		: type.STRING,
		PrecioUnit	: type.DECIMAL(20,4),
		ValorUnit 	: type.DECIMAL(20,4),
		IgvUnit		: type.DECIMAL(20,4),
		Total		: type.DECIMAL(20,4),
		NroOS		: type.STRING,
		ConjOS		: type.STRING,
		CodigoProducto 		: type.STRING,
		CodigoProductoSUNAT : type.STRING,
		InfoAdic01 	: type.TEXT,
		InfoAdic02 	: type.TEXT,
		InfoAdic03 	: type.TEXT,
		Token		: type.STRING,
		Flag 		: type.STRING,
		ImporteTotalSinImpuesto		: type.DECIMAL(20,4),
		ImporteUnitarioSinImpuesto	: type.DECIMAL(20,4),
		ImporteUnitarioConImpuesto	: type.DECIMAL(20,4),
		MontoBaseIgv : type.DECIMAL(20,4),
		ImporteIgv 	 : type.DECIMAL(20,4),
		ImporteTotalImpuestos 	: type.DECIMAL(20,4),
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