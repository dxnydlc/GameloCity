
// lapBloque1Model.js


module.exports = (sequelize, type) => {
	return sequelize.define('orq_lap_bloque1',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id : type.STRING,
		Codigo : type.STRING,
        IdBloque : type.INTEGER,
        CodigoBita : type.STRING,

        Bloque : type.TEXT,
		Area   : type.TEXT,
        Trabajo : type.TEXT,
		Sector  : type.TEXT,
        Img01   : type.TEXT,
        Img02   : type.TEXT,
        Img03   : type.TEXT,
        Img04   : type.TEXT,
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



