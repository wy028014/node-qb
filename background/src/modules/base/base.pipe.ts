import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { ValidationError, validate } from "class-validator";
import { isValidIdentificationNumber, isValidPhoneNumber, isValidPoliceNumber } from "@/utils/validate.utils";

@Injectable()
export class BasePipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    const validDtoNames = ['CreateBaseDto', 'UpdateBaseDto'];
    if (!metadata.metatype || !validDtoNames.includes(metadata.metatype.name)) {
      return value;
    }

    const dtoInstance = plainToInstance(metadata.metatype, value);
    const validationErrors = await this.validateDto(dtoInstance);
    if (validationErrors.length > 0) {
      throw new BadRequestException(validationErrors);
    }

    const customValidationErrors = this.validateCustomFields(dtoInstance);
    if (customValidationErrors.length > 0) {
      throw new BadRequestException(customValidationErrors);
    }

    return value;
  }

  private async validateDto(dtoInstance: any): Promise<string[]> {
    const errors = await validate(dtoInstance);
    return errors.map(error => this.formatValidationError(error));
  }

  private formatValidationError(error: ValidationError): string {
    return Object.values(error.constraints || {}).join(', ');
  }

  private validateCustomFields(dtoInstance: any): string[] {
    const errors: string[] = [];
    if (dtoInstance.identification_number && !isValidIdentificationNumber(dtoInstance.identification_number)) {
      errors.push('无效的身份证号码');
    }
    if (dtoInstance.phone_number && !isValidPhoneNumber(dtoInstance.phone_number)) {
      errors.push('无效的手机号码');
    }
    if (dtoInstance.police_number && !isValidPoliceNumber(dtoInstance.police_number)) {
      errors.push('无效的警号');
    }
    return errors;
  }
}    