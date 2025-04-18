import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";
import { UpdateDepartmentDto } from "./update-department.dto";

export class QueryDepartmentDto extends PartialType(UpdateDepartmentDto) {
  /**
   * 个人id，用于关联查询相关人员的部门信息
   */
  @ApiProperty({ description: '个人id', type: String })
  @IsOptional()
  @IsString()
  personId?: string;

  /**
   * 查询的属性数组，指定需要返回的部门属性
   */
  @ApiProperty({ description: '查询的属性', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attributes?: string[];

  /**
   * 不查询的属性数组，指定不需要返回的部门属性
   */
  @ApiProperty({ description: '不查询的属性', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  exclude?: string[];

  /**
   * 包含其它模型的数组，指定需要关联查询的其他模型
   */
  @ApiProperty({ description: '包含其它模型', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  include?: string[];

  /**
   * 返回的数量，用于分页查询，指定每页返回的部门记录数量
   */
  @ApiProperty({ description: '返回的数量', type: Number })
  @IsOptional()
  @IsNumber()
  limit?: number;

  /**
   * 查询的偏移量，用于分页查询，指定从第几条记录开始返回
   */
  @ApiProperty({ description: '查询的偏移量', type: Number })
  @IsOptional()
  @IsNumber()
  offset?: number;

  /**
   * 是否查询被软删除的记录，默认为 false
   */
  @ApiProperty({ default: false, description: '是否查询被软删除的记录', type: Boolean })
  @IsOptional()
  @IsBoolean()
  paranoid?: boolean;

  /**
   * 是否记录查询性能，默认为 true
   */
  @ApiProperty({ default: true, description: '是否记录查询性能', type: Boolean })
  @IsOptional()
  @IsBoolean()
  benchmark?: boolean;
}    