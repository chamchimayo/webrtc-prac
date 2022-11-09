const app = require('./app')
const express = require("express")
const http = require('http')
const router = express.Router()
const authMiddleware = require("./middleware/auth_middleware")
// const Room = require('./models/room')
// const RoomHistory = require('./models/room-history')

const server = http.createServer(app)
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        credentials: true,
    },
})

// 방 목록
let roomObjArr = [
    // {
    // 	roomName,
    // 	currentNum,
    // 	users: [
    // 		{
    // 			socketId,
    // 			nickname,
    // 		},
    // 	],
    // },
]

let mediaStatus = {}

const MAXIMUM = 5

// const roomHistoryUpdate = async (roomId) => {
//     const room = await Room.findById(roomId)
//     const numberOfPeopleInRoom = room.numberOfPeopleInRoom
//     const roomHistory = await RoomHistory.findOne({ roomId })
//     if (numberOfPeopleInRoom > roomHistory.maxPeopleNumber) {
//         roomHistory.maxPeopleNumber = numberOfPeopleInRoom
//     }
//     await roomHistory.save()
// }
router.get("/rooms", authMiddleware, (req,res) => {
    io.on('connection', (socket) => {
    let myRoomName = null
    // let email = null

    socket.on('join_room', async (roomName, email) => {
        myRoomName = roomName
        email = "alstjq1826@gmail.com"

        let isRoomExist = false
        let targetRoomObj = null

        if (!mediaStatus[roomName]) {
            mediaStatus[roomName] = {}
        }

        for (let i = 0; i < roomObjArr.length; i++) {
            // 같은 이름의 방 만들 수 없음
            if (roomObjArr[i].roomName === roomName) {
                // 정원 초과
                if (roomObjArr[i].currentNum >= MAXIMUM) {
                    console.log(
                        `${email}이 방 ${roomName}에 입장 실패 (정원 초과)`
                    )
                    // roomObjArr[i].currentNum++
                    // await Room.findByIdAndUpdate(roomName, {
                    //     $inc: { numberOfPeopleInRoom: 1 },
                    // })
                    // await roomHistoryUpdate(roomName)
                    socket.to(myRoomName).emit('exception')
                    socket.emit('reject_join')
                    return
                }
                // 방이 존재하면 그 방으로 들어감
                isRoomExist = true
                targetRoomObj = roomObjArr[i]
                break
            }
        }

        // 방이 존재하지 않는다면 방을 생성
        if (!isRoomExist) {
            targetRoomObj = {
                roomName,
                currentNum: 0,
                users: [],
            }
            roomObjArr.push(targetRoomObj)
        }

        // 어떠한 경우든 방에 참여
        targetRoomObj.users.push({
            socketId: socket.id,
            email,
        })
        console.log("target: ",targetRoomObj)   // targetRoomObj === roomName, currentNum(입장인원수 -1), users
        targetRoomObj.currentNum++

        // await Room.findByIdAndUpdate(roomName, {
        //     $inc: { numberOfPeopleInRoom: 1 },
        // })
        // await roomHistoryUpdate(roomName)

        console.log(
            `${email}이 방 ${roomName}에 입장 (${targetRoomObj.currentNum}/${MAXIMUM})`
        )

        mediaStatus[roomName][socket.id] = {
            screensaver: false,
            muted: false,
        }

        socket.join(roomName)
        socket.emit('accept_join', targetRoomObj.users, socket.id)
        socket.emit('checkCurStatus', mediaStatus[roomName])
    })

    socket.on('ice', (ice, remoteSocketId) => {
        socket.to(remoteSocketId).emit('ice', ice, socket.id)
    })

    socket.on('offer', (offer, remoteSocketId, localNickname) => {
        socket.to(remoteSocketId).emit('offer', offer, socket.id, localNickname)
    })

    socket.on('answer', (answer, remoteSocketId) => {
        socket.to(remoteSocketId).emit('answer', answer, socket.id)
    })

    socket.on('disconnecting', async () => {
        // delete mediaStatus[myRoomName][socket.id]
        if (myNickname && myRoomName) {
            console.log(`${myNickname}이 방 ${myRoomName}에서 퇴장`)
        }
        socket.to(myRoomName).emit('leave_room', socket.id)

        // 나가면서 방의 정보를 업데이트 해주고 나가기
        for (let i = 0; i < roomObjArr.length; i++) {
            if (roomObjArr[i].roomName === myRoomName) {
                const newUsers = roomObjArr[i].users.filter(
                    (user) => user.socketId !== socket.id
                )
                roomObjArr[i].users = newUsers
                roomObjArr[i].currentNum--
                console.log(
                    `방 ${myRoomName} (${roomObjArr[i].currentNum}/${MAXIMUM})`
                )
                break
            }
        }

        // await Room.findByIdAndUpdate(myRoomName, {
        //     $inc: { numberOfPeopleInRoom: -1 },
        // })

        // setTimeout(async () => {
        //     const existRoom = await Room.findById(myRoomName)
        //     if (existRoom?.numberOfPeopleInRoom <= 0) {
        //         await Room.findByIdAndRemove(myRoomName)

        //         const roomHistory = await RoomHistory.findOne({roomId:myRoomName})
        //         roomHistory.deletedAt = new Date()
        //         await roomHistory.save()

        //         const newRoomObjArr = roomObjArr.filter(
        //             (roomObj) => roomObj.currentNum > 0
        //         )
        //         roomObjArr = newRoomObjArr
        //         delete mediaStatus[myRoomName]
        //         console.log(`방 ${myRoomName} 삭제됨`)
        //     }
        // }, 10000)
    })

    // socket.on('emoji', (roomNameFromClient, socketIdFromClient) => {
    //     socket.to(roomNameFromClient).emit('emoji', socketIdFromClient)
    // })

    // socket.on(
    //     'screensaver',
    //     (roomNameFromClient, socketIdFromClient, check) => {
    //         if (!mediaStatus[roomNameFromClient][socketIdFromClient]) {
    //             mediaStatus[roomNameFromClient][socketIdFromClient] = {}
    //         }
    //         mediaStatus[roomNameFromClient][socketIdFromClient].screensaver =
    //             check
    //         socket
    //             .to(roomNameFromClient)
    //             .emit('screensaver', socketIdFromClient, check)
    //     }
    // )

    socket.on('mic_check', (roomNameFromClient, socketIdFromClient, check) => {
        if (!mediaStatus[roomNameFromClient][socketIdFromClient]) {
            mediaStatus[roomNameFromClient][socketIdFromClient] = {}
        }
        mediaStatus[roomNameFromClient][socketIdFromClient].muted = check
        socket
            .to(roomNameFromClient)
            .emit('mic_check', socketIdFromClient, check)
    })

    socket.on('sendYoutubeTime', (time) => {
        socket.emit('sendYoutubeTime', time)
    })
})})


module.exports = { server }
