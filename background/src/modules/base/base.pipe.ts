import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { ValidationError, validate } from "class-validator";
import { isValidIdentificationNumber, isValidPhoneNumber, isValidPoliceNumber } from "@/utils/validate.utils";
@Injectable()
export class BasePipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    const dtoClassName: string = metadata.metatype.name;
    const validDtoNames: string[] = [`CreateBaseDto`, `UpdateBaseDto`];
    if (!validDtoNames.includes(dtoClassName)) {
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
      throw new BadRequestException(`无效的手机号码`);
    }
    if (dtoInstance.police_number && !isValidPoliceNumber(dtoInstance.police_number)) {
      throw new BadRequestException(`无效的警号`);
    }
    return value;
  }
}
