
// cargaExcelModelCab.js

module.exports = (sequelize, type) => {
	return sequelize.define('orq_carga_excel_cab',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id : type.STRING,
		Codigo : type.STRING,
        CodigoHead : type.STRING,

        IdCliente : type.BIGINT,
		Cliente : type.STRING,
        IdLocal : type.INTEGER,
        Local   : type.STRING,
        NroCols : type.INTEGER,

        IdSupervisor : type.INTEGER,
        Supervisor   : type.STRING,

        IdArchivo : type.INTEGER,
        Archivo   : type.STRING,

		Flag : type.STRING,
        Token : type.STRING,

        Cab01 : type.STRING,
        Cab02 : type.STRING,
        Cab03 : type.STRING,
        Cab04 : type.STRING,
        Cab05 : type.STRING,
        Cab06 : type.STRING,
        Cab07 : type.STRING,
        Cab08 : type.STRING,
        Cab09 : type.STRING,
        Cab10 : type.STRING,
        Cab11 : type.STRING,
        Cab12 : type.STRING,
        Cab13 : type.STRING,
        Cab14 : type.STRING,
        Cab15 : type.STRING,
        Cab16 : type.STRING,
        Cab17 : type.STRING,
        Cab18 : type.STRING,
        Cab19 : type.STRING,
        Cab20 : type.STRING,
        Cab21 : type.STRING,
        Cab22 : type.STRING,
        Cab23 : type.STRING,
        Cab24 : type.STRING,
        Cab25 : type.STRING,
        Cab26 : type.STRING,
        Cab27 : type.STRING,
        Cab28 : type.STRING,
        Cab29 : type.STRING,
        Cab30 : type.STRING,
        Cab31 : type.STRING,
        Cab32 : type.STRING,
        Cab33 : type.STRING,
        Cab34 : type.STRING,
        Cab35 : type.STRING,
        Cab36 : type.STRING,
        Cab37 : type.STRING,
        Cab38 : type.STRING,
        Cab39 : type.STRING,
        Cab40 : type.STRING,
        Cab41 : type.STRING,
        Cab42 : type.STRING,
        Cab43 : type.STRING,
        Cab44 : type.STRING,
        Cab45 : type.STRING,
        Cab46 : type.STRING,
        Cab47 : type.STRING,
        Cab48 : type.STRING,
        Cab49 : type.STRING,
        Cab50 : type.STRING,
        Cab51 : type.STRING,
        Cab52 : type.STRING,
        Cab53 : type.STRING,
        Cab54 : type.STRING,
        Cab55 : type.STRING,
        Cab56 : type.STRING,
        Cab57 : type.STRING,
        Cab58 : type.STRING,
        Cab59 : type.STRING,
        Cab60 : type.STRING,

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

