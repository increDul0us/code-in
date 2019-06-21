import React, { Component } from 'react';

import AuthContext from '../context/auth-context';
import './Movies.css';
import Backdrop from '../components/Backdrop/Backdrop';
import Modal from '../components/Modal/Modal';
import MovieList from '../components/Movies/MovieList/MovieList';
import Spinner from '../components/Spinner/Spinner';

class MoviesPage extends Component {
  state = {
    creating: false,
    movies: [],
    isLoading: false,
    selectedMovie: null
  };

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.titleElRef = React.createRef();
    this.dateElRef = React.createRef();
    this.descriptionElRef = React.createRef();
  }

  componentDidMount() {
    this.fetchMovies();
  }

  startCreateMovieHandler = () => {
    this.setState({ creating: true });
  };

  modalConfirmHandler = () => {
    this.setState({ creating: false });
    const title = this.titleElRef.current.value;
    const date = this.dateElRef.current.value;
    const description = this.descriptionElRef.current.value;

    if (
      title.trim().length === 0 ||
      // date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      return;
    }

    const movie = { title, date, description };
    console.log(movie);

    const requestBody = {
      query: `
          mutation {
            addMovie(title: "${title}", description: "${description}", creatorId: "${this.context.userId}") {
              id
              title
              description
              creator{
                id
                email
              }
            }
          }
        `
    };

    fetch('http://localhost:4000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        this.setState(prevState => {
          const updatedMovies = [...prevState.movies];
          updatedMovies.push({
            id: resData.data.addMovie.id,
            title: resData.data.addMovie.title,
            description: resData.data.addMovie.description,
            creatorId: this.context.userId
          });
          return { movies: updatedMovies };
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  modalCancelHandler = () => {
    this.setState({ creating: false, selectedMovie: null });
  };

  fetchMovies() {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
          query {
            movies {
              id
              title
              description
              creator {
                id
                email
                name
              }
            }
          }
        `
    };

    fetch('http://localhost:4000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        const movies = resData.data.movies;
        console.log(movies)
        this.setState({ movies: movies, isLoading: false });
      })
      .catch(err => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  }

  showDetailHandler = movieId => {
    this.setState(prevState => {
      const selectedMovie = prevState.movies.find(m => m.id === movieId);
      return { selectedMovie: selectedMovie };
    });
  };

  bookMovieHandler = () => {};

  render() {
    return (
      <React.Fragment>
        {(this.state.creating || this.state.selectedMovie) && <Backdrop />}
        {this.state.creating && (
          <Modal
            title="Add Movie"
            canCancel
            canConfirm
            onCancel={this.modalCancelHandler}
            onConfirm={this.modalConfirmHandler}
            confirmText="Confirm"
          >
            <form>
              <div className="form-control">
                <label htmlFor="title">Title</label>
                <input type="text" id="title" ref={this.titleElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="date">Date</label>
                <input type="datetime-local" id="date" ref={this.dateElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  rows="4"
                  ref={this.descriptionElRef}
                />
              </div>
            </form>
          </Modal>
        )}
        {this.state.selectedMovie && (
          <Modal
            title={this.state.selectedMovie.title}
            canCancel
            canConfirm
            onCancel={this.modalCancelHandler}
            onConfirm={this.bookMovieHandler}
            confirmText="Book"
          >
            <h1>{this.state.selectedMovie.title}</h1>
            <h2>{this.state.selectedMovie.date}</h2>
            <p>{this.state.selectedMovie.description}</p>
          </Modal>
        )}
        {this.context.userId && (
          <div className="events-control">
            <p>Share a Movie!</p>
            <button className="btn" onClick={this.startCreateMovieHandler}>
              Create Movie
            </button>
          </div>
        )}
        {this.state.isLoading ? (
          <Spinner />
        ) : (
          <MovieList
            movies={this.state.movies}
            authUserId={this.context.userId}
            onViewDetail={this.showDetailHandler}
          />
        )}
      </React.Fragment>
    );
  }
}

export default MoviesPage;