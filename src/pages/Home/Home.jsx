import './Home.scss'
import { Link } from 'react-router-dom'
import { getLocalStorage, removeLocalStorage } from '../../utils/localStorage'
import Header from '../../components/Header/Header'
import Button from '../../components/Button/Button'
import mainLogo from '../../utils/img/logo.png'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import Footer from '../../components/Footer/Footer';



const Home = () => {
  const dispatch = useDispatch()
  const state = useSelector((state) => state)

  const handleStartNewGame = () => {
    dispatch({type: "startNewGame"})
    // check localStorage
    const rawLocalStorage = getLocalStorage()
    // si il y a quelqueChose dans le localStorage
    if (rawLocalStorage !== null) {
        removeLocalStorage()
      }
    }

    useEffect(() => {
      const rawLocalStorage = getLocalStorage()
      if (state.teams.length <= 1 && rawLocalStorage) {
        dispatch({ type: "setState"})
      }
    }, [dispatch, state])

    if(state.teams.length > 1) {
      return (
        <div id="Home" className="Home">
          <Header/>
          <main className='Home__content'>
            <div className='Home__content__text'>
              <h1>Bienvenue sur <strong>MölkKing</strong></h1>
              <h2>Devenez le King 🤴 (ou la Queen 👸, pas de jaloux-ses) du Mölkky</h2>
            </div>
            <Button elt={"Home"} text='Démarrer une nouvelle partie' size={"medium"} link={"/dashboard"} action={handleStartNewGame}/>
            <Button elt={"Home"} text='Continuer la partie en cours' size={"medium"} link={"/dashboard"}/>
            <div className='Home__content__links'>
            <h3>Liens utiles:</h3>
            <Link to="/skittles" className='navbar__link'>Connaitre le placement initial des quilles</Link>
            <Link to="/rules" className='navbar__link'>Les règles officielles du Mölkky</Link>
          </div>
          </main>
        </div>
      )
    } return (
      <div id="Home" className="Home">
        <Header/>
        <main className='Home__content'>
        <div className='Home__content__text'>
          <h1>Bienvenue sur <img src={mainLogo} alt="logo" className='logo'/> !!</h1>
          <h2>Soyez le King 🤴 (ou la Queen 👸, pas de jaloux-ses) du Mölkky</h2>
        </div>
          <Button elt={"Home"} text='Nouvelle partie' size={"medium"} link={"/dashboard"} action={handleStartNewGame}/>
          <div className='Home__content__links'>
            <h3>Liens utiles:</h3>
            <Link to="/skittles" className='navbar__link'>Connaitre le placement initial des quilles</Link>
            <Link to="/rules" className='navbar__link'>Les règles officielles du Mölkky</Link>
          </div>
        </main>
        <Footer/>
      </div>
    )
}

export default Home