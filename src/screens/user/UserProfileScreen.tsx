import React from 'react';
import {Alert, LayoutAnimation, ScrollView, StyleSheet, Text, UIManager, View} from 'react-native';
import {NavigationScreenProps} from "react-navigation";
// @ts-ignore
import {Avatar, Button, Header, ListItem} from "react-native-elements";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {revoke} from 'react-native-app-auth';
// @ts-ignore
// import Spinner from 'react-native-loading-spinner-overlay';
import {Colors, Fonts, Metrics} from "../../themes";
import G, {AddressType, DayAvailability} from "../../tools/G";
import {ROUTES} from "../../routes";
import InfoText from "../../components/InfoText";
import BaseIcon from "../../components/BaseIcon";
import SearchLocationModal from "./SearchLocationModal";
import AvailabilityModal from "./AvailabilityModal";
import {api_list, fetch, POST, PUT} from "../../apis";
import MySpinner from "../../components/MySpinner";

UIManager.setLayoutAnimationEnabledExperimental &&
UIManager.setLayoutAnimationEnabledExperimental(true);

interface MyProps {

}

type Props = MyProps & NavigationScreenProps;

interface State {
    doingLoading: boolean;
    randomKey: number;
    // isPublicKey: number;
}

class UserProfileScreen extends React.Component<Props, State> {
    // private animatedValue: Animated.Value;
    state = {
        doingLoading: false,
        randomKey: 0,
        // isPublicKey: 0,
    };

    constructor(props: Props) {
        super(props);
        // this.animatedValue = new Animated.Value(0);
        // console.log(G.UserProfile);
    }

    componentDidMount() {
        // this.animate();
    };

    componentWillUnmount() {

    };

    animateState(nextState: State | Pick<State, never> | null, delay: number = 0) {
        setTimeout(() => {
            this.setState(() => {
                LayoutAnimation.easeInEaseOut();
                return nextState;
            });
        }, delay);
    }

    signOut = async () => {
        try {
            console.log('sign out', G.UserProfile.accessToken);
            // return;
            this.animateState({doingLoading: true});
            if (!!G.UserProfile.accessToken) {
                await revoke(G.AppAuthConfig, {
                    tokenToRevoke: G.UserProfile.accessToken,
                    sendClientId: true
                });
            }
            G.UserProfile = {};
            this.animateState({doingLoading: false});
            this.props.navigation.navigate(ROUTES.Login);
        } catch (error) {
            this.animateState({doingLoading: false});
            Alert.alert('Failed to revoke token', error.message);
        }
    };

    switchProfileIsPublic = () => {
        G.UserProfile.isPublic = !G.UserProfile.isPublic;
        // console.log(G.UserProfile.isPublic);
        // this.animateState({isPublicKey: Math.random()});
        this.setState({randomKey: Math.random()});
    };

    onLocationSelected = (address: AddressType) => {
        const {postCode, suburb, state, longitude, latitude} = address;
        G.UserProfile.postCode = postCode;
        G.UserProfile.suburb = suburb;
        G.UserProfile.state = state;
        G.UserProfile.longitude = longitude;
        G.UserProfile.latitude = latitude;
        this.setState({randomKey: Math.random()});
    };

    getAddressText = () => {
        // console.log('User info in get address text is');
        // console.info(G.UserProfile);
        const user = G.UserProfile;
        if (user) {
            let items = [];
            if (!!user.suburb) {
                items.push(user.suburb);
            }
            if (!!user.state) {
                items.push(user.state);
            }
            if (!!user.postCode) {
                items.push(user.postCode);
            }
            if (items.length) {
                return items.join(', ');
            } else {
                return SearchLocationModal.SELECT_LOCATION_HELPER_STRING;
            }
        }
        return SearchLocationModal.SELECT_LOCATION_HELPER_STRING;
    };

    onAvailabilitySelected = (selected: DayAvailability[]) => {
        G.UserProfile.available = selected;
        this.setState({randomKey: Math.random()});
        // console.log('onAvailabilitySelected', G.UserProfile.available);
    };

