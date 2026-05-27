


<div class=" card " >

	<!-- /.box-header -->
	<div class="card-body">

        <h5 class="card-title">Card title</h5>
		
        <!-- BODY -->
        <form id="frmDocumento" autocomplete="off" >


            <input type="hidden" id="uu_id" name="uu_id" value="" />


            <div class=" row " >
                <div class=" col-lg-2 col-md-2 mb-3  " >
                    <div class="form-group">
                        <label for="Codigo" >Código</label> 
                        <input type="text" name="Codigo" id="Codigo" class="form-control" value="" maxlength="150" />
                    </div>
                    <!-- ./form-group -->
                </div>
                <!-- ./col -->
                <div class=" col-lg-3 col-md-3 " ></div>
                <!-- ./col -->
                <div class=" col-lg-3 col-md-3 " ></div>
                <!-- ./col -->
                <div class=" col-lg-2 col-md-2 " >
                    <div class="form-group">
                        <label for="id" >#</label> 
                        <input readonly type="number" name="id" id="id" class="form-control text-right" value="" />
                    </div>
                    <!-- ./form-group -->
                </div>
                <!-- ./col -->
            </div>
            <!-- ./row -->

            <div class=" row " >
                <div class=" col-lg-6 col-md-6 " >
                    <div class="form-group mb-3 " >
                        <label for="Nombre" >Descripción</label> 
                        <input type="text" name="Nombre" id="Nombre" class="form-control" value="" maxlength="150" />
                    </div>
                    <!-- ./form-group -->
                </div>
                <!-- ./col -->
                <div class=" col-lg-3 col-md-3 " ></div>
                <!-- ./col -->
                <div class=" col-lg-3 col-md-3 " ></div>
                <!-- ./col -->
                <div class=" col-lg-3 col-md-3 " ></div>
                <!-- ./col -->
            </div>
            <!-- ./row -->

            <div class=" row " >
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
	<div class="card-footer">
		<div class=" row " >
			<div class=" col-lg-2 col-md-2 " >
				<a id="btnSalirForm" href="#" class="btn btn-default btn-block cerrarFrame " ><i class="fa fa-sign-out"></i> Salir</a>
				<hr>
			</div>
			<!-- ./col -->
			<div class=" col-lg-2 col-md-2 " >
                <button id="btnNuevo" class=" btn btn-primary " ><i class="fa fa-plus "></i> Nuevo</button>
				<hr>
			</div>
			<!-- ./col -->
			<div class=" col-lg-2 col-md-2 " >
                <button  class="btn btn-danger btn-block" id="btnAnularR" ><i class="fa fa-save"></i> Anular</button>
				<hr>
			</div>
			<!-- ./col -->
			<div class=" col-lg-2 col-md-2 " >
                <button  class="btn btn-primary btn-block" id="btnGuardarForm" ><i class="fa fa-save"></i> Guardar</button>
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