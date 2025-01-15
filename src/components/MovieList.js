import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const MovieList = ({ title, data, seeAll }) => {
  const navigation = useNavigation();

  // Function to handle movie click
  const handleMovieClick = (item) => {
    navigation.navigate('Movie', item); // Navigate to movie details page
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>

        {seeAll && (
          <TouchableOpacity onPress={() => navigation.navigate('MoviesList')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        horizontal
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleMovieClick(item)} style={styles.movieCard}>
            <Image
              source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
              style={styles.poster}
            />
            <Text style={styles.movieTitle}>
              {item.title.length > 14 ? `${item.title.slice(0, 14)}...` : item.title}
            </Text>
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllText: {
    color: 'lightgray',
    fontSize: 16,
  },
  movieCard: {
    marginRight: 12,
    alignItems: 'center',
  },
  poster: {
    width: width * 0.3,
    height: height * 0.22,
    borderRadius: 15,
  },
  movieTitle: {
    color: 'lightgray',
    marginTop: 5,
    fontSize: 12,
    textAlign: 'center',
  },
});

export default MovieList;
