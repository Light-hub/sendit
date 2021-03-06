import { Body, Controller, Get, Headers, Param, Post, Put } from "@nestjs/common";
import { userLoginDTO, userRegistrationDTO } from "src/users/usersModel/userDTO";
import { AdminService } from "./admin.service";


@Controller('admin')
export class AdminController{

    constructor(
        private readonly adminService : AdminService){
    }
///////////////////////////////////////////////
//////////////////////////

    @Post('log-in')
    async login(
        @Body() user : userLoginDTO
    ){
        const result = await this.adminService.authenticate(user.email,user.password);
        return result;
    }

    @Put('register')
    async register(@Headers() head,
                    @Body() user : userRegistrationDTO)
    {
        const id = head.id;
        const token = head.token;

        const result = await this.adminService.insertAdminUser(user.name, user.firstName, user.password, user.phone, user.email, id, token);
        return result;
    }

    @Post('log-out')
    async signin(@Headers() head){
        const id = head.id;
        const token = head.token;

        const result = await this.adminService.logout(id, token);
        return result;
    }

    @Post('desactiv')
    async desactive(@Headers() head, 
    @Body('idUser') idUSer : string){
        const id = head.id;
        const token = head.token;

        const result = await this.adminService.deactiveAccount(id, token, idUSer);
        return result;
    }

    @Get('users')
    async usersInfo(@Headers() head){
        const id = head.id;
        const token = head.token;

        if(id === undefined || token === undefined){
            return ({
                'message' : 'lack of privileges',
                'code' : false
            })
        }else{
            const result = await this.adminService.getAllUsers(id, token);
            return result;
        }   
    }

    @Get('users/:id')
    async userInfo(
        @Param('id') hid : string,
        @Headers() head){
            const id = head.id;
            const token = head.token;
    
            if(id === undefined || token === undefined 
                || hid === undefined || hid.length !== 24){
                return ({
                    'message' : 'lack of privileges or invalid parameter',
                    'code' : false
                })
            }else{
                const result = await this.adminService.findUserMainInfo(id, token,hid);
                return result;
            }     
    }

    @Get('users/t/:tel')
    async userInfoByTel(
        @Param('tel') htel : string,
        @Headers() head){
            const id = head.id;
            const token = head.token;
    
            if(id === undefined || token === undefined || 
                htel === undefined || htel.length > 14 || htel.length < 10){
                return ({
                    'message' : 'lack of privileges or invalid parameter',
                    'code' : false
                })
            }else{
                const result = await this.adminService.findUserMainInfoByTel(id, token,htel);
                return result;
            }     
    }

//////////////////////////
///////////////////////////////////////////////

///////////////////////////////////////////////
//////////////////////////

    @Get('ops/done')
    async getDoneOps(@Headers() head){
        const id = head.id;
        const token = head.token;

        if(id === undefined || token === undefined){
            return ({
                'message' : 'lack of privileges',
                'code' : false
            })
        }else{
            const result = await this.adminService.getTerminatedOps(id, token);
            return result;
        }   
    }

    @Get('ops/done/sent/:id')
    async opsTermSentById(
        @Param('id') sid : string,
        @Headers() head){
        const id = head.id;
        const token = head.token;

        if(id === undefined || token === undefined 
            || sid === undefined || sid.length !== 24){
            return ({
                'message' : 'lack of privileges or invalid parameter',
                'code' : false
            })
        }else{
            const result = await this.adminService.getTerminatedOpsSentById(id, token, sid);
            return result;
        }   
    }

    @Get('ops/done/received/:id')
    async opsTermReceivedById(
        @Param('id') rid : string,
        @Headers() head){
        const id = head.id;
        const token = head.token;

        if(id === undefined || token === undefined 
            || rid === undefined || rid.length !== 24){
            return ({
                'message' : 'lack of privileges or invalid parameter',
                'code' : false
            })
        }else{
            const result = await this.adminService.getTerminatedOpsReceivedById(id, token, rid);
            return result;
        }   
    }

    @Get('ops/done/received/t/:tel')
    async opsTermReceivedByTel(
        @Param('tel') rtel : string,
        @Headers() head){
        const id = head.id;
        const token = head.token;

        if(id === undefined || token === undefined 
            || rtel === undefined || rtel.length < 10 || rtel.length > 14){
            return ({
                'message' : 'lack of privileges or invalid parameter',
                'code' : false
            })
        }else{
            const result = await this.adminService.getTerminatedOpsReceivedByTel(id, token, rtel);
            return result;
        }   
    }

