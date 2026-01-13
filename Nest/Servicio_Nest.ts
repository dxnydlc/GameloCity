
// ==================================
// CODIGO PARA UNA TABLA CON ARCHIVOS
// =================================

/**
-- =====================================================
-- ARCHIVOS.
-- =====================================================


-- nest generate resource orq_constancia_supervision_osa_obs6_archivos --no-spec

DROP TABLE if exists ssays01.orq_archivos_planeamiento_programacion;

TRUNCATE TABLE ssays01.orq_archivos_planeamiento_programacion;

CREATE TABLE `orq_archivos_planeamiento_programacion` (
  `id`              int(10) unsigned NOT NULL AUTO_INCREMENT,
  `uu_id`           varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_modulo`       int(11) DEFAULT NULL,
  `guardado_en`     varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT 'PUBLIC',
  `ruta_fisica`     text COLLATE utf8mb4_unicode_ci,
  `RutaOriginal`    text COLLATE utf8mb4_unicode_ci,
  `RutaThumbnail`   text COLLATE utf8mb4_unicode_ci,
  `id_usuario`      varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `usuario`         varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modulo`          varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `formulario`      varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nombre_archivo`  varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `size`            varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nombre_fisico`   varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `extension`       varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `NroPaginas`      int(11) DEFAULT '0',
  `url`             text COLLATE utf8mb4_unicode_ci,
  `url_compress`    text COLLATE utf8mb4_unicode_ci,
  `url_original`    text COLLATE utf8mb4_unicode_ci,
  `url_thumb`       text COLLATE utf8mb4_unicode_ci,
  `url_400`         text COLLATE utf8mb4_unicode_ci,
  `url_40`          text COLLATE utf8mb4_unicode_ci,
  `tipo_documento`  varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Cod001`          varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Cod002`          varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Cod003`          varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `serie`           varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `correlativo`     int(11) DEFAULT NULL,
  `id_mail`         int(11) DEFAULT NULL,
  `id_respuesta`    int(11) DEFAULT NULL,
  `token`           text COLLATE utf8mb4_unicode_ci,
  `glosa`           text COLLATE utf8mb4_unicode_ci,
  `id_carpeta`      int(11) DEFAULT NULL,
  `carpeta`         varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `publico`         varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_post`         int(11) DEFAULT NULL,
  `tipo_archivo_salud` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT 'EMO',
  `IdClienteProv`   bigint(20) DEFAULT NULL,
  `IdSucursal`      bigint(20) DEFAULT NULL,
  `id_empresa`      int(11) NOT NULL DEFAULT '1',
  `empresa`         varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'SSAYS SAC',
  `deleted_at`      timestamp NULL DEFAULT NULL,
  `created_at`      timestamp NULL DEFAULT NULL,
  `updated_at`      timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/**/

// MODELO
/*
@PrimaryGeneratedColumn() 
    id : number

    @Column()
    @Generated("uuid")
    uu_id : string

    @Column()
    id_modulo : number

    @Column()
    guardado_en : string

    @Column({ type : 'text' })
    ruta_fisica : string

    @Column({ type : 'text' })
    RutaOriginal : string

    @Column({ type : 'text' })
    RutaThumbnail : string

    @Column()
    id_usuario : string

    @Column()
    usuario : string

    @Column()
    modulo : string

    @Column()
    formulario : string

    @Column()
    nombre_archivo : string

    @Column()
    size : string

    @Column()
    nombre_fisico : string

    @Column()
    extension : string

    @Column()
    NroPaginas : number

    @Column({ type : 'text' })
    url : string

    @Column({ type : 'text' })
    url_original : string

    @Column({ type : 'text' })
    url_thumb : string

    @Column({ type : 'text' })
    url_compress : string

    @Column({ type : 'text' })
    url_400 : string

    @Column({ type : 'text' })
    url_40 : string

    @Column()
    tipo_documento : string

    @Column()
    Cod001 : string

    @Column()
    Cod002 : string

    @Column()
    Cod003 : string

    @Column()
    serie : string

    @Column()
    correlativo : number

    @Column()
    id_mail : number

    @Column()
    id_respuesta : number

    @Column({ type : 'text' })
    token : string

    @Column({ type : 'text' })
    glosa : string

    @Column()
    id_carpeta : number

    @Column()
    carpeta : string

    @Column()
    publico : string

    @Column()
    id_post : number

    @Column({type:'bigint'})
    IdClienteProv : number

    @Column()
    IdSucursal : number

    @Column()
    id_empresa : number

    @Column()
    empresa : string

    @Column({ type : 'datetime'})
    deleted_at : Date

    @Column({ type : 'datetime'})
    created_at : Date

    @Column({ type : 'datetime'})
    updated_at : Date
*/

