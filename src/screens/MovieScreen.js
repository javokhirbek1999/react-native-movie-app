import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Image,
  Platform,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import { HeartIcon } from 'react-native-heroicons/solid';
import { fetchMovieCredits, fetchMovieDetails, fetchSimilarMovies, image500 } from '../api/moviesdb';
import Cast from '../components/Cast';
import MovieList from '../components/MovieList';
import Loading from '../components/Loading';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const ios = Platform.OS === 'ios';

const MovieScreen = () => {
  const { params: item } = useRoute();
  const navigation = useNavigation();

  const [isFavorite, setIsFavorite] = useState(false);
  const [movie, setMovie] = useState({});
  const [cast, setCast] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMovieDetails(item.id);
    getMovieCredits(item.id);
    getSimilarMovies(item.id);
    loadFavoriteStatus(item.id); // Load favorite status on mount
  }, [item]);

  const getMovieDetails = async (id) => {
    const data = await fetchMovieDetails(id);
    if (data) setMovie(data);
    setLoading(false);
  };

  const getMovieCredits = async (id) => {
    const data = await fetchMovieCredits(id);
    if (data?.cast) setCast(data.cast);
  };

  const getSimilarMovies = async (id) => {
    const data = await fetchSimilarMovies(id);
    if (data?.results) setSimilarMovies(data.results);
  };

  const toggleFavorite = async () => {
    try {
      const currentFavorites = await AsyncStorage.getItem('LikedMovies');
      const favorites = currentFavorites ? JSON.parse(currentFavorites) : {};
      if (isFavorite) {
        // Remove from favorites
        delete favorites[item.id];
      } else {
        // Add to favorites
        favorites[item.id] = movie;
      }
      await AsyncStorage.setItem('LikedMovies', JSON.stringify(favorites));
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };
  
  const loadFavoriteStatus = async (id) => {
    try {
      const currentFavorites = await AsyncStorage.getItem('LikedMovies');
      const favorites = currentFavorites ? JSON.parse(currentFavorites) : {};
      setIsFavorite(!!favorites[id]);
    } catch (error) {
      console.error('Error loading favorite status:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <SafeAreaView style={[styles.safeArea, !ios && { marginTop: 10 }]} >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ChevronLeftIcon size={28} strokeWidth={2.5} color="white" />
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleFavorite}>
            <HeartIcon size={35} color={isFavorite ? '#FF6347' : 'white'} />
          </TouchableOpacity>
        </SafeAreaView>

        {loading ? (
          <Loading />
        ) : (
          <View>
            <Image
              source={{ uri: image500(movie?.poster_path) }}
              style={{ width, height: height * 0.6 }}
            />
            <LinearGradient
              colors={['rgba(28, 28, 28, 0)', 'rgba(28, 28, 28, 1)']}
              style={{
                width,
                height: 200,
                position: 'absolute',
                bottom: 0,
              }}
            />
          </View>
        )}

        {movie?.title && (
          <View style={styles.detailsContainer}>
            <Text style={styles.movieTitle}>{movie?.title}</Text>
            <Text style={styles.statusText}>
              {movie?.status} · {movie?.release_date?.split('-')[0]} · {movie?.runtime} min
            </Text>

            <View style={styles.genresContainer}>
              {movie?.genres?.map((genre, index) => {
                const showDot = index + 1 !== movie.genres.length;
                return (
                  <Text key={index} style={styles.genreText}>
                    {genre?.name} {showDot ? '·' : null}
                  </Text>
                );
              })}
            </View>

            <Text style={styles.overviewText}>{movie?.overview}</Text>
            <Cast navigation={navigation} cast={cast} />
            <MovieList title="Similar Movies" seeAll={false} data={similarMovies} />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 20,
    backgroundColor: '#1c1c1c', // Ensure scroll view has the same background color
  },
  container: {
    width: '100%',
    backgroundColor: '#1c1c1c', // Ensure container has the same background color as scroll view
  },
  safeArea: {
    position: 'absolute',
    zIndex: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  backButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
    padding: 8,
  },
  detailsContainer: {
    marginTop: -(height * 0.09),
    paddingHorizontal: 16,
  },
  movieTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 1,
  },
  statusText: {
    color: '#A9A9A9',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 5,
  },
  genresContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  genreText: {
    color: '#A9A9A9',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 5,
  },
  overviewText: {
    color: '#A9A9A9',
    marginTop: 15,
    fontSize: 16,
    lineHeight: 22,
  },
});

export default MovieScreen;
