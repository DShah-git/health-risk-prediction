import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PatientNav from '../Components/PatientNav';

export default function Game() {

    const {gameid} = useParams();

    console.log(gameid);

  return (
    <div>
        <PatientNav isactive="games" />
        <div className='container'>
            { gameid &&
                <div className='game'>
                    <iframe width="100%" height="100%" src={"https://www.addictinggames.com/embed/html5-games/"+gameid} scrolling="no"></iframe>
                </div>
            }
        </div>
    </div>
  )
}
