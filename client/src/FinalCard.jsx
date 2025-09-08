import { useState } from 'react';
import { container, card, flip } from './FinalCard.module.css'

function FinalCard({ item }) {

    const [flipped, setFlipped] = useState(false);

    function handleClick() {
        if (flipped) setFlipped(false);
        else setFlipped(true);
    };

    return (
      <>
        <div className={ container }>
          <ul onClick={ handleClick } className={`${ card } ${ flipped && flip }`} >
            <li><h2>{ item.frWord }</h2></li>
          </ul>
          <ul onClick={ handleClick } className={`${ card } ${ !flipped && flip }`} >
            <li><h2>{ item.frWord }</h2></li>
            <li><i>{ item.class }</i></li>
            <hr />
            <li><strong>{ item.def }</strong></li>
            <li>{ item.engWord.join(", ") }</li>
            <li>{ item.example }</li>
            {item.def2 && (
              <>
                <hr />
                <li>
                  <strong>{item.def2}</strong>
                </li>
                <li>{item.engWord2.join(", ")}</li>
                <li>{item.example2}</li>
              </>
            )}
          </ul>
        </div>
      </>

  );
}

export default FinalCard