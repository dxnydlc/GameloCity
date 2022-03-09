


<!-- Modal -->
<div class=" modal fade " id="mdlArchivos56" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static" data-keyboard="false" >
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				<h4 class="modal-title" id="myModalLabel" >Cargar archivos.</h4>
			</div>
			<div class="modal-body">
                <a href="{{ asset('assets/formatos/xls_Incidencias_LAP.xlsx') }}" id="dowd-formato" class=" btn btn-primary btn-xs ">Decargar formato.</a>
                <small class="text-muted">Por favor respetar los encabezados del formato.</small>
				<hr/>
                <div class="file-loading">
                    <input id="formData" name="formData" type="file" multiple data-browse-on-zone-click="true" data-show-preview="true" >
                </div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button>
			</div>
		</div>
	</div>
</div>



