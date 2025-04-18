import { ApiProperty } from "@nestjs/swagger";

export class CreatePersonDto {
  @ApiProperty({ description: "姓名", type: String })
  name!: string;

  @ApiProperty({
    description: "性别",
    enum: ["男", "女"],
    type: String,
  })
  gender!: string;

  @ApiProperty({ description: "警号", type: String })
  police_number!: string;

  @ApiProperty({ description: "身份证号码", type: String })
  identification_number!: string;

  @ApiProperty({ description: "手机号码", type: String })
  phone_number!: string;

  @ApiProperty({ description: "所在部门id", type: String })
  departmentId!: string;

  @ApiProperty({ description: "所在编制id", type: String })
  organizationId!: string;
}    