    @Get('ops/done/sent/t/:tel')
    async opsTermSentByTel(
        @Param('tel') stel : string,
        @Headers() head){
        const id = head.id;
        const token = head.token;

        if(id === undefined || token === undefined 
            || stel === undefined || stel.length < 10 || stel.length > 14){
            return ({
                'message' : 'lack of privileges or invalid parameter',
                'code' : false
            })
        }else{
            const result = await this.adminService.getTerminatedOpsSentByTel(id, token, stel);
            return result;
        }   
    }

/////////////////////////
////////////////////////

    @Get('ops/pending')
    async getPendingOps(@Headers() head){
        const id = head.id;
        const token = head.token;

        if(id === undefined || token === undefined){
            return ({
                'message' : 'lack of privileges',
                'code' : false
            })
        }else{
            const result = await this.adminService.getPendingOps(id, token);
            return result;
        }   
    }

    @Get('ops/pending/sent/:id')
    async opsPendingSentById(
        @Param('id') sid : string,
        @Headers() head){
        const id = head.id;
        const token = head.token;

        if(id === undefined || token === undefined 
            || sid === undefined || sid.length !== 24){
            return ({
                'message' : 'lack of privileges or invalid parameter',
                'code' : false
            })
        }else{
            const result = await this.adminService.getPendingOpsSentById(id, token, sid);
            return result;
        }   
    }

    @Get('ops/pending/received/:id')
    async opsPendingReceivedById(
        @Param('id') rid : string,
        @Headers() head){
        const id = head.id;
        const token = head.token;

        if(id === undefined || token === undefined 
            || rid === undefined || rid.length !== 24){
            return ({
                'message' : 'lack of privileges or invalid parameter',
                'code' : false
            })
        }else{
            const result = await this.adminService.getPendingOpsReceivedById(id, token, rid);
            return result;
        }   
    }

    @Get('ops/pending/sent/t/:tel')
    async opsPendingSentByTel(
        @Param('tel') stel : string,
        @Headers() head){
        const id = head.id;
        const token = head.token;

        if(id === undefined || token === undefined 
            || stel === undefined || stel.length < 10 || stel.length > 14){
            return ({
                'message' : 'lack of privileges or invalid parameter',
                'code' : false
            })
        }else{
            const result = await this.adminService.getPendingOpsSentByTel(id, token, stel);
            return result;
        }   
    }

    @Get('ops/pending/received/t/:tel')
    async opsPendingReceivedByTel(
        @Param('tel') rtel : string,
        @Headers() head){
        const id = head.id;
        const token = head.token;

        if(id === undefined || token === undefined 
            || rtel === undefined || rtel.length < 10 || rtel.length > 14){
            return ({
                'message' : 'lack of privileges or invalid parameter',
                'code' : false
            })
        }else{
            const result = await this.adminService.getPendingOpsReceivedByTel(id, token, rtel);
            return result;
        }   
    }


/////////////////////////
////////////////////////

    @Get('ops')
    async opsInfo(@Headers() head){
        const id = head.id;
        const token = head.token;

        if(id === undefined || token === undefined){
            return ({
                'message' : 'lack of privileges',
                'code' : false
            })
        }else{
            const result = await this.adminService.getAllOps(id, token);
            return result;
        }   
    }

    @Get('ops/:id')
    async opInfo(
        @Param('id') hid : string,
        @Headers() head){
        const id = head.id;
        const token = head.token;

        if(id === undefined || token === undefined 
            || hid === undefined || hid.length !== 24){
            return ({
                'message' : 'lack of privileges or invalid parameter',
                'code' : false
            })
        }else{
            const result = await this.adminService.getOpsById(id, token, hid);
            return result;
        }   
    }

    @Get('ops/ts/:tel')
    async opsInfoSentByTel(
        @Param('tel') stel : string,
        @Headers() head){
        const id = head.id;
        const token = head.token;

        if(id === undefined || token === undefined 
            || stel === undefined || stel.length < 10 || stel.length >14){
            return ({
                'message' : 'lack of privileges or invalid parameter',
                'code' : false
            })
        }else{
            const result = await this.adminService.getOpsSentByTel(id, token, stel);
            return result;
        }   
    }

    @Get('ops/tr/:tel')
    async opsInfoReceivedByTel(
        @Param('tel') rtel : string,
        @Headers() head){
        const id = head.id;
        const token = head.token;

        if(id === undefined || token === undefined 
            || rtel === undefined || rtel.length < 10 || rtel.length >14){
            return ({
                'message' : 'lack of privileges or invalid parameter',
                'code' : false
            })
        }else{
            const result = await this.adminService.getOpsReceivedByTel(id, token, rtel);
            return result;
        }   
    }

