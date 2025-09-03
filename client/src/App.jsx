import { useEffect, useState } from 'react'
import { cards, card } from './App.module.css'

function App() {

  const [input, setInput] = useState("");
  const [term, setTerm] = useState(null);
  const [translation, setTranslation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleInput(e) {
    setInput(e.target.value);
  };
  
  function handleSubmit(e) {
    e.preventDefault();
    setTerm(input);
  };

  useEffect(() => {
    async function fetchTranslation() {
      try {
        const res = await fetch(`URL/${ term }`); // Develop backend for web scraping
        console.log(res);
        const json = await res.json();

        console.log(json);

      } catch(err) {
        setError(err);

      } finally {
        setIsLoading(false);
      }
    }

    if (term) {
      setError(null);
      setIsLoading(true);
      fetchTranslation();
    }

  }, [term]);

  return (
    <>
      <h1>Anki Builder</h1>

      <div className={ cards }>
        <div className={ card }>
          <h2>Card 1</h2>
          <form onSubmit={ handleSubmit }>
            <label htmlFor="term">Term</label>
            <input type="text" id='term' name='term' value={ input } onChange={ handleInput } />
            <button type="submit">Search</button>
          </form>
        </div>
        <div className={ card }>
          <h2>Card 2</h2>
          { isLoading && <div>Translating...</div> }
          { error && <div>Translation error </div> }
          <p>{ term }</p>
          <p>{ translation }</p>
        </div>
      </div>
    </>
  )
}

export default App
