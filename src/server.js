import http from 'node:http'
import { routes } from './middlewares/routes.js'
import { extractQueryParams } from './utils/extract-query-params.js'
import { json } from './utils/json.js'

const server = http.createServer(async (req, res) => {
  const { method, url } = req

  await json(req, res)

  const route = routes.find((route) => {
    return route.method === method && route.path.test(url)
  })

  if (route) {
    const routeParams = req.url.match(route.path)

    const { query, ...params } = routeParams.groups

    req.params = params
    req.query = query ? extractQueryParams(routeParams.groups.query) : {}

    route.handler(req, res, true)
  }
})

server.listen(4444)
