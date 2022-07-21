// xlsLAPTrabajadoresDetModel.js

module.exports = (sequelize, type) => {
	return sequelize.define('orq_xls_trabajadores_det',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id : type.STRING,
		CodigoHead : type.STRING,
        DNI     : type.INTEGER,
        Nombre  : type.STRING,
		Paterno : type.STRING,
        Materno : type.STRING,
        Puesto  : type.STRING,
        Celular : type.STRING,
        Correo  : type.STRING,
        Turno   : type.STRING,
		
		Token   : type.STRING,
		createdAt : {
			type  : type.DATE,
			field : 'created_at',
		},
		updatedAt : {
			type  : type.DATE,
			field : 'updated_at'
		}
	},{
		timestamps: true,
		freezeTableName: true
	})
}
