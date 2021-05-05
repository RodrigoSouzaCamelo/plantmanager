import React, { useState, useEffect } from 'react';
import {
   StyleSheet,
   View,
   Text,
   Image
} from 'react-native';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

import colors from '../styles/colors';
import userImg from '../assets/rodrigo.jpeg';
import fonts from '../styles/fonts';

export default function Header() {
   const [userName, setUserName] = useState<string>();

   useEffect(() => {
      loadStorageUserName();
   }, [userName]);

   async function loadStorageUserName() {
      const user = await AsyncStorage.getItem('@plantmanager:user');
      setUserName(user || '');
   }

   return (
      <View style={styles.container}>
         <View>
            <Text style={styles.greeting}>Olá,</Text>
            <Text style={styles.userName}>{userName}</Text>
         </View>

         <Image source={userImg} style={styles.image}/>
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 20,
      marginTop: Constants.statusBarHeight,
   },
   image: {
      width: 70,
      height: 70,
      borderRadius: 40,
   },
   greeting: {
      fontSize: 32,
      color: colors.heading,
      fontFamily: fonts.text
   },
   userName: {
      fontSize: 32,
      fontFamily: fonts.heading,
      color: colors.heading,
      lineHeight: 40
   }
})