import React from 'react'
import { useEffect, useState, useRef } from 'react'
import Axios from 'axios'
import server from '../serverInfo'
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { Button, Box, ButtonGroup } from '@mui/material';

const DrawWord = () => {
  const canvasRef = useRef(null)
  const contextRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [data, setData] = useState([])
  const [isSent, setIsSent] = useState(false)
  const [chosenWord, setChosenWord] = useState('')
  const [sessionScore, setSessionScore] = useState(0)
  const navigate = useNavigate()
  var interval
  

  useEffect(() => {
    getChosenWord()
    getSessionScore()
  }, [])


  const getChosenWord = () => {
    Axios.get(`${server}/Words/getChosenWord`,
      { headers: { "room": localStorage.getItem("RoomID") } })
      .then((res) => {
        setChosenWord(res.data.word)
      }).catch((error) => {
        const message = error.response ? error.response.data : "Network Error";
      })
  }

  const getSessionScore = () => {
    Axios.get(`${server}/users/getSessionScore`,
      { headers: { "room": localStorage.getItem("RoomID") } })
      .then((res) => {
        setSessionScore(res.data)
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
      context.scale(10 / 9, 10 / 9)
      context.lineCap = "round";
      context.strokeStyle = "black";
      context.lineWidth = 5
      contextRef.current = context;
      document.body.style.overflow = "hidden";
  }, [])
  // Mouse Listener
  const startDrawing = (nativeEvent) => {
      const { clientX, clientY } = nativeEvent;
      const offsetX = clientX - canvasRef.current.offsetLeft
      const offsetY = clientY - canvasRef.current.offsetTop
      contextRef.current.beginPath();
      setIsDrawing(true)
      let date = new Date()
      setData([...data, { x: offsetX, y: offsetY, start: true, time: date.getTime() }])
  }
  const finishDrawing = () => {
      contextRef.current.closePath();
      setIsDrawing(false)
  }
  const moveDrawing = ({ nativeEvent }) => {
      if (!isDrawing) {
          return;
      }
      const { offsetX, offsetY } = nativeEvent;
      contextRef.current.lineTo(offsetX, offsetY)
      contextRef.current.stroke()
      let date = new Date()
      setData([...data, { x: offsetX, y: offsetY, start: false, time: date.getTime() }])
  }
  // Touch Listener
  const startDrawingTouch = (nativeEvent) => {
      const { pageX, pageY } = nativeEvent.changedTouches[0];
      const offsetX = pageX - canvasRef.current.offsetLeft
      const offsetY = pageY - canvasRef.current.offsetTop
      contextRef.current.beginPath();
      contextRef.current.moveTo(offsetX, offsetY);
      setIsDrawing(true)
      let date = new Date()
      setData([...data, { x: offsetX, y: offsetY, start: true, time: date.getTime() }])
  }
  const moveDrawingTouch = (nativeEvent) => {
      const { pageX, pageY } = nativeEvent.changedTouches[0];
      const offsetX = pageX - canvasRef.current.offsetLeft
      const offsetY = pageY - canvasRef.current.offsetTop
      contextRef.current.lineTo(offsetX, offsetY)
      contextRef.current.stroke()
      let date = new Date()
      setData([...data, { x: offsetX, y: offsetY, start: false, time: date.getTime() }])
  }

  const finishDrawingTouch = (nativeEvent) => {
      contextRef.current.closePath();
  }
  // handlers
  const handleClear = () => {
      contextRef.current.clearRect(0, 0, contextRef.current.canvas.width, contextRef.current.canvas.height);
      setData([]);
  }
  const handleSendingData = () => {
      Axios.post(`${server}/Draw/sendData`,
          data,
          { headers: { "room": localStorage.getItem("RoomID") } })
          .then((res) => {
              setIsSent(true)
              checkIfRoundOver()
          }).catch((error) => {
              const message = error.response ? error.response.data : "Network Error";
          })
  }

  const checkIfRoundOver = () => {
      interval = setInterval(() => {
          Axios.get(`${server}/users/checkIfRoundOver`,
              { headers: { "room": localStorage.getItem("RoomID") } })
              .then((res) => {
                  if (res.data) {
                      clearInterval(interval);
                      navigate('/guess-word')
                  }
              }).catch((error) => {
                  const message = error.response ? error.response.data : "Network Error";
              })
      }, 5000);
  }

  return (
      <div className="Draw">
        <Box sx={{
        my: 6,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
      <br/>
      <Typography sx={{ ml: 1 }} color="blue" variant="h3">  The word you need to draw is: </Typography>
      <br/>
      <Typography color="blue" variant="h2"> "{chosenWord}" </Typography>
      <br/>
      <Typography color="blue" variant="h4"> Score : {sessionScore} </Typography>
      <canvas
              style={{ border: `2px solid #000` }}
              onMouseDown={startDrawing}
              onMouseUp={finishDrawing}
              onMouseMove={moveDrawing}
              onTouchStart={startDrawingTouch}
              onTouchMove={moveDrawingTouch}
              onTouchEnd={finishDrawingTouch}
              ref={canvasRef}
          />
          <br />
          <ButtonGroup variant="contained" size="medium" sx={{ boxShadow: 0 }} >
          <Button sx={{ mr : 3 }} onClick={handleClear} disabled={isSent}>clear</Button>
          <Button sx={{ ml: 3 }} onClick={handleSendingData} disabled={isSent}>send</Button>
          </ButtonGroup>
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

export default DrawWord