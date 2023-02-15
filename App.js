import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme } from "./colors";
import { styles } from "./styles";
import Todo from "./Todo";

const MODE_STORAGE_KEY = "@mode";
const TODO_STORAGE_KEY = "@toDos";

export default function App() {
  const [working, setWorking] = useState(true);
  const [edit, setEdit] = useState("");
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  useEffect(() => {
    loadRender();
  }, []);
  const travel = async () => {
    try {
      setWorking(false);
      await AsyncStorage.setItem(MODE_STORAGE_KEY, JSON.stringify(false));
    } catch (e) {
      console.error(e);
    }
  };
  const work = async () => {
    try {
      setWorking(true);
      await AsyncStorage.setItem(MODE_STORAGE_KEY, JSON.stringify(true));
    } catch (e) {
      console.error(e);
    }
  };
  const onChangeText = (payload) => setText(payload);
  const saveToDos = async (toSave) => {
    try {
      await AsyncStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      console.error(e);
    }
  };
  const loadRender = async () => {
    try {
      const m = await AsyncStorage.getItem(MODE_STORAGE_KEY);
      setWorking(JSON.parse(m));
      const t = await AsyncStorage.getItem(TODO_STORAGE_KEY);
      setToDos(JSON.parse(t));
    } catch (e) {
      console.error(e);
    }
  };
  const addToDo = async () => {
    try {
      if (text === "") {
        return;
      }
      const newToDos = {
        ...toDos,
        [Date.now()]: { text, working, completed: false },
      };
      setToDos(newToDos);
      await saveToDos(newToDos);
      setText("");
    } catch (e) {
      console.error(e);
    }
  };
  const completeToDo = async (key) => {
    try {
      const newToDos = { ...toDos };
      newToDos[key].completed = !newToDos[key].completed;
      setToDos(newToDos);
      await saveToDos(newToDos);
      console.log(newToDos);
    } catch (e) {
      console.error(e);
    }
  };
  const editToDo = (key) => {
    setEdit(key);
  };
  const saveEditToDo = async (key, text) => {
    try {
      const newToDos = { ...toDos };
      newToDos[key].text = text;
      // console.log(newToDos);
      setToDos(newToDos);
      await saveToDos(newToDos);
      setEdit("");
    } catch (e) {
      console.error(e);
    }
  };
  const deleteToDo = (key) => {
    if (Platform.OS === "web") {
      const ok = confirm("Do you want to delete this To Do?");
      if (ok) {
        const newToDos = { ...toDos };
        delete newToDos[key];
        setToDos(newToDos);
        saveToDos(newToDos);
      }
    } else {
      Alert.alert("Delete To Do", "Are you sure?", [
        { text: "Cancel" },
        {
          text: "I'm Sure",
          onPress: () => {
            const newToDos = { ...toDos };
            delete newToDos[key];
            setToDos(newToDos);
            saveToDos(newToDos);
          },
        },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{
              ...styles.btnText,
              color: working ? "white" : theme.gray,
            }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{
              ...styles.btnText,
              color: !working ? "white" : theme.gray,
            }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        onSubmitEditing={addToDo}
        onChangeText={onChangeText}
        returnKeyType="done"
        value={text}
        placeholder={working ? "Add a To Do" : "Where do you want to go?"}
        style={styles.input}
      />
      <ScrollView>
        {toDos &&
          Object.keys(toDos).map((key) =>
            toDos[key].working === working ? (
              <Todo
                key={key}
                id={key}
                toDos={toDos}
                completeToDo={completeToDo}
                edit={edit}
                editToDo={editToDo}
                saveEditToDo={saveEditToDo}
                deleteToDo={deleteToDo}
              />
            ) : null,
          )}
      </ScrollView>
    </View>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: theme.bg,
//     paddingHorizontal: 20,
//   },
//   header: {
//     justifyContent: "space-between",
//     flexDirection: "row",
//     marginTop: 100,
//   },
//   btnText: {
//     fontSize: 44,
//     fontWeight: "600",
//     color: "white",
//   },
//   input: {
//     backgroundColor: "white",
//     paddingVertical: 15,
//     paddingHorizontal: 20,
//     borderRadius: 30,
//     marginVertical: 20,
//     fontSize: 18,
//   },
//   toDo: {
//     backgroundColor: theme.toDoBg,
//     marginBottom: 10,
//     paddingVertical: 20,
//     paddingHorizontal: 20,
//     borderRadius: 15,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   toDoText: {
//     color: "white",
//     fontSize: 16,
//     fontWeight: "500",
//   },
// });
