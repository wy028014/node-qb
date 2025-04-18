import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateDepartmentDto } from "./create-department.dto";
export class UpdateDepartmentDto extends PartialType(CreateDepartmentDto) {
  @ApiProperty({ description: `id`, type: String })
  uid!: string;
}
