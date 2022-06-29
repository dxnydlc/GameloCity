// serviciosModel.js
// 
module.exports = (sequelize, type) => {
	return sequelize.define('utb_servicios',{
		IdServicio :{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
        uu_id       : type.STRING,
        Codigo      : type.STRING,
		Descripcion : type.STRING,
		Estado      : type.INTEGER,
		codigoProductoSunat : type.STRING,
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
		timestamps: true,
		freezeTableName: true
	})
}