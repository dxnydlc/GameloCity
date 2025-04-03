

<?= $this->extend('layout/principal') ?>

<!-- <?= esc($APP_URL) ?> -->


<!-- ************************************************** -->
<?= $this->section('titulo') ?>
Constancia fumigacion
<?= $this->endSection() ?>
<!-- ************************************************** -->





<!-- ************************************************** -->
<?= $this->section('header') ?>
Tecnico
<?= $this->endSection() ?>
<!-- ************************************************** -->





<!-- ************************************************** -->
<?= $this->section('los_css') ?>


<link rel="stylesheet" href="https://cdn.datatables.net/select/1.7.0/css/select.dataTables.min.css" />


<?= $this->endSection() ?>
<!-- ************************************************** -->





<!-- ************************************************** -->
<?= $this->section('content') ?>

<!-- ============================================================== -->

<!-- Content Header (Page header) -->
<section class="content-header">
    <h1>
        Constancia fumigacción.
        <small>SSAYS SAC</small>
    </h1>
    <ol class="breadcrumb">
        <li class="active">Requisicion</li>
    </ol>
</section>


<!-- Main content -->
<section class="content" id="wrapper_body" >
    
<div class="box box-primary " id="wrapperTable" >
	<div class="box-header with-border">
		<i class="fa fa-text-width"></i>
		<h3 class="box-title">Resultado</h3>
		<div class=" box-tools pull-right ">
			<div class="btn btn-box-tool">
				<a id="btnOpenFiltro" href="#" class=" btn btn-primary btn-sm " >
                    <i class=" fa fa-search "></i> Buscar
                </a>
                <a id="btnCrearNuevo" href="#" class=" btn btn-primary btn-sm " >
                    <i class=" fa fa-plus "></i> Crear
                </a>
			</div>
		</div>
		<!-- /.box-tools -->
	</div>
	<!-- /.box-header -->
	<div class="box-body">
		<!-- ################################################## -->
        <table id="TablaHomePs" class=" table table-striped table-no-bordered table-hover " style="width:100%" >
            <thead>
                <tr>
                    <th></th>
                    <th></th>
                    <th>Local</th>
                    <th>IdArticulo</th>
                    <th>Articulo</th>
                    <th>Cantidad</th>
                    <th>U.Medida</th>
                    <th>Costo</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
        <!-- ################################################## -->
	</div>
	<!-- /.box-body -->
	<div class="box-footer">

         <div id="botonesPS"></div>

	</div>
	<!-- /.box-footer -->
</div>
<!-- ./box -->

<!-- Formulario -->
<?= $this->include('contancia_fumigacion/filtroConstFum') ?>
<?= $this->include('contancia_fumigacion/formConstFum') ?>
<?= $this->include('contancia_fumigacion/mdlConstFum') ?>
<!-- /Formulario -->


</section>







<!-- ============================================================== -->

<?= $this->endSection() ?>
<!-- ************************************************** -->





<!-- ************************************************** -->
<?= $this->section('los_js') ?>


<script src="https://cdn.datatables.net/buttons/1.5.2/js/dataTables.buttons.min.js" ></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js" ></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.36/pdfmake.min.js" ></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.36/vfs_fonts.js" ></script>
<script src="https://cdn.datatables.net/buttons/1.5.2/js/buttons.html5.min.js" ></script>
<script src="https://cdn.datatables.net/buttons/1.5.2/js/buttons.print.min.js" ></script>


<script type="text/javascript" src="<?= esc($APP_URL) ?>librerias/constancia_fumi/constanciaFumi.js?v=<?= $VERSION ?>" ></script>

<?= $this->endSection() ?>
<!-- ************************************************** -->



