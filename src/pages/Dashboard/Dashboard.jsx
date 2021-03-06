import './Dashboard.scss'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import Button from '../../components/Button/Button'
import Teams from '../../components/Teams/Teams';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { getLocalStorage, setLocalStorage } from '../../utils/localStorage'

const Dashboard = () => {
const [enoughPlayers, setEnoughPlayers] = useState(false)
const [localStorageAvailable, setIsLocalStorageAvailable] = useState(true)
const dispatch = useDispatch()

  /**
   * Check availability to use localStorage
   */
   const isLocalStorageAvailable = () => {
    const test = 'test'
    try {
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      setIsLocalStorageAvailable(true)
    } catch (e) {
      setIsLocalStorageAvailable(false)
    }
  }

  useEffect(() => {
    isLocalStorageAvailable()
    const localStorage = JSON.parse(getLocalStorage())
    if (localStorageAvailable && localStorage && localStorage.state.teams.length === state.teams.length) {
      dispatch({ type: "setState"})
    }
  }, [dispatch])

  
  const handleStartGame = () => {
      dispatch({ type: "startGame"})
      setNewLocalStorage()
  }
  const state = useSelector((state) => state)

  const setNewLocalStorage = () => {
    setLocalStorage({ date: new Date(), state })
  }

useEffect(() => {
  state.teams.length >= 2 ? setEnoughPlayers(true) : setEnoughPlayers(false)
}, [state])

console.log(state);

    return (
      <div id="Dashboard" className="Dashboard">
        <Header/>
        <main className='Dashboard__content'>
          <div className='Dashboard__teams'>
            <h1 className='Dashboard__title'>Equipes:</h1>
            <Teams/>
            <div className={state.playing?  'hidden' : 'Dashboard__createTeamBtn'}>
              <Button elt={"Dashboard"} className='Dashboard__btn' text={"Ajouter une nouvelle équipe"} link={"/new-team"} size={"small"} ico={"fas fa-plus-circle"}/>
            </div>
          </div>
          {state.teams.length > 1? 
            <div className='Dashboard__startGame'>
              {enoughPlayers && !state.playing && <Button elt={"Dashboard"} className='Dashboard__btn' text={"Commencer à jouer"} link={`/game/${state.teams[0].name}/1/${state.teams[0].players[0]}`} size={"small"} action={handleStartGame} />}
              {state.playing && <Button elt={"Dashboard"} className='Dashboard__btn' text={'Continuer la partie'} link={`/game/${state.teams[state.turn - 1].name}/${state.turn}/${state.teams[state.turn - 1].players[state.teams[state.turn - 1].playerTurn]}`} size={"small"} />}
            </div>
            : null
          }
        </main>
        <Footer/>
      </div>
    )
}

export default Dashboard