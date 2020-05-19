import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  LayoutAnimation,
  Platform,
  UIManager,
  Dimensions,
  Animated,
  TouchableHighlight,
} from "react-native";
import colors from "../../Colors";
import TodoModal from "./TodoModal";
import OnlyTaskList from "./OnlyTaskList";

import {
  Swipeable,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";

const screenWidth = Math.round(Dimensions.get("window").width);

export default class TodoList extends React.Component {
  constructor() {
    super();

    this.state = { expanded: true, showListVisible: false };

    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  // state = {
  //   showListVisible: false,
  // };

  toggleListModal() {
    this.setState({ showListVisible: !this.state.showListVisible });
  }

  changeLayout = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({ expanded: !this.state.expanded });
  };

  deleteTodo = (index) => {
    this.props.deleteList(index);
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
              color: colors.white,
              fontWeight: "800",
              transform: [{ scale }],
            }}
          >
            <Feather name="trash-2" color={colors.white} size={32} />
          </Animated.Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  render() {
    const list = this.props.list;
    const completeCount = list.todos.filter((todo) => todo.completed).length;
    const remainingCount = list.todos.length - completeCount;
    const totalCount = list.todos.length;

    return (
      <Swipeable
        renderRightActions={(_, dragX) => this.rightActions(dragX, list.id)}
      >
        <Modal
          animationType="slide"
          visible={this.state.showListVisible}
          onRequestClose={() => this.toggleListModal()}
        >
          <TodoModal
            list={list}
            closeModal={() => this.toggleListModal()}
            updateList={this.props.updateList}
          />
        </Modal>

        <TouchableWithoutFeedback
          style={[styles.listContainer, { backgroundColor: list.color }]}
          onPress={() => this.toggleListModal()}
        >
          {/* <View style={{ flexDirection: "row" }}>
              <View style={{ alignItems: "center" }}>
                <Text style={styles.count}>{completeCount} / </Text>
              </View>
              <View style={{ alignItems: "center" }}>
                <Text style={styles.count}>{totalCount}</Text>
              </View>
            </View> */}
          <View style={[styles.titleView, { backgroundColor: list.color }]}>
            <Text style={[styles.listTitle]} numberOfLines={1}>
              {list.name}
            </Text>
          </View>
          <OnlyTaskList
            list={list}
            closeModal={() => this.toggleListModal()}
            updateList={this.props.updateList}
          />
        </TouchableWithoutFeedback>
      </Swipeable>
    );
  }
}

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginHorizontal: 16,
    // alignItems: "center",
    width: screenWidth - 40,
    marginVertical: 8,
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 8,
    // },
    // shadowOpacity: 0.05,
    // shadowRadius: 8,
    // elevation: 4,
  },
  titleView: {
    padding: 8,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.white,
    // textAlign: "center",
  },
  count: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.white,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.white,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: colors.red,
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    marginVertical: 34,
    marginRight: 24,
    borderRadius: 100,
  },
});
