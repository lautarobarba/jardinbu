import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "modules/user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { MailerModule } from "modules/mailer/mailer.module";
import { LocalStrategy } from "./strategies/local.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { ENV_VAR } from "config";

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: ENV_VAR.JWT_SECRET,
        signOptions: {
          expiresIn: ENV_VAR.JWT_EXPIRATION_TIME,
        },
      }),
    }),
    UserModule,
    MailerModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