    @Get('ops/t/:tel')
    async opsInfoInvolvedByTel(
        @Param('tel') tel : string,
        @Headers() head){
        const id = head.id;
        const token = head.token;

        if(id === undefined || token === undefined 
            || tel === undefined || tel.length < 10 || tel.length >14){
            return ({
                'message' : 'lack of privileges or invalid parameter',
                'code' : false
            })
        }else{
            const result = await this.adminService.getOpsInvolvedByTel(id, token, tel);
            return result;
        }   
    }

    @Get('ops/is/:id')
    async opsInfoSentById(
        @Param('id') sid : string,
        @Headers() head){
        const id = head.id;
        const token = head.token;

        if(id === undefined || token === undefined 
            || sid === undefined || sid.length !== 24){
            return ({
                'message' : 'lack of privileges or invalid parameter',
                'code' : false
            })
        }else{
            const result = await this.adminService.getOpsSentById(id, token, sid);
            return result;
        }   
    }

    @Get('ops/ir/:id')
    async opsInfoReceivedById(
        @Param('id') rid : string,
        @Headers() head){
        const id = head.id;
        const token = head.token;

        if(id === undefined || token === undefined 
            || rid === undefined || rid.length !== 24){
            return ({
                'message' : 'lack of privileges or invalid parameter',
                'code' : false
            })
        }else{
            const result = await this.adminService.getOpsReceivedById(id, token, rid);
            return result;
        }   
    }

    @Get('ops/i/:id')
    async opsInfoInvolvedById(
        @Param('id') uid : string,
        @Headers() head){
        const id = head.id;
        const token = head.token;

        if(id === undefined || token === undefined 
            || uid === undefined || uid.length !== 24){
            return ({
                'message' : 'lack of privileges or invalid parameter',
                'code' : false
            })
        }else{
            const result = await this.adminService.getOpsInvolvedById(id, token, uid);
            return result;
        }   
    }

/////////////////////////
/////////////////////////

    @Get('ops/sort/inf/:amount')
    async opsInfoSortByAmountInf(
        @Param('amount') amount : number,
        @Headers() head){
        const id = head.id;
        const token = head.token;

        if(id === undefined || token === undefined 
            || amount === undefined || amount <= 0){
            return ({
                'message' : 'lack of privileges or invalid parameter',
                'code' : false
            })
        }else{
            const result = await this.adminService.getOpsSortByAmountInfTo(id, token, amount);
            return result;
        }   
    }

    @Get('ops/sort/infoe/:amount')
    async opsInfoSortByAmountInfOrEqual(
        @Param('amount') amount : number,
        @Headers() head){
        const id = head.id;
        const token = head.token;

        if(id === undefined || token === undefined 
            || amount === undefined || amount <= 0){
            return ({
                'message' : 'lack of privileges or invalid parameter',
                'code' : false
            })
        }else{
            const result = await this.adminService.getOpsSortByAmountInfOrEqualTo(id, token, amount);
            return result;
        }   
    }

    @Get('ops/sort/sup/:amount')
    async opsInfoSortByAmountSup(
        @Param('amount') amount : number,
        @Headers() head){
        const id = head.id;
        const token = head.token;

        if(id === undefined || token === undefined 
            || amount === undefined || amount <= 0){
            return ({
                'message' : 'lack of privileges or invalid parameter',
                'code' : false
            })
        }else{
            const result = await this.adminService.getOpsSortByAmountSupTo(id, token, amount);
            return result;
        }   
    }

    @Get('ops/sort/supoe/:amount')
    async opsInfoSortByAmountSupOrEqual(
        @Param('amount') amount : number,
        @Headers() head){
        const id = head.id;
        const token = head.token;

        if(id === undefined || token === undefined 
            || amount === undefined || amount <= 0){
            return ({
                'message' : 'lack of privileges or invalid parameter',
                'code' : false
            })
        }else{
            const result = await this.adminService.getOpsSortByAmountSupOrEqualTo(id, token, amount);
            return result;
        }   
    }

    @Get('ops/sort/eq/:amount')
    async opsInfoSortByAmountEqual(
        @Param('amount') amount : number,
        @Headers() head){
        const id = head.id;
        const token = head.token;

        if(id === undefined || token === undefined 
            || amount === undefined || amount <= 0){
            return ({
                'message' : 'lack of privileges or invalid parameter',
                'code' : false
            })
        }else{
            const result = await this.adminService.getOpsSortByAmountEqualTo(id, token, amount);
            return result;
        }   
    }

/////////////////////////
/////////////////////////////////////////////////////////////

}