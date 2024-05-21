import { useEffect, useState } from 'react';
import { TheMovieApi } from '../function/getApi';
export const genresList = async () => {
    const MOVIE = await TheMovieApi(
      `https://api.themoviedb.org/3/genre/movie/list`
    );
    const data1 = MOVIE?.genres;
    const TV = await TheMovieApi(`https://api.themoviedb.org/3/genre/tv/list  `);
    const data2 = TV?.genres;
    return data1.concat(data2);
  };
const useGenres = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genresData = await genresList();
        setGenres(genresData);
      } catch (error) {
        console.error('Error fetching genres:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  return { genres, loading };
};

export default useGenres;
