
<!-- Modal -->
<div class="modal fade" id="mdlSRC" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static" data-keyboard="false" >
    <div class="modal-dialog modal-lg " role="document" >
        <div class="modal-content">
            <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title" id="myModalLabel">Filtro</h4>
            </div>
        <div class="modal-body">
            <div class="row" >
                <div class=" col-lg-2 col-md-2 " >
                    <div class=" form-group ">
                        <label for="Cliente">Nro. Requisición</label>
                        <textarea id="txtIdReq" class=" form-control " ></textarea>
                    </div>
                    <!-- ./form-group -->
                </div>
                <!-- ./col -->
                <div class=" col-lg-3 col-md-3 " >
                    <div class=" form-group ">
                        <label for="Cliente">Cliente</label>
                        <select id="cboCliente" class="form-control" ></select>
                        <a href="#" id="QuitarSelect" >Quitar Seleccion</a>
                    </div>
                    <!-- ./form-group -->
                </div>
                <!-- ./col -->
                <div class=" col-lg-3 col-md-3 " >
                    <div class=" form-group ">
                        <label for="cboSucursal">Sucursal</label>
                        <select id="cboSucursal" class="form-control" ></select>
                    </div>
                    <!-- ./form-group -->
                </div>
                <!-- ./col -->
                <div class=" col-lg-2 col-md-2 " >
                    <div class="form-group">
                        <label for="InicioC">F.Req</label> 
                        <input type="date" name="InicioC" id="InicioC" class="form-control" value="{{ FECHA_MYSQL }}">
                    </div>
                    <!-- ./form-group -->
                </div>
                <!-- ./col -->
                <div class=" col-lg-2 col-md-2 " >
                    <div class="form-group">
                        <label for="FinC">F.Req</label> 
                        <input type="date" name="FinC" id="FinC" class="form-control" value="{{ FECHA_MYSQL }}">
                    </div>
                    <!-- ./form-group -->
                </div>
                <!-- ./col -->
            </div>
            <!-- ./row -->
            <div class=" row " >
                <div class=" col-lg-2 col-md-2 " ></div>
                <!-- ./col -->
                <div class=" col-lg-3 col-md-3 " >
                    <div class=" form-group ">
                        <label for="srcArticulo" >Articulo</label>
                        <select id="srcArticulo" class="form-control" ></select>
                    </div>
                    <!-- ./form-group -->
                </div>
                <!-- ./col -->
                <div class=" col-lg-2 col-md-2 " >
                    <div class=" form-group ">
                        <label for="SRC_Estado">Estado</label>
                        <select id="SRC_Estado"  class="form-control">
                            <option value="">Seleccione</option>
                            <option value="Digitado">Digitado</option>
                            <option value="Aprobado">Aprobado</option>
                            <option value="Anulado">Anulado</option>
                        </select>
                    </div>
                    <!-- ./form-group -->
                </div>
                <!-- ./col -->
                <div class=" col-lg-2 col-md-2 " >
                    <div class="form-group">
                        <label for="UnidadNegocio">Und. Negocio</label>
                        <select class="form-control" id="SRC_UnidadNegocio" >
                            <option value="">Seleccione</option>
                            <option value="Limpieza">Limpieza</option>
                            <option value="Saneamiento">Saneamiento</option>
                            <option value="SSGG">SSGG</option>
                        </select>
                    </div>
                </div>
                <!-- ./col -->
                <div class=" col-lg-3 col-md-3 " >
                    <div class="form-group">
                        <label for="SRC_Glosa" >Glosa</label> 
                        <input type="text" id="SRC_Glosa" class="form-control" value="" maxlength="150" />
                    </div>
                    <!-- ./form-group -->
                </div>
                <!-- ./col -->
            </div>
            <!-- ./row -->
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button>
            <button type="button" class="btn btn-primary" id="btnBuscar" >Buscar</button>
        </div>
        </div>
    </div>
</div>



