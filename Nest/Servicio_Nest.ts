// =========================== TABLA
/*
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
exports     : [SupCronogramaService]




// ======================================== SERVICE


import { readFileSync, writeFileSync } from 'fs';
const execShPromise = require("exec-sh").promise;

import * as moment from 'moment';
import 'moment/locale/pt-br';
import { v4 as uuidv4 } from 'uuid';




  // ...................................................................
  // ...................................................................
  constructor(
    @InjectRepository( DatosModel )private readonly datosModel:Repository<DatosModel> ,
    private regEmple: RegistroEmpleadosService , 
    private util:UtilidadesService , 
  ){}

  // ...................................................................
  // ...................................................................
  async create( dto : CreateDatoDto ) {
    
    try {
      
      const newArea = await this.votoModel.create( dto );
      let dataSave  = await this.votoModel.save( newArea );
      //let Codigo = await this.util.addZeros( dataSave.id , 4 );
      //await this.datosModel.update({ id : dataSave.id },{ Codigo : `RM${Codigo}` });

      let data = await this.votoModel.findOne({
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
      
      throw new HttpException( error , HttpStatus.CONFLICT );

    }

  }
  // ...................................................................
  // ...................................................................
  async findAll() {
    
    try {
      
      let data = await this.votoModel.find({
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

      throw new HttpException( error , HttpStatus.CONFLICT );

    }

  }
  // ...................................................................
  // ...................................................................
  async findOne( uuid : string ) {
    try {

      let data = await this.votoModel.findOne({
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
      
      throw new HttpException( error , HttpStatus.CONFLICT );

    }
  }
  // ...................................................................
  // ...................................................................
  async update( uuID : string , dto : UpdateDatoDto ) {
    
    try {

      await this.votoModel.update({ uu_id : uuID } , dto );
      let dataP = await this.votoModel.findOne({
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

      throw new HttpException( error , HttpStatus.CONFLICT );
      
    }

  }
  // ...................................................................
  // ...................................................................
  async remove( uuID : string ) {
    try {

      const updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');

      await this.votoModel.update({ uu_id : uuid } , { deleted_at : updatedAt , updated_at : updatedAt } );
      let data = await this.votoModel.findOne({
        where : {
          uu_id : uuid
        }
      });

      return {
        data , 
        version : '1' , 
        msg : { titulo : 'Correcto' , texto : 'Registro anulado' , clase : 'success' , call : 'tostada2' }
      }
      
    } catch (error) {
      
      throw new HttpException( error , HttpStatus.CONFLICT );

    }
  }
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
    private readonly datosService: DatosService , 
    private readonly util : UtilidadesService , 
  ) {}

  // ................................................................

  @Post()
  @HttpCode(200)
  async create(@Body() dto : CreateDatoDto , @Req() req : Request ) {
    
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

    return this.datosService.create( bodyProocolo );
  }

  // ................................................................

  @Get()
  @HttpCode(200)
  findAll() {
    return this.datosService.findAll();
  }

  // ................................................................

  @Get(':uuid')
  @HttpCode(200)
  findOne( @Param('uuid') uuid : string) {
    return this.datosService.findOne( uuid );
  }

  // ................................................................

  @Patch(':uuid')
  @HttpCode(200)
  update(@Param('uuid') uuid : string, @Body() dot: UpdateDatoDto , @Req() req : Request ) {
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
    return this.datosService.update( uuid , bodyProocolo);
  }

  // ................................................................

  @Delete(':uuid')
  @HttpCode(200)
  remove(@Param('uuid') uuid : string) {
    return this.datosService.remove( uuid );
  }

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
  // ................................................................
  // ................................................................
  // ................................................................
  // private readonly util : UtilidadesService , 
  // ................................................................
  // ................................................................
  // ................................................................
  @Post('guardar')
  @HttpCode(200)
  async guardar(@Body() dto : CreateMipPlagaDto , @Req() req : Request ) {
    
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

    return this.mipPlagaService.guardar( bodyProocolo );
  }
  // ................................................................
  // ................................................................
  @Get('get-todos')
  @HttpCode(200)
  async getTodos() {
    return this.mipPlagaService.getTodos();
  }
  // ................................................................
  // ................................................................
  @Get('get-by-id/:id')
  @HttpCode(200)
  async getbyId( @Param('id') id : number ) {
    return this.mipPlagaService.getbyId( id );
  }
  // ................................................................
  // ................................................................
  @Patch('actualizar/:uuid')
  @HttpCode(200)
  async Actualizar( @Param('uuid') uuid : string, @Body() dto : UpdateMipPlagaDto , @Req() req : Request ) {
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
    return this.mipPlagaService.Actualizar( uuid , bodyProocolo);
  }
  // ................................................................
  // ................................................................
  @Delete('anular-by-id/:id')
  @HttpCode(200)
  async Anular( @Param('id') id  : number ) {
    return this.mipPlagaService.AnularbyId( id );
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
  async guardar( dto : CreateMipPlagaDto ) {
    
    try {

      //Comprobar si el codigo ya existe
      const mipPlagaInit = await this.mipPlagaModel.findOne({
        where: {
          Codigo: dto.Codigo
        }
      });

      if (mipPlagaInit) throw new HttpException('El código ya existe', HttpStatus.CONFLICT);
      
      const newArea = await this.mipPlagaModel.create( dto );
      let dataSave  = await this.mipPlagaModel.save( newArea );
      //let Codigo = await this.util.addZeros( dataSave.id , 4 );
      //await this.datosModel.update({ id : dataSave.id },{ Codigo : `RM${Codigo}` });

      let data = await this.mipPlagaModel.findOne({
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
      
      throw new HttpException( error , HttpStatus.CONFLICT );

    }

  }
  // ...................................................................
  // ...................................................................
  async getTodos() {
    
    try {
      
      let data = await this.mipPlagaModel.find({
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

      throw new HttpException( error , HttpStatus.CONFLICT );

    }

  }
  // ...................................................................
  // ...................................................................
  async getbyId( id : number ) {
    try {

      let data = await this.mipPlagaModel.findOne({
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
      
      throw new HttpException( error , HttpStatus.CONFLICT );

    }
  }
  // ...................................................................
  // ...................................................................
  async Actualizar( uuID : string , dto : UpdateMipPlagaDto ) {
    
    try {

      await this.mipPlagaModel.update({ uu_id : uuID } , dto );
      let dataP = await this.mipPlagaModel.findOne({
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

      throw new HttpException( error , HttpStatus.CONFLICT );
      
    }

  }
  // ...................................................................
  // ...................................................................
  async AnularbyId( id : number ) {
    try {

      const updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');

      await this.mipPlagaModel.update({ id } , { Estado : 'Desactivado' , deleted_at : updatedAt , updated_at : updatedAt } );
      let data = await this.mipPlagaModel.findOne({
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













