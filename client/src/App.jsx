import { useEffect, useState } from 'react'
import { cards, buttons, finalClass } from './App.module.css'
import CardSelection from  './CardSelection'
import FinalCard from './FinalCard'

function App() {

  const [input, setInput] = useState("");
  const [submit, setSubmit] = useState(false);
  const [dictionary, setDictionary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [final, setFinal] = useState(null); // Final card

  function handleInput(e) {
    setInput(e.target.value);
  };
  
  function handleSubmit(e) {
    e.preventDefault();
    setSubmit(true);
  };

  useEffect(() => {
    async function fetchDictionary() {
      try {
        const res = await fetch(`${ import.meta.env.VITE_URL }${ input }`); // Fetches from backend server
        const json = await res.json();
        console.log(json)
        if (json.errors) setError(json.errors[0]);
        else if (json.length == 0) setError({msg: "No word found!"})
        else setDictionary(json);

      } catch(err) {
        console.error(err);
        setError(err);

      } finally {
        setIsLoading(false);
      }
    }

    if (submit) {
      setError(null);
      setIsLoading(true);
      fetchDictionary();
      setSubmit(false);
    }

  }, [submit]);

  function handleBack() {
    setDictionary(null);
  }

  function handleChoosing() {
    let chosen = dictionary.filter((item) => item['selected']);

    if (chosen.length > 1) {
      chosen = {
        id: 0,
        frWord: chosen[0].frWord, 
        class: chosen[0].class, 
        def: chosen[0].def, 
        engWord: chosen[0].engWord, 
        example: chosen[0].example,
        def2: chosen[1].def,
        engWord2: chosen[1].engWord,
        example2: chosen[1].example,
      };
    } else chosen = chosen[0];
    
    setFinal(chosen);
  };

  function handleReturn() {
    setFinal(null);
  };

  function saveCard() {
    // send data to backend where it is saved in a database
  };

  return (
    <>
      <h1>Anki Builder</h1>

        { !dictionary && (
            <>
              <h2>Card 1</h2>
              <form onSubmit={ handleSubmit }>
                <label htmlFor="word">Word</label>
                <input type="text" id='word' name='word' value={ input } onChange={ handleInput } />
                <button type="submit">Search</button>
              </form>
            </>
        )}
        
        { isLoading && <h3>Translating...</h3> }
        { error && !error.msg && <h3>Dictionary Error. Please try again.</h3> }
        { error && error.msg && <h3>{ error.msg } Please try again.</h3> }

        { !final && dictionary && 
          <>
          <h2>Select one or more</h2>
            <div className={ cards }>
              {dictionary.map(item => (
              <CardSelection key={ item.id } item={ item } dictionary={ dictionary } setDictionary={ setDictionary }/>
              ))}
            </div>
            <div className={ buttons }>
              <button onClick={ handleBack }>Return</button>
              <button onClick={ handleChoosing }>Finalize Selection</button>
            </div>
          </>
        }

        { final && 
          <>
            <FinalCard item={ final } /> 
            <div className={ `${buttons} ${finalClass}` } >
              <button onClick={ handleReturn }>Return</button>
              <button onClick={ saveCard }>Save Card</button>
            </div>
          </>
        }
    </>
  )
}

export default App
