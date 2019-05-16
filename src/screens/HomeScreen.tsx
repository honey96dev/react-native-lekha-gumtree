import React from 'react';
import {
    Alert,
    Animated,
    LayoutAnimation,
    ScrollView,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    UIManager,
    View
} from 'react-native';
import {NavigationScreenProps} from "react-navigation";
// @ts-ignore
import {Avatar, Button, Header, Icon, Input, ListItem} from "react-native-elements";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
// @ts-ignore
// import Spinner from 'react-native-loading-spinner-overlay';
// @ts-ignore
import PTRView from 'react-native-pull-to-refresh';
import {Colors, Fonts, Metrics} from "../themes";
import {ROUTES} from "../routes";
import G, {AddressType, PostListItem} from "../tools/G";
import {api_list, fetch, GET, PUT} from "../apis";
import MySpinner from "../components/MySpinner";
import AutoHeightImage from "react-native-auto-height-image";
import Images from "../themes/Images";
import SearchLocationModal from "./user/SearchLocationModal";
import codePush from 'react-native-code-push';

UIManager.setLayoutAnimationEnabledExperimental &&
UIManager.setLayoutAnimationEnabledExperimental(true);

interface MyProps {

}

type Props = MyProps & NavigationScreenProps;

interface State {
    doingLoading: boolean,
    randomKey: number,
    address: AddressType,
    page: number,
    pageSize: number,
    gallery: PostListItem[],
    // isPublicKey: number;
}

class HomeScreen extends React.Component<Props, State> {
    // private animatedValue: Animated.Value;
    state = {
        doingLoading: false,
        randomKey: 0,
        address: {},
        page: 1,
        pageSize: G.ListPageSize,
        gallery: [],
        // isPublicKey: 0,
    };

    constructor(props: Props) {
        super(props);
        // this.animatedValue = new Animated.Value(0);
        // console.log(G.UserProfile);
    }

