


<!-- Modal -->
<div class=" modal fade " id="mdlArchivos56" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static" data-keyboard="false" >
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				<h4 class="modal-title" id="myModalLabel" >Cargar archivos.</h4>
			</div>
			<div class="modal-body">

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






<!-- Modal VER ARCHIVOS -->
<div class="modal fade" id="mdlVerArchivos" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static" data-keyboard="false" >
	<div class="modal-dialog modal-lg" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				<h4 class="modal-title" id="myModalLabel">visualizar archivo</h4>
			</div>
			<div class="modal-body">
				<div id="wrapperArchivos" >
					<div id="pdf-viewer"></div>
				</div>
				<div id="tableDetalle" >
					<table class=" table table-hover cell-border compact hover nowrap row-border table-striped table-hover " id="tblDetalle" cellspacing="0" width="100%" style="width:100%"></table>
				</div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button>
			</div>
		</div>
	</div>
</div>

