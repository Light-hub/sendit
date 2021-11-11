import { Headers, Injectable } from "@nestjs/common";
import { OpsService } from "src/operations/ops.services";
import { UserService } from "src/users/user.services";

@Injectable()
export class AdminService{
    constructor(
         private readonly userService : UserService,
         private readonly opsService : OpsService){
    }

    async authenticate(hemail : string, hpassword : string){
        const result = await this.userService.authenticate(hemail,hpassword);
        if(result.found === false){
            return result;
        }else{
            const result1 = await this.userService.isAdmin(result.id, result.token);
            if(result1.code === false){
                const result3 = await this.userService.logout(result.id, result.token);
                return ({
                    'message' : 'Privilège manquant',
                    'access' : 'denied',
                    'state' : false
                });
            }else{
                const token = await this.userService.generateAdminToken(result.id);
                return ({
                    'message' : 'Connechhté, veuillez à ne pas divulguer votre token, ni votre ID',
                    'found' : true,
                    'id' : result.id,
                    'token' : token
                });
            } 
        }
    }

    async hasAdminPriv(hid : string, htoken : string){
        const result = await this.userService.isAuthorized(hid,htoken);
        const result1 = await this.userService.isAdmin(hid,htoken);

        if(result1.code === false || result.state === false){
            return ({
                'state' : false
            });
        }else{
           return ({
               'state' : true
           }) 
        }
    }

    async logout(hid : string, htoken : string){
        const result = await this.hasAdminPriv(hid, htoken);
        if(!result.state){
            return ({
                'message' : 'Privilège manquant',
                'access' : 'denied',
                'state' : false
            })
        }else{
            const result2 = await this.userService.logout(hid,htoken);
            return result2;  
        }
    }

    async getAllUsers(hid : string, htoken : string){
        const result = await this.hasAdminPriv(hid, htoken);
        if(!result.state){
            return ({
                'message' : 'Privilège manquant',
                'access' : 'denied',
                'state' : false
            });
        }else{
            const list = await this.userService.getUsers();
            return list;
        }
    }

    async findUserMainInfo(hid : string, htoken : string, uid : string){
        const result = await this.hasAdminPriv(hid, htoken);
        if(result.state === false){
            return ({
                'message' : 'Impossible de faire cette action',
                'state' : false
            })
        }else{
            const res = await this.userService.findUserMainInfo(uid);
            return res;
        }
    }

    async findUserMainInfoByTel(hid : string, htoken : string, htel : string){
        const result = await this.hasAdminPriv(hid, htoken);
        if(result.state === false){
            return ({
                'message' : 'Impossible de faire cette action',
                'state' : false
            })
        }else{
            const res = await this.userService.findUserMainInfoByTel(htel);
            return await this.userService.findUserMainInfo(res.id);
        }
    }

    async changePassword(hid : string, htoken : string, newPass : string){
        const result = await this.hasAdminPriv(hid, htoken);
        if(result.state === false){
            return ({
                'message' : 'Impossible de faire cette action',
                'state' : false
            })
        }else{
            const res = await this.userService.changePassword(hid, htoken, newPass);
            return res;
        }
    }

    async changePhone(hid : string, htoken : string, newTel : string){
        const result = await this.hasAdminPriv(hid, htoken);
        if(result.state === false){
            return ({
                'message' : 'Impossible de faire cette action',
                'state' : false
            })
        }else{
            const res = await this.userService.changePhone(hid, htoken, newTel);
            return res;
        }
    }

    async changeEmail(hid : string, htoken : string, newEmail : string){
        const result = await this.hasAdminPriv(hid, htoken);
        if(result.state === false){
            return ({
                'message' : 'Impossible de faire cette action',
                'state' : false
            })
        }else{
            const res = await this.userService.changeEmail(hid, htoken, newEmail);
            return res;
        }
    }

    async changeName(hid : string, htoken : string, newName : string){
        const result = await this.hasAdminPriv(hid, htoken);
        if(result.state === false){
            return ({
                'message' : 'Impossible de faire cette action',
                'state' : false
            })
        }else{
            const res = await this.userService.changeName(hid, htoken, newName);
            return res;
        }
    }

    async changeFirstname(hid : string, htoken : string, newFName : string){
        const result = await this.hasAdminPriv(hid, htoken);
        if(result.state === false){
            return ({
                'message' : 'Impossible de faire cette action',
                'state' : false
            })
        }else{
            const res = await this.userService.changeFirstname(hid, htoken, newFName);
            return res;
        }
    }

    async activeAccount(tel : string, validationToken : string){
        const result = await this.userService.activeAccount(tel, validationToken);

        return result;
    }

    async deactiveAccount(hid : string, htoken : string, huid : string){
        const result = await this.hasAdminPriv(hid, htoken);
        if(result.state === false){
            return ({
                'message' : 'Impossible de faire cette action',
                'state' : false
            })
        }else{
            const res = await this.userService.desactiveAccount(huid);
            return res;
        }
    }

