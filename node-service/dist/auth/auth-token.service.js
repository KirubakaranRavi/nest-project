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
exports.AuthTokenService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const auth_token_entity_1 = require("./auth-token.entity");
let AuthTokenService = class AuthTokenService {
    authTokenRepository;
    constructor(authTokenRepository) {
        this.authTokenRepository = authTokenRepository;
    }
    async saveToken(email, token, expiresAt) {
        const authToken = this.authTokenRepository.create({
            email,
            token,
            expires_at: expiresAt,
        });
        await this.authTokenRepository.save(authToken);
    }
    async isTokenExpired(token) {
        const authToken = await this.authTokenRepository.findOne({
            where: { token },
        });
        if (!authToken)
            return true;
        return authToken.is_expired || new Date() > authToken.expires_at;
    }
    async expireToken(token) {
        const authToken = await this.authTokenRepository.findOne({
            where: { token },
        });
        if (!authToken)
            return;
        if (new Date() > authToken.expires_at || authToken.is_expired) {
            await this.authTokenRepository.update({ token }, { is_expired: true });
        }
    }
    async invalidateTokens(email) {
        await this.authTokenRepository.update({ email }, { is_expired: true });
    }
    async findValidToken(token) {
        const authToken = await this.authTokenRepository.findOne({
            where: { token },
        });
        if (!authToken || authToken.is_expired) {
            return null;
        }
        return authToken;
    }
};
exports.AuthTokenService = AuthTokenService;
exports.AuthTokenService = AuthTokenService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(auth_token_entity_1.AuthToken)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AuthTokenService);
//# sourceMappingURL=auth-token.service.js.map