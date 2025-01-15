import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, Platform, TouchableOpacity, ScrollView, StyleSheet, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Bars3CenterLeftIcon, MagnifyingGlassIcon } from 'react-native-heroicons/outline';
import TrendingMovies from '../components/TrendingMovies';
import MovieList from '../components/MovieList';
import Loading from '../components/Loading';
import { fetchTopRatedMovies, fetchTrendingMovies, fetchUpcomingMovies } from '../api/moviesdb';
import { useNavigation } from '@react-navigation/native';

const ios = Platform.OS === 'ios';

const HomeScreen = () => {
  const [trending, setTrending] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuHeight] = useState(new Animated.Value(0)); // For animation

  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendingData, upcomingData, topRatedData] = await Promise.all([
          fetchTrendingMovies(),
          fetchUpcomingMovies(),
          fetchTopRatedMovies(),
        ]);

        if (trendingData && trendingData.results) {
          setTrending(trendingData.results);
        }
        if (upcomingData && upcomingData.results) {
          setUpcoming(upcomingData.results);
        }
        if (topRatedData && topRatedData.results) {
          setTopRated(topRatedData.results);
        }
      } catch (error) {
        console.error('Error fetching movie data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);

    // Animate the dropdown menu
    Animated.timing(menuHeight, {
      toValue: menuVisible ? 0 : 200, // Adjust the height as needed
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <StatusBar style="light" />
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={toggleMenu}>
            <Bars3CenterLeftIcon size={32} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            <Text style={styles.highlightedText}>M</Text>ovies
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Search')}>
            <MagnifyingGlassIcon size={32} color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Dropdown Menu with animation */}
      {menuVisible && (
        <Animated.View style={[styles.menu, { height: menuHeight }]}>
          <TouchableOpacity onPress={() => navigation.navigate('LikedMovies')} style={styles.menuItem}>
            <Text style={styles.menuText}>Liked Movies</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('LikedActors')} style={styles.menuItem}>
            <Text style={styles.menuText}>Liked Actors</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.menuItem}>
            <Text style={styles.menuText}>Settings</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {loading ? (
        <Loading />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          {trending.length > 0 && <TrendingMovies data={trending} />}
          {upcoming.length > 0 && <MovieList title="Upcoming" data={upcoming} />}
          {topRated.length > 0 && <MovieList title="Top Rated" data={topRated} />}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1c',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  highlightedText: {
    color: '#E50914',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  menu: {
    backgroundColor: '#222', // Darker background for the menu
    borderTopWidth: 1,
    borderTopColor: '#444',
    overflow: 'hidden',
    paddingHorizontal: 20,
    marginTop: 10,
    borderRadius: 10, // Rounded corners
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  menuText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
  },
});

export default HomeScreen;
