const movieListElement = document.getElementById('movies-list')
const searchInput = document.querySelector('.search__input')
const searchCheckbox = document.getElementById('checkbox')

let isSearchTriggerEnabled = false
let lastSearchQuery = null

const debounceTime = (cb, ms) => {
  let timer = null
  return (...args) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => cb(...args), ms)
  }
}

const getData = (url) =>
  fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`)
      return res.json()
    })
    .then((data) => {
      if (!data || !data.Search) throw new Error('Incorrect data')
      return data.Search
    })

const addMovieToList = ({ Poster: poster, Title: title, Year: year }) => {
  const item = document.createElement('div')
  const img = document.createElement('img')

  item.classList.add('movie')
  img.classList.add('movie__image')

  img.src = poster && /^(https?:\/\/)/i.test(poster) ? poster : 'images/nothing.jpg'
  img.alt = `${title} (${year})`
  img.title = `${title} (${year})`

  item.append(img)
  movieListElement.prepend(item)
}

const clearMoviesMarkup = () => {
  if (movieListElement) movieListElement.innerHTML = ''
}

const inputSearchHandler = debounceTime((e) => {
  const searchQuery = e.target.value.trim()

  if (!searchQuery || searchQuery.length < 4 || searchQuery === lastSearchQuery) return

  if (!isSearchTriggerEnabled) clearMoviesMarkup()

  getData(`https://www.omdbapi.com/?apikey=18b8609f&s=${searchQuery}`)
    .then((movies) => {
      if (!movies || movies.length === 0) {
        console.log('Фільми не знайдено')
        return
      }
      movies.forEach((movie) => addMovieToList(movie))
    })
    .catch((err) => console.error(err))

  lastSearchQuery = searchQuery
}, 1500)

searchInput.addEventListener('input', inputSearchHandler)
searchCheckbox.addEventListener('change', (e) => (isSearchTriggerEnabled = e.target.checked))
