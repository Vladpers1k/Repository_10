const moviesListElement = document.getElementById('movies-list')
const searchInput = document.getElementById('search')
const searchCheckbox = document.getElementById('checkbox')

let isSearchTriggerEnabled = false
let lastSearchQuery = null

const debounceTime = (() => {
  let timer = null
  return (cb, ms) => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    timer = setTimeout(cb, ms)
  }
})()

const getData = (url) =>
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (!data || !data.Search) throw 'The server returned incorrect data'
      return data.Search
    })

const addMovieToList = ({ Poster: poster, Title: title, Year: year }) => {
  const item = document.createElement('div')
  const img = document.createElement('img')

  item.classList.add('movie')
  img.classList.add('movie__image')
  img.src = /^(https?:\/\/)/i.test(poster) ? poster : 'images/nothing.jpg'
  img.alt = `${title} ${year}`
  img.title = `${title} ${year}`

  item.append(img)
  moviesListElement.prepend(item)
}

const clearMoviesMarkup = () => {
  if (moviesListElement) moviesListElement.innerHTML = ''
}

const inputSearchHandler = (e) => {
  debounceTime(() => {
    const searchQuery = e.target.value.trim()

    if (!searchQuery || searchQuery.length < 4 || searchQuery === lastSearchQuery) return
    if (!isSearchTriggerEnabled) clearMoviesMarkup()

    getData(`http://www.omdbapi.com/?apikey=18b8609f&s=${searchQuery}`)
      .then((movies) => movies.forEach((movie) => addMovieToList(movie)))
      .catch((err) => console.error(err))

    lastSearchQuery = searchQuery
  }, 1000)
}

searchInput.addEventListener('input', inputSearchHandler)
searchCheckbox.addEventListener('change', (e) => (isSearchTriggerEnabled = e.target.checked))
