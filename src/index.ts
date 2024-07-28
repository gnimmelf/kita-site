import { createApp } from './app'


const bootstrap = async () => {
    const app = createApp({ port: process.env.PORT || 3000 })
}

bootstrap();