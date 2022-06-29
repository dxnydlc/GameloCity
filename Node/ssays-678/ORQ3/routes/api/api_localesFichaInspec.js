// api_localesFichaInspec

const router = require('express').Router();

const { Film,localFichaInpecModel,distrito2Model,
	departamentoModel,sucursalModel,
    provinciaModel  } = require('../../db');

const {check,validationResult} = require('express-validator');


//////////////////////////////////////////////////////////
//              TODOS LOS LOCALES UNA FICHA             //
//////////////////////////////////////////////////////////
router.get('/:IdFicha',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';

	$response.data = await localFichaInpecModel.findAll({
        order:
        [
            ['id','ASC']
        ],
        where : {
            IdFichaInspeccion : req.params.IdFicha,
            Estado : 'Activo'
        }
    });
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      AGREGAR UN LOCAL DE FICHA DE INSPECCION         //
//////////////////////////////////////////////////////////
router.post('/', [
    check('NombreLocal' ,'El nombre es obligatorio').not().isEmpty(),
    check('Contacto' ,'El Contacto es obligatorio').not().isEmpty(),
    check('Departamento' ,'Departamento es obligatorio').not().isEmpty(),
    check('Provincia' ,'Provincia es obligatorio').not().isEmpty(),
    check('Distrito' ,'Distrito es obligatorio').not().isEmpty(),
    check('NombreCalle' ,'Nombre de calle es obligatorio').not().isEmpty(),
    check('NroCalle' ,'Número de calle es obligatorio').not().isEmpty()
] ,async (req,res)=>{

    const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
    }

    var $response = {};
    $response.estado = 'OK';
    $response.local = 'FichaInspe';

    var $nombre = req.body.NombreLocal;
    req.body.NombreLocal = $nombre.toUpperCase();

    await localFichaInpecModel.create( req.body );
    $response.data = await localFichaInpecModel.findOne({
        where : {
            uu_id : req.body.uu_id
        }
    });
    // Obtener los demás
    $response.lista = await localFichaInpecModel.findAll({
        order:
        [
            ['id','ASC']
        ],
        where : {
            IdFichaInspeccion : req.body.IdFichaInspeccion
        }
    });
    
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      COPIAR UN LOCAL DE FICHA DE INSPECCION         //
//////////////////////////////////////////////////////////
router.post('/copia_desde_cliente' ,async (req,res)=>{
    // IdLocal, IdFicha

    var $response = {};
    $response.estado = 'OK';
    $response.local = 'FichaInspe';

    //var $nombre = req.body.NombreLocal;
    //req.body.NombreLocal = $nombre.toUpperCase();

    var $LocalOrigin = await sucursalModel.findOne({
        where : {
            IdSucursal : req.body.IdLocal
        }
    });

    // Este local ya existe dentro de la lista?
    var $prevExiste = await localFichaInpecModel.findOne({
        where : {
            IdFichaInspeccion : req.body.IdFicha,
            IdLocalOrigin     : req.body.IdLocal
        }
    });
    if( $prevExiste ){
        $response.estado = 'ERROR';
        $response.error = 'El local ya existe en la lista';
        res.json( $response );
    }else{
        //
        if( $LocalOrigin )
        {
            //
            var $dataInsert     = {};
            $dataInsert.Origen  = 'Existe';
            $dataInsert.uu_id   = await renovarToken();
            $dataInsert.IdLocalOrigin       = $LocalOrigin.IdSucursal;
            $dataInsert.IdFichaInspeccion   = req.body.IdFicha;
            $dataInsert.NombreLocal  = $LocalOrigin.Descripcion;
            $dataInsert.Contacto     = $LocalOrigin.Contacto;
            $dataInsert.Departamento = $LocalOrigin.Departamento;
            $dataInsert.Provincia    = $LocalOrigin.Provincia;
            $dataInsert.Distrito     = $LocalOrigin.Distrito;
            $dataInsert.TipoDir      = $LocalOrigin.TipoDir;
            $dataInsert.NombreCalle  = $LocalOrigin.NombreCalle;
            $dataInsert.NroCalle     = $LocalOrigin.NroCalle;
            $dataInsert.Direccion = $LocalOrigin.Direccion;
            $dataInsert.lat       = $LocalOrigin.lat;
            $dataInsert.lng       = $LocalOrigin.lng;
            //
        }
        await localFichaInpecModel.create( $dataInsert )
        .then(() => {
            //logger.info('Successfully established connection to database')
        })
        .catch((err) => {
            esrcribeError( err );
        });
        //
        $response.item = await localFichaInpecModel.findOne({
            where : {
                uu_id : $dataInsert.uu_id
            }
        });
        // Obtener los demás
        $response.data = await localFichaInpecModel.findAll({
            order:
            [
                ['id','ASC']
            ],
            where : {
                IdFichaInspeccion : req.body.IdFicha
            }
        });
        //
    }

        
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      ACTUALIZAR UN LOCAL DE FICHA DE INSPECCION      //
//////////////////////////////////////////////////////////
router.put('/:uuid', [
    check('NombreLocal' ,'El nombre es obligatorio').not().isEmpty(),
    check('Contacto' ,'El Contacto es obligatorio').not().isEmpty(),
    check('Departamento' ,'Departamento es obligatorio').not().isEmpty(),
    check('Provincia' ,'Provincia es obligatorio').not().isEmpty(),
    check('Distrito' ,'Distrito es obligatorio').not().isEmpty(),
    check('NombreCalle' ,'Nombre de calle es obligatorio').not().isEmpty(),
    check('NroCalle' ,'Número de calle es obligatorio').not().isEmpty()
] ,async (req,res)=>{
    const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
    }

    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    var $nombre = req.body.NombreLocal;
    req.body.NombreLocal = $nombre.toUpperCase();

	await localFichaInpecModel.update(req.body,{
		where : { uu_id : req.params.uuid }
    });
    $response.data = await localFichaInpecModel.findOne({
        where : {
            uu_id : req.params.uuid
        }
    });
    // Obtener los demás
    $response.lista = await localFichaInpecModel.findAll({
        order:
        [
            ['id','ASC']
        ],
        where : {
            IdFichaInspeccion : req.body.IdFichaInspeccion
        }
    });
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//         ANULAR UN LOCAL DE FICHA DE INSPECCION       //
//////////////////////////////////////////////////////////
router.delete('/:filmID', async (req,res)=>{

    var $response = {};
    $response.estado = 'OK';

	await localFichaInpecModel.update({
        Estado : 'Anulado'
    },{
		where : { id : req.params.filmID }
	});
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//              OBTENER UN DATOS DE UN LOCAL            //
//////////////////////////////////////////////////////////
router.post('/getdata/:uuid' ,async (req,res)=>{
    // el uuid del local
	
	var $response = {};
    $response.estado = 'OK';
    $response.encontrado = 'NO';

    $response.departamento = [];
    $response.provincia = [];
    $response.distrito = [];
	
	$response.data = await localFichaInpecModel.findOne({
        where : {
            uu_id : req.params.uuid
        }
    });
    if( $response.data )
    {
        $response.encontrado = 'SI';
        var $rs = $response.data;
        // Departamentos
        $response.departamento = await departamentoModel.findAll({
            order : [
                [ 'name' , 'ASC' ]
            ]
        });
        // Provincias
        if( $rs.Provincia != undefined )
        {
            $response.provincia = await provinciaModel.findAll({
                order : [
                    [ 'name' , 'ASC' ]
                ],
                where : {
                    department_id : $rs.Departamento
                }
            });
        }
        // Distritos
        if( $rs.Distrito != undefined )
        {
            $response.distrito = await distrito2Model.findAll({
                order : [
                    [ 'name' , 'ASC' ]
                ],
                where : {
                    province_id : $rs.Provincia
                }
            });
        }
    }
	
	res.json( $response );
});
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------

async function renovarToken()
{
    var length = 12;
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    result += '-';
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    result += '-';
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
// -------------------------------------------------------
async function esrcribeError( error )
{
    var $file = './assets/errores/log.txt';
    try {
        if (fs.existsSync( $file ) ) {
            await fs.appendFile( $file , error , function (err) {
                if (err) throw err;
                console.log('Se agregó un error');
            });
        }else{
            await fs.writeFile( $file , error , function (err) {
                if (err) throw err;
                console.log('Se escribió un error');
            });
        }
    } catch(err) {
        console.error(err)
    }
        
}
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------

module.exports = router;
