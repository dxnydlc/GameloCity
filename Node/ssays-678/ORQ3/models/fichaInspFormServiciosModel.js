// fichaInspFormServicios.js

module.exports = (sequelize, type) => {
	return sequelize.define('orq_ficha_insp_form_servicios',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
		uu_id : type.STRING,
		IdLocal: type.STRING,
        IdFichaInspeccion : type.STRING,
    
        block1_opt1 : type.STRING,
        block1_opt2 : type.STRING,
        block1_opt3 : type.STRING,
        block1_opt4 : type.STRING,
        block1_opt5 : type.STRING,
        block1_opt6 : type.STRING,
        block1_opt7 : type.STRING,
        block1_opt8 : type.STRING,
        block1_opt9 : type.STRING,
        block1_opt10 : type.STRING,
        block1_opt11 : type.STRING,
        block1_opt12 : type.STRING,
        block1_opt13 : type.STRING,
        block1_opt14 : type.STRING,
        block1_opt15 : type.STRING,
        block1_opt16 : type.STRING,
        block1_opt17 : type.STRING,
        block1_opt18 : type.STRING,
        block1_opt19 : type.STRING,
    
        block2_dato1 : type.STRING,
        block2_dato2 : type.STRING,

        block3_dato1 : type.STRING,
        block3_dato2 : type.STRING,
        block3_dato3 : type.STRING,
        block3_dato4 : type.STRING,
        block3_dato5 : type.STRING,
        block3_dato6 : type.STRING,
        block3_dato7 : type.STRING,

        block4_dato1 : type.STRING,
        block4_dato2 : type.STRING,
        block4_dato3 : type.STRING,
        block4_dato4 : type.STRING,
        block4_dato5 : type.STRING,
        block4_dato6 : type.STRING,
        block4_dato7 : type.STRING,
        block4_dato8 : type.STRING,
        block4_dato9 : type.STRING,
        block4_dato10 : type.STRING,
        block4_dato11 : type.STRING,
        block4_dato12 : type.STRING,

        block5_dato1 : type.STRING,
        block5_dato2 : type.STRING,
        block5_dato3 : type.STRING,
        block5_dato4 : type.STRING,
        block5_dato5 : type.STRING,
        block5_dato6 : type.STRING,
        block5_dato7 : type.STRING,
        block5_dato8 : type.STRING,

        block6_dato1 : type.STRING,
        block6_dato2 : type.STRING,
        block6_dato3 : type.STRING,
        block6_dato4 : type.STRING,
        block6_dato5 : type.STRING,

        block7_dato1 : type.STRING,
        block7_dato2 : type.STRING,
        block7_dato3 : type.STRING,
        block7_dato4 : type.STRING,
        block7_dato5 : type.STRING,
        block7_dato6 : type.STRING,

        block8_dato1 : type.STRING,
        block8_dato2 : type.STRING,
        block8_dato3 : type.STRING,
        block8_dato4 : type.STRING,
        block8_dato5 : type.STRING,
        block8_dato6 : type.STRING,
        block8_dato7 : type.STRING,
        block8_dato8 : type.STRING,

        block9_dato1 : type.STRING,
        block10_dato1 : type.STRING,
        block11_dato1 : type.STRING,

        id_empresa : type.INTEGER,
        empresa : type.STRING,

        UsuarioCreado       : type.STRING,
        UsuarioModificado   : type.STRING,
        UsuarioAnulado      : type.STRING,

		deleted_at : type.DATE,
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