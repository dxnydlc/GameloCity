
// api_lap_docs.js


var _NombreDoc = 'api_lap_docs';
const router = require('express').Router();
const {check,validationResult} = require('express-validator');
const { Op } = require("sequelize");

const dotenv = require('dotenv');
dotenv.config();
// >>>>>>>>>>>>>    SPARKPOST   >>>>>>>>>>>>>
const SparkPost = require('sparkpost')
const clientMail    = new SparkPost(process.env.SPARKPOST_SECRET);

// >>>>>>>>>>>>>    MOMENT      >>>>>>>>>>>>>
var moment = require('moment-timezone');
moment().tz("America/Lima").format();
// moment().format('YYYY-MM-DD HH:mm:ss');

// >>>>>>>>>>>>>    NEXMO       >>>>>>>>>>>>>
const Nexmo         = require('nexmo');
const BitlyClient   = require('bitly').BitlyClient;
const bitly         = new BitlyClient(process.env.BITLY_API);

// LEER EXCEL
const reader = require('xlsx');

// Archivos
const fs = require('fs');
const path    = require('path');
const client = require('https');

// DOCX
const docx = require("docx");
const { AlignmentType, Document, HeadingLevel, Packer, Paragraph, TextRun, UnderlineType,
    HorizontalPositionAlign,
    HorizontalPositionRelativeFrom,
    ImageRun,
    Media,
    VerticalPositionAlign,
    VerticalPositionRelativeFrom, 
    TextWrappingSide, TextWrappingType , 
    SectionType , VerticalAlign, ShadingType, WidthType,
    Table, TableCell, TableRow, BorderStyle, convertInchesToTwip ,
    Footer, Header, PageBreak, PageNumber, NumberFormat
} = docx;


    // RUTAS
const _RUTA_PROYECTO = process.env.RUTA_PROYECTO;
const _URL_NODE = process.env.URL_NODE;


// Modelos
const { errorLogModel } = require('../../dbA');
const { reporteLapModel, xlsLAPIncidenciasDetModel, User, sequelize, archiGoogleModel, sucursalModel, bitacoraSuperModel, apoyoDataModel, bitacoraBloqueModel, bitacoraAreaModel, bitacoraTrabajoModel, xlsLAPTrabajadoresCabModel, cargaExcelModelCab, cargaExcelModelDet, xlsLAPMaquinariaCabModel, xlsLAPhallazgoCabModel, xlsLAPIncidenciasCabModel, xlsLAPCharlaMesModel, xlsLAPAsistenciaModel, xlsLAPRotaPersonalModel, xlsLAPAccidentesInciModel, xlsLAPDerrameCombustibleModel , LAPKitAntiderrameCabModel, xlsLAPMantMaqCabModel, xlsLAPReqMatCabModel, LAPCarritoBarredorCabModel , xlsLAPMantBarredoraModel , xlsLAPDesempenioPersonalModel , xlsLAPApoyoCabModel, xlsLAPApoyoDeModel, bitacoraDetalleModel, 
    LapPesoFodModel , LapPersonalSancionadoModel , LapPersonalAIDModel , LapTrabajoNoRealizadoModel, LapTrabajoNoRealizadoDetModel, lapTablaModel, lapBloque1Model } = require('../../db');

var _fechaLatFormat = "%d/%m/%Y %H:%i",_fechaONlyLatFormat = "%d/%m/%Y";

