/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
let urlServicio = `${_URL_NESTMy}v1/mip-areas/`;
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
let _AuthFormulario = `MIP_TIPO_PLAGA`;
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
let CurTab = 0;
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
    },
    responsive: true
};
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
//
(function($){
	$(document).ready(function()
    {
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
        
                switch ( data.Estado ) {
                    case 'Activado':
                        $('td' ,row ).eq( 5 ).html(`<span class=" badge bg-success " >${data.Estado}</span>`);
                    break;
                    case 'Desactivado':
                        $('td' ,row ).eq( 5 ).html(`<span class=" badge bg-danger " >${data.Estado}</span>`);
                    break;
                }
        
                // Fecha Mod 5
                $('td' ,row ).eq( 6 ).html( moment( data.created_at ).format('DD/MM/YYYY HH:mm') );
                $('td' ,row ).eq( 7 ).html( moment( data.updated_at ).format('DD/MM/YYYY HH:mm') );
        
                
            },
            columns : [
                { "data" : null ,
                    render: (data,type,row) => {
                        let btn = `<button class=" editRow btn btn-link me-1 mb-1" type="button" data-uuid="${data.uu_id}" data-id="${data.id}" data-codigo="${data.Codigo}" data-nombre="${data.Descripcion}" ><i class=" far fa-edit " ></i></button>`;
                        return btn;
                    }
                },
                { "data" : null ,
                    render: (data,type,row) => {
                        let btn = `<button data-uuid="${data.uu_id}" data-id="${data.id}" data-codigo="${data.Codigo}" data-nombre="${data.Descripcion}" class=" remRow btn btn-link me-1 mb-1" type="button"><i class=" far fa-trash-alt text-danger " ></i></button>`;
                        return btn;
                    }
                },
                { "data" : "id" } , 
                { "data" : "Codigo" } , 
                { "data" : "Nombre" } , 
                { "data" : "Estado" } , 
                { "data" : "created_at" } , 
                { "data" : "updated_at" } , 
                { "data" : "UsuarioMod" } , 
            ],
        });
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        $("#btnHomeFiltro").on( "click", function(e) {
            e.preventDefault();
            $('#filtro-tab').tab('show');
        });
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        $("#btnNuevoDoc").on( "click", function(e) {
            e.preventDefault();
            parent.setTitulo(`Nueva area`);

            let arrLetras = [
                'A' , 'B' , 'C' , 'D' , 'E' , 'F' , 'G' , 'H' , 'I' , 'J' , 'K' , 'L' , 'M' , 'N' , 'O' , 'P' , 'Q' , 'R' , 'S' , 'T' , 'U' , 'V' , 'W' , 'X' , 'Y' , 'Z'
            ];

            let CSGO = 0;
            $('#tabHome').each(
                function() {
                    CSGO = ( $(this).find('.nav-item') ).length ;
                }
            );
            let LetraIndice = arrLetras[ CSGO ];
            let texto = `# Area`;
            $('#tabHome').append(`
            <li id="li-home-tab_${LetraIndice}" class="nav-item" role="presentation" >
                <button class="nav-link " id="home-tab_${LetraIndice}" data-bs-toggle="tab" data-bs-target="#home-tab-pane_${LetraIndice}" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">${texto}</button>
            </li>
            `);

            $('#tabContenido').append(`
                <div class="tab-pane fade " id="home-tab-pane_${LetraIndice}" role="tabpanel" aria-labelledby="home-tab" tabindex="0">
                    <div class="ratio ratio-16x9" >
                        <iframe id="wrapperForm_${LetraIndice}" src="${_URL_HOME}crud_area/0/${LetraIndice}" title="YouTube video" allowfullscreen></iframe>
                    </div>
                </div>
            `);

            CurTab = CSGO;
            console.log(`-->home-tab-pane_${LetraIndice}`);

            varDump(`->home-tab-pane_${LetraIndice}`);
            setTimeout(function(){ $('#home-tab_'+LetraIndice).tab('show'); }, 500 );
            

        });
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        socket.on('transmitir_data', function( rs ){
            //{ data : {} , indice : X }
            varDump(`Leer respuesta de iframe`);
            varDump( rs.data );
            setNombreTab( rs.data.indice , `${rs.data.data.Codigo}`  );
            let form = rs.data.form;

            if( form == _AuthFormulario ){
                getTodos();
            }
        });
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        $(document).delegate('.editRow', 'click', function(event) {
            event.preventDefault();
            let id = $(this).data('id'), Codigo = $(this).data('codigo');

            parent.setTitulo(`Nueva area`);

            let CSGO = 0;
            $('.form_'+id).each(
                function() {
                    CSGO = ( $(this).find('.nav-item') ).length - 1;
                }
            );

            let texto = `${Codigo}`;
            varDump(`HAY [form_${id}] ${$('.form_'+id).length}`);

            if( $('.form_'+id).length ){
                // Colocamos en el tab ya existente
                setTimeout(function(){ $('#home-tab_'+id).tab('show'); }, 500 );
                //
            }else{
                // Creamos el tab
                $('#tabHome').append(`
                    <li id="li-home-tab_${id}" class=" form_${id} nav-item" role="presentation" >
                        <button class="nav-link " id="home-tab_${id}" data-bs-toggle="tab" data-bs-target="#home-tab-pane_${id}" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">${texto}</button>
                    </li>
                `);

                $('#tabContenido').append(`
                    <div class="tab-pane fade " id="home-tab-pane_${id}" role="tabpanel" aria-labelledby="home-tab" tabindex="0">
                        <div class=" todoAlto ratio ratio-16x9" >
                            <iframe id="wrapperForm_${id}" src="${_URL_HOME}crud_area/${id}/${id}" title="YouTube video" allowfullscreen ></iframe>
                        </div>
                    </div>
                `);
                CurTab = CSGO;
                console.log(`-->home-tab-pane_${id}`);

                varDump(`->home-tab-pane_${id}`);
                setTimeout(function(){ $('#home-tab_'+id).tab('show'); }, 500 );
                //
            }
            var target = $('#TopPaginaOrq3');
            $('html, body').animate({
                scrollTop: target.offset().top
            }, 1000); // Adjust the duration (in milliseconds) as needed
        });
        /* ------------------------------------------------------------- */
        /* ------------------------------------------------------------- */
        $(document).delegate('.remRow', 'click', function(event) {
            event.preventDefault();
            let id = $(this).data('id'), uuid = $(this).data('uuid'), nombre = $(this).data('nombre');
            $.confirm({
                title   : 'Confirmar',
                type    : 'orange',
                content : 'Confirme anular '+nombre,
                autoClose: 'Cancelar|10000',
                buttons: {
                    Confirmar: {
                        keys: [ 'enter','Y' ],
                        text : 'Confirmar (Y)',
                        btnClass: 'btn-blue',
                        action : function () {
                            AnularDoc( id );
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
        /* ------------------------------------------------------------- *
        $('a[href^="#"]').on('click', function(event) {
            var target = $(this.getAttribute('href'));
            if (target.length) {
              event.preventDefault();
              $('html, body').animate({
                scrollTop: target.offset().top
              }, 1000); // Adjust the duration (in milliseconds) as needed
            }
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
    });

})(jQuery);
/* ------------------------------------------------------------- */
function initOrq(){
    //
    getTodos();
    parent.setSubTituloPagina( 'Area' );
    //
}
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
function getTodos()
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
        var url = `${urlServicio}get-todos`, metodo = `GET`;
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


                    // ******* NODE JS *******
                    socket.emit('accion:audit',{
                        user  : $nomU,
                        msg   : `Listar Areas` ,
                        dni   : $dniU,
                        serie : 0,
                        corr  : 0,
                        form  : _AuthFormulario,
                        url   : window.location.href,
                        token : ''
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
function AnularDoc( Id )
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
        var url = `${urlServicio}anular-by-id/${Id}`, metodo = `DELETE`;
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
                    tostada( 'Correcto' , 'Registro anulado' , 'success' );
                    getTodos();

                    // ******* NODE JS *******
                    socket.emit('accion:audit',{
                        user  : $nomU,
                        msg   : `Anular Area #${data.id} -> ${data.Codigo}` ,
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
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
function setNombreTab( Index , Texto )
{
    varDump(`home-tab_${Index}`);
    $('#home-tab_'+Index).html( `${Texto}` ); 
}
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
function cerrartab( Indice )
{
    //
    $.confirm({
        title: 'Confirmar',
        type    : 'orange',
        content: 'Confirme cerrar formulario',
        autoClose: 'Cancelar|10000',
        buttons: {
            Confirmar: {
                keys: [ 'enter','Y' ],
                text : 'Confirmar (Y)',
                btnClass: 'btn-blue',
                action : function () {
                    //$('#home-tab_'+Indice).remove();
                    //$('#home-tab-pane_'+Indice).remove();
                    $('#home-tab').tab('show');
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
    
    //
}
/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */