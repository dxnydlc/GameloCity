// puestoIsoModel

const timezone = 'America/Lima'

const moment =require('moment').tz.setDefault(timezone);

module.exports = (sequelize, type) => {
	return sequelize.define('utb_puestoiso',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
        idPuestoIso     : type.INTEGER,
        uu_id           : type.STRING,
        Codigo          : type.STRING,
		IdArea          : type.INTEGER,
		area            : type.STRING,
		Descripcion     : type.INTEGER,
        indice          : type.STRING,
        depende_de      : type.STRING,
        id_depende_de   : type.INTEGER,
        FormReq         : type.TEXT,
        Especializacion : type.TEXT,
        ExpReq          : type.TEXT,
        Educacion       : type.TEXT,
        Habilidad       : type.TEXT,
        ReqAdic         : type.TEXT,
        UsuarioMod      : type.STRING,
        FechaMod        : type.DATE,
        Estado          : type.INTEGER,
        id_empresa      : type.INTEGER,
        empresa         : type.STRING,
        deleted_at      : type.DATE,
        createdAt   : {
			type    : type.DATE,
			field   : 'created_at',
		},
/*
		createdAt: {
			type: type.DATE,
            field: 'created_at',
            get: function() {
                //console.log(moment.utc(this.getDataValue('created_at')).format('YYYY/MM/DD HH:mm:ss'));
                return moment.utc(this.getDataValue('created_at')).format('YYYY/MM/DD HH:mm:ss')
            }
		},
        */
		updatedAt: {
			type: type.DATE,
            field: 'updated_at',
            get: function() {
                return moment.utc(this.getDataValue('updated_at')).format('YYYY/MM/DD HH:mm:ss')
            }
		}
	},{
		timestamps: true,
		freezeTableName: true
	})
}
