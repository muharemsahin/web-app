import { Body, Controller, Post, Req} from "@nestjs/common";
import { LoginAdministratorDto } from "src/dtos/administrator/login.administrator.dto";
import { ApiResponse } from "src/misc/api.responose.class";
import { AdministratorService } from "src/services/administrator/administrator.service";
import * as crypto from "crypto";
import { LoginInfoAdministratorDto } from "src/dtos/administrator/login.info.administrator.dto";
import * as jwt from "jsonwebtoken";
import { JwtDataAdministratorDto } from "src/dtos/administrator/jwt.data.administrator.dto";
import {Request} from "express";
import { jwtSecret } from "config/jwt.secret";

@Controller("auth")
export class AuthController{
    constructor(public administratorService: AdministratorService) { }

    @Post('login') //http:://localhost:300/auth/login/
  async  doLogin(@Body() data: LoginAdministratorDto, @Req() req: Request):Promise<LoginInfoAdministratorDto | ApiResponse>{
        //ovo je obecanje da je dostavljen admin
        const administrator = await this.administratorService.getByUsername(data.username);

        if(!administrator){
                return new Promise(resolve => resolve(new ApiResponse("error", -3001)));
        }

        const  passwordHash  = crypto.createHash("sha512");
        passwordHash.update(data.password);
        const passwordHashString = passwordHash.digest("hex").toUpperCase();

        if(administrator.passwordHash !== passwordHashString){
            return new Promise(resolve => resolve(new ApiResponse("error", -3002)));
        }

        //vratiti informacije o uspjesnom logovanju

        //administratorId
        //username
        //token(JWT) su specijalna vrsta stringa  koji je sifrovan tajnim kodom
        //tajna sifrova
        //JSON = { administratorId, username, exp, ip, ua}
        //  sifrovanje (tajna sifrea ->json) -sifra bianrni ->HEX
        //hex string
         const jwtData = new JwtDataAdministratorDto();
         jwtData.administratorId = administrator.administratorId;
         jwtData.username = administrator.username;
         

         let sada = new Date();
         sada.setDate(sada.getDate() + 14);
         const istekTimestamp = sada.getTime() / 1000;
         jwtData.ext = istekTimestamp;

         jwtData.ip =  req.ip.toString();
         jwtData.ua = req.headers["user-agent"];

        let token: string = jwt.sign(jwtData.toPlainObject(), jwtSecret);



        const responoseObject = new LoginInfoAdministratorDto(
            administrator.administratorId,
            administrator.username,
            token
        )

        return new Promise(resolve => resolve(responoseObject));
    }
}