// CONTRALADOR
// ===========================
/*
// ................................................................
  // ................................................................
  // ................................................................
  // ................................................................
  //
  //   * 
  //   * @param formData 
  //   * @param Flag, Cod01, Id, Token, Glosa, idFolder, Folder
  //   * @param req 
  //   * @returns 
  //
    @Post('upload')
    @HttpCode(200)
    @UseInterceptors(FileInterceptor('formData', { storage }))
    async handleUpload( @UploadedFile() file: Express.Multer.File, @Body() body: any, @Req() req: Request) {
      //
      varDump( `##############################################` );
      varDump( `CARGAR  ARCHIVO MIL` );
      varDump( `##############################################` );
      const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
      
      let headerToken = req.headers.authorization;
      let Usuario = '' , IdUsuario = 0;
  
      if( headerToken ){
        let arTOken = headerToken.split(' ');
        let dataT = await this.util.decodificaToken( arTOken[1] );
        if( dataT ){
          Usuario   = dataT['name'];
          IdUsuario = dataT['dni'];
        }
      }
  
      //console.log( headerToken );
      let _URL_PROYECTO = process.env.URL_PROYECTO;
      console.log('path: ' + _URL_PROYECTO + file.path);
      let filename = file.filename;
      console.log('filename: ' + file.filename);
      let extension = file.mimetype;
      extension = extension.toLowerCase()
      console.log(`MimeType: ${extension}`);
  
  
      // Origin: https://stackoverflow.com/questions/10865347/node-js-get-file-extension
      let extFile = filename
        .split('.')
        .filter(Boolean) // removes empty extensions (e.g. `filename...txt`)
        .slice(1)
        .join('.');
      console.log(`Extensión: ${extFile}`);
  
      let url_thumb = `uploads/${file.filename}`;
      let url_compress = `uploads/${file.filename}`;
  
      switch (extFile.toLocaleLowerCase()) {
        case 'jpg':
        case 'png':
        case 'jpeg':
          url_thumb = `uploads/thumbnails-${file.filename}`;
          url_compress = `uploads/thumbnails-${file.filename}`;
          await sharp(_URL_PROYECTO + file.path).resize(200, 200).toFile(_URL_PROYECTO + 'public/uploads/' + 'thumbnails-' + file.filename, (err, resizeImage) => {
            if (err) {
              console.log(err);
            } else {
              console.log(resizeImage);
            }
          });
          break;
      }
  
      let _data = {
        ruta_fisica     : file.path,
        RutaOriginal    : file.path,
        RutaThumbnail   : file.path,
        url             : `uploads/${file.filename}`,
        url_original    : `uploads/${file.filename}`,
        url_thumb       : url_thumb,
        url_compress    : url_compress,
        extension       : extFile,
        size            : file.size,
        nombre_archivo  : file.originalname,
        nombre_fisico : file.filename,
        formulario    : body.Flag,
        Cod001        : body.Cod01,
        correlativo   : body.Id,
        token         : body.Token,
        glosa         : body.Glosa,
        id_carpeta    : body.idFolder , 
        carpeta       : body.Folder ,
        created_at    : createdAt , 
        updated_at    : createdAt , 
        id_usuario    : IdUsuario  , 
        usuario       : Usuario , 
      };
      return this.memorandumArchivosService.cargar(_data);
    }
  // ................................................................
  // ................................................................
  // ................................................................
  // ................................................................
  // ................................................................
  // ................................................................
  // ................................................................
/**/

// SERVICE
// ===========================
/*
// ...................................................................
  // ...................................................................
  // ...................................................................
  // ...................................................................
  // ...................................................................
  // ...................................................................
  // ...................................................................
  async cargar(data: any) {
  
    try {

      let result: [];

      const newArea = await this.datosModel.create(data);
      let dataInsertada = await this.datosModel.save(newArea);

      varDump( `##############################################` );
      varDump( `ESCRIBIR  ARCHIVO MEMORANDUM` );
      varDump( dataInsertada );
      varDump( `##############################################` );

      // devolver todos archivos con ese token y formulario¿?

      return {
        data : result , 
        version : '1' , 
        msg : { titulo : 'Correcto' , texto : 'Registros cargados' , clase : 'success' , call : 'tostada2' }
      }

    } catch (error) {

      varDump( error );
      throw new HttpException( error , HttpStatus.CONFLICT );

    }
  }
  // ...................................................................
  // ...................................................................
*/





