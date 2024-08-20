// import { Module } from '@nestjs/common';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { JwtModule } from '@nestjs/jwt';
// import { JwtStrategy } from './jwt.strategy';

// @Module({
//     imports: [
//       ConfigModule.forRoot({
//         isGlobal: true,
//       }),
//       JwtModule.registerAsync({
//         imports: [ConfigModule],
//         useFactory: async (configService: ConfigService) => ({
//           secret: configService.get<string>(process.env.JWT_SECRET),
//           signOptions: { expiresIn: '60m' },
//         }),
//         inject: [ConfigService],
//       }),
//     ],
//     providers: [JwtStrategy],
//     exports: [JwtStrategy, JwtModule],
//   })
//   export class AuthModule {}



  import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [JwtStrategy],
  exports: [PassportModule, JwtModule],
})
export class AuthModule {}
