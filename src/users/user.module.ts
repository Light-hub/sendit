import { Module } from '@nestjs/common';
import { UsersController } from './user.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from './usersModel/user.model';
import { UserService } from './user.services';

@Module({
    imports : [MongooseModule.forFeature([{name : 'User', schema : UserSchema}])],
    controllers: [UsersController],
    providers : [UserService],
    exports : [UserService]
})

export class UserModule {}