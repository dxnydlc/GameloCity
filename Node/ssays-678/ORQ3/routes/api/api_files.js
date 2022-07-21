
// api_files.js

const router = require('express').Router();
const fs = require('fs'); 
var pdf = require("pdf-creator-node");
var moment = require('moment-timezone');
moment().tz("America/Lima").format();
const pdf2 = require("pdf-extraction");
const sizeOf = require('image-size');
const { sizeof } = require("file-sizeof");
const fileUrl = require('file-url');
const express = require('express');
var $APP_PATH = process.env.RUTA_PROYECTO;
const _RUTA_PROYECTO = process.env.RUTA_PROYECTO;
const _img404 = `${_RUTA_PROYECTO}adjuntos/404-001.jpg`;

const dotenv = require('dotenv');
dotenv.config();

const _RUTA_ORQ3 = process.env.RUTA_ORQ3;

// Ficha sintomatologia
const URL_FICHASINT = process.env.URL_FICHASINT;

// Exportar a EXCEL
const excel = require('node-excel-export');

const { fichaTecnicaTrabajoOTModel, pteFichaInspModel , User , archiGoogleModel, capacitacionModel, capacitacionDetModel, tareoModel, tareoDetalle3Model, tareoSubModel, turnoCabModel, fichaSintoModel, archivoConstSupModel } = require('../../db');

const {check,validationResult} = require('express-validator');


// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
tareoDetalle3Model.belongsTo(tareoSubModel,{
	as : 'DetTar4', foreignKey 	: 'id',targetKey: 'IdDetTareo',
});
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// You can define styles as json object
const styles = {
    celdita1 : {
        alignment : {
            horizontal  : 'left'
        },
        font : {
            sz : 9,
        }
    },
    celdita2 : {
        alignment : {
            horizontal  : 'center'
        },
        font : {
            sz : 8,
        },
        border :{
            bottom : {
                style : 'dashed', color : '1f7a29'
            }
        }
    },
    TituloSimple:{
        alignment : {
            vertical    : 'center',
            horizontal  : 'center'
        },
        font: {
            color: {
            rgb: '666'
            },
            sz: 10,
            bold: true,
        },
        border : {
            top : {
                style : 'dashed', color : '666'
            },
            bottom : {
                style : 'dashed', color : '666'
            },
            left:{
                style : 'dashed', color : '666'
            }
        }
    },
    headerDark: {
        fill: {
            fgColor: {
                rgb: '111430'
            }
        },
        alignment : {
            vertical    : 'center',
            horizontal  : 'center'
        },
        font: {
            color: {
            rgb: 'FFFFFFFF'
            },
            sz: 14,
            bold: true,
            underline: true
        }
    },
    cellVacio: {
        fill: {
            fgColor: {
                rgb: 'd1cec7'
            }
        }
    },
    cellGreen: {
        fill: {
            fgColor: {
            rgb: 'FF00FF00'
            }
        }
    }
};
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//////////////////////////////////////////////////////////
//                  TRAER LISTA POR TOKEN            //
//////////////////////////////////////////////////////////
router.post('/get_by_token', async (req,res)=>{
    // token
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    $response.data = await archiGoogleModel.findAll({
        where : {
            token : req.body.token
        }
    });
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//      			OBTENER ULTIMOS 100     			//
//////////////////////////////////////////////////////////
router.get('/',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.ut = await getUserData( req.headers['api-token'] );

	$response.data = await almacenModel.findAll({
        order : [
            ['Descripcion' , 'ASC']
        ],
        limit : 10
    });

    res.json( $response );
});
// -------------------------------------------------------

////////////////////////////////////////////////////
//              MOSTRAR UN ARCHIVO                //
////////////////////////////////////////////////////
router.get('/show/:uuIdFile',async(req,res)=>{
	var $response = {};
  $response.estado = 'ERROR';
  const $data = await archiGoogleModel.findOne({
    where : {
      uu_id : req.params.uuIdFile
    }
  });

  if( $data ){
    $response.url = fileUrl('.'+$data.ruta_fisica+$data.nombre_fisico);
  }

  express.static(__dirname + '/public');

  //res.json( {success : __dirname } );
  
  res.sendFile( $data.ruta_fisica );
});
// // ------------------------------------------------------

////////////////////////////////////////////////////
//              MOSTRAR UN ARCHIVO                //
////////////////////////////////////////////////////
router.get('/400/:uuIdFile',async(req,res)=>{
	var $response = {};
  $response.estado = 'ERROR';
  const $data = await archiGoogleModel.findOne({
    where : {
      uu_id : req.params.uuIdFile
    }
  });

  if( $data ){
    $response.url = fileUrl('.'+$data.ruta_fisica+$data.url_400);
  }

  express.static(__dirname + '/public');

  //res.json( {success : __dirname } );
  
  res.sendFile( $data.url_400 );
});
// // ------------------------------------------------------

//////////////////////////////////////////
//           ZIP CERTIFICADO            //
//////////////////////////////////////////
router.get('/zip_certificado/:archivo', async (req,res)=>{
    // archivo
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];

    res.sendFile( $APP_PATH+'/assets/zip_certificados/'+req.params.archivo );

});

