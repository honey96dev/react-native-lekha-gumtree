import React from 'react';
import {Animated, LayoutAnimation, ScrollView, StyleSheet, UIManager, View} from 'react-native';
import {NavigationScreenProps} from "react-navigation";
// @ts-ignore
import {Header} from "react-native-elements";
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import MapView from 'react-native-maps';
// @ts-ignore
// import Spinner from 'react-native-loading-spinner-overlay';
import {Colors, Fonts, Metrics} from "../themes";
import G, {AddressType} from "../tools/G";
import BaseIcon from "../components/BaseIcon";
import {api_list, fetch, GET} from "../apis";
import MySpinner from "../components/MySpinner";
import {sprintf} from "sprintf-js";

UIManager.setLayoutAnimationEnabledExperimental &&
UIManager.setLayoutAnimationEnabledExperimental(true);

interface MyProps {

}

type Props = MyProps & NavigationScreenProps;

interface State {
    doingLoading: boolean,
    randomKey: number,
    title?: string,
    carTypeName?: string,
    carMake?: string,
    carModel?: string,
    price?: string,
    address?: AddressType,
    companyName?: string,
    date?: string,
    shiftDate?: string,
    description?: string,
    views?: string,
    bookmarked?: string,
    // isPublicKey: number;
}

export default class ListingDetailView extends React.Component<Props, State> {
    // private animatedValue: Animated.Value;
    state = {
        doingLoading: false,
        randomKey: 0,
        title: '',
        carTypeName: '',
        carMake: '',
        carModel: '',
        price: '',
        address: undefined,
        companyName: '',
        date: '',
        shiftDate: '',
        description: '',
        views: '',
        bookmarked: '',
        // isPublicKey: 0,
    };

    constructor(props: Props) {
        super(props);
        // this.animatedValue = new Animated.Value(0);
        // console.log(G.UserProfile);
    }

    componentDidMount() {
        // this.animate();
        this.loadData();
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

    loadData = () => {
        this.animateState({
            doingLoading: true
        });
        const url = sprintf(api_list.listingWithId, G.listingId);
        // @ts-ignore
        fetch(GET, url, {})
            .then((response: any) => {
                console.log(response);
                const result = response.result;
                this.animateState({
                    title: result.title,
                    carTypeName: result.carTypeName,
                    carMake: result.carMake,
                    carModel: result.carModel,
                    price: result.priceModelName,
                    address: {
                        suburb: result.suburb,
                        state: result.state,
                        postCode: result.postCode,
                        longitude: result.longitude,
                        latitude: result.latitude,
                    },
                    companyName: '',
                    shiftDate: result.shiftDate,
                    description: result.description,
                    views: result.views,
                    bookmarked: result.bookmarked,
                    randomKey: Math.random(),
                    doingLoading: false,
                });
            })
            .catch(err => {
                console.log(err);
                this.animateState({
                    doingLoading: false,
                });
            });
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
                return '';
            }
        }
        return '';
    };



    render() {
        const {title, carTypeName, carMake, carModel, price, companyName, date, shiftDate, description, views, bookmarked} = this.state;
        // @ts-ignore
        const address: AddressType = this.state.address;
        const defaultLatitude = -35.2813043;
        const defaultLongitude = 149.1204446;
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
                            onPress={() => this.props.navigation.pop()}
                            // style={{ height: hp(4), marginLeft: Metrics.baseMargin}}
                        />}
                    centerComponent={{
                        text: 'Listing Details',
                        style: {
                            color: '#fff',
                            fontSize: Fonts.size.h4,
                        }
                    }}
                    // rightComponent={
                    //     <BaseIcon
                    //         containerStyle={{
                    //             backgroundColor: Colors.transparent,
                    //             height: hp(4),
                    //             width: hp(4),
                    //             borderRadius: hp(2),
                    //             // marginTop: hp(1),
                    //             marginEnd: 0,
                    //         }}
                    //         icon={{
                    //             size: Metrics.icons.large,
                    //             type: "material",
                    //             name: "done",
                    //             color: Colors.white}}
                    //         onPress={() => this.saveProfile()}
                    //         // style={{ height: hp(4), marginLeft: Metrics.baseMargin}}
                    //     />}
                />
                <ScrollView style={styles.scroll}>
                    <MapView initialRegion={{
                        latitude: !!address ? (!!address.latitude ? address.latitude : defaultLatitude) : defaultLatitude,
                        longitude: !!address ? (!!address.longitude ? address.longitude : defaultLongitude ) : defaultLongitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}>
                    </MapView>
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
    mapSec: {
        width: '100%',
        height: '20%',
        paddingBottom: Metrics.basePadding,
        paddingLeft: Metrics.basePadding,
        paddingRight: Metrics.basePadding,
        paddingTop: Metrics.basePadding,
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

// let codePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_RESUME };
// export default codePush(codePushOptions)(UserProfileScreen);

