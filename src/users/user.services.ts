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
        const result0 = await this.isAlreadyUser(hphone);
        if(!result0.state){
            const newUser = new this.userModel({
                name:  hname,
                firstName: hfirstName,
                password: md5(hpassword),
                active: false,
                phone: hphone,
                email: hemail,
                connected: false,
                admin : false,
                token: 'ras',
                validationToken : md5(hphone + 'client' + new Date() + randomBytes(50)),
                balance: 0,
            })    
           const result = await newUser.save();
           console.log(result);
           return newUser;
        }else{
            return result0;
        }
        
    }

    async insertAdminUser(hname : string, hfirstName : string, hpassword : string, hphone : string, hemail : string){
        const md5 = require('md5');
        const newUser = new this.userModel({
            name:  hname,
            firstName: hfirstName,
            password: hpassword,
            active: true,
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
    
    async isAlreadyUser(hphone : string){
        const result =  await this.userModel.find({
            phone : hphone
        });

        if(result === undefined || result.length === 0){
            return({
                'message' : 'Go ahead! ESTIAM???',
                'state' : false
            });
        }else{
            return({
                'message' : 'Account already registered',
                'state' : true
            });
        }


    }

    async isAuthorized(pid : string, ptoken : string){
        const result =  await this.userModel.find({
            id : pid,
            token : ptoken,
            connected : true,
            active : true
        });
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
            token : generatedToken
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

    async authenticate(hemail : string, hpassword : string, allowed : boolean){
        const md5 = require('md5');
        const result = await this.userModel.find(({
            email : hemail,
            password : md5(hpassword)
        }));
        if(!result){
            return ({
                'message' : 'Erreur Interne',
                'found' : false
            })
        }else{
            if(result.length === 0){
                return ({
                    'message' : 'Non trouv??',
                    'found' : false
                }) 
            }else{
                if(result[0].active){
                    if(result[0].connected === false){
                        const token = await this.generateToken(result[0].id);
                        const result1 = await this.isAdmin(result[0].id, token)
                        if(result1.code && !allowed){
                            return ({
                                'message' : 'Erreur interne',
                                'code' : false
                            });
                        }else{
                            await this.userModel.findByIdAndUpdate(result[0].id,{
                                connected : true
                            });
                            return ({
                                'message' : 'Connect??, veuillez ?? ne pas divulguer votre token, ni votre ID',
                                'found' : true,
                                'id' : result[0].id,
                                'token' : token
                            })
                        }  
                    }else{
                        return ({
                            'message' : 'D??j?? connect?? hein! Annnh!! Elek??no Fianfi',
                            'found' : false
                        })
                    }  
                }else{
                    return ({
                        'message' : 'Veuillez activer votre compte',
                        'found' : false
                    }) 
                }
                
            }   
        } 
    }

    async logout(hid : string, htoken : string, isAllowed : boolean){
        const result =  await this.isAuthorized(hid,htoken);
        const admin = await this.isAdmin(hid, htoken)
        if(result.state === false){
            if(result.code === false) {
                return ({
                    'message' : 'Erreur Interne',
                    'found' : false
                })
            }else {
                return ({
                    'message' : 'Bien tent??, mais non! Aies les bonnes infos pour essayer de truander ton fr??re',
                    'found' : false
                })
            }
        }else if (admin.code && !isAllowed){
            return ({
                'message' : 'Erreur Interne',
                'found' : false
            })
        }else{
            await this.userModel.findByIdAndUpdate(hid, {
                token : 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
                connected : false
            });
            return ({
                'message' : 'Bien d??connect??',
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
            T??l??phone : user.phone,
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
                T??l??phone : user.phone,
                Email : user.email,
                Solde : user.balance
               };
        }
        
    }

    async findMyInfo(hId : string, hToken : string){
        const auth = await this.isAuthorized(hId, hToken);

        if(auth.state){
            const result = await this.findUserMainInfo(hId);
            return result;
        }else{
            return ({
                'message' : 'lack of privileges',
                'state' : false
            });
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
                T??l??phone : user.phone,
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

    async changePassword(hid : string, htoken : string, newPass : string, oldPass : string){
        const result = await this.isAuthorized(hid, htoken);
        const md5 = require('md5')
        if(result.code === false){
            return ({
                'message' : 'Impossible de faire cette action',
                'state' : false
            })
        }else{
            const result = await this.findUserInfo(hid)
            if(result ===  undefined || result.password !== oldPass){
                return({
                    'message' : 'Action impossible',
                    'state' : false
                })
            }else{
                await this.userModel.findByIdAndUpdate(hid,{
                    password : md5(newPass)
                });
                return ({
                    'message' : 'success',
                    'state' : true
                })
            }
            
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
                    'message' : 'D??bit effectu??',
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
                    'message' : 'Cr??dit effectu??',
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
                    'message' : 'Cr??dit effectu??',
                    'state' : true
            });
        }else{
            return({
                'message' : 'Aucune chance!!!',
                'state' : false
            });
        }
    }

    async deleteAccount(hid : string, htoken : string){
        const result = await this.isAuthorized(hid, htoken);

        if(result.state){
            return this.userModel.findByIdAndDelete(hid);
        }else{
            return result;
        }
    }
}