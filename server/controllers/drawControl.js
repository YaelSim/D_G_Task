module.exports.getDrawingData = async (req, res) => {
    try {
        if(!(req.headers["room"] in serverData)){
            return res.status(200).json({ready: false, data : []})
        }
        return res.status(200).json(serverData[req.headers["room"]].drawing)
        

    } catch (error) {
        console.log(error)
        return res.status(400).send("Error occurred during sending drawing data")
    }
}
module.exports.sendDrawingData = async (req, res) =>{
    try {
        serverData[req.headers["room"]].drawing = {data:req.body, ready:true}
        return res.status(200).send('Drawing sent successfully')
        
    } catch (error) {
        console.log(error)
        return res.status(400).send("Error occurred during upload drawing data")
        
    }
}

module.exports.deleteDrawingData = async (req, res) => {
    try {
        serverData[req.headers["room"]].drawing.data = []
        serverData[req.headers["room"]].drawing.ready = false
        return res.status(200).send('Drawing deleted successfully')
        
    } catch (error) {
        console.log(error)
        return res.status(400).send("Error occurred during deleting drawing data")
    }
}