// =========================== TABLA
/*

TRUNCATE TABLE ssays01.orq_protocolo_medico;

DROP TABLE if exists ssays01.orq_protocolo_medico;

CREATE TABLE `orq_protocolo_medico` (
	`id` 		 INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
	`uu_id` 	 VARCHAR(150) DEFAULT NULL,

	`Codigo` 	   VARCHAR(150) DEFAULT NULL,
    `Descripcion`  VARCHAR(150) DEFAULT NUll,
	
	`deleted_at` 	TIMESTAMP NULL DEFAULT NULL,
	`created_at` 	TIMESTAMP NULL DEFAULT NULL,
	`updated_at` 	TIMESTAMP NULL DEFAULT NULL,
	PRIMARY KEY (`id`)
)
ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=UTF8MB4_UNICODE_CI;

/*
/**
 * 
// ========================== ENTITIES


import { ClienteModel } from "src/clientes/model/cliente_schema.entity"
import { SucursalModel } from "src/sucursales/model/sucursal_schema.entity"
import { Column, Entity, Generated, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm"


@Entity({ name: 'orq_datos' })
export class DatosModel {

    @PrimaryGeneratedColumn() 
    id : number

    @Column()
    @Generated("uuid")
    uu_id : string

    @Column()
    Tipo : string

    @Column()
    Cod01 : string

    @Column()
    Cod02 : string

    @Column()
    Descripcion : string

    @Column({type : 'double'})
    IdClienteProv : number

    @Column()
    IdSucursal : number

    @Column()
    Estado : string

    @Column()
    IdUsuario : number

    @Column()
    Usuario : string

    @Column()
    deleted_at : string

    @Column()
    created_at : string

    @Column()
    updated_at : string





    @OneToOne( () => ClienteModel , (Cliente) => Cliente.dCliente10 )
    @JoinColumn({ name : 'IdClienteProv' , referencedColumnName : 'IdClienteProv' })
    dCliente10 : ClienteModel


    @OneToOne(() => SucursalModel , (photo) => photo.dLocal10 )
    @JoinColumn({ name : 'IdSucursal' , referencedColumnName : 'IdSucursal' })
    dLocal10 : SucursalModel

}


// ========================== DTO



// ************************************************

  export class createUserDto{

    // ************************************************

    @ApiProperty({
        description : 'Tipo',
        default     : 'Monitoreo',
    })
    @IsNotEmpty({message : 'Ingrese Tipo'})
    Tipo : string

    // ************************************************

    @ApiProperty({
        description : 'Descripcion',
        default     : 'Monitoreo',
    })
    @IsNotEmpty({message : 'Ingrese Tipo'})
    Descripcion : string

    // ************************************************
  
  }

  



// ======================================== MODULE
imports : [
  TypeOrmModule.forFeature([
    SupCronogramaModel 
  ]) , 
  UtilidadesModule , 
],
exports     : [SupCronogramaService],




// ======================================== SERVICE


import { readFileSync, writeFileSync } from 'fs';
const execShPromise = require("exec-sh").promise;

import * as moment from 'moment';
import 'moment/locale/pt-br';
import { v4 as uuidv4 } from 'uuid';

require('colors');


  // ...................................................................
  // ...................................................................
  constructor(
    @InjectRepository( MipCaracteristicaModal )private readonly datosModel : Repository<MipCaracteristicaModal> ,
    private util : UtilidadesService , 
  ){}
  // ...................................................................
  // ...................................................................
  // ...................................................................
  // ...................................................................
  // ...................................................................
  // ...................................................................
  // ...................................................................
  // ...................................................................
  async demoFuncion() {
    
    try {
      
      let data = await this.datosModel.find({
        take : 200 ,
        order : {
          id : 'DESC'
        }
      });
  
      return {
        data , 
        version : '1' , 
        msg : { titulo : 'Correcto' , texto : 'Registros cargados' , clase : 'success' , call : 'tostada2' }
      }

    } catch (error) {

      varDump( error );
      throw new HttpException( error , HttpStatus.CONFLICT );

    }

  }
  // ...................................................................
  // ...................................................................
  async guardar( dto : CreateMipCaracteristicaDto ) {
    
    try {

      //Comprobar si el codigo ya existe
      const mipPlagaInit = await this.datosModel.findOne({
        where: {
          Codigo: dto.Codigo
        }
      });

      if (mipPlagaInit) throw new HttpException('El código ya existe', HttpStatus.CONFLICT);
      
      const newArea = await this.datosModel.create( dto );
      let dataSave  = await this.datosModel.save( newArea );
      //let Codigo = await this.util.addZeros( dataSave.id , 4 );
      //await this.datosModel.update({ id : dataSave.id },{ Codigo : `RM${Codigo}` });

      let data = await this.datosModel.findOne({
        where : {
          id : dataSave.id
        }
      });

      return {
        data , 
        version : '1' , 
        msg : { titulo : 'Correcto' , texto : 'Registro guardado' , clase : 'success' , call : 'tostada2' }
      }

    } catch (error) {
      
      varDump( error );
      throw new HttpException( error , HttpStatus.CONFLICT );

    }

  }
  // ...................................................................
  // ...................................................................
  async getTodos() {
    
    try {
      
      let data = await this.datosModel.find({
        take : 200 ,
        order : {
          id : 'DESC'
        }
      });
  
      return {
        data , 
        version : '1' , 
        msg : { titulo : 'Correcto' , texto : 'Registros cargados' , clase : 'success' , call : 'tostada2' }
      }

    } catch (error) {

      varDump( error );
      throw new HttpException( error , HttpStatus.CONFLICT );

    }

  }
  // ...................................................................
  // ...................................................................
  async getbyId( id : number ) {
    try {

      let data = await this.datosModel.findOne({
        where : {
          id
        }
      });

      return {
        data , 
        version : '1' , 
        msg : { titulo : 'Correcto' , texto : 'Registro recibido' , clase : 'success' , call : 'tostada2' }
      }
      
    } catch (error) {
      
      varDump( error );
      throw new HttpException( error , HttpStatus.CONFLICT );

    }
  }
  // ...................................................................
  // ...................................................................
  async Actualizar( uuID : string , dto : UpdateMipCaracteristicaDto ) {
    
    try {

      await this.datosModel.update({ uu_id : uuID } , dto );
      let dataP = await this.datosModel.findOne({
        where : {
          uu_id : uuID
        }
      });

      return {
        data : dataP , 
        version : '1' , 
        msg : { titulo : 'Correcto' , texto : 'Registro actualizado' , clase : 'success' , call : 'tostada2' }
      }
      
    } catch (error) {

      varDump( error );
      throw new HttpException( error , HttpStatus.CONFLICT );
      
    }

  }
  // ...................................................................
  // ...................................................................
  async AnularbyId( id : number ) {
    try {

      const updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');

      await this.datosModel.update({ id } , { Estado : 'Desactivado' , deleted_at : updatedAt , updated_at : updatedAt } );
      let data = await this.datosModel.findOne({
        where : {
          id 
        }
      });

      return {
        data , 
        version : '1' , 
        msg : { titulo : 'Correcto' , texto : 'Registro anulado' , clase : 'success' , call : 'tostada2' }
      }
      
    } catch (error) {
      
      varDump( error );
      throw new HttpException( error , HttpStatus.CONFLICT );

    }
  }
  // ...................................................................
  // ...................................................................
  async enviarCorreo() {
    
    try {
      
      const SparkPost = require('sparkpost');
      let SPARKPOST_SECRET = process.env.SPARKPOST_SECRET;
      const client = new SparkPost( SPARKPOST_SECRET );

      let resultado = {};

      client.transmissions.send({
        options: {
          sandbox: true
        },
        content: {
          from: 'testing@sparkpostbox.com',
          subject: 'Hello, World!',
          html:'<html><body><p>Testing SparkPost - the world\'s most awesomest email service!</p></body></html>'
        },
        recipients: [
          {address: '<YOUR EMAIL ADDRESS>'}
        ]
      })
      .then(data => {
        console.log('Woohoo! You just sent your first mailing!');
        console.log(data);
        resultado = data;
      })
      .catch(err => {
        console.log('Whoops! Something went wrong');
        console.log(err);
        resultado = err;
      });
  
      return {
        data : resultado , 
        version : '1' , 
        msg : { titulo : 'Correcto' , texto : 'Registros cargados' , clase : 'success' , call : 'tostada2' }
      }

    } catch (error) {

      varDump( error );
      throw new HttpException( error , HttpStatus.CONFLICT );

    }

  }
  // ...................................................................
  // ...................................................................
  // ...................................................................
  // ...................................................................
  // ...................................................................
  // ...................................................................
  // ...................................................................
  // ...................................................................
  // ...................................................................
  // ...................................................................
  // ...................................................................
  // ...................................................................
  // ...................................................................
  // ...................................................................
  // ...................................................................
  // ...................................................................
  // ...................................................................
  // ...................................................................
  // ...................................................................
  // ...................................................................
  // ...................................................................
  // ...................................................................
  // ...................................................................
  // ...................................................................
  // ...................................................................
  // ...................................................................
  async create( dto : CreateMipCaracteristicaDto ) {
    
    try {
      
      const newArea = await this.datosModel.create( dto );
      let dataSave  = await this.datosModel.save( newArea );
      //let Codigo = await this.util.addZeros( dataSave.id , 4 );
      //await this.datosModel.update({ id : dataSave.id },{ Codigo : `RM${Codigo}` });

      let data = await this.datosModel.findOne({
        where : {
          id : dataSave.id
        }
      });

      return {
        data , 
        version : '1' , 
        msg : { titulo : 'Correcto' , texto : 'Registro guardado' , clase : 'success' , call : 'tostada2' }
      }

    } catch (error) {
      
      varDump( error );
      throw new HttpException( error , HttpStatus.CONFLICT );

    }

  }
  // ...................................................................
  // ...................................................................
  async findAll() {
    
    try {
      
      let data = await this.datosModel.find({
        take : 200 ,
        order : {
          id : 'DESC'
        }
      });
  
      return {
        data , 
        version : '1' , 
        msg : { titulo : 'Correcto' , texto : 'Registros cargados' , clase : 'success' , call : 'tostada2' }
      }

    } catch (error) {

      varDump( error );
      throw new HttpException( error , HttpStatus.CONFLICT );

    }

  }
  // ...................................................................
  // ...................................................................
  async findOne( uuid : string ) {
    try {

      let data = await this.datosModel.findOne({
        where : {
          uu_id : uuid
        }
      });

      return {
        data , 
        version : '1' , 
        msg : { titulo : 'Correcto' , texto : 'Registro recibido' , clase : 'success' , call : 'tostada2' }
      }
      
    } catch (error) {
      
      varDump( error );
      throw new HttpException( error , HttpStatus.CONFLICT );

    }
  }
  // ...................................................................
  // ...................................................................
  async update( uuID : string , dto : UpdateMipCaracteristicaDto ) {
    
    try {

      await this.datosModel.update({ uu_id : uuID } , dto );
      let dataP = await this.datosModel.findOne({
        where : {
          uu_id : uuID
        }
      });

      return {
        data : dataP , 
        version : '1' , 
        msg : { titulo : 'Correcto' , texto : 'Registro actualizado' , clase : 'success' , call : 'tostada2' }
      }
      
    } catch (error) {

      varDump( error );
      throw new HttpException( error , HttpStatus.CONFLICT );
      
    }

  }
  // ...................................................................
  // ...................................................................
  async remove( uuID : string ) {
    try {

      const updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');

      await this.datosModel.update({ uu_id : uuID } , { deleted_at : updatedAt , updated_at : updatedAt } );
      let data = await this.datosModel.findOne({
        where : {
          uu_id : uuID
        }
      });

      return {
        data , 
        version : '1' , 
        msg : { titulo : 'Correcto' , texto : 'Registro anulado' , clase : 'success' , call : 'tostada2' }
      }
      
    } catch (error) {
      
      varDump( error );
      throw new HttpException( error , HttpStatus.CONFLICT );

    }
  }
  // ...................................................................
  // ...................................................................
  async maxId()
  {
    let MaxId = await this.datosModel.createQueryBuilder('areas').select("MAX(areas.CodArea)", "max").getRawOne();
    return MaxId.max + 1;
  }
  // ...................................................................
  // ...................................................................
  async buscaDescri( nombre :string )
  {
    let data = await this.datosModel.find({
      where : {
        Descripcion : nombre.trim()
      }
    });
    return data.length;
  }
  // ...................................................................
  // ...................................................................
  // ...................................................................
  // ...................................................................
  // ...................................................................
  // ...................................................................
  // ...................................................................
  // ...................................................................
  // ...................................................................
  // ...................................................................
  // ...................................................................
  // ...................................................................
  // IMPRESION CLIENTE
  async generarHTML01(IdsOT: string) {

    let css = await this.util.getcss_ot01();
    let Salto = `<div style="page-break-after:always;" ></div>`;

    let html = ``;

    // TERMINAMOS DE ESCRIBIR EL ARCHIVO
    let _uuid = uuidv4();
    let _URL_PROYECTO = process.env.URL_PROYECTO;
    let NombreArchivo = `OT01_${_uuid}`;
    let pathPhp = `${_URL_PROYECTO}public/html/${NombreArchivo}.html`;
    await this.util.varDump(pathPhp);
    writeFileSync(pathPhp, html);
    //
    await sleep(2000); // Wait for one second
    await this.transformarHtml(NombreArchivo);
    //
    return {
      file: `${NombreArchivo}`,
      version: 1,
    };

  }
  // ...................................................................
  // ...................................................................
  async transformarHtml(file: string) {
    //

    let out;

    try {
      let _URL_PROYECTO = process.env.URL_PROYECTO;
      let comando = `xvfb-run wkhtmltopdf --enable-local-file-access ${_URL_PROYECTO}public/html/${file}.html ${_URL_PROYECTO}public/html/${file}.pdf`;
      out = await execShPromise(comando, true);
    } catch (e) {
      console.log('Error: ', e);
      console.log('Stderr: ', e.stderr);
      console.log('Stdout: ', e.stdout);

      return e;
    }

    console.log('out: ', out.stdout, out.stderr);

    return {
      data: 'ok'
    };

  }
  // ...................................................................
  // ...................................................................
  // ...................................................................
  // ...................................................................
  // ...................................................................
  // ...................................................................
  // ...................................................................
  // ...................................................................
  // ...................................................................
  // ...................................................................
  // ...................................................................
  // ...................................................................

-- FUERA DE LA CLASE
// ...................................................................
function varDump( e ){
  console.log( e );
}
// ...................................................................
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
// ...................................................................
  function Dump1( e , color )
  {
    // rojo, verde, amarillo, negrita_verde, negrita_verde_u
    switch ( color ) {
      case 'rojo':
        console.log(  e.red );
      break;
      case 'verde':
        console.log(  e.green );
      break;
      case 'amarillo':
        console.log(  e.yellow );
      break;
      case 'negrita_verde':
        console.log(  e.green );
      break;
      case 'negrita_verde_u':
        console.log(  e.green.bold );
      break;
      default:
        //
      break;
    }
  }
  // ..............................................................................





// ======================================== CONTROLLER


import * as moment from 'moment';
import 'moment/locale/pt-br';
import { v4 as uuidv4 } from 'uuid';
import { JwtGuardGuard } from 'src/guard/jwt-guard/jwt-guard.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Request } from 'express';
import { UtilidadesService } from 'src/utilidades/utilidades.service';


// Para activar el auth JwTokenAuth
@UseGuards( JwtGuardGuard )

@ApiTags('Datos')
@ApiBearerAuth()
@UsePipes( new ValidationPipe )



// ................................................................
  // ................................................................
  constructor(
    private readonly mipCaracteristicasService: MipCaracteristicasService , 
    private readonly util : UtilidadesService , 
  ) {}
  // ................................................................
  // ................................................................
  // ................................................................
  // ................................................................
  // private readonly util : UtilidadesService , 
  // ................................................................
  // ................................................................
  // ................................................................
  // ................................................................
  // ................................................................
  // ................................................................
  // ................................................................
  // ................................................................
  // ................................................................
  // ................................................................
  // ................................................................
  // ................................................................
  // ................................................................
  // ................................................................
  // ................................................................
  // ................................................................
  // ................................................................
  @Post('guardar')
  @HttpCode(200)
  async guardar(@Body() dto : CreateMipCaracteristicaDto , @Req() req : Request ) {
    
    const createdAt = moment(  ).format('YYYY-MM-DD HH:mm:ss');
    let headerToken = req.headers.authorization;
    let Usuario = '' , IdUsuario = 0;

    if( headerToken ){
      let arTOken = headerToken.split(' ');
      let dataT = await this.util.decodificaToken( arTOken[1] );
      if( dataT ){
        Usuario   = dataT['name'];
        IdUsuario = dataT['dni'];
      }
    }

    const bodyProocolo = {
      ...dto , 
      created_at : createdAt , 
      updated_at : createdAt , 
      Estado: 'Activado',
      DniUsuarioMod: IdUsuario,
      UsuarioMod: Usuario,
    };

    return this.mipCaracteristicasService.guardar( bodyProocolo );
  }
  // ................................................................
  // ................................................................
  @Get('get-todos')
  @HttpCode(200)
  async getTodos() {
    return this.mipCaracteristicasService.getTodos();
  }
  // ................................................................
  // ................................................................
  @Get('get-by-id/:id')
  @HttpCode(200)
  async getbyId( @Param('id') id : number ) {
    return this.mipCaracteristicasService.getbyId( id );
  }
  // ................................................................
  // ................................................................
  @Patch('actualizar/:uuid')
  @HttpCode(200)
  async Actualizar( @Param('uuid') uuid : string, @Body() dto : UpdateMipCaracteristicaDto , @Req() req : Request ) {
    const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
    let headerToken = req.headers.authorization;
    let Usuario = '' , IdUsuario = 0;

    if( headerToken ){
      let arTOken = headerToken.split(' ');
      let dataT = await this.util.decodificaToken( arTOken[1] );
      if( dataT ){
        Usuario   = dataT['name'];
        IdUsuario = dataT['dni'];
      }
    }
    const bodyProocolo = {
      ...dto , 
      updated_at : createdAt , 
      DniUsuarioMod: IdUsuario,
      UsuarioMod: Usuario,
    };
    return this.mipCaracteristicasService.Actualizar( uuid , bodyProocolo);
  }
  // ................................................................
  // ................................................................
  @Delete('anular-by-id/:id')
  @HttpCode(200)
  async Anular( @Param('id') id  : number ) {
    return this.mipCaracteristicasService.AnularbyId( id );
  }
  // ................................................................
  // ................................................................
  // ................................................................
  // ................................................................
  // ................................................................
  // ................................................................
  // ................................................................
  // ................................................................
  // ................................................................
  // ................................................................
  // ................................................................
  // ................................................................
  // ................................................................
  // ................................................................
  // ................................................................
  // ................................................................
  // ................................................................
  // ................................................................
  // ................................................................
  // ................................................................
  // ................................................................
  // ................................................................
  // ................................................................
  // ................................................................
  // ................................................................
  // ................................................................
  // ................................................................
  // ................................................................
  // ................................................................
  // ................................................................
  // ................................................................
  // ................................................................
  // ................................................................
  // ................................................................
  // ................................................................
  @Post()
  @HttpCode(200)
  async create(@Body() dto : CreateMipCaracteristicaDto , @Req() req : Request ) {
    
    const createdAt = moment(  ).format('YYYY-MM-DD HH:mm:ss');
    let headerToken = req.headers.authorization;
    let Usuario = '' , IdUsuario = 0;

    if( headerToken ){
      let arTOken = headerToken.split(' ');
      let dataT = await this.util.decodificaToken( arTOken[1] );
      if( dataT ){
        Usuario   = dataT['name'];
        IdUsuario = dataT['dni'];
      }
    }

    const bodyProocolo = {
      ...dto , 
      created_at : createdAt , 
      updated_at : createdAt , 
    };

    return this.mipCaracteristicasService.create( bodyProocolo );
  }
  // ................................................................
  // ................................................................
  @Get()
  @HttpCode(200)
  findAll() {
    return this.mipCaracteristicasService.findAll();
  }
  // ................................................................
  // ................................................................
  @Get(':uuid')
  @HttpCode(200)
  findOne( @Param('uuid') uuid : string) {
    return this.mipCaracteristicasService.findOne( uuid );
  }
  // ................................................................
  // ................................................................
  @Patch(':uuid')
  @HttpCode(200)
  async update(@Param('uuid') uuid : string, @Body() dto: UpdateMipCaracteristicaDto , @Req() req : Request ) {
    const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
    let headerToken = req.headers.authorization;
    let Usuario = '' , IdUsuario = 0;

    if( headerToken ){
      let arTOken = headerToken.split(' ');
      let dataT = await this.util.decodificaToken( arTOken[1] );
      if( dataT ){
        Usuario   = dataT['name'];
        IdUsuario = dataT['dni'];
      }
    }
    const bodyProocolo = {
      ...dto , 
      updated_at : createdAt , 
      IdUsuario , Usuario 
    };
    return this.mipCaracteristicasService.update( uuid , bodyProocolo);
  }
  // ................................................................
  // ................................................................
  @Delete(':uuid')
  @HttpCode(200)
  remove(@Param('uuid') uuid : string) {
    return this.mipCaracteristicasService.remove( uuid );
  }
  // ................................................................
  // ................................................................
  // ................................................................
  // ................................................................
  // ................................................................
  // ................................................................
  // ................................................................





// ==================================================== ENVIAR UN COREO 
await sleep( 2000 ); // Wait for one second
      await this.util.varDump( `Fin espera...` );

      // archivos
      //let dataVideos = await this.archivosModel.getFilesbyToken_publicApp({ formulario : 'SOLICITUD-MANTENIMIENTO-VID' , correlativo : data.id });
      //let dataImgs   = await this.archivosModel.getFilesbyToken_publicApp({ formulario : 'SOLICITUD-MANTENIMIENTO-IMG' , correlativo : data.id });
      let Contenido = ``;
      let Destinatarios = `mantenimiento@ssays.com,supervisor.mantto@ssays.pe,asistente.mantenimiento@ssays.com.pe`;
      // Test
      //Destinatarios = `ddelacruz@ssays-orquesta.com,hgrados@ssays-orquesta.com,rrendon@ssays-orquesta.com`;
      let Asunto = `Solicitud atención maquina Nro ${data.Codigo} - ${data.Activo}`;
      Contenido += `
      <!--Welcome  Section Starts Here -->
      <table cellpadding="0" cellspacing="0" border="0" align="center" width="640" style="width: 640px; min-width: 640px;text-align:center;" bgcolor="#FFFFFF" role="presentation" class="table-container ">
        <tbody>
          <tr>
            <td style="color: #45535C; font-family: 'Lato', Arial, Helvetica, sans-serif; font-size: 26px; line-height: 26px;font-weight:bold;text-align: left;padding: 0 40px;">
              Solicitud de atención de mantenimiento Nro ${data.Codigo}.
            </td>
          </tr>
          <tr>
            <td align="center" style="color:#5a5a5a;text-align:left;padding:20px 40px 0 40px;font-family: 'Lato', Arial, Helvetica, sans-serif;font-weight:normal;font-size:16px;-webkit-font-smoothing:antialiased;line-height:1.4;">
              Buen día,
              El usuario: ${data.Supervisor} esta solicitando la atención siguiente:
              <br/>
              Activo : ${data.Activo}
              <br/>
              Nro.Placa/Etiq. : ${data.CodActivo}
              <br/>
              Cliente : ${data.Cliente}
              <br/>
              Sucursal : ${data.Sucursal}
              <br/>
              Dirección : ${data.Direccion}
              <br/>
              Fecha solicitud : ${data.FechaSolicitud}
              <br/>
              Comentarios de la falla de maquina : <br/>
              ${data.FallaMaquina}
            </td>
          </tr>
          <tr>
            <td height="10" style="line-height:10px;min-height:10px;">
            </td>
          </tr>
        </tbody>
      </table>
      `;
      // Supervisor
      let SuperData = await this.usersService.byDNI(`${data.IdSupervisor}`);
      let ConCopia = SuperData.email;
      //Test 
      //ConCopia = 'dany@delacruz.pe';
      // Adjunto¿?
      let attachments = [];
      let pathPhp = `${process.env.URL_PROYECTO}public/html/`;
      let Archivo = `SOLMA_${data.Codigo}.pdf`;
      let FullAdjunto = `${pathPhp}${Archivo}`;
      let buff = readFileSync(FullAdjunto);
      let base64data = buff.toString('base64');
      let ext = FullAdjunto
        .split('.')
        .filter(Boolean) // removes empty extensions (e.g. `filename...txt`)
        .slice(1)
        .join('.');
      let mimeType = `application/pdf`;
      let o = {
        name: `Solicitud-Atencion-${data.Codigo}-SSAYS-SAC.pdf`,
        type: mimeType,
        data: base64data
      };
      attachments.push(o);
      // Enviamos el correo...
      let MailProc = await this.EnvMail.guardar({
        Asunto: Asunto,
        Cuerpo: Contenido,
        Destinatarios: Destinatarios,
        ConCopia: ConCopia, TipoDoc: 'Sol-Mant', Adjuntos: o.name,
        Remitente: ConCopia
      }, Contenido);
      await this.EnvMail.EnviarCorreo2024(MailProc.uu_id, attachments);


**/


















