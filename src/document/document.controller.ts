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
  ForbiddenException,
  Request,
} from '@nestjs/common';
import { DocumentService } from './document.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthTokenService } from 'src/auth/auth-token.service';
import { UsersService } from 'src/users/users.service';
import { RolesService } from 'src/roles/roles.service';

@Controller('documents')
export class DocumentController {
  constructor(
    private readonly documentService: DocumentService,
    private readonly usersService: UsersService,
    private readonly authTokenService: AuthTokenService,
    private readonly rolesService: RolesService,
  ) {}

  // Middleware function to check if the user is a super admin
  private async checkSuperAdmin(req: any, method: string = '') {
    const token = req.headers.authorization?.replace('Bearer ', ''); // Extract token from headers
    if (!token) throw new ForbiddenException('Token is required');

    const authToken = await this.authTokenService.findValidToken(token);
    if (!authToken) throw new ForbiddenException('Invalid or expired token');

    const user = await this.usersService.findByEmail(authToken.email);
    if (!user) {
      throw new ForbiddenException('User not found');
    }

    // ✅ If user is a super admin, allow access immediately
    if (user.is_super) {
      return; // Skip role and permission checks
    }

    if (!user.role) {
      throw new ForbiddenException('User role not found');
    }

    const get_role = await this.rolesService.findByName(user.role);
    if (!get_role) {
      throw new ForbiddenException(`Role "${user.role}" not found`);
    }

    const permissions = get_role.permissions;
    if (!permissions || !permissions.document_module) {
      throw new ForbiddenException(
        `Permissions not found for role "${user.role}"`,
      );
    }

    // ✅ Ensure `method` is valid and check permission dynamically
    if (method && !permissions.document_module.includes(method)) {
      throw new ForbiddenException(
        `You do not have "${method}" access to documents`,
      );
    }
  }

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
  async uploadFile(@Request() req, @UploadedFile() file: Express.Multer.File) {
    await this.checkSuperAdmin(req, 'create');

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
  async getAllDocuments(@Request() req) {
    await this.checkSuperAdmin(req, 'get'); // Check super admin access
    return await this.documentService.getAllDocuments();
  }

  // ✅ GET document by ID
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getDocumentById(@Request() req, @Param('id') id: number) {
    await this.checkSuperAdmin(req, 'get'); // Check super admin access
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
    @Request() req,
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    await this.checkSuperAdmin(req, 'update');

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
  async deleteDocument(@Request() req, @Param('id') id: number) {
    await this.checkSuperAdmin(req, 'delete'); // Check super admin access
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
