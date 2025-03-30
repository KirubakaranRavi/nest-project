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
exports.RolesController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_service_1 = require("./roles.service");
const users_service_1 = require("../users/users.service");
const auth_token_service_1 = require("../auth/auth-token.service");
let RolesController = class RolesController {
    rolesService;
    usersService;
    authTokenService;
    constructor(rolesService, usersService, authTokenService) {
        this.rolesService = rolesService;
        this.usersService = usersService;
        this.authTokenService = authTokenService;
    }
    async checkSuperAdmin(req) {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token)
            throw new common_1.ForbiddenException('Token is required');
        const authToken = await this.authTokenService.findValidToken(token);
        if (!authToken)
            throw new common_1.ForbiddenException('Invalid or expired token');
        const user = await this.usersService.findByEmail(authToken.email);
        if (!user || !user.is_super) {
            throw new common_1.ForbiddenException('Access denied. Only super admins can perform this action.');
        }
    }
    async create(req, body) {
        await this.checkSuperAdmin(req);
        return this.rolesService.create(body.name, body.permissions);
    }
    async update(req, id, body) {
        await this.checkSuperAdmin(req);
        return this.rolesService.update(Number(id), body.name, body.permissions, body.is_active);
    }
    async getAllRoles(req) {
        await this.checkSuperAdmin(req);
        return this.rolesService.findAll();
    }
    async getRoleById(req, id) {
        await this.checkSuperAdmin(req);
        return this.rolesService.findById(Number(id));
    }
    async deleteRole(req, id) {
        await this.checkSuperAdmin(req);
        return this.rolesService.deleteRole(Number(id));
    }
};
exports.RolesController = RolesController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "getAllRoles", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "getRoleById", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "deleteRole", null);
exports.RolesController = RolesController = __decorate([
    (0, common_1.Controller)('roles'),
    __metadata("design:paramtypes", [roles_service_1.RolesService,
        users_service_1.UsersService,
        auth_token_service_1.AuthTokenService])
], RolesController);
//# sourceMappingURL=roles.controller.js.map