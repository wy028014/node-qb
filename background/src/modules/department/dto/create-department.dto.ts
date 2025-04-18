import { ApiProperty } from "@nestjs/swagger";
import { DepartmentType } from "#/models";

export class CreateDepartmentDto {
  @ApiProperty({ description: `部门名称`, type: String })
  name!: string;

  @ApiProperty({
    description: `类型`,
    enum: Object.values(DepartmentType),
    type: String
  })
  classification!: string;

  @ApiProperty({ description: `排序`, type: Number })
  order!: number;
  
  @ApiProperty({ description: `公安处`, type: String })
  gonganchuId!: string;
}
