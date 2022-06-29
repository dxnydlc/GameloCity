// responsableModel.js
module.exports = (sequelize, type) => {
	return sequelize.define('orq_responsables_registro_investigacion',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id 		: type.STRING,  
		Codigo      : type.STRING,  
        IdRsp 		: type.INTEGER,
        Resp  		: type.STRING,
        Cargo 		: type.STRING,
        Firma 		: type.STRING,
        Estado      : type.STRING,
		Token       : type.STRING,
       // CreadoPor                           : type.STRING,
       // ModificadoPor                       : type.STRING,
       // AnuladoPor                          : type.STRING,
      
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