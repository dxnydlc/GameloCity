


<div class="box box-primary " >
	<div class="box-header with-border">
		<i class="fa fa-text-width"></i>
		<h3 class="box-title">Nueva capacitación</h3>
		<div class=" box-tools pull-right ">
			<div class="btn btn-box-tool">
				<a id="btnCerrarTop" href="#" class=" cerrarFrame " ><i class="fa fa-times"></i> Cerrar</a>
			</div>
		</div>
		<!-- /.box-tools -->
	</div>
	<!-- /.box-header -->
	<div class="box-body">
		
        <!-- BODY -->
        <form id="frmDocumento" autocomplete="off" >
            
            <input type="hidden" id="id" name="id" value="" />
            <input type="hidden" id="uu_id" name="uu_id" value="" />
            

            <div class=" row " style="margin-bottom:15px;" >
                <div class=" col-lg-2 col-md-2 " >
                    
                </div>
                <!-- ./col -->
                <div class=" col-lg-4 col-md-4 " ></div>
                <!-- ./col -->
                <div class=" col-lg-3 col-md-3 " ></div>
                <!-- ./col -->
                <div class=" col-lg-3 col-md-3 " ></div>
                <!-- ./col -->
            </div>
            <!-- ./row -->

            <div class=" row " style="margin-bottom:15px;" >
                <div class=" col-lg-6 col-md-6 " >
                    <div class=" form-group ">
                        <label for="IdClienteProv">Cliente</label>
                        <select name="IdClienteProv" id="IdClienteProv" class="form-control" ></select>
                        <a href="#" id="QuitarSelect">Quitar Seleccion</a>
                    </div>
                    <!-- ./form-group -->
                </div>
                <!-- ./col -->
                <div class=" col-lg-6 col-md-6 " >
                    <div class=" form-group ">
                        <label for="IdSucursal">Sucursal</label>
                        <select name="IdSucursal" id="IdSucursal" class="form-control" ></select>
                    </div>
                    <!-- ./form-group -->
                </div>
                <!-- ./col -->
            </div>
            <!-- ./row -->

            <div class=" row " style="margin-bottom:15px;" >
                <div class=" col-lg-6 col-md-6 " >
                    <div class=" form-group ">
                        <label for="Supervisor" >Personal</label>
                        <select name="Supervisor" id="Supervisor" class="form-control" ></select>
                    </div>
                    <!-- ./form-group -->
                </div>
                <!-- ./col -->
                <div class=" col-lg-6 col-md-6 " >
                    <div class=" form-group ">
                        <label for="IdArticulo" >Articulo</label>
                        <select name="IdArticulo" id="IdArticulo" class="form-control" ></select>
                    </div>
                    <!-- ./form-group -->
                </div>
                <!-- ./col -->
            </div>
            <!-- ./row -->

            <div class=" row " style="margin-bottom:15px;" >
                <div class=" col-lg-3 col-md-3 " ></div>
                <!-- ./col -->
                <div class=" col-lg-3 col-md-3 " ></div>
                <!-- ./col -->
                <div class=" col-lg-3 col-md-3 " ></div>
                <!-- ./col -->
                <div class=" col-lg-3 col-md-3 " ></div>
                <!-- ./col -->
            </div>
            <!-- ./row -->

            <div class=" row " style="margin-bottom:15px;" >
                <div class=" col-lg-3 col-md-3 " ></div>
                <!-- ./col -->
                <div class=" col-lg-3 col-md-3 " ></div>
                <!-- ./col -->
                <div class=" col-lg-3 col-md-3 " ></div>
                <!-- ./col -->
                <div class=" col-lg-3 col-md-3 " ></div>
                <!-- ./col -->
            </div>
            <!-- ./row -->

        </form>

	</div>
	<!-- /.box-body -->
	<div class="box-footer">
		<div class=" row " >
			<div class=" col-lg-2 col-md-2 " >
				<a href="#" class="btn btn-default btn-block cerrarFrame " ><i class="fa fa-sign-out"></i> Salir</a>
				<hr>
			</div>
			<!-- ./col -->
			<div class=" col-lg-2 col-md-2 " >
				<a id="btnImprimirDoc" target="_blanck" href="#" class="btn btn-default btn-block                                                                                                                                                                                                                                                                                                                                                                                                                                                         " >
					<i class="fa fa-print "></i> imprimir
				</a>
				<hr>
			</div>
			<!-- ./col -->
			<div class=" col-lg-2 col-md-2 ">
                <button class="btn btn-warning btn-block" id="btnVerAuth" ><div class="fa fa-clock-o"></div> Auditoría</button>
				<hr>
			</div>
			<!-- ./col -->
			<div class=" col-lg-2 col-md-2 " >
                <button  class="btn btn-danger btn-block" id="btnAnularR" ><i class="fa fa-save"></i> Anula</button>
				<hr>
			</div>
			<!-- ./col -->
			<div class=" col-lg-2 col-md-2 " >
                <button  class="btn btn-success btn-block" id="btnAprobarR" ><i class="fa fa-save"></i> Aprobar</button>
				<hr>
			</div>
			<!-- ./col -->
			<div class=" col-lg-2 col-md-2 " >
                <button  class="btn btn-primary btn-block" id="btnGuardarR" ><i class="fa fa-save"></i> Guardar</button>
				<hr>
			</div>
			<!-- ./col -->
		</div>
		<!-- ./row -->
		<!-- FOOTER -->
	</div>
	<!-- /.box-footer -->
</div>
<!-- ./box -->