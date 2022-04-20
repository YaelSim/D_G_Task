import React from 'react'
import { useState } from "react";
import Axios from 'axios'
import { useNavigate } from 'react-router-dom'
import server from '../serverInfo'
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { Button, Box } from '@mui/material';

const Welcome = () => {
  const [name, setName] = useState('')
  const [room, setRoom] = useState('')
  const navigate = useNavigate()

  const requestNewRoom = () =>{
    Axios.post(`${server}/users/username`, {name}, {room})
  .then((res)=>{
    localStorage.setItem('Name', res.data)
}).catch((error)=>{
    const message = error.response ? error.response.data : "Network Error";
});
    Axios.get(`${server}/users/getRoomID`)
    .then((res)=>{
      localStorage.setItem('RoomID', res.data)
      navigate('/wait')
  }).catch((error)=>{
      const message = error.response ? error.response.data : "Network Error";
  });
}

const joinRoom = () =>{
  Axios.post(`${server}/users/joinRoom`, {room})
  .then((res) =>{
    localStorage.setItem('RoomID', res.data)
    navigate('/guess-word')
  })
  .catch((error) =>{
    const message = error.response ? error.response.data : "Network Error";
  });
}

  return (
    <div className='WelcomePage'>
      <Box sx={{
        my: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
      <Typography color="blue" variant="h2"> Welcome </Typography>
      <Typography color="blue" variant="h4"> To </Typography>
      <Typography color="blue" variant="h3"> Draw and Guess </Typography>
      
      <br/>
      <TextField
          label="Name"
          size = "small"
          id="name"
          name="name"
          onChange={(event)=>{setName(event.target.value)}}
        />
        <br/>
      <Button variant="contained" onClick={requestNewRoom}>Create new Game</Button>
        <br/>
         <TextField
          label="Room number"
          size = "small"
          id="room"
          name="room"
          onChange={(event)=>{setRoom(event.target.value)}}
        />
        <br/>
        <Button variant="contained" onClick={joinRoom}>Start Exists Game</Button>
      </Box>
    </div>
  )
}

export default Welcome