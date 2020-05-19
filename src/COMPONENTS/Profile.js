import React, { Component } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import colors from "../../Colors";

export default class Profile extends Component {
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={{ position: "absolute", top: 44, left: 32 }}
          onPress={this.props.closeModal}
        >
          <Feather name="arrow-left" size={30} color={colors.black} />
        </TouchableOpacity>
        {/* <View style={styles.menu}>
          <TouchableWithoutFeedback style={styles.menuOption}>
            <Text>Terms</Text>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback style={styles.menuOption}>
            <Text>Terms</Text>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback style={styles.menuOption}>
            <Text>Terms</Text>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback style={styles.menuOption}>
            <Text>Terms</Text>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback style={styles.menuOption}>
            <Text>Terms</Text>
          </TouchableWithoutFeedback>
        </View> */}
        <View
          style={{ justifyContent: "flex-end", alignItems: "center", flex: 1, marginBottom: 32 }}
        >
          <Text style={styles.versionInfo}>Version: 1.0.0</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  versionInfo: {
    fontWeight: "bold",
    fontSize: 16,
    color: colors.gray,
  },
  menu: {
    flex: 2,
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
