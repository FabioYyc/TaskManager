import { Repository, EntityRepository } from "typeorm";
import { Task } from "./task.entity";
import { CreateTaskDto } from "./dto/createTask.dto";
import { TaskStatus } from "./task.enum";
import { getTasksFilterDto } from "./dto/getTasksFilter.dto";
import { User } from "src/auth/user.entity";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task>{


  async createTask(createTaskDto: CreateTaskDto,
    user: User) {
    const { title, description } = createTaskDto;

    const task = new Task();
    task.title = title;
    task.description = description;
    task.user = user;
    task.status = TaskStatus.OPEN;
    await task.save();
    delete task.user;
    return task;

  }

  async searchTask(filterDto: getTasksFilterDto) {
    const { search, status } = filterDto;
    const query = this.createQueryBuilder('task');
    if (search) {
      query.andWhere('task.title LIKE :search OR task.description LIKE :search', { search: `%${search}%` });
    }
    if (status) {
      query.andWhere('task.status = :status', { status });
    }





    const res = await query.getMany();
    return res;






    return 
}
  
  
}