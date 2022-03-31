import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router'
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import './Game.scss'
import Button from '../../components/Button/Button'
import Skittles from '../../components/Skittles/Skittles';
import PlayingDatas from '../../components/PlayingDatas/PlayingDatas';
import { useCallback, useEffect, useState } from 'react';
import { setLocalStorage } from '../../utils/localStorage';
import Teams from '../../components/Teams/Teams';
import Title from '../../components/Title/Title';
import Subtitle from '../../components/Subtitle/Subtitle';
import QuantityPicker from '../../components/QuantityPicker/QuantityPicker';
import Modale from '../../components/Modale/Modale';

const Game = () => {
  const { id, playerId } = useParams();
  const state = useSelector((state) => state)

  const navigate= useNavigate()
  const dispatch = useDispatch()

  const [nextTeam, setNextTeam] = useState('')
  const [nextTeamId, setNextTeamId] = useState('')

  const [previousTeamId, setPreviousTeamId] = useState(null)
  const [quantity, setQuantity] = useState(0)

  const [infos, setInfos] = useState(false)
  const explicationsInfos = "Pour calculer vos points vous pouvez sélectionner la ou les quilles tombées directement sur le schéma. Sinon, si vous avez fait tomber plus d'une quille, entrez le nombre total de quille tombée dans la zone prévue à cet effet puis cliquez sur 'equipe suivante' pour confirmer"

// == Handle recovering datas from localstorage if page refreshment ==
  useEffect(() => {
    if (state.teams.length > 1) {
      setLocalStorage({ date: new Date(), state })
    } else if (state.teams.length <= 1) {
      dispatch({ type: "setState"})
    }
  }, [dispatch, id, state])

// === Set the next Team to show ====
  useEffect(() => {
// == Si pas dernière team affichée : ==
    if (parseInt(id) !== state.teams.length-1 && state.teams[parseInt(id)+1]){

          if(!state.teams[parseInt(id)+1].eliminated){

            setNextTeam(state.teams[parseInt(id)+1])
            setNextTeamId(parseInt(id)+1)
          } else {
            for (let j = 0; j < state.teams.length; j++) {
              if(!state.teams[j].eliminated && j>parseInt(id)){
                setNextTeam(state.teams[j])
                setNextTeamId(j)
                break
              }
            }
          }
          //== Si dernière team affichée : ===
      } else if(parseInt(id) === state.teams.length-1 &&state.teams[0]) {

          if(!state.teams[0].eliminated){
            setNextTeam(state.teams[0])
            setNextTeamId(0)
          } else {
            for (let j = 0; j < state.teams.length; j++) {
              if(!state.teams[j].eliminated){
                setNextTeam(state.teams[j])
                setNextTeamId(j)
                break
              }
            }
          }
        }
  }, [id, state.teams])



// == Vérifie si la Team précédente a raté 3 lancés d'affilé ==
  const checkFails = (previousTeam) => {
    if(previousTeam.fails === 3){
      if (state.options.elimination){
        dispatch({type: "eliminateTeam", teamId: previousTeamId, team: previousTeam})
      } else {
        dispatch({type: "resetScore", team: previousTeamId})
        dispatch({type: "resetFails", team: previousTeamId})
      } 
    }
  }

// == Vérifie si la Team précédente a dépassé le score maximum ==
  const checkIfExceedsScore = (previousTeam) => {
    if (previousTeam.score > 50) {
      dispatch({type: "resetScore", team: previousTeamId})
      dispatch({type: "resetFails", team: previousTeamId})
    }
  }


// == Si la Team précédente a atteint le score palier (moitié du score max) ==
  const checkIfLevel = (previousTeam) => {
    if (previousTeam.score >= 25){
      dispatch({type: "setLevel", team: previousTeamId})
    }
  }

//== Si la team précédente atteint un score identique à l'une des autres équipes, l'autre équipe retombe au score palier ==
  const checkIfScoreEqual = (previousTeam) => {
    for (let i = 0; i < state.teams.length; i++) {
      if(previousTeam.score === state.teams[i].score && previousTeam !== state.teams[i]){
        dispatch({type: "resetScore", team: i})
      }
    } 
  }

//== Vérifie si une team est gagnante ==
  const checkIfwinner = (previousTeam) => {
    if(previousTeam.score === 50){
      dispatch({type: "setWinner", team: previousTeamId})
      navigate(`/winner/${previousTeamId}`, { replace: true })
    }
  }

  //== Vérifie si toutes les team moins 1 ont été eliminées et set la dernière team gagnante ==
  const checkIfAllTeamsEliminated = () => {
    if(state.teams.length-state.eliminatedTeams.length === 1) {
      state.teams.forEach((team, i) => {
        if(!team.eliminated){
          dispatch({type: "setWinner", team: i})
          navigate(`/winner/${i}`, { replace: true })
          }
        })
      }
  }


useEffect(() => {

  const handleStateManagment = (previousTeam) => {
    checkFails(previousTeam)
    checkIfExceedsScore(previousTeam)
    checkIfLevel(previousTeam)
    checkIfwinner(previousTeam)
    checkIfAllTeamsEliminated()
    if(state.options.egalisation) {
      checkIfScoreEqual(previousTeam)
    }
  }
  if(previousTeamId !== null){
    handleStateManagment(state.teams[previousTeamId])
  }
},)


const handleResetSkittles = () => {
  dispatch({type: "resetSkittles"})
  setQuantity(0)
}

const openModal = ()=> {
  setInfos(true)
}

const handleNextTeam = (i) => {
  navigate(`/game/${nextTeam.name}/${nextTeamId}/${nextTeam.players[nextTeam.playerTurn]}`, { replace: true })
  dispatch({type: "nextPlayer", team: parseInt(id)})
  dispatch({type: "setTurn", team: i})
  calculateScore()
  handleResetSkittles()
  setPreviousTeamId(i)
}

  const calculateScore = () => {
    const falledPins = []
    state.pins.forEach(skittle => {
      if (skittle.value === true) {
        falledPins.push(skittle)
      }
    })
    if (falledPins.length === 0 && quantity === 0) {
      dispatch({type: "fail", team: id, player: playerId})
    }
    if (falledPins.length === 1 && quantity === 0) {
      dispatch({type: "scored", score: falledPins[0].id, team: id, player: playerId})
      dispatch({type: "unFail", team: id})
    }
    if (falledPins.length > 1 && quantity === 0) {
      dispatch({type: "scored", score: falledPins.length, team: id, player: playerId})
      dispatch({type: "unFail", team: id})
    }
    if (falledPins.length === 0 && quantity > 0) {
      dispatch({type: "scored", score: quantity, team: id, player: playerId})
      dispatch({type: "unFail", team: id})
    }
  }
// ============================ DESKTOP ===========================================================================================
  if(window.innerWidth>767) {
    return (
      state.teams.map((team, i) => {
        if (i.toString() === id) {
          return (
            <main className={`team${i+1} Game__content`} key={i}>
              {window.innerWidth>767 && 
                <section className='Game__content__dashboard'>
                  <Title text={'Scores'}/>
                  <Teams/>
                  <div className='separator'></div>
                  <PlayingDatas team={team}/>
                  <PlayingDatas team={state.teams[previousTeamId]} previousTeam/>
                </section>
              }
              <section className='Game__content__playingArea'>
              <Title text={'Partie en cours'}/>
              <Subtitle text={`Equipe : ${team.name}`}/>
              {quantity===0 && <Skittles color={state.teams[i].color} setQuantity={setQuantity}/>}
                <div className='select__text' style={{backgroundColor: `${state.teams[i].color}`}}>
                  <p>Sélectionnez sur le schéma les quilles tombées ou entrez le nombre de quilles tombées puis cliquez sur "Equipe suivante" pour valider</p>
                </div>
                <QuantityPicker quantity={quantity} setQuantity={setQuantity}/>
                <div className='navBtns'>
                  <Button text='Equipe suivante'action={e => handleNextTeam(i)} ico={'fas fa-share'} animation/>
                </div>

              </section>
          </main>
          )
        } 
        return null
      })
    )
  } 

  // ============================ MOBILE ===========================================================================================
  else if (window.innerWidth < 765) {
    return (
      state.teams.map((team, i) => {
        if (i.toString() === id) {
          return (
            <main className={`team${i+1} Game__content`} key={i}>

              {/* <Modale title={'Comment jouer ?'} text={explicationsInfos} setModal={setInfos}/> */}
              {infos && <Modale title={'Comment jouer ?'} text={explicationsInfos} setModal={setInfos}/>}
              <section className='Game__content__playingArea'>
              <PlayingDatas team={team}/>
              {quantity===0 && <Skittles color={state.teams[i].color} setQuantity={setQuantity}/>}
              <QuantityPicker quantity={quantity} setQuantity={setQuantity}/>
              <div className='navBtns'>
                <Button text='Equipe suivante'action={e => handleNextTeam(i)} ico={'fas fa-share'} animation/>
              </div>
              <div className='subtitle__infos' onClick={openModal}>
                  <h2>Comment jouer ?</h2> 
                  <i className="fas fa-question-circle" ></i>
              </div>
              <PlayingDatas previousTeam team={state.teams[previousTeamId]}/>
              </section>
          </main>
          )
        } 
        return null
      })
    )
  }
}

export default Game