import React from 'react';
import {LayoutAnimation, ScrollView, StyleSheet, UIManager, View} from 'react-native';
import {NavigationScreenProps} from "react-navigation";
// @ts-ignore
import {Button, Header} from "react-native-elements";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import _ from 'lodash';
// @ts-ignore
// import Spinner from 'react-native-loading-spinner-overlay';
// @ts-ignore
import PTRView from 'react-native-pull-to-refresh';
import {Colors, Fonts, Metrics} from "../../themes";
import G, {PostListItem} from "../../tools/G";
import {api_list, fetch, GET} from "../../apis";
import MySpinner from "../../components/MySpinner";
import PostListItemView from "../../components/PostListItemView";
import {ROUTES} from "../../routes";

UIManager.setLayoutAnimationEnabledExperimental &&
UIManager.setLayoutAnimationEnabledExperimental(true);

interface MyProps {

}

type Props = MyProps & NavigationScreenProps;

interface State {
    doingLoading: boolean,
    randomKey: number,
    page: number,
    pageSize: number,
    posts: PostListItem[],
    // isPublicKey: number;
}

export default class BookmarkMainScreen extends React.Component<Props, State> {
    // private animatedValue: Animated.Value;
    state = {
        doingLoading: false,
        randomKey: 0,
        page: 1,
        pageSize: G.ListPageSize,
        posts: [],
        // isPublicKey: 0,
    };
    private getList: (() => void);

    constructor(props: Props) {
        super(props);
        // this.animatedValue = new Animated.Value(0);
        // console.log(G.UserProfile);
        const _this = this;
        this.getList = _.debounce(_this._getList, 500);
    }

    componentDidMount() {
        this.getList();
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

    onItemPress = (id?: string|number) => {
        // this.p
        // @ts-ignore
        G.listingId = id;
        this.props.navigation.navigate(ROUTES.ListingDetail);
    };

    getTextFromAddress = () => {
        const profile = G.UserProfile;
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

    pull2Refresh = () => {
        let {page, pageSize} = this.state;
        if (page > 1) {
            page--;
        }
        this.setState({page: page, pageSize: pageSize});
        this.getList();
    };

    _getList = () => {
        const {page, pageSize} = this.state;
        this.animateState({
            doingLoading: true
        });
        // @ts-ignore
        fetch(GET, api_list.profileBookmarks, {page: page, pageSize: pageSize})
            .then((response: any) => {
                console.log(response);
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
                <Header
                    containerStyle={styles.header}
                    backgroundColor={Colors.brandPrimary}
                    centerComponent={{
                        text: 'Bookmarks',
                        style: {
                            color: '#fff',
                            fontSize: Fonts.size.h4,
                        }
                    }}
                />
                <PTRView onRefresh={this.pull2Refresh} style={styles.scroll}>
                    <ScrollView contentContainerStyle={styles.listContainer}>
                        {!!posts && posts.length > 0 && posts.map((item: any) => {
                            const source = item;
                            const {
                                id, title, description,
                                carTypeName, carMake, carModel,
                                priceModelName,
                                suburb, state, postCode,
                                shiftTypeName, shiftDate} = source;
                            let items = [];
                            if (!!suburb) {
                                items.push(suburb);
                            }
                            if (!!state) {
                                items.push(state);
                            }
                            if (!!postCode) {
                                items.push(postCode);
                            }
                            const address = items.join(', ');
                            items = [];
                            if (!!shiftDate && shiftDate.length >= 10) {
                                if (shiftDate.length >= 10) {
                                    items.push(shiftDate.substr(0, 10));
                                } else {
                                    items.push(shiftDate);
                                }
                            }
                            if (!!shiftTypeName) {
                                items.push(shiftTypeName);
                            }
                            const shift = items.join(' | ');
                            return (
                                <PostListItemView
                                    unique={id}
                                    title={title}
                                    carTypeName={carTypeName}
                                    carModel={carModel}
                                    carMake={carMake}
                                    priceModelName={priceModelName}
                                    address={address}
                                    shift={shift}
                                    onPress={this.onItemPress}
                                />
                            );
                            // return (
                            //     <ListItem
                            //         key={item.id}
                            //         containerStyle={styles.listItemContainer}
                            //         title={
                            //             <View>
                            //                 <Text style={{color: Colors.blacktxt, fontSize: Fonts.size.h5}}>{title}</Text>
                            //                 <Text style={{color: Colors.blacktxt, fontSize: Fonts.size.h6}}>
                            //                     {carTypeName} | {carModel} | {carMake}
                            //                 </Text>
                            //                 <Text style={{color: Colors.blacktxt, fontSize: Fonts.size.h4, fontWeight
                            //                 : "bold"}}>{priceModelName}</Text>
                            //                 <View style={{flex: 1, flexDirection: 'row', alignItems: 'center',}}>
                            //                     {/*<View style={{flexDirection: 'row', alignItems: 'center',}}>*/}
                            //                         <Icon size={Metrics.icons.medium} type={"material"} name={"place"}/>
                            //                         <Text style={{color: Colors.blacktxt, flex: 1, fontSize: Fonts.size.h6}}>{address}</Text>
                            //                     {/*</View>*/}
                            //                     <Text style={{color: Colors.blacktxt, flex: 1, textAlign: "right", fontSize: Fonts.size.h6}}>{shift}</Text>
                            //                 </View>
                            //             </View>
                            //         }/>
                            // );
                        })}
                        {!!posts.length && posts.length >= this.state.pageSize && <Button type="clear" title={"Load more"} buttonStyle={styles.loadMoreButton} titleStyle={{color: Colors.brandPrimary, fontSize: Fonts.size.h5}} onPress={() => this.loadMore()}/>}

                    </ScrollView>
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
    // header: {
    //     height: hp(10),
    //     paddingTop: 0,
    // },
    // userRow: {
    //     width: '100%',
    //     flexDirection: "row",
    //     alignItems: "center",
    //     // justifyContent: 'center',
    //     paddingBottom: Metrics.basePadding,
    //     paddingLeft: Metrics.basePadding * 2,
    //     paddingRight: Metrics.basePadding * 2,
    //     paddingTop: Metrics.basePadding,
    // },
    // userImage: {
    //     marginRight: Metrics.baseMargin,
    // },
    searchBoxContainer: {
        marginTop: hp(0.5),
        width: '82%',
        height: hp(5),
        paddingStart: 0,
        backgroundColor: Colors.white,
        borderRadius: hp(2.5),
        // paddingStart: 0,
        // paddingEnd: 0,
        // marginEnd: wp(10),
    },
    searchBoxInner: {
        marginTop: hp(0.25),
        borderBottomWidth: 0,
    },
    scroll: {
        width: '100%',
        // height: hp(100) - Fonts.size.h1,
        backgroundColor: Colors.lightgrey,
    },
    listContainer: {
        marginBottom: Metrics.baseMargin,
        // marginTop: Metrics.baseMargin,
        width: '100%',
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: Colors.lightgrey,
        // justifyContent: 'center',
    },
    // listItemContainer: {
    //     margin: Metrics.baseMargin,
    //     marginBottom: 0,
    //     // width: '100%',
    //     width: wp(100) - Metrics.baseDoubleMargin,
    //     // height: hp(10),
    //     backgroundColor: Colors.lightgrey,
    //     // borderBottomColor: Colors.darktext,
    //     // borderBottomWidth: 1,
    //     borderRadius: Metrics.basePadding,
    // },
    loadMoreButton: {
        margin: Metrics.baseMargin,
        marginBottom: 0,
        width: wp(30),
        height: hp(8),
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
