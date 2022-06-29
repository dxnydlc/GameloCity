// fichaTecnica_proModel.js
module.exports = (sequelize, type) => {
	return sequelize.define('utb_fichatecnica_pro',{
		IDFichaTecnica_Pro:{
			type            : type.INTEGER,
			primaryKey      : true,
			autoIncrement   : true
		},
		uu_id   			: type.STRING,
		Codigo  			: type.STRING,
		IdOS			    : type.INTEGER,
		IdProducto      	: type.INTEGER,
		Ingredientes     	: type.TEXT,
		Dosis       		: type.TEXT,
		TiempoEspera     	: type.TEXT,
		IdFicha       		: type.INTEGER,
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
