// tipoPagoModel.js

module.exports = (sequelize, type) => {
	return sequelize.define('utb_tipopago',{
		IdTipoPago  : {
			type 		  : type.INTEGER,
			primaryKey 	  : true,
			autoIncrement : true
		},
		uu_id 		: type.STRING,
		Descripcion : type.STRING,
		id_empresa  : type.INTEGER,
		empresa     : type.STRING,
		Estado     : type.STRING,
        dias        : type.INTEGER,
        deleted_at  : type.DATE,
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
