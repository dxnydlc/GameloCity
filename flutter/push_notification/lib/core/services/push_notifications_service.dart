

import 'dart:async';
import 'dart:developer';

import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';

class PushNotioficationService{

  static FirebaseMessaging messaging = FirebaseMessaging.instance;
  static String? token;

  static final StreamController<String> _messageStream = new StreamController.broadcast();
  static Stream<String> get messageStream => _messageStream.stream;


  static Future _backgroundHandler( RemoteMessage message )async{

    //
    log('BackgroundHandler: ${message.messageId}');
    log( '${message.data}' );
    _messageStream.add( message.data['producto'] ?? 'no titulo' );

  }

  static Future _onMessageHandler( RemoteMessage message )async{

    //
    log('onMessageHandler: ${message.messageId}');
    log( '${message.data}' );
    _messageStream.add( message.data['producto'] ?? 'no titulo' );

  }

  static Future _onOpenMessageOpenApp( RemoteMessage message )async{

    //
    log('onOpenMessageOpenApp: ${message.messageId}');
    log( '${message.data}' );
    _messageStream.add( message.data['producto'] ?? 'no titulo' );

  }

  static Future initializeApp() async{

    // Push notification
    await Firebase.initializeApp();

    token = await FirebaseMessaging.instance.getToken();
    log('Token Firebase: $token');

    // Handlers
    FirebaseMessaging.onBackgroundMessage( _backgroundHandler );
    FirebaseMessaging.onMessage.listen( _onMessageHandler );
    FirebaseMessaging.onMessageOpenedApp.listen( _onOpenMessageOpenApp );

    // Local notification
  

  }

  static closeStreams(){
    _messageStream.close();
  }
}