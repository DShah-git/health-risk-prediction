import React from 'react'
import PatientNav from '../Components/PatientNav'
import './game.css'
import game1 from '../../Assets/game1.PNG'
import game2 from '../../Assets/game2.PNG'
import game3 from '../../Assets/game3.PNG'
import { useNavigate } from 'react-router-dom'

export default function Games() {

    const navigate = useNavigate();

    const openGame = (id) =>{
        navigate(`/game/${id}`);
    }

  return (
    <div>
        <PatientNav isactive="games" />
        <div className='container'>

            <div className='indi-game'>
                <img className='game-img' src={game1} alt="" onClick={()=>openGame(22885)} />
                <p className='game-txt'>Munch Monsters - On your mobile or desktop device please use your finger to tap or your mouse to point and click. You are trying to keep the mouth of the monster open for candy and not for shoes.</p>
            </div>

            <div className='indi-game'>
                <img className='game-img' src={game2} alt="" onClick={()=>openGame(23867)} />
                <p className='game-txt'>Stop Drop - Click or tap on the gems that DON'T match the pile at the bottom of the screen. But beware, the pile at the bottom will change once a matching gem hits it.</p>
            </div>

            <div className='indi-game'>
                <img className='game-img' src={game3} alt="" onClick={()=>openGame(24912)} />
                <p className='game-txt'>ARCANDIES GAMEPLAY - Use your mouse to click on and through the various in-game menus. While playing you will use your mouse to move characters to their like-colored portal.</p>
            </div>
            
        </div>
    </div>
  )
}
