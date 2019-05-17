import React from 'react';
import {Animated, LayoutAnimation, ScrollView, StyleSheet, Text, UIManager, View} from 'react-native';
import {NavigationScreenProps} from "react-navigation";
// @ts-ignore
import {Header, Icon} from "react-native-elements";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import MapView from 'react-native-maps';
// @ts-ignore
// import Spinner from 'react-native-loading-spinner-overlay';
import {Colors, Fonts, Metrics} from "../themes";
import G, {AddressType} from "../tools/G";
import BaseIcon from "../components/BaseIcon";
import {api_list, DELETE, fetch, GET, POST} from "../apis";
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
    shiftDate?: string,
    shiftTypeName?: string,
    description?: string,
    views?: string,
    likesCount?: string,
    bookmarked?: boolean,
    initDone?: boolean,
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
        shiftDate: '',
        shiftTypeName: '',
        description: '',
        views: '',
        likesCount: '',
        bookmarked: false,
        initDone: false,
        // isPublicKey: 0,
    };

    constructor(props: Props) {
        super(props);
        // this.animatedValue = new Animated.Value(0);
        // console.log(G.UserProfile);
        // G.UserProfile.accessToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE1NTgxMDcwNTAsImV4cCI6MTU1ODExMDY1MCwiaXNzIjoiaHR0cHM6Ly9pZGVudGl0eS5sZWtoYS5jb20uYXUvIiwiYXVkIjpbImh0dHBzOi8vaWRlbnRpdHkubGVraGEuY29tLmF1L3Jlc291cmNlcyIsInRlc3QtbW9iaWxlLWFwaSJdLCJjbGllbnRfaWQiOiJ0ZXN0LWFwcCIsInN1YiI6IjU4ODY1YjIxLTgyNWItNGIyYy04OWU0LTMxMzUxOTk4ZWNiOCIsImF1dGhfdGltZSI6MTU1ODEwNzA1MCwiaWRwIjoibG9jYWwiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJyYW5qZWV0ZG90bWVAZ21haWwuY29tIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvZ2l2ZW5uYW1lIjoiUmFuamVldCIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL3N1cm5hbWUiOiJTaW5naCIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWVpZGVudGlmaWVyIjoiNTg4NjViMjEtODI1Yi00YjJjLTg5ZTQtMzEzNTE5OThlY2I4Iiwic2NvcGUiOlsidGVzdC1tb2JpbGUtYXBpIl0sImFtciI6WyJwd2QiXX0.PnYVi7kFMYuPRuTlXFcVfZbPBj4RKRyh5DhtrHyemBGz8_Iw9BVBdy-LhLj2dkpa_vsBn9GVzMlMGaQAe9IG0VEievMjDCL0nGLj6UAKNZ4kqWpiU2SZq9v02WV86nGYocdtbX7gtsZioNxILDyE6Wytz890tAeqk-QPYBRsQCZT_-TF-M0WewGJtNDS7Wwi7QvFr0624g2144ZstBVqHrifIVZ1oQ9y0bWXw12mBhaUCVElSFb8yOQ2OR0_9-_XaiFXqFoCgGZDVBcZWakbJ3Nas3KRYvtZtITCYjbWaME1WfHJlzjfHdU4jz9g-J8Yi1fMJetwQZq9LGZX6idesw';
        // G.listingId = '37f44f52-19d4-433a-8026-c435f3c81b60';
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
                const address: AddressType = {
                    suburb: result.suburb,
                    state: result.state,
                    postCode: result.postCode,
                    longitude: result.longitude,
                    latitude: result.latitude,
                };
                this.animateState({
                    title: result.title,
                    carTypeName: result.carTypeName,
                    carMake: result.carMake,
                    carModel: result.carModel,
                    price: result.priceModelName,
                    address: address,
                    companyName: '',
                    shiftDate: result.shiftDate,
                    shiftTypeName: result.shiftTypeName,
                    description: result.description,
                    views: result.views,
                    likesCount: result.likesCount,
                    bookmarked: result.bookmarked,
                    randomKey: Math.random(),
                    doingLoading: false,
                    initDone: true,
                });
            })
            .catch(err => {
                console.log(err);
                this.animateState({
                    doingLoading: false,
                    initDone: true,
                });
            });
    };

    getAddressText = () => {
        // console.log('User info in get address text is');
        // console.info(G.UserProfile);
        // @ts-ignore
        const user: AddressType = this.state.address;
        if (!!user) {
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

    onPressBookmark = () => {
        const bookmarked = this.state.bookmarked;
        let url = sprintf(api_list.listingBookmark, G.listingId);
        let method;
        if (bookmarked) {
            method = DELETE;
        } else {
            method = POST;
        }
        this.animateState({
            doingLoading: true,
        });
        // @ts-ignore
        fetch(method, url, {})
            .then((response: any) => {
                console.log(response);
                this.animateState({
                    bookmarked: !this.state.bookmarked,
                    doingLoading: false,
                });
            })
            .catch((err: any) => {
                console.log(err);
                this.animateState({
                    doingLoading: false,
                });
            });
    };

    render() {
        const {doingLoading, initDone, title, carTypeName, carMake, carModel, price, companyName, shiftDate, shiftTypeName, description, views, likesCount, bookmarked} = this.state;
        // @ts-ignore
        const address: AddressType = this.state.address;
        const addressTest = this.getAddressText();
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
                {!!initDone && <ScrollView style={styles.scroll}>
                    <MapView
                        style={styles.mapSec}
                        initialRegion={{
                            latitude: !!address ? (!!address.latitude ? address.latitude : defaultLatitude) : defaultLatitude,
                            longitude: !!address ? (!!address.longitude ? address.longitude : defaultLongitude) : defaultLongitude,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                            // latitude: 42.882004,
                            // longitude: 74.582748,
                            // latitudeDelta: 0.0922,
                            // longitudeDelta: 0.0421,
                        }}>
                    </MapView>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View style={{width: wp(80)}}>
                            <Text style={{color: Colors.blacktxt, fontSize: Fonts.size.h4}}>{title}</Text>
                            <Text style={{color: Colors.blacktxt, fontSize: Fonts.size.h6}}>
                                {carTypeName} | {carModel} | {carMake}
                            </Text>
                            <Text style={{
                                color: Colors.blacktxt, fontSize: Fonts.size.h4, fontWeight: "bold"
                            }}>{price}</Text>
                            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center',}}>
                                {/*<View style={{flexDirection: 'row', alignItems: 'center',}}>*/}
                                <Icon size={Metrics.icons.medium} type={"material"} name={"place"}/>
                                <Text
                                    style={{color: Colors.blacktxt, flex: 1, fontSize: Fonts.size.h6}}>{addressTest}</Text>
                                {/*</View>*/}
                            </View>
                        </View>
                        <View style={{width: wp(20), flexDirection: 'column', alignItems: 'center'}}>
                            <BaseIcon
                                containerStyle={{
                                    width: wp(8),
                                    height: wp(8),
                                    borderRadius: wp(4),
                                    backgroundColor: !!bookmarked ? Colors.brandPrimary : Colors.gray,
                                }}
                                icon={{
                                    size: Metrics.icons.large,
                                    type: 'material',
                                    name: 'star'
                                }}
                            onPress={this.onPressBookmark}/>
                        </View>
                    </View>
                    <Text style={{color: Colors.blacktxt, fontSize: Fonts.size.h5}}>Company: {companyName}</Text>
                    <View style={{flexDirection: "row", alignItems: 'center',}}>
                        <Text style={{color: Colors.blacktxt, flex: 1, textAlign: "left", fontSize: Fonts.size.h5}}>Date: {shiftDate.substr(0, 10)}</Text>
                        <Text style={{color: Colors.blacktxt, flex: 1, textAlign: "right", fontSize: Fonts.size.h5}}>Shift: {shiftTypeName}</Text>
                    </View>
                    <Text style={{marginTop: Metrics.baseMargin, color: Colors.darktext, flex: 1, fontSize: Fonts.size.h6}}>{description}</Text>
                    <View style={{flexDirection: "row", alignItems: 'center',}}>
                        <Text style={{color: Colors.blacktxt, flex: 1, textAlign: "left", fontSize: Fonts.size.h5}}>Views: {views}</Text>
                        <Text style={{color: Colors.blacktxt, flex: 1, textAlign: "right", fontSize: Fonts.size.h5}}>Bookmarked: {likesCount}</Text>
                    </View>
                </ScrollView>}
                <MySpinner visible={doingLoading} color={Colors.brandPrimary}/>
            </View>
        );
    };
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: Colors.backgroundGray,
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    mainDiv: {
        width: '100%',
        height: '100%',
        backgroundColor: Colors.backgroundGray,
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    header: {
        height: Fonts.size.h1,
        paddingTop: 0,
    },
    scroll: {
        width: '100%',
        padding: Metrics.baseMargin,
        // height: hp(100) - Fonts.size.h1,
        backgroundColor: "white"
    },
    mapSec: {
        // width: '100%',
        height: hp(30),
        // marginTop: Metrics.basePadding,
        // marginLeft: Metrics.basePadding,
        // marginRight: Metrics.basePadding,
        // marginTop: Metrics.basePadding,
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
});

// let codePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_RESUME };
// export default codePush(codePushOptions)(UserProfileScreen);

