import React from 'react';
import {LayoutAnimation, ScrollView, StyleSheet, Text, UIManager, View} from 'react-native';
import {NavigationScreenProps} from "react-navigation";
// @ts-ignore
import {Avatar, Button, Header, Icon, ListItem} from "react-native-elements";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
// @ts-ignore
// import Spinner from 'react-native-loading-spinner-overlay';
// @ts-ignore
import PTRView from 'react-native-pull-to-refresh';
import {Colors, Fonts, Metrics} from "../../themes";
import {ROUTES} from "../../routes";
import BaseIcon from "../../components/BaseIcon";
import G, {PostListItem} from "../../tools/G";
import {api_list, fetch, GET} from "../../apis";
import MySpinner from "../../components/MySpinner";

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

class UserMainScreen extends React.Component<Props, State> {
    // private animatedValue: Animated.Value;
    state = {
        doingLoading: false,
        randomKey: 0,
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
        const posts = this.state.posts;
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
                <Header
                    containerStyle={styles.header}
                    backgroundColor={Colors.brandPrimary}
                    leftComponent={
                        <View style={{width: hp(70), paddingLeft: Metrics.basePadding, flexDirection: "row", alignItems: "center",}}>
                            <Avatar containerStyle={{marginRight: Metrics.baseMargin}} size="large" rounded title={avatar}/>
                            <View>
                                {(!!firstName || !!lastName) && <Text style={{fontSize: Fonts.size.h5, color: Colors.white,}}>
                                    {firstName} {lastName}
                                </Text>}
                                {!!address && <Text style={{fontSize: Fonts.size.regular, color: Colors.white, }}>{address}</Text>}
                            </View>
                        </View>
                    }
                    rightComponent={
                        <BaseIcon
                            containerStyle={{
                                backgroundColor: Colors.transparent,
                                height: hp(6),
                                width: hp(6),
                                borderRadius: hp(2),
                                // marginTop: hp(1),
                                marginEnd: 0,
                            }}
                            icon={{
                                size: Metrics.icons.xl,
                                type: "material",
                                name: "settings",
                                color: Colors.white}}
                            onPress={() => this.props.navigation.navigate(ROUTES.UserProfile)}
                            // style={{ height: hp(4), marginLeft: Metrics.baseMargin}}
                        />}
                />
                <PTRView onRefresh={this.pull2Refresh} style={styles.scroll}>
                    <ScrollView contentContainerStyle={styles.listContainer}>
                        {posts.map((item: PostListItem) => {
                            const {
                                title, description,
                                carTypeName, carMake, carModel,
                                priceModelName,
                                suburb, state, postCode,
                                shiftTypeName, shiftDate} = item;
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
                                <ListItem
                                    key={item.id}
                                    containerStyle={styles.listItemContainer}
                                    title={
                                        <View>
                                            <Text style={{color: Colors.blacktxt, fontSize: Fonts.size.h5}}>{title}</Text>
                                            <Text style={{color: Colors.blacktxt, fontSize: Fonts.size.h6}}>
                                                {carTypeName} | {carModel} | {carMake}
                                            </Text>
                                            <Text style={{color: Colors.blacktxt, fontSize: Fonts.size.h4, fontWeight
                                            : "bold"}}>{priceModelName}</Text>
                                            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center',}}>
                                                {/*<View style={{flexDirection: 'row', alignItems: 'center',}}>*/}
                                                    <Icon size={Metrics.icons.medium} type={"material"} name={"place"}/>
                                                    <Text style={{color: Colors.blacktxt, flex: 1, fontSize: Fonts.size.h6}}>{address}</Text>
                                                {/*</View>*/}
                                                <Text style={{color: Colors.blacktxt, flex: 1, textAlign: "right", fontSize: Fonts.size.h6}}>{shift}</Text>
                                            </View>
                                        </View>
                                    }/>
                            );
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
        height: hp(10),
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

export default UserMainScreen;

