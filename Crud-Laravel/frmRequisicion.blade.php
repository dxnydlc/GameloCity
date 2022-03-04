

<form action="" id="frmDocumento" autocomplete="off" >

    <input type="hidden" id="id" name="id" value="" />
    <input type="hidden" id="uu_id" name="uu_id" value="" />
    <input type="hidden" id="Cliente" name="Cliente" value="" />
    <input type="hidden" id="Sucursal" name="Sucursal" value="" />
    <input type="hidden" id="Fecha" name="Fecha" value="" />
    <input type="hidden" id="Anio" name="Anio" value="" />
    <input type="hidden" id="IdCentro" name="IdCentro" value="" />
    <input type="hidden" id="Centro_costos" name="Centro_costos" value="" />
    <input type="hidden" id="CodContaCC" name="CodContaCC" value="" />
    
    <input type="hidden" id="DireccionPartida" name="DireccionPartida" value="" />
    
    <input type="hidden" id="Estado" name="Estado" value="" />
    <input type="hidden" id="TipoDocOrigen" name="TipoDocOrigen" value="" />
    
    <input type="hidden" id="NombreRecepciona" name="NombreRecepciona" value="" />
    
    <input type="hidden" id="IdUbigeo" name="IdUbigeo" value="" />
    <input type="hidden" id="Departamento" name="Departamento" value="" />
    <input type="hidden" id="Provincia" name="Provincia" value="" />
    <input type="hidden" id="Distrito" name="Distrito" value="" />
    
    <input type="hidden" id="Atendido" name="Atendido" value="" />
    <input type="hidden" id="Porcentaje" name="Porcentaje" value="" />
    
    
    
    
    
    
    

    

    <div class="row">
        <div class=" col-lg-1 col-md-1 " ></div>
        <!-- ./col -->
        <div class=" col-lg-10 col-md-10 " >
            <div class="box box-primary " >
                <div class="box-header with-border">
                    <i class="fa fa-text-width"></i>
                    <h3 class="box-title" id="mdlInTitulo" >_</h3>
                    <div class=" box-tools pull-right ">
                        <div class="btn btn-box-tool">
                            <a id="btnCerrarTop" href="#" class="cerrarFrame" ><i class="fa fa-times"></i> Cerrar</a>
                        </div>
                    </div>
                    <!-- /.box-tools -->
                </div>
                <!-- /.box-header -->
                <div class="box-body" >
                    <div class=" row " >
                        <div class=" col-lg-2 col-md-2 " >
                            <div class="form-group">
                                <label for="IdRequisicion" >Nro Requisición</label> 
                                <input type="text" name="IdRequisicion" id="IdRequisicion" readonly class=" form-control input-lg text-right " value="" />
                            </div>
                            <!-- ./form-group -->
                        </div>
                        <!-- ./col -->
                        <div class=" col-lg-3 col-md-3 " id="wrappeer_Estado" ></div>
                        <!-- ./col -->
                        <div class=" col-lg-3 col-md-3 " >
                            <div class="form-group">
                                <label for="TipoServicio"><i class="text-reqi fa " >*</i> Tipo De Servico</label>
                                <select  name="TipoServicio" id="TipoServicio" class=" form-control " >
                                    <option value="" >Seleccione</option>
                                  <option value="Contrato">Contrato</option>
                                  <option value="Servicio Adicional">Servicio Adicional</option>
                                  <option value="Material-mes">Materiales del mes</option>
                                </select>
                            </div>
                        </div>
                        <!-- ./col -->
                        <div class=" col-lg-2 col-md-2 " >
                            <div class="form-group">
                                <label for="UnidadNegocio"><i class="text-reqi fa " >*</i> Und. Negocio</label>
                                <select class="form-control" name="UnidadNegocio" id="UnidadNegocio">
                                    <option value="Limpieza">Limpieza</option>
                                    <option value="Saneamiento">Saneamiento</option>
                                    <option value="SSGG">SSGG</option>
                                </select>
                            </div>
                        </div>
                        <!-- ./col -->
                        <div class=" col-lg-2 col-md-2 " >
                            <label for="#">_</label>
                            <a href="#" id="btnAddDocumento" class=" btn btn-default btn-block float-right " rel="tooltip" title="Agregar Documento" data-toggle="modal" data-target="#formImportDocumento" >
		                        <i class="icofont-clip"></i> Adjuntar
		                    </a>
                        </div>
                        <!-- ./col -->
                    </div>
                    <!-- ./row -->
                    <div class=" row " >
                        <div class=" col-lg-5 col-md-5 " >
                            <div class=" form-group ">
                                <label for="IdClienteProv" ><i class="text-reqi fa " >*</i> Cliente</label>
                                <select name="IdClienteProv" id="IdClienteProv" class="form-control" ></select>
                            </div>
                            <!-- ./form-group -->
                            <div class=" form-group ">
                                <label for="IdSucursal" ><i class="text-reqi fa " >*</i> Sucursal</label>
                                <select name="IdSucursal" id="IdSucursal" class="form-control" ></select>
                            </div>
                            <!-- ./form-group -->
                            <div class="form-group">
                                <label for="DireccionDestino">Dirección</label> 
                                <input type="text" name="DireccionDestino" readonly id="DireccionDestino" class="form-control" value="" maxlength="150" />
                            </div>
                            <!-- ./form-group -->
                        </div>
                        <!-- ./col -->
                        <div class=" col-lg-7 col-md-7 " >
                            <div class=" row " >
                                <div class=" col-lg-6 col-md-6 " >
                                    <div class="form-group">
                                        <label for="TipProducto"><i class="text-reqi fa " >*</i> Tipo de Material</label>
                                        <select id="TipProducto" name="TipProducto" class=" form-control" >
                                            <option value="MATERIALES">MATERIALES</option>
                                            <option value="IMPLEMENTOS">IMPLEMENTOS</option>
                                            <option value="INDUMENTARIA/EPPS">INDUMENTARIA/EPPS</option>
                                            <option value="MAQUINARIAS Y EQUIPOS">MAQUINARIAS Y EQUIPOS</option>
                                            <option value="INSUMOS Y OTROS">INSUMOS Y OTROS</option>
                                            <option value="LINEA INSTITUCIONAL">LINEA INSTITUCIONAL</option>
                                        </select>
                                    </div>
                                    <!-- /.form-group -->
                                    <div class="form-group">
                                        <label for="FechaEntrega" ><i class="text-reqi fa " >*</i> Entrega</label> 
                                        <input type="date" name="FechaEntrega" id="FechaEntrega" class="form-control" value="{{ FECHA_MYSQL }}">
                                    </div>
                                    <!-- ./form-group -->
                                    <div class=" form-group ">
                                        <label for="Recepciona" >Personal recepciona</label>
                                        <select name="Recepciona" id="Recepciona" class="form-control" ></select>
                                    </div>
                                    <!-- ./form-group -->
                                </div>
                                <!-- ./col -->
                                <div class=" col-lg-6 col-md-6 " >
                                    <div class="form-group">
                                        <label for="NroDocOrigen">Doc-Origen</label> 
                                        <input type="text" name="NroDocOrigen" id="NroDocOrigen" readonly class="form-control" value="" maxlength="150" />
                                    </div>
                                    <!-- ./form-group -->
                                    <div class="form-group">
                                        <label for="MesCorrsp"><i class="text-reqi fa " >*</i> Corresponde al Mes</label>
                                        <select name="MesCorrsp" id="MesCorrsp" class="form-control" >
                                            <option value="Enero">Enero</option>
                                            <option value="Febrero">Febrero</option>
                                            <option value="Marzo">Marzo</option>
                                            <option value="Abril">Abril</option>
                                            <option value="Mayo">Mayo</option>
                                            <option value="Junio">Junio</option>
                                            <option value="Julio">Julio</option>
                                            <option value="Agosto">Agosto</option>
                                            <option value="Setiembre">Setiembre</option>
                                            <option value="Octubre">Octubre</option>
                                            <option value="Noviembre">Noviembre</option>
                                            <option value="Diciembre">Diciembre</option>
                                        </select>
                                    </div>
                                    <!-- /.form-group -->
                                    <div class="form-group">
                                        <label for="Glosa"> Descripción del servicio</label>
                                        <textarea id="Glosa" name="Glosa" class="form-control" ></textarea>
                                    </div>
                                    <!-- /.form-group -->
                                </div>
                                <!-- ./col -->
                            </div>
                            <!-- ./row -->
                        </div>
                        <!-- ./col -->
                    </div>
                    <!-- ./row -->
                </div>
                <!-- /.box-body -->
            </div>
        </div>
        <!-- ./col -->
        <div class=" col-lg-1 col-md-1 " ></div>
        <!-- ./col -->
    </div>
    <!-- ./row -->

    <div class="row">
        <div class=" col-lg-1 col-md-1 " ></div>
        <!-- ./col -->
        <div class=" col-lg-10 col-md-10 " >
            <div class=" row " >
                <div class=" col-lg-12 col-md-12 " >
                    <div class=" box box-primary " >
                        <div class="box-body" >
                            <div class="progress">
                                <div id="TE_MiProgreso" class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>
                            </div>
                            <div class=" row " >
                                <div class="col-lg-3 col-md-3">
                                    <div class="input-group">
                                        <span class="input-group-addon">Monto max.</span>
                                        <input type="text" class=" pull-right text-right input-sm form-control " readonly="" id="MontoMax" name="MontoMax" readonly />
                                    </div>
                                    <!-- ./form-group -->
                                </div>
                                <div class=" col-lg-6 col-md-6 " ></div><!-- ./col -->
                                <div class=" col-lg-3 col-md-3 " >
                                    <a href="#" class=" btn btn-primary btn-block " id="btnOpenItems" >Agregar items a la lista</a>
                                </div><!-- ./col -->
                            </div>
                            <!-- ./row -->
                            <hr>
                            <table class=" table table-striped table-no-bordered table-hover " id="tblDetalle"  >
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Código</th>
                                        <th style="width:40%" >Articulo</th>
                                        <th>U.Medida</th>
                                        <th>Tipo</th>
                                        <th>Glosa</th>
                                        <th>Cant.</th>
                                        <th>Costo.Unit.</th>
                                        <th>Total</th>
                                        <th>Fec.</th>
                                        <th>_</th>
                                        <th>_</th>
            
                                    </tr>
                                </thead>
                                <tbody></tbody>
                            </table>
                        </div>
                        <div class="box-footer">
                            <div class="row">
                                <div class="col-lg-5 col-md-5 " >
                                    <div id="botonesDetalle" ></div>
                                </div>
                                <div class="col-lg-2 col-md-2 " >
                                    <div class="input-group">
                                        <span class="input-group-addon">Tipo cambio</span>
                                        <input type="text" class=" pull-right text-right input-sm form-control " readonly="" id="TipoCambio" name="TipoCambio" />
                                    </div>
                                </div>
                                <div class="col-lg-2 col-md-2 " >
                                    <div class="input-group">
                                        <span class="input-group-addon"># Items</span>
                                        <input type="text" class=" pull-right text-right input-sm form-control " readonly="" id="NroItemsDetalle" name="NroItemsDetalle" />
                                    </div>
                                </div>
                                <div class="col-lg-3 col-md-3 " >
                                    <div class="input-group">
                                        <span class="input-group-addon">Total S/.</span>
                                        <input type="text" class=" pull-right text-right input-sm form-control " readonly="" id="TotalDetalle" name="TotalDetalle" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- ./col -->
            </div>
            <!-- ./row -->
        </div>
        <!-- ./col -->
        <div class=" col-lg-1 col-md-1 " ></div>
        <!-- ./col -->
    </div>
    <!-- ./row -->

    <div class=" row " >
        <div class=" col-lg-1 col-md-1 " ></div>
        <!-- ./col -->
        <div class=" col-lg-10 col-md-10 " >
            <div class=" box box-primary " >
                <div class="box-body" >
                    <div class=" row " >
                        <div class=" col-lg-2 col-md-2 " >
                            <a href="#" class="btn btn-default btn-block cerrarFrame " ><i class="fa fa-sign-out"></i> Salir</a>
                        </div>
                        <!-- ./col -->
                        <div class=" col-lg-2 col-md-2 " ></div>
                        <!-- ./col -->
                        <div class=" col-lg-2 col-md-2 " ></div>
                        <!-- ./col -->
                        <div class=" col-lg-2 col-md-2 " >
                            <a href="#" class="btn btn-danger btn-block" id="btnAnularR" ><i class="fa fa-save"></i> Anular</a>
                        </div>
                        <!-- ./col -->
                        <div class=" col-lg-2 col-md-2 " >
                            <a href="#" class="btn btn-success btn-block" id="btnAprobarR" ><i class="fa fa-save"></i> Aprobar</a>
                        </div>
                        <!-- ./col -->
                        <div class=" col-lg-2 col-md-2 " >
                            <a href="#" class="btn btn-primary btn-block" id="btnGuardarR" ><i class="fa fa-save"></i> Guardar</a>
                        </div>
                        <!-- ./col -->
                    </div>
                    <!-- ./row -->
                </div>
            </div>
        </div>
        <!-- ./col -->
        <div class=" col-lg-1 col-md-1 " ></div>
        <!-- ./col -->
                
    </div>
    <!-- ./row -->

</form>

