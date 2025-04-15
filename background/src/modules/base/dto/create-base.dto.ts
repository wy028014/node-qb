import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";
export class CreateBaseDto {
  @ApiProperty({ default: `028014`, description: `登录名`, type: String })
  @IsNotEmpty()
  @IsString()
  l_username!: string;
  @ApiProperty({ default: `d0c001cabb9abee2f7070423a00af5ec`, description: `密码`, type: String })
  @IsNotEmpty()
  @IsString()
  l_password!: string;
  @ApiProperty({ description: `验证码`, type: String })
  @IsNotEmpty()
  @IsString()
  @Length(4, 4, { message: `验证码只有4位` })
  l_captcha?: string;
}
