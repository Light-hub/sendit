import { Module } from "@nestjs/common";
import { OpsModule } from "src/operations/ops.module";
import { UserModule } from "src/users/user.module";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";


@Module({
    imports : [UserModule, OpsModule],
    controllers: [AdminController],
    providers : [AdminService]
})

export class AdminModule {}