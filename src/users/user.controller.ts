import { Controller, Get, Post, Put, Delete, Body, Headers, Param, Header } from '@nestjs/common';
import { UserService } from './user.services';
import { userLoginDTO, userRegistrationDTO } from './usersModel/userDTO';

@Controller('users')
export class UsersController {
    constructor(private readonly userService : UserService){}

////////////////////////////////
//////////////
    @Post('register')
    async registerUser(
        @Body() user : userRegistrationDTO
        )
    {
        return await this.userService.insertUser(user.name, user.firstName, user.password, user.phone, user.email);
    }

    @Post('log-in')
    async login(
        @Body() user : userLoginDTO
    ){
        return await this.userService.authenticate(user.email,user.password);
    }

    @Post('log-out')
    async logout(
        @Headers() header
    ){
        const id = header.id;
        const token = header.token;
        if(id === undefined || token === undefined){
            return ({
                'message' : 'lack of privileges or invalid parameter',
                'code' : false
            })
        }
        return await this.userService.logout(id, token);
    }
//////////////
///////////////////////////////
////////////////////////////////
//////////////
    @Post('modpas')
    async modifyPassword(
        @Headers() header,
        @Body('password') password : string
    ){
        const id = header.id;
        const token = header.token;
        if(id === undefined || token === undefined || password === undefined){
            return ({
                'message' : 'lack of privileges or invalid parameter',
                'code' : false
            })
        }
        return await this.userService.changePassword(id, token, password);
    }

    @Post('modname')
    async modifyName(
        @Headers() header,
        @Body('Name') newName : string
    ){
        const id = header.id;
        const token = header.token;
        if(id === undefined || token === undefined || newName === undefined){
            return ({
                'message' : 'lack of privileges or invalid parameter',
                'code' : false
            })
        }
        return await this.userService.changeName(id, token,newName);
    }

    @Post('modfname')
    async modifyFName(
        @Headers() header,
        @Body('fName') newFName : string
    ){
        const id = header.id;
        const token = header.token;
        if(id === undefined || token === undefined || newFName === undefined){
            return ({
                'message' : 'lack of privileges or invalid parameter',
                'code' : false
            })
        }
        return await this.userService.changeFirstname(id, token,newFName);
    }

    @Post('modemail')
    async modifyMail(
        @Headers() header,
        @Body('mail') newMail : string
    ){
        const id = header.id;
        const token = header.token;
        if(id === undefined || token === undefined || newMail === undefined){
            return ({
                'message' : 'lack of privileges or invalid parameter',
                'code' : false
            })
        }
        return await this.userService.changeEmail(id, token, newMail);
    }

    @Post('modtel')
    async modifyTel(
        @Headers() header,
        @Body('tel') newTel : string
    ){
        const id = header.id;
        const token = header.token;
        if(id === undefined || token === undefined || newTel === undefined){
            return ({
                'message' : 'lack of privileges or invalid parameter',
                'code' : false
            })
        }
        return await this.userService.changePhone(id, token, newTel);
    }

    @Post('activate')
    async activeAccount(
        @Body('tel') hphone : string,
        @Body('validationToken') htoken : string
    ){
        const phone = hphone;
        const token = htoken;
        if(phone === undefined || token === undefined){
            return ({
                'message' : 'lack of privileges or invalid parameter',
                'code' : false
            })
        }
        return await this.userService.activeAccount(phone, token);
    }
//////////////
///////////////////////////////
    @Get()
    async find() {
       const list = await this.userService.getUsers();
       return list;
    }

    @Get('/:id')
    async findById(@Param('id') id  : string) {
       const user = await this.userService.findUserMainInfo(id);
       return user;
    }
}