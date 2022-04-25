


<form action="" id="frmDocumento" autocomplete="off" >

    <input type="hidden" id="id" name="id" value="" />
    <input type="hidden" id="uu_id" name="uu_id" value="" />

    <input type="hidden" id="Cliente" name="Cliente" value="" />
    <input type="hidden" id="Local" name="Local" value="" />
    

    <div class="row">
        <div class=" col-lg-1 col-md-1 " ></div>
        <!-- ./col -->
        <div class=" col-lg-10 col-md-10 " >
            <div class="box box-primary " >
                <div class="box-header with-border">
                    <i class="fa fa-text-width"></i>
                    <h3 class="box-title" id="lblTitulo" >_</h3>
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
                                <label for="Codigo" >Codigo</label> 
                                <input type="text" name="Codigo" id="Codigo" readonly class=" form-control input-lg text-right " value="" />
                            </div>
                            <!-- ./form-group -->
                        </div>
                        <!-- ./col -->
                        <div class=" col-lg-3 col-md-3 " ></div>
                        <!-- ./col -->
                        <div class=" col-lg-3 col-md-3 " >
                        </div>
                        <!-- ./col -->
                        <div class=" col-lg-2 col-md-2 " >
                        </div>
                        <!-- ./col -->
                        <div class=" col-lg-2 col-md-2 " id="wrappeer_Estado" >
                        </div>
                        <!-- ./col -->
                    </div>
                    <!-- ./row -->
                    <div class=" row " >
                        <div class=" col-lg-5 col-md-5 " >
                            <div class=" form-group ">
                                <label for="IdCliente" ><i class="text-reqi fa " >*</i> Cliente</label>
                                <select name="IdCliente" id="IdCliente" class="form-control" ></select>
                            </div>
                            <!-- ./form-group -->
                        </div>
                        <!-- ./col -->
                        <div class=" col-lg-4 col-md-4 " >
                            <div class=" form-group ">
                                <label for="IdLocal" ><i class="text-reqi fa " >*</i> Sucursal</label>
                                <select name="IdLocal" id="IdLocal" class="form-control" ></select>
                            </div>
                            <!-- ./form-group -->
                        </div>
                        <!-- ./col -->
                        <div class=" col-lg-3 col-md-3 " >
                            <div class="form-group">
                                <label for="">Fecha</label>
                                <input type="date" name="Fecha" id="Fecha" class=" form-control " value="<?php echo date("Y-m-d");?>" />
                            </div>
                            <!-- ./form-group -->
                        </div>
                        <!-- ./col -->
                    </div>
                    <!-- ./row -->
                </div>
                <!-- /.box-body -->
                <div class="box-footer">
                    <a id="btnOpenModalFiles" href="#" class="btn btn-primary ">Cargar archivo.</a>
                    <hr>
                    <div id="wrapper_thumbs_files"></div>
                </div>
            </div>
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
                            <hr/>
                        </div>
                        <!-- ./col -->
                        <div class=" col-lg-2 col-md-2 " ></div>
                        <!-- ./col -->
                        <div class=" col-lg-2 col-md-2 " ></div>
                        <!-- ./col -->
                        <div class=" col-lg-2 col-md-2 " >
                            <a href="#" class="btn btn-danger btn-block" id="btnAnularR" ><i class="fa fa-save"></i> Anular</a>
                            <hr/>
                        </div>
                        <!-- ./col -->
                        <div class=" col-lg-2 col-md-2 " >
                            <!--<a href="#" class="btn btn-success btn-block" id="btnAprobarR" ><i class="fa fa-save"></i> Aprobar</a>
                            <hr/>-->
                        </div>
                        <!-- ./col -->
                        <div class=" col-lg-2 col-md-2 " >
                            <a href="#" class="btn btn-primary btn-block" id="btnGuardarR" ><i class="fa fa-save"></i> Guardar</a>
                            <hr/>
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
