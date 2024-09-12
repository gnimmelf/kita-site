import { isDev } from "./lib/utils";
import { createApp } from './app'

const main = async () => {
    const app = await createApp()

    const config = {
        port: parseInt(process.env.PORT as string) || 3000,
        tls: {
            cert: Bun.env.TLS_KEY_FILE && Bun.file(Bun.env.TLS_CERT_FILE!),
            key: Bun.env.TLS_KEY_FILE && Bun.file(Bun.env.TLS_KEY_FILE!)
        }
    }

    app.listen(config)

    console.log(
        `🦊 Elysia (${isDev() ? 'dev' : 'prod'}) is running at ${app.server?.protocol}://${app.server?.hostname}:${app.server?.port}`
    );
    console.log('With features', process.features)
}

main();