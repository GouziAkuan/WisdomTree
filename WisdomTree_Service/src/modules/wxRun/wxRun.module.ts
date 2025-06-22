import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { TokenModule } from '../token/token.module';
import { wxRunController } from './wxRun.controller';
import { wxRunService } from './wxRun.service';
import { HttpModule } from '@nestjs/axios';
import { JwtAuthGuard } from 'src/common/guards/token.guard';

@Module({
  imports: [DatabaseModule, TokenModule, HttpModule],

  controllers: [wxRunController],

  providers: [wxRunService, JwtAuthGuard],

  exports: [wxRunService],
})
export class WxRunModule {}
