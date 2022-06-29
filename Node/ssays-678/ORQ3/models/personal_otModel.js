// personal_otModel

module.exports = (sequelize, type) => {
	const personalOT = sequelize.define('utb_personalotdet',{
		IdPersonalOT : {
			type : type.INTEGER,
			primaryKey : true,
			autoIncrement: true
        },
        IdOT    : type.INTEGER,
        uu_id    : type.STRING,
		Anexo   : type.INTEGER,
		IdEmp   : type.INTEGER,
		Glosa   : type.TEXT,
        C005    : type.TEXT,
        C006    : type.TEXT,
        C007    : type.TEXT,
        C008    : type.TEXT,
        C009    : type.TEXT,
        C010    : type.TEXT,
        Cantidad : type.TEXT
	},{
		timestamps: false,
		freezeTableName: true
    });
    
    /**
    personalOT.associate = (models) => {
        // associations can be defined here
        personalOT.belongsTo( models.otModel, { foreignKey: 'IdOT' });
    };
    /**/

    return personalOT;
}
