// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

function useLocalStorageState(
  key,
  defaultValue = '',
  {serialize = JSON.stringify, deserealize = JSON.parse} = {},
) {
  console.log('custom Hook called')
  const [state, setState] = React.useState(() => {
    const valueInLocalStorage = deserealize(window.localStorage.getItem(key))
    if (valueInLocalStorage) {
      return valueInLocalStorage
    } else {
      if (typeof defaultValue === 'function') {
        return defaultValue()
      }
      return defaultValue
    }
  })

  const previousKeyRef = React.useRef(key)

  React.useEffect(() => {
    let previousKey = previousKeyRef.current
    if (previousKey !== key) {
      window.localStorage.removeItem(previousKey)
    }
    previousKeyRef.current = key
    window.localStorage.setItem(key, serialize(state))
  }, [state, key, serialize])

  return [state, setState]
}

function Greeting({initialName = ''}) {
  console.log('normal component called')

  const [name, setName] = useLocalStorageState('name', initialName)

  function handleChange(event) {
    setName(event.target.value)
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
