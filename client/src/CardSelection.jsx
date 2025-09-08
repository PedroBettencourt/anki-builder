import { card, selectedClass } from './CardSelection.module.css'

function CardSelection({ item, dictionary, setDictionary }) {


  function handleClick() {   
    const temp = [... dictionary];

    if (item.selected) {
      temp[item.id]['selected'] = false;
      setDictionary(temp);
    } else {
      temp[item.id]['selected'] = true;
      setDictionary(temp);
    }
  }

  return (
    <ul onClick={ handleClick } className={ `${card} ${item.selected ? selectedClass : null}`} >
      <li><h2>{ item.frWord }</h2></li>
      <li><i>{ item.class }</i></li>
      <hr />
      <li><strong>{ item.def }</strong></li>
      <li>{ item.engWord.join(", ") }</li>
      <li>{ item.example }</li>
    </ul>
  )
}

export default CardSelection