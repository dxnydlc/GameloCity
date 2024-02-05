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
  fontFamily: 'FiraCode-Regular', fontSize: 18 , color : Color( 0XFFD8F3DC ) 
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
TextStyle txtTitulo2 = TextStyle(
  fontFamily: 'DMSans-Regular', fontSize: 18 , color : Color( 0XFFffffff ) 
);
// ...............................................
TextStyle txtCliente = TextStyle(
  fontFamily: 'DMSans-Regular', fontSize: 11 , color : Color( 0XFF2D6A4F ) 
);
// ...............................................
TextStyle txtSucursal = TextStyle(
  fontFamily: 'DMSans-Regular', fontSize: 11 , color : Color( 0XFF0077b6 ) 
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
return Scaffold(
  appBar: AppBar(
    automaticallyImplyLeading: false,
    title : Text( 'Monitoreo' , style : txtTitulo ),
    actions: [
      IconButton(
        onPressed: (){
          FocusScope.of(context).unfocus();
          Navigator.pushReplacementNamed(context, HomeMonitoreo_Screen.routerPantalla );
        }, 
        icon : const Icon( IconlyLight.close_square , color : Colors.white , )
      ),
    ],
  ),
  body: PopScope(
    canPop: false,
    onPopInvoked:(bool didPop) async {
      Vibration.vibrate(duration: 1000, amplitude: 128);
      if (didPop) {
        return;
      }
      await showDialog(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
            title: Text("¿Desea salir de esta pantalla?"),
            actions: <Widget>[
              TextButton(
                onPressed: () => Navigator.of(context).pop(false),
                child: Text("No"),
              ),
              TextButton(
                onPressed: () => Navigator.pushReplacementNamed( context , homeScreen.routerPantalla ) ,
                child: Text("Sí"),
              ),
            ],
          );
        },
      );
    },
    child: Container(
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
  ),
  floatingActionButton: FloatingActionButton(
    onPressed : ()async{
      // ============================================
        var uuid = Uuid();
      String uuIdDoc       = uuid.v4();
      Preferencias.uuIdDoc = uuIdDoc;
      Preferencias.idDoc   = 0;
      // xxxxxxxxxxxxxx Nueva instancia xxxxxxxxxxxxxx
      /* srvZona.ZonaSelect = ZonaLocalModel(
        uuId          : uuIdDoc , 
        id            : 0 ,
        idClienteProv : Preferencias.IdClienteProv , 
        idSucursal    : Preferencias.IdSucursal ,
        descripcion   : '' , 
        estado        : 'Activo'
      ); */
      // xxxxxxxxxxxxxx Nueva instancia xxxxxxxxxxxxxx

      //Navigator.pushReplacementNamed( context , CrudZonas_Screen.routerPantalla );
    },
  child : Icon( LineIcons.plus , color : Color( 0XFFD8F3DC ) )
  )
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

                        EasyLoading.showSuccess('Guardado');

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

==================================================== SELECCIONAR DE UN LIST VIEW ==================================

ListTile(
                  leading : data.isSelect 
                  ? Icon( Icons.check_box , color : Color( 0XFF1B4332 ) )
                  : Icon( Icons.check_box_outline_blank , color : Color( 0XFFB7E4C7 ) )
                  ,
                  title     : Text( '${data.producto}' , style : txt12_rg ) ,
                  subtitle  : Text( '${data.idProducto!}' , style : txt14_rg ) ,
                  onTap: ()async{
                    /* srvMonitoreo.selectData = data;
                    Navigator.pushReplacementNamed(context, AddTrampa_Screen.routerPantalla ); */
                  },
                  onLongPress: ()async{
                    // ...................................................
                    data.isSelect = !data.isSelect;
                    if( data.isSelect )
                    {
                      srvMonitoreo.addProdSel( data.id );
                    }else if(! data.isSelect )
                    {
                      srvMonitoreo.remProdSel( data.id );
                    }
                    // ...................................................
                    // ...................................................
                    // ...................................................
                  },
                ),

...... SERVICIO
// ..................................................
  List<int> arrProductosSel = [];
  // ..................................................
void addProdSel( int IdProd )
  {
    arrProductosSel.add( IdProd );
    notifyListeners();
  }
  // ...................................................
  void remProdSel( int IdProd )
  {
    arrProductosSel.removeWhere((element) => element == IdProd );
    notifyListeners();
  }













==================================================== MENSAJE SNACKBAR ==================================

// ==============================================
                          final snackBar = SnackBar(
                            elevation: 0,
                            behavior: SnackBarBehavior.floating,
                            backgroundColor: Colors.transparent,
                            content : AwesomeSnackbarContent(
                              title   : 'Correcto',
                              message : 'Productos eliminados correctamente' ,
                              /// change contentType to ContentType.failure, ContentType.success, ContentType.warning or ContentType.help for variant
                              contentType: ContentType.success ,
                            ),
                          );
                          ScaffoldMessenger.of(context)
                            ..hideCurrentSnackBar()
                            ..showSnackBar(snackBar);
                          // ==============================================




==================================================== OTP PARA VALIDAR CODIGOS ==================================




OtpTextField(
                                  numberOfFields: 5,
                                  borderColor: Color(0xFF512DA8),
                                  //set to true to show as box or false to show as dash
                                  showFieldAsBox: true, 
                                  //runs when a code is typed in
                                  onCodeChanged: (String code) {
                                      //handle validation or checks here
                                      //srvLogin.CodigoUsuario = code;
                                  },
                                  //runs when every textfield is filled
                                  onSubmit: (String verificationCode){
                                      String codigoU = verificationCode;
                                      codigoU = codigoU.toString().trim().toLowerCase();
                                      String codigoSt = srvLogin.CodigoSistema.toLowerCase();
                                      print('codigoU: $codigoU , codigoSt: $codigoSt');
                                      if( codigoU == codigoSt )
                                      {
                                        print('Correcto');
                                        srvLogin.CodigoCorrecto = true;
                                      }else{
                                        print('Incorrecto ==> ${codigoSt}');
                                        srvLogin.CodigoCorrecto = false;
                                        final snackBar = SnackBar(
                                          elevation: 0, behavior: SnackBarBehavior.floating,backgroundColor: Colors.transparent,
                                          content: AwesomeSnackbarContent(
                                            title       : 'Error',
                                            message     : 'Código incorrecto' ,
                                            contentType : ContentType.failure ,
                                          ),
                                        );

                                        ScaffoldMessenger.of(context)
                                          ..hideCurrentSnackBar()
                                          ..showSnackBar(snackBar);
                                        //
                                      }
                                  }, // end onSubmit
                                ),


==================================================== PROMPT

var message = '';
          QuickAlert.show(
            context: context,
            type: QuickAlertType.custom,
            barrierDismissible: true,
            confirmBtnText: 'Guardar',
            //customAsset: 'assets/custom.gif',
            widget: TextFormField(
              decoration: const InputDecoration(
                alignLabelWithHint: true,
                hintText: 'Ingrese nombre',
                prefixIcon: Icon(
                  Icons.phone_outlined,
                ),
              ),
              textInputAction: TextInputAction.next,
              keyboardType: TextInputType.text,
              onChanged: (value) => message = value,
            ),
            onConfirmBtnTap: () async {
              if (message.length < 5) {
                await QuickAlert.show(
                  context: context,
                  type: QuickAlertType.error,
                  text: 'Please input something',
                );
                return;
              }
              Navigator.pop(context);
              /* if (mounted) {
                QuickAlert.show(
                  context: context,
                  type: QuickAlertType.success,
                  text: "Phone number '$message' has been saved!.",
                );
              } */
            },
          );


==================================================== BADGE ====================================================


import 'package:badges/badges.dart' as badges;


badges.Badge(
                  badgeStyle: badges.BadgeStyle(
                    badgeColor   : Colors.blue,
                    padding      : EdgeInsets.all(7),
                    borderRadius : BorderRadius.circular(4),
                    borderSide   : BorderSide(color: Colors.white, width: 2),
                  ),
                  badgeContent: Text( '${data.id!}'  , style : txtBadge ),
                  child: Texte('Hola')
                  ),


==================================================== COMBITO COMBO ====================================================

DropdownButtonFormField(
                              decoration: const InputDecoration(
                                border: OutlineInputBorder(),
                                enabledBorder: OutlineInputBorder(
                                  borderSide: const BorderSide(
                                    color: Color( 0XFF95D5B2 ) , 
                                    width: 2,
                                  ),
                                ),
                                focusedBorder: OutlineInputBorder(
                                  borderSide: const BorderSide(
                                    color: Color( 0XFF0077b6 ) , 
                                    width: 3,
                                  ),
                                ),
                              ),
                              hint: Text('Seleccione' , style : txtReg12 ),
                              icon: const Icon( LineIcons.angleDown , size: 16 , color : Color( 0XFF1B4332 ) ),
                              isExpanded: true,
                              value : srvSupDiaria.SuperDiariaSelect!.idZona ,
                              items : lstZonas.map((e){
                                return DropdownMenuItem(
                                  value: e.id,
                                  child: Text( e.descripcion! , style : txtReg12 )
                                );
                              }).toList(),
                              onChanged: (value) {
                                //
                                setState(() {
                                  srvSupDiaria.SuperDiariaSelect!.idZona = value;
                                  print( srvSupDiaria.SuperDiariaSelect!.idZona );
                                });
                              },
                            ),


==================================================== TEXTAREA ====================================================



TextFormField(
                        maxLines: 4,
                        autocorrect: false,
                        keyboardType: TextInputType.text,
                        initialValue:  srvSupDiaria.SuperDiariaSelect!.glosa ,
                        decoration: InputDecorations.AuthInpuDecoration(
                          hintText    : 'Comentarios' ,
                          labelText   : 'Comentarios' ,
                          prefixIcon  : LineIcons.textHeight
                        ),
                        onChanged: (value){
                          srvSupDiaria.SuperDiariaSelect!.glosa = value;
                        },
                        style : txtReg14 ,
                      ),



==================================================== BADGES
https://pub.dev/packages/badges



==================================================== FULL SCREEN MENU
https://pub.dev/packages/full_screen_menu



==================================================== CAMERA 3.0.0
https://pub.dev/packages/camera_camera/example



==================================================== CAJA DE TEXTO FLEXIBLE
Flexible(
  child: new Container(
    padding: new EdgeInsets.only(right: 13.0),
    child: new Text(
      'Text largeeeeeeeeeeeeeeeeeeeeeee',
      overflow: TextOverflow.ellipsis,
      style: new TextStyle(
        fontSize: 13.0,
        fontFamily: 'Roboto',
        color: new Color(0xFF212121),
        fontWeight: FontWeight.bold,
      ),
    ),
  ),
),


==================================================== DETECTABLE TEXT FIELD
https://pub.dev/packages/detectable_text_field








*/