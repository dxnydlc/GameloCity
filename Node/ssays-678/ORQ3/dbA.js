// dbA.js

const Sequelize = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const orq_auditoriaSSAYSModel 	= require('./models/auditoriaSSAYSModel');
const userModel 			= require('./models/users');
const orq_whatsAppLogModel 	= require('./models/whatsAppLogModel');
const orq_errorLogModel 	= require('./models/errorLogModel');
// TMP para actualizar usuarios
const orq_tmp_updateUsuarioModel 	= require('./models/tmp_updateUsuarioModel');
// Activos
const utb_activosModel231 = require('./models/activosModel231');





/**/
// DEVELOPS
const sequelize = new Sequelize(process.env.DB_database2,process.env.DB_user2,process.env.DB_password2,{
	host:process.env.DB_host2,
	dialect  : 'mysql',
	timezone : 'America/Lima',
	logging  : false,
	dialectOptions: {
		timezone: "local",
	}
});
/**/

const auditoriaSSAYSModel = orq_auditoriaSSAYSModel(sequelize,Sequelize);
const User 				  = userModel(sequelize,Sequelize);
const whatsAppLogModel 	  = orq_whatsAppLogModel(sequelize,Sequelize);
// Error Log
const errorLogModel 	  = orq_errorLogModel(sequelize,Sequelize);
// TMP para actualizar usuarios
const tmp_updateUsuarioModel 	  = orq_tmp_updateUsuarioModel(sequelize,Sequelize);
// Activos
const activosModel231 	  = utb_activosModel231(sequelize,Sequelize);




module.exports = {
	sequelize,
	auditoriaSSAYSModel,
	User,
	whatsAppLogModel,
	errorLogModel,
	tmp_updateUsuarioModel,
	activosModel231
}