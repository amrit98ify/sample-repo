import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import Home from './pages/Home'

export default function App() {
  const [name, setName] = useState('');
  const [userName, setUserName] = useState('');

  const [timeoutComplete, setTimeoutComplete] = useState(false);

  useEffect(() => {
    (async () => {
      getData();
      // await AsyncStorage.setItem('userName', '')
    }) ();

    setTimeout(() => {
      setTimeoutComplete(true);
    }, 2000);
  },[])

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('userName')
      if(value) {
        setUserName(value);
      }
    } catch(e) {
      // error reading value
    }
  }
  

  const storeData = async () => {
    try {
      await AsyncStorage.setItem('userName', name)
    } catch (e) {
      // saving error
    }
  }

  if (userName) {
    if (timeoutComplete)
      return (
        <Home />
      )
    return (
      <View style={{flex: 1, justifyContent: "center"}}>
      <Text style={{alignSelf: "center"}}>HERE KEEP YOUR LOGO</Text>
      </View>
    )
  }
  
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={{color: 'white', fontSize: 20}}>Welcome to DigiLog!</Text>
      <TextInput
        style={styles.inputStyle}
        placeholderTextColor={'white'}
        placeholder="Enter your name..."
        value={name}
        onChangeText={setName}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => {storeData(); getData();}}
      >
        <AntDesign name="arrowright" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3E90FC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputStyle: {
    borderWidth: 1,
    borderColor: 'white',
    width: 200,
    height: 45,
    borderRadius: 30,
    color: 'white',
    paddingHorizontal: 10,

    marginVertical: 30
  },
  button: {
    borderWidth: 1,
    borderColor: 'white',
    padding: 10,
    borderRadius: 30,
  }
});
