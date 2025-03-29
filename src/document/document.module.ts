import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { Document } from './document.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Document])], // ✅ Register the Document entity here
  providers: [DocumentService],
  controllers: [DocumentController],
  exports: [DocumentService],
})
export class DocumentModule {}
