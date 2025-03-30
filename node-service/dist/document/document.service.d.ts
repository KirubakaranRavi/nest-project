import { Repository } from 'typeorm';
import { Document } from './document.entity';
import { HttpService } from '@nestjs/axios';
export declare class DocumentService {
    private documentRepository;
    private readonly httpService;
    constructor(documentRepository: Repository<Document>, httpService: HttpService);
    uploadDocument(filename: string, path: string, mimetype: string): Promise<{
        message: string;
        document: Document;
        ingestion: any;
        error?: undefined;
    } | {
        message: string;
        document: Document;
        error: any;
        ingestion?: undefined;
    }>;
    getAllDocuments(): Promise<Document[]>;
    getDocumentById(id: number): Promise<Document | null>;
    replaceDocument(id: number, filename: string, path: string, mimetype: string): Promise<{
        message: string;
        document: Document;
        ingestion: any;
        error?: undefined;
    } | {
        message: string;
        document: Document;
        error: any;
        ingestion?: undefined;
    }>;
    deleteDocument(id: number): Promise<Document>;
}
