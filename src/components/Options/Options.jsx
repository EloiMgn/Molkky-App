import './Options.scss'
import ToggleOption from './ToggleOption/ToggleOption';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

const Options = () => {
  const state = useSelector((state) => state)

  const [localState, setLocalState] = useState('')
  
  useEffect(() => {
    setLocalState(state)
  }, [state])

const egalisationDetails = "Si l'équipe A égalise le score de l'équipe B, le score de l'équipe B retombe à 0 ou à 25 si l'équipe B a déjà dépassé 25"

  if(localState){
    return (
      <div id="options" className="options">
       <ToggleOption action="élimination" details="élimination au bout de 3 lancés ratés" stateValue={localState.options.elimination} />
       <ToggleOption action="égalisation" details="retour à 0 si égalisation" stateValue={localState.options.egalisation} explication={egalisationDetails}/>
       {/* <ToggleOption action="maxPoints" details="retour au palier si égalisation" stateValue={state.options.maxPoints}/> */}
     </div>
 
   )
 } return null

  }

export default Options