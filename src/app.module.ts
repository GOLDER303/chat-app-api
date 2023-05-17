import { Module } from '@nestjs/common';
import { AppGateway } from './app.gateway';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [AppGateway],
})
export class AppModule {}
