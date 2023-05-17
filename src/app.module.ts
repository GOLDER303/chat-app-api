import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppGateway } from './app.gateway';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, ConfigModule.forRoot({ isGlobal: true })],
  controllers: [],
  providers: [AppGateway],
})
export class AppModule {}
