import React from 'react'
import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router'
import Axios from 'axios'
import server from '../serverInfo'
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { Button, Box, ButtonGroup } from '@mui/material';
import TextField from '@mui/material/TextField';


const GuessWord = () => {
    const navigate = useNavigate()
    const [score, setScore] = useState(0)
    const canvasRef = useRef(null)
    const contextRef = useRef(null)

    const [isReady, setIsReady] = useState(false)
    const [submittedWord, setSubmittedWord] = useState('')
    const [data, setData] = useState([])
    const [isViewing, setisViewing] = useState(false)

    var interval
  
    useEffect(() => {
      getSessionScore()
  }, [])
  
    const getSessionScore = () => {
      Axios.get(`${server}/users/getSessionScore`,
        { headers: { "room": localStorage.getItem("RoomID") } })
        .then((res) => {
            setScore(res.data)
        }).catch((error) => {
          const message = error.response ? error.response.data : "Network Error";
        })
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = 300;
        canvas.height = 300;
        canvas.style.width = `300px`;
        canvas.style.height = `300px`;
        const context = canvas.getContext("2d")
        context.scale(10/9, 10/9)
        context.lineCap = "round";
        context.strokeStyle = "black";
        context.lineWidth = 5
        contextRef.current = context;
        requestData()
    }, [])
    
    const requestData = async () => {
        if (isReady) {
            return
        }
        interval = setInterval(() => {
            Axios.get(`${server}/Draw/getData`,
                { headers: { "room": localStorage.getItem("RoomID") } })
                .then((req) => {
                    if (req.data.ready) {
                        setData(req.data.data);
                        setIsReady(true)
                        clearInterval(interval);
                    }
                }).catch((error) => {
                    const message = error.response ? error.response.data : "Network Error";
                })
        }, 5000);
    }

    const draw = async () => {
        contextRef.current.clearRect(0, 0, contextRef.current.canvas.width, contextRef.current.canvas.height);
        let previous = { time: data[0].time };
        setisViewing(true)
        data.forEach(async (element, i) => {
            setTimeout(() => {
                if (element.start) {
                    contextRef.current.closePath();
                    contextRef.current.beginPath();
                    contextRef.current.moveTo(element.x, element.y);
                }
                else {
                    contextRef.current.lineTo(element.x, element.y);
                    contextRef.current.stroke();
                }
                if (i === data.length - 1) {
                    setisViewing(false)
                }
                previous = element
            }, (element.time - previous.time))
        });
    }
    const handleSubmit = () =>{
        Axios.post(`${server}/Words/receivingSubmitWord`,
        {word:submittedWord},
        { headers: { "room": localStorage.getItem("RoomID") } })
        .then((res)=>{
            const {isMatch} = res.data
            if(isMatch){
                
            }
            else{
               
            }

            navigate('/choose-word')

        }).catch((error) =>{
            const message = error.response ? error.response.data : "Network Error";
        })
    }
  
    return (
      <div className="GuessPage">
          <Box sx={{
        my: 6,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
      <br/>
      <Typography color="blue" variant="h3"> Guess the word </Typography>
      <br/>
      <Typography color="blue" variant="h4"> Score : {score} </Typography>
      <canvas
                style={{ border: `2px solid #000` }}
                ref={canvasRef}
            />
          <br />
          {!isReady ? (<Typography color="blue" variant="h4"> Waiting for the Draw </Typography>) :
            (<div className="GuessPage">
                <Button variant="contained" size="medium" sx={{ ml : 10 }} onClick={draw} disabled={isViewing}>View drawing</Button>
                <div className="GuessPage">
                <br />
                <br />
                <TextField
                 label="Answer"
                size = "small"
                id="The Guess:"
                onChange={(event)=>{setSubmittedWord(event.target.value)}}
                />
                 <Button variant="contained" size="medium" sx={{ ml : 1 }} onClick={handleSubmit} >Submit</Button>
                </div>
            </div>)}
      <br/>
      <br/>
      <br/>
      <br/>
      <Link to="/" style={{ textDecoration: 'none' }}>
      <Button variant="contained" size="small" >Exit</Button>
      </Link>
      </Box>
      </div>
    )
}

export default GuessWord