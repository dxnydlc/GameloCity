// productosOSModel.js

module.exports = (sequelize, type) => {
	return sequelize.define('utb_productososdet',{
		IDProductoOS : {
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
        uu_id       : type.STRING,
        IdOS        : type.INTEGER,
        Cantidad    : type.DECIMAL(20, 6),
        IdProducto  : type.INTEGER,
		producto    : type.STRING,
		Glosa       : type.TEXT,
		TipoDetalle : type.STRING,
        UM          : type.STRING,
        C008        : type.STRING,
        C009        : type.STRING,
        Token       : type.STRING,
        UMedida     : type.STRING,
		createdAt: {
			type: type.DATE,
			field: 'created_at',
		},
		updatedAt: {
			type: type.DATE,
			field: 'updated_at'
		}
	},{
		timestamps      : true,
		freezeTableName : true
	})
}
