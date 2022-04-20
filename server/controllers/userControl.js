const maxLimitRooms = 10;
const users = {}

const getAvilableRoom = () => {
    let roomID = Math.floor(Math.random()* maxLimitRooms)+1
    while(roomID in serverData ){
        roomID = Math.floor(Math.random()* maxLimitRooms)+1
    }
    return roomID
}

module.exports.getRoomID = async (req, res) => {
    try {
        if (Object.keys(serverData).length == maxLimitRooms){
            return res.status(400).send("All rooms are occupied!")
        }
        const roomID = getAvilableRoom()
        serverData[roomID] = {drawing:{data:[], ready:false}, PlayersInRoom : 1, chosenWord:"", roundOver : false, SessionScore: 0,}
        return res.status(200).json(roomID)

    } catch (error) {
        console.log(error)
        return res.status(400).send("Error")
    }
}

module.exports.releaseRoom = async (req, res) => {
    try {
        serverData[req.headers['room']].PlayersInRoom -= 1
        if(serverData[req.headers['room']].PlayersInRoom == 0){
            delete serverData[req.headers["room"]]
        }
        return res.status(200).send("Room released successfully")
        
    } catch (error) {
        console.log(error)
        return res.status(400).send("Error occurred during releasing room.")
    }
}
module.exports.joinRoom = async (req, res) => {
    try {
        if(!(req.body.room in serverData)){
            return res.status(500).send("This room is not exist !")
        }
        if(serverData[req.body.room].PlayersInRoom > 1){
            return res.status(500).send("This room is already full")
        }
        serverData[req.body.room].PlayersInRoom = 2;
        return res.status(200).send(req.body.room)
        
    } catch (error) {
        console.log(error)
        return res.status(400).send("Error occurred during joining room.")
    }
}

module.exports.checkAmountOfPlayers =async (req,res) => {
    try {
        if(!(req.headers['room']) in serverData){
            return res.status(200).json(0)    
        }
        return res.status(200).json(serverData[req.headers["room"]].PlayersInRoom)
    } catch (error) {
        //console.log(error)
        return res.status(400).send("Error occurred during checking if second player joined the room.")
    }
}

module.exports.checkIfRoundOver = async (req,res) =>{
    try {
        if(serverData[req.headers['room']].roundOver){
            serverData[req.headers['room']].roundOver = false    
            return res.status(200).send(true)
        }
        return res.status(200).send(false)
    } catch (error) {
        console.log(error);
        return res.status(400).send("Error occurred during checking if the round is over")
    }
}
module.exports.getSessionScore = async (req, res) => {
    try {
        const {SessionScore} = serverData[req.headers['room']]
        return res.status(200).json(SessionScore)    
    } catch (error) {
        return res.status(400).send("Error occurred during get the session score.")

    }
}

module.exports.username = async (req, res) => {
   try{
    users[req.body.room] = req.body.name;
    return res.status(200).send(req.body.name)
   }
   catch(error) {
    console.log(error)
    return res.status(400).send("Error")
   }
}


