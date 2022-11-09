const express = require("express");
const connect = require("./models");
const cors = require("cors");
const routers = require("./routes/index");
const socketRouter = require("./socket.js")
// const roomsRouter = require("./routes/room");
// const swaggerUi = require('swagger-ui-express')
// const YAML = require('yamljs')
// const swaggerDocument = YAML.load('./api/openapi.yaml')

// require('dotenv').config()
// 개발 환경에서는 사용할 필요가 없으므로 배포 환경일 때만 적용하면 됨
// hpp:HTTP 매개변수 오염 공격으로부터 보호하는 Express 미들웨어
// const helmet = require('helmet')
// const hpp = require('hpp')
// const rateLimit = require('express-rate-limit')

const app = express();
connect();

app.use(cors({ option: "*" })); // origin 추가
// app.use(helmet())
// app.use(hpp())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// 1분동안 하나의 ip 주소에서 들어오는 request의 숫자를 100회로 제한
// app.use(
//     rateLimit({
//         windowMs: 1 * 60 * 1000,
//         max: 100,
//     })
// )
// Request log
// app.use((req, res, next) => {
//     if (req.originalUrl === '/') return next()
//     console.log(
//         'Request URL:',
//         `[${req.method}]`,
//         req.originalUrl,
//         ' - ',
//         new Date().toLocaleString(),
//         req.ip
//     )
//     next()
// })

app.use("/", routers);
app.use("/room", socketRouter)
// 클라이언트에 error 내용 전송
app.use((err, req, res, next) => {
  res.status(400).send({ errorMessage: err });
});

//Swagger api
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

module.exports = app;
