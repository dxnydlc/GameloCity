// [bancoModel]
// => bancoModel

module.exports = (sequelize, type) => {
	return sequelize.define('utb_bancos',{
		IdBanco:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		Descripcion 	: type.STRING,
		Estado 	: type.STRING,
		
        deleted_at 	: type.DATE,
		createdAt 	: {
			type 	: type.DATE,
			field 	: 'created_at',
		},
		updatedAt: {
			type 	: type.DATE,
			field 	: 'updated_at'
		}
	},{
		timestamps: true,
		freezeTableName: true
	})
}
