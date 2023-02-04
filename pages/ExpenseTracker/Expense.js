import { React, useEffect, useState } from 'react'
import { KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { AntDesign } from '@expo/vector-icons';
// import Task from './Task';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Expense() {
    const [expenses, setExpenses] = useState([]);
    const [addExpenseModal, setAddExpenseModal] = useState(false);
    const [reviewExpenseModal, setReviewExpenseModal] = useState(false);
    const [currExp, setCurrExp] = useState({
        amount: 0,
        comment: "",
        month: 0
    });
    const [itemValid, setItemValid] = useState('');

    useEffect(() => {
        const getData = async () => {
            try {
              const jsonValue = await AsyncStorage.getItem('storedExpenses')
              let fetchedExpenses = (jsonValue != null ? JSON.parse(jsonValue) : []);
              setExpenses(fetchedExpenses.sort((a,b) => a.month - b.month))
            } catch(e) {
              console.log(e)
            } finally {
              console.log('all expenses were fetched from storage')
            }
        }

        getData();
    },[])

    useEffect(() => {
        console.log(currExp)
    },[currExp])

    function addItem() {
        const updatedList = [...expenses, currExp];
        setExpenses(updatedList);
        storeData(updatedList);
        setCurrExp({
            amount: 0,
            comment: "",
            month: 0
        });
    }

    const storeData = async (value) => {
        try {
          const jsonValue = JSON.stringify(value);
          await AsyncStorage.setItem('storedExpenses', jsonValue)
        } catch (e) {
          console.log(e)
        } finally {
            console.log('expenses were stored!');
            setAddExpenseModal(false);
        }
      }

    // function deleteTask(taskToRemove) {
    //     const newTasks = tasks.filter((thisTask) => thisTask !== taskToRemove)
    //     setTasks(newTasks);
    //     storeData(newTasks);
    // }

    function validateItem (){
        const itemToValidate = currExp;
        let valid = false;
        if (itemToValidate.month > 0 && itemToValidate.month <= 12) {
            if (itemToValidate.amount > 0) {
                if (itemToValidate.comment.trim()) {
                    valid = true;
                }
            }
        }
        
        if (valid) {
            setItemValid('');
            addItem();
        }
        else {
            setItemValid('invalid');
        }
    }

    return (
        <View style={{flex: 1}}>
            <Modal transparent={true} visible={addExpenseModal || reviewExpenseModal} animationType={"fade"}>
                <View style={styles.modal.background}>
                    { addExpenseModal ?
                    <View style={styles.modal.content}>
                        <TouchableOpacity onPress={() => setAddExpenseModal(false)} style={{alignSelf: "flex-end"}}>
                            <AntDesign name="closecircle" size={24} color="#0C418C" />
                        </TouchableOpacity>
                        <View style={{justifyContent: "space-between", flex: 0.6, marginVertical: "5%"}}>
                            <TextInput 
                                placeholder='Name of the expense'
                                value={currExp.comment}
                                style={styles.textBox}
                                onChangeText={(val) => setCurrExp({...currExp, comment: val})}
                            />

                            <TextInput 
                                placeholder='Month of the expense'
                                value={currExp.month}
                                style={[styles.textBox, (!(currExp.month > 0 && currExp.month <= 12)) && {borderColor: "red"}]}
                                onChangeText={(val) => setCurrExp({...currExp, month: val})}
                            />

                            <TextInput 
                                placeholder='Expense amount'
                                value={currExp.amount}
                                style={styles.textBox}
                                onChangeText={(val) => setCurrExp({...currExp, amount: val})}
                            />
                        </View>
                        {
                            itemValid === "invalid" ?
                            <Text style={{textAlign: "center"}}>Check if the details entered is valid!</Text>
                            :
                            <></>
                        }
                        <TouchableOpacity style={styles.modal.button} onPress={() => validateItem()}>
                            <Text style={{color: "white"}}>ADD EXPENSE</Text>
                        </TouchableOpacity>
                    </View>
                    :
                    <View style={styles.modal.content}>
                        <TouchableOpacity onPress={() => setReviewExpenseModal(false)} style={{alignSelf: "flex-end"}}>
                            <AntDesign name="closecircle" size={24} color="#0C418C" />
                        </TouchableOpacity>
                        <View style={{justifyContent: "space-between", flex: 0.6, marginVertical: "5%"}}>
                            
                        </View>
                    </View>
                    }
                </View>
            </Modal>
            <Text style={styles.heading}>Expense Tracker</Text>
            <View style={styles.scrollStyle}>
            <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                    <Text style={styles.tableHeaderText}>MONTH</Text>
                    <Text style={styles.tableHeaderText}>NAME OF THE EXPENSE</Text>
                    <Text style={styles.tableHeaderText}>AMOUNT</Text>
                </View>
            <ScrollView  contentContainerStyle={{paddingBottom: 20}}>
                
                {
                    expenses.map((item, index) => {
                        return (
                            <View key={index} style={{flexDirection: "row", justifyContent: "space-between", paddingTop: 10}}>
                                <Text style={styles.tableRowText}>{item.month}</Text>
                                <Text style={styles.tableRowText}>{item.comment}</Text>
                                <Text style={styles.tableRowText}>{item.amount}</Text>
                            </View>
                            )
                        }
                    )
                }
                
            </ScrollView>
            </View>
            
            <View 
                style={{justifyContent: "center", flexDirection: "row"}}>
                
                <TouchableOpacity 
                    onPress={() => setReviewExpenseModal(true)}
                    style={styles.addButton}
                >
                    <Text style={{color: "white"}}>VIEW MY EXPENSES</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={() => setAddExpenseModal(true)}
                    style={styles.addButton}
                >
                    <AntDesign name="pluscircle" size={28} color="white" />
                </TouchableOpacity>
                
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    heading: {
        color: "white",
        fontSize: 20
    },
    scrollStyle: {flex: 1, borderWidth: 1, borderColor: "white", margin: 10, padding: 10, borderRadius: 5},
    textBox: {
        color: "#0C418C",
        borderWidth: 1,
        borderColor: "#0C418C",
        height: 40,
        borderRadius: 5,
        padding: 10
    },
    addButton: {
        margin: 10,
        alignSelf: "center"
    },
    modal: {
        background: {flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: "center", alignItems: "center"},
        content: {backgroundColor: "white", height: "60%", width: "80%", padding: "5%", borderRadius: 15, justifyContent: "space-between"},
        button: {alignSelf: "center", backgroundColor: "#0C418C", padding: "5%", borderRadius: 10}
    },
    tableHeaderText: {
        color: "white",
        fontWeight: "bold"
    },
    tableRowText: {
        color: "white"
    }
})