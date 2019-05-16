import React from 'react';
import {
    Animated,
    Easing,
    LayoutAnimation,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    UIManager,
    View
} from 'react-native';
import {NavigationScreenProps} from "react-navigation";
import AutoHeightImage from 'react-native-auto-height-image';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import codePush from 'react-native-code-push';
// @ts-ignore
import {ROUTES} from "../routes";
import Images from '../themes/Images';

UIManager.setLayoutAnimationEnabledExperimental &&
UIManager.setLayoutAnimationEnabledExperimental(true);

interface MyProps {

}

type Props = MyProps & NavigationScreenProps;

// interface State {
//     isLoading: boolean;
// }

class SplashScreen extends React.Component<Props> {
    private animatedValue: Animated.Value;
    state = {
        isLoading: true,
    };

    constructor(props: Props) {
        super(props);
        this.animatedValue = new Animated.Value(0)
    }

    async componentDidMount() {
        await this.performTimeConsumingTask();
    };

    componentWillUnmount() {

    };
    //
    // // @ts-ignore
    // animateState(nextState: $Shape<State>, delay: number = 0) {
    //     setTimeout(() => {
    //         this.setState(() => {
    //             LayoutAnimation.easeInEaseOut();
    //             return nextState;
    //         });
    //     }, delay);
    // };

    performTimeConsumingTask = async () => {
        return new Promise((resolve) =>
            setTimeout(
                () => {
                    this.animate();
                    this.setState({isLoading: false});
                },
                100
            )
        );
    };

    animate() {
        this.animatedValue.setValue(0)
        Animated.timing(
            this.animatedValue,
            {
                toValue: 1,
                duration: 2000,
                easing: Easing.linear
            }
        ).start(() => this.animate());
    }

    render() {
        const message = this.state.isLoading ? 'Loading...' : 'Tap Anywhere to continue';
        const opacity = this.animatedValue.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 1, 0]
        });
        return (
            <TouchableWithoutFeedback
                style={styles.container}
                onPress={() => !this.state.isLoading && this.props.navigation.navigate(ROUTES.Login)}>
                <View style={styles.mainDiv}>
                    <AutoHeightImage width={wp(60)} source={Images.logo}/>
                    {this.state.isLoading ?
                        <Text style={styles.message}>{message}</Text> :
                        <Animated.Text style={[styles.message, {opacity: opacity}]}>{message}</Animated.Text>
                    }
                </View>
            </TouchableWithoutFeedback>
        );
    };
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: '#311f36',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    mainDiv: {
        width: '100%',
        height: '100%',
        backgroundColor: '#311f36',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    canvas: {
        width: '60%',
        resizeMode: 'contain',
    },
    message: {
        margin: 20,
        color: '#fff',
        fontSize: 20,
    },
});

let codePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_RESUME };
export default codePush(codePushOptions)(SplashScreen);

