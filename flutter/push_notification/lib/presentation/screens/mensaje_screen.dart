import 'package:flutter/material.dart';

class MnesajeScreen extends StatelessWidget {
  const MnesajeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Inicio'),
      ),
      body: Center(
        child: Text('Home screen'),
      ),
    );
  }
}