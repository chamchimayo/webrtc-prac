const { server } = require('./socket')
const port = 3000

server.listen(port, () => {
    console.log('http server on', port)
})
