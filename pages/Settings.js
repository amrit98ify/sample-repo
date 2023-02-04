import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { Camera } from 'expo-camera';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';

export default function SettingsPage(props) {
  const [userName, setUserName] = useState('');
  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = Camera.useCameraPermissions();
  const [photoToSave, setPhotoToSave] = useState();

  useEffect(() => {
    (async () => {
      try {
        const value = await AsyncStorage.getItem('userName')
        if(value !== null) {
          setUserName(value);
        }
      } catch(e) {
        // error reading value
      }
    }) ();
  },[])

    useEffect(() => {
      (async () => {
        try {
          
        } catch(e) {
          // error reading value
        }
      }) ();
    },[userName])

    async function saveChanges() {
      props.changeName(userName);  
      props.changePic(photoToSave);
      await AsyncStorage.setItem('userName', userName).then(() => props.goBack());
      if (photoToSave) {
        await AsyncStorage.setItem('userPic', photoToSave);
      }
    }

    async function takePhoto (){
      const qual = {
        quality: 1,
        base64: true,
        exif: false
      };
  
      let photo = await cameraRef.current.takePictureAsync(qual);
      setPhotoToSave(photo.uri);
  
      
    }

    function clearPhoto() {
      setPhotoToSave('');
    }

  
    return (
      <SafeAreaView style={{flex: 3}}>
          <View style={{flexDirection: 'row', backgroundColor: "#0C418C", height: 50}}>
            <TouchableOpacity onPress={() => props.goBack()} style={{flex: 0.5, alignSelf: "center"}}>
              <Ionicons name="arrow-back-outline" size={24} color="white" />
            </TouchableOpacity>

            <Text style={{flex: 1, textAlign: "center", alignSelf: "center", color: "white"}}>Settings</Text>

            <View style={{flex: 0.5}}/>
          </View>
          <View style={{flex: 3, padding: 10, justifyContent: "space-between"}}>
            <Text>Edit your profile!</Text>

          <View style={{marginVertical: 20}}>
            <Text>Change your name:</Text>
            <TextInput value={userName} onChangeText={setUserName} style={styles.inputStyle}/>
          </View>

          <View style={{marginVertical: 20}}>
            <Text>Change your photo:</Text>

            {photoToSave ?
              <View>
                <Image source={{uri: photoToSave}} style={{width: 200, height: 200, alignSelf: "center"}}/>
                <TouchableOpacity onPress={() => clearPhoto()} style={[styles.buttonStyle, {alignSelf: "center"}]}>
                  <Fontisto name="undo" size={24} color="white" />
                </TouchableOpacity>
              </View>
              :
              hasCameraPermission?
              hasCameraPermission.granted 
              ? 
                // (photoToSave) 
                // ? <Image source={{uri: 'data:image/jpg;base64' + photoToSave.uri}} style={{height: 500, width: 500}} resizeMode="contain"></Image>
                // : 
                <>
                  <Camera style={{width: 200, height: 200, alignSelf: "center"}} ref={cameraRef}/> 
                  <View style={{flexDirection: "row", justifyContent: "space-evenly"}}>
                    <TouchableOpacity onPress={() => {}} style={styles.buttonStyle}>
                      <Ionicons name="camera-reverse" size={24} color="white" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => takePhoto()} style={styles.buttonStyle}>
                      <MaterialCommunityIcons name="camera-iris" size={24} color="white" />
                    </TouchableOpacity>
                  </View>
                </>
                
              : 
                <>
                  <Text>Sorry, you did not grant permission for camera!</Text>
                  <TouchableOpacity onPress={() => setHasCameraPermission()}>
                    <Text>Grant Permission</Text>
                  </TouchableOpacity>
                </>
              : <ActivityIndicator />
            }
            
          </View>

          <TouchableOpacity onPress={() => saveChanges()}>
            <Text>SAVE!</Text>
          </TouchableOpacity>
          

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
  inputStyle: {
    borderWidth: 1,
    borderColor: '#0C418C',
    // width: 200,
    height: 45,
    borderRadius: 30,
    color: '#0C418C',
    paddingHorizontal: 10,

  },
  buttonStyle: {backgroundColor: "gray", width: 50, height: 50, borderWidth: 1, borderRadius: 50, alignItems: "center", justifyContent: "center"}
});
