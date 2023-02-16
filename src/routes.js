import {randomUUID} from 'node:crypto';
import { buildRoutePath } from '../utils/build-route-path.js';
import { Database } from './database.js';

const database = new Database();

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { search } = req.query;
            
            const tasks = database.select('tasks', {
                title: search,
                description: search
            });

            return res.end(JSON.stringify(tasks));
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const {title, description}=req.body;

            if (!title){
                return res.writeHead(400).end(
                    JSON.stringify({message:"O título da tarefa deve ser preenchido"})
                );
            }

            if (!description){
                return res.writeHead(400).end(
                    JSON.stringify({message:"A descrição da tarefa deve ser preenchida"})
                );
            }

            const task = {
                id: randomUUID(),
                title: title,
                description: description,
                completed_at: null,
                created_at: new Date(),
                updated_at: null
            };

            database.insert('tasks', task);

            return res.writeHead(201).end();
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const {id} = req.params;

            const [task] = database.select('tasks', {id: id});

            if(!task){
                return res.writeHead(400).end(
                    JSON.stringify({message:"Tarefa não existe"})
                );
            }

            const {title, description} = req.body;

            if (!title){
                return res.writeHead(400).end(
                    JSON.stringify({message:"O título da tarefa deve ser preenchido"})
                );
            }

            if (!description){
                return res.writeHead(400).end(
                    JSON.stringify({message:"A descrição da tarefa deve ser preenchida"})
                );
            }

            database.update('tasks', id, {
                title,
                description,
                completed_at: task.completed_at,
                created_at: task.created_at,
                updated_at: new Date(),
            });

            return res.writeHead(204).end();
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const {id} = req.params;

            const [task] = database.select('tasks', {id: id});

            if(!task){
                return res.writeHead(400).end(
                    JSON.stringify({message:"Tarefa não existe"})
                );
            }

            database.delete('tasks', id);

            return res.writeHead(204).end();
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
            const {id} = req.params;

            const [task] = database.select('tasks', {id: id});

            if(!task){
                return res.writeHead(400).end(
                    JSON.stringify({message:"Tarefa não existe"})
                );
            }

            if(task.completed_at){
                return res.writeHead(400).end(
                    JSON.stringify({message:"Tarefa já concluída"})
                );
            }

            database.update('tasks', id, {
                title: task.title,
                description: task.description,
                completed_at: new Date(),
                created_at: task.created_at,
                updated_at: new Date(),
            });

            return res.writeHead(204).end();
        }
    }
]