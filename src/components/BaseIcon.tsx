import * as React from 'react'
import {StyleSheet, View, ViewStyle} from 'react-native'
import {Icon} from "react-native-elements";


interface Styles {
    container: ViewStyle,
}

const styles = StyleSheet.create<Styles>({
    container: {
        alignItems: 'center',
        backgroundColor: 'black',
        borderColor: 'transparent',
        borderRadius: 10,
        borderWidth: 1,
        height: 34,
        justifyContent: 'center',
        marginLeft: 10,
        marginRight: 18,
        width: 34,
    },
});

interface Props {
    containerStyle: ViewStyle;
    icon: any;
    onPress?: () => void;
}

const BaseIcon = ({containerStyle, icon, onPress}: Props) => (
    <View style={[styles.container, containerStyle]}>
        <Icon
            size={24}
            color="white"
            type="material"
            name="notifications"
            onPress={onPress}
            {...icon}
        />
    </View>
);
export default BaseIcon;
