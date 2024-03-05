import { Global, Module } from "@nestjs/common";
import { GatewayService } from "./gateway.service";

@Global()
@Module({
  controllers: [],
  providers: [GatewayService],
  exports: [GatewayService],
})
export class GatewayModule {}