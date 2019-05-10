import React, {Component} from 'react';
import {Alert, LayoutAnimation, StyleSheet, Text, UIManager, View} from 'react-native';
import {NavigationScreenProps} from "react-navigation";
import {Button} from 'react-native-elements';
import Swiper from 'react-native-swiper';
import {authorize, AuthorizeResult, refresh, revoke} from 'react-native-app-auth';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import AutoHeightImage from 'react-native-auto-height-image';
// @ts-ignore
import Spinner from 'react-native-spinkit';
// import Spinner from 'react-native-loading-spinner-overlay';
import {ROUTES} from "../routes";
import {Colors, Fonts, Metrics} from "../themes";
import Images from "../themes/Images";
import G from '../tools/G';
import {api_list, fetch, GET} from "../apis";
import MySpinner from "../components/MySpinner";

UIManager.setLayoutAnimationEnabledExperimental &&
UIManager.setLayoutAnimationEnabledExperimental(true);

interface MyProps {
}

type Props = MyProps & NavigationScreenProps;

interface State {
    hasLoggedInOnce: boolean,
    accessToken?: string,
    accessTokenExpirationDate?: string,
    refreshToken?: string,
    scopes?: string[],
    randomKey?: number,
    doingLoading: boolean,
};

export default class App extends Component<Props, State> {
    state = {
        hasLoggedInOnce: false,
        accessToken: '',
        accessTokenExpirationDate: '',
        refreshToken: '',
        scopes: [],
        doingLoading: false,
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
            this.animateState({doingLoading: true});
            // const authState = await authorize(G.AppAuthConfig);
            let authState:AuthorizeResult = {
                accessToken: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE1NTc0ODM1OTEsImV4cCI6MTU1NzQ4NzE5MSwiaXNzIjoiaHR0cHM6Ly9pZGVudGl0eS5sZWtoYS5jb20uYXUvIiwiYXVkIjpbImh0dHBzOi8vaWRlbnRpdHkubGVraGEuY29tLmF1L3Jlc291cmNlcyIsInRlc3QtbW9iaWxlLWFwaSJdLCJjbGllbnRfaWQiOiJ0ZXN0LWFwcCIsInN1YiI6IjU4ODY1YjIxLTgyNWItNGIyYy04OWU0LTMxMzUxOTk4ZWNiOCIsImF1dGhfdGltZSI6MTU1NzQ4MzU5MCwiaWRwIjoibG9jYWwiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJyYW5qZWV0ZG90bWVAZ21haWwuY29tIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvZ2l2ZW5uYW1lIjoiUmFuamVldCIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL3N1cm5hbWUiOiJTaW5naCIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWVpZGVudGlmaWVyIjoiNTg4NjViMjEtODI1Yi00YjJjLTg5ZTQtMzEzNTE5OThlY2I4Iiwic2NvcGUiOlsidGVzdC1tb2JpbGUtYXBpIl0sImFtciI6WyJwd2QiXX0.LURJ-1tlf4SBlGR2OhnExwhyTRA42x5VH5RsivPKFXBVebFfMNA1irPfs2exW_HOFjMwlbmbccinVEvb7aa-cxMu0gUpvf06a9HiHE7GrFg9LtBjY84BT9Pu-MVCrM1yIywdvyRv5DEwP5lR0BtFZBBtJfxkojtbJWmkhULEf6NZsB-op0EsBB3i23sEmwQysppDyaeuzgUBJP8xO-93Fg5RvRY3owVyOSqI0HLywyjX0I4hj1RPSwqeiPq1bfaMVFg7u5Ampwc17F8upIpgagiB0V6z4xGv2s5RWfOzY_Hkv0yJWAQCUjgbdhHLUTGPdQ9C_dxekWWQbhO2QuyoeQ',
                accessTokenExpirationDate: '',
                idToken: '',
                refreshToken: '',
                tokenType: '',
                scopes: [''],
            };

            this.setState(
                {
                    hasLoggedInOnce: true,
                    accessToken: authState.accessToken,
                    accessTokenExpirationDate: authState.accessTokenExpirationDate,
                    refreshToken: authState.refreshToken,
                    scopes: authState.scopes,
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
                            // console.log(G.UserProfile);
                            this.animateState({
                                randomKey: Math.random(),
                                doingLoading: false,
                            });
                            return;
                        }
                        this.animateState({
                            doingLoading: false
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        this.animateState({
                            doingLoading: false
                        });
                    });
            }
        } catch (error) {
            this.animateState({doingLoading: false});
            Alert.alert('Failed to log in', error.message);
        }
    };

    refresh = async () => {
        try {
            this.animateState({doingLoading: true});
            const authState = await refresh(G.AppAuthConfig, {
                refreshToken: this.state.refreshToken
            });

            this.animateState({
                accessToken: authState.accessToken || this.state.accessToken,
                accessTokenExpirationDate:
                    authState.accessTokenExpirationDate || this.state.accessTokenExpirationDate,
                refreshToken: authState.refreshToken || this.state.refreshToken,
                randomKey: Math.random(),
                doingLoading: false,
            });
        } catch (error) {
            this.animateState({doingLoading: false});
            Alert.alert('Failed to refresh token', error.message);
        }
    };

    revoke = async () => {
        try {
            this.animateState({doingLoading: true});
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
                doingLoading: false
            });
        } catch (error) {
            this.animateState({doingLoading: false});
            Alert.alert('Failed to revoke token', error.message);
        }
    };

    render() {
        const {state} = this;
        const userProfile = G.UserProfile;
        console.log(state);
        return (
            <View style={styles.mainDiv} key={state.randomKey}>
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
                        onPress={() => this.props.navigation.navigate(ROUTES.UserMain)}
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
                <MySpinner visible={state.doingLoading} color={Colors.brandPrimary}/>
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
