import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  TextInput,
  Keyboard,
  Animated,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import colors from "../../Colors";
import { Swipeable, TouchableHighlight } from "react-native-gesture-handler";

export default class OnlyTaskList extends Component {
  state = {
    newTodo: "",
  };

  toggletodoCompleted = (index) => {
    let list = this.props.list;
    list.todos[index].completed = !list.todos[index].completed;

    this.props.updateList(list);
  };

  addTodo = () => {
    let list = this.props.list;

    if (!list.todos.some((todo) => todo.title === this.state.newTodo)) {
      list.todos.push({ title: this.state.newTodo, completed: false });
      this.props.updateList(list);
    }

    this.setState({ newTodo: "" });
    Keyboard.dismiss();
  };

  deleteTodo = (index) => {
    let list = this.props.list;
    list.todos.splice(index, 1);

    this.props.updateList(list);
  };

  renderTodo = (todo, index) => {
    return (
      <Swipeable
        renderRightActions={(_, dragX) => this.rightActions(dragX, index)}
      >
        <View style={styles.todoContainer}>
          <TouchableOpacity onPress={() => this.toggletodoCompleted(index)}>
            <Ionicons
              name={
                todo.completed
                  ? "ios-checkmark-circle"
                  : "ios-checkmark-circle-outline"
              }
              size={24}
              color={todo.completed ? colors.green : colors.white}
              style={{ width: 32 }}
            />
          </TouchableOpacity>
          <Text
            style={[
              styles.todo,
              {
                textDecorationLine: todo.completed ? "line-through" : "none",
                color: todo.completed ? colors.gray : colors.white,
              },
            ]}
          >
            {todo.title}
          </Text>
        </View>
      </Swipeable>
    );
  };

  rightActions = (dragX, index) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0.9],
      extrapolate: "clamp",
    });

    const opacity = dragX.interpolate({
      inputRange: [-100, -20, 0],
      outputRange: [1, 0.9, 0],
      extrapolate: "clamp",
    });
    return (
      <TouchableOpacity onPress={() => this.deleteTodo(index)}>
        <Animated.View style={[styles.deleteButton, { opacity: opacity }]}>
          <Animated.Text
            style={{
              transform: [{ scale }],
            }}
          >
            <Feather name="trash" color={colors.white} size={24} />
          </Animated.Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };
  render() {
    const list = this.props.list;

    if (list.todos.length == 0) {
      return (
        <View style={styles.noTaskView}>
          <Feather
            name="plus"
            size={20}
            color="rgba(255,255,255,0.4)"
            style={{ marginRight: 16 }}
          />
          <Text style={styles.noTaskText}>Add New Task</Text>
        </View>
      );
    }

    const taskCount = list.todos.length;
    const completedCount = list.todos.filter((todo) => todo.completed).length;
    return (
      <View style={[styles.section, { flex: 3, marginVertical: 8 }]}>
        <FlatList
          data={list.todos}
          renderItem={({ item, index }) => this.renderTodo(item, index)}
          keyExtractor={(item) => item.title}
          contentContainerStyle={{
            paddingVertical: 64,
          }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  section: {
    alignSelf: "stretch",
  },
  title: {
    fontWeight: "800",
    fontSize: 30,
    color: colors.white,
  },

  footer: {
    paddingHorizontal: 4,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    justifyContent: "flex-start",
  },

  addTodo: {
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  todoContainer: {
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 4,
  },
  todo: {
    color: colors.black,
    fontWeight: "700",
    fontSize: 20,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: colors.red,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    width: 48,
    borderRadius: 12,
  },
  noTaskView: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  noTaskText: {
    color: "rgba(255,255,255,0.4)",
    fontWeight: "600",
    fontSize: 16,
  },
});
