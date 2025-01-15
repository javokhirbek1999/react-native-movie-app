import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { image500 } from '../api/moviesdb';

const LikedMoviesScreen = () => {
  const [likedMovies, setLikedMovies] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchLikedMovies = async () => {
      try {
        const storedMovies = await AsyncStorage.getItem('LikedMovies');
        if (storedMovies) {
          const moviesObject = JSON.parse(storedMovies);
          const moviesArray = Object.values(moviesObject);
          setLikedMovies(moviesArray);
        }
      } catch (error) {
        console.error('Error fetching liked movies:', error);
      }
    };

    const unsubscribe = navigation.addListener('focus', fetchLikedMovies);
    return unsubscribe;
  }, [navigation]);

  const renderMovieItem = ({ item }) => (
    <TouchableOpacity
      style={styles.movieCard}
      onPress={() => navigation.navigate('Movie', { id: item.id })}
    >
      <Image
        source={{ uri: image500(item.poster_path) }}
        style={styles.movieImage}
      />
      <Text style={styles.movieTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Liked Movies</Text>
      {likedMovies.length > 0 ? (
        <FlatList
          data={likedMovies}
          renderItem={renderMovieItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text style={styles.emptyMessage}>No liked movies found.</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1c',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginVertical: 16,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  movieCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2e2e2e',
    borderRadius: 8,
    marginBottom: 16,
    padding: 12,
  },
  movieImage: {
    width: 80,
    height: 120,
    borderRadius: 8,
    marginRight: 16,
  },
  movieTitle: {
    fontSize: 18,
    color: 'white',
    fontWeight: '500',
  },
  emptyMessage: {
    color: '#A9A9A9',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
});

export default LikedMoviesScreen;
