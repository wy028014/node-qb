import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as svgCaptcha from "svg-captcha";
import config from "@/config";
import dayjs from "@/utils/dayjs.utils";
@Injectable()
export class BaseService {
  constructor(private readonly jwtService: JwtService) { }

  async create(id: string, classification: string): Promise<{ token_access: string; token_refresh: string }> {
    const token_access: string = this.jwtService.sign({ id, classification }, { expiresIn: config.jwt.signOptions.expiresIn, secret: config.jwt.secret });
    const token_refresh: string = this.jwtService.sign({ id, classification }, { expiresIn: config.jwt.signOptions.expiresIn as number * 24, secret: config.jwt.secret });
    return { token_access, token_refresh };
  }

  async find(): Promise<svgCaptcha.CaptchaObj> {
    return svgCaptcha.create({
      size: 4,
      fontSize: 50,
      width: 100,
      height: 40,
      background: `#eebe77`,
    });
  }

  verify(token: string): { id: string, classification: string, iat: string, exp: string } {
    const user: { id: string, classification: string, iat: number, exp: number } = this.jwtService.verify(token, { secret: config.jwt.secret });
    const iat = dayjs.unix(user.iat as number).format(`YYYY-MM-DD HH:mm:ss`);
    const exp = dayjs.unix(user.exp as number).format(`YYYY-MM-DD HH:mm:ss`);
    return {
      id: user.id,
      classification: user.classification,
      iat: iat,
      exp: exp,
    }
  }
}
