// [areasModel]
// => areaModel

module.exports = (sequelize, type) => {
	return sequelize.define('utb_areas',{
		CodArea:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id 	: type.STRING,
		Codigo 	: type.STRING,
		Descripcion : type.TEXT,
		indice 	: type.STRING,
		C003 	: type.TEXT,
        C004 	: type.TEXT,
        C005 	: type.TEXT,
        C006 	: type.TEXT,
        C007 	: type.TEXT,
        C008 	: type.TEXT,
        Usuario : type.TEXT,
        Fecha 	: type.TEXT,
        Estado 	: type.INTEGER,
        id_empresa 	: type.INTEGER,
        empresa 	: type.STRING,
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
