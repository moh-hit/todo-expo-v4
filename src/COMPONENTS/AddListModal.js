import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import colors from "../../Colors";
import tempData from "../../TempData";
const screenHeight = Math.round(Dimensions.get("window").height);

export default class AddListModal extends Component {
  backgroundColor = [
    "#494ca2",
    "#7a81eb",
    "#6a2c70",
    "#e84545",
    "#f6b61e",
    "#207561",
    "#50d890",
  ];

  state = {
    name: "",
    color: this.backgroundColor[0],
  };

  createTodo = () => {
    const { name, color } = this.state;

    const list = { name, color };
    this.props.addList(list);

    this.setState({ name: "" });
    this.props.closeModal();
  };

  renderColors() {
    return this.backgroundColor.map((color) => {
      return (
        <TouchableOpacity
          key={color}
          style={[styles.colorSheet, { backgroundColor: color }]}
          onPress={() => this.setState({ color })}
        />
      );
    });
  }
  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="height">
        <TouchableOpacity
          style={{
            position: "absolute",
            ...Platform.select({
              android: {
                top: 24,
              },
              ios: {
                top: 64,
              },
            }),
            right: 32,
          }}
          onPress={this.props.closeModal}
        >
          <AntDesign name="close" size={24} color={colors.black} />
        </TouchableOpacity>

        <View style={{ alignSelf: "stretch", marginHorizontal: 32 }}>
          <Text style={styles.title}>Create Todo List</Text>
          <TextInput
            autoFocus
            style={styles.input}
            placeholder="List Name..."
            onChangeText={(text) => this.setState({ name: text })}
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              marginTop: 12,
            }}
          >
            {this.renderColors()}
          </View>

          <TouchableOpacity
            style={[styles.create, { backgroundColor: this.state.color }]}
            onPress={this.createTodo}
          >
            <Text style={{ color: colors.white, fontWeight: "600" }}>
              Create!
            </Text>
          </TouchableOpacity>
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
    height: screenHeight + 20,
  },
  title: {
    color: colors.black,
    fontSize: 28,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 16,
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.blue,
    borderRadius: 12,
    height: 50,
    paddingHorizontal: 16,
    fontWeight: "600",
    fontSize: 16,
  },
  create: {
    marginTop: 24,
    height: 50,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  colorSheet: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
});
