import { plugin, type BunPlugin } from "bun";
import { parseArgs } from "util";
import chokidar from 'chokidar'
import { SolidPlugin } from 'bun-plugin-solid';

const DEST_FILE = './dist/editor.js'
const BROWSER_EXTRAS = Bun.file('./.build/browser-extras.js')

const build = async (devPort: null | number = null) => {
  const res = await Bun.build({
    entrypoints: [
      './src/entry-client.ts',
    ],
    plugins: [SolidPlugin()],
  })
  if (!res.success) {
    console.log(res.logs)
  } else {
    for (const output of res.outputs) {
      let sourceParts = [await output.text()]

      if (devPort) {
        // Set up and add browser-extras
        sourceParts = sourceParts.concat([
          `;globalThis.devPort = ${devPort};`,
          await BROWSER_EXTRAS.text(),
        ])
      }
      const source = sourceParts.join('\n')
      Bun.write(DEST_FILE, source)
    }
  }
  console.log('Build done!', res.success ? 'Success' : 'Failed')
  return res.success
}

const rebuild = async (reloadSignal: Function, devPort: number) => {
  const success = await build(devPort)
  if (success) {
    reloadSignal()
  }
  console.log('Waiting...')
}

const getReloadSignal = (devPort: number) => {
  let clients = <any>[]
  const server = Bun.serve({
    port: devPort,
    fetch(req, server) {
      console.log('New reload client request!')
      // upgrade the request to a WebSocket
      if (server.upgrade(req)) {
        return;
      }
      return new Response("Websocket connection failed!", { status: 500 });
    },
    websocket: {
      open(ws) {
        clients.push(ws)
        console.log('[Reload] Added client, total', clients.length)
      },
      close(ws) {
        clients.splice(clients.indexOf(ws), 1)
        console.log('[Reload] Removed client, total', clients.length)
      },
      message(_ws, _message) { /* Not used */ },
    },
  });

  console.log(`Reload-server listening on ${server.url.href}`)

  return () => {
    console.log(`Reloading ${clients.length} clients`)
    clients.forEach(ws => {
      const status = ws.send('Reload!')
      if (status === 0) {
        console.log("Message was dropped");
      } else if (status === -1) {
        console.log("Backpressure was applied");
      } else {
        console.log(`Success! Sent ${status} bytes`);
      }
    })
  }
}

const dev = (devPort: number) => {

  const reloadSignal = getReloadSignal(devPort)

  const watcher = chokidar.watch('./src', {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true,
    usePolling: false,
    ignoreInitial: true,
    awaitWriteFinish: false,
    alwaysStat: false,
  })

  watcher.on('ready', async () => {
    console.log('Ready!')
    rebuild(reloadSignal, devPort)
  })

  watcher.on('change', async (path, details) => {
    console.log('change:', { path });
    rebuild(reloadSignal, devPort)
  })
}

const main = () => {
  const args = parseArgs({
    args: Bun.argv,
    options: {
      "dev-port": {
        type: 'string',
      },
    },
    strict: true,
    allowPositionals: true,
  });

  const devPort = args.values['dev-port'] as unknown as number
  
  const buildConfig:BuildConfig = {}
  
  isNaN(devPort)
    ? build()
    : dev(devPort)

}

main()