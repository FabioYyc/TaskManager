import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/createTask.dto';
import { getTasksFilterDto } from './dto/getTasksFilter.dto';
import { TaskValidationPipe } from './pipes/task-status-validation.pipe';

@Controller('tasks')
export class TasksController {
constructor(private taskService:TasksService){
}
  @Get('/all')
  getAllTasks(): Task[] {
    return this.taskService.getAllTasks();
  }

  @Post()
  @UsePipes(ValidationPipe) //take the dto and validate data against the dto
  createTask(
   @Body() createTaskDto:CreateTaskDto
  ):Task {
    return this.taskService.createTask(createTaskDto);
  }

  @Get("/:id")
  getTaskById(
    @Param('id') id:string
  ): Task{
    console.log(id)
    return this.taskService.getTaskById(id)
  }

  @Delete("/:id")
  deleteTask(
    @Param('id') id:string
  ) {
    this.taskService.deleteTask(id)
  }
  @Patch('/:id/status')
  updateTask(
    @Param('id') id: string,
    @Body('status', TaskValidationPipe) status:TaskStatus
  ) :Task{
    return this.taskService.updateTask(id, status);
  }


  @Get()
  getTasks(
    @Query(ValidationPipe)filterDto: getTasksFilterDto
  ): Task[] {
    return this.taskService.searchTask(filterDto);
  }


}
