
// db31.js

const Sequelize = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();


const utb_otModel 		= require('./models/otModel.js');
const utb_osModel 		= require('./models/osModel.js');
const userModel 		= require('./models/users');

const utb_conjuntoOSModel = require('./models/conjuntoOSModel.js');
// Doc ventas
const utb_docVentasCab231 = require('./models/docVentasCab231');
const utb_docVentasDet231 = require('./models/docVentasDet231');

// Activos
const utb_activosModel231 = require('./models/activosModel231');

// Productos
const utb_productosModel = require('./models/productosModel');

// Productos OS
const utb_productosOSModel = require('./models/productosOSModel');

// Productos OT
const utb_productosOTModel = require('./models/productosOTModel');

// Personal OS
const utb_personalOSModel = require('./models/personalOSModel');

// Metodos de sistema de OS
const utb_metodosSistemaModel = require('./models/metodosSistemaModel');

// sistemasModel
const utb_sistemasModel = require('./models/sistemasModel');

// Sistemas metodos OS
const utb_sistemasMetodosOSModel = require('./models/sistemasMetodosOSModel');

// Utilidades
const utb_utilidadesModel31 = require('./models/utilidadesModel31');

// Orden de compra - proveedor
const orq_ordenCompraModal  = require('./models/ordenCompraModal');

// Cliente proveedor
const orq_utbClienteModel = require('./models/utbClienteModel');

// Giro
const utb_giroModel231 = require('./models/giroModel231');

const orq_whatsAppLogModel 	= require('./models/whatsAppLogModel');
const orq_errorLogModel 	= require('./models/errorLogModel');

/**/
// DEVELOPS
const sequelize = new Sequelize(process.env.DB_database3, process.env.DB_user3, process.env.DB_password3,{
	host:process.env.DB_host3,
	dialect  : 'mysql',
	timezone : 'America/Lima',
	logging  : false,
	dialectOptions: {
		timezone: "local",
	}
});
/**/


const otModel = utb_otModel(sequelize,Sequelize);
const OSModel = utb_osModel(sequelize,Sequelize);
const User = userModel(sequelize,Sequelize);
const conjuntoOSModel = utb_conjuntoOSModel(sequelize,Sequelize);
// Doc ventas
const docVentasCab231 = utb_docVentasCab231(sequelize,Sequelize);
const docVentasDet231 = utb_docVentasDet231(sequelize,Sequelize);

// Activos
const activosModel231 = utb_activosModel231(sequelize,Sequelize);

// Productos OS
const productosOSModel = utb_productosOSModel(sequelize,Sequelize);

// Personal OS
const personalOSModel = utb_personalOSModel(sequelize,Sequelize);

// Metodos de sistema de OS
const metodosSistemaModel = utb_metodosSistemaModel(sequelize,Sequelize);

// sistemasModel
const sistemasModel = utb_sistemasModel(sequelize,Sequelize);

// Sistemas metodos OS
const sistemasMetodosOSModel = utb_sistemasMetodosOSModel(sequelize,Sequelize);

// Utilidades
const utilidadesModel31  = utb_utilidadesModel31(sequelize,Sequelize);


// orden Compra proveedor
const ordenCompraModal = orq_ordenCompraModal(sequelize,Sequelize);

// Cliente proveedor
const utbClienteModel = orq_utbClienteModel(sequelize,Sequelize);

// Giro
const giroModel231 = utb_giroModel231(sequelize,Sequelize);

const whatsAppLogModel 	  = orq_whatsAppLogModel(sequelize,Sequelize);
// Error Log
const errorLogModel 	  = orq_errorLogModel(sequelize,Sequelize);

// Productos OT
const productosOTModel = utb_productosOTModel(sequelize,Sequelize);

// Productos
const productosModel = utb_productosModel(sequelize,Sequelize);












module.exports = {
	sequelize,
	OSModel,
	User,
	conjuntoOSModel,
	otModel,
	docVentasCab231,
	docVentasDet231,
	activosModel231,
	productosOSModel,
	personalOSModel,
	metodosSistemaModel,
	sistemasModel,
	sistemasMetodosOSModel,
	utilidadesModel31,
	utbClienteModel,
	ordenCompraModal,
	giroModel231,
	whatsAppLogModel,
	errorLogModel,
	giroModel231 , 
	productosOTModel , 
	productosModel 
}
