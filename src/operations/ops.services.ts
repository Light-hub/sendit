import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserService } from "src/users/user.services";
import { Operation } from "./model/ops.model";

@Injectable()
export class OpsService{
    constructor(
        @InjectModel('Operation') private readonly opsModel : Model<Operation>,
        private readonly userService : UserService
        ){
    }
    
    async insertNewOp(htelR : string, hids : string, htoken : string, amount : number){
        const authorization = await this.userService.isAuthorized(hids, htoken);

        if(authorization.state){
            const receiver = await this.userService.findUserMainInfoByTel(htelR);
            const sender = await this.userService.findUserMainInfo(hids);

            if(!receiver || !sender || receiver.id === undefined ||
                 (sender.Solde < amount)){
                return ({
                    'message' : 'Operation impossible, compte non trouvé ou montant invalide',
                    'state' : false
                });
            }else{
                const newOp = new this.opsModel({
                    amount : amount,
                    sender : sender.Téléphone,
                    receiver : htelR,
                    senderId : hids,
                    receiverId : receiver.id,
                    date : new Date() 
                });
                await newOp.save();
                await this.userService.debiter(sender.Id,amount,htoken);
                await this.userService.crediter(sender.Id,receiver.id,amount,htoken)
                return ({
                    'message' : 'DOne',
                    'state' : true
                });
            }
        }else{
            return({
                'message' : 'Problème d\'authentification',
                'state' : false
            })
        }
        
    }

    async getAllOps(){
        const opsList = await this.opsModel.find().exec();
        return opsList;
    }

    async showAllOps(){
        const opsList = await this.getAllOps();

        return opsList.map(ops =>({
            Id : ops.id,
            Sender : ops.sender,
            Receiver : ops.receiver,
            Amount : ops.amount,
            Date : ops.date
        }));
    }

    async getOps(id : string){
        const op = await this.opsModel.findById(id).exec();

        if(op === null){
            return ({
                'message' : 'Not found',
                'state' : false
            })
        }else{
            return op;
        }
    }

    async getOpsSentById(sid : string){
        const opsList = await this.opsModel.find({
            senderId : sid
        }).exec();

        if(opsList.length === 0){
            return ({
                'message' : 'Cet utilisateur n\'a initié aucune transaction',
                'state' : false
            })
        }else{
            return opsList.map(ops =>({
                Id : ops.id,
                Sender : ops.sender,
                Receiver : ops.receiver,
                Amount : ops.amount,
                Date : ops.date
            }));
        }
    }

    async getOpsReceivedById(rid : string){
        const opsList = await this.opsModel.find({
            receiverId : rid
        }).exec();

        if(opsList.length === 0){
            return ({
                'message' : 'Cet utilisateur n\'a initié aucune transaction',
                'state' : false
            })
        }else{
            return opsList.map(ops =>({
                Id : ops.id,
                Sender : ops.sender,
                Receiver : ops.receiver,
                Amount : ops.amount,
                Date : ops.date
            }));
        }
    }

    async getOpsInvolvedById(id : string){
        const opsList = await this.opsModel.find()
                            .or([{ receiverId: id }, { senderId: id }]);

        if(opsList.length === 0){
            return ({
                'message' : 'Cet utilisateur n\'a initié aucune transaction',
                'state' : false
            })
        }else{
            return opsList.map(ops =>({
                Id : ops.id,
                Sender : ops.sender,
                Receiver : ops.receiver,
                Amount : ops.amount,
                Date : ops.date
            }));
        }
    }

    async getOpsSentByTel(stel : string){
        const opsList = await this.opsModel.find({
            sender : stel
        }).exec();

        if(opsList.length === 0){
            return ({
                'message' : 'Cet utilisateur n\'a initié aucune transaction',
                'state' : false
            })
        }else{
            return opsList.map(ops =>({
                Id : ops.id,
                Sender : ops.sender,
                Receiver : ops.receiver,
                Amount : ops.amount,
                Date : ops.date
            }));
        }
    }

    async getOpsReceivedByTel(rtel : string){
        const opsList = await this.opsModel.find({
            receiver : rtel
        }).exec();

        if(opsList.length === 0){
            return ({
                'message' : 'Cet utilisateur n\'a initié aucune transaction',
                'state' : false
            })
        }else{
            return opsList.map(ops =>({
                Id : ops.id,
                Sender : ops.sender,
                Receiver : ops.receiver,
                Amount : ops.amount,
                Date : ops.date
            }));
        }
    }

    async getOpsInvolvedByTel(tel : string){
        const opsList = await this.opsModel.find()
                            .or([{ receiver : tel }, { sender : tel }]);

        if(opsList.length === 0){
            return ({
                'message' : 'Cet utilisateur n\'a initié aucune transaction',
                'state' : false
            })
        }else{
            return opsList.map(ops =>({
                Id : ops.id,
                Sender : ops.sender,
                Receiver : ops.receiver,
                Amount : ops.amount,
                Date : ops.date
            }));
        }
    }

    
}