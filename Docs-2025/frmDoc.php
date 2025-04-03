
<div class="box box-primary " id="wrapper_form" style="display:none;" >
	<div class="box-header with-border">
		<i class="fa fa-text-width"></i>
		<h3 class="box-title">Nuevo documento</h3>
		<div class=" box-tools pull-right ">
			<div class="btn btn-box-tool">
				<a id="btnCerrarForm" href="#" class="  " ><i class="fa fa-times"></i> Cerrar</a>
			</div>
		</div>
		<!-- /.box-tools -->
	</div>
	<!-- /.box-header -->
	<div class="box-body">
	
    <form id="frmDocumento" autocomplete="off" >
        <input type="hidden" id="id" name="id" value="" />
        <input type="hidden" id="uu_id" name="uu_id" value="" />

        <div class=" row " >
            <div class=" col-lg-3 col-md-3 " >
                <div class="form-group">
                    <label for="Codigo">Código</label> 
                    <input readonly type="text" name="Codigo" id="Codigo" class="form-control" value="" maxlength="150" />
                </div>
                <!-- ./form-group -->
            </div>
            <!-- ./col -->
            <div class=" col-lg-9 col-md-9 " ></div>
            <!-- ./col -->
        </div>
        <!-- ./row -->

        <div class=" row " >
            <div class=" col-lg-6 col-md-6 " >
                <div class=" form-group ">
                    <label for="Cliente">Cliente</label>
                    <select name="cboCliente" id="cboCliente" class="form-control" ></select>
                </div>
                <!-- ./form-group -->
            </div>
            <!-- ./col -->
            <div class=" col-lg-6 col-md-6 " >
                <div class=" form-group ">
                    <label for="cboSucursal" >Sucursal</label>
                    <select name="cboSucursal" id="cboSucursal" class="form-control" ></select>
                </div>
                <!-- ./form-group -->
            </div>
            <!-- ./col -->
        </div>
        <!-- ./row -->

        <div class=" row " >
            <div class=" col-lg-3 col-md-3 " >
                <div class=" form-group ">
                    <label for="Cliente">Textarea</label>
                    <textarea name="" id=""  maxlength ="200" class=" form-control " ></textarea>
                </div>
            <!-- ./form-group -->
            </div>
            <!-- ./col -->
            <div class=" col-lg-3 col-md-3 " >
                <div class="form-group">
                    <label for="Cliente">Texto</label> 
                    <input type="text" name="inicio" id="inicio" class="form-control" value="" maxlength="150" />
                </div>
                <!-- ./form-group -->
            </div>
            <!-- ./col -->
            <div class=" col-lg-3 col-md-3 " >
                <div class="form-group">
                    <label for="inicio" >NUmero</label> 
                    <input type="number" name="inicio" id="inicio" class="form-control text-right" value="" />
                </div>
                <!-- ./form-group -->
            </div>
            <!-- ./col -->
            <div class=" col-lg-3 col-md-3 " >
                <div class="form-group">
                    <label for="Cliente">Fecha</label> 
                    <input type="date" name="inicio" id="inicio" class="form-control" value="<?= date('Y-m-d') ?>" pleaceholder="<?= date('Y-m-d') ?>" >
                </div>
                <!-- ./form-group -->
            </div>
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
	<div class="box-footer">

        <div class=" row " >
            <div class=" col-lg-2 col-md-2 " >
                <button id="btnCerrarForm2" class=" btn btn-default " ><i class="fa fa-sign-out"></i> Salir</button>
                <hr>
            </div>
            <!-- ./col -->
            <div class=" col-lg-2 col-md-2 " >
                <button id="btnPrint" class=" btn btn-default " ><i class="fa fa-print "></i> Imprimir</button>
                <hr>
            </div>
            <!-- ./col -->
            <div class=" col-lg-2 col-md-2 " >
                <button id="btnAnular" class=" btn btn-danger " ><i class="fa fa-trash "></i> Anular</button>
                <hr>
            </div>
            <!-- ./col -->
            <div class=" col-lg-2 col-md-2 " >
                <button id="btnAprobar" class=" btn btn-success " ><i class="fa fa-check "></i> Aprobar</button>
                <hr>
            </div>
            <!-- ./col -->
            <div class=" col-lg-2 col-md-2 " >
                <button id="btnNuevoDoc" class=" btn btn-default " ><i class="fa fa-plus "></i> Nuevo</button>
                <hr>
            </div>
            <!-- ./col -->
            <div class=" col-lg-2 col-md-2 " >
                <button id="btnGuardar" class=" btn btn-primary " ><i class="fa fa-save "></i> Guardar</button>
                <hr>
            </div>
            <!-- ./col -->
        </div>
        <!-- ./row -->
    
	</div>
	<!-- /.box-footer -->
</div>
<!-- ./box -->
