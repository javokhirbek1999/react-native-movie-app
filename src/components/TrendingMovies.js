import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableWithoutFeedback, Dimensions, Image, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { image500 } from '../api/moviesdb';

const { width, height } = Dimensions.get('window');

const TrendingMovies = ({ data, countryName }) => {
  const [currentIndex, setCurrentIndex] = useState(0); // Start from the first movie
  const navigation = useNavigation();
  const flatListRef = useRef(null); // Initialzing a ref for FlatList to access scroll methods

  const handleClick = (item) => {
    navigation.navigate('Movie', item); // Navigate to movie details page
  };

  // Autoplay the FlatList by changing the index every specified seconds
  useEffect(() => {
    // Prevent setting interval if no data
    if (data.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % data.length; // Loop back to the first movie without going out of index
        flatListRef.current.scrollToIndex({ index: nextIndex, animated: true }); // Scroll to the next movie
        return nextIndex;
      });
    }, 3000); // Change movie every 3 seconds

    return () => clearInterval(interval); // Cleanup the interval on unmount
  }, [data]); // Trigger effect only when 'data' changes

  // If no data, return a loading or no content message
  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>No Trending Movies Available</Text>
      </View>
    );
  }

  // Render the FlatList to display movies
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        Trending in {countryName || 'Your Country'} {/* Fallback text if countryName is null */}
      </Text>
      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={({ item, index }) => (
          <MovieCard item={item} handleClick={handleClick} />
        )}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={width * 0.6}
        snapToAlignment="center"
        decelerationRate="fast"
        contentContainerStyle={styles.listContainer}
        extraData={currentIndex}
      />
    </View>
  );
};

const MovieCard = ({ item, handleClick }) => {
  return (
    <TouchableWithoutFeedback onPress={() => handleClick(item)}>
      <View style={styles.card}>
        <Image
          source={{ uri: image500(item.poster_path) }}
          style={styles.image}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 20,
    marginTop: 20,
  },
  heading: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 20,
    marginLeft: 20,
  },
  card: {
    width: width * 0.6,
    height: height * 0.4,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 20,
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  listContainer: {
    paddingLeft: 20,
    paddingRight: 20,
  },
});

export default TrendingMovies;
