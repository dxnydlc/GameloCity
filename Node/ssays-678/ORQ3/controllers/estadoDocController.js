// estadoDocController.js

var _NombreDoc = `estadoDocController.js`;
// Modelos
const { adnSolServCabModel, xlsLAPTrabajadoresCabModel, reqMaterialesDetModel, reqMaterialesCabModel,xlsLAPDesempenioPersonalModel, reporteLapModel } = require('../db');


// *************************************************//
// *************************************************//
//              SOLICITUD EXAMEN MEDICO             //
// *************************************************//
// *************************************************//
const docDisponible = async ( TDoc , Estados , Codigo_u_Id ) => {
    // TDoc:
    /*
    SOL_EMO => Solicitud de examen médico
    */
    var _Respuesta = {};
    _Respuesta.Estado = '';
    _Respuesta.Color  = 'green';
    _Respuesta.Titulo = 'Correcto';
    _Respuesta.msg = '';

    try {
        switch ( TDoc )
        {
            case 'SOL_EMO':
                var _Data = await adnSolServCabModel.findOne({
                    where : {
                        Codigo : Codigo_u_Id
                    }
                });
                if( _Data )
                {
                    var _EstadoDoc = _Data.Estado;
                    if( Estados.includes( _EstadoDoc) )
                    {
                        //
                        _Respuesta.Estado = `Disponible`;
                        //
                    }else{
                        //
                        _Respuesta.Estado = 'Denegado';
                        _Respuesta.msg    = `El documento no esta disponible, estado ${_EstadoDoc}.`;
                        _Respuesta.Color  = 'red'; _Respuesta.Titulo = 'Error';
                        //
                    }
                }else{
                    _Respuesta.Estado = 'Denegado';
                    _Respuesta.msg    = `El documento no existe`;
                    _Respuesta.Color  = 'red'; _Respuesta.Titulo = 'Error';
                }
            break;
            case 'REQMAT':
                var _Data = await reqMaterialesCabModel.findOne({
                    where : {
                        IdRequerimientoCab : Codigo_u_Id
                    }
                });
                if( _Data )
                {
                    var _EstadoDoc = _Data.Estado;
                    if( Estados.includes( _EstadoDoc) )
                    {
                        //
                        _Respuesta.Estado = `Disponible`;
                        //
                    }else{
                        //
                        _Respuesta.Estado = 'Denegado';
                        _Respuesta.texto    = `El documento no esta disponible, estado ${_EstadoDoc}.`;
                        _Respuesta.clase  = 'error'; _Respuesta.Titulo = 'Error';
                        //
                    }
                }else{
                    _Respuesta.Estado = 'Denegado';
                    _Respuesta.texto    = `El documento no existe`;
                    _Respuesta.clase  = 'error'; _Respuesta.Titulo = 'Error';
                }
            break;
            case 'DESM_PERSON':
                _Respuesta.codigo = 200;
                var _Data = await xlsLAPDesempenioPersonalModel.findOne({
                    where : {
                        Codigo : Codigo_u_Id
                    }
                });
                if( _Data )
                {
                    var _EstadoDoc = _Data.Estado;
                    if( Estados.includes( _EstadoDoc) )
                    {
                        //
                        _Respuesta.Estado = `Disponible`;
                        //
                    }else{
                        //
                        _Respuesta.codigo = 202;
                        _Respuesta.Estado = 'Denegado';
                        _Respuesta.texto  = `El documento no esta disponible, estado ${_EstadoDoc}.`;
                        _Respuesta.clase  = 'error'; _Respuesta.title = 'Error';
                        //
                    }
                }else{
                    _Respuesta.codigo = 202;
                    _Respuesta.Estado = 'Denegado';
                    _Respuesta.texto  = `El documento no existe`;
                    _Respuesta.clase  = 'error'; _Respuesta.title = 'Error';
                }
            break;
        }
    } catch (error) {
        _Respuesta.Estado = 'Denegado';
        _Respuesta.Color  = 'red';
        _Respuesta.Titulo = 'Error-';
        _Respuesta.title = 'Error-';
        _Respuesta.msg = error.message;
    }
    //
    return _Respuesta
    //
};

// *************************************************//
// *************************************************//
//              VALIDAR ESTADO DOCUMENTO (2)             //
// *************************************************//
// *************************************************//
const docDisponible2 = async ( TDoc , Estados , Codigo_u_Id ) => {
    // TDoc:
    /*
    SOL_EMO => Solicitud de examen médico
    */
    var _Respuesta = {};
    _Respuesta.codigo = 200;
    _Respuesta.titulo = '';
    _Respuesta.clase  = '';
    _Respuesta.texto  = '';

    try {
        switch ( TDoc )
        {
            case 'DESM_PERSON':
                //
                var _Data = await xlsLAPDesempenioPersonalModel.findOne({
                    where : {
                        Codigo : Codigo_u_Id
                    }
                });
                if( _Data )
                {
                    var _EstadoDoc = _Data.Estado;
                    if( Estados.includes( _EstadoDoc) )
                    {
                        //
                        _Respuesta.codigo = 200;
                        //
                    }else{
                        //
                        _Respuesta.codigo = 202;
                        _Respuesta.texto  = `El documento no esta disponible, estado ${_EstadoDoc}.`;
                        _Respuesta.clase  = 'error'; _Respuesta.title = 'Error';
                        //
                    }
                }else{
                    _Respuesta.codigo = 202;
                    _Respuesta.texto  = `El documento no existe`;
                    _Respuesta.clase  = 'error'; _Respuesta.title = 'Error';
                }
            break;
        }
    } catch (error) {
        _Respuesta.codigo = 202;
        _Respuesta.clase = 'error';
        _Respuesta.title = 'Error-interno';
        _Respuesta.texto = error.message;
    }
    //
    return _Respuesta
    //
};



module.exports.docDisponible  = docDisponible;

module.exports.docDisponible2 = docDisponible2;


// --