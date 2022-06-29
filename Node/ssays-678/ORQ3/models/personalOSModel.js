// personalOSModel.js
module.exports = (sequelize, type) => {
	return sequelize.define('utb_personalosdet',{
		IdPersonalOS :{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id    : type.STRING,
		IdOS 	 : type.INTEGER,
        IdEmp    : type.INTEGER,
		Personal : type.STRING,
		Cantidad : type.INTEGER,
        Puesto 	 : type.TEXT,
        C007     : type.TEXT,
        C008     : type.TEXT,
        C009     : type.TEXT,
        Token    : type.TEXT,
		Glosa 	 : type.TEXT,
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