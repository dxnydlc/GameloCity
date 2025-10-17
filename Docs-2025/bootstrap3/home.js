/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
let urlServicio = `${_URL_NESTMy}v1/servicios/`;
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
var _AuthFormulario = 'TECNICO-SERVICIOS';
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
var TablaHomePs;
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
/* ------------------------------------------------------------- */
//
(function($){
	$(document).ready(function()
    {
        /* ------------------------------------------------------------- */
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
            "searching" : false,
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


                /* $.each($('td', row), function (colIndex) {
                    // For example, adding data-* attributes to the cell
                    $(this).attr('data-id', data.id );
                    $(this).attr('data-uuid', data.uu_id );
                });

                $(row).attr('data-id', data.id );
                $(row).attr('data-uuid', data.uu_id );
                $(row).attr('data-nombre', data.Articulo );
                /**/

                /**
                // Cliente VARIOS (4)
                if( data.IdClienteProv == 0 ){
                    $('td' ,row ).eq(4).html( data.ClienteVarios );
                }else{
                    $('td' ,row ).eq(4).html( data.Cliente );
                }
                /**/

                /**
                if( data.EstadoBlzk == 'SIGNED' ){
                    $('td' ,row ).eq(7).html(`<span class="label label-success">${data.EstadoBlzk}</span>`);
                }else{
                    $('td' ,row ).eq(7).html(`<span class="label label-danger">${data.EstadoBlzk}</span>`);
                }
                /**/

                /**/
                switch (data.Estado) {
                    case 'Activo':
                        $('td', row).eq(4).html(`<span class="label label-primary">${data.Estado}</span>`);
                        break;
                    case 'Aprobado':
                        $('td', row).eq(4).html(`<span class="label label-success">${data.Estado}</span>`);
                        break;
                    case 'Anulado':
                        $('td', row).eq(4).html(`<span class="label label-danger">${data.Estado}</span>`);
                        break;
                    case 'Emitido':
                        $('td', row).eq(4).html(`<span class="label label-success">${data.Estado}</span>`);
                        break;
                }
                /**/


                // Fecha Mod 12
                /**/
                //$('td' ,row ).eq( 12 ).html( moment( data.updated_at ).format('DD/MM/YYYY HH:mm') );
                $('td' ,row ).eq( 5 ).html( moment( data.updated_at ).format('DD/MM/YYYY HH:mm') );
                /**/
                
            },
            columns : [
                {
                    "data": null,
                    render: (data, type, row) => {
                        return `<a href='#' data-uuid="${data.uu_id}" data-id="${data.IdSistema}" class=" editarItem btn btn-primary btn-sm" ><i class="fa fa-edit" ></i></a>`;
                    }
                },
                {
                    "data": null,
                    render: (data, type, row) => {
                        return `<a href='#' data-uuid="${data.uu_id}" data-id="${data.IdSistema}" data-nombre="${data.Descripcion}" class=" anularItem btn btn-danger btn-sm" ><i class="fa fa-trash" ></i></a>`;
                    }
                },
                { "data": "IdSistema" },
                { "data": "Descripcion" },
                { "data": "Estado" },
                { "data": "updated_at" },
            ],
        });
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        // TECLAS ESPECIALES
        $(document).keydown(function(event) {
            //Tecla CTRL presionada
            if (!event.ctrlKey){ return true; }
            let letra = String.fromCharCode(event.which);
            letra = letra.toUpperCase();
            switch ( letra ) {
                case 'Q':
                    if( confirm('¿Cerrar documento?') ){

                        $('#wrapper_form').fadeOut('fast');
                        $('#wrapper_home').fadeIn('slow');

                        event.preventDefault();
                    }
                    break;
            
                default:
                    break;
            }
            // $("#result").text(String.fromCharCode(event.which));
            
        });
        /* ------------------------------------------------------------- */
        $('#btnCrear').click(function (e) { 
            e.preventDefault();

            $('#wrapper_home').fadeOut('fast');
            $('#wrapper_form').fadeIn('fast');

            nuevoForm();
            
        });
        /* ------------------------------------------------------------- */
        $(document).delegate('.cerrarFrame','click',function(e){
            e.preventDefault();

            if( confirm('¿Cerrar documento?') ){
                //
                $('#wrapper_home').fadeIn('fast');
                $('#wrapper_form').fadeOut('fast');

                TablaHomePs.columns.adjust().draw();
            }
        });
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        $(document).delegate('.editarDoc', 'click', function(event) {
            event.preventDefault();
            var _id = $(this).data('id'), _uuid = $(this).data('uuid'), _nombre = $(this).data('nombre');
            //
            $('#wrapper_home').fadeOut('fast');
            $('#wrapper_form').fadeIn('fast');

            nuevoForm();
            //
            cargarDoc( _id );
        });
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        $(document).delegate('.anularDoc', 'click', function(event) {
            event.preventDefault();
            let id = $(this).data('id'), uuID = $(this).data('uuid'), nombre = $(this).data('nombre');

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
        $("#btnGuardarR").on( "click", function(e) {
            e.preventDefault();
            guardarDoc();
        });
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        $("#btnAnular").on( "click", function(e) {
            e.preventDefault();

            let uuID = $('#frmDocumento #uu_id').val();

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
        // SELECT 2 USUARIOS NEST
        let Supervisor = $('#frmDocumento #Supervisor').select2({
            ajax: {
                url : `${_URL_NESTMy}v1/publico/select2-reg-emple/` ,
                dataType : 'json',
                data : function (params) {
                    var query = {
                        query : params.term,
                    }
                    return query;
                }
            },
            processResults: function (data) {
                return {
                results: data
                };
            },
            minimumInputLength : 3,width : '100%'
        });
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        Supervisor.on("select2:select", function (e) { 
            let _Id = e.params.data.id, _Texto = e.params.data.text;
            console.log("select2:select", _Id );
            $('#frmDocumento #nombre_supervisor').val( _Texto );
        });
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        // ARTICULOS SOFTCOM
        var $eventArticulos = $('#frmDocumento #IdArticulo').select2({
            ajax: {
                url: _URL_CONCAR+'/articulos/select2_articulos/',
                dataType: 'json',
                data: function (params) {
                    var query = {
                        q : params.term,
                        "user_token" : _token_node
                    }
                    return query;
                }
            },
            processResults: function (data) {
                return {
                    results: data
                };
            },
            minimumInputLength : 3,width : '100%'
        });
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        $eventArticulos.on("select2:select", function (e) { 
            var IdArticulo = e.params.data.id , UnidadMedida = e.params.data.UnidadMedida,Precio = parseFloat( e.params.data.Precio) ,Articulo = e.params.data.text;
            $('#frmDetalle #Articulo').val(Articulo);
            $('#frmDetalle #UnidadMedida').val(UnidadMedida);
            $('#frmDetalle #CostoUnit').val(Precio);
            setTimeout(function(){ $('#frmDetalle #Cantidad').trigger('focus'); $('#frmDetalle #Cantidad').select(); }, 300 );
            /* if( Precio == 0 ){
                alert('ArtÃ­culo sin precio.');
                $('#mdlArticulos #btnAddProdi').hide();
            }else{
                $('#btnAddProdi').show();
            } */
            // Ya existe Â¿?
            //$('#btnAddProdi').show();
            /* $.each( _ItemsReq , function( key, rs ) {
                if( IdArticulo == rs.IdArticulo ){
                    $('#frmDetalle #lblArticulo').html(`El artÃ­culo ya existe en la lista`);
                    $('#frmDetalle #btnAddProdi').hide();
                    return true;
                }else{
                    console.log('NO Existe');
                }
            }); */
            //
        });
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        // SELECT 2 CLIENTE NEST
        let IdClienteProv = $('#frmDocumento #IdClienteProv').select2({
            ajax: {
                url : `${_URL_NESTMy}v1/publico/clientes-select2/` ,
                dataType : 'json',
                data : function (params) {
                    var query = {
                        q : params.term,
                    }
                    return query;
                }
            },
            processResults: function (data) {
                return {
                results: data
                };
            },
            minimumInputLength : 3,width : '100%'
        });
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        IdClienteProv.on("select2:select", function (e) { 
            let _Id = e.params.data.id, _Texto = e.params.data.text;
            console.log("select2:select", _Id );
            $('#frmDocumento #Cliente').val( _Texto );
            getLocales( _Id , '' );
        });
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        let IdSucursal = $('#frmDocumento #IdSucursal').select2({
            width : '100%'
        });
        /* ------------------------------------------------------------- */
        IdSucursal.on("select2:select", function (e) { 
            let _Id = e.params.data.id, _Texto = e.params.data.text;
            console.log("select2:select", _Id );
            $('#frmDocumento #Sucursal').val( _Texto );
        });
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        $("#QuitarSelect").on( "click", function(e) {
            e.preventDefault();
            $('#frmDocumento #IdClienteProv').html(``);
            $('#frmDocumento #IdClienteProv').trigger('change');

            $('#frmDocumento #IdSucursal').html(``);
            $('#frmDocumento #IdSucursal').trigger('change');
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
        $("#ddddd").on( "click", function(e) {
            e.preventDefault();
        });
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        $("#ddddd").on( "click", function(e) {
            e.preventDefault();
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
    });

})(jQuery);
/* ------------------------------------------------------------- */
function initOrq(){
    //
    listarTodo();

    // ******* NODE JS *******
    socket.emit('accion:audit',{
        user  : $nomU,
        msg   : `HOME ${_AuthFormulario}` ,
        dni   : $dniU,
        serie : 0,
        corr  : 0,
        form  : _AuthFormulario,
        url   : window.location.href,
        token : ''
    });
    // ******* NODE JS *******
    //
}
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
function nuevoForm()
{
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
    $('#frmDocumento textarea').each(function(e){
        $(this).val('');
    });
    $('#frmDocumento #Codigo').val(0);
    $('#frmDocumento #id').val(0);
    let uuID = generateUUID();
    $( '#frmDocumento #uu_id' ).val( uuID );

    $('#frmDocumento #IdClienteProv').html(``);
    $('#frmDocumento #IdClienteProv').trigger('change');

    $('#frmDocumento #IdSucursal').html(``);
    $('#frmDocumento #IdSucursal').trigger('change');

    //tblDetalle.columns.adjust().draw();
}
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
// CARGAR DOC
function cargarDoc( ID )
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
        var url = `${urlServicio}get-by-id/${ID}`, metodo = `GET`;
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
                    tostada2( json.msg );

                    $('#frmDocumento #IdClienteProv').html(`<option value="${data.IdClienteProv}" >${data.Cliente}</option>`);
                    $('#frmDocumento #IdClienteProv').trigger('change');

                    getLocales( data.IdClienteProv , data.IdSucursal );

                    // ******* NODE JS *******
                    socket.emit('accion:audit',{
                        user  : $nomU,
                        msg   : `CARGAR ${_AuthFormulario} #${data.id}` ,
                        dni   : $dniU,
                        serie : 0,
                        corr  : data.id,
                        form  : _AuthFormulario,
                        url   : window.location.href,
                        token : data.uu_id
                    });
                    // ******* NODE JS *******
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
            getError02(xhr, status, error);
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
// GUARDAR DOC
function guardarDoc()
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
        var url = `${urlServicio}guardar`, metodo = `POST`;
        // - //
        var _dataSerializada = $('#frmDocumento').serialize();
        var Id = parseInt( $('#frmDocumento #id').val() ),uu_id = $('#frmDocumento #uu_id').val()
        if( Id > 0 ){
            url = `${urlServicio}actualizar/${uu_id}`;
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
                    $.each( json.data , function( key , value ){
                        $('#frmDocumento #'+key).val(value);
                    });
                    tostada2( json.msg );
                    listarTodo();

                    // ******* NODE JS *******
                    socket.emit('accion:audit',{
                        user  : $nomU,
                        msg   : `GUARDAR ${_AuthFormulario} #${data.id}` ,
                        dni   : $dniU,
                        serie : 0,
                        corr  : data.id,
                        form  : _AuthFormulario,
                        url   : window.location.href,
                        token : data.uu_id
                    });
                    // ******* NODE JS *******

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
            getError02(xhr, status, error);
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
// ANULAR DOC
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
                    let data = json.data;
                    tostada2( json.msg );
                    listarTodo();

                    // ******* NODE JS *******
                    socket.emit('accion:audit',{
                        user  : $nomU,
                        msg   : `ANULAR ${_AuthFormulario} #${data.id}` ,
                        dni   : $dniU,
                        serie : 0,
                        corr  : data.id,
                        form  : _AuthFormulario,
                        url   : window.location.href,
                        token : data.uu_id
                    });
                    // ******* NODE JS *******
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
            getError02(xhr, status, error);
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
// LISTAR TODO
function listarTodo()
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
                    let data = json.data;
                    
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
            getError02(xhr, status, error);
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
function getLocales( IdClienteProv , Default )
{
	//
	try {
        //
		$.ajax({
			url     : `${_URL_NESTMy}v1/sucursales/get-by-cliente/${IdClienteProv}`,
			method  : "GET",
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
                    let _html = '<option value="" >Seleccione</option>';
                    $.each( json.data , function( key, value ) {
                        _html += `<option value="${value.IdSucursal}" >${value.Descripcion}</option>` ; 
                        });
                    $('#frmDocumento #IdSucursal').html( _html );
                    if( Default ){
                        $('#frmDocumento #IdSucursal').val( Default );
                    }
                    $('#frmDocumento #IdSucursal').trigger('change');
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
            getError02(xhr, status, error);
		})
		.always(function() {
			//
		});
	} catch (error) {
		alert( error );
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