import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDto } from './dto/createTask.dto';
import { getTasksFilterDto } from './dto/getTasksFilter.dto';

@Injectable()
export class TasksService {
    private tasks: Task[]=[];
    getAllTasks(){
        return this.tasks;
    };

    createTask(createTaskDto:CreateTaskDto){
        const { title, description } = createTaskDto;
        const task: Task = {
            title,
            description,
            status: TaskStatus.OPEN,
            id: uuidv4()
        };

    
        this.tasks.push(task);
        return task;
    };

    getTaskById(id: string): Task {

        const foundTask: Task = this.tasks.find(task => id === task.id)
        console.log(foundTask)
        if (!foundTask) { throw new NotFoundException("Task with the id not found") }
        return foundTask
    }

    deleteTask(id: string) {
        
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const foundTask = this.getTaskById(id);
        this.tasks = this.tasks.filter(task=> task.id !==id)
    }

    updateTask(id: string, status: TaskStatus) {

        this.tasks.map(task => {
            if(task.id === id){task.status = status}
        })
    
        return this.getTaskById(id)
    }

    searchTask(filterDto: getTasksFilterDto) {
        const { search, status } = filterDto;

        const filtered: Task[] = status? this.tasks.filter(task => task.status === status
            && (task.title.includes(search) || task.description.includes(search))) :
            this.tasks.filter(task=>task.title.includes(search) || task.description.includes(search))
    
        return filtered
    }

}
