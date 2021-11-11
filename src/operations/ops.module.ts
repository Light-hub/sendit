import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/users/user.module';
import { OpsSchema } from './model/ops.model';
import { OpsController } from './ops.controller';
import { OpsService } from './ops.services';

@Module({
    imports : [UserModule, MongooseModule.forFeature([{name : 'Operation', schema : OpsSchema}])],
    controllers : [OpsController],
    providers : [OpsService],
    exports : [OpsService]
})

export class OpsModule {}