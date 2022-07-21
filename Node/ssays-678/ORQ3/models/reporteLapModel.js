
// reporteLapModel.js


module.exports = (sequelize, type) => {
	return sequelize.define('orq_rpt_lap',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id : type.STRING,
		Codigo : type.STRING,
		Nombre : type.STRING,

        FecInicio : type.DATEONLY,
        FecFin    : type.DATEONLY,

		Campo01 : type.STRING,
		Campo02 : type.STRING,
        Campo03 : type.STRING,
		Campo04 : type.STRING,
        Campo05 : type.STRING,
		Campo06 : type.STRING,
        Campo07 : type.STRING,
		Campo08 : type.STRING,
        Campo09 : type.STRING,
		Campo10 : type.STRING,
        Estado  : type.STRING,
		Text01  : type.STRING,
		Text02  : type.STRING,
		Text03  : type.STRING,
		Text04  : type.STRING,
		Text05  : type.STRING,
		NroCodigos 	: type.TEXT,
		NroAreas 	: type.TEXT,
		NroTrabajos : type.TEXT,
		Documento_Doc : type.TEXT,
		Documento_Zip : type.TEXT,

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



