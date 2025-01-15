import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { image342, defaultProfileImage } from '../api/moviesdb';

const LikedActorsScreen = () => {
  const [likedActors, setLikedActors] = useState([]);
  const navigation = useNavigation();

  const fetchLikedActors = async () => {
    try {
      const storedActors = await AsyncStorage.getItem('likedPeople');
      if (storedActors) {
        const actorsObject = JSON.parse(storedActors);
        const actorsArray = Object.values(actorsObject);
        setLikedActors(actorsArray);
      } else {
        setLikedActors([]); // Clear if no liked actors are found
      }
    } catch (error) {
      console.error('Error fetching liked actors:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchLikedActors(); // Fetch liked actors when the screen is focused
    }, [])
  );

  const renderActorItem = ({ item }) => (
    <TouchableOpacity
      style={styles.actorCard}
      onPress={() => navigation.navigate('Person', { id: item.id })}
    >
      <Image
        source={{ uri: image342(item.profile_path) || defaultProfileImage }}
        style={styles.actorImage}
      />
      <Text style={styles.actorName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Liked Actors</Text>
      {likedActors.length > 0 ? (
        <FlatList
          data={likedActors}
          renderItem={renderActorItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text style={styles.emptyMessage}>No liked actors found.</Text>
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
  actorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2e2e2e',
    borderRadius: 8,
    marginBottom: 16,
    padding: 12,
  },
  actorImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  actorName: {
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

export default LikedActorsScreen;
