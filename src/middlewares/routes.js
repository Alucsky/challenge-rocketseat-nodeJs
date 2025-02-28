import { Database } from './database.js'
import { buildRoutePath } from '../utils/build-route-path.js'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const tasks = database.select('tasks')
      return res.end(JSON.stringify(tasks))
    },
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res, haveHas) => {
      const { title, description } = req.body

      if (!title || !description) {
        if (haveHas) {
          return res
            .writeHead(400)
            .end('Os dados fornecidos não são válidos ou falta informações')
        } else {
          return console.log(
            'Os dados fornecidos não são válidos ou falta informações'
          )
        }
      }

      database.insert('tasks', { title: title, description: description })

      if (haveHas) {
        return res.writeHead(201).end('criado com sucesso')
      } else {
        return console.log('criado com sucesso')
      }
    },
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { title, description } = req.body
      const { id } = req.params

      if (!title || !description) {
        return res
          .writeHead(400)
          .end('Os dados fornecidos não são válidos ou falta informações')
      }

      const [task] = database.select('tasks', { id })

      if (!task) {
        return res.writeHead(404).end('o id enviado nao existe')
      }

      database.update('tasks', id, {
        title: title,
        description: description,
      })

      return res.writeHead(201).end('atualizado com sucesso')
    },
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      const [task] = database.select('tasks', { id })

      if (!task) {
        return res.writeHead(404).end('o id enviado nao existe')
      }
      database.delete('tasks', id)

      return res.writeHead(201).end('deletado com sucesso')
    },
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params

      const [task] = database.select('tasks', { id })

      if (!task) {
        return res.writeHead(404).end('o id enviado nao existe')
      }

      database.patch('tasks', id)

      return res.writeHead(201).end('atualizado com sucesso')
    },
  },
]

/* 
- `id` - Identificador único de cada task
- `title` - Título da task
- `description` - Descrição detalhada da task
- `completed_at` - Data de quando a task foi concluída. O valor inicial deve ser `null`
- `created_at` - Data de quando a task foi criada.
- `updated_at` - Deve ser sempre alterado para a data de quando a task foi atualizada.

- `POST - /tasks`
- `GET - /tasks`
- `PUT - /tasks/:id`
- `DELETE - /tasks/:id`      
- `PATCH - /tasks/:id/complete`
*/
