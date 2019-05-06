// import React from 'react';
// import {Animated, Easing, ScrollView, StyleSheet, TouchableWithoutFeedback, Text, UIManager, View} from 'react-native';
// import {Button} from "native-base";
// import {NavigationScreenProps} from "react-navigation";
// import styles from "./ProfileStyle";
// import {Avatar, List, ListItem, Header} from "react-native-elements";
// import {Colors} from "../../themes";
// import ClearButton from '../../components/ClearButton';
// import Icon from "../../components/Icon";
// import AutoHeightImage from 'react-native-auto-height-image';
// import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
// // @ts-ignore
// import {ROUTES} from "../../routes";
// import {DayAvailability, UserLocation, UserProfile} from "../../types/types";
// import InfoText from "../../components/InfoText";
//
// UIManager.setLayoutAnimationEnabledExperimental &&
// UIManager.setLayoutAnimationEnabledExperimental(true);
//
// interface MyProps {
//     user: UserProfile;
//     onLocationSelected: (location: UserLocation) => void;
//     onAvailabilitySelected: (avail: DayAvailability[]) => void;
//     onPublicChange: (status: boolean) => void;
//     onLogout: () => Promise<void>;
// }
//
// type Props = MyProps & NavigationScreenProps;
//
// // interface State {
// //     isLoading: boolean;
// // }
//
// class UserProfile extends React.Component<Props> {
//     private animatedValue: Animated.Value;
//     state = {
//         isLoading: true,
//     };
//
//     constructor(props: Props) {
//         super(props);
//         this.animatedValue = new Animated.Value(0)
//     }
//
//     componentDidMount() {
//         this.animate();
//     };
//
//     animate() {
//         this.animatedValue.setValue(0)
//         Animated.timing(
//             this.animatedValue,
//             {
//                 toValue: 1,
//                 duration: 2000,
//                 easing: Easing.linear
//             }
//         ).start(() => this.animate());
//     }
//
//     _onPublicChange = () => {
//         if (this.props.user) {
//             this.props.onPublicChange(this.props.user.isPublic || false);
//         }
//     };
//
//     render() {
//         // const opacity = this.animatedValue.interpolate({
//         //     inputRange: [0, 0.5, 1],
//         //     outputRange: [0, 1, 0]
//         // })
//         // return (
//         //     <TouchableWithoutFeedback
//         //         style={styles.container}
//         //         onPress={() => !this.state.isLoading && this.props.navigation.navigate(ROUTES.Login)}>
//         //         <View style={styles.mainDiv}>
//         //             <AutoHeightImage width={wp(60)} source={require('../../../assets/logo.png')}/>
//         //             <Animated.Text style={[styles.message, {opacity: opacity}]}>User Profile</Animated.Text>
//         //         </View>
//         //     </TouchableWithoutFeedback>
//         // );
//         const {
//             firstName,
//             lastName,
//             email,
//             phone,
//         } = this.props.user;
//         let avatar: string = "";
//         if (firstName) {
//             avatar += firstName.charAt(0).toUpperCase();
//         }
//         if (lastName) {
//             avatar += lastName.charAt(0).toUpperCase();
//         }
//         <ScrollView style={styles.scroll}>
//             <Header
//                 backgroundColor={Colors.brandPrimary}
//                 centerComponent={{text: "Profile", style: {color: "#fff"}}}
//                 rightComponent={
//                     <ClearButton
//                         styles={{}}
//                         onPress={() => this.props.navigation.navigate("EditBasicInfo")}
//                         text="Edit"
//                     />
//                 }
//             />
//             <View style={styles.userRow}>
//                 <View style={styles.userImage}>
//                     <Avatar large rounded title={avatar}/>
//                 </View>
//                 <View>
//                     <Text style={{fontSize: 16}}>
//                         {firstName} {lastName}
//                     </Text>
//                     <Text style={{color: "gray", fontSize: 16}}>{phone}</Text>
//                     <Text style={{color: "gray", fontSize: 16}}>{email}</Text>
//                 </View>
//             </View>
//             <Button style={{height: 30, borderRadius: 0}} block transparent onPress={this.props.onLogout}>
//                 <Text style={{color: Colors.brandPrimary}}>SIGN OUT</Text>
//             </Button>
//
//             <InfoText text="Account"/>
//             <List containerStyle={styles.listContainer}>
//                 <ListItem
//                     switchButton
//                     hideChevron
//                     title="Public"
//                     switched={this.props.user.isPublic || false}
//                     onSwitch={this._onPublicChange}
//                     containerStyle={styles.listItemContainer}
//                     leftIcon={
//                         <Icon
//                             containerStyle={{backgroundColor: "#FFADF2"}}
//                             icon={{type: "material", name: "notifications"}}
//                         />
//                     }
//                 />
//                 <ListItem
//                     title="Location"
//                     rightIcon={
//                         <View
//                             style={{
//                                 flex: 1,
//                                 height: 15,
//                                 justifyContent: "center",
//                                 alignItems: "flex-end"
//                             }}
//                         >
//                             <SearchLocation
//                                 text={this.getAddressText()}
//                                 trigger="onPress"
//                                 onCancel={() => console.log("On Cancel")}
//                                 onSelected={this.onLocationSelected}
//                             >
//                                 <Text style={{color: "#43484d"}}>
//                                     {this.getAddressText()}
//                                 </Text>
//                             </SearchLocation>
//                         </View>
//                     }
//                     containerStyle={styles.listItemContainer}
//                     leftIcon={
//                         <Icon
//                             containerStyle={{backgroundColor: "#57DCE7"}}
//                             icon={{type: "material", name: "place"}}
//                         />
//                     }
//                 />
//                 <ListItem
//                     title="Availability"
//                     containerStyle={styles.listItemContainer}
//                     rightIcon={
//                         <View
//                             style={{
//                                 flex: 1,
//                                 height: 15,
//                                 justifyContent: "center",
//                                 alignItems: "flex-end"
//                             }}
//                         >
//                             <ShiftPicker
//                                 items={this.props.user.available}
//                                 title="Availability"
//                                 onChange={this.props.onAvailabilitySelected}
//                             >
//                                 <Text style={{color: "#43484d"}}> Edit</Text>
//                             </ShiftPicker>
//                         </View>
//                     }
//                     leftIcon={
//                         <Icon
//                             containerStyle={{backgroundColor: "#57DCE7"}}
//                             icon={{type: "feather", name: "calendar"}}
//                         />
//                     }
//                 />
//             </List>
//             <InfoText text="More"/>
//             <List containerStyle={styles.listContainer}>
//                 <ListItem
//                     title="About US"
//                     onPress={() => this.onPressNavigation("AboutUs")}
//                     containerStyle={styles.listItemContainer}
//                     leftIcon={
//                         <Icon
//                             containerStyle={{backgroundColor: "#A4C8F0"}}
//                             icon={{type: "ionicon", name: "md-information-circle"}}
//                         />
//                     }
//                 />
//                 <ListItem
//                     title="Terms and Policies"
//                     onPress={() => this.onPressNavigation("Terms")}
//                     containerStyle={styles.listItemContainer}
//                     leftIcon={
//                         <Icon
//                             containerStyle={{backgroundColor: "#C6C7C6"}}
//                             icon={{type: "entypo", name: "light-bulb"}}
//                         />
//                     }
//                 />
//                 <ListItem
//                     title="Share our App"
//                     onPress={() => this.onPressNavigation("Share")}
//                     containerStyle={styles.listItemContainer}
//                     leftIcon={
//                         <Icon
//                             containerStyle={{backgroundColor: "#C47EFF"}}
//                             icon={{type: "entypo", name: "share"}}
//                         />
//                     }
//                 />
//                 <ListItem
//                     title="Rate Us"
//                     onPress={() => this.onPressNavigation("Rate")}
//                     containerStyle={styles.listItemContainer}
//                     leftIcon={
//                         <Icon
//                             containerStyle={{backgroundColor: "#FECE44"}}
//                             icon={{type: "entypo", name: "star"}}
//                         />
//                     }
//                 />
//                 <ListItem
//                     title="Send FeedBack"
//                     onPress={() => this.onPressNavigation("Feedback")}
//                     containerStyle={styles.listItemContainer}
//                     leftIcon={
//                         <Icon
//                             containerStyle={{backgroundColor: "#00C001"}}
//                             icon={{type: "materialicon", name: "feedback"}}
//                         />
//                     }
//                 />
//             </List>
//         </ScrollView>
//     };
// }
//
// //
// // const styles = StyleSheet.create({
// //     container: {
// //         width: '100%',
// //         height: '100%',
// //         backgroundColor: '#311f36',
// //         flex: 1,
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //         justifyContent: 'center'
// //     },
// //     mainDiv: {
// //         width: '100%',
// //         height: '100%',
// //         backgroundColor: '#311f36',
// //         flex: 1,
// //         flexDirection: 'column',
// //         alignItems: 'center',
// //         justifyContent: 'center'
// //     },
// //     canvas: {
// //         width: '60%',
// //         resizeMode: 'contain',
// //     },
// //     message: {
// //         margin: 20,
// //         color: '#fff',
// //         fontSize: 20,
// //     },
// // });
//
// export default UserProfile;
//

