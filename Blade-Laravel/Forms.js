
/*

{{ asset('dddd') }}

$('#frmDocumento #IdCliente').html(`<option value="" >Todos</option>`);
$('#frmDocumento #IdCliente').trigger('change');

/**/

// Traer todos los check box seleccionados
var favorite = [];
$.each($("input[name='sport']:checked"), function(){
	favorite.push($(this).val());
});
alert("My favourite sports are: " + favorite.join(", "));

// change un combito select2
/*
$('#frmDocumento #IdResponsable').html(`<option value="${json.data.IdResponsable}" >${json.data.Responsable}</option>`);
$('#frmDocumento #IdResponsable').trigger('change');
/**/

Swal.fire(
	'Good job!',
	'You clicked the button!',
	'success'
);
Swal.fire('Any fool can use a computer');
Swal.fire({
	icon: 'error',
	title: 'Oops...',
	text: 'Something went wrong!',
	footer: '<a href>Why do I have this issue?</a>'
});


// salto de linea a ,
var arrCerts = NroCertificados.split("\n");
var arrSeries = arrCerts.join(',');


try {
  nonExistentFunction();
} catch (error) {
  console.error(error);
  // expected output: ReferenceError: nonExistentFunction is not defined
  // Note - error messages will vary depending on browser
}


// Fecha Hora contacto
var $FechaHoraContacto = moment( json.data.FechaHoraContacto ).format('YYYY-MM-DDTHH:mm:ss');
$('#frmDocumento #FechaHoraContacto').val($FechaHoraContacto);

$('#ddddd').click(function (e) { 
	e.preventDefault();
});

await fichaInspeccionModel.create(req.body)
.then(( result ) => {
	//logger.info('Successfully established connection to database')
	$response.data = result;
})
.catch((err) => {
	esrcribeError( err );
});

// maximo 90 dias
if( $('#correlativo').val() == '' ){
  var a = moment( $('#fecIn').val() );
  var b = moment( $('#fecFi').val() );
  var $dias = parseInt( b.diff(a, 'days') );
  if( $dias > 90 ){
	alert('sÃ³lo se puede buscar por un rango mÃ¡ximo de 90 dÃ­as.');
	return true;
  }
}


setTimeout(function(){ alert("Hello"); }, 3000);


$("input[type='button']").click(function(){
	var radioValue = $("input[name='gender']:checked").val();
	if(radioValue){
		alert("Your are a - " + radioValue);
	}
});

delete objeto.propiedad
// #####################################################
Swal.fire(
	'Correcto',
	'Datos actualizados.',
	'success'
);

// #####################################################
// contar array
var fruits = ["Banana", "Orange", "Apple", "Mango"];
fruits.length;

// #####################################################
// texto combo seleccionado 
var $texto = $( "#frmDocumento #id_ambiente option:selected" ).text();

var $id = $(this).data('id'),$uuid = $(this).data('uuid');

// setTimeout
setTimeout(function(){ alert("Hello"); }, 3000);

