import {
View,
Text,
Dimensions,
Platform,
ScrollView,
SafeAreaView,
TouchableOpacity,
Image,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { ChevronLeftIcon, HeartIcon } from 'react-native-heroicons/solid';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MovieList from '../components/MovieList';
import Loading from '../components/Loading';
import {
defaultProfileImage,
fetchPersonDetails,
fetchPersonMovies,
image342,
} from '../api/moviesdb';

const { width, height } = Dimensions.get('window');
const ios = Platform.OS === 'ios';

const PersonScreen = () => {
const navigation = useNavigation();
const { params: item } = useRoute();
const [isFavorite, setIsFavorite] = useState(false);
const [person, setPerson] = useState({});
const [personMovies, setPersonMovies] = useState([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
    setLoading(true);
    getPersonDetails(item.id);
    getPersonMovies(item.id);
    loadFavoriteStatus(item.id); // Load favorite status on mount
}, [item]);

const getPersonDetails = async (id) => {
    const data = await fetchPersonDetails(id);
    if (data) setPerson(data);
    setLoading(false);
};

const getPersonMovies = async (id) => {
    const data = await fetchPersonMovies(id);
    if (data?.cast) setPersonMovies(data.cast);
};

const toggleFavorite = async () => {
    try {
    const currentFavorites = await AsyncStorage.getItem('likedPeople');
    const favorites = currentFavorites ? JSON.parse(currentFavorites) : {};
    if (isFavorite) {
        // Remove from favorites
        delete favorites[item.id];
    } else {
        // Add to favorites
        favorites[item.id] = person;
    }
    await AsyncStorage.setItem('likedPeople', JSON.stringify(favorites));
    setIsFavorite(!isFavorite);
    } catch (error) {
    console.error('Error toggling favorite:', error);
    }
};

const loadFavoriteStatus = async (id) => {
    try {
    const currentFavorites = await AsyncStorage.getItem('likedPeople');
    const favorites = currentFavorites ? JSON.parse(currentFavorites) : {};
    setIsFavorite(!!favorites[id]);
    } catch (error) {
    console.error('Error loading favorite status:', error);
    }
};

return (
    <ScrollView
    contentContainerStyle={{ paddingBottom: 20 }}
    style={{ backgroundColor: '#1c1c1c' }}
    >
    <View style={{ width: '100%' }}>
        {/* Back button */}
        <SafeAreaView
        style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 16,
            zIndex: 20,
        }}
        >
        <TouchableOpacity
            style={{
            padding: 8,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            borderRadius: 10,
            }}
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
            {/* Person details */}
            <View
            style={{
                flexDirection: 'row',
                justifyContent: 'center',
                shadowColor: 'gray',
                shadowRadius: 40,
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 1,
            }}
            >
            <View
                style={{
                alignItems: 'center',
                borderRadius: 1000,
                overflow: 'hidden',
                height: height * 0.43,
                width: height * 0.43,
                }}
            >
                <Image
                source={{
                    uri: image342(person?.profile_path) || defaultProfileImage,
                }}
                style={{ height: '100%', width: '100%' }}
                />
            </View>
            </View>

            <View style={{ marginTop: 24 }}>
            <Text
                style={{
                fontSize: 28,
                fontWeight: 'bold',
                color: 'white',
                textAlign: 'center',
                letterSpacing: 1,
                }}
            >
                {person?.name}
            </Text>
            <Text
                style={{
                fontSize: 16,
                color: '#A9A9A9',
                textAlign: 'center',
                marginTop: 5,
                }}
            >
                {person?.place_of_birth}
            </Text>
            </View>

            {/* Details (Gender, Birthday, Known for, Popularity) */}
            <View
            style={{
                marginTop: 24,
                marginHorizontal: 16,
                backgroundColor: '#2e2e2e',
                paddingVertical: 12,
                borderRadius: 16,
            }}
            >
            <View
                style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 12,
                }}
            >
                <View style={{ alignItems: 'center' }}>
                <Text style={{ color: 'white', fontWeight: '600' }}>
                    Gender
                </Text>
                <Text style={{ color: '#A9A9A9', fontSize: 14 }}>
                    {person?.gender === 2 ? 'Male' : 'Female'}
                </Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                <Text style={{ color: 'white', fontWeight: '600' }}>
                    Birthday
                </Text>
                <Text style={{ color: '#A9A9A9', fontSize: 14 }}>
                    {person?.birthday}
                </Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                <Text style={{ color: 'white', fontWeight: '600' }}>
                    Known for
                </Text>
                <Text style={{ color: '#A9A9A9', fontSize: 14 }}>
                    {person?.known_for_department}
                </Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                <Text style={{ color: 'white', fontWeight: '600' }}>
                    Popularity
                </Text>
                <Text style={{ color: '#A9A9A9', fontSize: 14 }}>
                    {person?.popularity}
                </Text>
                </View>
            </View>
            </View>

            {/* Biography */}
            <View style={{ marginTop: 24, marginHorizontal: 16 }}>
            <Text style={{ color: 'white', fontSize: 18, marginBottom: 8 }}>
                Biography
            </Text>
            <Text
                style={{ color: '#A9A9A9', fontSize: 16, lineHeight: 22 }}
            >
                {person?.biography}
            </Text>
            </View>

            {/* Movies */}
            <MovieList title="Movies" seeAll={false} data={personMovies} />
        </View>
        )}
    </View>
    </ScrollView>
);
};

export default PersonScreen;
