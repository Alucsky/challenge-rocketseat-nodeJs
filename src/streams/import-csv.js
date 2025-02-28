import { parse } from 'csv-parse'
import fs from 'node:fs'
import { routes } from '../middlewares/routes.js'

const filePath = new URL('./tasks.csv', import.meta.url)

const stream = fs.createReadStream(filePath)

const csvParse = parse({
  delimiter: ',',
  skip_empty_lines: true,
  from_line: 2,
})

const route = routes.find((route) => {
  return route.method === 'POST'
})

async function run() {
  const linesParse = stream.pipe(csvParse)

  for await (const line of linesParse) {
    const [title, description] = line

     await route.handler({ body: { title, description } }, false)

    await wait(1000)
  }
}

run()

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
