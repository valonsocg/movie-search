// import withResults from './mocks/results.json'
// import noResults from './mocks/noResults.json'
import './App.css'
import { useEffect, useRef, useState, useCallback } from 'react'
import { Movies } from './components/Movies'
import { useMovies } from './hooks/useMovies'
import debounce from 'just-debounce-it'

export const useSearch = () => {
  const [search, setSearch] = useState('')
  const [error, setError] = useState(null)
  const isFirstInput = useRef(true)

  useEffect(() => {
    if (isFirstInput.current) {
      isFirstInput.current = search === ''
      return
    }
    if (search === '') {
      setError('Buscar no puede estar vacio')
      return
    }
    if (search.match(/^\d+$/)) {
      setError('Buscar no puede iniciar con numeros')
      return
    }
    if (search.length < 3) {
      setError('Buscar debe tener al menos 3 caracteres')
      return
    }
    setError(null)
  }, [search])

  return { search, setSearch, error }
}

export const App = () => {
  const [sort, setSort] = useState(false)
  const { search, setSearch, error } = useSearch()
  const { movies, getMovies, loading } = useMovies({ search, sort })

  const debounceGetMovies = useCallback(
    debounce(search => {
      console.log('search', search)
      getMovies({ search })
    }, 300)
    , [getMovies])

  const handleSort = () => {
    setSort(!sort)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    getMovies({ search })
  }

  const handleChange = (event) => {
    const newSearch = event.target.value
    if (newSearch.startsWith(' ')) return
    setSearch(newSearch)
    debounceGetMovies(newSearch)
  }

  return (
    <div className='page'>
      <header>
        <h1>Buscador de Peliculas</h1>
        <form className='form' onSubmit={handleSubmit}>
          <input value={search} onChange={handleChange} type='text' placeholder='Avengers, Titanic...' />
          <input type='checkbox' onChange={handleSort} checked={sort} />
          <button type='submit'>Buscar</button>

        </form>

      </header>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <main>
        {
          loading ? <p>Buscando...</p> : <Movies movies={movies} />
        }

      </main>
    </div>
  )
}
