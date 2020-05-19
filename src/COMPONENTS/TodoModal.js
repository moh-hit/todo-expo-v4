import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  Platform,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  TextInput,
  Keyboard,
  Animated,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import colors from "../../Colors";
import {
  Swipeable,
  TouchableHighlight,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";

export default class TodoModal extends Component {
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

    const taskCount = list.todos.length;
    const completedCount = list.todos.filter((todo) => todo.completed).length;
    return (
      <KeyboardAvoidingView
        onPress={() => Keyboard.dismiss()}
        style={{ flex: 1 }}
        behavior="height"
      >
        <View style={[styles.container, { backgroundColor: list.color }]}>
          <TouchableOpacity
            style={{
              position: "absolute",
              ...Platform.select({
                ios: {
                  top: 68,
                },
                android: {
                  top: 36,
                },
              }),
              right: 16,
              zIndex: 10,
            }}
            hitSlop={{ right: 16, left: 16, top: 16, bottom: 16 }}
            onPress={this.props.closeModal}
          >
            <Feather name="x" size={28} color={colors.white} />
          </TouchableOpacity>

          <View
            style={[
              styles.section,
              styles.header,
              { backgroundColor: list.color },
            ]}
          >
            <View>
              <Text style={styles.title}>{list.name}</Text>
              <Text style={styles.taskCount}>
                {completedCount} of {taskCount} tasks
              </Text>
            </View>
          </View>
          <View style={[styles.section, { flex: 3, marginVertical: 16 }]}>
            <FlatList
              data={list.todos}
              renderItem={({ item, index }) => this.renderTodo(item, index)}
              keyExtractor={(item) => item.title}
              contentContainerStyle={{
                paddingVertical: 32,
                paddingHorizontal: 24,
              }}
              showsVerticalScrollIndicator={false}
            />
          </View>
          <View style={[styles.section, styles.footer]}>
            <TextInput
              style={[styles.input, { borderColor: list.color }]}
              onChangeText={(text) => this.setState({ newTodo: text })}
              value={this.state.newTodo}
              placeholder="Add new task..."
              placeholderTextColor="rgba(255,255,255,0.5)"
            />
            <TouchableOpacity
              style={[styles.addTodo, { marginRight: 8 }]}
              onPress={() => this.addTodo()}
            >
              <Feather name="plus-circle" size={32} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    alignSelf: "stretch",
  },
  header: {
    justifyContent: "flex-end",
    ...Platform.select({
      ios: {
        paddingTop: 64,
      },
      android: {
        paddingTop: 20,
      },
    }),
    paddingLeft: 16,
  },
  title: {
    fontWeight: "bold",
    fontSize: 30,
    color: colors.white,
  },
  taskCount: {
    marginTop: 4,
    marginBottom: 16,
    color: colors.white,
    fontWeight: "600",
  },
  footer: {
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 36,
    justifyContent: "flex-start",
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    marginRight: 8,
    fontSize: 20,
    color: colors.white,
    paddingHorizontal: 8,
    fontWeight: "600",
    backgroundColor: "rgba(0,0,0,0)",
  },
  addTodo: {
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  todoContainer: {
    paddingVertical: 16,
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
});
