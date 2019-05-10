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
import BaseIcon from "../components/BaseIcon";
import G, {AddressType, PostListItem} from "../tools/G";
import {api_list, fetch, GET, PUT} from "../apis";
import MySpinner from "../components/MySpinner";
import AutoHeightImage from "react-native-auto-height-image";
import Images from "../themes/Images";
import SearchLocationModal from "./user/SearchLocationModal";

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
    posts: PostListItem[],
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
        posts: [],
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
                    posts: response.result.results,
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
        const posts = this.state.posts;
        let avatar: string = "";
        if (firstName) {
            avatar += firstName.charAt(0).toUpperCase();
        }
        if (lastName) {
            avatar += lastName.charAt(0).toUpperCase();
        }
        let address = this.getTextFromAddress();
        console.log('posts', posts);
        return (
            <View style={styles.container} key={this.state.randomKey}>
                <AutoHeightImage style={{marginTop: hp(8)}} width={Metrics.logoWidth} source={Images.logo}/>
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
                            <Icon size={Metrics.icons.large} type={"material"} name={"near-me"} color={Colors.white}/>
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
                <Input
                    containerStyle={styles.searchBox}
                    inputContainerStyle={{borderBottomWidth: 0,}}
                    placeholder='Search...'
                    leftIcon={
                        <Icon
                            size={Metrics.icons.large}
                            type={'material'}
                            name={'search'}
                        />
                    }
                />
                <PTRView onRefresh={this.pull2Refresh} style={styles.scroll}>
                </PTRView>
                <MySpinner visible={this.state.doingLoading} color={Colors.brandPrimary}/>
            </View>
        );
    };
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: '#311f36',
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
    searchBox: {
        marginBottom: Metrics.baseMargin,
        width: wp(80),
        height: hp(5),
        paddingLeft: 0,
        backgroundColor: Colors.white,
        borderRadius: hp(2.5),
    },
    scroll: {
        width: '100%',
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
});

export default HomeScreen;

