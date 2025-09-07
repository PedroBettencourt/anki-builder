import { useEffect, useState } from 'react'
import { cards, card, selectedClass } from './App.module.css'

function Card({ item, dictionary, setDictionary }) {

  const [ selected, setSelected ] = useState(null);

  function handleClick() {   
    const temp = [... dictionary];

    if (selected) {
      setSelected(false);
      temp[item.id]['selected'] = false;
      setDictionary(temp);
    } else {
      setSelected(true);
      temp[item.id]['selected'] = true;
      setDictionary(temp);
    }
  }

  return (
    <ul onClick={ handleClick } className={ `${card} ${selected ? selectedClass : null}`} >
      <li><h2>{ item.frWord }</h2></li>
      <li><i>{ item.class }</i></li>
      <li><strong>{ item.def }</strong></li>
      <li>{ item.engWord.join(", ") }</li>
      <li>{ item.example }</li>
      { item.def2 && // Separate this to its own react function 
      <>
        <hr/>
        <li><strong>{ item.def2 }</strong></li>
        <li>{ item.engWord2.join(", ") }</li>
        <li>{ item.example2 }</li>
      </>
      }
    </ul>
  )
}

function App() {

  const [input, setInput] = useState("");
  const [word, setWord] = useState(null);
  const [dictionary, setDictionary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleInput(e) {
    setInput(e.target.value);
  };
  
  function handleSubmit(e) {
    e.preventDefault();
    setWord(input);
  };

  useEffect(() => {
    async function fetchdictionary() {
      try {
        const res = await fetch(`${ import.meta.env.VITE_URL }${ word }`); // Fetches from backend server
        console.log(res);
        const json = await res.json();
        setDictionary(json);
        // deal with msg: [errors!] invalid word

      } catch(err) {
        console.error(err);
        setError(err);

      } finally {
        setIsLoading(false);
      }
    }

    if (word) {
      setError(null);
      setIsLoading(true);
      fetchdictionary();
    }

  }, [word]);

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
    };
    setDictionary([chosen]);
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
        
        { isLoading && <div>Translating...</div> }
        { error && <div>dictionary error </div> }
        { dictionary && 
          <>
          <h2>Select one or more</h2>
            <div className={ cards }>
              {dictionary.map(item => (
              <Card key={ item.id } item={ item } dictionary={ dictionary } setDictionary={ setDictionary }/>
              ))}
            </div>
          </>
        }
        <button onClick={ handleChoosing }>Selection done</button>
    </>
  )
}

export default App
