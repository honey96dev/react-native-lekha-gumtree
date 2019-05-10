import {
    createAppContainer,
    createSwitchNavigator,
    createStackNavigator,
    createBottomTabNavigator,
    createMaterialTopTabNavigator,
    NavigationActions
} from "react-navigation";
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
// @ts-ignore
import {fadeIn} from 'react-navigation-transitions';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import UserMainScreen from '../screens/user/UserMainScreen';
import UserProfileScreen from '../screens/user/UserProfileScreen';
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
    HomeTab = "HomeTab",
    UserTab = "UserTab",
    Home = "Home",
    UserMain = "UserMain",
    UserProfile = "UserProfile",
}

// The stack for the UserProfile
const SplashStack = createSwitchNavigator({
    [ROUTES.Splash]: {
        screen: SplashScreen,
        navigationOptions: {
            header: null,
        },
    },
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
        },
    },
    [ROUTES.UserTab]: {
        screen: UserStack,
        navigationOptions: {
            header: null,
        },
    }
}, {
    // labeled: false,
    // activeTintColor: Colors.loginBlue,
    // inactiveTintColor: Colors.txtgrey,
    // barStyle: {
    //     backgroundColor: Colors.steel,
    // }
    tabBarPosition: 'bottom',
    swipeEnabled: true,
    animationEnabled: true,
    tabBarOptions: {
        activeTintColor: Colors.loginBlue,
        inactiveTintColor: Colors.txtgrey,
        style: {
            backgroundColor: Colors.steel,
        },
        labelStyle: {
            textAlign: 'center',
        },
        indicatorStyle: {
            borderBottomColor: '#87B56A',
            borderBottomWidth: 2,
        },
    },
});

setBaseURL("https://mobileapi.lekha.com.au");

export default createAppContainer(createSwitchNavigator(
    {
        [ROUTES.Splash]: {screen: SplashStack},
        [ROUTES.Tab]: {screen: MainTab},
    }
));



