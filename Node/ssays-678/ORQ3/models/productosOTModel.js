
// productosOTModel.js

module.exports = (sequelize, type) => {
	return sequelize.define('utb_productosotdet',{
		IDProductoOT : {
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
        uu_id       : type.STRING,
        IdOT        : type.INTEGER,
        Anexo    	: type.INTEGER,
        Cantidad  	: type.DECIMAL(20, 6),
		IdProducto  : type.INTEGER,
		producto    : type.TEXT,
		Glosa 		: type.STRING,
        TipoDetalle : type.STRING,
        UM        	: type.STRING,
        C008        : type.STRING,
        C009        : type.STRING,
        C010     	: type.STRING,
		UMedida     : type.STRING,
		id_empresa  : type.INTEGER,
		empresa     : type.STRING,	
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
