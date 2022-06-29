// retenesModel.js
module.exports = (sequelize, type) => {
	return sequelize.define('orq_retenes',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
        uu_id       : type.STRING,
        DNI         : type.INTEGER,
		Reten       : type.STRING,
		IdCliente   : type.INTEGER,
        Cliente     : type.STRING,
        IdLocal     : type.INTEGER,
        Local       : type.STRING,
        Fecha       : type.DATEONLY,
        IdHorario   : type.INTEGER,
        Horario     : type.STRING,
        Estado      : type.STRING,
		CreadoPor   : type.STRING,

		IdTareo     : type.INTEGER,
        Tareo       : type.STRING,

        IdUsuarioCreado 	: type.INTEGER,
        ModificadoPor   	: type.STRING,
		IdUsuarioModificado : type.INTEGER,
		AnuladoPor   	 	: type.STRING,
        IdUsuarioAnulado 	: type.INTEGER,
        
        id_empresa  : type.INTEGER,
        empresa     : type.STRING,
        deleted_at  : type.DATE,
		createdAt 	: {
			type 	: type.DATE,
			field 	: 'created_at',
		},
		updatedAt 	: {
			type 	: type.DATE,
			field 	: 'updated_at'
		}
	},{
		timestamps: true,
		freezeTableName: true
	})
}