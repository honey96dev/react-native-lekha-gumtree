import {createAppContainer, createSwitchNavigator, createStackNavigator, NavigationActions} from "react-navigation";
// @ts-ignore
import {fadeIn} from 'react-navigation-transitions';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import UserProfile from '../screens/user/UserProfile';
import {setBaseURL} from "../apis";

// export enum NAVIGATE_STACKS {
//     // RootMain = "RootMain",
//     Splash = "Splash",
//     User = "User",
// }

export enum ROUTES {
    // RootMain = "RootMain",
    Splash = "Splash",
    Login = "Login",
    UserProfile = "UserProfile",
}

// The stack for the UserProfile
const SplashStack = createSwitchNavigator(
    {
        [ROUTES.Splash]: {
            screen: SplashScreen,
            navigationOptions: {
                header: null,
            }
        },
        [ROUTES.Login]: {
            screen: LoginScreen,
            navigationOptions: {
                header: null,
            }
        },
        // [ROUTES.UserProfile]: {
        //     screen: UserProfile,
        //     navigationOptions: {
        //         header: null,
        //     }
        // },
    });
const UserStack = createStackNavigator(
    {
        [ROUTES.UserProfile]: {
            screen: UserProfile,
            navigationOptions: {
                header: null,
            }
        },
    }, {
        transitionConfig: () => fadeIn(500)
    });

setBaseURL("https://mobileapi.lekha.com.au");

export default createAppContainer(createSwitchNavigator(
    {
        [ROUTES.Splash]: {screen: SplashStack},
        [ROUTES.UserProfile]: {screen: UserStack},
    }
));



