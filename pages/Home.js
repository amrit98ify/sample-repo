import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Image, ImageBackground, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import SettingsPage from '../pages/Settings'
import Todo from './TodoList/Todo';
import { SimpleLineIcons } from '@expo/vector-icons';
import Expense from './ExpenseTracker/Expense';

export default function Home() {
  const [currentPage, setCurrentPage] = useState('home');
  const [thoughtForTheDay, setThoughtForTheDay] = useState({
    thought: "",
    author: "",
    image: "",
  })
  const [userName, setUserName] = useState('');
  const [userPic, setUserPic] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const value = await AsyncStorage.getItem('userName')
        if(value !== null) {
          setUserName(value);
        }
        const pic = await AsyncStorage.getItem('userPic');
        if(pic !== null) {
          setUserPic(pic);
        }
        const response = await fetch(
          'https://quotes.rest/qod?language=en'
        );
        const data = await response.json();

        setThoughtForTheDay({
          thought: data.contents.quotes[0].quote,
          author: data.contents.quotes[0].author,
          image: data.contents.quotes[0].background
        });

      } catch(e) {
        // error reading value
        console.log(e)
      }
    }) ();
  },[])

  function renderHeader() {
    return (
      <View style={{flexDirection: 'row', padding: 20, justifyContent: "space-between"}}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.textStyle}>Welcome, </Text>
            <Text adjustsFontSizeToFit numberOfLines={1} style={[styles.textStyle, styles.boldText]}>{userName.split(' ')[0]}</Text>
          </View>
          
          <View style={{flexDirection: 'row'}}>
            {/* <TouchableOpacity onPress={() => AsyncStorage.setItem('userName', '')}>
              <SimpleLineIcons name="logout" size={24} color="white" />
            </TouchableOpacity> */}
            <TouchableOpacity onPress={() => setCurrentPage('settings')}>
              <Ionicons name="ios-settings" size={24} color="white"/>
            </TouchableOpacity>
          </View>
        </View>
    )
  }

  function getActivePage(pageName) {
    if (pageName === currentPage) {
      return "#0C418C";
    }
    
    return "lightgray"
  }

  if (currentPage === 'settings') {
    return (
      <SettingsPage 
        goBack={() => setCurrentPage('home')} 
        changeName={(newName) => setUserName(newName)}
        changePic={(newPic) => setUserPic(newPic)}
      />
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* <StatusBar style="light"/> */}
      { (currentPage === 'home')
        ?
        <View style={{flex: 1}}>
          {
            renderHeader()
          }
        
          <View style={{flex: 0.75}}>
            <View>
              {
                userPic
                ?
                  <Image source={{uri: userPic}} style={styles.dp}/>
                : 
                  <></>
              }
            </View>
            {
              thoughtForTheDay.image
                ?
                  <ImageBackground 
                    style={{flex: 1, justifyContent: "center"}} 
                    source={{uri: thoughtForTheDay.image}} 
                    resizeMode={"contain"}
                  >
                    <Text adjustsFontSizeToFit numberOfLines={8} style={{textAlign: "center", fontSize: 24, color: "white"}}>{thoughtForTheDay.thought}</Text>
                    <Text style={{textAlign: "center", color: "white"}}>{thoughtForTheDay.author}</Text>
                  </ImageBackground>
                :
                  <ActivityIndicator />
            }
            
          </View>
        </View>
          : (currentPage === 'todo')
            ?
            <Todo/>
            : 
              <Expense/>
      }
      <View style={{height: 50, width: "100%", backgroundColor: 'white', justifyContent: "center", flexDirection: 'column'}}>
        <View style={{justifyContent: "space-evenly", flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => setCurrentPage('todo')}>
            <FontAwesome5 name="th-list" size={40} color={getActivePage('todo')} />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => setCurrentPage('home')}>
            <FontAwesome5 name="home" size={40} color={getActivePage('home')} style={{paddingHorizontal: 10}} />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => setCurrentPage('expense')}>
            <FontAwesome5 name="money-check" size ={40} color={getActivePage('expense')}/>
          </TouchableOpacity>

        </View>
      </View>
    </SafeAreaView>
  )
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C418C',
    justifyContent: "space-between"
    // alignItems: 'center'
  },
  textStyle: {
    color: 'white',
    fontSize: 20    
  },
  boldText: {fontWeight: "bold"},
  button: {
    borderWidth: 1,
    borderColor: 'white',
    padding: 10,
    borderRadius: 30,
  },
  dp: {width: 100, height: 100, borderRadius: 100, alignSelf: "center"}
});