    saveProfile = () => {
        const profile = G.UserProfile;
        const params = JSON.stringify(profile);
        // const params = {
        //     userId: profile.userId,
        //     firstName: profile.firstName,
        //     lastName: string,
        //     email: string,
        //     phone: string,
        //     longitude: number,
        //     latitude: number,
        //     suburb: string,
        //     state: string,
        //     postCode: string,
        //     isPublic: boolean,
        //         day: number,
        //     night: number,
        //     available: DayAvailability[],
        //     dateRegistered: string,
        //     bookmarks: profile.bookmarks.join(''),
        // };
        this.animateState({
            doingLoading: true
        });
        // @ts-ignore
        fetch(PUT, api_list.profile, profile)
            .then((response: any) => {
                console.log(response);
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                // console.log('profile.available', JSON.stringify(profile.available));
                // @ts-ignore
                fetch(POST, api_list.profileAvailable, profile.available)
                    .then((response: any) => {
                        console.log(response);
                    })
                    .catch(err => {
                        console.log(err);
                    })
                    .finally(() => {
                        this.animateState({
                            doingLoading: false
                        });
                        this.props.navigation.navigate(ROUTES.UserMain);
                    });
            });
    };

    // animate = () => {
    //     this.animatedValue.setValue(0)
    //     Animated.timing(
    //         this.animatedValue,
    //         {
    //             toValue: 1,
    //             duration: 2000,
    //             easing: Easing.linear
    //         }
    //     ).start(() => this.animate());
    // }

