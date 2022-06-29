// accidenteModel.js
module.exports = (sequelize, type) => {
	return sequelize.define('orq_accidentes',{
		id:{
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
		},
        uu_id : type.STRING,

        IdCliente                           : type.INTEGER,
        Cliente                             : type.STRING,
        Domicilio_cliente                   : type.STRING,
        TActiEcon_cliente                   : type.STRING,
        NroTrabajadoresEmpresa_cliente      : type.INTEGER,
        NroTrabajadoresConSctr_cliente      : type.INTEGER,
        NroTrabajadoresSinSctr_cliente      : type.INTEGER,
		Aseguradora_cliente                 : type.STRING,
        IdContratista                       : type.INTEGER,
        Contratista                         : type.STRING,
        Domicilio_contratista               : type.STRING,
        Tip_act_ec_contratista              : type.STRING,
        NroTrabajadoresEmpresa_contratista  : type.STRING,
        NroTrabajadoresConSctr_contratista  : type.STRING,
        NroTrabajadoresSinSctr_contratista  : type.STRING,
        Aseguradora_contratista             : type.TEXT,
        IdTrabajador                        : type.INTEGER,
        Trabajador                          : type.STRING,
        Edad_trabajador                     : type.STRING,
        Area_trabajador                     : type.STRING,
        Puesto_trabajador                   : type.STRING,
        AntiguedadPuesto_trabajador         : type.STRING,
        Sexo_trabajador                     : type.STRING,
        Turno_trabajador                    : type.STRING,
        TipoContrato_trabajador             : type.STRING,
        TiempoExpPuesto_trabajador          : type.STRING,
        NroHorasTrabDia_trabajador          : type.INTEGER,
        FechaHoraAccidente                  : type.DATE,
        Fecha_inicio_investigacion          : type.DATEONLY,
        Lugar_accidente                     : type.STRING,
        Gravedad_accidente                  : type.STRING,
        Grado_accidente                     : type.STRING,
        DiasDescansoMedico                  : type.INTEGER,
        NroTrabajadoresAfectados            : type.INTEGER,
        ParteCuerpoLesionado                : type.STRING,
        DescripcionAccidente                : type.STRING,
        FaltaControl                        : type.STRING,
        FaltaControl_texto                  : type.STRING,
        CausasBasicas                       : type.STRING,
        CausasBasicas_texto                 : type.STRING,
        CausasInmeditas                     : type.STRING,
        CausasInmeditas_texto               : type.STRING,
        Estado                              : type.STRING,
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