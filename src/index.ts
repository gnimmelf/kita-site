import { createApp } from './app'


const bootstrap = async () => {
    const app = createApp({ port: parseInt(process.env.PORT as string) || 3000 })
}

bootstrap();