    render() {
        const {
            firstName,
            lastName,
            email,
            phone,
            isPublic,
            available,
        } = G.UserProfile;
        let avatar: string = "";
        if (firstName) {
            avatar += firstName.charAt(0).toUpperCase();
        }
        if (lastName) {
            avatar += lastName.charAt(0).toUpperCase();
        }
        return (
            <View style={styles.container} key={this.state.randomKey}>
                <Header
                    containerStyle={styles.header}
                    backgroundColor={Colors.brandPrimary}
                    leftComponent={
                        <BaseIcon
                            containerStyle={{
                                backgroundColor: Colors.transparent,
                                height: hp(4),
                                width: hp(4),
                                borderRadius: hp(2),
                                // marginTop: hp(1),
                                marginEnd: 0,
                            }}
                            icon={{
                                size: Metrics.icons.large,
                                type: "material",
                                name: "arrow-back",
                                color: Colors.white}}
                            onPress={() => this.props.navigation.navigate(ROUTES.UserMain)}
                            // style={{ height: hp(4), marginLeft: Metrics.baseMargin}}
                        />}
                    centerComponent={{
                        text: 'Profile',
                        style: {
                            color: '#fff',
                            fontSize: Fonts.size.h4,
                        }
                    }}
                    rightComponent={
                        <BaseIcon
                            containerStyle={{
                                backgroundColor: Colors.transparent,
                                height: hp(4),
                                width: hp(4),
                                borderRadius: hp(2),
                                // marginTop: hp(1),
                                marginEnd: 0,
                            }}
                            icon={{
                                size: Metrics.icons.large,
                                type: "material",
                                name: "done",
                                color: Colors.white}}
                            onPress={() => this.saveProfile()}
                            // style={{ height: hp(4), marginLeft: Metrics.baseMargin}}
                        />}
                />
                <View style={styles.userRow}>
                    <View style={styles.userImage}>
                        <Avatar size="large" rounded title={avatar}/>
                    </View>
                    <View>
                        {(!!firstName || !!lastName) && <Text style={{fontSize: Fonts.size.regular}}>
                            {firstName} {lastName}
                        </Text>}
                        {!!phone && <Text style={{color: "gray", fontSize: Fonts.size.regular}}>{phone}</Text>}
                        {!!email && <Text style={{color: "gray", fontSize: Fonts.size.regular}}>{email}</Text>}
                    </View>
                </View>
                <View style={styles.signOutSec}>
                    <Button
                        type="clear"
                        buttonStyle={[styles.buttonDefault, styles.signOutButton]}
                        onPress={() => this.signOut()}
                        titleStyle={[styles.buttonTextDefault, styles.signOutButtonText]}
                        title={"SIGN OUT"}/>
                </View>
                <ScrollView style={styles.scroll}>
                    <InfoText text="Account"/>
                    <ListItem
                        // key={this.state.isPublicKey}
                        switch={{
                            value: isPublic || false,
                            onValueChange: this.switchProfileIsPublic
                        }}
                        title="Public"
                        containerStyle={styles.listItemContainer}
                        onPress={this.switchProfileIsPublic}
                        leftIcon={
                            <BaseIcon
                                containerStyle={{backgroundColor: Colors.lightPink}}
                                icon={{type: "material", name: "notifications"}}
                            />
                        }/>
                    <ListItem
                        title="Location"
                        containerStyle={styles.listItemContainer}
                        leftIcon={
                            <BaseIcon
                                containerStyle={{backgroundColor: Colors.skyblue}}
                                icon={{type: "material", name: "place"}}
                            />
                        }
                        rightIcon={
                            <View
                                style={{
                                    // flex: 1,
                                    height: 15,
                                    justifyContent: "center",
                                    // alignItems: "flex-end"
                                }}
                            >
                                <SearchLocationModal
                                    text={this.getAddressText()}
                                    trigger="onPress"
                                    onCancel={() => console.log("On Cancel")}
                                    onSelected={this.onLocationSelected}
                                >
                                    <Text style={{color: "#43484d"}}>
                                        {this.getAddressText()}
                                    </Text>
                                </SearchLocationModal>
                            </View>
                        }
                    />

                    <ListItem
                        title="Availability"
                        containerStyle={styles.listItemContainer}
                        leftIcon={
                            <BaseIcon
                                containerStyle={{backgroundColor: Colors.skyblue}}
                                icon={{type: "feather", name: "calendar"}}
                            />
                        }
                        rightIcon={
                            <View
                                style={{
                                    flex: 1,
                                    height: 15,
                                    justifyContent: "center",
                                    alignItems: "flex-end"
                                }}
                            >
                                <AvailabilityModal
                                    items={available}
                                    title="Availability"
                                    onChange={this.onAvailabilitySelected}
                                >
                                    <Text style={{color: "#43484d"}}> Edit</Text>
                                </AvailabilityModal>
                            </View>
                        }/>

                    <InfoText text="More"/>
                    <ListItem
                        title="About US"
                        containerStyle={styles.listItemContainer}
                        leftIcon={
                            <BaseIcon
                                containerStyle={{backgroundColor: Colors.grayBlue}}
                                icon={{type: "ionicon", name: "md-information-circle"}}
                            />
                        }/>
                    <ListItem
                        title="Terms and Policies"
                        containerStyle={styles.listItemContainer}
                        leftIcon={
                            <BaseIcon
                                containerStyle={{backgroundColor: Colors.lightGray}}
                                icon={{type: "entypo", name: "light-bulb"}}
                            />
                        }/>
                    <ListItem
                        title="Share our App"
                        containerStyle={styles.listItemContainer}
                        leftIcon={
                            <BaseIcon
                                containerStyle={{backgroundColor: Colors.lightEggplant}}
                                icon={{type: "material", name: "share"}}
                            />
                        }/>
                    <ListItem
                        title="Rate Us"
                        containerStyle={styles.listItemContainer}
                        leftIcon={
                            <BaseIcon
                                containerStyle={{backgroundColor: Colors.yellow}}
                                icon={{type: "material", name: "star"}}
                            />
                        }/>
                    <ListItem
                        title="Send FeedBack"
                        containerStyle={styles.listItemContainer}
                        leftIcon={
                            <BaseIcon
                                containerStyle={{backgroundColor: Colors.green}}
                                icon={{type: "material", name: "feedback"}}
                            />
                        }/>
                </ScrollView>
                <MySpinner visible={this.state.doingLoading} color={Colors.brandPrimary}/>
            </View>
        );
    };
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        // backgroundColor: '#311f36',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start'
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
    header: {
        height: Fonts.size.h1,
        paddingTop: 0,
    },
    userRow: {
        width: '100%',
        flexDirection: "row",
        alignItems: "center",
        // justifyContent: 'center',
        paddingBottom: Metrics.basePadding,
        paddingLeft: Metrics.basePadding * 2,
        paddingRight: Metrics.basePadding * 2,
        paddingTop: Metrics.basePadding,
    },
    userImage: {
        marginRight: Metrics.baseMargin,
    },
    signOutSec: {
        width: '100%',
        marginTop: Metrics.baseMargin,
        marginBottom: Metrics.baseMargin,
        // height: Metrics.section,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'center',
    },
    buttonDefault: {
        // height: hp(5.8),
        // borderRadius: hp(1.8),
    },
    signOutButton: {
        backgroundColor: 'transparent',
        // borderWidth: StyleSheet.hairlineWidth,
        // borderColor: Colors.snow,
        height: hp(4),
        borderRadius: hp(1.5),
    },
    buttonTextDefault: {
        // fontFamily: Fonts.type.sfuiDisplayLight,
        fontSize: Fonts.size.button1,
        fontWeight: "400",
    },
    signOutButtonText: {
        color: Colors.brandPrimary,
        backgroundColor: Colors.transparent
    },
    scroll: {
        width: '100%',
        // height: hp(100) - Fonts.size.h1,
        backgroundColor: "white"
    },
    listContainer: {
        marginBottom: 0,
        marginTop: 0,
        borderTopWidth: 0
    },
    listItemContainer: {
        height: hp(6),
        borderBottomColor: Colors.lightgrey,
        borderBottomWidth: 1,
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

export default UserProfileScreen;

