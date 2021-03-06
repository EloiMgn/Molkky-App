import './Teams.scss'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getLocalStorage } from '../../utils/localStorage';


const Teams = () => {

  const range = [1, 2, 3]
  const dispatch = useDispatch()
  const state = useSelector((state) => state)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const checkIfTeams = () => {
    if (state.teams.length === 0) {
      const localStorage = JSON.parse(getLocalStorage())
      if(localStorage && localStorage.state.teams.length > 1) {
        dispatch({ type: "setState"})
      }
    }
  }

  const handleDelete = (idx)=> {
    dispatch({type: "deleteTeam", idx: idx})
  }

  useEffect(() => {
    checkIfTeams()
  }, [checkIfTeams])

  return (
    <div id="teams" className="teams">
      {state.teams.map((team, idx) => {
        return (<div className={`team team__${idx}`} key={idx}>
          <div className='team__name'>
          <h2>{team.name}</h2>
          </div>
          <div className='team__datas'>
            <div className='team__datas-score'>
              <p className='team__datas-pts'>{team.score} </p>
              <p>points</p>
            </div>
            <div className='team__datas-fails'>
              {range.map((rangeElem) =>
                team.fails >= rangeElem ? <span key={rangeElem.toString()}>❌</span> : null
              )}
            </div>
            <div className={state.playing? 'hidden' : 'team__delete'} onClick={e => handleDelete(idx)}>
                <div>Supprimer</div>
            </div>
          </div>
        </div>
        )
      })}
    </div>
  )
}

export default Teams


