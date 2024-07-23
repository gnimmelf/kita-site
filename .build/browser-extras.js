

(function (devPort) {
    console.log({ devPort })
    // Connect to local dev-server
    const url = `ws://localhost:${devPort}`

    console.log(`[dev-socket] ${url}`)

    const ws = new WebSocket(url)
    ws.onopen = (event) => {
        console.log(`[dev-socket] ${event.type}`)
    }

    ws.onmessage = ({ data }) => {
        if (data?.toLowerCase() === 'reload!') {
            window.location.reload()
        }
    }
})(globalThis.devPort | 3004);