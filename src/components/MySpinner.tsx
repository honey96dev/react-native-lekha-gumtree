import React from 'react';
import {View} from "react-native";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import {Colors} from "../themes";
import {Icon} from "react-native-elements";
// @ts-ignore
import Spinner from 'react-native-spinkit';

interface Props {
    visible?: boolean,
    size?: number,
    type?: string,
    color?: string,
    overlayColor?: string,
}

interface State {

}

// export default class MySpinner extends React.Component<Props, State> {
//     constructor(props: Props) {
//         super(props);
//     }
//
//     render() {
//         const {props, state} = this;
//         return (
//             {!!props.visible && <View
//                 style={{
//                     position: 'absolute',
//                     top: 0,
//                     width: wp(100),
//                     height: hp(100),
//                     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//                     flexDirection: 'column',
//                     alignItems: 'center',
//                 }}>
//                 <Spinner
//                     style={{
//                         width: wp(15),
//                         height: hp(100),
//                     }}
//                     // visible={state.doingLoading}
//                     isVisible={true}
//                     size={10}
//                     type={'Circle'}
//                     // textContent={'Loading...'}
//                     color={Colors.brandPrimary}
//                     // ovrerlayColor={'rgba(255, 0, 0, 0.5)'}
//                     // textStyle={styles.descText}
//                 />
//             </View>}
//     }
// }

const MySpinner = ({visible, size, type, color, overlayColor, ...otherProps}: Props) => {
    if (!size) {
        size = 15;
    }
    if (!type) {
        type = 'Circle';
    }
    if (!color) {
        color: 'white';
    }
    if (!overlayColor) {
        overlayColor = 'rgba(0, 0, 0, 0.25)';
    }
    if (visible) {
        return (
            <View
                {...otherProps}
                style={{
                    position: 'absolute',
                    top: 0,
                    width: wp(100),
                    height: hp(100),
                    backgroundColor: overlayColor,
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                <Spinner
                    style={{
                        width: wp(size),
                        height: hp(100),
                    }}
                    // visible={state.doingLoading}
                    isVisible={true}
                    type={type}
                    // textContent={'Loading...'}
                    color={color}
                    // ovrerlayColor={'rgba(255, 0, 0, 0.5)'}
                    // textStyle={styles.descText}
                />
            </View>);
    } else {
        return (<View style={{height: 0}}/>);
    }
};
export default MySpinner;
