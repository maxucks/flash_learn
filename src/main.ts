import app from "./controllers"
import { log } from "./dependencies"

Bun.serve({
  fetch: app.fetch,
  port: 3000,
})

log.info("Server running at http://localhost:3000")
