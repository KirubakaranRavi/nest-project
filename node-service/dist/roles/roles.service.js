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
exports.RolesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const roles_entity_1 = require("./roles.entity");
let RolesService = class RolesService {
    rolesRepository;
    constructor(rolesRepository) {
        this.rolesRepository = rolesRepository;
    }
    async create(name, permissions) {
        const existingRole = await this.rolesRepository.findOne({
            where: { name },
        });
        if (existingRole) {
            throw new common_1.BadRequestException(`Role with name "${name}" already exists.`);
        }
        if (!permissions || typeof permissions !== 'object') {
            throw new common_1.BadRequestException('Permissions must be a valid JSON object.');
        }
        const newRole = this.rolesRepository.create({ name, permissions });
        return this.rolesRepository.save(newRole);
    }
    async update(id, name, permissions, is_active) {
        const role = await this.rolesRepository.findOne({ where: { id } });
        if (!role) {
            throw new common_1.NotFoundException(`Role with ID ${id} not found.`);
        }
        const existingRole = await this.rolesRepository.findOne({
            where: { name },
        });
        if (existingRole && existingRole.id !== id) {
            throw new common_1.BadRequestException(`Role with name "${name}" already exists.`);
        }
        if (!permissions || typeof permissions !== 'object') {
            throw new common_1.BadRequestException(`Invalid permissions format.`);
        }
        return await this.rolesRepository.save({
            ...role,
            name,
            permissions,
            is_active: is_active,
        });
    }
    async findAll() {
        return this.rolesRepository.find();
    }
    async findById(id) {
        const role = await this.rolesRepository.findOne({ where: { id } });
        if (!role) {
            throw new common_1.NotFoundException(`Role with ID ${id} not found.`);
        }
        return role;
    }
    async deleteRole(id) {
        const role = await this.rolesRepository.findOne({ where: { id } });
        if (!role) {
            throw new common_1.NotFoundException(`Role with ID ${id} not found.`);
        }
        return this.rolesRepository.save({
            ...role,
            is_deleted: true,
        });
    }
    async findByName(role) {
        const roleData = await this.rolesRepository.findOne({
            where: { name: role },
        });
        if (!roleData) {
            throw new common_1.NotFoundException(`Role with name "${role}" not found.`);
        }
        return roleData;
    }
};
exports.RolesService = RolesService;
exports.RolesService = RolesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(roles_entity_1.Role)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RolesService);
//# sourceMappingURL=roles.service.js.map