<!-- MODAL IMPORTAR -->
<div id="formImportDocumento" class="modal fade " role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false"  >
	<div class="modal-dialog modal-sm">
		<div class="modal-content" id="ModalImportDocumento">
			<div class="modal-header">
				<h5 class="modal-title text-center">Importar Requisición.</h5>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
			</div>
			<div class="modal-body">
				<form action="" id="formImportDoc" autocomplete="off" >
					<div class="row">
						<div class="col-md-12">
							<label for="Productos" class="col-form-label">Ingrese Correlativo:</label>
							<input type="number" name="correlativo" id="correlativo" class="form-control" />
						</div>
						<div class="col-md-12" style="margin-top:25px;">
                            <a href="#" id="btncerrarModal" class="btn btn-primary  pull-left "   >
                                <i class="icofont-close"></i>Cerrar
                            </a>
                            <a href="#" id="btnImportarDocumento" class="btn btn-success  pull-right">
                                <i class="icofont-download"></i> Importar
                            </a>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>

<!-- MDL PRoductos -->
<div class="modal fade" id="mdlArticulos" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static" data-keyboard="false" >
    <div class="modal-dialog modal-lg " role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="myModalLabel">Modal title</h4>
            </div>
            <div class="modal-body">
                <form action="#" id="frmDetalle" autocomplete="off" >
                    <input type="hidden" name="id" id="id" value="0" />
                    <input type="hidden" name="uu_id" id="uu_id" value="0" />
                    <input type="hidden" name="IdRequisicion" id="IdRequisicion" />
                    <input type="hidden" name="Articulo" id="Articulo" />
                    <input type="hidden" name="TipoProducto" id="TipoProducto" />

                    <input type="hidden" name="Total" id="Total" />
                    <input type="hidden" name="token" id="token" />
                    <div class="row">
                        <div class="  col-lg-5 col-md-5 col-sm-5 ">
                            <div class=" form-group ">
                                <label>Producto:</label>
                                <select id="IdArticulo" name="IdArticulo" ></select>
                                <span class="text-danger" id="lblArticulo" ></span>
                                <!--<p class="help-block">Ejemplo <strong>Escoba<code>%</code>roj</strong>, <strong>pad<code>%</code>17.5</strong></p>-->
                            </div>
                            <!-- ./form-group -->
                            <div class=" form-group ">
                                <label for="">Glosa</label>
                                <input type="text" name="Glosa" id="Glosa" class=" form-control deaGlosa" maxlength="100" />
                            </div>
                            <!-- ./form-group -->
                        </div>
                        <!-- ./col -->
                        <div class=" col-lg-2 col-md-2 col-sm-3">
                            <label for="">Unidad medida</label>
                            <input type="text" name="UnidadMedida" id="UnidadMedida" class="form-control" readonly />
                        </div>
                        <!-- ./col -->
                        <div class=" col-lg-2 col-md-2 ">
                            <div class="form-group">
                                <label for="CostoUnit" >Precio</label> 
                                <input type="number" name="CostoUnit" id="CostoUnit" class="form-control text-right" value="" />
                            </div>
                            <!-- ./form-group -->
                            <a href="#" class=" btn btn-default btn-block " id="btnNuevoProdi" ><i class="icofont-file-document"></i> Nuevo</a>
                        </div>
                        <!-- ./col -->
                        <div class=" col-lg-2 col-md-2 col-sm-3 ">
                            <div class=" form-group ">
                                <label for="">Cantidad</label>
                            <input type="number" step="0.1" name="Cantidad" id="Cantidad" class=" form-control text-right " maxlength="8" />
                            </div>
                            <!-- ./form-group -->
                            <a href="#" class=" btn btn-primary btn-block " id="btnAddProdi" ><i class="icofont-ui-add"></i> Agregar</a>
                        </div>
                        <!-- ./col -->
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>


<!-- Modal -->
<div class="modal fade" id="mdlGuardando" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static" data-keyboard="false" >
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="myModalLabel">Guardado y transmitiendo...</h4>
            </div>
            <div class="modal-body">
                <img src="{{ asset('/assets/img/loading.gif') }}" alt="" class="img-responsive center-block " />
                <div id="lblEventos"></div>
            </div>
        </div>
    </div>
</div>

