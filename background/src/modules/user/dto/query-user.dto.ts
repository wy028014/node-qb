import { ApiProperty, PartialType } from "@nestjs/swagger";
import { UpdateUserDto } from "./update-user.dto";
export class QueryUserDto extends PartialType(UpdateUserDto) {
  @ApiProperty({ description: `部门id`, type: String })
  departmentId?: string;
  @ApiProperty({ description: `公安处id`, type: String })
  gonganchuId?: string;
  @ApiProperty({ description: `公安局id`, type: String })
  gonganjuId?: string;
  @ApiProperty({ description: `查询的属性`, type: Array })
  attributes?: string[];
  @ApiProperty({ description: `不查询的属性`, type: Array })
  exclude?: string[];
  @ApiProperty({ description: `包含其它模型`, type: Array })
  include?: string[];
  @ApiProperty({ description: `返回的数量`, type: Number })
  limit?: number;
  @ApiProperty({ description: `查询的偏移量`, type: Number })
  offset?: number;
  @ApiProperty({ default: false, description: `是否查询被软删除的记录`, type: Boolean })
  paranoid?: boolean;
  @ApiProperty({ default: true, description: `是否记录查询性能`, type: Boolean })
  benchmark?: boolean;
}