// ===============================================================
// CONTROLADOR 2025
// ===============================================================
/**

import * as moment from 'moment';
import 'moment/locale/pt-br';
import { v4 as uuidv4 } from 'uuid';
import { JwtGuardGuard } from 'src/guard/jwt-guard/jwt-guard.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Request } from 'express';
import { UtilidadesService } from 'src/utilidades/utilidades.service';


// Para activar el auth JwTokenAuth
@UseGuards( JwtGuardGuard )

@ApiTags('Datos')
@ApiBearerAuth()
@UsePipes( new ValidationPipe )
  
**/

// ===============================================================
// SERVICE 2025
// ===============================================================

/**
 * 
 * 
import { readFileSync, writeFileSync } from 'fs';
const execShPromise = require("exec-sh").promise;

import * as moment from 'moment';
import 'moment/locale/pt-br';
import { v4 as uuidv4 } from 'uuid';

// ...................................................................
  // ...................................................................
  // ...................................................................
  // ...................................................................
  constructor(
    @InjectRepository( DatosModel )private readonly datosModel:Repository<DatosModel> ,
    private regEmple: RegistroEmpleadosService , 
    private util:UtilidadesService , 
  ){}
  // ...................................................................
  // ...................................................................
  // ...................................................................
  // ...................................................................
  // ...................................................................
  // ...................................................................
  // ...................................................................
  // ...................................................................
  // ...................................................................
  // ...................................................................
  // ...................................................................
  // ...................................................................
  // ...................................................................
  
  // ...................................................................
  // ...................................................................
  // ...................................................................
  // ...................................................................
  async maxId()
  {
    let MaxId = await this.areaModel.createQueryBuilder('areas').select("MAX(areas.CodArea)", "max").getRawOne();
    return MaxId.max + 1;
  }
  // ...................................................................
  // ...................................................................
  async buscaDescri( nombre :string )
  {
    let data = await this.areaModel.find({
      where : {
        Descripcion : nombre.trim()
      }
    });
    return data.length;
  }
  // ...................................................................
  // ...................................................................

-- FUERA DE LA CLASE



  // ...................................................................
  function varDump( e ){
    console.log( e );
  }
  // ...................................................................
/**/













