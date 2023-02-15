import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme } from "./colors";
import { styles } from "./styles";

export default function Todo({
  id,
  toDos,
  completeToDo,
  edit,
  editToDo,
  saveEditToDo,
  deleteToDo,
}) {
  const [editText, setEditText] = useState("");
  const onChangeEditText = (payload) => setEditText(payload);
  return (
    <View style={styles.toDo}>
      {id === edit ? (
        <>
          <TextInput
            onSubmitEditing={() => saveEditToDo(id, editText)}
            onChangeText={onChangeEditText}
            returnKeyType="done"
            value={editText}
            placeholder={toDos[id].text}
            style={styles.editInput}
          />
          <TouchableOpacity onPress={() => saveEditToDo(id, editText)}>
            <Feather name="save" size={18} color={theme.gray} />
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text
            style={{
              ...styles.toDoText,
              ...(toDos[id].completed && {
                color: theme.gray,
                textDecoration: "line-through",
              }),
            }}
          >
            {toDos[id].text}
          </Text>
          <View
            style={{
              flexDirection: "row",
              gap: 6,
            }}
          >
            <TouchableOpacity onPress={() => completeToDo(id)}>
              {toDos[id].completed ? (
                <Feather name="check-square" size={18} color={theme.gray} />
              ) : (
                <Feather name="square" size={18} color={theme.gray} />
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => editToDo(id)}>
              <Feather name="edit-3" size={18} color={theme.gray} />
              {/* <Feather name="save" size={18} color={theme.gray} /> */}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteToDo(id)}>
              <Feather name="trash-2" size={18} color={theme.gray} />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}
