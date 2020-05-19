import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Modal,
  ActivityIndicator,
  Image,
  Platform,
  Dimensions,
  StatusBar,
  StatusBarIOS,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import colors from "./Colors";
import tempData from "./TempData";
import TodoList from "./src/COMPONENTS/TodoList";
import AddListModal from "./src/COMPONENTS/AddListModal";
import Fire from "./Fire";
import avatar from "./src/ASSETS/img/avatar.jpeg";
import Profile from "./src/COMPONENTS/Profile";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { BlurView } from "expo-blur";
const screenHeight = Math.round(Dimensions.get("window").height);
const screenWidth = Math.round(Dimensions.get("window").width);
console.disableYellowBox = true;

export default class App extends Component {
  state = {
    addTodoVisible: false,
    lists: [],
    user: {},
    loading: true,
    profileVisible: false,
  };

  componentDidMount() {
    firebase = new Fire((error, user) => {
      if (error) {
        return console.log("Deymm! Something went wrong");
      }
      firebase.getLists((lists) => {
        this.setState({ lists, user }, () => {
          this.setState({ loading: false });
        });
      });
      this.setState({ user });
    });
  }

  componentWillUnmount() {
    firebase.detach();
  }

  toggleAddTodoModal() {
    this.setState({ addTodoVisible: !this.state.addTodoVisible });
  }

  toggleProfileModal() {
    this.setState({ profileVisible: !this.state.profileVisible });
  }

  renderList = (list) => {
    return (
      <TodoList
        deleteList={this.deleteList}
        list={list}
        updateList={this.updateList}
      />
    );
  };

  addList = (list) => {
    firebase.addList({
      name: list.name,
      color: list.color,
      todos: [],
    });
  };

  updateList = (list) => {
    firebase.updateList(list);
  };

  deleteList = (id) => {
    firebase.deleteList(id);
  };
  render() {
    const { profileVisible } = this.state;
    if (this.state.loading) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={colors.blue} />
        </View>
      );
    }
    return (
      <View style={styles.container}>
       
          <Modal
            animationType="slide"
            visible={this.state.addTodoVisible}
            onRequestClose={() => this.toggleAddTodoModal()}
          >
            <AddListModal
              closeModal={() => this.toggleAddTodoModal()}
              addList={this.addList}
            />
          </Modal>

        <Modal
          animationType="slide"
          visible={profileVisible}
          onRequestClose={() => this.toggleProfileModal()}
        >
          <Profile closeModal={() => this.toggleProfileModal()} />
        </Modal>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 36,
            paddingHorizontal: 16,
          }}
        >
          <Text style={styles.title}>
            Today{" "}
            <Text style={{ fontWeight: "300", color: colors.blue }}>Lists</Text>
          </Text>
          <TouchableWithoutFeedback onPress={() => this.toggleProfileModal()}>
            <Feather name="user" size={28} color={colors.black} />
            {/* <Image style={styles.avatar} source={avatar} /> */}
          </TouchableWithoutFeedback>
        </View>

        <View style={{ marginTop: 16, flex: 1 }}>
          <FlatList
            data={this.state.lists}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => this.renderList(item)}
            keyboardShouldPersistTaps="always"
            contentContainerStyle={{ paddingBottom: 65 }}
          />
        </View>
        <BlurView
          tint="default"
          intensity={100}
          style={[
            styles.addListCard,
            this.state.lists.length == 0
              ? { bottom: screenHeight / 2 }
              : { bottom: 0 },
          ]}
        >
          <TouchableOpacity
            style={styles.addList}
            onPress={() => this.toggleAddTodoModal()}
          >
            <Feather
              name="plus"
              size={this.state.lists.length == 0 ? 36 : 24}
              color={colors.black}
            />
            <Text
              style={{
                color: colors.black,
                paddingLeft: 4,
                fontWeight: "bold",
                fontSize: this.state.lists.length == 0 ? 24 : 16,
              }}
            >
              Create New List
            </Text>
          </TouchableOpacity>
        </BlurView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "center",
  },
  divider: {
    backgroundColor: colors.lightBlue,
    height: 1,
    flex: 1,
    alignSelf: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.balck,
    flexGrow: 1,
  },
  addList: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  add: {
    color: colors.blue,
    fontWeight: "bold",
    marginTop: 8,
    fontSize: 16,
  },
  avatar: {
    borderRadius: 100,
    alignSelf: "center",
    width: 40,
    height: 40,
  },
  addListCard: {
    backgroundColor: colors.lightGray,
    position: "absolute",
    paddingTop: 8,
    ...Platform.select({
      ios: {
        height: 65,
      },
      android: {
        height: 45,
      },
    }),
    width: screenWidth,
  },
});
