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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const register_user_dto_1 = require("../dto/register-user.dto");
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    async register(body) {
        const existingUser = await this.usersService.findByEmail(body.email);
        if (existingUser) {
            throw new common_1.BadRequestException('Email already in use');
        }
        return this.usersService.create(body.email, body.password, body.role ?? '', body.firstName ?? '', body.lastName ?? '', body.is_super ?? false);
    }
    async getProfile() {
        return await this.usersService.findAll();
    }
    async getUserById(id) {
        const user = await this.usersService.findById(Number(id));
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        return user;
    }
    async updateUser(id, body) {
        const user = await this.usersService.findById(Number(id));
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        return this.usersService.updateUserData(Number(id), body.email, body.password, body.role ?? user.role, body.firstName ?? user.firstName, body.lastName ?? user.lastName, body.is_super ?? user.is_super, body.is_active ?? user.is_active);
    }
    async deleteUser(id) {
        const user = await this.usersService.findById(Number(id));
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        return this.usersService.deleteUserData(Number(id));
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Post)('register'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_user_dto_1.RegisterUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "register", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getProfile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserById", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, register_user_dto_1.RegisterUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateUser", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteUser", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map