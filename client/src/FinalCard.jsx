import { useState } from 'react';
import { cardDiv, card } from './FinalCard.module.css'

function FinalCard({ item }) {

    const [clicked, setClicked] = useState(false);

    function handleClick() {
        if (clicked) setClicked(false);
        else setClicked(true);
    };

    if (!clicked) {
        return (
            <div className={ cardDiv }>
                <ul className={ card } onClick={ handleClick }>
                    <li><h2>{ item.frWord }</h2></li>
                </ul>
            </div>
        )
    };

    return (
        <div className={ cardDiv }>
            <ul className={ card } onClick={ handleClick }>
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
  );
}

export default FinalCard