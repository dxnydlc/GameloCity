


/**/
function call_ajax()
{
	//
	try {
		$('#wrapperTable').waitMe({
			effect  : 'facebook',
			text    : 'Espere...',
			bg      : 'rgba(255,255,255,0.7)',
			color   : '#146436',fontSize:'20px',textPos : 'vertical',
			onClose : function() {}
		});
		var _dataSerie = $('#frmDocumento').serialize();
		$.ajax({
			url     : `${_URL_REST}api/user/data/`,
			method  : "POST",
			data    : _dataSerie ,
			dataType: "json",
			xhrFields: { withCredentials: true }
		})
		.done(function(  json ) {
			/**/
			switch (json.codigo) {
                case 200:
                    // negocio...
                    tostada( json.resp.titulo , json.resp.texto , json.resp.clase );
                    $('#frmDocumento #id').val( json.item.id );
                    $('#frmDocumento #Codigo').val( json.item.Codigo );
                break;
                default:
                break;
            }
			/**/
		})
		.fail(function(xhr, status, error) {
			get_Error( xhr );
			$('#wrapperTable').waitMe('hide');
		})
		.always(function() {
			$('#wrapperTable').waitMe('hide');
		});
	} catch (error) {
		alert( error );
		$('#wrapperTable').waitMe('hide');
	}
	//
}
/**/



// =======================================================
// =======================================================
// =======================================================
// =======================================================
// =======================================================
// =======================================================
// =======================================================
// =======================================================
// =======================================================
// =======================================================
// =======================================================
// =======================================================
// =======================================================
// =======================================================
// =======================================================
// =======================================================
// =======================================================
// =======================================================
// =======================================================
// =======================================================
// =======================================================
// =======================================================
// =======================================================
// =======================================================
// =======================================================
// =======================================================
// =======================================================
// =======================================================
// =======================================================
// =======================================================
// =======================================================
// =======================================================
// =======================================================
// =======================================================
// =======================================================
// =======================================================
// =======================================================
// =======================================================
// =======================================================
// =======================================================
// =======================================================
// =======================================================
// =======================================================
// =======================================================
// =======================================================
// =======================================================
function capturaError( xhr )
{
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
}
// =======================================================
function msgBox( _titulo , _mensaje )
{
    $.confirm({
        title   : _titulo,
        content : _mensaje,
        type    : 'red',
        buttons : {
          heyThere: {
            text: 'Correcto (Y)', // text for button
            btnClass: 'btn-blue', // class for the button
            keys: ['y', 'Y'], // keyboard event for button
            isHidden: false, // initially not hidden
            isDisabled: false, // initially not disabled
            action: function(heyThereButton){
            }
        },
        }
    });
}
// =======================================================
function msgBox2( _titulo , _mensaje , clase )
{
    $.confirm({
        title   : _titulo,
        content : _mensaje,
        autoClose: 'Ok|30000',
        type    : clase,
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
}
// =======================================================
function varDump( _texto )
{
    console.log( _texto );
}
// =======================================================
function tostada( _titulo , _mensaje , _icono )
{
    // Se oculta a los 10 segundos 
    // success, warning, error, info
    $.toast({
        heading : _titulo,
        text    : _mensaje ,
        icon    : _icono,
        hideAfter   : 30000,
        showHideTransition:  'slide',
        position: 'bottom-center',
    });
}
// =======================================================
function tostada2( _dataJson )
{
    // Se oculta a los 10 segundos 
    // success, warning, error, info
    $.toast({
        heading : _dataJson.titulo,
        text    : _dataJson.texto ,
        icon    : _dataJson.clase,
        hideAfter   : 10000,
        showHideTransition:  'slide',
        position: 'bottom-center',
    });
}
// =======================================================
function get_Error( xhr )
{
  //
  varDump(xhr);
  switch ( xhr.status ) {
    case 422:
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
    break;
    case 500:
      tostada2( xhr.responseJSON.msg );
    case 403:
        varDump( xhr.responseJSON.msg );
        tostada2( xhr.responseJSON.msg );
        setTimeout(function () {
            location.href = `${_URL_APP}login`;
	    }, 5000);
    break;
    default:
      tostada( 'Error' , xhr.responseText , 'red' );
    break;
  }
  //
}
// =======================================================
// =======================================================
// =======================================================
// =======================================================
// =======================================================
// =======================================================
// =======================================================
// =======================================================
// =======================================================
// =======================================================
// =======================================================
// =======================================================
// =======================================================
// =======================================================
// =======================================================