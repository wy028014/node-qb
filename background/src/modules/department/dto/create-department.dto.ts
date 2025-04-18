import { ApiProperty } from "@nestjs/swagger";
import { ENUM } from "sequelize";
export class CreateDepartmentDto {
  @ApiProperty({ description: `部门名称`, type: String })
  name!: string;
  @ApiProperty({ description: `类型`, type: ENUM(`党委`, `综合管理科室`, `业务指导支队`, `基层所队`) })
  classification!: string;
  @ApiProperty({ description: `排序`, type: Number })
  order!: number;
  @ApiProperty({ description: `公安处`, type: String })
  gonganchuId!: string;
}
