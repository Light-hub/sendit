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
        const authorization1 = await this.userService.isAdmin(hids, htoken);
        
        if(authorization.state && !authorization1.code){
            const receiver = await this.userService.findUserMainInfoByTel(htelR);
            const sender = await this.userService.findUserMainInfo(hids);

            if(!receiver || !sender || receiver.id === undefined ||
                 (sender.Solde < amount)){
                return ({
                    'message' : 'Operation impossible, compte non trouvé ou montant invalide',
                    'state' : false
                });
            }else{
                if(receiver.id === sender.Id){
                    return ({
                        'message' : 'Boucle détectée, opération annulée',
                        'state' : false
                    });
                }else{
                    const date = new Date();
                    const newOp = new this.opsModel({
                        amount : amount,
                        sender : sender.Téléphone,
                        receiver : htelR,
                        senderId : hids,
                        receiverId : receiver.id,
                        state : false,
                        date : date
                    });
                    await newOp.save();
                    const cond1 = await this.userService.debiter(sender.Id,amount,htoken);
                    if(cond1.state){
                        const cond2 = await this.userService.crediter(sender.Id,receiver.id,amount,htoken);
                        if(!cond2.state){
                            const cond3 = await this.userService.rembourser(sender.Id,amount,htoken);
                            return ({
                                'message' : 'Opération non aboutie, veuillez reessayer',
                                'state' : false
                            });
                        }else{
                            await this.opsModel.findOneAndUpdate({
                                receiver : htelR,
                                sender : sender.Téléphone,
                                state : false,
                                date : date
                            }, {
                                state : true
                            });
                            return ({
                                'message' : 'Opération réussie',
                                'state' : true
                            });
                        }
                    }else{
                            return ({
                                'message' : 'Opération non aboutie, veuillez reessayer',
                                'state' : false
                            });
                    }
                }
            }
        }else{
            return({
                'message' : 'Problème d\'authentification',
                'state' : false
            })
        }
        
    }

    async getAllOps(){
        const opsList = await this.opsModel.find()
                                            .sort({date: 'desc'})
                                            .exec();
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

    async getPendingOps(){
        const result = await this.opsModel.find({
            state : false
        })
        .sort({date: 'desc'})
        .exec();
        if(result === undefined || result.length === 0){
            return ({
                'message' : 'Aucune transaction non aboutie',
                'state' : false
            });
        }else{
            return result.map(ops =>({
                Id : ops.id,
                Sender : ops.sender,
                Receiver : ops.receiver,
                Amount : ops.amount,
                Date : ops.date
            }));
        }
    }

    async getTerminatedOps(){
        const result = await this.opsModel.find({
            state : true
        })
        .sort({date: 'desc'})
        .exec();
        if(result === undefined || result.length === 0){
            return ({
                'message' : 'Aucune transaction non aboutie',
                'state' : false
            });
        }else{
            return result.map(ops =>({
                Id : ops.id,
                Sender : ops.sender,
                Receiver : ops.receiver,
                Amount : ops.amount,
                Date : ops.date
            }));
        }
    }

    async getPendingOpsSentById(sid : string){
        const result = await this.opsModel.find({
            senderId : sid,
            state : false
        })
        .sort({date: 'desc'})
        .exec();
        if(result === undefined || result.length === 0){
            return ({
                'message' : 'Aucune transaction non aboutie',
                'state' : false
            });
        }else{
            return result.map(ops =>({
                Id : ops.id,
                Sender : ops.sender,
                Receiver : ops.receiver,
                Amount : ops.amount,
                Date : ops.date
            }));
        }
    }

    async getPendingOpsReceivedById(rid : string){
        const result = await this.opsModel.find({
            receiverId : rid,
            state : false
        })
        .sort({date: 'desc'})
        .exec();
        if(result === undefined || result.length === 0){
            return ({
                'message' : 'Aucune transaction non aboutie',
                'state' : false
            });
        }else{
            return result.map(ops =>({
                Id : ops.id,
                Sender : ops.sender,
                Receiver : ops.receiver,
                Amount : ops.amount,
                Date : ops.date
            }));
        }
    }

    async getTerminatedOpsSentById(sid : string){
        const result = await this.opsModel.find({
            senderId : sid,
            state : true
        })
        .sort({date: 'desc'})
        .exec();
        if(result === undefined || result.length === 0){
            return ({
                'message' : 'Aucune transaction effectuée',
                'state' : false
            });
        }else{
            return result.map(ops =>({
                Id : ops.id,
                Sender : ops.sender,
                Receiver : ops.receiver,
                Amount : ops.amount,
                Date : ops.date
            }));
        }
    }

    async getTerminatedOpsReceivedById(rid : string){
        const result = await this.opsModel.find({
            receiverId : rid,
            state : true
        })
        .sort({date: 'desc'})
        .exec();
        if(result === undefined || result.length === 0){
            return ({
                'message' : 'Aucune transaction reçue',
                'state' : false
            });
        }else{
            return result.map(ops =>({
                Id : ops.id,
                Sender : ops.sender,
                Receiver : ops.receiver,
                Amount : ops.amount,
                Date : ops.date
            }));
        }
    }

    async getPendingOpsSentByTel(stel : string){
        const result = await this.opsModel.find({
            sender : stel,
            state : false
        })
        .sort({date: 'desc'})
        .exec();
        if(result === undefined || result.length === 0){
            return ({
                'message' : 'Aucune transaction non aboutie',
                'state' : false
            });
        }else{
            return result.map(ops =>({
                Id : ops.id,
                Sender : ops.sender,
                Receiver : ops.receiver,
                Amount : ops.amount,
                Date : ops.date
            }));
        }
    }

    async getPendingOpsReceivedByTel(rtel : string){
        const result = await this.opsModel.find({
            receiver : rtel,
            state : false
        })
        .sort({date: 'desc'})
        .exec();
        if(result === undefined || result.length === 0){
            return ({
                'message' : 'Aucune transaction non aboutie',
                'state' : false
            });
        }else{
            return result.map(ops =>({
                Id : ops.id,
                Sender : ops.sender,
                Receiver : ops.receiver,
                Amount : ops.amount,
                Date : ops.date
            }));
        }
    }

    async getTerminatedOpsReceivedByTel(rtel : string){
        const result = await this.opsModel.find({
            receiverId : rtel,
            state : true
        })
        .sort({date: 'desc'})
        .exec();
        if(result === undefined || result.length === 0){
            return ({
                'message' : 'Aucune transaction reçue',
                'state' : false
            });
        }else{
            return result.map(ops =>({
                Id : ops.id,
                Sender : ops.sender,
                Receiver : ops.receiver,
                Amount : ops.amount,
                Date : ops.date
            }));
        }
    }

    async getTerminatedOpsSentByTel(stel : string){
        const result = await this.opsModel.find({
            sender : stel,
            state : true
        })
        .sort({date: 'desc'})
        .exec();
        if(result === undefined || result.length === 0){
            return ({
                'message' : 'Aucune transaction effectuée',
                'state' : false
            });
        }else{
            return result.map(ops =>({
                Id : ops.id,
                Sender : ops.sender,
                Receiver : ops.receiver,
                Amount : ops.amount,
                Date : ops.date
            }));
        }
    }

    async getOpsById(id : string){
        const op = await this.opsModel.findById(id)
        .sort({date: 'desc'})
        .exec();

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
        })
        .sort({date: 'desc'})
        .exec();

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
        })
        .sort({date: 'desc'})
        .exec();

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
                            .sort({date: 'desc'})
                            .or([{ receiverId: id }, { senderId: id }])
                            ;

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
                Type : ops.receiverId === id ? 'Crédit' : 'Débit',
                Amount : ops.amount,
                Date : ops.date
            }));
        }
    }

    async getOpsSentByTel(stel : string){
        const opsList = await this.opsModel.find({
            sender : stel
        })
        .sort({date: 'desc'})
        .exec();

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
        })
        .sort({date: 'desc'})
        .exec();

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
                            .sort({date: 'desc'})
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

    async getOpsSortByAmountInfTo(amount : number){
        const opsList = await this.opsModel.find()
        .sort({date: 'desc'})
        .where('amount').lt(amount);

        if(opsList.length === 0){
            return ({
                'message' : 'Aucune transaction ne correspond à ce critère',
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

    async getOpsSortByAmountInfOrEqualTo(amount : number){
        const opsList = await this.opsModel.find()
        .sort({date: 'desc'})
        .where('amount').lte(amount);

        if(opsList.length === 0){
            return ({
                'message' : 'Aucune transaction ne correspond à ce critère',
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

    async getOpsSortByAmountSupTo(amount : number){
        const opsList = await this.opsModel.find()
        .sort({date: 'desc'})
        .where('amount').gt(amount);

        if(opsList.length === 0){
            return ({
                'message' : 'Aucune transaction ne correspond à ce critère',
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

    async getOpsSortByAmountSupOrEqualTo(amount : number){
        const opsList = await this.opsModel.find()
        .sort({date: 'desc'})
        .where('amount').gte(amount);

        if(opsList.length === 0){
            return ({
                'message' : 'Aucune transaction ne correspond à ce critère',
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

    async getOpsSortByAmountEqualTo(amount : number){
        const opsList = await this.opsModel.find()
        .sort({date: 'desc'})
        .where('amount').equals(amount);

        if(opsList.length === 0){
            return ({
                'message' : 'Aucune transaction ne correspond à ce critère',
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