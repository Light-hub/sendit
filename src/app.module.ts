import { Module } from '@nestjs/common';
import { UserModule } from './users/user.module';
import { OpsModule } from './operations/ops.module';
import { MongooseModule } from "@nestjs/mongoose";
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [UserModule, OpsModule, AdminModule, MongooseModule.forRoot(
    'mongodb+srv://sendituser:hAsYtI4KzuPmeZ5awbW4@cluster0.kirik.mongodb.net/sendtitdb?retryWrites=true&w=majority'
    )],
})
export class AppModule {}
