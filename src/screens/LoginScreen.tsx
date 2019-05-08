import React, {Component} from 'react';
import {Alert, LayoutAnimation, StyleSheet, Text, UIManager, View} from 'react-native';
import {NavigationScreenProps} from "react-navigation";
import {Button} from 'react-native-elements';
import Swiper from 'react-native-swiper';
import {authorize, refresh, revoke} from 'react-native-app-auth';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import AutoHeightImage from 'react-native-auto-height-image';
// @ts-ignore
import Spinner from 'react-native-loading-spinner-overlay';
import {ROUTES} from "../routes";
import {Colors, Fonts, Metrics} from "../themes";
import Images from "../themes/Images";
import G from '../tools/G';
import {api_list, fetch, GET} from "../apis";

UIManager.setLayoutAnimationEnabledExperimental &&
UIManager.setLayoutAnimationEnabledExperimental(true);

interface MyProps {
}

type Props = MyProps & NavigationScreenProps;

interface State {
    hasLoggedInOnce: boolean;
    accessToken?: string;
    accessTokenExpirationDate?: string;
    refreshToken?: string;
    scopes?: string[];
    randomKey?: number;
    doingLogin: boolean;
};

export default class App extends Component<Props, State> {
    state = {
        hasLoggedInOnce: false,
        accessToken: '',
        accessTokenExpirationDate: '',
        refreshToken: '',
        scopes: [],
        doingLogin: false,
        randomKey: 0,
    };

    animateState(nextState: State | Pick<State, never> | null, delay: number = 0) {
        setTimeout(() => {
            this.setState(() => {
                LayoutAnimation.easeInEaseOut();
                return nextState;
            });
        }, delay);
    }

