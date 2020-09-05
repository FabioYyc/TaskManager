import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './task.entity';

import { CreateTaskDto } from './dto/createTask.dto';
import { getTasksFilterDto } from './dto/getTasksFilter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { TaskStatus } from './task.enum';

@Injectable()
export class TasksService {

    constructor(

        @InjectRepository(TaskRepository)
        private taskRepository:TaskRepository, 
    ) { }

      async getTaskById(id: number): Promise<Task> {

          const foundTask = await this.taskRepository.findOne(id);

          if (!foundTask) {
              throw new NotFoundException(`task with id ${id} not found`);
          }
          return foundTask;

      }
    
      async deleteTask(id: number){

        // const foundTask = await this.taskRepository.findOne(id);

        // if (!foundTask) {
        //     throw new NotFoundException(`task with id ${id} not found`);
        // }
        //   foundTask.delete();
          const result = await this.taskRepository.delete(id)
          console.log(result)
          if (result.affected === 0) {
            throw new NotFoundException(`task with id ${id} not found`);
              
          }
          return result



  }


    
    // private tasks: Task[]=[];
    // getAllTasks(){
    //     return this.tasks;
    // };

    async createTask(createTaskDto: CreateTaskDto) {
        return this.taskRepository.createTask(createTaskDto);

        
    };

  
    // deleteTask(id: string) {
        
    //     // eslint-disable-next-line @typescript-eslint/no-unused-vars
    //     const foundTask = this.getTaskById(id);
    //     this.tasks = this.tasks.filter(task=> task.id !==id)
    // }

    async updateTask(id: number, status: TaskStatus) :Promise<Task>{

        const task =  await this.getTaskById(id);
        task.status = status;
        await task.save();
        return task;

    }

    async searchTask(filterDto: getTasksFilterDto): Promise<Task[]>{

        // const filtered: Task[] = status? this.tasks.filter(task => task.status === status
        //     && (task.title.includes(search) || task.description.includes(search))) :
        //     this.tasks.filter(task=>task.title.includes(search) || task.description.includes(search))
    
        // return filtered
        const res = await this.taskRepository.searchTask(filterDto)
        return res
    }

}
