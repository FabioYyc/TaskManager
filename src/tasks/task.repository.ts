import { Repository, EntityRepository } from "typeorm";
import { Task } from "./task.entity";
import { CreateTaskDto } from "./dto/createTask.dto";
import { TaskStatus } from "./task.enum";
import { getTasksFilterDto } from "./dto/getTasksFilter.dto";
import { User } from "src/auth/user.entity";
import { InternalServerErrorException, Logger } from "@nestjs/common";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task>{
  private logger: Logger = new Logger('TaskRepository');



  async createTask(createTaskDto: CreateTaskDto,
    user: User) {
    const { title, description } = createTaskDto;

    const task = new Task();
    task.title = title;
    task.description = description;
    task.user = user;
    task.status = TaskStatus.OPEN;

    try {
      await task.save();
    } catch (error) {
      const message = `Failed to save task for user ${user.username}. Task: ${JSON.stringify(createTaskDto)}`
      this.logger.error(message, error.stack);
    }
   
    delete task.user;
    return task;

  }

  async searchTask(filterDto: getTasksFilterDto, user:User) {
    const { search, status } = filterDto;
    const query = this.createQueryBuilder('task');
    query.where('task.userId =:userId', { userId: user.id })
    
    if (search) {
      query.andWhere('task.title LIKE :search OR task.description LIKE :search', { search: `%${search}%` });
    }
    if (status) {
      query.andWhere('task.status = :status', { status });
    }




    try {
      const res = await query.getMany();
      return res;
    } catch (error) {
      const message = `Failed to retrieve tasks for user ${user.username}. Filters: ${JSON.stringify(filterDto)}`
      this.logger.error(message, error.stack);
      throw new InternalServerErrorException();
    }






    return 
}
  
  
}