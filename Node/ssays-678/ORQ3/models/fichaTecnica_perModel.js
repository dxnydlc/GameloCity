// fichaTecnica_perModel.js
module.exports = (sequelize, type) => {
	return sequelize.define('utb_fichatecnica_per',{
		IdOS:{
			type            : type.INTEGER,
			primaryKey      : true,
			autoIncrement   : true
		},
		uu_id   			: type.STRING,
		Codigo  			: type.STRING,
		IdOS    			: type.INTEGER,
		IdFicha    			: type.INTEGER,
		IdEmp      			: type.INTEGER,
		Glosa      			: type.STRING,
		Cantidad     		: type.INTEGER,
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