    authorize = async () => {
        try {
            console.log('authorize');
            this.animateState({doingLogin: true});
            const authState = await authorize(G.AppAuthConfig);

            this.setState(
                {
                    hasLoggedInOnce: true,
                    accessToken: authState.accessToken,
                    accessTokenExpirationDate: authState.accessTokenExpirationDate,
                    refreshToken: authState.refreshToken,
                    scopes: authState.scopes
                }
            );
            // this.props.navigation.navigate(ROUTES.UserProfile);
            G.UserProfile.accessToken = authState.accessToken;
            if (!!authState.accessToken) {
                // @ts-ignore
                fetch(GET, api_list.profile, {})
                    .then((response: any) => {
                        if (response.statusCode && response.statusCode === 200) {
                            G.UserProfile = response.result;
                            G.UserProfile.accessToken = authState.accessToken;
                            console.log(G.UserProfile);
                            this.animateState({
                                randomKey: Math.random(),
                                doingLogin: false,
                            });
                            return;
                        }
                        this.animateState({
                            doingLogin: false
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        this.animateState({
                            doingLogin: false
                        });
                    });
            }
        } catch (error) {
            this.animateState({doingLogin: false});
            Alert.alert('Failed to log in', error.message);
        }
    };

    refresh = async () => {
        try {
            this.animateState({doingLogin: true});
            const authState = await refresh(G.AppAuthConfig, {
                refreshToken: this.state.refreshToken
            });

            this.animateState({
                accessToken: authState.accessToken || this.state.accessToken,
                accessTokenExpirationDate:
                    authState.accessTokenExpirationDate || this.state.accessTokenExpirationDate,
                refreshToken: authState.refreshToken || this.state.refreshToken,
                randomKey: Math.random(),
                doingLogin: false,
            });
        } catch (error) {
            this.animateState({doingLogin: false});
            Alert.alert('Failed to refresh token', error.message);
        }
    };

    revoke = async () => {
        try {
            this.animateState({doingLogin: true});
            await revoke(G.AppAuthConfig, {
                tokenToRevoke: this.state.accessToken,
                sendClientId: true
            });
            G.UserProfile = {};
            this.animateState({
                accessToken: '',
                accessTokenExpirationDate: '',
                refreshToken: '',
                randomKey: Math.random(),
                doingLogin: false
            });
        } catch (error) {
            this.animateState({doingLogin: false});
            Alert.alert('Failed to revoke token', error.message);
        }
    };

    render() {
        const {state} = this;
        const userProfile = G.UserProfile;
        return (
            <View style={styles.mainDiv} key={state.randomKey}>
                <Spinner
                    visible={this.state.doingLogin}
                    // textContent={'Loading...'}
                    color={Colors.brandPrimary}
                    ovrerlayColor={'rgba(255, 0, 0, 0.5)'}
                    textStyle={styles.descText}
                />
                <AutoHeightImage width={wp(60)} source={Images.logo}/>
                {!userProfile.firstName &&
                <View style={styles.sliderSec}>
                    <Swiper
                        showsButtons={false}
                        autoplay={true}
                        autoplayTimeout={2}
                        activeDot={<View style={styles.activeDot}/>}
                        dot={<View style={styles.dot}/>}>
                        <View>
                            <Text style={styles.headerText}>
                                Find Drivers
                            </Text>
                            <Text style={styles.descText}>
                                Advertise if you have available cars and looking for drivers.
                            </Text>
                        </View>
                        <View>
                            <Text style={styles.headerText}>
                                Save Bookmarks
                            </Text>
                            <Text style={styles.descText}>
                                Save your favorite listings and you can comeback to them later.
                            </Text>
                        </View>
                        <View>
                            <Text style={styles.headerText}>
                                Find Cars
                            </Text>
                            <Text style={styles.descText}>
                                If you are a casual or permanent driver and looking for a car to lease near you.
                            </Text>
                        </View>
                    </Swiper></View>}
                {!!userProfile.firstName && <View>
                    <Text style={styles.headerText}>
                        Logged-In As
                    </Text>
                    <Text style={styles.descText}>{`${userProfile.firstName} ${userProfile.lastName}`}</Text>
                </View>}
                <View style={styles.buttonSec}>
                    {!userProfile.firstName &&
                    <Button
                        buttonStyle={[styles.buttonDefault, styles.signInButton]}
                        onPress={this.authorize}
                        title={"Sign In"}
                        titleStyle={[styles.buttonTextDefault, styles.signInButtonText]}/>}
                    {!!userProfile.firstName &&
                    <Button
                        buttonStyle={[styles.buttonDefault, styles.signInButton, ]}
                        onPress={() => this.props.navigation.navigate(ROUTES.UserProfile)}
                        title={"View Profile"}
                        titleStyle={[styles.buttonTextDefault, styles.signInButtonText]}/>}

                    {!userProfile.firstName && <View style={styles.separatorContainer}>
                        <View style={styles.separatorLine}/>
                        <Text style={styles.separatorOr}>Or</Text>
                        <View style={styles.separatorLine}/>
                    </View>}
                    {!!userProfile.firstName && <View style={styles.separatorContainer}>
                        <View style={styles.separatorLine}/>
                        <Text style={styles.separatorOr}>Or</Text>
                        <View style={styles.separatorLine}/>
                        <View/>
                    </View>}
                    {!userProfile.firstName &&
                    <Button
                        type="outline"
                        buttonStyle={[styles.buttonDefault, styles.createAccountButton, ]}
                        onPress={() => this.authorize()}
                        title={"Create Account"}
                        titleStyle={[styles.buttonTextDefault, styles.createAccountButtonText]}/>}
                    {!!userProfile.firstName &&
                    <Button
                        type="outline"
                        buttonStyle={[styles.buttonDefault, styles.createAccountButton]}
                        onPress={() => this.revoke()}
                        title={"Logout"}
                        titleStyle={[styles.buttonTextDefault, styles.createAccountButtonText]}/>}
                </View>
            </View>
        );
    }
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
    sliderSec: {
        marginTop: hp(5),
        width: wp(80),
        height: hp(20),
        color: '#fff',
    },
    headerText: {
        // fontFamily:Fonts.type.PlayfairDisplayBold,
        backgroundColor: 'transparent',
        textAlign: 'center',
        alignSelf: 'center',
        fontSize: Fonts.size.h3,
        width: Metrics.WIDTH * .90,
        color: 'white',
    },
    descText: {
        // fontFamily: Fonts.type.Bariol,
        backgroundColor: 'transparent',
        textAlign: 'center',
        alignSelf: 'center',
        fontSize: Fonts.size.h5,
        width: Metrics.WIDTH * .70,
        color: 'white',
        marginTop: 20
    },
    activeDot: {
        backgroundColor: 'white',
        width: 10,
        height: 10,
        borderRadius: 5,
        marginLeft: 3,
        marginRight: 3,
        marginTop: 3,
        marginBottom: 3,
    },
    dot: {
        backgroundColor: '#8796a6',
        width: 10,
        height: 10,
        borderRadius: 5,
        marginLeft: 3,
        marginRight: 3,
        marginTop: 3,
        marginBottom: 3,
    },
    buttonSec: {
        marginTop: hp(5),
        width: '80%',
        height: hp(35),
    },
    buttonDefault: {
        height: hp(5.8),
        borderRadius: hp(1.8),
    },
    buttonTextDefault: {
        fontFamily: Fonts.type.sfuiDisplayLight,
        fontSize: Fonts.size.button1,
        fontWeight: "400",
    },
    createAccountButton: {
        backgroundColor: 'transparent',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: Colors.snow,
    },
    createAccountButtonText: {
        color: 'white'
    },
    separatorContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        marginVertical: 20
    },
    separatorLine: {
        flex: 1,
        borderWidth: StyleSheet.hairlineWidth,
        height: StyleSheet.hairlineWidth,
        borderColor: '#9B9FA4'
    },
    separatorOr: {
        fontSize: Fonts.size.button1,
        color: '#9B9FA4',
        marginHorizontal: 8
    },
    signInButton: {
        backgroundColor: Colors.brandPrimary,
    },
    signInButtonText: {
        color: 'white',
        backgroundColor: Colors.transparent
    },
});
