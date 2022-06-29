// api_almacen.js

const router = require('express').Router();
const fs = require('fs'); 
//var fs  = require('path');
//var pdf = require('html-pdf');
var pdf = require("pdf-creator-node");

var moment = require('moment-timezone');
moment().tz("America/Lima").format();

const pdf2 = require("pdf-extraction");

const { 
    fichaInspeccionModel,User,plantillaDetalleModel,
    pteFichaInspModel,serviciosLocalFicInpecModel,
    fichaInspCertModel,fichaInspFactModel,localFichaInpecModel, formServFichaInspModel
} = require('../../../db');

const {check,validationResult} = require('express-validator');

const { Op } = require("sequelize");

const $IgvGeneral = 0.18;



//////////////////////////////////////////////////////////
//      			OBTENER ULTIMOS 100     			//
//////////////////////////////////////////////////////////
router.get('/:IdFicha',async(req,res)=>{

    var $IdFicha = req.params.IdFicha;

    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await pteFichaInspModel.findAll({
        where : {
            IdFichaInspeccion : $IdFicha
        }
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			OBTENER LISTA     			//
//////////////////////////////////////////////////////////
router.get('/lista',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await fichaInspeccionModel.findAll({
        where : {
            estado : 1
        },
        order : [
            ['Descripcion' , 'ASC']
        ]
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			AGREGAR PTE       			//
//////////////////////////////////////////////////////////
router.post('/', [
    check('IdFicha' ,'La ficha de inspección debe ser guardada primero').not().isEmpty(),
    check('IdPlantilla' ,'Seleccione una plantilla').not().isEmpty(),
] ,async (req,res)=>{
    // IdFicha, IdPlantilla

	const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}

    var $IdFicha  = req.body.IdFicha, $Version = 1;
	var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );

    req.body.UsuarioCreado = $userData.name;
    var $RepComercial = $userData.name;

    // Cargamos los datos de la ficha de inspeccion
    var $dataFicha = await fichaInspeccionModel.findOne({
        where : {
            IdFichaInspeccion : req.body.IdFicha
        }
    });
    // Fincha de inspección //

    // Cuantos PTE tiene esta ficha
    var NroPTEs = await pteFichaInspModel.count({
        where: {
            IdFichaInspeccion : req.body.IdFicha
        }
    });
    console.log(`Nro PTE en esta ficha => ${NroPTEs}>>>>>>>>>>`);
    NroPTEs = parseInt(NroPTEs);
    if( NroPTEs == 0 ){
        // Tomamos cuantos PTE tiene creados el usuario HOY...
        var CountPTEUsuario = await pteFichaInspModel.count({
            where : {
                CodUsuario  : $userData.dni ,
                Fecha       : moment().format('YYYY-MM-DD'),
                Estado      : 'Activo'
            },
            group : 'Fecha'
        });
        var NroPTEUsuario = 1;
        console.log(`Guardamos el Nro de PTE del usuario....`);
        var oDo = CountPTEUsuario.length;
        if ( oDo <= 0 ){
            //
        }else{
            //
            console.log('Hay => '+CountPTEUsuario[0].count);
            if( CountPTEUsuario[0].count > 0 ){
                NroPTEUsuario = CountPTEUsuario[0].count+1; 
            }
        }   
        // Actualizar Nro Pte en Ficha de inspeccion...
        await fichaInspeccionModel.update({ NroPte : NroPTEUsuario },{
            where : { idFichaInspeccion : req.body.IdFicha }
        });
    }else{
        // Tomamos el PTE que hemos guardado en la ficha nigga.
        NroPTEUsuario = $dataFicha.NroPte;
    }
    NroPTEUsuario = NroPTEUsuario.toString();
    NroPTEUsuario = NroPTEUsuario.padStart(2, "0");
    

    

    // Sumas...
    $Total = await serviciosLocalFicInpecModel.sum('Total', { where: { IdFichaInspeccion : req.body.IdFicha } }); // Total de los PTE
    $SubTotal = await serviciosLocalFicInpecModel.sum('SubTotal', { where: { IdFichaInspeccion : req.body.IdFicha } }); // Total de los PTE
    $IGV = await serviciosLocalFicInpecModel.sum('IGV', { where: { IdFichaInspeccion : req.body.IdFicha } }); // Total de los PTE




    

    // CUnatas PTE tiene esta ficha¿?
   await pteFichaInspModel.count({
        where : {
            IdFichaInspeccion : $IdFicha
        } 
    }).then(c => {
        console.log(">>>> Nro PTE creados " + c );
        var $NroPTE = parseInt( c );
        $Version = $NroPTE;
    });

    // Data de la facturacion
    var $dataFactura = await fichaInspFactModel.findOne({
        where : {
            IdFichaInspeccion : $IdFicha
        }
    });
    $response.fact = $dataFactura;
    // Data del certificado
    var $dataCert = await fichaInspCertModel.findOne({
        where : {
            IdFichaInspeccion : $IdFicha
        }
    });
    $response.cert = $dataCert;
    // Existe data de facturación¿?
    if(! $dataFactura ){
        $response.estado = 'ERROR';
        $response.error = 'Ingrese los datos de la pestaña FACTURACIÓN';
        res.json( $response );
        return true;
    }
    // Existe data de certificado¿?
    if(! $dataCert ){
        $response.estado = 'ERROR';
        $response.error = 'Ingrese los datos de la pestaña CERTIFICADO';
        res.json( $response );
        return true;
    }
    // Iniciales del usuario...
    var $InicialesUsuario = await inicialesUsuario( $RepComercial );
    var $Anio       = moment().format('YYYY');
    var $parFecha   = moment().format('DDMMYY');

    if( $dataFicha )
    {
        //
        var $dataInsert = {};
        $dataInsert.Version         = $Version;
        $dataInsert.UsuarioCreado   = $userData.name;
        $dataInsert.CodUsuario      = $userData.dni;
        $dataInsert.uu_id           = await renovarToken();
        $dataInsert.IdFichaInspeccion = req.body.IdFicha;
        $dataInsert.Nombre      = `PROPUESTA ECONOMICA Nº ${$parFecha}-OSA-${$InicialesUsuario}-${NroPTEUsuario}`;
        $dataInsert.NroFicha    = `00${$IdFicha}-${$Anio}`;
        $dataInsert.Fecha       = moment().format('YYYY-MM-DD');
        $dataInsert.IdCliente   = $dataFicha.DocCliente;
        $dataInsert.Cliente     = $dataFicha.NomCliente;
        $dataInsert.Contacto    = $dataFicha.NomSolicitante;
        $dataInsert.Direccion   = $dataFicha.DireccionFiscal;
        // Montos ($IgvGeneral)
        var $nSubTotal = $Total;
        var $nIGV = $Total * $IgvGeneral;
        var $nTotal = parseFloat($nSubTotal) + parseFloat($nIGV);
        
        
        //
        $dataInsert.SubTotal    = $nSubTotal;
        $dataInsert.Igv         = $nIGV;
        $dataInsert.Total       = $nTotal;
        // Servicios...
        var $Servicios = await serviciosLocalFicInpecModel.findAll({
            where : {
                IdFichaInspeccion : $IdFicha
            }
        });
        var $Arservicios = [];
        for( $i = 0; $i < $Servicios.length; $i++ )
        {
            var $row = $Servicios[$i];
            if ( $row.IdServicio != null ){
                console.log( '+++++++++++++++++++++++++++++++++'+$row.Servicio);
                //console.log(`Servicio => `+$row.Servicio);
                $Arservicios.push( '-'+$row.Servicio);
            }
            console.log($Arservicios);
        }
        $dataInsert.Servicios   = $Arservicios.join('<br/>');
        $dataInsert.IdEjecutivo = $userData.dni;
        $dataInsert.Ejecutivo   = $userData.name;
        $dataInsert.MailEjecutivo           = $userData.email;
        $dataInsert.EspecificacionServicio  = $dataFicha.Glosa;
        $dataInsert.Moneda      = 'PEN';
        $dataInsert.Validez     = '30 DÍAS';
        if( $dataFactura ){
            $dataInsert.FormaPago   = $dataFactura.CondicionPago;
        }else{
            $dataInsert.FormaPago   = '-NO DEFINIDA LA FACTURACION-';
        }
        // Plantilla tipo (1);
        var $dataPlantilla = await plantillaDetalleModel.findOne({
            where : {
                id_plantilla : req.body.IdPlantilla,
                Tipo : 1
            }
        });
        $dataInsert.OC_Trans = $dataPlantilla.Contenido;
        // Plantilla tipo (2)
        $dataPlantilla = await plantillaDetalleModel.findOne({
            where : {
                id_plantilla : req.body.IdPlantilla,
                Tipo : 2
            }
        });
        // Salto de linea a BR...
        var Contenido = $dataPlantilla.Contenido;
        //var Contenido.replace(`/(?:\r\n|\r|\n)/g`, '<br>');
        $dataInsert.Depositar_a =  $dataPlantilla.Contenido;
        // Plantilla tipo (3)
         $dataPlantilla = await plantillaDetalleModel.findOne({
            where : {
                id_plantilla : req.body.IdPlantilla,
                Tipo : 3
            }
        });
        $dataInsert.Cta_Detracciones = $dataPlantilla.Contenido;
        // Plantilla tipo (4)
        $dataPlantilla = await plantillaDetalleModel.findOne({
            where : {
                id_plantilla : req.body.IdPlantilla,
                Tipo : 4
            }
        });
        $dataInsert.InstaServicio = $dataPlantilla.Contenido;
        // Plantilla tipo (5)
        $dataPlantilla = await plantillaDetalleModel.findOne({
            where : {
                id_plantilla : req.body.IdPlantilla,
                Tipo : 5
            }
        });
        $dataInsert.SobreCosto  = $dataPlantilla.Contenido;
        //$dataInsert.Estado
        //$dataInsert.id_empresa
        //$dataInsert.empresa
    }

    $response.data = await pteFichaInspModel.create( $dataInsert );
    $response.data = await pteFichaInspModel.findOne({
        where : {
            uu_id : $dataInsert.uu_id
        }
    });
    // PTE creado ahora creamos su achivo html con el contenido TERRIBLE!
    escribePTE( $response.data );
    // - //

    $response.lista = await pteFichaInspModel.findAll({
        where : {
            IdFichaInspeccion : $IdFicha
        }
    });

	res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////
//          CARGAR PTE            //
//////////////////////////////////////////
router.post('/get_data', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    $response.data = await pteFichaInspModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
    
    res.json( $response );
});
// ---------------------------------------


//////////////////////////////////////////
//          CHECK ESTADO PTE            //
//////////////////////////////////////////
router.post('/check', async (req,res)=>{
    // IdFicha
    var $response = {};
    $response.estado = 'OK';
    $response.n = [];
    var $userData = await getUserData( req.headers['api-token'] );

    var $IdFicha  = req.body.IdFicha;

    await pteFichaInspModel.count({
        where : {
            IdFichaInspeccion : $IdFicha,
            Estado : 'Activo'
        } 
    }).then(c => {
        $response.n = c;
    });

    res.json( $response );
});

// ---------------------------------------

//////////////////////////////////////////
//      ANULAR LOS PTE ANTERIORES       //
//////////////////////////////////////////
router.post('/supress', async (req,res)=>{
    // IdFicha
    var $response = {};
    $response.estado = 'OK';
    $response.n = [];

    var $IdFicha  = req.body.IdFicha;
    var $userData = await getUserData( req.headers['api-token'] );

    await pteFichaInspModel.update({
        Estado : 'Anulado',
        UsuarioAnulado : $userData.name,
        deleted_at : moment().format('YYYY-MM-DD HH:mm:ss')
    },{
		where : { 
            IdFichaInspeccion : $IdFicha,
        }
    });

    $response.data = await pteFichaInspModel.findAll({
        where : {
            IdFichaInspeccion : $IdFicha
        }
    });

    res.json( $response );
});

// ---------------------------------------

//////////////////////////////////////////
//            ACTUALIZAR PTE            //
//////////////////////////////////////////
router.put('/:uuid', [
    check('IdFichaInspeccion' ,'La ficha de inspección debe ser guardada primero').not().isEmpty(),
], async (req,res)=>{
    // IdAlmacen
    const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
    }

    var $response = {};
    $response.estado = 'OK';
    var $userData = await getUserData( req.headers['api-token'] );
    $response.data = [];

    // Auditoria
    req.body.UsuarioModificado = $userData.name;

    var $dataFI = await pteFichaInspModel.findOne({
        where : {
            uu_id : req.params.uuid 
        }
    });

    // Servicios...
    var $Servicios = await serviciosLocalFicInpecModel.findAll({
        where : {
            IdFichaInspeccion : $dataFI.IdFichaInspeccion,
        }
    });
    var $Arservicios = [];
    for( $i = 0; $i < $Servicios.length; $i++ )
    {
        var $row = $Servicios[$i];
        if ( $row.IdServicio != null ){
            console.log( '+++++++++++++++++++++++++++++++++'+$row.Servicio);
            //console.log(`Servicio => `+$row.Servicio);
            $Arservicios.push( '-'+$row.Servicio);
        }
        console.log($Arservicios);
    }
    req.body.Servicios   = $Arservicios.join('<br/>');

    // Data de la facturacion
    var $dataFactura = await fichaInspFactModel.findOne({
        where : {
            IdFichaInspeccion : $dataFI.IdFichaInspeccion,
        }
    });
    if( $dataFactura ){
        req.body.FormaPago   = $dataFactura.CondicionPago;
    }
    // Data del certificado
    var $dataCert = await fichaInspCertModel.findOne({
        where : {
            IdFichaInspeccion : $dataFI.IdFichaInspeccion,
        }
    });

	await pteFichaInspModel.update(req.body,{
		where : { 
            uu_id : req.params.uuid 
        }
    });
    $response.data = await pteFichaInspModel.findOne({
        where : {
            uu_id : req.params.uuid 
        }
    });
    // PTE creado ahora creamos su achivo html con el contenido TERRIBLE!
    escribePTE( $response.data );
    // - //
    $response.lista = await pteFichaInspModel.findAll({
        where : {
            IdFichaInspeccion : req.body.IdFichaInspeccion
        }
    });

    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////
//       ELIMINAR PTE            //
//////////////////////////////////////////
router.delete('/:IdAlmacen', async (req,res)=>{
    // IdAlmacen
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $userData = await getUserData( req.headers['api-token'] );

    // Auditoria
    delete req.body.UsuarioMod;
    // delete req.body.editado_por;
    req.body.anulado_por = $userData.name;

    $anuladoPor = $userData.name;

	await fichaInspeccionModel.update({
        estado      : 0,
        UsuarioMod : $anuladoPor
    },{
		where : { 
            IdAlmacen : req.params.IdAlmacen 
        }
    });
    var $dataEntidad = await fichaInspeccionModel.findOne({
        where : {
            IdAlmacen : req.params.IdAlmacen 
        }
    });
    
    // obtener los datos
    console.log( $dataEntidad.id_empresa );
    if( $dataEntidad )
    {
        $response.data = await fichaInspeccionModel.findAll({
            where : {
                id_empresa : $dataEntidad.id_empresa
            }
        });
    }
    
    res.json( $response );
});

// -------------------------------------------------------

//////////////////////////////////////////
//              GENERAR PDF             //
//////////////////////////////////////////
router.post('/make', async (req,res)=>{
    // uuid
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    var $userData = await getUserData( req.headers['api-token'] );

    var $dataPTE = await pteFichaInspModel.findOne({
        where : {
            uu_id : req.body.uuid
        }
    });
    if( $dataPTE )
    {
        /**/
        // GENERAR PDF
        var $archivo_PTE_HTML   = './assets/pte/PTE_'+$dataPTE.uu_id+'.html';
        var $archivo_PTE_PDF    = "./assets/pte/PTE_"+$dataPTE.uu_id+'.pdf';
        // Read HTML Template /// "./assets/ficha.html"
        var html = fs.readFileSync( $archivo_PTE_HTML , 'utf8' );
        var options = {
            format : "A3",
            orientation : "portrait",
            border : "1mm",
            height : "10mm",
            header : {
                height   : "1mm",
                //contents : '<div style="text-align: center;">Author: Salubridad Saneamiento Ambiental y Servicios S.A.C.</div>'
            },
            "footer": {
                    "height"    : "2mm",
                    "contents"  : {
                    //first       : 'Cover page',
                    //2       : 'Second page', // Any page number is working. 1-based index
                    default : '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', 
                    //last    : 'Last Page'
                }
            }
        }

        var users = [
            {
                name:"Dany De la Cruz",
                age:"@drdelacruzm"
            },
            {
                name:"Navjot",
                age:"26"
            },
            {
                name:"Vitthal",
                age:"26"
            }
        ]
        var document = {
            html: html,
            data: {
                users: users
            },
            path : $archivo_PTE_PDF
        }

        pdf.create(document, options)
        .then(res => {
            console.log(res)
        })
        .catch(error => {
            console.error(error)
        });
        /**/
    }

    
    res.json( $response );
});

// -------------------------------------------------------

//////////////////////////////////////////
//              EXTRAER PDF             //
//////////////////////////////////////////
router.post('/get_text', async (req,res)=>{
    //
    let dataBuffer = fs.readFileSync( './assets/1.pdf' );
    //
    pdf2(dataBuffer).then(function (data) {
        // number of pages
        console.log(data.numpages);
        // number of rendered pages
        console.log(data.numrender);
        // PDF info
        console.log(data.info);
        // PDF metadata
        console.log(data.metadata);
        // PDF.js version
        // check https://mozilla.github.io/pdf.js/getting_started/
        console.log(data.version);
        // PDF text
        console.log(data.text);
    });
    //
});

// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------
async function inicialesUsuario( $nombre )
{
    //
    var $name = $nombre;
    var $arTextos = $name.split(' ');
    //console.log($arTextos);
    var $ArIniciales = [];

    for (let index = 0; index < $arTextos.length-1; index++) {
        const element = $arTextos[index];
        var str = element;
        if( element != '' ){
            var res = str.substring(0,1);
            $ArIniciales.push( res );
        }
    }
    //
    var $texto = $ArIniciales.join('');
    return $texto;
}
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
async function getUserData( $token )
{
    var $data;
    $data = await User.findOne({
        attributes: ['id', 'uu_id','name', 'email','dni','api_token','id_empresa','empresa','celular'],
        where : {
            api_token : $token
        }
    });
    return $data;
}
// -------------------------------------------------------
async function escribePTE( fichaData )
{
    // - //
    var $archivo_PTE_HTML = './assets/pte/'+'PTE_'+fichaData.uu_id+'.html';
    // Servicios...
    var $itemsTD = ``;
    var $Servicios = await serviciosLocalFicInpecModel.findAll({
        where : {
            IdFichaInspeccion : fichaData.IdFichaInspeccion,
        }
    });
    // Tipo : {[Op.gte] : 'Servicio' }
    // IdServicio : { [Op.notIn ]: [14,6] }
    var $igvPercent = 0.18;
    var $totalDoc = 0, $subTotalDoc = 0, $igvDoc = 0;
    if( $Servicios != undefined ){
        var $Moneda = 'Soles', $SimbMoneda = 'S/';
        console.log('Pinchi moneda ->'+fichaData.Moneda);
        if( fichaData.Moneda != 'PEN' ){
            $Moneda = 'Dolares';
            $SimbMoneda = '$';
        }
        var $CSGO = 1;
        for ( let index = 0; index < $Servicios.length; index++ )
        {
            // - //
            const value = $Servicios[index];
            const ArrIdServicios = [ 14 , 6], $IdServicio = parseInt( value.IdServicio );

            var dataLocal = await localFichaInpecModel.findOne({
                where : { id : value.IdLocal }
            });
            var formLocalServ = await formServFichaInspModel.findOne({
                where : { IdLocal : value.IdLocal }
            });
            // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            if( value.Tipo == 'Servicio' ){
                var AreaData = ``;
                // - //
                switch( $IdServicio ){
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                    case 7:
                    case 8:
                    case 9:
                    case 10:
                    case 13:
                    case 15:
                    case 18:
                    case 19:
                        AreaData = formLocalServ.block3_dato3;
                    break;
                    case 12:
                        // Manejo de residuos
                        AreaData = formLocalServ.block5_dato7;
                    break;
                    case 17:
                        // Fumigación de Fosfina
                        AreaData = formLocalServ.block6_dato2;
                    break;
                }
                console.log('Area => '+AreaData);
                if( AreaData != '' ){
                    //
                    $itemsTD += `<tr style="font-weight: 600;" >`;
                        $itemsTD += `<td>${$CSGO}</td>`;
                        $itemsTD += `<td>${value.Local}</td>`;
                        if( dataLocal ){
                            $itemsTD += `<td>${dataLocal.Direccion}</td>`;
                        }else{
                            $itemsTD += `<td>.</td>`;
                        }
                        // Servicios
                        $itemsTD += `<td>${value.Servicio}</td>`;
                        // Area del servicio (form local)
                        if( formLocalServ ){
                            $itemsTD += `<td>${AreaData}</td>`;
                        }else{
                            $itemsTD += `<td></td>`;
                        }
                        //
                        $itemsTD += `<td style="text-align:right" >${value.NroServicio}</td>`;
                        $itemsTD += `<td style="text-align:right" >${value.CostoUnitario}</td>`;
                        $itemsTD += `<td style="text-align:right" >${value.Total}</td>`;
                    $itemsTD += `</tr>`;
                    //
                }
                // ++++++++++++++++++++++++++++++++ //
            }else{
                // ++++++++++++++++++++++++++++++++ //
                // SERVICIOS DE TABLITAS
                if( ArrIdServicios.includes( $IdServicio ) ){
                    console.log('Serv. no listado ... '+value.Servicio);
                }else{
                    //
                    
                    $itemsTD += `<tr style="font-weight: 600;" >`;
                        $itemsTD += `<td>${$CSGO}</td>`;
                        $itemsTD += `<td>${value.Local}</td>`;
                        if( dataLocal ){
                            $itemsTD += `<td>${dataLocal.Direccion}</td>`;
                        }else{
                            $itemsTD += `<td>.</td>`;
                        }

                        if( value.IdServicio != null ){
                            // Servicios
                            $itemsTD += `<td>${value.Servicio}</td>`;
                            // Area del servicio (form local)
                            if( formLocalServ ){
                                $itemsTD += `<td>${formLocalServ.block3_dato3}</td>`;
                            }else{ $itemsTD += `<td></td>`; }
                            //
                            $itemsTD += `<td>${value.NroServicio}</td>`;
                            $Cant = parseFloat(value.NroServicio);
                        }else{
                            // Producto
                            switch( value.Tipo )
                            {
                                case 'Producto':
                                    $itemsTD += `<td>${value.Producto}</td>`;
                                    // Area del servicio (form local)
                                    if( formLocalServ ){
                                        $itemsTD += `<td>${formLocalServ.block3_dato3}</td>`;
                                    }else{ $itemsTD += `<td></td>`; }
                                    //
                                    $itemsTD += `<td style="text-align:right" >${value.NroAplicaciones}</td>`;
                                break;
                                case 'Tanque_Cisterna':
                                    // var $nombreTanque = `${value.NroServicio} `;
                                    $itemsTD += `<td>${value.Producto}</td>`;
                                    // Area del servicio (form local)
                                    if( formLocalServ ){
                                        $itemsTD += `<td>${value.Glosa}</td>`;
                                    }else{ $itemsTD += `<td></td>`; }
                                    //
                                    $itemsTD += `<td style="text-align:right" >${value.NroServicio}</td>`;
                                break;
                                case 'Pozo_Septico':
                                    // var $nombreTanque = `${value.NroServicio} `;
                                    $itemsTD += `<td>${value.Producto}</td>`;
                                    // Area del servicio (form local)
                                    if( formLocalServ ){
                                        $itemsTD += `<td>${value.Glosa}</td>`;
                                    }else{ $itemsTD += `<td></td>`; }
                                    //
                                    $itemsTD += `<td style="text-align:right" >${value.NroServicio}</td>`;
                                break;
                                case 'Residuos':
                                    $itemsTD += `<td>${value.Producto}</td>`;
                                    // Area del servicio (form local)
                                    if( formLocalServ ){
                                        $itemsTD += `<td>${value.Glosa}</td>`;
                                    }else{ $itemsTD += `<td></td>`; }
                                    //
                                    $itemsTD += `<td style="text-align:right" >${value.NroServicio}</td>`;
                                break;
                            }
                        }
                        $itemsTD += `<td style="text-align:right" >${value.CostoUnitario}</td>`;
                        $itemsTD += `<td style="text-align:right" >${value.Total}</td>`;
                    $itemsTD += `</tr>`;
                    $CSGO++;
                    //
                }
            }   
        }

    }
    var $revision = ``;
    console.log('Version ==>'+fichaData.Version);
    if( parseInt( fichaData.Version ) > 0 ){
        $revision = `REV-${fichaData.Version}`;
    }
    // - //
    var $html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>PTE #${fichaData.Nombre}</title>
    
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
    
        <style type="text/css">
    
            .header {
              background: #8a8a8a;
            }
    
            .header .columns {
              padding-bottom: 0;
            }
    
            .header p {
              color: #fff;
              margin-bottom: 0;
            }
    
            .header .wrapper-inner {
              padding: 20px; /*controls the height of the header*/
            }
    
            .header .container {
              background: #8a8a8a;
            }
    
            .wrapper.secondary {
              background: #f3f3f3;
            }
    
            td,th,p{
                font-family: Arial, Helvetica, sans-serif;
                font-size: 9px;
            }
            .bg-verde{
                background-color:#005300;color:#FFF
            }
            .tblItems td,th{
                font-size: 10px !important;
                padding-top 	: 6px;
                padding-bottom 	: 6px;
                padding-left 	: 8px;
                padding-right 	: 8px;
            }
            .tblItems .silver{
                border-bottom: 1px silver solid;
            }
            td{
                /**
                border:2px white solid;
                /**/
            }
            .borde1-l{
                border-left: 2px #000 solid;
            }
            .borde1-b{
                border-bottom: 2px #000 solid;
            }
            .borde1-r{
                border-right: 2px #000 solid;
            }
            .borde1-t{
                border-top: 2px #000 solid;
            }
            .center{
                text-align: center;
            }
            .borde2-l{
                border-left: 1px #000 solid;
            }
            .borde2-r{
                border-right: 1px #000 solid;
            }
            .borde2-b{
                border-bottom: 1px #000 solid;
            }
            .borde2-t{
                border-top: 1px #000 solid;
            }
            .table1 td{
                padding-top 	: 6px;
                padding-bottom 	: 6px;
                padding-left 	: 8px;
                padding-right 	: 8px;
            }
            .bg-puma-carranza{
                background-color: #FFFF99;
            }
            .titulo-verde{
                background-color:#005300;
                color:#FFF;
                font-weight: 700;
                padding-top 	: 6px;
                padding-bottom 	: 6px;
                padding-left 	: 8px;
                padding-right 	: 8px;
            }
            .table2 td{
                padding-top 	: 4px;
                padding-bottom 	: 4px;
                padding-left 	: 6px;
                padding-right 	: 6px;
            }
            .text-center{
                text-align: center;
            }
        </style>
        <!-- move the above styles into your custom stylesheet -->
    </head>
    <body>
    
        <table class=" borde1-r borde1-l borde1-b " style="width:100%" >
            <tbody>
                <!-- ////////////// 	VERSION		////////////// -->
                <tr>
                    <td>
                        <table style="width:100%" >
                            <tbody>
                                <tr>
                                    <td style="width:80%" ></td>
                                    <td style="width:20%" >
                                        <table class=" borde1-l borde1-b borde1-r " style="width:100%" >
                                            <tbody>
                                                <tr>
                                                    <td  class=" borde1-b center " >FO - 47</td>
                                                </tr>
                                                <tr>
                                                    <td style="color:red;text-align: center;" >Revisión: ${fichaData.Version}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <!-- ******************* -->
                    </td>
                </tr>
                <!-- ////////////// 	HEADERS		////////////// -->
                <tr>
                    <td>
                        <table style="width:100%" >
                            <tbody>
                                <tr>
                                    <td style="width:20%;" >
                                        <img src="https://api2.ssays-orquesta.com/logo-ssays-2019-2.png" style="display:block;width: 340px;margin:0 auto;" alt="">
                                        <table style="width:100%" >
                                            <tbody>
                                                <tr>
                                                    <th style="text-align:left;font-weight:700;" >RUC:</th>
                                                    <td>20102187211</td>
                                                </tr>
                                                <tr>
                                                    <td colspan="2" >
                                                        Psje. General Vivanco N° 100 - PUEBLO LIBRE
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th style="text-align:left;font-weight:700;" >Fijo:</th>
                                                    <td>213-5660 Anexo: 135</td>
                                                </tr>
                                                <tr>
                                                    <th style="text-align:left;font-weight:700;" >Correo:</th>
                                                    <td>${fichaData.MailEjecutivo}</td>
                                                </tr>
                                                <tr>
                                                    <th style="text-align:left;font-weight:700;" >Contacto:</th>
                                                    <td>${fichaData.Ejecutivo}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                    <!-- **** COL 01 ***** -->
                                    <td>
                                        <table style="width:100%" >
                                            <tbody>
                                                <tr  style="background-color: #004E00;" >
                                                    <td colspan="2" class=" borde1-l borde1-r borde1-b borde1-t " >
                                                        <h3 style="margin:0;padding-top:16px;padding-bottom:16px;text-align: center;color:#FFF;font-weight: bold;" >${fichaData.Nombre} ${$revision}</h3>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <table cellspacing="0" border="0" style="width:100%" class=" table1 " >
                                            <tbody style="font-weight: 600;"  >
                                                
                                                <tr>
                                                    <td colspan="2" style="height: 10px;" ></td>
                                                </tr>
                                                <tr >
                                                    <td class="  borde2-l borde2-t "  >
                                                        FICHA DE INSPECCION:
                                                    </td>
                                                    <td class="bg-puma-carranza borde2-l borde2-t borde2-r " >
                                                    ${fichaData.NroFicha}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class=" borde2-l borde2-t "  >
                                                        FECHA:
                                                    </td>
                                                    <td class="bg-puma-carranza borde2-l borde2-t borde2-r " >
                                                        ${fichaData.Fecha}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class=" borde2-l borde2-t " >
                                                        CLIENTE:
                                                    </td>
                                                    <td class="bg-puma-carranza borde2-l borde2-t borde2-r " >
                                                    ${fichaData.Cliente}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class=" borde2-l borde2-t " >
                                                        RUC:
                                                    </td>
                                                    <td class="bg-puma-carranza borde2-l borde2-t borde2-r " >
                                                    ${fichaData.IdCliente}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class=" borde2-l borde2-t " >
                                                        CONTACTO:
                                                    </td>
                                                    <td class="bg-puma-carranza borde2-l borde2-t borde2-r " >
                                                    ${fichaData.Contacto}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class=" borde2-l borde2-t " >
                                                        DIRECCION FISCAL:
                                                    </td>
                                                    <td class="bg-puma-carranza borde2-l borde2-t borde2-r " >
                                                    ${fichaData.DireccionFiscal}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class=" borde2-l borde2-t borde2-b " >
                                                        SERVICIOS:
                                                    </td>
                                                    <td class="bg-puma-carranza borde2-l borde2-t borde2-r borde2-b " >
                                                    ${fichaData.Servicios}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                    <!-- **** COL 01 ***** -->
                                </tr>
                            </tbody>
                        </table>
                        <!-- ******************* -->
                    </td>
                </tr>
                <!-- ////////////////////////////////////// -->
                <tr>
                    <td style="height:20px;" ></td>
                </tr>
                <!-- ////////////// 	DETALLE DE ITEMS		////////////// -->
                <tr>
                    <td>
                        <table style="width:100%" class=" tblItems " cellspacing="0" border="0" >
                            <tbody>
                                <tr class=" bg-verde " >
                                    <th>ITEM</th>
                                    <th>SURCURSAL</th>
                                    <th>DIRECCION DEL SERVICIO</th>
                                    <th>DESCRIPCION DEL SERVICIO</th>
                                    <th>AREA/ VOL (m2/ m3)</th>
                                    <th>CANTIDAD</th>
                                    <th>COSTO UNITARIO (${$SimbMoneda})</th>
                                    <th>SUB TOTAL (${$SimbMoneda})</th>
                                </tr>
                                ${$itemsTD}
                                <tr style="font-weight: 600;" >
                                    <td colspan="7" style="text-align: right;" >
                                        SUBTOTAL
                                    </td>
                                    <td class=" silver "  style="text-align: right;" >${$SimbMoneda} ${fichaData.SubTotal}</td>
                                </tr>
                                <tr style="font-weight: 600;" >
                                    <td colspan="7" style="text-align: right;" >
                                        IGV (18)%
                                    </td>
                                    <td class=" silver "  style="text-align: right;" >${$SimbMoneda} ${fichaData.Igv}</td>
                                </tr>
                                <tr style="background-color:#005300;color:#FFF;font-weight: 600;" >
                                    <td colspan="7" style="text-align: right;" >
                                        TOTAL PRESUPUESTO (SOLES)
                                    </td>
                                    <td style="text-align: right;" >${$SimbMoneda} ${fichaData.Total}</td>
                                </tr>
                            </tbody>
                        </table>
                        <!-- ******************* -->
                    </td>
                </tr>
                <!-- ////////////// 	GLOSA		////////////// -->
                <tr>
                    <td>
                        <table style="width:100%" class=" borde2-l borde2-r borde2-b borde2-t " >
                            <tbody>
                                <tr>
                                    <td>
                                        <p style="font-weight: 700;" >Especificaciones del servicio:</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="height:70px" >${fichaData.EspecificacionServicio}</td>
                                </tr>
                            </tbody>
                        </table>
                        <!-- ******************* -->
                    </td>
                </tr>
                <!-- ////////////////////////////////////// -->
                <tr>
                    <td>
                        <table class=" titulo-verde " style="width:100%" >
                            <tbody>
                                <tr style="background-color:#005300;color:#FFF;font-weight: 600;" >
                                    <td colspan="2" >CONDICIONES COMERCIALES</td>
                                </tr>
                            </tbody>
                        </table>
                        <table style="width:100%" class="table2 " >
                            <tbody>
                                
                                <tr>
                                    <td class="borde2-t borde2-l" style="width:40%;font-weight: 600;" >
                                        EXPRESADO EN:
                                    </td>
                                    <td class="borde2-t borde2-l borde2-r" >
                                    ${$Moneda}
                                    </td>
                                </tr>
                                <!-- $$$$$$$$$$$$$$$$$$$$$ -->
                                <tr>
                                    <td class="borde2-t borde2-l" style="font-weight: 600;" >
                                        VALIDEZ DE LA PROPUESTA:
                                    </td>
                                    <td class="borde2-t borde2-l borde2-r" >
                                    ${fichaData.Validez}
                                    </td>
                                </tr>
                                <!-- $$$$$$$$$$$$$$$$$$$$$ -->
                                <tr>
                                    <td class="borde2-t borde2-l" style="font-weight: 600;" >
                                        FORMA DE PAGO:
                                    </td>
                                    <td class="borde2-t borde2-l borde2-r" >
                                    ${fichaData.FormaPago}
                                    </td>
                                </tr>
                                <!-- $$$$$$$$$$$$$$$$$$$$$ -->
                                <tr>
                                    <td class="borde2-t borde2-l"  style="font-weight: 600;" >
                                        ORDEN DE COMPRA/ TRANSFERENCIA A NOMBRE DE:
                                    </td>
                                    <td class="borde2-t borde2-l borde2-r" >
                                    ${fichaData.OC_Trans}
                                    </td>
                                </tr>
                                <!-- $$$$$$$$$$$$$$$$$$$$$ -->
                                <tr>
                                    <td class="borde2-t borde2-l" style="font-weight: 600;" >
                                        DEPOSITAR A:
                                    </td>
                                    <td class="borde2-t borde2-l borde2-r" >
                                    ${fichaData.Depositar_a}
                                    </td>
                                </tr>
                                <!-- $$$$$$$$$$$$$$$$$$$$$ -->
                                <tr>
                                    <td class="borde2-t borde2-l" style="font-weight: 600;" >
                                        CUENTA DE DETRACCIONES:
                                    </td>
                                    <td class="borde2-t borde2-l borde2-r" >
                                    ${fichaData.Cta_Detracciones}
                                    </td>
                                </tr>
                                <!-- $$$$$$$$$$$$$$$$$$$$$ -->
                                <tr>
                                    <td  class="borde2-t borde2-l" style="font-weight: 600;" >
                                        INSTALACIÓN DEL SERVICIO:
                                    </td>
                                    <td class="borde2-t borde2-l borde2-r" >
                                    ${fichaData.InstaServicio}
                                    </td>
                                </tr>
                                <!-- $$$$$$$$$$$$$$$$$$$$$ -->
                                <tr>
                                    <td class="borde2-t borde2-l borde2-b " style="font-weight: 600;" >
                                        SOBRECOSTOS:
                                    </td>
                                    <td class="borde2-t borde2-l borde2-r borde2-b " >
                                    ${fichaData.SobreCosto}
                                    </td>
                                </tr>
                                <!-- $$$$$$$$$$$$$$$$$$$$$ -->
                            </tbody>
                        </table>
                        <!-- ******************* -->
                    </td>
                </tr>
                <!-- ////////////////////////////////////// -->
                <tr>
                    <td>
                        <table style="width:100%;padding-top:110px;" >
                            <tbody>
                                <tr>
                                    <td style="text-align:center;font.font-weight: 700;width:49%" >
                                        ANTONIO ROBLES ZAPATA<br/>
                                        GERENTE GENERAL<br/>
                                        SSAYS SAC
                                    </td>
                                    <td style="text-align:center;font.font-weight: 700;width:49%" >
                                        ${fichaData.Ejecutivo}<br/>
                                        SUPERVISOR COMERCIAL<br/>
                                        SSAYS SAC
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <!-- ******************* -->
                    </td>
                </tr>
                <!-- ////////////////////////////////////// -->
                <!-- ////////////////////////////////////// -->
                <!-- ////////////// 	FFFFFFF		////////////// -->
            </tbody>
        </table>
                
    </body>
    </html>
    
    
    
    
    `;
    // | writeFile | appendFile |
    await fs.writeFile( $archivo_PTE_HTML , $html , function (err) {
        if (err) throw err;
        console.log('se ha creado el PTE en html');
    });
    // - //
}
// -------------------------------------------------------

module.exports = router;