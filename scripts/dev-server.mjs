import net from 'node:net'
import { spawn } from 'node:child_process'

const DEFAULT_PORT = 3000
const port = Number(process.env.PORT || DEFAULT_PORT)

const checkPortAvailable = (targetPort) =>
  new Promise((resolve, reject) => {
    const server = net.createServer()

    server.once('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        resolve(false)
        return
      }

      reject(error)
    })

    server.once('listening', () => {
      server.close(() => resolve(true))
    })

    server.listen(targetPort, '0.0.0.0')
  })

const isAvailable = await checkPortAvailable(port)

if (!isAvailable) {
  console.error(
    `Port ${port} is already in use. Stop the existing dev server or run with a different port, for example: PORT=3001 npm run dev`
  )
  process.exit(1)
}

const child = spawn('node', ['./node_modules/next/dist/bin/next', 'dev', '--port', String(port)], {
  stdio: 'inherit',
  env: process.env,
})

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
    return
  }

  process.exit(code ?? 0)
})
