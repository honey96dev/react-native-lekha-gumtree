import * as React from 'react'
import {StyleSheet, Text, View, ViewStyle} from 'react-native'
import {Icon, ListItem} from "react-native-elements";
import {Colors, Fonts, Metrics} from "../themes";
import {widthPercentageToDP as wp} from "react-native-responsive-screen";

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
    key?: string|number,
    title?: string|number,
    containerStyle?: ViewStyle,
    carTypeName?: string|number,
    carModel?: string|number,
    carMake?: string|number,
    priceModelName?: string|number,
    address?: string|number,
    shift?: string|number,
    onPress?: () => void;
}

// const PostListItem = ({key, title, containerStyle, carTypeName,
//                           carModel, carMake, priceModelName, address, shift}: Props) => (
export default class PostListItemView extends React.Component<Props> {

    constructor(props: Props) {
        super(props);
    }

    render() {
        const {key, title, containerStyle, carTypeName,
                          carModel, carMake, priceModelName, address, shift} = this.props;
        return (
            <ListItem
                key={key}
                containerStyle={[styles.containerStyle, containerStyle]}
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

// );
// export default PostListItem;
