import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards, Logger } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/createTask.dto';
import { getTasksFilterDto } from './dto/getTasksFilter.dto';
import { TaskValidationPipe } from './pipes/task-status-validation.pipe';
import { TaskStatus } from './task.enum';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TaskController')
constructor(private taskService:TasksService){
}
  // @Get('/all')
  // getAllTasks(): Task[] {
  //   return this.taskService.getAllTasks();
  // }

  @Post()
  @UsePipes(ValidationPipe) //take the dto and validate data against the dto
  createTask(

    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user:User
  ): Promise<Task> {
    this.logger
      .verbose(`User ${user.username} created task, task :${JSON.stringify(createTaskDto)}`)
    return this.taskService.createTask(createTaskDto, user);
  }

  @Get("/:id")
  getTaskById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user:User
  ): Promise<Task>{
    return this.taskService.getTaskById(id, user)
  }

  @Delete("/:id")
  deleteTask(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user:User
  ) {
    return this.taskService.deleteTask(id, user)
  }


  @Patch('/:id/status')
  updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskValidationPipe) status: TaskStatus,
    @GetUser() user:User
  ) :Promise<Task>{
    return this.taskService.updateTask(id, status,user);
  }


  @Get()
  getTasks(
    @Query(ValidationPipe) filterDto: getTasksFilterDto,
    @GetUser() user : User
    
  ) {
    this.logger
      .verbose(`User ${user.username} retrieving all tasks, filters :${JSON.stringify(filterDto)}`)
    return this.taskService.searchTask(filterDto, user);
  }


}