    componentDidMount() {
        // this.animate();
        // this.getList();

        const {postCode, suburb, state, longitude, latitude} = G.UserProfile;
        this.setState({
            address: {
                postCode: postCode,
                suburb: suburb,
                state: state,
                longitude: longitude,
                latitude: latitude,
            },
            randomKey: Math.random(),
        });
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

    getTextFromAddress = () => {
        const profile: AddressType = this.state.address;
        let items = [];
        if (!!profile.suburb) {
            items.push(profile.suburb);
        }
        if (!!profile.state) {
            items.push(profile.state);
        }
        if (!!profile.postCode) {
            items.push(profile.postCode);
        }
        return items.join(', ');
    };

    onLocationSelected = (address: AddressType) => {
        const {postCode, suburb, state, longitude, latitude} = address;
        this.setState({
            address: {
                postCode: postCode,
                suburb: suburb,
                state: state,
                longitude: longitude,
                latitude: latitude,
                randomKey: Math.random(),
            }
        });
    };

    pull2Refresh = () => {
        let {page, pageSize} = this.state;
        if (page > 1) {
            page--;
        }
        this.setState({page: page, pageSize: pageSize});
        this.getList();
    };

    getList = () => {
        const {page, pageSize} = this.state;
        this.animateState({
            doingLoading: true
        });
        console.log('page-pageSize', page, pageSize);
        // @ts-ignore
        fetch(GET, api_list.listing, {page: page, pageSize: pageSize})
            .then((response: any) => {
                this.animateState({
                    gallery: response.result.results,
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

    loadMore = async () => {
        let {page, pageSize} = this.state;
        // if (pageSize >= G.ListItemCountLimit) {
        //     // pageSize = (pageSize % G.ListItemCountLimit) + G.ListPageSize;
        //     if (page += 1;
        // }
        page++;
        await this.setState({
            page: page,
            pageSize: pageSize,
        });
        this.getList();
    };

    render() {
        const {
            firstName,
            lastName,
        } = G.UserProfile;
        const {state} = this;
        const posts = this.state.gallery;
        let avatar: string = "";
        if (firstName) {
            avatar += firstName.charAt(0).toUpperCase();
        }
        if (lastName) {
            avatar += lastName.charAt(0).toUpperCase();
        }
        let address = this.getTextFromAddress();
        console.log('gallery', posts);
        return (
            <View style={styles.container} key={this.state.randomKey}>
                <AutoHeightImage style={{marginTop: hp(3)}} width={Metrics.logoWidth} source={Images.logo}/>
                <View style={{height: Fonts.size.h1,}}>
                    <SearchLocationModal
                        text={this.getTextFromAddress()}
                        trigger={'onPress'}
                        onSelected={this.onLocationSelected}
                        onCancel={() => {
                        }}>
                        <TouchableWithoutFeedback>
                            <View style={{
                                // width: wp(65),
                                margin: Metrics.baseMargin,
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                                <Icon size={Metrics.icons.large} type={"material"} name={"near-me"}
                                      color={Colors.white}/>
                                <Text
                                    style={{
                                        marginStart: wp(2),
                                        fontSize: Fonts.size.h6,
                                        color: Colors.white
                                    }}>{address}</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </SearchLocationModal>
                </View>
                {/*<Input*/}
                    {/*containerStyle={styles.searchBox}*/}
                    {/*inputContainerStyle={{borderBottomWidth: 0,}}*/}
                    {/*placeholder='Search...'*/}
                    {/*editable={false}*/}
                    {/*leftIcon={*/}
                        {/*<Icon*/}
                            {/*size={Metrics.icons.large}*/}
                            {/*type={'material'}*/}
                            {/*name={'search'}*/}
                        {/*/>*/}
                    {/*}*/}
                    {/*// onTouchEnd={() => this.props.navigation.navigate(ROUTES.SearchMain)}*/}
                    {/*onPress={() => this.props.navigation.navigate(ROUTES.SearchMain)}*/}
                {/*/>*/}
                <Button
                    buttonStyle={styles.searchBox}
                    titleStyle={{color: Colors.darktext}}
                    // inputContainerStyle={{borderBottomWidth: 0,}}
                    title='Search...'
                    // editable={false}
                    icon={
                        <Icon
                            size={Metrics.icons.large}
                            type={'material'}
                            name={'search'}
                            color={Colors.brandPrimary}
                        />
                    }
                    // onTouchEnd={() => this.props.navigation.navigate(ROUTES.SearchMain)}
                    onPress={() => this.props.navigation.navigate(ROUTES.SearchMain)}
                />
                <Button
                    type={"outline"}
                    icon={{
                        size: Metrics.icons.medium,
                        type: 'material',
                        name: 'add',
                        color: Colors.brandPrimary,
                    }}
                    title={"Post New Ad"}
                    buttonStyle={[styles.buttonDefault, styles.postNewAdButton]}
                    titleStyle={[styles.buttonTextDefault, styles.postNewAdButtonText]}/>
                <Button
                    type={"clear"}
                    title={"How it works?"}
                    buttonStyle={[styles.buttonDefault, styles.howItWorkButton]}
                    titleStyle={[styles.buttonTextDefault, styles.howItWorkButtonText]}/>
                <PTRView onRefresh={this.pull2Refresh} style={styles.scroll}>
                    <Text style={{
                        padding: Metrics.basePadding,
                        color: Colors.darktext,
                        fontSize: Fonts.size.h5
                    }}>Gallery</Text>
                    {/*<ScrollView style={styles.listContainer}>*/}
                    {/*{state.gallery.map((item: PostListItem) => {*/}

                    {/*})}*/}
                    {/*</ScrollView>*/}
                </PTRView>
                <View style={styles.bottomSec}>
                    <View style={{flexDirection: "row", alignItems: "center",}}>
                        <View style={styles.usersIcon}>
                            <Icon size={Metrics.icons.xl} type={"simple-line-icon"} name={"people"}/>
                        </View>
                        <View>
                            <Text style={{color: Colors.blacktxt, fontSize: Fonts.size.h5}}>We're here for you</Text>
                            <Text style={{width: wp(75), color: Colors.darktext, fontSize: Fonts.size.h6}}>Need help?
                                Our friendly team is here to assist you 24 * 7</Text>
                        </View>
                    </View>
                    <View style={styles.separatorLine}/>
                    {/*<View style={{flex: 1, flexDirection: 'column', alignItems: 'center',}}>*/}
                    <Button
                        type={"clear"}
                        title={"Connect With Us"}
                        buttonStyle={[styles.buttonDefault, styles.connectWithUsButton]}
                        titleStyle={[styles.buttonTextDefault, styles.connectWithUsButtonText]}/>
                    {/*</View>*/}
                </View>
                <MySpinner visible={this.state.doingLoading} color={Colors.brandPrimary}/>
            </View>
        );
    };
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: Colors.backgroundEggplant,
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    mainDiv: {
        width: '100%',
        height: '100%',
        backgroundColor: Colors.backgroundEggplant,
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    searchBox: {
        marginBottom: Metrics.baseMargin,
        width: wp(80),
        height: hp(5),
        paddingStart: Metrics.basePadding,
        // paddingStart: 0,
        backgroundColor: Colors.white,
        borderRadius: hp(2.5),
        justifyContent: 'flex-start',
    },
    buttonDefault: {
        height: hp(4),
        borderRadius: hp(2),
    },
    buttonTextDefault: {
        marginStart: Metrics.baseMargin,
        marginEnd: Metrics.baseMargin,
        // fontFamily: Fonts.type.sfuiDisplayLight,
        fontWeight: "200",
    },
    postNewAdButton: {
        marginTop: Metrics.baseMargin,
        backgroundColor: 'transparent',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: Colors.brandPrimary,
    },
    postNewAdButtonText: {
        fontSize: Fonts.size.button2,
        color: Colors.brandPrimary,
    },
    howItWorkButton: {
        marginTop: Metrics.baseMargin,
        backgroundColor: 'transparent',
        // borderWidth: StyleSheet.hairlineWidth,
        // borderColor: Colors.brandPrimary,
    },
    howItWorkButtonText: {
        fontSize: Fonts.size.h6,
        color: Colors.brandPrimary,
    },
    scroll: {
        marginTop: Metrics.baseMargin,
        marginBottom: Metrics.baseMargin,
        width: Metrics.DEVICE_WIDTH - 2 * Metrics.baseMargin,
        // borderRadius: Metrics.baseMargin,
        // height: hp(100) - Fonts.size.h1,
        backgroundColor: Colors.white,
    },
    listContainer: {
        marginBottom: Metrics.baseMargin,
        // marginTop: Metrics.baseMargin,
        width: '100%',
        flexDirection: "column",
        alignItems: "center",
        // justifyContent: 'center',
    },
    listItemContainer: {
        margin: Metrics.baseMargin,
        marginBottom: 0,
        // width: '100%',
        width: wp(100) - Metrics.baseDoubleMargin,
        // height: hp(10),
        backgroundColor: Colors.lightgrey,
        // borderBottomColor: Colors.darktext,
        // borderBottomWidth: 1,
        borderRadius: Metrics.basePadding,
    },
    loadMoreButton: {
        margin: Metrics.baseMargin,
        marginBottom: 0,
        width: wp(30),
        height: hp(8),
    },
    bottomSec: {
        marginBottom: Metrics.baseMargin,
        width: Metrics.DEVICE_WIDTH - 2 * Metrics.baseMargin,
        padding: Metrics.basePadding,
        // borderRadius: Metrics.baseMargin,
        backgroundColor: Colors.white,
        // flex: 1,
        // flexDirection: 'column',
        // alignItems: 'center',
    },
    usersIcon: {
        margin: Metrics.baseMargin,
    },
    separatorLine: {
        marginTop: Metrics.baseMargin,
        marginBottom: Metrics.baseMargin,
        height: StyleSheet.hairlineWidth,
        flex: 1,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#9B9FA4'
    },
    connectWithUsButton: {
        // marginTop: Metrics.baseMargin,
        // width: wp(50),
        marginStart: wp(20),
        marginEnd: wp(20),
        backgroundColor: 'transparent',
    },
    connectWithUsButtonText: {
        fontSize: Fonts.size.button1,
        color: Colors.brandPrimary,
    },
});

let codePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_RESUME };
export default codePush(codePushOptions)(HomeScreen);

