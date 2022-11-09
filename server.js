const { server } = require('./socket')
const port = 8080

server.listen(port, () => {
    console.log('http server on', port)
})
