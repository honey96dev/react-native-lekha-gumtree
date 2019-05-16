import React from 'react'
import {StyleSheet, Text, View} from 'react-native'
import {Colors, Fonts, Metrics} from "../themes";

const styles = StyleSheet.create({
    container: {
        paddingTop: Metrics.basePadding,
        paddingBottom: Metrics.basePadding,
        paddingLeft: Metrics.basePadding,
        backgroundColor: Colors.backgroundGray,
    },
    infoText: {
        fontSize: Fonts.size.input,
        marginLeft: 0,
        color: 'gray',
        fontWeight: '400',
    },
});
// const InfoText = (text: any) => (
//     <View style={styles.container}>
//         <Text style={styles.infoText}>{text}</Text>
//     </View>
// );

// InfoText.propTypes = {
//     text: PropTypes.string.isRequired,
// };

interface Props {
    text: string;
}

export default class InfoText extends React.Component<Props> {

    constructor(props: Props) {
        super(props);
    }

    render() {
        return(
            <View style={styles.container}>
                <Text style={styles.infoText}>{this.props.text}</Text>
            </View>
        );
    }
}
