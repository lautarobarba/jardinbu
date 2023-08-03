import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "modules/user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
// import { AccessTokenStrategy } from "./strategies/accessToken.strategy";
// import { RefreshTokenStrategy } from "./strategies/refreshToken.strategy";
import { MailerModule } from "modules/mailer/mailer.module";

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.JWT_SECRET || "secret",
        signOptions: {
          expiresIn: process.env.JWT_EXPIRATION_TIME || "1d",
        },
      }),
    }),
    UserModule,
    MailerModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
