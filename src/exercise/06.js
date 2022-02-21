// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {fetchPokemon, PokemonInfoFallback, PokemonDataView} from '../pokemon'
import {PokemonForm} from '../pokemon'
import PokemonErrorBoundary from './myErrorBoundary'
import {ErrorBoundary} from 'react-error-boundary'

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState(() => ({
    pokemon: null,
    status: 'idle',
    error: null,
  }))

  // const [pokemon, setPokemon] = React.useState(null)
  // const [status, setStatus] = React.useState('idle')
  // const [error, setError] = React.useState(null)

  React.useEffect(() => {
    if (!pokemonName) return
    setState({pokemon: null, error: null, status: 'pending'})
    // setPokemon(null)
    // setError(null)
    // setStatus('pending')
    fetchPokemon(pokemonName)
      .then(pokemon => {
        setState({...state, pokemon: pokemon, status: 'resolved'})
      })
      .catch(err => {
        setState({...state, error: err, status: 'reject'})
        // setError(err)
        // setStatus('reject')
      })
  }, [pokemonName])

  if (state.status === 'idle') return <p>Submit a Pokemon</p>

  if (state.status === 'reject') throw state.error
  // return (
  //   <div role="alert">
  //     There was an error:{' '}
  //     <pre style={{whiteSpace: 'normal'}}>{state.error.message}</pre>
  //   </div>
  // )

  if (state.status === 'pending')
    return <PokemonInfoFallback name={pokemonName} />
  if (state.status === 'resolved')
    return <PokemonDataView pokemon={state.pokemon} />
}

function FallbackComponent({error, resetErrorBoundary}) {
  return (
    <div>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Click me</button>
    </div>
  )
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          FallbackComponent={FallbackComponent}
          resetKeys={[pokemonName]}
          onReset={() => setPokemonName('')}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
