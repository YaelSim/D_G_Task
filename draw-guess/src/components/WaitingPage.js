import React from 'react'
import { useEffect } from "react";
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import server from '../serverInfo';
import Typography from '@mui/material/Typography';
import { Button, Box } from '@mui/material';

const WaitingPage = () => {
    var interval
    const navigate = useNavigate()
    const headers = { "room": localStorage.getItem("RoomID"), "name": localStorage.getItem("Name")  }
    const checkIfJoined = async () => {

        interval = setInterval(() => {
            Axios.get(`${server}/users/checkAmountOfPlayers`,
                { headers })
                .then((res) => {
                    console.log(res.data);
                    if (res.data != 1) {
                        clearInterval(interval);
                        if (res.data > 1) {
                            navigate('/choose-word')
                        }
                    }
                }).catch((error) => {
                    const message = error.response ? error.response.data : "Network Error";
                })
        }, 5000);
    }
    useEffect(() => {
        checkIfJoined()
    })
  return (
    <div className="WaitingPage">
        <Box sx={{
        my: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
      <br/>
      <Typography color="blue" variant="h3"> Hello {localStorage.getItem('Name')} </Typography>
      <br/>
      <br/>
      <Typography color="blue" variant="h4"> Wait for another player </Typography>
      <Typography color="blue" variant="h4"> to join :) </Typography>
      <br/>
      <br/>
      <br/>
      <Typography color="blue" variant="h4"> Your Room Number is:</Typography>
      <br/>
      <br/>
      <Typography color="blue" variant="h3">{localStorage.getItem('RoomID')} </Typography>
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

export default WaitingPage