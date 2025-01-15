import React, { useCallback, useState } from 'react';
import { View, Text, Dimensions, SafeAreaView, TextInput, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { XMarkIcon } from 'react-native-heroicons/solid';
import { MagnifyingGlassIcon } from 'react-native-heroicons/outline';
import Loading from '../components/Loading';
import { searchMovies, image185 } from '../api/moviesdb';

const { width, height } = Dimensions.get('window');
const ios = Platform.OS === 'ios';

export default function SearchScreen() {
  const navigation = useNavigation();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback((value) => {
    if (value && value.length > 2) {
      setLoading(true);
      searchMovies({
        query: value,
        include_adult: 'false',
        language: 'en-US',
        page: '1',
      }).then((data) => {
        setLoading(false);
        if (data && data.results) setResults(data.results);
      });
    } else {
      setLoading(false);
      setResults([]);
    }
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1c1c1c' }}>
      {/* Search Bar */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: 16,
          borderWidth: 1,
          borderColor: '#666',
          borderRadius: 50,
          paddingHorizontal: 12,
          backgroundColor: '#333',  // Matching background color of search bar
        }}
      >
        <TextInput
          onChangeText={handleSearch}
          placeholder="Search Movie"
          placeholderTextColor="lightgray"
          style={{
            flex: 1,
            paddingVertical: 8,
            paddingLeft: 12,
            color: 'white',
            fontSize: 16,
          }}
        />
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            padding: 8,
            backgroundColor: '#333', // Matching background color of search bar
            borderRadius: 50,
            marginLeft: 8,
            justifyContent: 'center',  // Centering the X icon
            alignItems: 'center',      // Centering the X icon
          }}
        >
          <XMarkIcon size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Loading or Results */}
      {loading ? (
        <Loading />
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingBottom: 20,
          }}
        >
          {results.length > 0 ? (
            <View>
              <Text
                style={{
                  fontSize: 18,
                  color: 'white',
                  fontWeight: '600',
                  marginLeft: 16,
                  marginBottom: 8,
                }}
              >
                Results ({results.length})
              </Text>

              <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16 }}>
                {results.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => navigation.push('Movie', { ...item })}
                    style={{
                      width: width * 0.4,
                      marginBottom: 16,
                      marginRight: 16,
                    }}
                  >
                    <Image
                      source={{
                        uri: image185(item?.poster_path) || 'https://cdn-icons-png.flaticon.com/512/6134/6134065.png',
                      }}
                      style={{
                        width: '100%',
                        height: height * 0.3,
                        borderRadius: 12,
                      }}
                    />
                    <Text
                      style={{
                        color: '#D3D3D3',
                        fontSize: 14,
                        marginTop: 8,
                        textAlign: 'center',
                      }}
                    >
                      {item?.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 20 }}>
              <Text style={{ color: '#888', fontSize: 18 }}>No results found</Text>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
