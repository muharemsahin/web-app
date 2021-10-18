import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { Administrator } from "entities/administrator.entity";
import { AddAdministratorDto } from "src/dtos/administrator/add.administrator.dto";
import { EditAdminAdministratorDto } from "src/dtos/administrator/edit.administrator.dto";
import { ApiResponse } from "src/misc/api.responose.class";
import { AdministratorService } from "src/services/administrator/administrator.service";

@Controller('api/administrator')
export class AdministratorController{
    constructor(
        private administratorService: AdministratorService
        ) {}

        @Get()
        getAll(): Promise<Administrator[]>{
          return this.administratorService.getAll();
        }
        // get http:://localhost:3000/api/administrator/4/
        @Get(':id')
        getById(@Param('id') administratorId: number): Promise<Administrator | ApiResponse>{
          return new Promise(async(resolve) =>{
            let admin = await this.administratorService.getById(administratorId);
              
            if(admin === undefined){
                resolve(new ApiResponse("error", -1002));
              }

              resolve(admin);
          })
          
        }
        // put http:://localhost:3000/api/administrator/
        @Put()
        add(@Body() data: AddAdministratorDto ): Promise<Administrator | ApiResponse>{
            return this.administratorService.add(data);
        }

         // post http:://localhost:3000/api/administrator/4/
         @Post(':id')
         edit(@Param('id') id: number, @Body() data: EditAdminAdministratorDto): Promise<Administrator | ApiResponse>{
             return this.administratorService.editById(id,data);
         }
}