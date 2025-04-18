import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { ValidationError, validate } from "class-validator";
import { isValidIdentificationNumber, isValidPhoneNumber } from "@/utils/validate.utils";
@Injectable()
export class PersonPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    const validDtoNames: string[] = [`CreatePersonDto`, `QueryPersonDto`, `UpdatePersonDto`];
    if (!metadata.metatype || !validDtoNames.includes(metadata.metatype.name)) {
      return value;
    }
    const dtoInstance: any = plainToInstance(metadata.metatype, value);
    const errors: ValidationError[] = await validate(dtoInstance);
    if (errors.length) {
      throw new BadRequestException(errors);
    }
    if (dtoInstance.identification_number && !isValidIdentificationNumber(dtoInstance.identification_number)) {
      throw new BadRequestException(`无效的身份证号码`);
    }
    if (dtoInstance.phone_number && !isValidPhoneNumber(dtoInstance.phone_number)) {
      throw new BadRequestException("无效的手机号码");
    }
    if (dtoInstance.attributes && dtoInstance.exclude) {
      throw new BadRequestException(`不能同时使用`);
    }
    if (dtoInstance.limit && typeof dtoInstance.limit === `string`) {
      const limit: number = Number(dtoInstance.limit);
      if (Number.isNaN(limit)) {
        throw new BadRequestException(`limit 必须是有效的数字`);
      }
      value.limit = limit;
    }
    if (dtoInstance.offset && typeof dtoInstance.offset === `string`) {
      const offset: number = Number(dtoInstance.offset);
      if (Number.isNaN(offset)) {
        throw new BadRequestException(`offset 必须是有效的数字`);
      }
      value.offset = offset;
    }
    return value;
  }
}
