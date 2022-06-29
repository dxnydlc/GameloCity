// apoyoDataModel.js

module.exports = (sequelize, type) => {
	return sequelize.define('orq_apoyo_data',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id    : type.STRING,
		Codigo   : type.STRING,
		Codigo01 : type.STRING,
		Codigo02 : type.STRING,
        Codigo03 : type.STRING,
        Flag     : type.STRING,
        Token    : type.STRING,
        Descripcion : type.STRING,
		SubTexto1 	: type.STRING,
		SubTexto2 	: type.STRING,
		Num01 	: type.INTEGER,
		Num02 	: type.INTEGER,
		Estado 		: type.STRING,
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

