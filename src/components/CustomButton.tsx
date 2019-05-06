import React from "react";
import PropTypes from "prop-types";
import {ActivityIndicator, StyleSheet, Text, TextStyle, ViewStyle} from "react-native";
import { View } from "react-native-animatable";

import TouchableView from "./TouchableView";



interface PropTypes {
  onPress: () => void,
  isEnabled: boolean,
  isLoading: boolean,
  text: string,
  buttonStyle: ViewStyle,
  textStyle: TextStyle
};

const CustomButton = ({
  onPress,
  isEnabled,
  isLoading,
  text,
  buttonStyle,
  textStyle,
  ...otherProps
} : PropTypes) => {
  const onButtonPress = isEnabled && !isLoading ? onPress : () => null;

  return (
    <View {...otherProps}>
      <TouchableView
        onPress={onButtonPress}
        style={[styles.button, buttonStyle]}
        isRippleDisabled={true}
        rippleColor={'#fff'}
      >
        {isLoading && (
          <ActivityIndicator style={styles.spinner} color={"grey"} />
        )}
        {!isLoading && <Text style={[styles.text, textStyle]}>{text}</Text>}
      </TouchableView>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 42,
    borderWidth: 1,
    borderRadius: 10,
    alignSelf: "stretch",
    justifyContent: "center",
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  spinner: {
    height: 26
  },
  text: {
    textAlign: "center",
    fontWeight: "400",
    color: "white"
  }
});

export default CustomButton;
