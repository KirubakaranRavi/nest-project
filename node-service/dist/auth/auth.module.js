"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const auth_service_1 = require("./auth.service");
const users_module_1 = require("../users/users.module");
const jwt_strategy_1 = require("./jwt.strategy");
const auth_controller_1 = require("./auth.controller");
const typeorm_1 = require("@nestjs/typeorm");
const auth_token_service_1 = require("./auth-token.service");
const auth_token_entity_1 = require("./auth-token.entity");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            users_module_1.UsersModule,
            passport_1.PassportModule,
            jwt_1.JwtModule.register({
                secret: 'Kiruba@JWT',
                signOptions: { expiresIn: '1h' },
            }),
            typeorm_1.TypeOrmModule.forFeature([auth_token_entity_1.AuthToken]),
        ],
        providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy, auth_token_service_1.AuthTokenService],
        controllers: [auth_controller_1.AuthController],
        exports: [auth_service_1.AuthService, auth_token_service_1.AuthTokenService],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map