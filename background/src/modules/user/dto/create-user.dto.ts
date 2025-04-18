import { ApiProperty } from "@nestjs/swagger";
import { encryption } from "@/utils/bcryptjs.utils";
import { UserType } from "#/models";

export class CreateUserDto {
  @ApiProperty({
    default: () => encryption("123456"),
    description: "密码",
    type: String,
  })
  password!: string;

  @ApiProperty({
    description: "类型",
    enum: Object.values(UserType),
    type: String,
  })
  classification!: string;

  @ApiProperty({ description: "个人id", type: String })
  personId?: string;

  @ApiProperty({ description: "部门id", type: String })
  departmentId?: string;

  @ApiProperty({ description: "公安处id", type: String })
  gonganchuId?: string;

  @ApiProperty({ description: "公安局id", type: String })
  gonganjuId?: string;
}    