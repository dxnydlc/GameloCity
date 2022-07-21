// pedidoCompraDetModal.js
module.exports = (sequelize, type) => {
	return sequelize.define('utb_pedidocompradet',{
		IdPedCompraDet : {
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
        IdPedCompraCab  : type.INTEGER,
        IdProducto      : type.INTEGER,
		producto        : type.STRING,
        IdUMedida       : type.INTEGER,
        unidad_medida   : type.STRING,
        Cantidad    : type.INTEGER,
		Glosa       : type.TEXT,
		doc         : type.STRING,
		tipdoc      : type.STRING,
        OC          : type.STRING,
        PE          : type.STRING,
        CantOS      : type.INTEGER,
        token       : type.STRING,
        C001        : type.INTEGER,
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