import { Body, Controller, Get, Header, Headers, Post } from "@nestjs/common";
import { UserService } from "src/users/user.services";
import { OpsService } from "./ops.services";

@Controller('ops')
export class OpsController{
    constructor(
        private readonly opsService : OpsService,
        private readonly userService : UserService
        ){
    }

    @Post('perform')
    async performOps(
        @Body('amount') amount : number,
        @Body('receiver') receiver : string,
        @Headers() head
    ){
        const result = await this.opsService.insertNewOp(receiver,head.id,head.token,amount);
        return result;
    }

    @Get('all')
    async getAll(@Headers()  head){
        if(head.id === undefined || head.id === '' || head.token === undefined || head.token === ''){
            return ({
                'message' : 'Manque de privilèges',
                'state' : false
            });
        }else{
            const result0 = await this.userService.isAuthorized(head.id, head.token);
            if(result0.state){
                const result = await this.opsService.getOpsInvolvedById(head.id);
                return result;
            }else{
                return ({
                    'message' : 'Manque de privilèges',
                    'state' : false
                });
            }
        }
        
    }

    @Get('sent')
    async getSentOps(@Headers() head){
        if(head.id === undefined || head.id === '' || head.token === undefined || head.token === ''){
            return ({
                'message' : 'Manque de privilèges',
                'state' : false
            });
        }else{
            const result0 = await this.userService.isAuthorized(head.id, head.token);
            if(result0.state){
                const result = await this.opsService.getOpsSentById(head.id);
                return result;
            }else{
                return ({
                    'message' : 'Manque de privilèges',
                    'state' : false
                });
            }
        }
    }

    @Get('rec')
    async getReceivedOps(@Headers() head){
        if(head.id === undefined || head.id === '' || head.token === undefined || head.token === ''){
            return ({
                'message' : 'Manque de privilèges',
                'state' : false
            });
        }else{
            const result0 = await this.userService.isAuthorized(head.id, head.token);
            if(result0.state){
                const result = await this.opsService.getOpsReceivedById(head.id);
                return result;
            }else{
                return ({
                    'message' : 'Manque de privilèges',
                    'state' : false
                });
            }
        }
    }
}