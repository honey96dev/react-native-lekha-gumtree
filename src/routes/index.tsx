import {createAppContainer, createSwitchNavigator, createStackNavigator} from "react-navigation";
// @ts-ignore
import {fadeIn} from 'react-navigation-transitions';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';

export enum ROUTES {
    // RootMain = "RootMain",
    Splash = "Splash",
    Login = "Login"
}

// The stack for the SplashScreen
const SplashStack = createSwitchNavigator({
    [ROUTES.Splash]: {
        screen: SplashScreen,
        navigationOptions: {
            header: null,
        }
    },
    [ROUTES.Login]: {screen: LoginScreen},
}, {
    transitionConfig: () => fadeIn(500)
});

// // The app root stack, all navigation start from here
// export default createAppContainer(createStackNavigator(
//     {
//         [ROUTES.RootMain]: {
//             screen: SplashStack
//         },
//         [ROUTES.Login]: {
//             screen: LoginStack
//         }
//     },
//     {
//         mode: "modal",
//         headerMode: "none"
//     }
// ));

export default createAppContainer(createSwitchNavigator(
    {
        [ROUTES.Splash]: {screen: SplashStack},
    }
));



