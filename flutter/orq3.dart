/**
// Color en elevatedbutton icon
// https://www.flutterbeads.com/elevated-button-color-in-flutter/

ElevatedButton(
  onPressed: () {},
  style: ElevatedButton.styleFrom(
    foregroundColor : Colors.white ,
    backgroundColor : Colors.green.shade300 , // Text Color (Foreground color),
    fixedSize       : const Size(150, 70)
  ),
  child: const Text(
    'Elevated Button',
    style: TextStyle(fontSize: 40),
  ),
)

==================================================== NUEVA PANTALLA ====================================================
static const String routerPantalla = 'lista-monitoreo';
...
..
.
// ...................................................
final Medida = MediaQuery.of(context).size;
// ...................................................
TextStyle txtTitulo = TextStyle(
  fontFamily: 'FiraCode-Regular', fontSize: 18 , color : Color( 0xFF081C15 ) 
);
// ...................................................
const txtReg12 = TextStyle(
  fontFamily: 'FiraCode-Regular', fontSize: 12 , color : Color( 0XFF1B4332 )
);
// ...................................................
const txtBtn16W = TextStyle(
  fontFamily: 'FiraCode-Bold', fontSize: 18 , color : Color( 0XFFD8F3DC )
);
// ...................................................
// ...................................................
// ...................................................
// ...................................................
// ...................................................
// ...................................................
// ...................................................
// ...................................................
// ...................................................
// ...................................................
// ...................................................
// ...................................................
// ...................................................
// ...................................................
// ...................................................
// ...................................................
// ...................................................
// ...................................................
// ...................................................
// ...................................................
// ...................................................
// ...................................................
// ...................................................
// ...................................................
// ...................................................
// ...................................................
// ...................................................
// ...................................................
// ...................................................
// ...................................................
// ...................................................
// ...................................................
return Scaffold(
  appBar: AppBar(
    automaticallyImplyLeading: false,
    title : Text( 'Monitoreo' , style : txtTitulo ),
    actions: [
      IconButton(
        onPressed: (){
          Navigator.pushReplacementNamed(context, HomeMonitoreo_Screen.routerPantalla );
        }, 
        icon : const Icon( IconlyLight.close_square , color : Color( 0XFFD8F3DC ) , )
      ),
    ],
  ),
  body: Container(
    width: double.infinity , 
    child: Padding(
      padding: const EdgeInsets.all(8.0),
      child: SizedBox(
        child: Card(
          child: Padding(
            padding: const EdgeInsets.all(8.0),
            child: Column(
              children: [
                // ...................................................
                Text('Ingrese Nro de OT'),
                // ...................................................
                // ...................................................
                // ...................................................
                // ...................................................
                // ...................................................
                // ...................................................
              ],
            ),
          ),
        ),
      ),
    ),
  ),
);
// ...................................................

==================================================== BOTON ====================================================

ElevatedButton.icon(
  style: ElevatedButton.styleFrom(
    foregroundColor : Color( 0XFFD8F3DC ) ,
    backgroundColor : Color( 0XFF2D6A4F ) , // Text Color (Foreground color),
    fixedSize       : const Size( 180 , 40 )
  ),
  onPressed: ()async{
    //
  }, 
  icon    : Icon( IconlyLight.arrow_right_2 ) , 
  label   : Text( 'Continuar' , style : txtBtn16W ) , 
),





==================================================== GUARDAR ==================================
Future<String> guardar ()async{

  isLoading = true;
  notifyListeners();

  String token = await _storage.read(key: 'token_session') ?? '';
  final headers = {
    'Content-Type'  : 'application/json',
    'Charset'       : 'utf-8',
    'Authorization' : 'Bearer $token'
  };
  var url;
  var resp;

  //
  if( TurnoSelect?.id == 0 ){
    url = Uri.https( _baseMysql , 'v1/asistencia-turnos/guardar' );
    resp = await http.post( url , headers : headers , body: TurnoSelect?.toRawJson() );
    //
  }else{
    //
    url = Uri.https( _baseMysql , 'v1/asistencia-turnos/actualizar/${TurnoSelect?.uuId}' );
    resp = await http.patch( url , headers : headers , body: TurnoSelect?.toRawJson() );
  }
  print( resp.body );

  CodigoResp = resp.statusCode;

  if( resp.statusCode == 200 )
  {
    TurnoSelect = TurnosModel.fromRawJson( resp.body );
    //
  }else{
    //
    final Map<String, dynamic> prevData = json.decode( resp.body );
    MessageResp = prevData['message'].toString();
  }

  isLoading = false;
  notifyListeners();
  return '';
}





==================================================== SETERS GETTERS ==================================
String _NuevaClave = '';

String get NuevaClave => _NuevaClave;
// ..................................................
set NuevaClave ( String value )
{
  _NuevaClave = value;
  notifyListeners();
}



==================================================== DETALLE DE CARD ==================================

body: ListView.builder(
        itemCount   : srvTrampas.arrTrampas.length ,
        itemBuilder : ( BuildContext context , int index )  => CardTrampa_Widget(data: srvTrampas.arrTrampas[ index ],)
      ),



....
final TrampasModel data;
....
// ...................................................
    final Medida = MediaQuery.of(context).size;
    // ...................................................
    TextStyle txt14_rg = TextStyle(
      fontFamily: 'FiraCode-Regular', fontSize: 14 , color : Color( 0XFF1B4332 )
    );
    // ...................................................
    TextStyle txt12_rg = TextStyle(
      fontFamily: 'FiraCode-Regular', fontSize: 12 , color : Color( 0XFF40916C )
    );
    // ...................................................
    // ...................................................
    // ...................................................
    // ...................................................
    // ...................................................
    final srvTrampas = Provider.of<TrampasService>(context);
    // ...................................................
    // ...................................................
    // ...................................................
    // ...................................................
    // ...................................................
    // ...................................................
    // ...................................................
    return SizedBox(
      width : Medida.width , 
      child: Padding(
        padding: const EdgeInsets.symmetric( horizontal: 10 , vertical: 5 ) ,
        child: GestureDetector(
          onTap : (){
            //
          } ,
          child: Card(
            child: Column(
              children: [
                // ...................................................
                ListTile(
                  leading : data.estado == 'Digitado' 
                  ? Icon( Icons.check_box_outline_blank , color : Color( 0XFFB7E4C7 ) )
                  : Icon( Icons.check_box , color : Color( 0XFF1B4332 ) )
                  ,
                  title     : Text( '${data.descripcion}' , style : txt14_rg ) ,
                  subtitle  : Text( '${data.codigo!} | ${data.tipo}' , style : txt14_rg ) ,
                  onTap: ()async{
                    srvTrampas.selectData = data;
                    Navigator.pushReplacementNamed(context, AddTrampa_Screen.routerPantalla );
                  },
                ),
                // ...................................................
                Text( '#${data.codigo}, Actualizado: ${data.Actualizado}' , style: txt12_rg ),
                // ...................................................
                // ...................................................
                // ...................................................
              ],
            ),
          ),
        ),
      ),
    );
    // ...................................................


==================================================== ACTUALIZADO ==================================

get Actualizado{
    String strFecha = updatedAt!;
    final arFec1 = strFecha.split('T');
    String Date1 = arFec1[0];
    final arFec2 = Date1.split('-');
    // horas
    String Horas1 = arFec1[1];
    final arHoras = Horas1.split('.');

    return '${arFec2[2]}/${arFec2[1]}/${arFec2[0]} ${arHoras[0]}';
  }

==================================================== CARGANDO ==================================

//quitar teclado
                        FocusScope.of(context).unfocus();
                        await EasyLoading.show(
                          status   : 'Revisando...',
                          maskType : EasyLoadingMaskType.black,
                        );

                        EasyLoading.dismiss();


==================================================== COMBO FROM JSON ==================================

const jsonIndv = [
      {'id' : '-' , 'txt' : 'Seleccione' } , 
      {'id' : 'Mus' , 'txt' : 'Mus Musculus' } , 
      {'id' : 'Ratr' , 'txt' : 'Rattus rattus' } , 
      {'id' : 'Ratn' , 'txt' : 'Rattus novergicus' }
    ];

Container(
                      decoration : BoxDecoration(
                        borderRadius: BorderRadius.circular(10 ) , border: Border.all( color :  Colors.grey )
                      ),
                      child: Padding(
                        padding: const EdgeInsets.symmetric( horizontal : 20 ) ,
                        child: DropdownButton<String>(
                          value       : data.espec , 
                          onChanged: (String? value) {
                            setState(() { data.espec = value; });
                          },
                          items:jsonIndv.map((Map val){
                            return DropdownMenuItem<String>(
                              value: val["id"],
                              child: new Text(val["txt"]),
                            );
                          }).toList(),
                        ),
                      ),
                    ),


==================================================== MENSAJE SNACKBAR ==================================

// ==============================================
                          final snackBar = SnackBar(
                            elevation: 0,
                            behavior: SnackBarBehavior.floating,
                            backgroundColor: Colors.transparent,
                            content : AwesomeSnackbarContent(
                              title   : 'Correcto',
                              message : 'Productos eliminados correctamente' ,
                              /// change contentType to ContentType.success, ContentType.warning or ContentType.help for variant
                              contentType: ContentType.success ,
                            ),
                          );
                          ScaffoldMessenger.of(context)
                            ..hideCurrentSnackBar()
                            ..showSnackBar(snackBar);
                          // ==============================================



*/