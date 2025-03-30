import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './document.entity';
import { UpdateDocumentDto } from './update-document.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    private readonly httpService: HttpService,
  ) {}

  async uploadDocument(filename: string, path: string, mimetype: string) {
    const document = this.documentRepository.create({
      filename,
      path,
      mimetype,
    });
    // return await this.documentRepository.save(document);
    await this.documentRepository.save(document);

    // ✅ Call Python backend to trigger ingestion
    try {
      const response = await firstValueFrom(
        this.httpService.post('http://localhost:8000/trigger-ingestion', {
          filename,
          path,
        }),
      );

      return {
        message: 'Document uploaded and ingestion triggered',
        document,
        ingestion: response.data,
      };
    } catch (error) {
      return {
        message: 'Document uploaded, but ingestion failed to start',
        document,
        error: error.message,
      };
    }
  }

  // ✅ GET all documents
  async getAllDocuments() {
    return await this.documentRepository.find({ where: { is_deleted: false } });
  }

  // ✅ GET document by ID
  async getDocumentById(id: number) {
    return await this.documentRepository.findOne({
      where: { id, is_deleted: false },
    });
  }

  async replaceDocument(
    id: number,
    filename: string,
    path: string,
    mimetype: string,
  ) {
    console.log('Fetching document with ID:', id);

    const document = await this.documentRepository.findOne({ where: { id } });

    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    console.log('Before Update:', document);

    document.filename = filename;
    document.path = path;
    document.mimetype = mimetype;

    await this.documentRepository.save(document);

    // ✅ Call Python backend to trigger ingestion after update
    try {
      const response = await firstValueFrom(
        this.httpService.post('http://localhost:8000/trigger-ingestion', {
          filename,
          path,
        }),
      );

      return {
        message: 'Document updated and ingestion triggered',
        document,
        ingestion: response.data,
      };
    } catch (error) {
      return {
        message: 'Document updated, but ingestion failed to start',
        document,
        error: error.message,
      };
    }
  }

  async deleteDocument(id: number) {
    const document = await this.documentRepository.findOne({ where: { id } });

    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    document.is_deleted = true; // ✅ Soft delete
    return await this.documentRepository.save(document);
  }
}
