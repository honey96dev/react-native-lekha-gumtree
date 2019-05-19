import React from 'react';
import {
    createAppContainer,
    createMaterialTopTabNavigator,
    createStackNavigator,
    createSwitchNavigator
} from "react-navigation";
// @ts-ignore
import {fadeIn} from 'react-navigation-transitions';
import {Icon} from 'react-native-elements';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import SearchMainScreen from '../screens/search/SearchMainScreen';
import SearchFilterScreen from '../screens/search/SearchFilterScreen';
import PostMainScreen from '../screens/post/PostMainScreen';
import BookmarkMainScreen from '../screens/bookmark/BookmarkMainScreen';
import UserMainScreen from '../screens/user/UserMainScreen';
import UserProfileScreen from '../screens/user/UserProfileScreen';
import ListingDetailView from '../components/ListingDetailView';
import {setBaseURL} from "../apis";
import {Colors} from "../themes";

// export enum NAVIGATE_STACKS {
//     // RootMain = "RootMain",
//     Splash = "Splash",
//     User = "User",
// }

export enum ROUTES {
    // RootMain = "RootMain",
    Splash = "Splash",
    Login = "Login",
    Tab = "Tab",
    HomeStack = "HomeStack",
    SearchStack = "SearchStack",
    UserStack = "UserStack",
    Home = "Home",
    SearchMain = "SearchMain",
    SearchFilter = "SearchFilter",
    PostMain = "PostMain",
    BookmarkMain = "BookmarkMain",
    UserMain = "UserMain",
    UserProfile = "UserProfile",
    ListingDetail = "ListingDetail",
}

// The stack for the UserProfile
const SplashStack = createSwitchNavigator({
    // [ROUTES.Splash]: {
    //     screen: SplashScreen,
    //     navigationOptions: {
    //         header: null,
    //     },
    // },
    [ROUTES.Login]: {
        screen: LoginScreen,
        navigationOptions: {
            header: null,
        },
    },
    // [ROUTES.UserProfile]: {
    //     screen: UserProfile,
    //     navigationOptions: {
    //         header: null,
    //     }
    // },
});
// const HomeStack = createStackNavigator({
//     // [ROUTES.Home]: {
//     //     screen: HomeScreen,
//     //     navigationOptions: {
//     //         header: null,
//     //     },
//     // },
// });
const SearchStack = createStackNavigator({
    // [ROUTES.SearchMain]: {
    //     screen: SearchMainScreen,
    //     navigationOptions: {
    //         header: null,
    //     },
    // },
    [ROUTES.SearchFilter]: {
        screen: SearchFilterScreen,
        navigationOptions: {
            header: null,
        },
    },
});
const UserStack = createStackNavigator({
    // [ROUTES.UserMain]: {
    //     screen: UserMainScreen,
    //     navigationOptions: {
    //         header: null,
    //     },
    // },
    [ROUTES.UserProfile]: {
        screen: UserProfileScreen,
        navigationOptions: {
            header: null,
        },
    },
}, {
    transitionConfig: () => fadeIn(500)
});

const MainTab = createMaterialTopTabNavigator({
    [ROUTES.Home]: {
        screen: HomeScreen,
        navigationOptions: {
            header: null,
            tabBarLabel:"Home",
            tabBarIcon: (color:any) => {
                return (<Icon
                    size={color.focused ? 26 : 24}
                    type={"material"}
                    name={"home"}
                    color={color.focused ? Colors.tabActiveTint : Colors.tabInactiveTint}/>);
            }
        },
    },
    [ROUTES.SearchMain]: {
        screen: SearchMainScreen,
        navigationOptions: {
            header: null,
            tabBarLabel:"Search",
            tabBarIcon: (color:any) => {
                return (<Icon
                    size={color.focused ? 26 : 24}
                    type={"material"}
                    name={"search"}
                    color={color.focused ? Colors.tabActiveTint : Colors.tabInactiveTint}/>);
            }
        },
    },
    [ROUTES.PostMain]: {
        screen: PostMainScreen,
        navigationOptions: {
            header: null,
            tabBarLabel:"Search",
            tabBarIcon: (color:any) => {
                return (<Icon
                    size={color.focused ? 26 : 24}
                    type={"material"}
                    name={"fiber-new"}
                    color={color.focused ? Colors.tabActiveTint : Colors.tabInactiveTint}/>);
            }
        },
    },
    [ROUTES.BookmarkMain]: {
        screen: BookmarkMainScreen,
        navigationOptions: {
            header: null,
            tabBarLabel:"Search",
            tabBarIcon: (color:any) => {
                return (<Icon
                    size={color.focused ? 26 : 24}
                    type={"material"}
                    name={"star"}
                    color={color.focused ? Colors.tabActiveTint : Colors.tabInactiveTint}/>);
            }
        },
    },
    [ROUTES.UserMain]: {
        screen: UserMainScreen,
        navigationOptions: {
            header: null,
            tabBarLabel:"Home",
            tabBarIcon: (color:any) => {
                return (<Icon
                    size={color.focused ? 26 : 24}
                    type={"material"}
                    name={"account-circle"}
                    color={color.focused ? Colors.tabActiveTint : Colors.tabInactiveTint}/>);
            }
        },
    }
}, {
    tabBarPosition: 'bottom',
    swipeEnabled: true,
    animationEnabled: true,
    tabBarOptions: {
        showIcon: true,
        showLabel: false,
        activeTintColor: Colors.tabActiveTint,
        inactiveTintColor: Colors.tabInactiveTint,
        style: {
            backgroundColor: Colors.steel,
        },
        labelStyle: {
            textAlign: 'center',
        },
        indicatorStyle: {
            borderBottomColor: Colors.brandPrimary,
            borderBottomWidth: 3,
        },
    },
});

setBaseURL("https://mobileapi.lekha.com.au");

export default createAppContainer(createStackNavigator(
    {
        [ROUTES.Splash]: {
            screen: SplashStack,
            navigationOptions: {
                header: null,
            },},
        [ROUTES.Tab]: {
            screen: MainTab,
            navigationOptions: {
                header: null,
            },},
        [ROUTES.SearchStack]: {
            screen: SearchStack,
            navigationOptions: {
                header: null,
            },},
        [ROUTES.UserStack]: {
            screen: UserStack,
            navigationOptions: {
                header: null,
            },},
        [ROUTES.ListingDetail]: {
            screen: ListingDetailView,
            navigationOptions: {
                header: null,
            },},
    }, {
        transitionConfig: () => fadeIn(500)
    }
));



