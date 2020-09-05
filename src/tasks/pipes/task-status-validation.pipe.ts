import { PipeTransform, ArgumentMetadata, BadRequestException } from "@nestjs/common";
import { TaskStatus } from "../task.enum";

export class TaskValidationPipe implements PipeTransform{

  
  readonly allowedStatus = [
    TaskStatus.OPEN,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE
  ];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: any, metadata: ArgumentMetadata) {
    
    
    //we want to validate before this return, if valid ,throw exception
    if (this.validateStatus(value)) { 
    value = value.toUpperCase()
    return value;
    }
    throw new BadRequestException(`${value} is an invalid status`);
  };

  private validateStatus(status: any) {
    const index = this.allowedStatus.indexOf(status);

    return index!==-1

  };
  

  
}