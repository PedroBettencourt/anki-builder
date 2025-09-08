import { card } from './Card.module.css'

function FinalCard({ item }) {

    return (
        <ul className={ card } >
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
  );
}

export default FinalCard