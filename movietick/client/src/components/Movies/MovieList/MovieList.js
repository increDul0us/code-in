import React from 'react'

import MovieItem from './MovieItem/MovieItem'
import './MovieList.css'

const movieList = props => {
  const movies = props.movies.map(movie => {
    return (
      <MovieItem
        key={movie.id}
        movieId={movie.id}
        title={movie.title}
        userId={props.authUserId}
        creatorId={movie.creator.id}
        onDetail={props.onViewDetail}
      />
    )
  })

  return <ul className='event__list'>{movies}</ul>
}

export default movieList
