import {ImageStyle, StyleSheet, ViewStyle} from "react-native";

interface Styles {
    scroll: ViewStyle,
    userRow: ViewStyle,
    userImage: ImageStyle,
    listContainer: ViewStyle,
    listItemContainer: ViewStyle,
}

export default StyleSheet.create<Styles>({
    scroll: {
        backgroundColor: "white"
    },
    userRow: {
        alignItems: "center",
        flexDirection: "row",
        paddingBottom: 6,
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 6
    },
    userImage: {
        marginRight: 12
    },
    listContainer: {
        marginBottom: 0,
        marginTop: 0,
        borderTopWidth: 0
    },
    listItemContainer: {
        borderBottomColor: "#ECECEC"
    }
});
