// permisosController.js

var _NombreDoc = `permisosController.js`;
// Modelos
const { aprobacionesModel } = require('../db');


// *************************************************//
// *************************************************//
//              EL USUARIO PUEDE APROBAR            //
// *************************************************//
// *************************************************//
const verPermiso = async ( IdDoc , IdUser , Dato ) => {
    // IdDoc, IdUser, Dato['Aprobar','Anular','Editar','Crear']
    var _Respuesta = {};
    _Respuesta.Estado = '';
    _Respuesta.Color  = 'green';
    _Respuesta.Titulo = 'Correcto';
    _Respuesta.msg = '';
    try {
        //
        var _dataAprob = await aprobacionesModel.findOne({
            where: { 
                IdTipoDoc : IdDoc ,
                IdUser : IdUser 
            }
        })
        .catch(function (err) {
            console.log(_NombreDoc);
            console.log( err );
        });
        if( _dataAprob )
        {
            console.log(`Id de permiso ${_dataAprob.IdAprobar}`);
            switch( Dato )
            {
                case 'Aprobar':
                    if( _dataAprob.aprobar == 'SI' ){
                        _Respuesta.Estado = `Aceptado`;
                    }else{
                        _Respuesta.Estado = `Denegado`;
                        _Respuesta.Color  = 'red'; _Respuesta.Titulo = 'Error';
                    }
                break;
                case 'Anular':
                    if( _dataAprob.aprobar == 'SI' ){
                        _Respuesta.Estado = `Aceptado`;
                    }else{
                        _Respuesta.Estado = `Denegado`;
                        _Respuesta.Color  = 'red'; _Respuesta.Titulo = 'Error';
                    }
                break;
                case 'Crear':
                    if( _dataAprob.aprobar == 'SI' ){
                        _Respuesta.Estado = `Aceptado`;
                    }else{
                        _Respuesta.Estado = `Denegado`;
                        _Respuesta.Color  = 'red'; _Respuesta.Titulo = 'Error';
                    }
                break;
                case 'Editar':
                    if( _dataAprob.aprobar == 'SI' ){
                        _Respuesta.Estado = `Aceptado`;
                    }else{
                        _Respuesta.Estado = `Denegado`;
                        _Respuesta.Color  = 'red'; _Respuesta.Titulo = 'Error';
                    }
                break;
            }
        }else{
            _Respuesta.Estado = 'Denegado';
            _Respuesta.msg = `Su usuario no cuenta con permisos`;
            _Respuesta.Color  = 'red'; _Respuesta.Titulo = 'Error';
        }
        //
    } catch (error) {
        //res.status(500).send({ message: error.message });
        _Respuesta.Estado = 'Denegado';
        _Respuesta.Color  = 'red';
        _Respuesta.Titulo = 'Error';
        _Respuesta.msg = error.message;
    }
    //
    return _Respuesta
    //
};
// *************************************************//
const verPermiso2 = async ( IdDoc , IdUser , Dato ) => {
    // IdDoc, IdUser, Dato['Aprobar','Anular','Editar','Crear']
    var _Respuesta = {};
    _Respuesta.Estado = '';
    _Respuesta.clase  = 'success';
    _Respuesta.titulo = 'Correcto';
    _Respuesta.texto = '';
    try {
        //
        var _dataAprob = await aprobacionesModel.findOne({
            where: { 
                IdTipoDoc : IdDoc ,
                IdUser : IdUser 
            }
        })
        .catch(function (err) {
            console.log(_NombreDoc);
            console.log( err );
        });
        if( _dataAprob )
        {
            console.log(`Id de permiso ${_dataAprob.IdAprobar}`);
            switch( Dato )
            {
                case 'Aprobar':
                    if( _dataAprob.aprobar == 'SI' ){
                        _Respuesta.Estado = `Aceptado`;
                    }else{
                        _Respuesta.Estado = `Denegado`;
                        _Respuesta.clase  = 'error'; _Respuesta.titulo = 'Error';
                    }
                break;
                case 'Anular':
                    if( _dataAprob.aprobar == 'SI' ){
                        _Respuesta.Estado = `Aceptado`;
                    }else{
                        _Respuesta.Estado = `Denegado`;
                        _Respuesta.clase  = 'error'; _Respuesta.titulo = 'Error';
                    }
                break;
                case 'Crear':
                    if( _dataAprob.aprobar == 'SI' ){
                        _Respuesta.Estado = `Aceptado`;
                    }else{
                        _Respuesta.Estado = `Denegado`;
                        _Respuesta.clase  = 'error'; _Respuesta.titulo = 'Error';
                    }
                break;
                case 'Editar':
                    if( _dataAprob.aprobar == 'SI' ){
                        _Respuesta.Estado = `Aceptado`;
                    }else{
                        _Respuesta.Estado = `Denegado`;
                        _Respuesta.clase  = 'error'; _Respuesta.titulo = 'Error';
                    }
                break;
            }
        }else{
            _Respuesta.Estado = 'Denegado';
            _Respuesta.texto = `Su usuario no cuenta con permisos`;
            _Respuesta.clase  = 'error'; _Respuesta.titulo = 'Error';
        }
        //
    } catch (error) {
        //res.status(500).send({ message: error.message });
        _Respuesta.Estado = 'Denegado';
        _Respuesta.clase  = 'error';
        _Respuesta.titulo = 'Error';
        _Respuesta.texto = error.message;
    }
    //
    return _Respuesta
    //
};
// *************************************************//
const getName = () => {
    return 'Dany';
};

module.exports.verPermiso  = verPermiso;
module.exports.verPermiso2 = verPermiso2;
exports.getName = getName;

