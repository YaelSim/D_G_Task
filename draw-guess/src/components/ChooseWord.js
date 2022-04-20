import React from 'react'
import { useState, useEffect } from "react";
import Axios from 'axios'
import { useNavigate } from 'react-router'
import server from '../serverInfo'
import Typography from '@mui/material/Typography';
import { Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const ChooseWord = () => {
  const [words, setWords] = useState([])

  const navigate = useNavigate()
  useEffect(() => {
      Axios.get(`${server}/Words/getRandomsWords`)
          .then((res) => {
            setWords(res.data)
          }).catch((error) => {
              const message = error.response ? error.response.data : "Network Error";
          })
  }, [])
  const sendWord = (event) => {
      Axios.post(`${server}/Words/receivingChosenWord`, 
      { word: event.currentTarget.textContent },
      { headers: { "room": localStorage.getItem("RoomID") } })
          .then((res) => {
              navigate('/draw-word')
          }).catch((error) => {
              const message = error.response ? error.response.data : "Network Error";
          })
  }
  return (
      <div className='ChooseWord'>
           <Box sx={{
        my: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
      <br/>
      <Typography color="blue" variant="h2"> Choose Word</Typography>
      <br/>
      <br/>
      <br/>
      {words.map((item,i) => {
              return (<div><br />
                  <Button variant="outlined" size="large" sx={{ m: 1 }} onClick={sendWord} key={i}><span>{item}</span></Button>
              </div>
              )
          })}
      <br/>
      <br/>
      <br/>
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

export default ChooseWord