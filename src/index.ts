import { createApp } from './app'

const bootstrap = async () => {
    const app = createApp({ port: 3000, dbfile: './db/mydb.sqlite', recreateDb: true })
}

bootstrap();