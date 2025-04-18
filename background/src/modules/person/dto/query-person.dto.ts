import { ApiProperty, PartialType } from "@nestjs/swagger";
import { UpdatePersonDto } from "./update-person.dto";
export class QueryPersonDto extends PartialType(UpdatePersonDto) {
  @ApiProperty({ description: `部门公安处id`, type: String })
  departmentGonganchuId?: string;
  @ApiProperty({ description: `编制公安处id`, type: String })
  organizationGonganchuId?: string;
  @ApiProperty({ description: `部门公安局id`, type: String })
  departmentGonganjuId?: string;
  @ApiProperty({ description: `编制公安局id`, type: String })
  organizationGonganjuId?: string;
  @ApiProperty({ description: `职务id`, type: String })
  dutyId?: string;
  @ApiProperty({ description: `职级id`, type: String })
  rankId?: string;
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
