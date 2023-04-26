import { useState, useEffect } from 'react';
import './App.css';
import { Auth } from './components/auth';
import { auth, db, storage } from './config/firebase';
import { getDocs, collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';

function App() {
  const [movieList, setMovieList] = useState([])

  // New Movie States
  const [newMovieTitle, setNewMovieTitle] = useState('')
  const [newReleaseDate, setNewReleaseDate] = useState(0)
  const [isNewMovieOscar, setIsNewMovieOscar] = useState(false)

  // Update Title States
  const [updatedTitle, setUpdatedTitle] = useState('')

  // File Upload States
  const [fileUpload, setFileUpload] = useState(null)

  const moviesCollectionRef = collection(db, 'movies')

  // CREATE A MOVIE
  const onSubmitMovie = async () => {
    try {
      await addDoc(moviesCollectionRef, {
        title: newMovieTitle,
        releaseDate: newReleaseDate,
        receivedAnOscar: isNewMovieOscar,
        userId: auth?.currentUser?.uid,
      })
    } catch (err) {
      console.error(err)
    }
  }

  // ON PAGE RENDER TO DISPLAY THE COLLECTION OF MOVIES
  useEffect(() => {
    const getMovieList = async () => {
      // READ THE DATA
      // SET THE MOVIE LIST
      try {
        const data = await getDocs(moviesCollectionRef);
        const filteredData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        setMovieList(filteredData)
      } catch (err) {
        console.error(err)
      }
    }

    getMovieList();
  }, [onSubmitMovie])

  // DELETE A MOVIE
  const deleteMovie = async (id) => {
    const movieDoc = doc(db, 'movies', id)
    await deleteDoc(movieDoc);
  }

  // UPDATE A MOVIE
  const updateMovieTitle = async (id) => {
    const movieDoc = doc(db, 'movies', id)
    await updateDoc(movieDoc, { title: updatedTitle });
  }

  // UPLOAD FILE
  const uploadFile = async () => {
    if (!fileUpload) return;
    const filesFolderRef = ref(storage, `projectFiles/${fileUpload.name}`)
    try {
      await uploadBytes(filesFolderRef, fileUpload)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="App">
      <Auth />

      <div>
        <input placeholder='Movie Title...' onChange={e => setNewMovieTitle(e.target.value)} />
        <input placeholder='Release Date...' type='number' onChange={e => setNewReleaseDate(Number(e.target.value))} />
        <input type='checkbox' checked={isNewMovieOscar} onChange={e => setIsNewMovieOscar(e.target.checked)} />
        <label>Received An Oscar</label>
        <button onClick={onSubmitMovie}>Submit Movie</button>
      </div>

      <div>
        {movieList.map((movie) => (
          <div>
            <h1 style={{ color: movie.receivedAnOscar ? 'green' : 'red' }}>{movie.title}</h1>
            <p>Date: {movie.releaseDate}</p>

            <button onClick={() => deleteMovie(movie.id)}>Delete Movie</button>

            <input placeholder='New Title...' onChange={e => setUpdatedTitle(e.target.value)} />
            <button onClick={() => updateMovieTitle(movie.id)}>Update Title</button>
          </div>
        ))}
      </div>

      <div>
        <input type='file' onChange={e => setFileUpload(e.target.files[0])} />
        <button onClick={uploadFile}>Upload File</button>
      </div>
    </div>
  );
}

export default App;
