import { describe, expect, it } from 'bun:test'
import { createApp } from '../src/app';

const app = createApp({ port: 4000 })

describe('Server', () => {
    it('returns a response', async () => {

        const response = await app
            .handle(new Request('http://localhost/'))
            .then((res: Response) => res.text())

        expect(response).toContain('Theme')
    })
})

describe('Database', () => {
    it('is connected', async () => {
        const response = await app
            .handle(new Request('http://localhost/'))
            .then((res: Response) => res.text())

        expect(response).toContain('Theme')
    })
})