import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './document.entity';
import { UpdateDocumentDto } from './update-document.dto';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
  ) {}

  async uploadDocument(filename: string, path: string, mimetype: string) {
    const document = this.documentRepository.create({
      filename,
      path,
      mimetype,
    });
    return await this.documentRepository.save(document);
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

    return await this.documentRepository.save(document);
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
