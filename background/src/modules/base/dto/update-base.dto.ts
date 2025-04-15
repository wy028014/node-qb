import { ApiProperty } from "@nestjs/swagger";
export class UpdateBaseDto {
  @ApiProperty({ description: `refresh_token`, type: String })
  refresh_token!: string;
}
