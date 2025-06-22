import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { JwtAuthGuard } from 'src/common/guards/token.guard';
import { TokenModule } from '../token/token.module';
import { UploadModule } from '../upload/upload.module';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [TokenModule, DatabaseModule, UploadModule],
  controllers: [AiController],
  providers: [JwtAuthGuard, AiService],
})
export class AiModule {}