var _arrayMeses = ["" ,"Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

// Controlador
const helpersController  = require('../../controllers/helpersController');
const estadoDocController = require('../../controllers/estadoDocController');


var _estilos = [{
    id: "Heading1",
    name: "Heading 1",
    basedOn: "Normal",
    next: "Normal",
    quickFormat: true,
    run: {
        size: 55,
        bold: true,
        italics: false,
        color: "#EE6C4D",
    },
    paragraph: {
        spacing: {
            after: 120,
        },
    },
},
{
    id: "Heading2",
    name: "Heading 2",
    basedOn: "Normal",
    next: "Normal",
    quickFormat: true,
    run: {
        size: 26,
        bold: true,
        underline: {
            type: UnderlineType.DOUBLE,
            color: "FF0000",
        },
    },
    paragraph: {
        spacing: {
            before: 240,
            after: 120,
        },
    },
},
{
    id: "aside",
    name: "Aside",
    basedOn: "Normal",
    next: "Normal",
    run: {
        color: "999999",
        italics: true,
    },
    paragraph: {
        indent: {
            left: 720,
        },
        spacing: {
            line: 276,
        },
    },
},
{
    id: "wellSpaced",
    name: "Well Spaced",
    basedOn: "Normal",
    quickFormat: true,
    paragraph: {
        spacing: { line: 276, before: 20 * 72 * 0.1, after: 20 * 72 * 0.05 },
    },
},
{
    id: "ListParagraph",
    name: "List Paragraph",
    basedOn: "Normal",
    quickFormat: true,
}];
var _config = [
    {
        reference: "my-crazy-numbering",
        levels: [
            {
                level: 0,
                format: "lowerLetter",
                text: "%1)",
                alignment: AlignmentType.LEFT,
            },
        ],
    },
];
var _floatIMG = {
    horizontalPosition: {
        relative: HorizontalPositionRelativeFrom.PAGE,
        align: HorizontalPositionAlign.CENTER,
    },
    verticalPosition: {
        offset: 1014400,
    },
};
const borders = {
    top: {
        style: BorderStyle.DASH_SMALL_GAP,
        size: 0.3,
        color: "79A0C9",
    },
    bottom: {
        style: BorderStyle.DASH_SMALL_GAP,
        size: 0.3,
        color: "79A0C9",
    },
    left: {
        style: BorderStyle.DASH_SMALL_GAP,
        size: 0.3,
        color: "79A0C9",
    },
    right: {
        style: BorderStyle.DASH_SMALL_GAP,
        size: 0.3,
        color: "79A0C9",
    },
};
const bordersNO = {
    top: {
        style: BorderStyle.DASH_SMALL_GAP,
        size: 0.3,
        color: "F6F2F1",
    },
    bottom: {
        style: BorderStyle.DASH_SMALL_GAP,
        size: 0.3,
        color: "F6F2F1",
    },
    left: {
        style: BorderStyle.DASH_SMALL_GAP,
        size: 0.3,
        color: "F6F2F1",
    },
    right: {
        style: BorderStyle.DASH_SMALL_GAP,
        size: 0.3,
        color: "F6F2F1",
    },
};
const margins = {
    top     : convertInchesToTwip(0.05),
    bottom  : convertInchesToTwip(0.05),
    left    : convertInchesToTwip(0.05),
    right   : convertInchesToTwip(0.05),
};









// -------------------------------------------------------------
//////////////////////////////////////////////////////////
//                  DEMO GENERAR UN WORD                //
//////////////////////////////////////////////////////////
router.get('/word1', async (req,res)=>{
    // uuid
    var _response = {};
    _response.codigo = 200;

    _response.locales = [];
    _response.data    = [];
    _response.files   = [];

    var b64string;

    

    try {
        // Imagen logo 01
        const header_01 = new ImageRun({
            data: fs.readFileSync( `${_RUTA_PROYECTO}adjuntos/lap_imgs/header-03.png` ),
            transformation: {
                width  : 550, height : 300,
            },
            floating: _floatIMG
        });
        // Imagen Celda
        var _imgTD = new ImageRun({
            data: fs.readFileSync( `${_RUTA_PROYECTO}adjuntos/reporte_lap/IMG_20220514_151213.jpg` ),
            transformation: {
                width  : 280,
                height : 220,
            },
        });
        // TABLA 01
        const table01 = new Table({
            alignment    : AlignmentType.CENTER,
            columnWidths : [ 1800 , 1800 ],
            width: {
                size: 100,
                type: WidthType.PERCENTAGE,
            },
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            borders ,
                            children: [ new Paragraph({
                                children : [
                                    new TextRun({
                                        text : "Foo Bar",
                                        bold: true, color : 'B3E0EE'
                                    })
                                ]
                            }) ],
                            shading: { fill: "083346" },
                            verticalAlign: VerticalAlign.CENTER, margins
                        }),
                        new TableCell({
                            borders ,
                            children: [ new Paragraph({
                                children : [
                                    new TextRun({
                                        text : "Foo Bar",
                                        bold: true, color : 'B3E0EE'
                                    })
                                ]
                            }) ],
                            shading: { fill: "083346" },
                            verticalAlign: VerticalAlign.CENTER, margins
                        }),
                    ],
                }),
                new TableRow({
                    children: [
                        new TableCell({
                            borders ,
                            children: [
                                new Paragraph({
                                    children: [ _imgTD ]
                                })
                            ],
                            verticalAlign: VerticalAlign.CENTER, margins
                        }),
                        new TableCell({
                            borders ,
                            children: [new Paragraph("World")],
                            verticalAlign: VerticalAlign.CENTER, margins
                        }),
                    ],
                }),
            ],
        });
        //
        const doc = new Document({
            creator: "Dany De la Cruz",
            title: "SSAYS - INFORME DE GESTIÓN",
            description: "Informe de gestión SSAYS",
            styles: {
                paragraphStyles : _estilos,
            },
            numbering: {
                config: _config
            },
            sections: [{
                children: [
                    new Paragraph({ children : [header_01] }),
                    new Paragraph({
                        children : [
                            new TextRun({
                                text: ".",
                                break: 18,
                            }),
                        ]
                    }),
                    new Paragraph({
                        text: "Mayo 2022",
                        heading: HeadingLevel.HEADING_1,
                        alignment: AlignmentType.CENTER,
                    }),
                    new Paragraph({
                        pageBreakBefore: true,
                    }),
                    table01,
                    new Paragraph({
                        pageBreakBefore: true,
                    }),
                    new Paragraph({
                        text: "Test heading1, bold and italicized",
                        heading: HeadingLevel.HEADING_1,
                    }),
                    new Paragraph("Some simple content"),
                    new Paragraph({
                        text: "Test heading2 with double red underline",
                        heading: HeadingLevel.HEADING_2,
                    }),
                    new Paragraph({
                        text: "Option1",
                        numbering: {
                            reference: "my-crazy-numbering",
                            level: 0,
                        },
                    }),
                    new Paragraph({
                        text: "Option5 -- override 2 to 5",
                        numbering: {
                            reference: "my-crazy-numbering",
                            level: 0,
                        },
                    }),
                    new Paragraph({
                        text: "Option3",
                        numbering: {
                            reference: "my-crazy-numbering",
                            level: 0,
                        },
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Some monospaced content",
                                font: {
                                    name: "Monospace",
                                },
                            }),
                        ],
                    }),
                    new Paragraph({
                        text: "An aside, in light gray italics and indented",
                        style: "aside",
                    }),
                    new Paragraph({
                        text: "This is normal, but well-spaced text",
                        style: "wellSpaced",
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "This is a bold run,",
                                bold: true,
                            }),
                            new TextRun(" switching to normal "),
                            new TextRun({
                                text: "and then underlined ",
                                underline: {},
                            }),
                            new TextRun({
                                text: "and back to normal.",
                            }),
                        ],
                    }),
                ],
            }],
        });
        //
        
        b64string = await Packer.toBase64String(doc);
        
        //
        _response.resp = { 'titulo' : `Correcto` , 'clase' : `info` , 'texto' : `Word Generado.` };
        //
    } catch (error) {
        varDump(`Error: ${error}.`);
        _response.codigo = 500;
        _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${error}.` };
    }

    res.setHeader('Content-Disposition', 'attachment; filename=My Document.docx');
    res.send(Buffer.from(b64string, 'base64'));
    //
});
// -------------------------------------------------------------

//////////////////////////////////////////////////////////
//                  CARGAR DOCUMENTO                    //
//////////////////////////////////////////////////////////
router.get('/word/:Codigo', async (req,res)=>{
    // uuid
    var _response = {};
    _response.codigo = 200;

    _response.locales = [];
    _response.data    = [];
    _response.files   = [];

    var b64string;
    var _NombreFile = ``;


    var _ArrDocWord = [], _NuevaPagina = new Paragraph({ pageBreakBefore: true });


    // Indice.
    var _arrIndice = [];
    /**/
    var table01, tblBloque1;
    // TABLA 01
    const tblIndice = new Table({
        alignment    : AlignmentType.CENTER,
        columnWidths : [ 1800 , 1800 ],
        width: {
            size: 100,
            type: WidthType.PERCENTAGE,
        },
        rows: [
            new TableRow({
                children : [
                    await dibujaCeldaIndic( 'TH' , `Contenido.` )
                ],
            }),
            new TableRow({ children : [ await dibujaCeldaIndic( 'TD' , `01 Cumplimiento del programa del servicio preventivo de limpieza.` ) ] }) ,
            new TableRow({ children : [ await dibujaCeldaIndic( 'TD' , `02 Relación de trabajadores.` ) ]}) ,
            new TableRow({ children : [ await dibujaCeldaIndic( 'TD' , `03 Relación de maquinaria.` ) ]}) ,
            new TableRow({ children : [ await dibujaCeldaIndic( 'TD' , `04 Reporte de hallazgos.` ) ]}) ,
            new TableRow({ children : [ await dibujaCeldaIndic( 'TD' , `05 Reporte de incidencias.` ) ]}) ,
            new TableRow({ children : [ await dibujaCeldaIndic( 'TD' , `06 Charla del mes.` ) ]}) ,
            new TableRow({ children : [ await dibujaCeldaIndic( 'TD' , `07 Registro asistencia personal.` ) ]}) ,
            new TableRow({ children : [ await dibujaCeldaIndic( 'TD' , `08 Rotación de personal.` ) ]}) ,
            new TableRow({ children : [ await dibujaCeldaIndic( 'TD' , `09 Incidentes y accidentes.` ) ]}) ,
            new TableRow({ children : [ await dibujaCeldaIndic( 'TD' , `10 Derrame de combustible.` ) ]}) ,
            new TableRow({ children : [ await dibujaCeldaIndic( 'TD' , `11 Uso de kit anti derrame.` ) ]}) ,
            new TableRow({ children : [ await dibujaCeldaIndic( 'TD' , `12 Mantenimiento de maquinaria y equipos críticos.` ) ]}) ,
            new TableRow({ children : [ await dibujaCeldaIndic( 'TD' , `13 Consolidado de consumo de materiales.` ) ]}) ,
            new TableRow({ children : [ await dibujaCeldaIndic( 'TD' , `14 Control de traslado y barrido de camión barredor.` ) ]}) ,
            new TableRow({ children : [ await dibujaCeldaIndic( 'TD' , `15 Informe de mantenimiento de la barredora.` ) ]}) ,
            new TableRow({ children : [ await dibujaCeldaIndic( 'TD' , `16 Desempeño del personal.` ) ]}) ,
            new TableRow({ children : [ await dibujaCeldaIndic( 'TD' , `17 Otros trabajos.` ) ]}) ,
            new TableRow({ children : [ await dibujaCeldaIndic( 'TD' , `18 Registro del peso fod.` ) ]}) ,
            new TableRow({ children : [ await dibujaCeldaIndic( 'TD' , `19 Personal AID.` ) ]}) ,
            new TableRow({ children : [ await dibujaCeldaIndic( 'TD' , `20 Relación de personal sancionado.` ) ]}) ,
            new TableRow({ children : [ await dibujaCeldaIndic( 'TD' , `21 Trabajos no realizados.` ) ]}) ,
        ],
    });

    // Imagen logo 01
    const ddddd = new ImageRun({
        data: fs.readFileSync( `${_RUTA_PROYECTO}adjuntos/lap_imgs/header-03.png` ),
        transformation: {
            width  : 550, height : 300,
        },
        floating: _floatIMG
    });
    const header_01 = await objImagen( `${_RUTA_PROYECTO}adjuntos/lap_imgs/header-03.png` , 650 , 400 );
    const imgIndice01 = await objImagen( `${_RUTA_PROYECTO}adjuntos/lap_imgs/01.png` , 350 , 80 );
    const imgIndice02 = await objImagen( `${_RUTA_PROYECTO}adjuntos/lap_imgs/02.png` , 350 , 80 );
    const imgIndice03 = await objImagen( `${_RUTA_PROYECTO}adjuntos/lap_imgs/03.png` , 350 , 80 );
    const imgIndice04 = await objImagen( `${_RUTA_PROYECTO}adjuntos/lap_imgs/04.png` , 350 , 80 );
    const imgIndice05 = await objImagen( `${_RUTA_PROYECTO}adjuntos/lap_imgs/05.png` , 350 , 80 );
    const imgIndice06 = await objImagen( `${_RUTA_PROYECTO}adjuntos/lap_imgs/06.png` , 350 , 80 );
    const imgIndice07 = await objImagen( `${_RUTA_PROYECTO}adjuntos/lap_imgs/07.png` , 350 , 80 );
    const imgIndice08 = await objImagen( `${_RUTA_PROYECTO}adjuntos/lap_imgs/08.png` , 350 , 80 );
    const imgIndice09 = await objImagen( `${_RUTA_PROYECTO}adjuntos/lap_imgs/09.png` , 350 , 80 );
    const imgIndice10 = await objImagen( `${_RUTA_PROYECTO}adjuntos/lap_imgs/10.png` , 350 , 80 );
    const imgIndice11 = await objImagen( `${_RUTA_PROYECTO}adjuntos/lap_imgs/11.png` , 350 , 80 );
    const imgIndice12 = await objImagen( `${_RUTA_PROYECTO}adjuntos/lap_imgs/12.png` , 350 , 80 );
    const imgIndice13 = await objImagen( `${_RUTA_PROYECTO}adjuntos/lap_imgs/13.png` , 350 , 80 );
    const imgIndice14 = await objImagen( `${_RUTA_PROYECTO}adjuntos/lap_imgs/14.png` , 350 , 80 );
    const imgIndice15 = await objImagen( `${_RUTA_PROYECTO}adjuntos/lap_imgs/15.png` , 350 , 80 );
    const imgIndice16 = await objImagen( `${_RUTA_PROYECTO}adjuntos/lap_imgs/16.png` , 350 , 80 );
    const imgIndice17 = await objImagen( `${_RUTA_PROYECTO}adjuntos/lap_imgs/17.png` , 350 , 80 );
    const imgIndice18 = await objImagen( `${_RUTA_PROYECTO}adjuntos/lap_imgs/18.png` , 350 , 80 );
    const imgIndice19 = await objImagen( `${_RUTA_PROYECTO}adjuntos/lap_imgs/19.png` , 350 , 80 );
    const imgIndice20 = await objImagen( `${_RUTA_PROYECTO}adjuntos/lap_imgs/20.png` , 350 , 80 );
    const imgIndice21 = await objImagen( `${_RUTA_PROYECTO}adjuntos/lap_imgs/21.png` , 350 , 80 );

    const imgFooter01 = new ImageRun({
        data: fs.readFileSync( `${_RUTA_PROYECTO}adjuntos/lap_imgs/footer-01.png` ),
        transformation: {
            width: 600,
            height: 300,
        },
    });

    const imgFooter02 = new ImageRun({
        data: fs.readFileSync( `${_RUTA_PROYECTO}adjuntos/lap_imgs/footer-02.png` ),
        transformation: {
            width: 600,
            height: 100,
        },
    });
    

    try {
        //
        var _CodRepo = req.params.Codigo;
        if( _CodRepo )
        {
            //
            var _dataRepo = await reporteLapModel.findOne({
                where : { Codigo: _CodRepo }
            });

            var _arrBloques = [];

            if( _dataRepo )
            {
                //
                var _NroAreas  = _dataRepo.NroAreas;
                var _arrAreas  = _NroAreas.split(',');
                var _NroTrabajos = _dataRepo.NroTrabajos;
                var _arrTraba    = _NroTrabajos.split(',');
                var _NroCodigos  = _dataRepo.NroCodigos;
                var _arrCodigos  = _NroCodigos.split(',');

                var _dataTabla = await lapTablaModel.findAll({
                    where : { 
                        CodigoBita: _CodRepo 
                    }
                });
                // Ahora obtenemos los bloques XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX



                var _fec = _dataRepo.FecInicio;
                var _arFecha = _fec.split('-');
                var _MesName = _arrayMeses[ parseInt(_arFecha[1]) ];
                _NombreFile = `${_MesName}-${_arFecha[0]}.docx`;


                var _inTD = [], _CSGO = 1;
                for (let index = 0; index < _dataTabla.length; index++)
                {
                    const rs = _dataTabla[index];

                    // Encabezado
                    if( rs.Bloque  )
                    {
                        var _tablrRow = new TableRow({
                            children : [
                                await dibujaCelda( 'TH' , `Nro.` ) , 
                                await dibujaCelda( 'TH' , rs.Bloque ) , 
                                await dibujaCelda( 'TH' , `Frecuencia.` ) , 
                                await dibujaCelda( 'TH' , `-.` ) , 
                            ],
                        });
                        _inTD.push( _tablrRow );
                        //
                    }else{
                        //
                        var _tablrRow = new TableRow({
                            children : [
                                await dibujaCelda( 'TD' , _CSGO ) , 
                                await dibujaCelda( 'TD' , rs.Trabajo ) , 
                                await dibujaCelda( 'TD' , rs.Frecuencia ) , 
                                await dibujaCelda( 'TD' , rs.Fechas ) , 
                            ],
                        });
                        _inTD.push( _tablrRow );
                    }
                    _CSGO++;
                    //
                }
                // BLOQUE 01
                table01 = new Table({
                    alignment    : AlignmentType.CENTER,
                    columnWidths : [ 150 , 2000 , 400 , 2000 ],
                    width: {
                        size: 100,
                        type: WidthType.PERCENTAGE,
                    },
                    rows: _inTD
                });
                // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
                // BLOQUE 01 - IMAGENES
                var _inTD = [], _CSGO = 1;
                var _bloque1 = await lapBloque1Model.findAll({
                    where : {
                        CodigoBita : _CodRepo ,
                    },
                    order : [
                        [ 'id' , 'ASC' ]
                    ],
                    
                });
                // limit : 300
                var _CSGO = 1, arrIMGs = [];
                for (let index = 0; index < _bloque1.length; index++)
                {
                    const _rs = _bloque1[index];
                    if( _rs.Bloque )
                    {
                        //
                        var _tablrRow = new TableRow({
                            children : [
                                await dibujaCeldaBlk( 'Bloque' , _rs.Bloque ) , 
                            ],
                        });
                        _inTD.push( _tablrRow );
                        //
                    }else{
                        // Tiene Area¿?
                        if( _rs.Area )
                        {
                            //
                            var _tablrRow = new TableRow({
                                children : [
                                    await dibujaCeldaBlk( 'Area' , _rs.Area ) , 
                                ],
                            });
                            _inTD.push( _tablrRow );
                            //
                        }else{
                            // Tiene trabajo¿?
                            if( _rs.Trabajo )
                            {
                                //
                                var _tablrRow = new TableRow({
                                    children : [
                                        await dibujaCeldaBlk( 'Trabajo' , _rs.Trabajo ) , 
                                    ],
                                });
                                _inTD.push( _tablrRow );
                                //
                            }else{
                                // Tiene sector¿?
                                if( _rs.Sector )
                                {
                                    //
                                    var _tablrRow = new TableRow({
                                        children : [
                                            await dibujaCeldaBlk( 'Sector' , _rs.Sector ) , 
                                        ],
                                    });
                                    _inTD.push( _tablrRow );
                                    //
                                }else{
                                    // Hora de colocar las imágenes...
                                    if (fs.existsSync( _rs.Img01 ) )
                                    {
                                        //varDump(`File existe 001`);
                                        var _imgF1 = await dibujaCeldaBlk( 'IMG' , _rs.Img01 );
                                        var _tdIn  = await dibujaCeldaBlk( 'TD_IMG' , _imgF1 );
                                        arrIMGs.push(_tdIn);
                                    }

                                    if (fs.existsSync( _rs.Img02 ) )
                                    {
                                        //varDump(`File existe 001`);
                                        var _imgF2 = await dibujaCeldaBlk( 'IMG' , _rs.Img02 );
                                        var _tdIn  = await dibujaCeldaBlk( 'TD_IMG' , _imgF2 );
                                        arrIMGs.push(_tdIn);
                                    }
                                    _CSGO++;
                                    //if( _CSGO > 2 )
                                    //{
                                        // TD
                                        var _tablrRow = new TableRow({
                                            children : arrIMGs,
                                        });
                                        _inTD.push( _tablrRow );
                                        arrIMGs = [];
                                        //_CSGO = 1;
                                    //}
                                }
                            }
                        }
                    }
                }// for
                // ##################### IMAGENES BLOQUE 01 #####################
                tblBloque1 = new Table({
                    alignment    : AlignmentType.CENTER,
                    columnWidths : [ 2000 , 2000 ],
                    width: {
                        size: 100,
                        type: WidthType.PERCENTAGE,
                    },
                    rows: _inTD
                });
                // ##################### RELACIÓN DE TRABAJADORES#####################
                var _Bloque02;
                var $where = {};
                $where.Estado =  { [Op.in] : ['Activo','Aprobado'] };
                $where.Fecha = { [Op.gte ] : _dataRepo.FecInicio , [Op.lte ]: _dataRepo.FecFin };
                var _dataOpers = await xlsLAPTrabajadoresCabModel.findAll({
                    where : $where
                });
                if(_dataOpers )
                {
                    var _datasArr = [];
                    //
                    for (let index = 0; index < _dataOpers.length; index++) {
                        const rs = _dataOpers[index];
                        var _data01 = await dibujarSector( 'XLS_OPERARIOS_LAP' , rs.Codigo )
                        _datasArr.push( _data01 );
                    }
                    //
                    _Bloque02 = _datasArr ;
                }

                var fruits1 = ["Banana", "Orange", "Apple", "Mango"];
                var fruits2 = ["MAMEI", "GAAAA"];
                var _arrEnd = fruits1.concat( fruits2 );
                varDump( _arrEnd );

                // ##################### RELACIÓN DE MAQUINARIA #####################
                var _Bloque03;
                var $where = {};
                $where.Estado =  { [Op.in] : ['Activo','Aprobado'] };
                $where.Fecha = { [Op.gte ] : _dataRepo.FecInicio , [Op.lte ]: _dataRepo.FecFin };
                var _dataOpers = await xlsLAPMaquinariaCabModel.findAll({
                    where : $where
                });
                if(_dataOpers )
                {
                    var _datasArr = [];
                    //
                    for (let index = 0; index < _dataOpers.length; index++) {
                        const rs = _dataOpers[index];
                        var _data01 = await dibujarSector( 'XLS_MAQUINARIA_LAP' , rs.Codigo )
                        _datasArr.push( _data01 );
                    }
                    //
                    _Bloque03 = _datasArr ;
                }


                // ##################### REPORTE DE HALLAZGOS #####################
                var _Bloque04;
                var $where = {};
                $where.Estado =  { [Op.in] : ['Activo','Aprobado'] };
                $where.Fecha = { [Op.gte ] : _dataRepo.FecInicio , [Op.lte ]: _dataRepo.FecFin };
                var _dataOpers = await xlsLAPhallazgoCabModel.findAll({
                    where : $where
                });
                if(_dataOpers )
                {
                    var _datasArr = [];
                    //
                    for (let index = 0; index < _dataOpers.length; index++) {
                        const rs = _dataOpers[index];
                        var _data01 = await dibujarSector( 'XLS_HALLAZGOS_LAP' , rs.Codigo )
                        _datasArr.push( _data01 );
                    }
                    //
                    _Bloque04 = _datasArr ;
                }

                // ##################### REPORTE DE INCIDENCIAS #####################
                var _Bloque05;
                var $where = {};
                $where.Estado =  { [Op.in] : ['Activo','Aprobado'] };
                $where.Fecha = { [Op.gte ] : _dataRepo.FecInicio , [Op.lte ]: _dataRepo.FecFin };
                var _dataOpers = await xlsLAPIncidenciasCabModel.findAll({
                    where : $where
                });
                if(_dataOpers )
                {
                    var _datasArr = [];
                    //
                    for (let index = 0; index < _dataOpers.length; index++) {
                        const rs = _dataOpers[index];
                        var _data01 = await dibujarSector( 'XLS_INCIDENCIAS_LAP' , rs.Codigo )
                        _datasArr.push( _data01 );
                    }
                    //
                    _Bloque05 = _datasArr ;
                }

                // ##################### CHARLA DEL MES #####################
                var _Bloque06;
                var $where = {};
                $where.Estado =  { [Op.in] : ['Activo','Aprobado'] };
                $where.Fecha = { [Op.gte ] : _dataRepo.FecInicio , [Op.lte ]: _dataRepo.FecFin };
                var _dataOpers = await xlsLAPCharlaMesModel.findAll({
                    where : $where
                });
                if(_dataOpers )
                {
                    var _datasArr = [];
                    //
                    for (let index = 0; index < _dataOpers.length; index++) {
                        const rs = _dataOpers[index];
                        var _data01 = await dibujarSector( 'XLS_CHARLA_MES_LAP' , rs.Codigo )
                        _datasArr.push( _data01 );
                    }
                    //
                    _Bloque06 = _datasArr ;
                }

                // ##################### REGISTRO DE ASISTENCIA DEL PERSONAL #####################
                var _Bloque07;
                var $where = {};
                $where.Estado =  { [Op.in] : ['Activo','Aprobado'] };
                $where.Fecha = { [Op.gte ] : _dataRepo.FecInicio , [Op.lte ]: _dataRepo.FecFin };
                var _dataOpers = await xlsLAPAsistenciaModel.findAll({
                    where : $where
                });
                if(_dataOpers )
                {
                    var _datasArr = [];
                    //
                    for (let index = 0; index < _dataOpers.length; index++) {
                        const rs = _dataOpers[index];
                        var _data01 = await dibujarSector( 'XLS_ASISTENCIA_OPERARIOS_LAP' , rs.Codigo )
                        _datasArr.push( _data01 );
                    }
                    //
                    _Bloque07 = _datasArr ;
                }

                // ##################### ROTACION DEL PERSONAL #####################
                var _Bloque08;
                var $where = {};
                $where.Estado =  { [Op.in] : ['Activo','Aprobado'] };
                $where.Fecha = { [Op.gte ] : _dataRepo.FecInicio , [Op.lte ]: _dataRepo.FecFin };
                var _dataOpers = await xlsLAPRotaPersonalModel.findAll({
                    where : $where
                });
                if(_dataOpers )
                {
                    var _datasArr = [];
                    //
                    for (let index = 0; index < _dataOpers.length; index++) {
                        const rs = _dataOpers[index];
                        var _data01 = await dibujarSector( 'XLS_ROTACION_PERSONAL_LAP' , rs.Codigo )
                        _datasArr.push( _data01 );
                    }
                    //
                    _Bloque08 = _datasArr ;
                }

                // ##################### REPORTE DE INCIDENTES Y ACCIDENTES #####################
                var _Bloque09;
                var $where = {};
                $where.Estado =  { [Op.in] : ['Activo','Aprobado'] };
                $where.Fecha = { [Op.gte ] : _dataRepo.FecInicio , [Op.lte ]: _dataRepo.FecFin };
                var _dataOpers = await xlsLAPAccidentesInciModel.findAll({
                    where : $where
                });
                if(_dataOpers )
                {
                    var _datasArr = [];
                    //
                    for (let index = 0; index < _dataOpers.length; index++) {
                        const rs = _dataOpers[index];
                        var _data01 = await dibujarSector( 'XLS_ACCIDENTES_INCIDENTES_LAP' , rs.Codigo )
                        _datasArr.push( _data01 );
                    }
                    //
                    _Bloque09 = _datasArr ;
                }

                // ##################### REPORTE DE DERRAME DE COMBUSTIBLE #####################
                var _Bloque10;
                var $where = {};
                $where.Estado =  { [Op.in] : ['Activo','Aprobado'] };
                $where.Fecha = { [Op.gte ] : _dataRepo.FecInicio , [Op.lte ]: _dataRepo.FecFin };
                var _dataOpers = await xlsLAPDerrameCombustibleModel.findAll({
                    where : $where
                });
                if(_dataOpers )
                {
                    var _datasArr = [];
                    //
                    for (let index = 0; index < _dataOpers.length; index++) {
                        const rs = _dataOpers[index];
                        var _data01 = await dibujarSector( 'XLS_LAP_DERRAME_COMBUSTIBLE' , rs.Codigo )
                        _datasArr.push( _data01 );
                    }
                    //
                    _Bloque10 = _datasArr ;
                }

                // ##################### REPORTE DE USO DEL KIT ANTI DERRAME #####################
                var _Bloque11;
                var $where = {};
                $where.Estado =  { [Op.in] : ['Activo','Aprobado'] };
                $where.Fecha = { [Op.gte ] : _dataRepo.FecInicio , [Op.lte ]: _dataRepo.FecFin };
                var _dataOpers = await LAPKitAntiderrameCabModel.findAll({
                    where : $where
                });
                if(_dataOpers )
                {
                    var _datasArr = [];
                    //
                    for (let index = 0; index < _dataOpers.length; index++) {
                        const rs = _dataOpers[index];
                        var _data01 = await dibujarSector( 'XLS_KIT_ANTIDERRAME_LAP' , rs.Codigo )
                        _datasArr.push( _data01 );
                    }
                    //
                    _Bloque11 = _datasArr ;
                }

                // ##################### INFORMES DE MANTENIMIENTO DE MAQUINARIAS Y EQUIPOS CRÍTICOS #####################
                var _Bloque12; var $where = {};
                $where.Estado =  { [Op.in] : ['Activo','Aprobado'] };
                $where.Fecha = { [Op.gte ] : _dataRepo.FecInicio , [Op.lte ]: _dataRepo.FecFin };
                var _dataOpers = await xlsLAPMantMaqCabModel.findAll({
                    where : $where
                });
                if(_dataOpers )
                {
                    var _datasArr = [];
                    //
                    for (let index = 0; index < _dataOpers.length; index++) {
                        const rs = _dataOpers[index];
                        var _data01 = await dibujarSector( 'XLS_MANT_MAQUINARIA_LAP' , rs.Codigo )
                        _datasArr.push( _data01 );
                    }
                    //
                    _Bloque12 = _datasArr ;
                }

                // ##################### CONSOLIDADO DE CONSUMO DE MATERIALES #####################
                var _Bloque13; var $where = {};
                $where.Estado =  { [Op.in] : ['Activo','Aprobado'] };
                $where.Fecha = { [Op.gte ] : _dataRepo.FecInicio , [Op.lte ]: _dataRepo.FecFin };
                var _dataOpers = await xlsLAPReqMatCabModel.findAll({
                    where : $where
                });
                if(_dataOpers )
                {
                    var _datasArr = [];
                    //
                    for (let index = 0; index < _dataOpers.length; index++) {
                        const rs = _dataOpers[index];
                        var _data01 = await dibujarSector( 'XLS_REQMATERIAL_LAP' , rs.Codigo )
                        _datasArr.push( _data01 );
                    }
                    //
                    _Bloque13 = _datasArr ;
                }

                // ##################### CONTROL DE TRASLADO Y BARRIDO DEL CAMIÓN BARREDOR #####################
                var _Bloque14; var $where = {};
                $where.Estado =  { [Op.in] : ['Activo','Aprobado'] };
                $where.Fecha = { [Op.gte ] : _dataRepo.FecInicio , [Op.lte ]: _dataRepo.FecFin };
                var _dataOpers = await LAPCarritoBarredorCabModel.findAll({
                    where : $where
                });
                if(_dataOpers )
                {
                    var _datasArr = [];
                    //
                    for (let index = 0; index < _dataOpers.length; index++) {
                        const rs = _dataOpers[index];
                        var _data01 = await dibujarSector( 'XLS_CARRITO_BARREDOR_LAP' , rs.Codigo )
                        _datasArr.push( _data01 );
                    }
                    //
                    _Bloque14 = _datasArr ;
                }

                // ##################### INFORME DE MANTENIMIENTO DE LA BARREDORA #####################
                var _Bloque15; var $where = {};
                $where.Estado =  { [Op.in] : ['Activo','Aprobado'] };
                $where.Fecha = { [Op.gte ] : _dataRepo.FecInicio , [Op.lte ]: _dataRepo.FecFin };
                var _dataOpers = await xlsLAPMantBarredoraModel.findAll({
                    where : $where
                });
                if(_dataOpers )
                {
                    var _datasArr = [];
                    //
                    for (let index = 0; index < _dataOpers.length; index++) {
                        const rs = _dataOpers[index];
                        var _data01 = await dibujarSector( 'XLS_MANT_BARREDORA_LAP' , rs.Codigo )
                        _datasArr.push( _data01 );
                    }
                    //
                    _Bloque15 = _datasArr ;
                }

                // ##################### INFORME DE DESEMPEÑO DE PERSONAL #####################
                var _Bloque16; var $where = {};
                $where.Estado =  { [Op.in] : ['Activo','Aprobado'] };
                $where.Fecha = { [Op.gte ] : _dataRepo.FecInicio , [Op.lte ]: _dataRepo.FecFin };
                var _dataOpers = await xlsLAPDesempenioPersonalModel.findAll({
                    where : $where
                });
                if(_dataOpers )
                {
                    var _datasArr = [];
                    //
                    for (let index = 0; index < _dataOpers.length; index++) {
                        const rs = _dataOpers[index];
                        var _data01 = await dibujarSector( 'XLS_DESEMPENIO_PERSONAL_LAP' , rs.Codigo )
                        _datasArr.push( _data01 );
                    }
                    //
                    _Bloque16 = _datasArr ;
                }

                // ##################### OTROS TRABAJOS #####################
                var _Bloque17 = []; var $where  = {}, _inTD = [];
                $where.Estado   =  { [Op.in] : ['Activo','Aprobado'] };
                $where.Fecha    = { [Op.gte ] : _dataRepo.FecInicio , [Op.lte ]: _dataRepo.FecFin };
                var _dataApoyo  = await xlsLAPApoyoCabModel.findAll({
                    where : $where
                })
                .catch( function (err) {
                    varDump( err );
                });

                if(_dataApoyo )
                {
                
                    for (let index = 0; index < _dataApoyo.length; index++)
                    {
                        const rs = _dataApoyo[index];
                        var _Detalle = await xlsLAPApoyoDeModel.findAll({
                            where : {
                                CodigoHead : rs.Codigo ,
                                Token : rs.uu_id
                            }
                        });

                        var _children = [], tableRow = [], arrIMGs = [];
                        for (let indexD = 0; indexD < _Detalle.length; indexD++)
                        {
                            const rsD = _Detalle[indexD];
                            
                            _Bloque17.push( new Paragraph({
                                text: rsD.Ubicacion
                            }) );


                            var _dataFilesD = await archiGoogleModel.findAll({
                                where : {
                                    formulario : 'LAP_APOYO' ,
                                    Cod001 : rsD.Codigo ,
                                    token : rsD.uu_id
                                }
                            });

                            var _ctd = 1, _RowTbl = [];
                            for (let iFiles = 0; iFiles < _dataFilesD.length; iFiles++)
                            {
                                const rsFile = _dataFilesD[iFiles];

                                if (fs.existsSync( rsFile.ruta_fisica ) )
                                {
                                    var _imgF1 = await dibujaCeldaBlk( 'IMG' , rsFile.ruta_fisica );
                                    var _tdIn  = await dibujaCeldaBlk( 'TD_IMG' , _imgF1 );
                                    arrIMGs.push(_tdIn);
                                }

                                _ctd++;
                                if( _ctd > 2 )
                                {
                                    _ctd = 1;
                                    var _tablrRow = new TableRow({
                                        children : arrIMGs,
                                    });
                                    _inTD.push( _tablrRow );
                                    arrIMGs = [];
                                }
                            }// for
                        }// for
                    }// for
                } // i

                _Bloque17.push( 
                    new Table({
                        alignment    : AlignmentType.CENTER,
                        columnWidths : [ 2000 , 2000 ],
                        width: {
                            size: 100,
                            type: WidthType.PERCENTAGE,
                        },
                        rows: _inTD
                    })
                );

                 // ##################### PESO FOD #####################
                 var _Bloque18 = []; var $where = {};
                 $where.Estado =  { [Op.in] : ['Activo','Aprobado'] };
                 $where.Fecha = { [Op.gte ] : _dataRepo.FecInicio , [Op.lte ]: _dataRepo.FecFin };
                 var _dataOpers = await LapPesoFodModel.findAll({
                     where : $where
                 });
                 if(_dataOpers )
                 {
                     var _datasArr = [];
                     //
                     for (let index = 0; index < _dataOpers.length; index++) {
                         const rs = _dataOpers[index];
                         var _data01 = await dibujarSector( 'XLS_PESO_FOD_LAP' , rs.Codigo )
                         _datasArr.push( _data01 );
                     }
                     //
                     _Bloque18 = _datasArr ;
                 }

                 // ##################### PERSONAL AID #####################
                var _Bloque19 = []; var $where = {};
                $where.Estado =  { [Op.in] : ['Activo','Aprobado'] };
                $where.Fecha = { [Op.gte ] : _dataRepo.FecInicio , [Op.lte ]: _dataRepo.FecFin };
                var _dataOpers = await LapPersonalAIDModel.findAll({
                    where : $where
                });
                if(_dataOpers )
                {
                    var _datasArr = [];
                    //
                    for (let index = 0; index < _dataOpers.length; index++) {
                        const rs = _dataOpers[index];
                        var _data01 = await dibujarSector( 'XLS_PERSONAL_AID_LAP' , rs.Codigo )
                        _datasArr.push( _data01 );
                    }
                    //
                    _Bloque19 = _datasArr ;
                }

                // ##################### PERSONAL SANCIONADO #####################
                var _Bloque20 = []; var $where = {};
                $where.Estado =  { [Op.in] : ['Activo','Aprobado'] };
                $where.Fecha = { [Op.gte ] : _dataRepo.FecInicio , [Op.lte ]: _dataRepo.FecFin };
                var _dataOpers = await LapPersonalSancionadoModel.findAll({
                    where : $where
                });
                if(_dataOpers )
                {
                    var _datasArr = [];
                    //
                    for (let index = 0; index < _dataOpers.length; index++) {
                        const rs = _dataOpers[index];
                        var _data01 = await dibujarSector( 'XLS_PERSONAL_SANCIONADO_LAP' , rs.Codigo )
                        _datasArr.push( _data01 );
                    }
                    //
                    _Bloque20 = _datasArr ;
                }

                // ##################### TRABAJO NO REALIZADO #####################
                var _Bloque21 = []; var $where  = {}, _inTD = [];
                $where.Estado   =  { [Op.in] : ['Activo','Aprobado'] };
                $where.Fecha    = { [Op.gte ] : _dataRepo.FecInicio , [Op.lte ]: _dataRepo.FecFin };
                var _dataApoyo  = await LapTrabajoNoRealizadoModel.findAll({
                    where : $where
                })
                .catch( function (err) {
                    varDump( err );
                });

                if(_dataApoyo )
                {
                
                    for (let index = 0; index < _dataApoyo.length; index++)
                    {
                        const rs = _dataApoyo[index];
                        var _Detalle = await LapTrabajoNoRealizadoDetModel.findAll({
                            where : {
                                CodigoHead : rs.Codigo ,
                                Token : rs.uu_id 
                            }
                        });

                        var _children = [], tableRow = [], arrIMGs = [];
                        for (let indexD = 0; indexD < _Detalle.length; indexD++)
                        {
                            const rsD = _Detalle[indexD];
                            
                            _Bloque21.push( new Paragraph({
                                text: rsD.Ubicacion
                            }) );


                            var _dataFilesD = await archiGoogleModel.findAll({
                                where : {
                                    formulario : 'XLS_TRABAJO_NO_REALIZADO_LAP' ,
                                    Cod001 : rsD.Codigo ,
                                    token : rsD.uu_id
                                }
                            });

                            var _ctd = 1, _RowTbl = [];
                            for (let iFiles = 0; iFiles < _dataFilesD.length; iFiles++)
                            {
                                const rsFile = _dataFilesD[iFiles];

                                if (fs.existsSync( rsFile.ruta_fisica ) )
                                {
                                    var _imgF1 = await dibujaCeldaBlk( 'IMG' , rsFile.ruta_fisica );
                                    var _tdIn  = await dibujaCeldaBlk( 'TD_IMG' , _imgF1 );
                                    arrIMGs.push(_tdIn);
                                }

                                _ctd++;
                                if( _ctd > 2 )
                                {
                                    _ctd = 1;
                                    var _tablrRow = new TableRow({
                                        children : arrIMGs,
                                    });
                                    _inTD.push( _tablrRow );
                                    arrIMGs = [];
                                }
                            }// for
                        }// for
                    }// for
                } // i

                _Bloque21.push( 
                    new Table({
                        alignment    : AlignmentType.CENTER,
                        columnWidths : [ 2000 , 2000 ],
                        width: {
                            size: 100,
                            type: WidthType.PERCENTAGE,
                        },
                        rows: _inTD
                    })
                );







                //

                // WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
                // WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
                // WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
                // WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
                // WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
                // WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
                _ArrDocWord.push( new Paragraph({ children : [ header_01 ] }), );
                _ArrDocWord.push( new Paragraph({
                    children : [
                        new TextRun({
                            text: ".",
                            break: 4,
                        }),
                    ]
                }));
                _ArrDocWord.push( new Paragraph({
                    text : `${_MesName} ${_arFecha[0]}`, // MES - AÑO
                    heading   : HeadingLevel.HEADING_1,
                    alignment : AlignmentType.CENTER,
                }) );
                _ArrDocWord.push( _NuevaPagina );
                _ArrDocWord.push( tblIndice );
                _ArrDocWord.push( _NuevaPagina );
                _ArrDocWord.push( new Paragraph({ children : [ imgIndice01 ] }) );
                _ArrDocWord.push( new Paragraph('.') );
                _ArrDocWord.push( table01 );
                _ArrDocWord.push( _NuevaPagina );
                _ArrDocWord.push( tblBloque1 );
                _ArrDocWord.push( _NuevaPagina );
                _ArrDocWord.push( new Paragraph({ children : [ imgIndice02 ] }) );
                _ArrDocWord.push( new Paragraph('') );
                //_ArrDocWord.push( _Bloque02  );
                /**/
                var _arAnt = _ArrDocWord;
                var _newArr = _arAnt.concat( _Bloque02 );
                _ArrDocWord = _newArr;
                /**/
                _ArrDocWord.push( _NuevaPagina );
                _ArrDocWord.push( new Paragraph({ children : [ imgIndice03 ] }) );
                /**/
                var _arAnt = _ArrDocWord;
                var _newArr = _arAnt.concat( _Bloque03 );
                _ArrDocWord = _newArr;
                /**/
                _ArrDocWord.push( _NuevaPagina );
                _ArrDocWord.push( new Paragraph({ children : [ imgIndice04 ] }) );
                /**/
                var _arAnt = _ArrDocWord;
                var _newArr = _arAnt.concat( _Bloque04 );
                _ArrDocWord = _newArr;
                /**/
                _ArrDocWord.push( _NuevaPagina );
                _ArrDocWord.push( new Paragraph({ children : [ imgIndice05 ] }) );
                /**/
                var _arAnt = _ArrDocWord;
                var _newArr = _arAnt.concat( _Bloque05 );
                _ArrDocWord = _newArr;
                /**/
                _ArrDocWord.push( _NuevaPagina );
                _ArrDocWord.push( new Paragraph({ children : [ imgIndice06 ] }) );
                /**/
                var _arAnt = _ArrDocWord;
                var _newArr = _arAnt.concat( _Bloque06 );
                _ArrDocWord = _newArr;
                /**/
                _ArrDocWord.push( _NuevaPagina );
                _ArrDocWord.push( new Paragraph({ children : [ imgIndice07 ] }) );
                /**/
                var _arAnt = _ArrDocWord;
                var _newArr = _arAnt.concat( _Bloque07 );
                _ArrDocWord = _newArr;
                /**/
                _ArrDocWord.push( _NuevaPagina );
                _ArrDocWord.push( new Paragraph({ children : [ imgIndice08 ] }) );
                /**/
                var _arAnt = _ArrDocWord;
                var _newArr = _arAnt.concat( _Bloque08 );
                _ArrDocWord = _newArr;
                /**/
                _ArrDocWord.push( _NuevaPagina );
                _ArrDocWord.push( new Paragraph({ children : [ imgIndice09 ] }) );
                /**/
                var _arAnt = _ArrDocWord;
                var _newArr = _arAnt.concat( _Bloque09 );
                _ArrDocWord = _newArr;
                /**/
                _ArrDocWord.push( _NuevaPagina );
                _ArrDocWord.push( new Paragraph({ children : [ imgIndice10 ] }) );
                /**/
                var _arAnt = _ArrDocWord;
                var _newArr = _arAnt.concat( _Bloque10 );
                _ArrDocWord = _newArr;
                /**/
                _ArrDocWord.push( _NuevaPagina );
                _ArrDocWord.push( new Paragraph({ children : [ imgIndice11 ] }) );
                /**/
                var _arAnt = _ArrDocWord;
                var _newArr = _arAnt.concat( _Bloque11 );
                _ArrDocWord = _newArr;
                /**/
                _ArrDocWord.push( _NuevaPagina );
                _ArrDocWord.push( new Paragraph({ children : [ imgIndice12 ] }) );
                /**/
                var _arAnt = _ArrDocWord;
                var _newArr = _arAnt.concat( _Bloque12 );
                _ArrDocWord = _newArr;
                /**/
                _ArrDocWord.push( _NuevaPagina );
                _ArrDocWord.push( new Paragraph({ children : [ imgIndice13 ] }) );
                /**/
                var _arAnt = _ArrDocWord;
                var _newArr = _arAnt.concat( _Bloque13 );
                _ArrDocWord = _newArr;
                /**/
                _ArrDocWord.push( _NuevaPagina );
                _ArrDocWord.push( new Paragraph({ children : [ imgIndice14 ] }) );
                /**/
                var _arAnt = _ArrDocWord;
                var _newArr = _arAnt.concat( _Bloque14 );
                _ArrDocWord = _newArr;
                /**/
                _ArrDocWord.push( _NuevaPagina );
                _ArrDocWord.push( new Paragraph({ children : [ imgIndice15 ] }) );
                /**/
                var _arAnt = _ArrDocWord;
                var _newArr = _arAnt.concat( _Bloque15 );
                _ArrDocWord = _newArr;
                /**/
                _ArrDocWord.push( _NuevaPagina );
                _ArrDocWord.push( new Paragraph({ children : [ imgIndice16 ] }) );
                /**/
                var _arAnt = _ArrDocWord;
                var _newArr = _arAnt.concat( _Bloque16 );
                _ArrDocWord = _newArr;
                /**/
                _ArrDocWord.push( _NuevaPagina );
                _ArrDocWord.push( new Paragraph({ children : [ imgIndice17 ] }) );
                /**/
                var _arAnt = _ArrDocWord;
                var _newArr = _arAnt.concat( _Bloque17 );
                _ArrDocWord = _newArr;
                /**/
                _ArrDocWord.push( _NuevaPagina );
                _ArrDocWord.push( new Paragraph({ children : [ imgIndice18 ] }) );
                /**/
                var _arAnt = _ArrDocWord;
                var _newArr = _arAnt.concat( _Bloque18 );
                _ArrDocWord = _newArr;
                /**/
                _ArrDocWord.push( _NuevaPagina );
                _ArrDocWord.push( new Paragraph({ children : [ imgIndice19 ] }) );
                /**/
                var _arAnt = _ArrDocWord;
                var _newArr = _arAnt.concat( _Bloque19 );
                _ArrDocWord = _newArr;
                /**/
                _ArrDocWord.push( _NuevaPagina );
                _ArrDocWord.push( new Paragraph({ children : [ imgIndice20 ] }) );
                /**/
                var _arAnt = _ArrDocWord;
                var _newArr = _arAnt.concat( _Bloque20 );
                _ArrDocWord = _newArr;
                /**/
                _ArrDocWord.push( _NuevaPagina );
                _ArrDocWord.push( new Paragraph({ children : [ imgIndice21 ] }) );
                /**/
                var _arAnt = _ArrDocWord;
                var _newArr = _arAnt.concat( _Bloque21 );
                _ArrDocWord = _newArr;
                /**/
                _ArrDocWord.push( _NuevaPagina );
                _ArrDocWord.push( new Paragraph({ children : [ imgFooter01 , imgFooter02 ] }) );
                /**/
                



                // WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
                // WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
                // WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW

                // Comenzamos a escribir el Word WWWWWWWWWWWWWWWWWWWWWWWWWWW
                const doc = new Document({
                    creator: "Dany De la Cruz",
                    title: "SSAYS - INFORME DE GESTIÓN",
                    description: "Informe de gestión SSAYS",
                    styles: {
                        paragraphStyles : _estilos,
                    },
                    numbering: {
                        config: _config
                    },
                    sections: [{
                        headers: {
                            default: new Header({
                                children: [
                                    new Paragraph({
                                        alignment: AlignmentType.RIGHT,
                                        children: [
                                            new TextRun("SSAYS S.A.C."),
                                            new TextRun({
                                                children: ["Página ", PageNumber.CURRENT],
                                            }),
                                            new TextRun({
                                                children: [" de ", PageNumber.TOTAL_PAGES],
                                            }),
                                        ],
                                    }),
                                ],
                            }),
                        },
                        children: _ArrDocWord ,
                    }],
                });
                b64string = await Packer.toBase64String(doc);
                //
            }
            //
        }else{
            //
            //
        }
        //
    } catch (error) {
        varDump( error );
        _response.codigo = 500;
        _response.resp = { 'titulo' : `Error` , 'clase' : `error` , 'texto' :  `Error: ${error}.` };
    }
    /**/
    res.setHeader('Content-Disposition', 'attachment; filename='+_NombreFile);
    res.send(Buffer.from(b64string, 'base64'));
    /**
    return res.status(_response.codigo).json( _response );
    /**/
});
// -------------------------------------------------------------

// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
function pad_with_zeroes(number, length)
{

    var my_string = '' + number;
    while (my_string.length < length) {
        my_string = '0' + my_string;
    }

    return my_string;

}
// -------------------------------------------------------------
async function execQuery_xls( _where , _limit  )
{
    // Obtener encabezados
    // CodigoHead
    var _dataResp = [];
    var _arAtributos = [];
    var NroCols = 0;
    //
    var _DataCab = await cargaExcelModelCab.findOne({
        where : _where
    });

    if( _DataCab )
    {
        NroCols = _DataCab.NroCols;
        _arAtributos.push( ['Indice' ,'#'] );
        for (let index = 1; index <= NroCols; index++)
        {
            var _No = await pad_with_zeroes( index , 2 );
            _arAtributos.push( [ `Col${_No}` , _DataCab[ `Cab${_No}` ] ] );
        }
        _dataResp = await cargaExcelModelDet.findAll({
            attributes : _arAtributos ,
            order : [
                ['Indice' , 'ASC']
            ],
            where : {
                CodigoHead : _DataCab.Codigo
            },
            limit : 1000
        });
    }else{
        varDump(`NO hay datos`);
    }

    return _dataResp;
    //
}
// -------------------------------------------------------------
async function dibujarSector( Flag , Codigo )
{
    var _htmlTabla = [], _objReturn = {};
    //
    var _dataFiles = await archiGoogleModel.findAll({
        where : {
            formulario : Flag ,
            Cod001 : Codigo
        }
    });
    try {
        //
        //varDump(`FLAG: ${Flag}, tienen ${_dataFiles.length} archivos.`);
        for (let index = 0; index < _dataFiles.length; index++)
        {
            const _rs = _dataFiles[index];
            var _rf   = _rs.extension;
            var _extension = _rf.toLowerCase();
            var NroPaginas = _rs.NroPaginas;
            varDump(`FLAG: ${Flag}, extensión: ${_extension}. >>>>>>>>>>>>> ${_rs.id}. NroPaginas: ${NroPaginas}.`);
            switch ( _extension )
            {
                case 'xlsx':
                case 'xls':
                    // + // + // + // + // + // + // + // + // + // + // + //
                    // Vamos a dibujar la tabla.
                    var _th_row = [], _td_row = [];
                    var _tblTH = [], _tblTD = [];
                    var _dataXLS = await execQuery_xls( { 'IdArchivo' :_rs.id , 'CodigoHead' : Codigo } , 800  );
                    if( _dataXLS )
                    {
                        // Dibujamos primero el head...
                        var _cOuntK = 0;
                        for (let indexK = 0; indexK < _dataXLS.length; indexK++) {
                            const element = _dataXLS[indexK];
                            if( _cOuntK == 0 )
                            {
                                for ( var property in element.dataValues )
                                {
                                    _th_row.push( property );
                                }
                            }
                            _cOuntK++;
                        }
                        _tblTH.push( new TableRow({
                            children : _th_row
                        }));

                        // Ahora a dibujar el body...
                        for (let index = 0; index < _dataXLS.length; index++)
                        {
                            //
                            const _rsData = _dataXLS[index];
                            for ( var property in _rsData.dataValues )
                            {
                                _td_row.push( await dibujaCeldaIndic( 'TD' , _rsData.dataValues[property] ));
                            }
                            _tblTD.push( new TableRow({
                                children : _td_row
                            }) );
                            //
                        }// for
                    }
                    // Unir arrays
                    var _rows_ = _tblTH.concat( _tblTD );
                    /**
                    _objReturn = new Table({
                        alignment    : AlignmentType.CENTER,
                        //columnWidths : [ 150 , 2000 , 400 , 2000 ],
                        width: {
                            size: 100,
                            type: WidthType.PERCENTAGE,
                        },
                        rows: _rows_
                    });
                    /**/
                break;
                // KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK
                case 'pdf':
                    //    CONVERTIMOS LOS PDF EN IMAGENES
                    for (let indF = 0; indF < NroPaginas; indF++)
                    {
                        var _idnice = parseInt( indF ) + 1;
                        var _Archivol = 'PDF_IMG_'+_rs.id+'_'+_idnice;
                        var _fileIMG = `${_RUTA_PROYECTO}adjuntos/reporte_lap/${_Archivol}.png`;
                        //
                        if (fs.existsSync( _fileIMG )) {
                            const image = new ImageRun({
                                data: fs.readFileSync( _fileIMG ),
                                transformation: {
                                    width  : 600,
                                    height : 800,
                                },
                            });
                            _htmlTabla.push( image );
                        }
                        //
                    }
                    _objReturn = new Paragraph({
                        children: _htmlTabla,
                    });
                break;
                default:
                    //
                break;
            }
        }
        //
    } catch (error) {
        varDump(`Error al generar sector reporte LAP`);
        varDump(error);
    }

    return _objReturn;
}
// -------------------------------------------------------------
async function dibujaCeldaBlk( _Tipo , Valor )
{
    //
    var _ObjReturn = {};
    switch ( _Tipo ) {
        case 'Bloque':
            _ObjReturn = new TableCell({
                bordersNO ,
                children: [ new Paragraph({
                    children : [
                        new TextRun({
                            text : Valor,
                            bold: true, color : 'B3E0EE',
                            size : 14
                        })
                    ],
                    columnSpan: 2,
                }) ],
                shading: { fill: "083346" },
                verticalAlign: VerticalAlign.CENTER, margins
            });
        break;
        case 'Area':
            _ObjReturn = new TableCell({
                borders ,
                children: [ new Paragraph({
                    children : [
                        new TextRun({
                            text : Valor,
                            color : '083346',
                            size : 14
                        })
                    ],
                    columnSpan: 2,
                }) ],
                verticalAlign: VerticalAlign.CENTER, margins
            });
        break;
        case 'Trabajo':
            _ObjReturn = new TableCell({
                borders ,
                children: [ new Paragraph({
                    children : [
                        new TextRun({
                            text : Valor,
                            color : '083346',
                            size : 14
                        })
                    ],
                    columnSpan: 2,
                }) ],
                verticalAlign: VerticalAlign.CENTER, margins
            });
        break;
        case 'Sector':
            _ObjReturn = new TableCell({
                borders ,
                children: [ new Paragraph({
                    children : [
                        new TextRun({
                            text : Valor,
                            color : '083346',
                            size : 14
                        })
                    ],
                    columnSpan: 2,
                }) ],
                verticalAlign: VerticalAlign.CENTER, margins
            });
        break;
        case 'TD_IMG':
            _ObjReturn = new TableCell({
                borders ,
                children: [
                    new Paragraph({
                        children: [ Valor ]
                    })
                ],
                verticalAlign: VerticalAlign.CENTER, margins
            });
        break;
        case 'IMG':
            // * `${_RUTA_PROYECTO}adjuntos/reporte_lap/IMG_20220514_151213.jpg`
            _ObjReturn = new ImageRun({
                data: fs.readFileSync( Valor ),
                transformation: {
                    width  : 280,
                    height : 220,
                },
            });
        break;
        default:
        break;
    }
    //varDump( _ObjReturn );
    return _ObjReturn;
    //
}
// -------------------------------------------------------------
async function dibujaCeldaIndic( _Tipo , Valor )
{
    //
    var _ObjReturn = {};
    switch ( _Tipo ) {
        case 'TH':
            _ObjReturn = new TableCell({
                borders ,
                children: [ new Paragraph({
                    children : [
                        new TextRun({
                            text : Valor,
                            bold: true, color : 'B3E0EE',
                            size : 16
                        })
                    ]
                }) ],
                shading: { fill: "083346" },
                verticalAlign: VerticalAlign.CENTER, margins
            });
        break;
        case 'TD':
            _ObjReturn = new TableCell({
                borders ,
                children: [ new Paragraph({
                    children : [
                        new TextRun({
                            text : Valor,
                            color : '083346',
                            size : 16
                        })
                    ]
                }) ],
                verticalAlign: VerticalAlign.CENTER, margins
            });
        break;
        case 'TD_IMG':
            _ObjReturn = new TableCell({
                borders ,
                children: [
                    new Paragraph({
                        children: [ Valor ]
                    })
                ],
                verticalAlign: VerticalAlign.CENTER, margins
            });
        break;
        case 'IMG':
            // * `${_RUTA_PROYECTO}adjuntos/reporte_lap/IMG_20220514_151213.jpg`
            _ObjReturn = new ImageRun({
                data: fs.readFileSync( Valor ),
                transformation: {
                    width  : 280,
                    height : 220,
                },
            });
        break;
        default:
        break;
    }
    //varDump( _ObjReturn );
    return _ObjReturn;
    //
}
// -------------------------------------------------------------
async function dibujaCelda( _Tipo , Valor )
{
    //
    var _ObjReturn = {};
    switch ( _Tipo ) {
        case 'TH':
            _ObjReturn = new TableCell({
                borders ,
                children: [ new Paragraph({
                    children : [
                        new TextRun({
                            text : Valor,
                            bold: true, color : 'B3E0EE',
                            size : 11
                        })
                    ]
                }) ],
                shading: { fill: "083346" },
                verticalAlign: VerticalAlign.CENTER, margins
            });
        break;
        case 'TD':
            _ObjReturn = new TableCell({
                borders ,
                children: [ new Paragraph({
                    children : [
                        new TextRun({
                            text : Valor,
                            color : '083346',
                            size : 10
                        })
                    ]
                }) ],
                verticalAlign: VerticalAlign.CENTER, margins
            });
        break;
        case 'TD_IMG':
            _ObjReturn = new TableCell({
                borders ,
                children: [
                    new Paragraph({
                        children: [ Valor ]
                    })
                ],
                verticalAlign: VerticalAlign.CENTER, margins
            });
        break;
        case 'IMG':
            // * `${_RUTA_PROYECTO}adjuntos/reporte_lap/IMG_20220514_151213.jpg`
            _ObjReturn = new ImageRun({
                data: fs.readFileSync( Valor ),
                transformation: {
                    width  : 280,
                    height : 220,
                },
            });
        break;
        default:
        break;
    }
    //varDump( _ObjReturn );
    return _ObjReturn;
    //
}
// -------------------------------------------------------------
async function objImagen( _url , ancho , alto )
{
    //
    var _ObjReturn = {};
    // * `${_RUTA_PROYECTO}adjuntos/reporte_lap/IMG_20220514_151213.jpg`
    _ObjReturn = new ImageRun({
        data: fs.readFileSync( _url ),
        transformation: {
            width  : ancho, height : alto,
        },
        //floating: _floatIMG
    });
    return _ObjReturn;
    //
}
// -------------------------------------------------------------
function varDump( _t )
{
    console.log( _t );
}
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
module.exports = router;
// -------------------------------------------------------------

