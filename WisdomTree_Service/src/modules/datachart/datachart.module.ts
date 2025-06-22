import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { TokenModule } from '../token/token.module';
import { JwtAuthGuard } from 'src/common/guards/token.guard';
import { AdminGuard } from '../admin/guard/admin.guard';
import { DataChartController } from './datachart.controller';
import { DataChartService } from './datachart.service';
import { HttpModule } from '@nestjs/axios';
import { WxRunModule } from '../wxRun/wxRun.module';

@Module({
  imports: [DatabaseModule, TokenModule,HttpModule,WxRunModule],
  controllers: [DataChartController],
  providers: [JwtAuthGuard, AdminGuard, DataChartService],
})
export class DataChartModule {}
