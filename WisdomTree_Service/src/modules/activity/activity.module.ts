import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { TokenModule } from 'src/modules/token/token.module';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { AdminGuard } from '../admin/guard/admin.guard';
import { JwtAuthGuard } from 'src/common/guards/token.guard';

@Module({
  imports: [DatabaseModule, TokenModule],
  controllers: [ActivityController],
  providers: [AdminGuard, JwtAuthGuard, ActivityService],
})
export class ActivityModule {}
