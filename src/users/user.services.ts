import { Headers, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { randomBytes } from "crypto";
import { Model } from "mongoose";
import { User } from "./usersModel/user.model";


@Injectable()
export class UserService{
    constructor(
        @InjectModel('User') private readonly userModel: Model<User>
        ) {
    }

    async insertUser(hname : string, hfirstName : string, hpassword : string, hphone : string, hemail : string){
        const md5 = require('md5');
        const newUser = new this.userModel({
            name:  hname,
            firstName: hfirstName,
            password: hpassword,
            active: false,
            phone: hphone,
            email: hemail,
            connected: false,
            admin : false,
            token: 'ras',
            validationToken : md5(hphone),
            balance: 0,
        })    
       const result = await newUser.save();
       console.log(result);
       return newUser;
    }

    async insertAdminUser(hname : string, hfirstName : string, hpassword : string, hphone : string, hemail : string){
        const md5 = require('md5');
        const newUser = new this.userModel({
            name:  hname,
            firstName: hfirstName,
            password: hpassword,
            active: false,
            phone: hphone,
            email: hemail,
            connected: false,
            admin: true,
            validationToken : md5(hphone),
            token: '',
            balance: 0,
        })    
       const result = await newUser.save();
       console.log(result);
       return newUser;
    }
    
    async isAuthorized(pid : string, ptoken : string){
        const result =  await this.userModel.find({
            id : pid,
            token : ptoken,
            connected : true,
            active : true
        });

        if(!result){
            return ({
                'code' : false,
                'state' : false
            })
        }else{
            if(result.length === 0){
                return ({
                    'code' : true,
                    'state' : false
                })
            }else{
                return ({
                    'code' : true,
                    'state' : true
                })
            }
        }

    }

    async isAdmin(hid : string, htoken : string){
        const result = await this.findUserInfo(hid);
        if(result.token === htoken && result.admin === true){
            return ({
                'message' : 'Admin user',
                'code' : true
            })
        }else{
            return ({
                'message' : 'Sample user',
                'code' : false
            })
        }
    }

    async generateToken(id : string){
        const md5 = require('md5');
        const chain = id + '' + new Date() + randomBytes(100);
        const generatedToken = md5(chain);

        await this.userModel.findByIdAndUpdate(id,{
            token : generatedToken,
            connected : true
        });

        return generatedToken;
    }
    
    async generateAdminToken(id : string){
        const md5 = require('md5');
        const chain = id + '@pw!u' + new Date() + randomBytes(1000);
        const generatedToken = md5(chain);

        await this.userModel.findByIdAndUpdate(id,{
            token : generatedToken,
            connected : true
        });

        return generatedToken;
    }

    async authenticate(hemail : string, hpassword : string){
        const result = await this.userModel.find(({
            email : hemail,
            password : hpassword
        }));
        if(!result){
            return ({
                'message' : 'Erreur Interne',
                'found' : false
            })
        }else{
            if(result.length === 0){
                return ({
                    'message' : 'Non trouvé',
                    'found' : false
                }) 
            }else{
                if(result[0].connected === false){
                    const token = await this.generateToken(result[0].id);

                    return ({
                        'message' : 'Connecté, veuillez à ne pas divulguer votre token, ni votre ID',
                        'found' : true,
                        'id' : result[0].id,
                        'token' : token
                    })
                }else{
                    return ({
                        'message' : 'Déjà connecté hein! Annnh!! Elekôno Fianfi',
                        'found' : false
                    })
                }  
            }   
        } 
    }

    async logout(hid : string, htoken : string){
        const result =  await this.isAuthorized(hid,htoken);

        if(result.state === false){
            if(result.code === false) {
                return ({
                    'message' : 'Erreur Interne',
                    'found' : false
                })
            }else {
                return ({
                    'message' : 'Bien tenté, mais non! Aies les bonnes infos pour essayer de truander ton frère',
                    'found' : false
                })
            }
        }else{
            await this.userModel.findByIdAndUpdate(hid, {
                token : 'RAS',
                connected : false
            });
            return ({
                'message' : 'Bien déconnecté',
                'found' : true
            })
        }
    }

    async getUsers(){
        const userList = await this.userModel.find().exec();
        return userList.map(user => ({
            Id : user.id,
            Nom : user.name,
            Prenom : user.firstName,
            Téléphone : user.phone,
            Email : user.email,
            Solde : user.balance

        }))
    }

    async findUserInfo(hId : string){
        const user = await this.userModel.findById(hId).exec();
        return user;
    }

    async findUserMainInfo(hId : string){
        const user = await this.findUserInfo(hId);
        if(user === null){
            return ({
                'message' : 'NOt found',
                'state' : false
            })
        }else{
            return {
                Id : user.id,
                Nom : user.name,
                Prenom : user.firstName,
                Téléphone : user.phone,
                Email : user.email,
                Solde : user.balance
               };
        }
        
    }

    async findUserMainInfoByTel(tel : string){
        const user = await this.userModel.findOne({
            phone : tel
        });
        if(user === null){
            return ({
                'message' : 'Not found',
                'state' : false,
                'id' : undefined
            })
        }else{

            return user;
        }
    }

    async findUserMainInfoByName(hname : string){
        const userList = await this.userModel.find({
            name : hname
        });
        if(userList === undefined || userList.length === 0){
            return ({
                'message' : 'Not found',
                'state' : false,
                'id' : undefined
            })
        }else{
            return userList.map(user => ({
                Id : user.id,
                Nom : user.name,
                Prenom : user.firstName,
                Téléphone : user.phone,
                Email : user.email,
                Solde : user.balance
            }))
        }
    }

    async findUserMainInfoByFirstName(fname : string){
        const user = await this.userModel.find({
            firstName : fname
        }).exec();
        if(user === undefined || user.length === 0){
            return ({
                'message' : 'Not found',
                'state' : false,
                'id' : undefined
            })
        }else{

            return user;
        }
    }

    async findUserMainInfoByFirstNameAndName(fname : string, name  : string){
        const user = await this.userModel.find({
            firstName : fname,
            name : name
        }).exec();
        if(user === undefined || user.length === 0){
            return ({
                'message' : 'Not found',
                'state' : false,
                'id' : undefined
            })
        }else{

            return user;
        }
    }

    async changePassword(hid : string, htoken : string, newPass : string){
        const result = await this.isAuthorized(hid, htoken);
        if(result.code === false){
            return ({
                'message' : 'Impossible de faire cette action',
                'state' : false
            })
        }else{
            await this.userModel.findByIdAndUpdate(hid,{
                password : newPass
            });
            return ({
                'message' : 'success',
                'state' : true
            })
        }
    }

    async changePhone(hid : string, htoken : string, newTel : string){
        const result = await this.isAuthorized(hid, htoken);
        if(result.code === false){
            return ({
                'message' : 'Impossible de faire cette action',
                'state' : false
            })
        }else{
            await this.userModel.findByIdAndUpdate(hid,{
                phone : newTel
            });
            return ({
                'message' : 'success',
                'state' : true
            })
        }
    }

    async changeEmail(hid : string, htoken : string, newEmail : string){
        const result = await this.isAuthorized(hid, htoken);
        if(result.code === false){
            return ({
                'message' : 'Impossible de faire cette action',
                'state' : false
            })
        }else{
            await this.userModel.findByIdAndUpdate(hid,{
                email : newEmail
            });
            return ({
                'message' : 'success',
                'state' : true
            })
        }
    }

    async changeName(hid : string, htoken : string, newName : string){
        const result = await this.isAuthorized(hid, htoken);
        if(result.code === false){
            return ({
                'message' : 'Impossible de faire cette action',
                'state' : false
            })
        }else{
            await this.userModel.findByIdAndUpdate(hid,{
                name : newName
            });
            return ({
                'message' : 'success',
                'state' : true
            })
        }
    }

    async changeFirstname(hid : string, htoken : string, newFName : string){
        const result = await this.isAuthorized(hid, htoken);
        if(result.code === false){
            return ({
                'message' : 'Impossible de faire cette action',
                'state' : false
            })
        }else{
            await this.userModel.findByIdAndUpdate(hid,{
                firstName : newFName
            });
            return ({
                'message' : 'success',
                'state' : true
            })
        }
    }

    async activeAccount(tel : string, validationToken : string){
        const userInfo = await this.userModel.findOne({
            phone : tel
        });
        if(!userInfo){
            return ({
                'message' : 'Impossible de faire cette action',
                'state' : false
            })
        }else{
            if(userInfo.validationToken ===  validationToken){
                await this.userModel.findByIdAndUpdate(userInfo.id,{
                    active : true
                })
    
                return ({
                    'message' : 'success',
                    'state' : true
                })
            }else{
                return ({
                    'message' : 'Impossible de faire cette action',
                    'state' : false
                })
            }
        }
        
    }

    async desactiveAccount(id : string){
        const userInfo = await this.userModel.findById(id);
        if(!userInfo){
            return ({
                'message' : 'Impossible de faire cette action',
                'state' : false
            })
        }else{
            if(userInfo.active){
                await this.userModel.findByIdAndUpdate(userInfo.id,{
                    active : false
                })
    
                return ({
                    'message' : 'success',
                    'state' : true
                })
            }else{
                return ({
                    'message' : 'Impossible de faire cette action',
                    'state' : false
                })
            }
        }
        
    }

    async debiter(hids : string, amount : number, htoken : string){
        const authorization = await this.isAuthorized(hids, htoken);
        if(authorization.state){
            const sender = await this.findUserMainInfo(hids); 
            if(sender.Solde < amount){
                return({
                    'message' : 'Montant insufisant',
                    'state' : false
                });
            }else{
                const balance = sender.Solde - amount;

                await this.userModel.findByIdAndUpdate(hids, {
                    balance : balance
                });

                return ({
                    'message' : 'Débit effectué',
                    'state' : true
                });
            }
        }else{
            return({
                'message' : 'Aucune chance!!!',
                'state' : false
            });
        }
    }

    async crediter(hids : string, hidr : string, amount : number, htoken : string){
        const authorization = await this.isAuthorized(hids, htoken);
        if(authorization.state){
            const receiver = await this.findUserMainInfo(hidr); 
            const balance = receiver.Solde + amount;

            await this.userModel.findByIdAndUpdate(hidr, {
                    balance : balance
            });

            return ({
                    'message' : 'Crédit effectué',
                    'state' : true
            });
        }else{
            return({
                'message' : 'Aucune chance!!!',
                'state' : false
            });
        }
    }

    async rembourser(hids : string, amount : number, htoken : string){
        const authorization = await this.isAuthorized(hids, htoken);
        if(authorization.state){
            const receiver = await this.findUserMainInfo(hids); 
            const balance = receiver.Solde + amount;

            await this.userModel.findByIdAndUpdate(hids, {
                    balance : balance
            });

            return ({
                    'message' : 'Crédit effectué',
                    'state' : true
            });
        }else{
            return({
                'message' : 'Aucune chance!!!',
                'state' : false
            });
        }
    }

}