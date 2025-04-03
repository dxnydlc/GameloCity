/* ------------------------------------------------------------- */
let urlServicio =  `${_URL_NESTMy}v1/unidad-negocios/`;
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
var TablaHomePs;
/* ------------------------------------------------------------- */
let optsLangDatatable = {
    sProcessing : "Procesando...",
    sLengthMenu : "Mostrar _MENU_ registros",
    sZeroRecords: "No se encontraron resultados",
    sEmptyTable : "Ningún dato disponible en esta tabla",
    sInfo       : "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
    sInfoEmpty  : "Mostrando registros del 0 al 0 de un total de 0 registros",
    sInfoFiltered   : "(filtrado de un total de _MAX_ registros)",
    sInfoPostFix    : "",
    sSearch         : "Buscar:",
    sUrl            : "",
    sInfoThousands  : ",",
    sLoadingRecords : "Cargando...",
    oPaginate: {
        sFirst: "|<",
        sLast: ">|",
        sNext: ">",
        sPrevious: "<",
    },
    oAria: {
        sSortAscending: ": Activar para ordenar la columna de manera ascendente",
        sSortDescending: ": Activar para ordenar la columna de manera descendente",
    }
};
/* ------------------------------------------------------------- */
//
(function($){
	$(document).ready(function()
    {
        /* ------------------------------------------------------------- */
        $('#btnCrear').click(function (e) { 
            e.preventDefault();

            $('#wrapperTable').hide('slow');
            $('#frmDocumento').show('slow');

            $('#frmDocumento input[type="text"]').each(function(e){
                $(this).val('');
            });
            $('#frmDocumento input[type="hidden"]').each(function(e){
                $(this).val('');
            });
            $('#frmDocumento input[type="number"]').each(function(e){
                $(this).val('0');
            });
            $('#frmDocumento textarea').each(function(e){
              $(this).val('');
            });
            $('#frmDocumento #Codigo').val(0);
            $('#frmDocumento #id').val(0);
            let Token = generateUUID();
            $('#frmDocumento #uu_id' ).val( Token );
            //tblDetalle.columns.adjust().draw();
        });
        /* ------------------------------------------------------------- */
        $(document).delegate('.cerrarFrame','click',function(e){
            e.preventDefault();
            $('#wrapperTable').show('slow');
            $('#frmDocumento').hide('slow');
            setTimeout(function(){ TablaHomePs.columns.adjust().draw(); }, 1000 );
        });
        /* ------------------------------------------------------------- */
        $(document).delegate('.editarItem', 'click', function(event) {
            event.preventDefault();
            let _id = $(this).data('id'), uuID = $(this).data('uuid'), _nombre = $(this).data('nombre');
            //
            $('#wrapperTable').hide('slow');
            $('#frmDocumento').show('slow');
            //
            $('#frmDocumento input[type="text"]').each(function(e){
                $(this).val('');
            });
            $('#frmDocumento input[type="hidden"]').each(function(e){
                $(this).val('');
            });
            $('#frmDocumento input[type="number"]').each(function(e){
                $(this).val('0');
            });
            //
            cargarDoc( uuID );
        });
        /* ------------------------------------------------------------- */
        $("#btnGuardarDoc").on( "click", function(e) {
            e.preventDefault();
            guardarDoc();
        });
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        TablaHomePs = $('#TablaHomePs').DataTable({
            pagingType : "full_numbers",
            lengthMenu : [
                [ 100 , 200, 100 ],
                [ 100 , 200, 100 ],
            ],
            buttons: [
                {
                    extend: 'collection',
                    exportOptions: {
                    modifier: {
                    page: 'all',
                    search: 'none'   
                    }
                    },
                    text: 'Exportar',
                    buttons: [
                    'copy','excel','csv','pdf', 'print'
                    ]
                }
            ],
            "searching" : true,
            "order"     : [[ 2, "desc" ]],
            "scrollX"   : true,
            language : optsLangDatatable,
            dom: "<'row'<'col-sm-3'l><'col-sm-3'f><'col-sm-6'p>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-5'i><'col-sm-7'p>>",
            "initComplete": function(settings, json) {
                $('#tblDatos').waitMe('hide');
            },
            createdRow : function (row, data, rowIndex) {
                // Per-cell function to do whatever needed with cells
                $.each($('td', row), function (colIndex) {
                    // For example, adding data-* attributes to the cell
                    /* varDump( data );
                    varDump( data[colIndex] ); */
                    $(this).attr('data-id', data.id );
                    $(this).attr('data-uuid', data.uu_id );
                });
                $(row).attr('data-id', data.id );
                $(row).attr('data-uuid', data.uu_id );
                $(row).attr('data-nombre', data.Articulo );
        
                switch ( data.Estado ) {
                    case 'Digitado':
                        $('td' ,row ).eq(5).html(`<span class="label label-primary">${data.Estado}</span>`);
                    break;
                    case 'Activo':
                        $('td' ,row ).eq(5).html(`<span class="label label-success">${data.Estado}</span>`);
                    break;
                    case 'Anulado':
                        $('td' ,row ).eq(5).html(`<span class="label label-danger">${data.Estado}</span>`);
                    break;
                    case 'Emitido':
                        $('td' ,row ).eq(5).html(`<span class="label label-success">${data.Estado}</span>`);
                    break;
                }
        
                // Fecha Mod 7
                $('td' ,row ).eq( 7 ).html( moment( data.updated_at ).format('DD/MM/YYYY HH:mm') );
        
                
            },
            columns : [
                { "data" : null ,
                    render: (data,type,row) => {
                    return `<a href='#' data-uuid="${data.uu_id}" data-id="${data.id}" class=" editarItem btn btn-primary btn-sm" ><i class="fa fa-edit" ></i></a>`;
                    }
                },
                { "data" : null ,
                    render: (data,type,row) => {
                    return `<a href='#' data-uuid="${data.uu_id}" data-id="${data.id}" class=" anularItem btn btn-danger btn-sm" ><i class="fa fa-trash" ></i></a>`;
                    }
                },
                { "data" : "id" } , 
                { "data" : "Codigo" } , 
                { "data" : "Descripcion" } , 
                { "data" : "Estado" } , 
                { "data" : "UsuarioMod" } , 
                { "data" : "updated_at" } , 
            ],
        });
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        $(document).delegate('.anularItem', 'click', function(event) {
            event.preventDefault();
            let id = $(this).data('id'), uuID = $(this).data('uuid');
            $.confirm({
                title: 'Confirmar',
                type    : 'orange',
                content: 'Confirme eliminar documento',
                autoClose: 'Cancelar|10000',
                buttons: {
                    Confirmar: {
                        keys: [ 'enter','Y' ],
                        text : 'Confirmar (Y)',
                        btnClass: 'btn-blue',
                        action : function () {
                            anularDoc( uuID );
                        },
                    },
                    Cancelar: {
                        keys: [ 'N' ],
                        action : function () {
                            //
                        }
                    },
                }
            });
        });
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
    });

})(jQuery);
/* ------------------------------------------------------------- */
function initOrq(){
    //
    getAll();
}
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
function guardarDoc()
{
	//
	try {
		$('#frmDocumento').waitMe({
			effect  : 'facebook',
			text    : 'Espere...',
			bg      : 'rgba(255,255,255,0.7)',
			color   : '#146436',fontSize:'20px',textPos : 'vertical',
			onClose : function() {}
		});
        var url = `${urlServicio}`, metodo = `POST`;
        // - //
        var _dataSerializada = $('#frmDocumento').serialize();
        var Id = parseInt( $('#frmDocumento #id').val() ),uu_id = $('#frmDocumento #uu_id').val()
        if( Id > 0 ){
            url = `${urlServicio}${uu_id}`;
            metodo = `PATCH`;
        }
		$.ajax({
			url     : url,
            data    : _dataSerializada , 
			method  : metodo,
			dataType: "json",
			headers : {
				Authorization : `Bearer ${_session3001}`
			}
		})
		.done(function(  json ,textStatus, xhr ) {
			//
            console.log(xhr.status);
			switch ( xhr.status )
            {
                case 200:
                    //
                    let data = json.data;
                    $('#frmDocumento #id').val( data.id );
                    $('#frmDocumento #Codigo').val( data.Codigo );
                    tostada( 'Correcto' , 'Documento guardado' , 'success' );
                    getAll();
                    //
                break;
                case 202:
                    // denegado...
                    tostada( json.title , json.texto , json.clase );
                break;
                default:
                break;
            }
			/**/
		})
		.fail(function(xhr, status, error) {
            getError01(xhr, status, error);
			$('#frmDocumento').waitMe('hide');
		})
		.always(function() {
			$('#frmDocumento').waitMe('hide');
		});
	} catch (error) {
		alert( error );
		$('#frmDocumento').waitMe('hide');
	}
	//
}
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
function getAll()
{
	//
	try {
		$('#wrapper_form').waitMe({
			effect  : 'facebook',
			text    : 'Espere...',
			bg      : 'rgba(255,255,255,0.7)',
			color   : '#146436',fontSize:'20px',textPos : 'vertical',
			onClose : function() {}
		});
        var url = `${urlServicio}`, metodo = `GET`;
        // - //
        var _dataSerializada = $('#frmDocumento').serialize();
        //
		$.ajax({
			url     : url,
			method  : metodo,
			dataType: "json",
			headers : {
				Authorization : `Bearer ${_session3001}`
			}
		})
		.done(function(  json ,textStatus, xhr ) {
			//
			switch ( xhr.status )
            {
                case 200:
                    //
                    TablaHomePs.clear();
                    TablaHomePs.rows.add( json.data ).draw();
                    TablaHomePs.columns.adjust().draw();
                    //
                break;
                case 202:
                    // denegado...
                    tostada( json.title , json.texto , json.clase );
                break;
                default:
                break;
            }
			/**/
		})
		.fail(function(xhr, status, error) {
            getError01(xhr, status, error);
			$('#wrapper_form').waitMe('hide');
		})
		.always(function() {
			$('#wrapper_form').waitMe('hide');
		});
	} catch (error) {
		alert( error );
		$('#wrapper_form').waitMe('hide');
	}
	//
}
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
function cargarDoc( uuID )
{
	//
	try {
		$('#frmDocumento').waitMe({
			effect  : 'facebook',
			text    : 'Espere...',
			bg      : 'rgba(255,255,255,0.7)',
			color   : '#146436',fontSize:'20px',textPos : 'vertical',
			onClose : function() {}
		});
        var url = `${urlServicio}${uuID}`, metodo = `GET`;
        // - //
        var _dataSerializada = $('#frmDocumento').serialize();
        //
		$.ajax({
			url     : url,
			method  : metodo,
			dataType: "json",
			headers : {
				Authorization : `Bearer ${_session3001}`
			}
		})
		.done(function(  json ,textStatus, xhr ) {
			//
			switch ( xhr.status )
            {
                case 200:
                    //
                    let data = json.data;
                    $.each( json.data , function( key , value ){
                        $('#frmDocumento #'+key).val(value);
                    });
                    //
                break;
                case 202:
                    // denegado...
                    tostada( json.title , json.texto , json.clase );
                break;
                default:
                break;
            }
			/**/
		})
		.fail(function(xhr, status, error) {
            getError01(xhr, status, error);
			$('#frmDocumento').waitMe('hide');
		})
		.always(function() {
			$('#frmDocumento').waitMe('hide');
		});
	} catch (error) {
		alert( error );
		$('#frmDocumento').waitMe('hide');
	}
	//
}
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
function anularDoc( uuID )
{
	//
	try {
		$('#wrapper_form').waitMe({
			effect  : 'facebook',
			text    : 'Espere...',
			bg      : 'rgba(255,255,255,0.7)',
			color   : '#146436',fontSize:'20px',textPos : 'vertical',
			onClose : function() {}
		});
        var url = `${urlServicio}${uuID}`, metodo = `DELETE`;
        // - //
        var _dataSerializada = $('#frmDocumento').serialize();
        //
		$.ajax({
			url     : url,
			method  : metodo,
			dataType: "json",
			headers : {
				Authorization : `Bearer ${_session3001}`
			}
		})
		.done(function(  json ,textStatus, xhr ) {
			//
			switch ( xhr.status )
            {
                case 200:
                    //
                    getAll();
                    tostada( 'Correcto' , 'Anulado correctamente' , 'success' );
                    //
                break;
                case 202:
                    // denegado...
                    tostada( json.title , json.texto , json.clase );
                break;
                default:
                break;
            }
			/**/
		})
		.fail(function(xhr, status, error) {
            getError01(xhr, status, error);
			$('#wrapper_form').waitMe('hide');
		})
		.always(function() {
			$('#wrapper_form').waitMe('hide');
		});
	} catch (error) {
		alert( error );
		$('#wrapper_form').waitMe('hide');
	}
	//
}
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
function getError01( xhr , status, error) 
{
    //
    varDump( xhr );
    let responseJSON = xhr.responseJSON;
    let message = responseJSON.message;
    switch (xhr.status) {
        case 400://varios mensajes
            if( Array.isArray( message ) ){
                for (let index = 0; index < message.length; index++) {
                    const item = message[index];
                    tostada2( { titulo : 'Error' , 'texto' : item , clase : 'error' } );
                }
            }else{
                tostada2( { titulo : 'Error' , 'texto' : message , clase : 'error' } );
            }
        break;
        case 409:
            tostada2( { titulo : 'Error' , 'texto' : `${message}` , clase : 'error' } );
        break;
        default:
            tostada2( { titulo : 'Error' , 'texto' : `${xhr.status}-${error}` , clase : 'error' } );
        break;
    }
}
/* ------------------------------------------------------------- */
function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};
/* ------------------------------------------------------------- */
// <script type="text/javascript"></script>