import React from 'react';
import {Animated, Easing, StyleSheet, TouchableWithoutFeedback, UIManager, View} from 'react-native';
import {NavigationScreenProps} from "react-navigation";
// @ts-ignore
import {ROUTES} from "../../routes";

UIManager.setLayoutAnimationEnabledExperimental &&
UIManager.setLayoutAnimationEnabledExperimental(true);

interface MyProps {

}

type Props = MyProps & NavigationScreenProps;

// interface State {
//     isLoading: boolean;
// }

class UserProfile extends React.Component<Props> {
    private animatedValue: Animated.Value;
    state = {
        isLoading: true,
    };

    constructor(props: Props) {
        super(props);
        this.animatedValue = new Animated.Value(0)
    }

    componentDidMount() {
        this.animate();
    };

    componentWillUnmount() {

    };

    animate() {
        this.animatedValue.setValue(0)
        Animated.timing(
            this.animatedValue,
            {
                toValue: 1,
                duration: 2000,
                easing: Easing.linear
            }
        ).start(() => this.animate());
    }

    render() {
        const opacity = this.animatedValue.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 1, 0]
        })
        return (
            <TouchableWithoutFeedback
                style={styles.container}>
                <View style={styles.mainDiv}>
                    <Animated.Text style={[styles.message, {opacity: opacity}]}>UserProfile</Animated.Text>
                </View>
            </TouchableWithoutFeedback>
        );
    };
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: '#311f36',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
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

export default UserProfile;

