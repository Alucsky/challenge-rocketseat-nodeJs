import fs from 'node:fs/promises'
import { randomUUID } from 'node:crypto'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf-8')
      .then((data) => {
        this.#database = JSON.parse(data)
      })
      .catch(() => {
        this.#persist()
      })
  }
  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  insert(table, data) {
    const task = {
      id: randomUUID(),
      title: data.title,
      description: data.description,
      completed: null,
      created_at: new Date(),
      updated_at: null,
    }

    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(task)
    } else {
      this.#database[table] = [task]
    }

    this.#persist()

    return task.id
  }
  select(table, search) {
    let data = this.#database[table] ?? []

    this.#persist()

    if (search) {
      data = data.filter((row) =>
        Object.entries(search).every(
          ([key, value]) =>
            value == null ||
            (key === 'id' ? row[key] === value : row[key]?.includes(value))
        )
      )
    }

    return data
  }

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id)

    if (rowIndex > -1) {
      const updatedData = {
        ...this.#database[table][rowIndex],
        title: data.title,
        description: data.description,
        updated_at: new Date(),
        completed: null,
      }

      this.#database[table][rowIndex] = { id, ...updatedData }

      this.#persist()
    }
  }
  delete(table, id) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id)

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1)
      this.#persist()
    }
  }
  patch(table, id) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id)

    if (rowIndex > -1) {
      const updatedData = {
        ...this.#database[table][rowIndex],
        completed: true,
      }

      this.#database[table][rowIndex] = { id, ...updatedData }

      this.#persist()
    }
  }
}