//////////////////////////////////////////////////////
//      MOSTRAR UN PTE DE FICHA DE INSPECCION       //
//////////////////////////////////////////////////////
router.get('/pte/:uuIdFile',async(req,res)=>{
    var $response = {};
    $response.estado = 'ERROR';
    try {
        const rutaPoryecto = process.env.RUTA_PROYECTO;
        //
        var $dataPTE = await pteFichaInspModel.findOne({
            where : {
                uu_id : req.params.uuIdFile 
            }
        });

        express.static(__dirname + '/public');
        var $rutaFilecillo = rutaPoryecto+"/assets/pte/PTE_"+$dataPTE.uu_id+".html";
        console.log($rutaFilecillo);
        //res.json( {success : __dirname } );
        if (fs.existsSync( $rutaFilecillo ) )
        {
            res.sendFile( $rutaFilecillo );
        }else{
            res.json( {msg : 'Archivo no existe: '+$dataPTE.uu_id} );
        }
    } catch (err) {
        esrcribeError( err );
    }
    
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  ELIMINAR DOCUMENTO                  //
//////////////////////////////////////////////////////////
router.delete('/:uuid', async (req,res)=>{
    // uuid es el padre , token es el hijo
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    var $userData = await getUserData( req.headers['api-token'] );

	await archiGoogleModel.destroy({
		where : { 
            uu_id : req.params.uuid 
        }
    });
    $response.data = await archiGoogleModel.findAll({
        where : {
            token : req.body.token
        }
    });
    $response.codigo = 200;
    $response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Eliminado.` };
    res.json( $response );
});
// -------------------------------------------------------

////////////////////////////////////////////////////
//              MOSTRAR UN ARCHIVO                //
////////////////////////////////////////////////////
router.get('/showg/:uuIdFile',async(req,res)=>{
	var $response = {};
  $response.estado = 'ERROR';
  const $data = await archiGoogleModel.findOne({
    where : {
      uu_id : req.params.uuIdFile
    }
  });

  if( $data ){
    $response.url = fileUrl('.'+$data.ruta_fisica+$data.nombre_fisico);
  }

  express.static(__dirname + '/public');

  //res.json( {success : __dirname } );
  
  res.sendFile( $data.ruta_fisica );
});

// -------------------------------------------------------
////////////////////////////////////////////////////
//     MOSTRAR UN ARCHIVO CONS SUPERVISIÓN        //
////////////////////////////////////////////////////
router.get('/showcs/:uuIdFile/:nombre',async(req,res)=>{
	var $response = {};
  $response.estado = 'ERROR';
  const $data = await archivoConstSupModel.findOne({
    where : {
      uu_id : req.params.uuIdFile
    }
  });
  console.log($data.ruta_fisica);
  if( $data ){
    $response.url = fileUrl('.'+$data.ruta_fisica);
  }

  express.static(__dirname + '/public');

  //res.json( {success : __dirname } );
  
  res.sendFile( $data.ruta_fisica );
});
// -------------------------------------------------------

////////////////////////////////////////////////////////
//    MOSTRAR DATOS DE UNA CARPETA DE CAPACITACIÓN    //
////////////////////////////////////////////////////////
router.get('/carpeta/:token',async(req,res)=>{
	var $response = {};
  $response.estado = 'OK';
  const $data = await archiGoogleModel.findAll({
    where : {
      token : req.params.token
    }
  });

  $response.data = $data;
  
  res.json( $response );
});
// -------------------------------------------------------

///////////////////////////////////////////////////////////
//          MOSTRAR DATOS DE UNA CAPACITACIÓN            //
//////////////////////////////////////////////////////////
router.get('/capa/:uuid',async(req,res)=>{
    var $response = {};
    $response.estado = 'OK';
    const $data = await capacitacionModel.findOne({
        attributes: [ 'Codigo', [ 'uu_id', 'token'] , 'Estado' , 'Titulo' , 'FechaHora' , 'FechaFin' , 'Cliente', 'Local' , 'Direccion' , 'LinkRepositorio' ],
        where : {
            uu_id : req.params.uuid
        }
    });
    $response.data = $data;
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//                  AGREGAR ASISTENTE                   //
//////////////////////////////////////////////////////////
router.post('/asistente/add', [
    check('IdColaborador' ,'Ingrese DNI').not().isEmpty(),
    check('Colaborador' ,'Ingrese su nombre').not().isEmpty()
] , async (req,res)=>{

    const errors = validationResult(req);
    if( ! errors.isEmpty() ){
        return res.status(422).json({ errores : errors.array() });
	}

    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    $response.item = [];
    var $where = {};
    var $userData = await getUserData( req.headers['api-token'] );
    
    // Ya existe en la lista¿?
    var _DNI = req.body.IdColaborador;
    var ExisteLista = await capacitacionDetModel.count({
        where : {
            Token : req.body.Token ,
            IdColaborador : _DNI
        }
    });
    console.log(ExisteLista);
    if( ExisteLista > 0 )
    {
        $response.estado = 'ERROR';
        $response.error  = '¡Gracias! ya tenemos tus datos en esta capacitación.';
    }else{
        req.body.Estado = 'Registro-Link';
        await capacitacionDetModel.create( req.body )
        .catch(function (err) {
            $response.estado = 'ERROR';
            $response.error  = err.original.sqlMessage;
            res.json( $response );
        });
        var _ItemInsertado = await capacitacionDetModel.findOne({
            where : {
                Token : req.body.Token
            }
        });
        $response.item = _ItemInsertado;
    }
    
    res.json( $response );
});
// -------------------------------------------------------

//////////////////////////////////////////////////////////
//              DESCARGAR EXCEL TAREO 001               //
//////////////////////////////////////////////////////////
router.get('/tareo/excel/:uuid', async (req,res)=>{
    // uuid
    console.log( req.params.uuid );
    var $response = {};
    $response.estado = 'OK';
    $response.data = [];
    // 999999999999999999999999999
    var _SubTitulo = ``, _Archivo = `No-Data.xlsx`;
    var _Dia = 0;//'Dia'+await pad_with_zeroes( req.body.Dia , 2 );
    var _ArCols = [];
    var _Detalle = [];
    var _Max = 0;
    // 999999999999999999999999999
    // Codios de turnos especiales donde se coloca la sumatoria de horas en lugar de solo el codigo
    var _ArCodigosEsp = [ 'DT' , 'SA' ];

    var _Tareo = await tareoModel.findOne({
        where : {
            uu_id : req.params.uuid
        }
    });

    if( _Tareo ){
        _Archivo = `Tareo ${_Tareo.Cliente} - ${_Tareo.Local} ${_Tareo.Anio}-${_Tareo.Mes}.xlsx`;
        var _Mes = _Tareo.Mes;
        switch( _Tareo.Mes )
			{
				case 'Abril':
				case 'Junio':
				case 'Septiembre':
				case 'Noviembre':
					_Max = 30;
				break;
				case 'Enero':
				case 'Marzo':
				case 'Mayo':
				case 'Julio':
				case 'Agosto':
				case 'Octubre':
				case 'Diciembre':
					_Max = 31;
				break;
				case 'Febrero':
					_Max = 29;
				break;
			}
        _SubTitulo = `DEL 01 DE ${_Tareo.Mes} AL ${_Max} DE ${_Tareo.Mes} DEL ${_Tareo.Anio}`;
        _Detalle = await tareoDetalle3Model.findAll({
            order : [
                [ 'Nombre' , 'DESC' ]
            ],
            where : {
                CodigoHeader : _Tareo.Codigo
            }
        });
        for (let index = 1; index <= _Max ; index++) {
            _ArCols.push(index+'-'+_Mes.substring(0,3));
        }
        console.log(_ArCols);
    }
    //Array of objects representing heading rows (very top)
    const heading = [
        [
            { value: 'REPORTE DE CONTROL DE  ASISTENCIA DE TITULARES (OL)', style: styles.headerDark }
        ],[
            { value: _SubTitulo, style: styles.headerDark }
        ],[ 
            '.' 
        ]
    ];

    //Here you specify the export structure
    const specification = {
        nro: { // <- the key should match the actual data key
            displayName : 'Nro', // <- Here you specify the column header
            headerStyle : styles.TituloSimple, // <- Header style
            width       : 20,
            cellStyle   : function(value, row) {
                return styles.celdita1
            }
        },
        cliente: { // <- the key should match the actual data key
            displayName : 'Cliente', // <- Here you specify the column header
            headerStyle : styles.TituloSimple, // <- Header style
            width       : 120,
            cellStyle   : function(value, row) {
                return styles.celdita1
            }
        },
        local: { // <- the key should match the actual data key
            displayName : 'Local', // <- Here you specify the column header
            headerStyle : styles.TituloSimple, // <- Header style
            cellStyle   : function(value, row) { // <- style renderer function
                return styles.celdita1
            },
            width: 120 // <- width in pixels
        },
        operario : {
            displayName: 'Operario',
            headerStyle: styles.TituloSimple,
            cellStyle   : function(value, row) { // <- style renderer function
                return styles.celdita1
            },
            width: 150
        },
        dni : {
            displayName: 'DNI',
            headerStyle: styles.TituloSimple,
            cellStyle: styles.celdita1, // <- Cell style
            width: 90 // <- width in pixels
        },
        cargo : {
            displayName: 'Cargo',
            headerStyle: styles.TituloSimple,
            cellStyle: styles.celdita1, // <- Cell style
            width: 100 // <- width in pixels
        },
        dia01 : {
            displayName: _ArCols[0],headerStyle: styles.TituloSimple,cellStyle: styles.celdita2,width: 30,
        },
        dia02 : {
            displayName: _ArCols[1],
            headerStyle: styles.TituloSimple,
            cellStyle: styles.celdita2, // <- Cell style
            width: 30 // <- width in pixels
        },
        dia03 : {
            displayName : _ArCols[2], headerStyle : styles.TituloSimple, cellStyle : styles.celdita2, width : 30,
        },
        dia04 : {
            displayName : _ArCols[3], headerStyle : styles.TituloSimple, cellStyle : styles.celdita2, width : 30,
        },
        dia05 : {
            displayName : _ArCols[4], headerStyle : styles.TituloSimple, cellStyle : styles.celdita2, width : 30,
        },
        dia06 : {
            displayName : _ArCols[5], headerStyle : styles.TituloSimple, cellStyle : styles.celdita2, width : 30,
        },
        dia07 : {
            displayName : _ArCols[6], headerStyle : styles.TituloSimple, cellStyle : styles.celdita2, width : 30,
        },
        dia08 : {
            displayName : _ArCols[7], headerStyle : styles.TituloSimple, cellStyle : styles.celdita2, width : 30,
        },
        dia09 : {
            displayName : _ArCols[8], headerStyle : styles.TituloSimple, cellStyle : styles.celdita2, width : 30,
        },
        dia10 : {
            displayName : _ArCols[9], headerStyle : styles.TituloSimple, cellStyle : styles.celdita2, width : 30,
        },
        dia11 : {
            displayName : _ArCols[10], headerStyle : styles.TituloSimple, cellStyle : styles.celdita2, width : 30,
        },
        dia12 : {
            displayName : _ArCols[11], headerStyle : styles.TituloSimple, cellStyle : styles.celdita2, width : 30,
        },
        dia13 : {
            displayName : _ArCols[12], headerStyle : styles.TituloSimple, cellStyle : styles.celdita2, width : 30,
        },
        dia14 : {
            displayName : _ArCols[13], headerStyle : styles.TituloSimple, cellStyle : styles.celdita2, width : 30,
        },
        dia15 : {
            displayName : _ArCols[14], headerStyle : styles.TituloSimple, cellStyle : styles.celdita2, width : 30,
        },
        dia16 : {
            displayName : _ArCols[15], headerStyle : styles.TituloSimple, cellStyle : styles.celdita2, width : 30,
        },
        dia17 : {
            displayName : _ArCols[16], headerStyle : styles.TituloSimple, cellStyle : styles.celdita2, width : 30,
        },
        dia18 : {
            displayName : _ArCols[17], headerStyle : styles.TituloSimple, cellStyle : styles.celdita2, width : 30,
        },
        dia19 : {
            displayName : _ArCols[18], headerStyle : styles.TituloSimple, cellStyle : styles.celdita2, width : 30,
        },
        dia20 : {
            displayName : _ArCols[19], headerStyle : styles.TituloSimple, cellStyle : styles.celdita2, width : 30,
        },
        dia21 : {
            displayName : _ArCols[20], headerStyle : styles.TituloSimple, cellStyle : styles.celdita2, width : 30,
        },
        dia22 : {
            displayName : _ArCols[21], headerStyle : styles.TituloSimple, cellStyle : styles.celdita2, width : 30,
        },
        dia23 : {
            displayName : _ArCols[22], headerStyle : styles.TituloSimple, cellStyle : styles.celdita2, width : 30,
        },
        dia24 : {
            displayName : _ArCols[23], headerStyle : styles.TituloSimple, cellStyle : styles.celdita2, width : 30,
        },
        dia25 : {
            displayName : _ArCols[24], headerStyle : styles.TituloSimple, cellStyle : styles.celdita2, width : 30,
        },
        dia26 : {
            displayName : _ArCols[25], headerStyle : styles.TituloSimple, cellStyle : styles.celdita2, width : 30,
        },
        dia27 : {
            displayName : _ArCols[26], headerStyle : styles.TituloSimple, cellStyle : styles.celdita2, width : 30,
        },
        dia28 : {
            displayName : _ArCols[27], headerStyle : styles.TituloSimple, cellStyle : styles.celdita2, width : 30,
        },
        dia29 : {
            displayName : _ArCols[28], headerStyle : styles.TituloSimple, cellStyle : styles.celdita2, width : 30,
        },
        dia30 : {
            displayName : _ArCols[29], headerStyle : styles.TituloSimple, cellStyle : styles.celdita2, width : 30,
        },
        dia31 : {
            displayName : _ArCols[30], headerStyle : styles.TituloSimple, cellStyle : styles.celdita2, width : 30,
        },
        horas : {
            displayName : 'Horas laboradas', headerStyle : styles.TituloSimple, cellStyle : styles.celdita2, width : 40,
        },
        glosa : {
            displayName : 'Comentario', headerStyle : styles.TituloSimple, cellStyle : styles.celdita2, width : 130,
        },
    };

    // Detalle
    var dataset = [],_CSGO = 1;
    if( _Tareo ){
        if( _Detalle ){
            for (let index = 0; index < _Detalle.length; index++) {
                const rs = _Detalle[index];
                var _Odo = [], SumHoras = 0;
                var NroHoras = '', _ArHoras = [], _tmpHoras = '';
                console.log(`Exportar Trabajador : ${rs.Nombre}`);
                
                _Odo.nro      = _CSGO;
                _Odo.cliente  = _Tareo.Cliente;
                _Odo.local    = _Tareo.Local;
                _Odo.operario = rs.Nombre;
                _Odo.dni      = rs.DNI;
                _Odo.cargo    = rs.Cargo
                var _HorarioT3 = '';
                
                for (let f = 1; f <= _Max; f++) {
                    switch(f){
                        case 1:_HorarioT3 = rs.Dia01;break;
                        case 2:_HorarioT3 = rs.Dia02;break;
                        case 3:_HorarioT3 = rs.Dia03;break;
                        case 4:_HorarioT3 = rs.Dia04;break;
                        case 5:_HorarioT3 = rs.Dia05;break;
                        case 6:_HorarioT3 = rs.Dia06;break;
                        case 7:_HorarioT3 = rs.Dia07;break;
                        case 8:_HorarioT3 = rs.Dia08;break;
                        case 9:_HorarioT3 = rs.Dia09;break;
                        case 10:_HorarioT3 = rs.Dia10;break;
                        case 11:_HorarioT3 = rs.Dia11;break;
                        case 12:_HorarioT3 = rs.Dia12;break;
                        case 13:_HorarioT3 = rs.Dia13;break;
                        case 14:_HorarioT3 = rs.Dia14;break;
                        case 15:_HorarioT3 = rs.Dia15;break;
                        case 16:_HorarioT3 = rs.Dia16;break;
                        case 17:_HorarioT3 = rs.Dia17;break;
                        case 18:_HorarioT3 = rs.Dia18;break;
                        case 19:_HorarioT3 = rs.Dia19;break;
                        case 20:_HorarioT3 = rs.Dia20;break;
                        case 21:_HorarioT3 = rs.Dia21;break;
                        case 22:_HorarioT3 = rs.Dia22;break;
                        case 23:_HorarioT3 = rs.Dia23;break;
                        case 24:_HorarioT3 = rs.Dia24;break;
                        case 25:_HorarioT3 = rs.Dia25;break;
                        case 26:_HorarioT3 = rs.Dia26;break;
                        case 27:_HorarioT3 = rs.Dia27;break;
                        case 28:_HorarioT3 = rs.Dia28;break;
                        case 29:_HorarioT3 = rs.Dia29;break;
                        case 30:_HorarioT3 = rs.Dia30;break;
                        case 31:_HorarioT3 = rs.Dia31;break;
                    }
                    console.log(`Exportar día : ${f}`);
                    var _Dia = 'Dia'+await pad_with_zeroes( f , 2 );
                    
                    if( _HorarioT3 == 'X' ){
                        NroHoras = '-';
                    }else{
                        console.log(`${_HorarioT3} Id Det3=>${rs.id}, Dia: ${_Dia}.`);
                        var SubDetalle = await tareoSubModel.findOne({
                            where : { 
                                IdDetTareo : rs.id ,
                                NroDia : _Dia
                            }
                        });
                        if( SubDetalle ){
                            console.log(`Turno : ${SubDetalle.Turno}`);
                            if( SubDetalle.CodEstado ){
                                if( _ArCodigosEsp.includes(SubDetalle.CodEstado) ){
                                    // Si esta dentro de los codigos de turno especiales colocamos la suma de horas.
                                    var _Horas = SubDetalle.NroHoras;
                                    //NroHoras = SubDetalle.NroHoras
                                    _ArHoras = _Horas.split(':');
                                    NroHoras = _ArHoras[0];
                                    SumHoras = SumHoras + parseInt(NroHoras);
                                }else{
                                    NroHoras = SubDetalle.CodEstado;
                                }
                            }else{
                                if( SubDetalle.Turno ){
                                    var _Horas = SubDetalle.NroHoras;
                                    console.log(`Real Hora: ${SubDetalle.NroHoras}`);
                                    _ArHoras = _Horas.split(':');
                                    NroHoras = _ArHoras[0];
                                    SumHoras = SumHoras + parseInt(NroHoras);
                                }else{
                                    if( SubDetalle.CodEstado ){
                                        // Especial
                                        NroHoras = SubDetalle.CodEstado
                                    }else{
                                        NroHoras = '-';
                                    }
                                }
                            }
                        }else{
                            NroHoras = '-';
                        }// SubDetalle
                    }
                    //console.log(`Nro horas en ${f} - ${_Dia} => ${NroHoras}.`);
                    switch(f){
                        case 1:_Odo.dia01 = NroHoras;break;
                        case 2:_Odo.dia02 = NroHoras;break;
                        case 3:_Odo.dia03 = NroHoras;break;
                        case 4:_Odo.dia04 = NroHoras;break;
                        case 5:_Odo.dia05 = NroHoras;break;
                        case 6:_Odo.dia06 = NroHoras;break;
                        case 7:_Odo.dia07 = NroHoras;break;
                        case 8:_Odo.dia08 = NroHoras;break;
                        case 9:_Odo.dia09 = NroHoras;break;
                        case 10:_Odo.dia10 = NroHoras;break;
                        case 11:_Odo.dia11 = NroHoras;break;
                        case 12:_Odo.dia12 = NroHoras;break;
                        case 13:_Odo.dia13 = NroHoras;break;
                        case 14:_Odo.dia14 = NroHoras;break;
                        case 15:_Odo.dia15 = NroHoras;break;
                        case 16:_Odo.dia16 = NroHoras;break;
                        case 17:_Odo.dia17 = NroHoras;break;
                        case 18:_Odo.dia18 = NroHoras;break;
                        case 19:_Odo.dia19 = NroHoras;break;
                        case 20:_Odo.dia20 = NroHoras;break;
                        case 21:_Odo.dia21 = NroHoras;break;
                        case 22:_Odo.dia22 = NroHoras;break;
                        case 23:_Odo.dia23 = NroHoras;break;
                        case 24:_Odo.dia24 = NroHoras;break;
                        case 25:_Odo.dia25 = NroHoras;break;
                        case 26:_Odo.dia26 = NroHoras;break;
                        case 27:_Odo.dia27 = NroHoras;break;
                        case 28:_Odo.dia28 = NroHoras;break;
                        case 29:_Odo.dia29 = NroHoras;break;
                        case 30:_Odo.dia30 = NroHoras;break;
                        case 31:_Odo.dia31 = NroHoras;break;
                    }
                }// For días
                _Odo.horas = SumHoras;
                _Odo.glosa = rs.Glosa;
                _CSGO++;
                switch( _Max ){
                    case 29:
                        delete _Odo.dia30;
                        delete _Odo.dia31;
                        delete specification.dia30;
                        delete specification.dia31;
                    break;
                    case 30:
                        delete _Odo.dia31;
                        delete specification.dia31;
                    break;
                }
                dataset.push(_Odo);
            }// For detalle
        }// Detalle
    }
    //console.log(dataset);
    /*var dataset = [
        {nro : 1, cliente : 'Cencosud', local: 'IBM', operario: 'CONDORI SOLORZANO ALICIA GLORIA', dni: '42968274', cargo: 'SUPERVISORA', dia01 : 8 },
        {nro : 2, cliente : 'Cencosud', local: 'IBM', operario: 1, dni: 'some note', misc: 'not shown'},
        {nro : 3, cliente : 'Cencosud', local: 'HP', operario: 0, dni: 'some note'},
        {nro : 4, cliente : 'Cencosud', local: 'MS', operario: 0, dni: 'some note', misc: 'not shown'}
    ];*/

    const merges = [
        { start: { row: 1, column: 1 }, end: { row: 1, column: 38 } },
        { start: { row: 2, column: 1 }, end: { row: 2, column: 38 } },
        //{ start: { row: 2, column: 6 }, end: { row: 2, column: 10 } }
    ];

    // Create the excel report.
    // This function will return Buffer
    const report = excel.buildExport(
    [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
        {
            name: 'Tareo', // <- Specify sheet name (optional)
            heading: heading, // <- Raw heading array (optional)
            merges: merges, // <- Merge cell ranges
            specification: specification, // <- Report specification
            data: dataset // <-- Report data
        }
    ]
    );
    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    // You can then return this straight
    res.attachment( _Archivo ); // This is sails.js specific (in general you need to set headers)
    return res.send(report);
});
// -------------------------------------------------------

////////////////////////////////////////////////////
//              MOSTRAR UN ARCHIVO                //
////////////////////////////////////////////////////
router.get('/fichast/:uuid/:foto?',async(req,res)=>{
    // uuid
    console.log(`>>>>>>>>>>>>>> Mostrar ficha sintomatologica`);
    var _dataFicha = await fichaSintoModel.findOne({
        where : {
            uu_id : req.params.uuid
        }
    });
    if( _dataFicha ){
        res.sendFile( URL_FICHASINT+'/FS_SSAYS_'+_dataFicha.uu_id+'.png' );
    }else{
        //
    }    
});
// -------------------------------------------------------

////////////////////////////////////////////////////
//              MOSTRAR UN ARCHIVO                //
////////////////////////////////////////////////////
router.get('/zip_certificado/:zipile',async(req,res)=>{
    // zipile
    var _zilFile = './assets/zip_certificados/'+req.params.zipile+'.zip';
    if ( fs.existsSync( _zilFile ) ) {
        res.sendFile( _zilFile );
    }else{
        //
    }    
});
// -------------------------------------------------------

////////////////////////////////////////////////////
//              MOSTRAR FICHA SINTOMA             //
////////////////////////////////////////////////////
router.get('/fs/:dni/:foto?',async(req,res)=>{
    // uuid
    console.log(`>>>>>>>>>>>>>> Mostrar ficha sintomatologica`);
    var _dataFicha = await fichaSintoModel.findOne({
        where : {
            dni : req.params.dni
        },
        limit : 1 ,
        order : [
            [ 'id' , 'DESC' ]
        ]
    });
    if( _dataFicha ){
        res.sendFile( URL_FICHASINT+'/FS_SSAYS_'+_dataFicha.uu_id+'.png' );
    }else{
        //
    }    
});
// -------------------------------------------------------

////////////////////////////////////////////////////
//              MOSTRAR UN ARCHIVO 2              //
////////////////////////////////////////////////////
router.get('/show2/:uuIdFile/:nombre?',async(req,res)=>{
	var $response = {};
  $response.estado = 'ERROR';
  const $data = await archiGoogleModel.findOne({
    where : {
      uu_id : req.params.uuIdFile
    }
  });

  if( $data ){
    $response.url = fileUrl('.'+$data.ruta_fisica+$data.nombre_fisico);
  }

    express.static(__dirname + '/public');

    //res.json( {success : __dirname } );
    if( $data.ruta_fisica ){
        res.sendFile( $data.ruta_fisica );
    }else{
        res.sendFile( _RUTA_ORQ3+'/intranet/public/assets/adjunto/'+$data.nombre_fisico );
    }
});
// -------------------------------------------------------

////////////////////////////////////////////////////
// IMPIMIR FICHA TÉCNICA DE EJECUCIÓN DE SERVICIO //
////////////////////////////////////////////////////
router.get('/print/ftt/:Codigo',async(req,res)=>{
    var $response = {};
    $response.estado = 'ERROR';

    var _dataTrab = await fichaTecnicaTrabajoOTModel.findOne({
        where : {
            Codigo : req.params.Codigo
        }
    });

    var _File = `${_RUTA_PROYECTO}adjuntos/app-tecnicos/FTES_${req.params.Codigo}.pdf`;
    
    if( _dataTrab )
    {
        if( _dataTrab.Estado != 'Finalizado' )
        {
            _File = `${_RUTA_PROYECTO}adjuntos/html/FTES_${req.params.Codigo}.html`;
        }
    }

    try {
        if ( fs.existsSync( _File ) ) {
            res.sendFile( _File );
        }else{
            res.sendFile( _img404 );
        }
    } catch(err) {
        console.error(err);
        res.sendFile( _img404 );
    }
});
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
async function esrcribeError( error )
{
    var $file = './assets/errores/log.txt';
    try {
        if (fs.existsSync( $file ) ) {
            await fs.appendFile( $file , error , function (err) {
                if (err) throw err;
                console.log('Se agregó un error');
                console.log( error );
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
function pad_with_zeroes( number , length )
{
    var my_string = '' + number;
    while (my_string.length < length) {
        my_string = '0' + my_string;
    }
    return my_string;
}
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
module.exports = router;