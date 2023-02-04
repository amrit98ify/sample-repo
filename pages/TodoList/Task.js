import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Task(props) {
    return (
        <View style={styles.itemView}>
            <Text style={{fontSize: 18, color: "white"}}>{props.text}</Text>

            <TouchableOpacity onPress={() => props.deleteItem()}>
                <MaterialCommunityIcons name="delete-circle-outline" size={24} color="white" />
            </TouchableOpacity>
        </View>
    )
};

const styles = StyleSheet.create({
    itemView: {
        borderWidth: 1,
        padding: 10,
        backgroundColor: "#3E90FC",
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "space-between"
    }
})