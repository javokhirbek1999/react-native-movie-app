import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';

const Cast = ({ cast, navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Top Cast</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContainer}
      >
        {cast &&
          cast.map((person, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() => navigation.navigate('Person', person)}
            >
              <View style={styles.imageWrapper}>
                <Image
                  source={{
                    uri: person?.profile_path
                      ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
                      : 'https://www.example.com/default-profile.png',
                  }}
                  style={styles.profileImage}
                />
              </View>
              <Text style={styles.character}>
                {person?.character?.length > 10
                  ? person?.character.slice(0, 10) + '...'
                  : person?.character}
              </Text>
              <Text style={styles.name}>
                {person?.original_name?.length > 10
                  ? person?.original_name.slice(0, 10) + '...'
                  : person?.original_name}
              </Text>
            </TouchableOpacity>
          ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  header: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  scrollViewContainer: {
    paddingHorizontal: 15,
  },
  card: {
    marginRight: 12,
    alignItems: 'center',
  },
  imageWrapper: {
    overflow: 'hidden',
    borderRadius: 50,
    height: 80,
    width: 80,
    borderWidth: 1,
    borderColor: '#555',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  character: {
    color: 'white',
    fontSize: 12,
    marginTop: 5,
  },
  name: {
    color: '#888',
    fontSize: 12,
  },
});

export default Cast;
