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
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import UserMainScreen from '../screens/user/UserMainScreen';
import UserProfileScreen from '../screens/user/UserProfileScreen';
import {setBaseURL} from "../apis";
import {Colors, Metrics} from "../themes";

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
    HomeTab = "HomeTab",
    UserTab = "UserTab",
    Home = "Home",
    UserMain = "UserMain",
    UserProfile = "UserProfile",
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
const HomeStack = createStackNavigator({
    [ROUTES.Home]: {
        screen: HomeScreen,
        navigationOptions: {
            header: null,
        },
    },
});
const UserStack = createStackNavigator({
    [ROUTES.UserMain]: {
        screen: UserMainScreen,
        navigationOptions: {
            header: null,
        },
    },
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
    [ROUTES.HomeTab]: {
        screen: HomeStack,
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
    [ROUTES.UserTab]: {
        screen: UserStack,
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
        [ROUTES.Tab]: {
            screen: MainTab,
            navigationOptions: {
                header: null,
            },},
        [ROUTES.Splash]: {
            screen: SplashStack,
            navigationOptions: {
                header: null,
            },},
    }, {
        transitionConfig: () => fadeIn(500)
    }
));



