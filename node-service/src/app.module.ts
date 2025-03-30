import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { DocumentService } from './document/document.service';
import { DocumentController } from './document/document.controller';
import { DocumentModule } from './document/document.module';
import { Document } from './document/document.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [Document],
      autoLoadEntities: true,
      synchronize: true, // Disable in production
    }),
    UsersModule,
    AuthModule,
    RolesModule,
    DocumentModule,
    HttpModule,
  ],
})
export class AppModule {}
