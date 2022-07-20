import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import NumberPicker from 'react-widgets/NumberPicker';
import { setLocalStorage } from '../../utils/localStorage';
import { shuffleArray } from '../../utils/tools';
import Button from '../Button/Button';
import Options from '../Options/Options';
import Player from '../Player/Player';
import PlayerForm from '../PlayerForm/PlayerForm';
import Teams from '../Teams/Teams';
import './RandomTeamsForm.scss';

const RandomTeamsForm = () => {

  const state = useSelector((state) => state);
  const [playerList, setplayerList] = useState([{player: '', hide: false}]);
  const [teamsNumber, setTeamsnumber] = useState(null);
  const teamsList = [];
  const [validTeams, setValidTeams] = useState(false);
  const navigate= useNavigate();
  const dispatch = useDispatch();


  // handle click event of the Remove button
  const handleRemoveClick = (e, index) => {
    const list = [...playerList];
    list.splice(index, 1);
    setplayerList(list);
  };

  const handleValidateTeams = () => {
    const playerNames = [];
    playerList.forEach(player => {
      playerNames.push(player.player);
    });
    playerNames.pop();
    shuffleArray(playerNames);
    shuffleArray(pickableColors);
    splitArray(playerNames, teamsNumber, teamsList);
    teamsList.forEach((team, i) => {
      dispatch({ type: 'createNewTeam', team: {name: `Equipe ${i+1}`, players: team, score: 0, fails: 0, playerTurn: 0, level: false, stats:[], eliminated: false, color:`${pickableColors[i+1]}`} });
    });
    setValidTeams(true);
  };

  const splitArray = (array, arraysCount, arrayOfArrays) => {
    const size = array.length/arraysCount;
    for (let i=0; i<array.length; i+=size) {
      arrayOfArrays.push(array.slice(i,i+size));
    }
  };

  const handleStart = () => {
    dispatch({ type: 'startGame'});
    setNewLocalStorage();
    state.teams[0].name && navigate(`/game/${state.teams[0].name}/0/${state.teams[0].players[0]}`, { replace: true });
  };

  const setNewLocalStorage = () => {
    setLocalStorage({ date: new Date().toDateString(), state });
  };

  const pickableColors = [
    '#12CBC4', // light-blue
    '#00A8C5', // blue
    '#0652DD',
    '#009432', //dark-green
    '#C4E538', //light-green
    '#FFC312', // yellow
    '#F79F1F', // dark-yellow
    '#EE5A24', //orange
    '#EA2027', //red
    '#E81D62', // pink
    '#ED4C67',
    '#FDA7DF', //light-pink
  ];

  const buttonStyleGreen = {
    frontStyle: {
      'background': '#219653',
    },
    frontHoverStyle: {
      'background': '#219653',
    },
    backStyle: {
      'background': 'linear-gradient(to left, #00672a 0%, #003314 8%, #003314 92%, #00672a 100%)'
    },
    backHoverStyle: {
      'background': 'linear-gradient(to left, #00672a 0%, #003314 8%, #003314 92%, #00672a 100%)'
    }
  };

  return (
    <div className='randomTeams'>
      {state.teams.length === 0 &&
      <>
        <div className='randomTeams__playerList'>
          {playerList.map((x, i) => {
            if (playerList.length > 1 && x.player !== '' && playerList[i+1]) {
              return (
                <Player action={e => handleRemoveClick(e, i)} i={i} player={x.player} key={i}/>
              );
            } return null;
          })}
        </div>
        <div className='randomTeams__addPlayerForm'>
          <PlayerForm list={playerList} setList={setplayerList}/>
          {playerList.length >= 3 &&
            <div className='randomTeams__teamNumberSelect'>
              <h2>Nombre d&apos;équipes :</h2>
              <NumberPicker value={teamsNumber} placeholder='Entrez un nombre d&apos;équipes' onChange={value => setTeamsnumber(value)} defaultValue={2}  min={2} max={playerList.length-1}/>
            </div>
          }
        </div>
      </>}
      {state.teams.length > 0 && <Teams/>}
      <Options />
      {teamsNumber && !validTeams && <Button text={'Valider les équipes'} action={handleValidateTeams} ico={'fas fa-users'} style={buttonStyleGreen}/>}
      {validTeams && <Button text={'Commencer à jouer'} action={handleStart} ico={'fas fa-users'} style={buttonStyleGreen}/>}
      {/* <Button text={'Annuler'} action={handleCancel} style={buttonStyleGray}/> */}
    </div>
  );
};

export default RandomTeamsForm;