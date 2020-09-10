import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './task.entity';

import { CreateTaskDto } from './dto/createTask.dto';
import { getTasksFilterDto } from './dto/getTasksFilter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { TaskStatus } from './task.enum';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {

    constructor(

        @InjectRepository(TaskRepository)
        private taskRepository:TaskRepository, 
    ) { }

      async getTaskById(id: number, user:User): Promise<Task> {

          const foundTask = await this.taskRepository.findOne({where:{id, userId:user.id}});

          if (!foundTask) {
              throw new NotFoundException(`task with id ${id} not found`);
          }
          return foundTask;

      }
    
      async deleteTask(id: number, user:User){

        // const foundTask = await this.taskRepository.findOne(id);

        // if (!foundTask) {
        //     throw new NotFoundException(`task with id ${id} not found`);
        // }
        //   foundTask.delete();
        const result = await this.taskRepository.delete({ id, userId: user.id })
        
          if (result.affected === 0) {
            throw new NotFoundException(`task with id ${id} not found`);
              
          }
          return result



  }


    
    // private tasks: Task[]=[];
    // getAllTasks(){
    //     return this.tasks;
    // };

    async createTask(createTaskDto: CreateTaskDto, user:User) {
        return this.taskRepository.createTask(createTaskDto, user);

        
    };

  

    async updateTask(id: number, status: TaskStatus, user:User) :Promise<Task>{

        const task =  await this.getTaskById(id,user);
        task.status = status;
        await task.save();
        return task;

    }

    async searchTask(filterDto: getTasksFilterDto, user: User): Promise<Task[]>{

        // const filtered: Task[] = status? this.tasks.filter(task => task.status === status
        //     && (task.title.includes(search) || task.description.includes(search))) :
        //     this.tasks.filter(task=>task.title.includes(search) || task.description.includes(search))
    
        // return filtered
        const res = await this.taskRepository.searchTask(filterDto, user)
        return res
    }

}
