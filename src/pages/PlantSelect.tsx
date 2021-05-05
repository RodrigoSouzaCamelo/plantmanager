import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import colors from '../styles/colors';

import Header from '../components/Header';
import fonts from '../styles/fonts';
import EnvironmentButton from '../components/EnvironmentButton';
import api from '../services/api';
import { PlantCardPrimary } from '../components/PlantCardPrimary';
import { Load } from '../components/Load';
import { useNavigation } from '@react-navigation/core';
import { PlantProps } from '../libs/storage';

interface EnvironmentsProps {
   key: string;
   title: string;
}

export default function PlantSelect() {
   const [loading, setLoading] = useState(true);
   const [plants, setPlants] = useState<PlantProps[]>([]);
   const [environmentSelected, setEnvironmentSelected] = useState('all');
   const [filteredPlants, setfilteredPlants] = useState<PlantProps[]>([]);
   const [environments, setEnvironments] = useState<EnvironmentsProps[]>([]);
   
   const [page, setPage] = useState(1);
   const [loadingMore, setLoadingMore] = useState(false);

   const navigation = useNavigation();
   
   useEffect(() => {      
      fetchEnvironment();
   }, []);

   useEffect(() => {
      fetchPlants();
   }, []);

   async function fetchEnvironment() {
      const { data } = await api
         .get('plants_environments?_sort=title&_order=asc');

      setEnvironments([
         {
            key: 'all',
            title: 'Todos'
         },
         ...data
      ]);
   }

   async function fetchPlants() {
      const { data } = await api
         .get(`plants?_sort=name&_order=asc&_page=${page}&_limit=8`);

      if (!data)
         return setLoading(true);

      if (page > 1) {
         setPlants(oldValue => [...oldValue, ...data])
         setfilteredPlants(oldValue => [...oldValue, ...data])
      } else {
         setPlants(data);
         setfilteredPlants(data)
      }

      setLoading(false);
      setLoadingMore(false);
   }

   function handleEnvironmentSelected(environment: string) {
      setEnvironmentSelected(environment);

      if(environment === 'all')
         return setfilteredPlants(plants);

      const filtered = plants.filter(plant => 
         plant.environments.includes(environment));

      setfilteredPlants(filtered);
   }

   function handlePlantSelect(plant: PlantProps) {
      navigation.navigate('PlantSave', { plant });
   }

   function handleFetchMore(distance: number) {
      if (distance < 1)
         return;

      setLoadingMore(true);
      setPage(oldValue => oldValue + 1);

      fetchPlants();
   }

   if (loading)
      return <Load />

   return (
      <View style={styles.container}>
         <View style={styles.header}>
            <Header />

            <Text style={styles.title}>
               Em qual ambiente
            </Text>
            <Text style={styles.subtitle}>
               você quer colocar a sua planta?
            </Text>
         </View>

         <View>
            <FlatList<EnvironmentsProps>
               horizontal
               data={environments}
               keyExtractor={(item) => item.key}
               showsHorizontalScrollIndicator={false}
               contentContainerStyle={styles.environmentList}
               renderItem={({ item }) => (
                  <EnvironmentButton 
                     title={item.title} 
                     active={item.key === environmentSelected} 
                     onPress={() => handleEnvironmentSelected(item.key)}
                  />
               )}
            />
         </View>

         <View style={styles.plants}>
            <FlatList<PlantProps>
               numColumns={2}
               data={filteredPlants}
               onEndReachedThreshold={0.1}
               showsVerticalScrollIndicator={false}
               keyExtractor={(item) => item.id.toString()}
               onEndReached={({ distanceFromEnd }) => {
                  handleFetchMore(distanceFromEnd)
               }}
               ListFooterComponent={() => (
                  loadingMore ?
                     <ActivityIndicator 
                        color={colors.green}
                     /> : <></>
               )}
               renderItem={({ item }) => (
                  <PlantCardPrimary 
                     data={item} 
                     onPress={() => handlePlantSelect(item)} 
                  />
               )}
            />
         </View>
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: colors.background
   },
   header: {
      paddingHorizontal: 30
   },
   title: {
      fontSize: 17,
      color: colors.heading,
      fontFamily: fonts.heading,
      lineHeight: 20,
      marginTop: 15
   },
   subtitle: {
      fontFamily: fonts.text,
      fontSize: 17,
      lineHeight: 20,
      color: colors.heading
   },
   environmentList: {
      height: 40,
      justifyContent: 'center',
      paddingBottom: 5,
      marginLeft: 32,
      marginVertical: 32
   },
   plants: {
      flex: 1,
      paddingHorizontal: 32,
      justifyContent: 'center',
   }
});