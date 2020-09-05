import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/createTask.dto';
import { getTasksFilterDto } from './dto/getTasksFilter.dto';
import { TaskValidationPipe } from './pipes/task-status-validation.pipe';
import { TaskStatus } from './task.enum';

@Controller('tasks')
export class TasksController {
constructor(private taskService:TasksService){
}
  // @Get('/all')
  // getAllTasks(): Task[] {
  //   return this.taskService.getAllTasks();
  // }

  @Post()
  @UsePipes(ValidationPipe) //take the dto and validate data against the dto
  createTask(
   @Body() createTaskDto:CreateTaskDto
  ):Promise<Task> {
    return this.taskService.createTask(createTaskDto);
  }

  @Get("/:id")
  getTaskById(
    @Param('id', ParseIntPipe) id:number
  ): Promise<Task>{
    return this.taskService.getTaskById(id)
  }

  @Delete("/:id")
  deleteTask(
    @Param('id', ParseIntPipe) id:number
  ) {
    return this.taskService.deleteTask(id)
  }
  @Patch('/:id/status')
  updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskValidationPipe) status:TaskStatus
  ) :Promise<Task>{
    return this.taskService.updateTask(id, status);
  }


  @Get()
  getTasks(
    @Query(ValidationPipe)filterDto: getTasksFilterDto
  ) {
    return this.taskService.searchTask(filterDto);
  }


}
