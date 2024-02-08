// Dxny DLC - 07/02/2023

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
    deleted_at : Date

    @Column()
    created_at : Date

    @Column()
    updated_at : Date





    @OneToOne( () => ClienteModel , (Cliente) => Cliente.dCliente10 )
    @JoinColumn({ name : 'IdClienteProv' , referencedColumnName : 'IdClienteProv' })
    dCliente10 : ClienteModel


    @OneToOne(() => SucursalModel , (photo) => photo.dLocal10 )
    @JoinColumn({ name : 'IdSucursal' , referencedColumnName : 'IdSucursal' })
    dLocal10 : SucursalModel

}


// ========================== DOT



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



// ======================================== CONTROLADOR


import * as moment from 'moment';
import 'moment/locale/pt-br';
import { v4 as uuidv4 } from 'uuid';
import { JwtGuardGuard } from 'src/guard/jwt-guard/jwt-guard.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Request } from 'express';
import { UtilidadesService } from 'src/utilidades/utilidades.service';




@ApiTags('Datos')
@ApiBearerAuth()
@UsePipes( new ValidationPipe )


constructor(
    private readonly datosService: DatosService , 
    private readonly util : UtilidadesService , 
  ) {}


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
      created_at : createdAt
    };

    return this.datosService.create( bodyProocolo );
  }







// ======================================== SERVICE


import { readFileSync, writeFileSync } from 'fs';
const execShPromise = require("exec-sh").promise;

import * as moment from 'moment';
import 'moment/locale/pt-br';
import { v4 as uuidv4 } from 'uuid';




// ...................................................................

  constructor(
    @InjectRepository( DatosModel )private readonly datosModel:Repository<DatosModel> ,
    private regEmple: RegistroEmpleadosService , 
    private util:UtilidadesService , 
  ){}

  // ...................................................................

  async create( dto : CreateDatoDto ) {
    
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
      version : '1'
    }

  }

  // ...................................................................

  async findAll() {
    
    let data = await this.datosModel.find({
      take : 200 ,
      order : {
        id : 'DESC'
      }
    });

    return {
      data , 
      version : '1'
    }

  }

  // ...................................................................

  async findOne( uuid : string ) {
    let data = await this.datosModel.findOne({
      where : {
        uu_id : uuid
      }
    });

    return {
      data , 
      version : '1'
    }
  }

  // ...................................................................

  async update( uuid : string , dto : UpdateDatoDto ) {
    
    await this.datosModel.update({ uu_id : uuid } , dto );

    let dataP = await this.datosModel.findOne({
      where : {
        uu_id : uuid
      }
    });

    return {
      data : dataP , 
      version : '1'
    }

  }

  // ...................................................................

  async remove( uuid : string ) {
    const updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');

    await this.datosModel.update({ uu_id : uuid } , { Estado : 'Anulado' , deleted_at : updatedAt , updated_at : updatedAt } );
    let data = await this.datosModel.findOne({
      where : {
        uu_id : uuid
      }
    });

    return {
      data , 
      version : '1'
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







// ======================================== CONTROLLER


import * as moment from 'moment';
import 'moment/locale/pt-br';
import { v4 as uuidv4 } from 'uuid';
import { JwtGuardGuard } from 'src/guard/jwt-guard/jwt-guard.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Request } from 'express';
import { UtilidadesService } from 'src/utilidades/utilidades.service';




@ApiTags('Datos')
@ApiBearerAuth()
@UsePipes( new ValidationPipe )



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
      created_at : createdAt
    };

    return this.datosService.create( bodyProocolo );
  }

  // ................................................................

  @Get()
  findAll() {
    return this.datosService.findAll();
  }

  // ................................................................

  @Get(':uuid')
  findOne( @Param('uuid') uuid : string) {
    return this.datosService.findOne( uuid );
  }

  // ................................................................

  @Patch(':uuid')
  update(@Param('uuid') uuid : string, @Body() updateDatoDto: UpdateDatoDto) {
    return this.datosService.update( uuid , updateDatoDto);
  }

  // ................................................................

  @Delete(':uuid')
  remove(@Param('uuid') uuid : string) {
    return this.datosService.remove( uuid );
  }

  // ................................................................








**/


























