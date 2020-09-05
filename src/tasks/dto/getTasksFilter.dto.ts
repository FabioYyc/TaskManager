import { TaskStatus } from "../task.enum";
import { IsOptional, IsIn, IsNotEmpty } from "class-validator";

export class getTasksFilterDto {

  @IsOptional()
  @IsIn([TaskStatus.OPEN, TaskStatus.DONE, TaskStatus.IN_PROGRESS])
  status: TaskStatus;

  
  @IsOptional()
  @IsNotEmpty()
  search: string;
  
}