// #####################################################
// Select2
var $eventUser = $('.select-corr').select2({
	ajax: {
		url: _URL_API + 'src/clientes/get',
		dataType: 'json'
		// Additional AJAX parameters go here; see the end of this chapter for the full code of this example
	},
	processResults: function (data) {
	    return {
	      results: data
	    };
  	},
  	minimumInputLength : 3,width : '100%'
});
// #####################################################
// url: _URL_NODE3+'/api/src/usuarios_select2/',
// select2_productos
// cc_select2
// giros_select2
var $eventCliente = $('#frmDocumento #cboCliente').select2({
	ajax: {
		url: _URL_NODE3+'/api/src/clientes2_select2/',
		dataType: 'json',
		data: function (params) {
			var query = {
				q : params.term,
				"user_token" : _token_node
			}
			// Query parameters will be ?search=[term]&type=public
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

// #####################################################
//call back on select
$eventUser.on("select2:select", function (e) { 
	var _Id = e.params.data.id, _Texto = e.params.data.text;
	console.log("select2:select", _Id );
});


$eventLocal.on("select2:select", function (e) { 
	var IdSucursal = e.params.data.id;
	console.log(IdSucursal);
	$('#frmDocumento #DireccionDestino').val( '' );
	$.each( $dataLocales , function( key, value ) {
		if( IdSucursal == value.IdSucursal ){
			$('#frmDocumento #DireccionDestino').val( value.Direccion );
			$('#frmDocumento #sucursal').val( value.Descripcion );
		}
	});
});

$('#mdlArticulos').on('shown.bs.modal', function (e) {
	// Pre seleccionar un combo select2
	$("#frmDetalle #IdArticulo").select2('open');
	$(".select2-search__field")[0].focus();
});

// #####################################################
var num = 5.56789;
var n = num.toFixed(2);

$(document).delegate('.delData', 'click', function(event) {
	event.preventDefault();
	var $id = $(this).data('id'), $uuid = $(this).data('uuid'), $nombre = $(this).data('nombre');
});

$(document).delegate('.delData', 'click', function(event) {
	event.preventDefault();
	var $id = $(this).data('id'), $uuid = $(this).data('uuid'), $nombre = $(this).data('nombre');
	Swal.fire({
		title: 'Confirmar',
		text: "Anular documento",
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Yes, delete it!'
	}).then((result) => {
		if (result.isConfirmed) {
		//
		}
	});
});

/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
function delDocumento( $uuid )
{
	//
	$('#wrapperTable').waitMe({
		effect: 'facebook',
		text: 'Espere...',
		bg: 'rgba(255,255,255,0.7)',
		color:'#146436',fontSize:'20px',textPos : 'vertical',
		onClose : function() {}
	});
	$.ajax({
		url     : `${_URL_NODE3}/api/config/${$uuid}`,
		method  : "DELETE",
		dataType: "json",
		headers : {
			"api-token" : _TokenUser,
			"user-token" : _token_node
		}
	})
	.done(function(  json ) {
		switch(json.estado)
		{
			case 'ERROR':
				alert(json.error);
			break;
			case 'OK':
				// negocio...
				var $jsonData = populateCC( json );
				table.clear();
				table.rows.add($jsonData).draw();
			break;
		}
	})
	.fail(function(xhr, status, error) {
		if( xhr.status == 422 )
		{
			// 422 es decir un error de validacion de datos...
			var $errores = xhr.responseJSON, $texto = '', $arError = [];
			$.each( $errores.errores , function( key, value ) {
				$arError.push( value.msg );
			});
			$texto = $arError.join(', ');
			Swal.fire({
				icon: 'error',
				title: 'Revise lo siguiente...',
				text: `${$texto}`
			});
		}else{
			alert('Error al ejecutar');
		}
		$('#wrapperTable').waitMe('hide');
	})
	.always(function() {
		$('#wrapperTable').waitMe('hide');
	});
	//
}
/* ------------------------------------------------------------- */
function renovarToken()
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
    $('#frmDocumento #uu_id').val( result );   
}
/* ------------------------------------------------------------- */
$('#frmDocumento input[type="text"]').each(function(e){
	$(this).val('');
});
$('#frmDocumento input[type="hidden"]').each(function(e){
	$(this).val('');
});
$('#frmDocumento input[type="number"]').each(function(e){
	$(this).val('0');
});
/* ------------------------------------------------------------- */
// NODE*
models.Item.create({
	title 	: req.body.title,
	UserId 	: req.body.UserId
})
.then(function(item){
	res.json({
		"Message" : "Created item.",
		"Item" : item
	});
})
.catch(function (err) {
	captueError( err.original , req.body );
	console.log(_NombreDoc);
	$response.estado = 'ERROR';$response.error  = err.original.sqlMessage;res.json( $response );
});
/* ------------------------------------------------------------- */
// const { errorLogModel } = require('../../dbA');
// captueError( err.original , req.body );
/* ------------------------------------------------------------- */
async function captueError( error , post )
{
    var _envio       = JSON.stringify(post);
    var _descripcion = JSON.stringify(error);
    var _uuid = await renovarToken();
    await errorLogModel.create({
        uu_id : _uuid,
        modulo : 'api_reqPersonal',
        descripcion : _descripcion,
        envio : _envio
    })
    .catch(function (err) {
        console.log(_NombreDoc);
        console.log(err);
    });
}
// -------------------------------------------------------
// GET AREAS
/* ------------------------------------------------------------- */
function getAreas()
{
    $('#cboArea').waitMe({
        effect: 'facebook',
        bg: 'rgba(255,255,255,0.7)',
        color:'#146436',fontSize:'20px',textPos : 'vertical',
        onClose : function() {}
    });
    $.ajax({
        url     : _URL_NODE3+'/api/areas',
        method  : "GET",
        dataType: "json",
        headers : {
            "api-token" : _TokenUser,
            "user-token" : _token_node
        }
    })
    .done(function(  json ) {
        switch(json.estado)
        {
            case 'ERROR':
                alert(json.error);
            break;
            case 'OK':
                // negocio...
                var $jsonData = populateAreas( json );
            break;
        }
    })
    .fail(function(xhr, status, error) {
        if( xhr.status == 422 )
        {
            // 422 es decir un error de validacion de datos...
            var $errores = xhr.responseJSON, $texto = '', $arError = [];
            $.each( $errores.errores , function( key, value ) {
                $arError.push( value.msg );
            });
            $texto = $arError.join(', ');
            Swal.fire({
                icon: 'error',
                title: 'Revise lo siguiente...',
                text: `${$texto}`
            });
        }else{
            alert('Error al ejecutar');
        }
    })
    .always(function() {
        $('#cboArea').waitMe('hide');
    });
}
/* ------------------------------------------------------------- */
function populateAreas( json )
{
	//
	var $html = '<option value="" >Todos</option>';
	if( json.data != undefined ){
		$.each( json.data , function( key, value ) {
			//$html += `<option value="${value.CodArea}" >${value.Descripcion}</option>`;
		});
	}
	//
	$('#cboArea').html( $html );
  getPuestosISO( $('#cboArea').val() );
}
/* ------------------------------------------------------------- */
function getPuestosISO( Area )
{
    $('#cboPuestoISO').waitMe({
        effect: 'facebook',
        bg: 'rgba(255,255,255,0.7)',
        color:'#146436',fontSize:'20px',textPos : 'vertical',
        onClose : function() {}
    });
    $.ajax({
        url     : _URL_NODE3+'/api/puesto_iso/src',
        method  : "POST",
        data    : { 'Area' : Area },
        dataType: "json",
        headers : {
            "api-token" : _TokenUser,
            "user-token" : _token_node
        }
    })
    .done(function(  json ) {
        switch(json.estado)
        {
            case 'ERROR':
                alert(json.error);
            break;
            case 'OK':
                // negocio...
                var $jsonData = populatePuestoISO( json );
            break;
        }
    })
    .fail(function(xhr, status, error) {
        if( xhr.status == 422 )
        {
            // 422 es decir un error de validacion de datos...
            var $errores = xhr.responseJSON, $texto = '', $arError = [];
            $.each( $errores.errores , function( key, value ) {
                $arError.push( value.msg );
            });
            $texto = $arError.join(', ');
            Swal.fire({
                icon: 'error',
                title: 'Revise lo siguiente...',
                text: `${$texto}`
            });
        }else{
            alert('Error al ejecutar');
        }
    })
    .always(function() {
        $('#cboPuestoISO').waitMe('hide');
    });
}
/* ------------------------------------------------------------- */
function populatePuestoISO( json )
{
	//
	$html = '<option value="" >Todos</option>';
	if( json.data != undefined ){
		$.each( json.data , function( key, value ) {
			//$html += `<option value="${value.idPuestoIso}" >${value.Descripcion}</option>`;
		});
	}
	//
	$('#cboPuestoISO').html( $html );
}
/* ------------------------------------------------------------- */
function ubigeo_Departamento()
{
    //
    $('#frmDocumento #wrap_Departamento').waitMe({
        effect: 'facebook',
        bg: 'rgba(255,255,255,0.7)',
        color:'#146436',fontSize:'20px',textPos : 'vertical',
        onClose : function() {}
    });
    $.ajax({
        url     : _URL_NODE3+'/api/ubigeo/departamento',
        method  : "POST",
        dataType: "json",
        headers : {
            "api-token" : _TokenUser,
            "user-token" : _token_node
        }
    })
    .done(function(  json ) {
        switch(json.estado)
        {
            case 'ERROR':
                alert(json.error);
            break;
            case 'OK':
                // negocio...
                var $htmlOption = '<option value="" >Seleccione</option>';
                if( json.results != undefined ){
                    $.each( json.results , function( key, value ) {
                        //$htmlOption += `<option value="${value.id}" >${value.name}</option>`;
                    });
                    $('#frmDocumento #cboDepa').html($htmlOption);
                    $('#frmDocumento #cboDepa').trigger('change');
                }
            break;
        }
    })
    .fail(function(xhr, status, error) {
        if( xhr.status == 422 )
        {
            // 422 es decir un error de validacion de datos...
            var $errores = xhr.responseJSON, $texto = '', $arError = [];
            $.each( $errores.errores , function( key, value ) {
                $arError.push( value.msg );
            });
            $texto = $arError.join(', ');
            Swal.fire({
                icon: 'error',
                title: 'Revise lo siguiente...',
                text: `${$texto}`
            });
        }else{
            alert('Error al ejecutar');
        }
        $('#frmDocumento #wrap_Departamento').waitMe('hide');
    })
    .always(function() {
        $('#frmDocumento #wrap_Departamento').waitMe('hide');
    });
}
/* ------------------------------------------------------------- */
function ubigeo_Provincia()
{
  var $Depa = $('#frmDocumento #cboDepa').val();
  if( $Depa == '' )
  {
    $('#frmDocumento #cboProv').html('');
    $('#frmDocumento #cboProv').trigger('change');
    return true;
  }
    $('#frmDocumento #wrap_Provincia').waitMe({
        effect: 'facebook',
        bg: 'rgba(255,255,255,0.7)',
        color:'#146436',fontSize:'20px',textPos : 'vertical',
        onClose : function() {}
    });
    $.ajax({
        url     : _URL_NODE3+'/api/ubigeo/provincia/'+$('#frmDocumento #cboDepa').val(),
        method  : "POST",
        dataType: "json",
        headers : {
            "api-token" : _TokenUser,
            "user-token" : _token_node
        }
    })
    .done(function(  json ) {
        switch(json.estado)
        {
            case 'ERROR':
                alert(json.error);
            break;
            case 'OK':
                // negocio...
                var $htmlOption = '<option value="" >Seleccione</option>';
                if( json.results != undefined ){
                    $.each( json.results , function( key, value ) {
                        //$htmlOption += `<option value="${value.id}" >${value.name}</option>`;
                    });
                    $('#frmDocumento #cboProv').html($htmlOption);
                    $('#frmDocumento #cboProv').trigger('change');
                }
            break;
        }
    })
    .fail(function(xhr, status, error) {
        if( xhr.status == 422 )
        {
            // 422 es decir un error de validacion de datos...
            var $errores = xhr.responseJSON, $texto = '', $arError = [];
            $.each( $errores.errores , function( key, value ) {
                $arError.push( value.msg );
            });
            $texto = $arError.join(', ');
            Swal.fire({
                icon: 'error',
                title: 'Revise lo siguiente...',
                text: `${$texto}`
            });
        }else{
            alert('Error al ejecutar');
        }
        $('#frmDocumento #wrap_Provincia').waitMe('hide');
    })
    .always(function() {
        $('#frmDocumento #wrap_Provincia').waitMe('hide');
    });
}
/* ------------------------------------------------------------- */
function ubigeo_Distrito()
{
  var $Prov = $('#frmDocumento #cboProv').val();
  if( $Prov == '' )
  {
    $('#frmDocumento #cboDistro').html('');
    $('#frmDocumento #cboDistro').trigger('change');
    return true;
  }
    $('#frmDocumento #wrap_Distrito').waitMe({
        effect: 'facebook',
        bg: 'rgba(255,255,255,0.7)',
        color:'#146436',fontSize:'20px',textPos : 'vertical',
        onClose : function() {}
    });
    $.ajax({
        url     : _URL_NODE3+'/api/ubigeo/distrito/'+$('#frmDocumento #cboProv').val(),
        method  : "POST",
        data    : { 'IdReq' : 0 },
        dataType: "json",
        headers : {
            "api-token" : _TokenUser,
            "user-token" : _token_node
        }
    })
    .done(function(  json ) {
        switch(json.estado)
        {
            case 'ERROR':
                alert(json.error);
            break;
            case 'OK':
                // negocio...
                var $htmlOption = '<option value="" >Seleccione</option>';
                if( json.results != undefined ){
                    $.each( json.results , function( key, value ) {
                        //$htmlOption += `<option value="${value.id}" >${value.name}</option>`;
                    });
                    $('#frmDocumento #cboDistro').html($htmlOption);
                    $('#frmDocumento #cboDistro').trigger('change');
                }
            break;
        }
    })
    .fail(function(xhr, status, error) {
        if( xhr.status == 422 )
        {
            // 422 es decir un error de validacion de datos...
            var $errores = xhr.responseJSON, $texto = '', $arError = [];
            $.each( $errores.errores , function( key, value ) {
                $arError.push( value.msg );
            });
            $texto = $arError.join(', ');
            Swal.fire({
                icon: 'error',
                title: 'Revise lo siguiente...',
                text: `${$texto}`
            });
        }else{
            alert('Error al ejecutar');
        }
        $('#frmDocumento #wrap_Distrito').waitMe('hide');
    })
    .always(function() {
        $('#frmDocumento #wrap_Distrito').waitMe('hide');
    });
}
/* ------------------------------------------------------------- */
function getLocales( IdClienteProv )
{
	$('#wrapperTable').waitMe({
		effect: 'facebook',
		text: 'Guardando...',
		bg: 'rgba(255,255,255,0.7)',
		color:'#146436'
	});
	$.ajax({
		url     : `${_URL_NODE3}/api/locales/${IdClienteProv}`,
		method  : "GET",
		dataType: "json",
		headers : {
		    "api-token" : _TokenUser,
			"user-token" : _token_node
		}
	})
	.done(function(  json ) {
		switch(json.estado)
		{
			case 'ERROR':
				alert(json.error);
			break;
			case 'OK':
				if( json.data != undefined ){
					var _html = '<option value="" >Todos</option>';
					$.each( json.data , function( key, value ) {
						_html += '<option value="'+value.IdSucursal+'" >'+value.IdSucursal+'-'+value.Descripcion+'</option>'; 
						});
					$('#cboLocal').html( _html );
				}
			break;
		}
	})
	.fail(function(xhr, status, error) {
		if( xhr.status == 422 )
		{
			// 422 es decir un error de validacion de datos...
			var $errores = xhr.responseJSON, $texto = '', $arError = [];
			$.each( $errores.errores , function( key, value ) {
				$arError.push( value.msg );
			});
			$texto = $arError.join(', ');
			Swal.fire({
				icon: 'error',
				title: 'Revise lo siguiente...',
				text: `${$texto}`
			});
		}else{
			alert('Error al ejecutar');
		}
		$('#wrapperTable').waitMe('hide');
	})
	.always(function() {
		$('#wrapperTable').waitMe('hide');
	});
}
/*
function getDepartamento()
{
	//
	$('body').waitMe({
		effect: 'facebook',
		text: 'Cargando...',
		bg: 'rgba(255,255,255,0.7)',
		color:'#146436',fontSize:'20px',textPos : 'vertical',
		onClose : function() {}
	});
	$.ajax({
		url     : `${_URL_NODE3}/api/ubigeo/departamento`,
		method  : "POST",
		data    : { 'IdReq' : 0 },
		dataType: "json",
		headers : {
		    "api-token"  : _TokenUser,
			"user-token" : _token_node
		}
	})
	.done(function(  json ) {
		if( json.estado == 'ERROR' )
		{
			var $error = json.errores;
			makeErrores( $error );
		}else{
			if( json.estado == 'OK' ){
				// Aprobar
				if( json.data != undefined ){
					var _html = `<option value="" >Seleccione</option>`;
					$.each( json.data , function( key, value ) {
						_html += '<option value="'+value.id+'" >'+value.name+'</option>'; 
					});
					$('#frmDocumento #Departamento').html( _html );
					$('#frmDocumento #Departamento').trigger('change');
				}
			}else{
				escuchaRespuesta( json );
			}
		}
	})
	.fail(function() {
	    FalloJS();
	})
	.always(function() {
	    $('body').waitMe('hide');
	});
}

function getProvincia( $idDep )
{
	//
	$('body').waitMe({
		effect: 'facebook',
		text: 'Cargando...',
		bg: 'rgba(255,255,255,0.7)',
		color:'#146436',fontSize:'20px',textPos : 'vertical',
		onClose : function() {}
	});
	$.ajax({
		url     : `${_URL_NODE3}/api/ubigeo/provincia/${$idDep}`,
		method  : "POST",
		dataType: "json",
		headers : {
		    "api-token"  : _TokenUser,
			"user-token" : _token_node
		}
	})
	.done(function(  json ) {
		if( json.estado == 'ERROR' )
		{
			var $error = json.errores;
			makeErrores( $error );
		}else{
			if( json.estado == 'OK' ){
				// Aprobar
				if( json.data != undefined ){
					var _html = `<option value="" >Seleccione</option>`;
					$.each( json.data , function( key, value ) {
						_html += '<option value="'+value.id+'" >'+value.name+'</option>'; 
					});
					$('#frmDocumento #Provincia').html( _html );
					$('#frmDocumento #Provincia').trigger('change');
					//
				}
			}else{
				escuchaRespuesta( json );
			}
		}
	})
	.fail(function() {
	    FalloJS();
	})
	.always(function() {
	    $('body').waitMe('hide');
	});
}

function getDistrito( $IdProv )
{
	//
	$('body').waitMe({
		effect: 'facebook',
		text: 'Cargando...',
		bg: 'rgba(255,255,255,0.7)',
		color:'#146436',fontSize:'20px',textPos : 'vertical',
		onClose : function() {}
	});
	$.ajax({
		url     : `${_URL_NODE3}/api/ubigeo/distrito/${$IdProv}`,
		method  : "POST",
		dataType: "json",
		headers : {
		    "api-token"  : _TokenUser,
			"user-token" : _token_node
		}
	})
	.done(function(  json ) {
		if( json.estado == 'ERROR' )
		{
			var $error = json.errores;
			makeErrores( $error );
		}else{
			if( json.estado == 'OK' ){
				// Aprobar
				if( json.data != undefined ){
					var _html = `<option value="" >Seleccione</option>`;
					$.each( json.data , function( key, value ) {
						_html += '<option value="'+value.id+'" >'+value.name+'</option>'; 
					});
					$('#frmDocumento #IdDistrito').html( _html );
					$('#frmDocumento #IdDistrito').trigger('change');
				}
			}else{
				escuchaRespuesta( json );
			}
		}
	})
	.fail(function() {
	    FalloJS();
	})
	.always(function() {
	    $('body').waitMe('hide');
	});
}
*/
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
var $eventCliente = $('#frmDocumento #IdCliente').select2({
	ajax: {
		url: _URL_NODE3+'/api/src/clientes2_select2/',
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
$eventCliente.on("select2:select", function (e) { 
	var Texto = e.params.data.text, IdClienteProv = e.params.data.id;
	$('#frmDocumento #Cliente').val(Texto);
	getLocales( IdClienteProv );
});
/* ------------------------------------------------------------- */
var $eventIdLocal= $('#frmDocumento #IdLocal').select2({
	width : '100%'
});
/* ------------------------------------------------------------- */
$eventIdLocal.on("select2:select", function (e) { 
	var Texto = e.params.data.text;
	$('#frmDocumento #Local').val(Texto);
});
/* ------------------------------------------------------------- */
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
				delDocumento( $uuid );
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
$.confirm({
	title   : 'Correcto',
	content : 'Se cambió el estado de las OS<br>Pulse <b>Y</b> para continuar',
	autoClose: 'Ok|30000',
	type    : 'blue',
	typeAnimated: true,
	buttons: {
		Ok: {
			text : 'OK (Y)',
			keys: ['Y'],
			action: function () {
				//
			}
		},
	}
});

$.dialog({
	title   : 'Correcto',
	content : 'Se quitó al personal de la lista.',
});

$.confirm({
	title   : 'Error',
	content : 'Para aprobar el documento primero debe guardarlo.............................',
	type    : 'red',
	buttons : {
		heyThere: {
		  text: 'OK (Y)', // text for button
		  btnClass: 'btn-blue', // class for the button
		  keys: ['enter', 'y'], // keyboard event for button
		  isHidden: false, // initially not hidden
		  isDisabled: false, // initially not disabled
		  action: function(heyThereButton){
			  // longhand method to define a button
			  // provides more features
		  }
		},
	}
});
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