    async getAllOps(hid : string, htoken : string){
        const result = await this.hasAdminPriv(hid, htoken);
        if(result.state === false){
            return ({
                'message' : 'Impossible de faire cette action',
                'state' : false
            })
        }else{
            const res = await this.opsService.showAllOps();
            return res;
        }
    }

    async getOps(hid : string, htoken : string, oid : string){
        const result = await this.hasAdminPriv(hid, htoken);
        if(result.state === false){
            return ({
                'message' : 'Impossible de faire cette action',
                'state' : false
            })
        }else{
            const res = await this.opsService.getOps(oid);
            return res;
        }
    }

    async getOpsSentById(hid : string, htoken : string, sid : string){
        const result = await this.hasAdminPriv(hid, htoken);
        if(result.state === false){
            return ({
                'message' : 'Impossible de faire cette action',
                'state' : false
            })
        }else{
            const res = await this.opsService.getOpsSentById(sid);
            return res;
        }
    }

    async getOpsReceivedById(hid : string, htoken : string, rid : string){
        const result = await this.hasAdminPriv(hid, htoken);
        if(result.state === false){
            return ({
                'message' : 'Impossible de faire cette action',
                'state' : false
            })
        }else{
            const res = await this.opsService.getOpsReceivedById(rid);
            return res;
        }
    }

    async getOpsInvolvedById(hid : string, htoken : string, id : string){
        const result = await this.hasAdminPriv(hid, htoken);
        if(result.state === false){
            return ({
                'message' : 'Impossible de faire cette action',
                'state' : false
            })
        }else{
            const res = await this.opsService.getOpsInvolvedById(id);
            return res;
        }
    }

    async getOpsSentByTel(hid : string, htoken : string, stel : string){
        const result = await this.hasAdminPriv(hid, htoken);
        if(result.state === false){
            return ({
                'message' : 'Impossible de faire cette action',
                'state' : false
            })
        }else{
            const res = await this.opsService.getOpsSentByTel(stel);
            return res;
        }
    }

    async getOpsReceivedByTel(hid : string, htoken : string, rtel : string){
        const result = await this.hasAdminPriv(hid, htoken);
        if(result.state === false){
            return ({
                'message' : 'Impossible de faire cette action',
                'state' : false
            })
        }else{
            const res = await this.opsService.getOpsReceivedByTel(rtel);
            return res;
        }
    }

    async getOpsInvolvedByTel(hid : string, htoken : string, tel : string){
        const result = await this.hasAdminPriv(hid, htoken);
        if(result.state === false){
            return ({
                'message' : 'Impossible de faire cette action',
                'state' : false
            })
        }else{
            const res = await this.opsService.getOpsInvolvedByTel(tel);
            return res;
        }
    }

    async getOpsSortByAmountInfTo(hid : string, htoken : string, amount : number){
        const result = await this.hasAdminPriv(hid, htoken);
        if(result.state === false){
            return ({
                'message' : 'Impossible de faire cette action',
                'state' : false
            })
        }else{
            const res = await this.opsService.getOpsSortByAmountInfTo(amount);
            return res;
        } 
    }

    async getOpsSortByAmountInfOrEqualTo(hid : string, htoken : string, amount : number){
        const result = await this.hasAdminPriv(hid, htoken);
        if(result.state === false){
            return ({
                'message' : 'Impossible de faire cette action',
                'state' : false
            })
        }else{
            const res = await this.opsService.getOpsSortByAmountInfOrEqualTo(amount);
            return res;
        } 
    }

    async getOpsSortByAmountSupTo(hid : string, htoken : string, amount : number){
        const result = await this.hasAdminPriv(hid, htoken);
        if(result.state === false){
            return ({
                'message' : 'Impossible de faire cette action',
                'state' : false
            })
        }else{
            const res = await this.opsService.getOpsSortByAmountSupTo(amount);
            return res;
        } 
    }

    async getOpsSortByAmountSupOrEqualTo(hid : string, htoken : string, amount : number){
        const result = await this.hasAdminPriv(hid, htoken);
        if(result.state === false){
            return ({
                'message' : 'Impossible de faire cette action',
                'state' : false
            })
        }else{
            const res = await this.opsService.getOpsSortByAmountSupOrEqualTo(amount);
            return res;
        } 
    }

    async getOpsSortByAmountEqualTo(hid : string, htoken : string, amount : number){
        const result = await this.hasAdminPriv(hid, htoken);
        if(result.state === false){
            return ({
                'message' : 'Impossible de faire cette action',
                'state' : false
            })
        }else{
            const res = await this.opsService.getOpsSortByAmountEqualTo(amount);
            return res;
        } 
    }

}