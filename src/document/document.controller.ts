import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Get,
  Param,
  NotFoundException,
  Put,
  Body,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { DocumentService } from './document.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('documents')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  // ✅ POST upload document
  // This endpoint allows users to upload a document.
  @UseGuards(JwtAuthGuard)
  @Post('')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads';
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log('Received file:', file); // Debugging line

    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    return this.documentService.uploadDocument(
      file.filename,
      file.path,
      file.mimetype,
    );
  }

  // ✅ GET all documents
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllDocuments() {
    return await this.documentService.getAllDocuments();
  }

  // ✅ GET document by ID
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getDocumentById(@Param('id') id: number) {
    const document = await this.documentService.getDocumentById(id);
    if (!document) {
      throw new NotFoundException('Document not found');
    }
    return document;
  }

  // ✅ PUT document by ID
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads';
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async replaceDocument(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log('Received update request for ID:', id);
    console.log('Received file:', file);

    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    return await this.documentService.replaceDocument(
      Number(id),
      file.filename,
      file.path,
      file.mimetype,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteDocument(@Param('id') id: number) {
    console.log(`Deleting document with ID: ${id}`);

    const updatedDocument = await this.documentService.deleteDocument(
      Number(id),
    );

    if (!updatedDocument) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    return {
      message: `Document with ID ${id} is marked as deleted`,
      document: updatedDocument,
    };
  }
}
