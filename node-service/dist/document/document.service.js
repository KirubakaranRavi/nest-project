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
exports.DocumentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const document_entity_1 = require("./document.entity");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
let DocumentService = class DocumentService {
    documentRepository;
    httpService;
    constructor(documentRepository, httpService) {
        this.documentRepository = documentRepository;
        this.httpService = httpService;
    }
    async uploadDocument(filename, path, mimetype) {
        const document = this.documentRepository.create({
            filename,
            path,
            mimetype,
        });
        await this.documentRepository.save(document);
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post('http://localhost:8000/trigger-ingestion', {
                filename,
                path,
            }));
            return {
                message: 'Document uploaded and ingestion triggered',
                document,
                ingestion: response.data,
            };
        }
        catch (error) {
            return {
                message: 'Document uploaded, but ingestion failed to start',
                document,
                error: error.message,
            };
        }
    }
    async getAllDocuments() {
        return await this.documentRepository.find({ where: { is_deleted: false } });
    }
    async getDocumentById(id) {
        return await this.documentRepository.findOne({
            where: { id, is_deleted: false },
        });
    }
    async replaceDocument(id, filename, path, mimetype) {
        console.log('Fetching document with ID:', id);
        const document = await this.documentRepository.findOne({ where: { id } });
        if (!document) {
            throw new common_1.NotFoundException(`Document with ID ${id} not found`);
        }
        console.log('Before Update:', document);
        document.filename = filename;
        document.path = path;
        document.mimetype = mimetype;
        await this.documentRepository.save(document);
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post('http://localhost:8000/trigger-ingestion', {
                filename,
                path,
            }));
            return {
                message: 'Document updated and ingestion triggered',
                document,
                ingestion: response.data,
            };
        }
        catch (error) {
            return {
                message: 'Document updated, but ingestion failed to start',
                document,
                error: error.message,
            };
        }
    }
    async deleteDocument(id) {
        const document = await this.documentRepository.findOne({ where: { id } });
        if (!document) {
            throw new common_1.NotFoundException(`Document with ID ${id} not found`);
        }
        document.is_deleted = true;
        return await this.documentRepository.save(document);
    }
};
exports.DocumentService = DocumentService;
exports.DocumentService = DocumentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(document_entity_1.Document)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        axios_1.HttpService])
], DocumentService);
//# sourceMappingURL=document.service.js.map