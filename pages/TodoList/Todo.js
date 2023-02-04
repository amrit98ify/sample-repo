import { React, useEffect, useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { AntDesign } from '@expo/vector-icons';
import Task from './Task';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Todo() {
    const [tasks, setTasks] = useState([]);
    const [currTask, setCurrTask] = useState('');

    useEffect(() => {
        const getData = async () => {
            try {
              const jsonValue = await AsyncStorage.getItem('storedTasks')
              setTasks(jsonValue != null ? JSON.parse(jsonValue) : []);
            } catch(e) {
              console.log(e)
            } finally {
              console.log('all tasks were fetched from storage')
            }
        }

        getData();
    },[])

    function addItem() {
        const updatedList = [...tasks, currTask];
        setTasks(updatedList);
        storeData(updatedList);
        setCurrTask('');
    }

    const storeData = async (value) => {
        try {
          const jsonValue = JSON.stringify(value);
          await AsyncStorage.setItem('storedTasks', jsonValue)
        } catch (e) {
          console.log(e)
        } finally {
            console.log('tasks were stored!')
        }
      }

    function deleteTask(taskToRemove) {
        const newTasks = tasks.filter((thisTask) => thisTask !== taskToRemove)
        setTasks(newTasks);
        storeData(newTasks);
    }

    return (
        <View style={{flex: 1}}>
            <Text style={styles.heading}>To-Do List:</Text>

            <ScrollView style={styles.scrollStyle} contentContainerStyle={{paddingBottom: 20}}>
                {
                    tasks.map((item, index) => {
                        return (
                            <View key={index}>
                                <Task text={item} deleteItem={() => deleteTask(item)}/>
                            </View>
                            )
                        }
                    )
                }
                
            </ScrollView>
            
            
            <KeyboardAvoidingView 
                style={{flexDirection: "row"}}
                behavior={Platform.OS === "ios" ? "padding" : "height"}>
            
                <TextInput 
                    style={[styles.scrollStyle, styles.textBox, (Platform.OS === "ios" && {marginBottom: "10%"}) ]}
                    value={currTask}
                    onChangeText={setCurrTask}    
                />
            
                <TouchableOpacity 
                    onPress={() => addItem()}
                    style={[styles.addButton,(Platform.OS === "ios" && {marginBottom: "10%"})]}
                >
                    <AntDesign name="pluscircle" size={28} color="white" />
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </View>
    )
};

const styles = StyleSheet.create({
    heading: {
        color: "white",
        fontSize: 20
    },
    scrollStyle: {borderWidth: 1, borderColor: "white", margin: 10, padding: 10, borderRadius: 5},
    textBox: {
        color: "white",
        flex: 0.96
    },
    addButton: {
        margin: 10,
        alignSelf: "center"
    }
})