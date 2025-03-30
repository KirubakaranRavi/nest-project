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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const user_entity_1 = require("./user.entity");
const roles_entity_1 = require("../roles/roles.entity");
let UsersService = class UsersService {
    usersRepository;
    roleRepository;
    constructor(usersRepository, roleRepository) {
        this.usersRepository = usersRepository;
        this.roleRepository = roleRepository;
    }
    async create(email, password, role, firstName = '', lastName = '', is_super = false) {
        const hashedPassword = await bcrypt.hash(password, 12);
        if (is_super) {
            role = 'admin';
        }
        else {
            const validRoles = await this.roleRepository.find();
            const validRoleNames = validRoles.map((r) => r.name);
            if (!validRoleNames.includes(role)) {
                throw new common_1.BadRequestException(`Invalid role: ${role}. Choose a valid role.`);
            }
        }
        const newUser = this.usersRepository.create({
            email,
            password: hashedPassword,
            role,
            firstName,
            lastName,
            is_super,
        });
        return this.usersRepository.save(newUser);
    }
    async findByEmail(email) {
        return this.usersRepository.findOne({ where: { email } });
    }
    async findAll() {
        return this.usersRepository.find({ where: { is_deleted: false } });
    }
    async findById(id) {
        const userId = await this.usersRepository.findOne({
            where: { id, is_deleted: false },
        });
        if (!userId) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return userId;
    }
    async updateUserData(id, email, password, role, firstName, lastName, is_super, is_active) {
        const user = await this.usersRepository.findOne({
            where: { id, is_deleted: false },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        if (email)
            user.email = email;
        if (password)
            user.password = await bcrypt.hash(password, 12);
        if (firstName)
            user.firstName = firstName;
        if (lastName)
            user.lastName = lastName;
        if (typeof is_super === 'boolean')
            user.is_super = is_super;
        if (typeof is_active === 'boolean')
            user.is_active = is_active;
        if (is_super) {
            user.role = 'admin';
        }
        else if (role) {
            const validRoles = await this.roleRepository.find();
            const validRoleNames = validRoles.map((r) => r.name);
            if (!validRoleNames.includes(role)) {
                throw new common_1.BadRequestException(`Invalid role: ${role}. Choose a valid role.`);
            }
            user.role = role;
        }
        return this.usersRepository.save(user);
    }
    async deleteUserData(id) {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        user.is_deleted = true;
        return this.usersRepository.save(user);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(roles_entity_1.Role)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map