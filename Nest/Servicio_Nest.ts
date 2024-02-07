// Dxny DLC - 07/02/2023

// ========================== DOT

/**

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



















**/


























