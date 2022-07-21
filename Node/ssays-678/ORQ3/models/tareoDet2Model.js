// tareoDet2Model.js
module.exports = (sequelize, type) => {
	return sequelize.define('orq_tareo_detalle2',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
        uu_id   : type.STRING,
        IdTareo : type.INTEGER,
        DNI     : type.INTEGER,
		Nombre  : type.STRING,
		Cargo  : type.STRING,
        Fecha   : type.DATEONLY,
        Dia     : type.STRING,
		Horas   : type.STRING,
		Estado  : type.STRING,
		Glosa   : type.TEXT,
		TipoDato: type.STRING,
        deleted_at : type.STRING,
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