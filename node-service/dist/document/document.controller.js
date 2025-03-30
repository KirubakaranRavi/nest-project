"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentController = void 0;
const common_1 = require("@nestjs/common");
const document_service_1 = require("./document.service");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const fs = require("fs");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const auth_token_service_1 = require("../auth/auth-token.service");
const users_service_1 = require("../users/users.service");
const roles_service_1 = require("../roles/roles.service");
let DocumentController = class DocumentController {
    documentService;
    usersService;
    authTokenService;
    rolesService;
    constructor(documentService, usersService, authTokenService, rolesService) {
        this.documentService = documentService;
        this.usersService = usersService;
        this.authTokenService = authTokenService;
        this.rolesService = rolesService;
    }
    async checkSuperAdmin(req, method = '') {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token)
            throw new common_1.ForbiddenException('Token is required');
        const authToken = await this.authTokenService.findValidToken(token);
        if (!authToken)
            throw new common_1.ForbiddenException('Invalid or expired token');
        const user = await this.usersService.findByEmail(authToken.email);
        if (!user) {
            throw new common_1.ForbiddenException('User not found');
        }
        if (user.is_super) {
            return;
        }
        if (!user.role) {
            throw new common_1.ForbiddenException('User role not found');
        }
        const get_role = await this.rolesService.findByName(user.role);
        if (!get_role) {
            throw new common_1.ForbiddenException(`Role "${user.role}" not found`);
        }
        const permissions = get_role.permissions;
        if (!permissions || !permissions.document_module) {
            throw new common_1.ForbiddenException(`Permissions not found for role "${user.role}"`);
        }
        if (method && !permissions.document_module.includes(method)) {
            throw new common_1.ForbiddenException(`You do not have "${method}" access to documents`);
        }
    }
    async uploadFile(req, file) {
        await this.checkSuperAdmin(req, 'create');
        if (!file) {
            throw new common_1.BadRequestException('No file uploaded');
        }
        return this.documentService.uploadDocument(file.filename, file.path, file.mimetype);
    }
    async getAllDocuments(req) {
        await this.checkSuperAdmin(req, 'get');
        return await this.documentService.getAllDocuments();
    }
    async getDocumentById(req, id) {
        await this.checkSuperAdmin(req, 'get');
        const document = await this.documentService.getDocumentById(id);
        if (!document) {
            throw new common_1.NotFoundException('Document not found');
        }
        return document;
    }
    async replaceDocument(req, id, file) {
        await this.checkSuperAdmin(req, 'update');
        if (!file) {
            throw new common_1.BadRequestException('No file uploaded');
        }
        return await this.documentService.replaceDocument(Number(id), file.filename, file.path, file.mimetype);
    }
    async deleteDocument(req, id) {
        await this.checkSuperAdmin(req, 'delete');
        const updatedDocument = await this.documentService.deleteDocument(Number(id));
        if (!updatedDocument) {
            throw new common_1.NotFoundException(`Document with ID ${id} not found`);
        }
        return {
            message: `Document with ID ${id} is marked as deleted`,
            document: updatedDocument,
        };
    }
};
exports.DocumentController = DocumentController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(''),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: (req, file, cb) => {
                const uploadPath = './uploads';
                if (!fs.existsSync(uploadPath)) {
                    fs.mkdirSync(uploadPath, { recursive: true });
                }
                cb(null, uploadPath);
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = (0, path_1.extname)(file.originalname);
                cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
            },
        }),
    })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DocumentController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DocumentController.prototype, "getAllDocuments", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], DocumentController.prototype, "getDocumentById", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)(':id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: (req, file, cb) => {
                const uploadPath = './uploads';
                if (!fs.existsSync(uploadPath)) {
                    fs.mkdirSync(uploadPath, { recursive: true });
                }
                cb(null, uploadPath);
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = (0, path_1.extname)(file.originalname);
                cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
            },
        }),
    })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object]),
    __metadata("design:returntype", Promise)
], DocumentController.prototype, "replaceDocument", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], DocumentController.prototype, "deleteDocument", null);
exports.DocumentController = DocumentController = __decorate([
    (0, common_1.Controller)('documents'),
    __metadata("design:paramtypes", [document_service_1.DocumentService,
        users_service_1.UsersService,
        auth_token_service_1.AuthTokenService,
        roles_service_1.RolesService])
], DocumentController);
//# sourceMappingURL=document.controller.js.map