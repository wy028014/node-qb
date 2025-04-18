import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { ValidationError, validate } from "class-validator";
import { isValidIdentificationNumber, isValidPhoneNumber } from "@/utils/validate.utils";
@Injectable()
export class UserPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    const validDtoNames: string[] = [`CreateUserDto`, `QueryUserDto`, `UpdateUserDto`];
    if (!metadata.metatype || !validDtoNames.includes(metadata.metatype.name)) {
      return value;
    }
    const dtoInstance: any = plainToInstance(metadata.metatype, value);
    const errors: ValidationError[] = await validate(dtoInstance);
    if (errors.length) {
      throw new BadRequestException(errors);
    }
    return value;
  }
}
