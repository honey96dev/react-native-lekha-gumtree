import * as React from 'react'
import {StyleSheet, Text, View, ViewStyle} from 'react-native'
import {Icon, ListItem} from "react-native-elements";
import {Colors, Fonts, Metrics} from "../themes";
import {widthPercentageToDP as wp} from "react-native-responsive-screen";
import codePush from 'react-native-code-push';

const styles = StyleSheet.create({
    containerStyle: {
        margin: Metrics.baseMargin,
        marginBottom: 0,
        // width: '100%',
        width: wp(100) - Metrics.baseDoubleMargin,
        // height: hp(10),
        backgroundColor: Colors.white,
        // borderBottomColor: Colors.darktext,
        // borderBottomWidth: 1,
        borderRadius: Metrics.basePadding,
    },
});

interface Props {
    unique: string,
    title?: string|number,
    containerStyle?: ViewStyle,
    carTypeName?: string|number,
    carModel?: string|number,
    carMake?: string|number,
    priceModelName?: string|number,
    address?: string|number,
    shift?: string|number,
    onPress?: (id?: string|number) => void;
}

class PostListItemView extends React.Component<Props> {

    constructor(props: Props) {
        super(props);
    }

    // onPress = (id?: string|number) => {
    //     // this.p
    //     // @ts-ignore
    //     G.listingId = id;
    //     this.props.navigation.navigate(ROUTES.ListingDetail);
    // };

    render() {
        const {unique, title, containerStyle, carTypeName,
                          carModel, carMake, priceModelName, address, shift} = this.props;
        console.log('key', unique);
        return (
            <ListItem
                key={unique}
                containerStyle={[styles.containerStyle, containerStyle]}
                onPress={() => !!this.props.onPress && this.props.onPress(unique)}
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
        )
    }
}

let codePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_RESUME };
export default codePush(codePushOptions)(PostListItemView);
