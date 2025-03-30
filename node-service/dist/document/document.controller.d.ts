import { DocumentService } from './document.service';
import { AuthTokenService } from 'src/auth/auth-token.service';
import { UsersService } from 'src/users/users.service';
import { RolesService } from 'src/roles/roles.service';
export declare class DocumentController {
    private readonly documentService;
    private readonly usersService;
    private readonly authTokenService;
    private readonly rolesService;
    constructor(documentService: DocumentService, usersService: UsersService, authTokenService: AuthTokenService, rolesService: RolesService);
    private checkSuperAdmin;
    uploadFile(req: any, file: Express.Multer.File): Promise<{
        message: string;
        document: import("./document.entity").Document;
        ingestion: any;
        error?: undefined;
    } | {
        message: string;
        document: import("./document.entity").Document;
        error: any;
        ingestion?: undefined;
    }>;
    getAllDocuments(req: any): Promise<import("./document.entity").Document[]>;
    getDocumentById(req: any, id: number): Promise<import("./document.entity").Document>;
    replaceDocument(req: any, id: number, file: Express.Multer.File): Promise<{
        message: string;
        document: import("./document.entity").Document;
        ingestion: any;
        error?: undefined;
    } | {
        message: string;
        document: import("./document.entity").Document;
        error: any;
        ingestion?: undefined;
    }>;
    deleteDocument(req: any, id: number): Promise<{
        message: string;
        document: import("./document.entity").Document;
    }>;
}
