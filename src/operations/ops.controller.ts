import { Body, Controller, Get, Header, Headers, Post } from "@nestjs/common";
import { OpsService } from "./ops.services";

@Controller('ops')
export class OpsController{
    constructor(
        private readonly opsService : OpsService,
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
}