/**
 * Created by Ranjeet on 12/3/18.
 */
//@flow
import React, {Component} from 'react';
import _ from 'lodash';
import {AddressType} from '../../tools/G';
import {Button, Header, Icon, Input, ListItem, Text} from 'react-native-elements';
import {Modal, ScrollView, StyleSheet, View} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';

import {Colors, Fonts, Metrics} from "../../themes";
import BaseIcon from "../../components/BaseIcon";
import SearchLocations from '../../tools/LocationApi';

interface Props {
    trigger: 'onFocus' | 'onPress',
    text?: string,
    onSelected: (address: AddressType) => void,
    onCancel: () => void,
    // @ts-ignore
    children: Element<typeof Input> | Element<typeof Text>,
};

interface State {
    text?: string,
    searchedAddresses: AddressType[],
    showList: boolean,
};

export interface TriggerProps {
    onPress?: () => void;
    onFocus?: () => void;
};

export default class SearchLocationModal extends Component<Props, State> {
    static SELECT_LOCATION_HELPER_STRING: string = 'Select Location';
    private searchLocations: (() => void);
    constructor (props: Props) {
        super(props);

        this.state = {
            text: props.text === SearchLocationModal.SELECT_LOCATION_HELPER_STRING ? '' : props.text,
            searchedAddresses: [],
            showList: false,
        }
        const _this = this;
        //a hack to make the key press event throttle
        this.searchLocations = _.debounce(_this._searchLocations, 500);
    }

    showList = () => {
        // console.log('Show list triggered')
        this.setState({ showList: true });
        this.searchLocations();
    };

    onChange = (term: string) => {
        this.setState({ text: term });
        this.searchLocations();
    };

    onCancel = () => {
        this.setState({ showList: false, text: '' });
        this.props.onCancel();
    };

    _searchLocations = () => {
        // console.log('searchLocations', this.state.text);
        if (!!this.state.text && this.state.text.length > 2) {
            let searchedAddresses = SearchLocations(this.state.text);
            // console.log('searchLocations', searchedAddresses);
            this.setState({ searchedAddresses: searchedAddresses });
        }
    };

    getTextFromAddress = (address: AddressType) => {
        let items = [];
        if (!!address.suburb) {
            items.push(address.suburb);
        }
        if (!!address.state) {
            items.push(address.state);
        }
        if (!!address.postCode) {
            items.push(address.postCode);
        }
        return items.join(', ');
    };

    onAddressSelected = (address: AddressType) => {
        const text = this.getTextFromAddress(address);
        this.setState({ text: text, showList: false });
        this.props.onSelected(address);
    };

    render () {
        var trigger = this.props.trigger;
        let newProps: TriggerProps = {};
        if (trigger == 'onFocus') {
            newProps.onFocus = this.showList;
        } else if (trigger == 'onPress') {
            newProps.onPress = this.showList;
        }
        const {searchedAddresses} = this.state;
        // console.log('searchedAddresses', searchedAddresses);
        return (
            <View style={styles.parentView}>
                {React.cloneElement(this.props.children, newProps)}
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.showList}
                >
                    <View style={styles.header}>
                        <View style={styles.searchRow}>
                            <BaseIcon
                                containerStyle={{
                                    backgroundColor: Colors.brandPrimary,
                                    height: hp(4),
                                    width: hp(4),
                                    borderRadius: hp(2),
                                    marginTop: hp(1),
                                    marginEnd: 0,
                                }}
                                icon={{
                                    size: Metrics.icons.large,
                                    type: "material",
                                    name: "arrow-back",
                                    color: Colors.white}}
                                onPress={() => this.onCancel()}
                                // style={{ height: hp(4), marginLeft: Metrics.baseMargin}}
                            />
                            {/*<InputGroup rounded style={styles.searchGroup}>*/}
                                {/*<Icon style={styles.searchIcon} name="ios-search"/>*/}

                                <Input
                                    // ref={(input: Input) => input && input._root.focus()}
                                    autoCorrect={false}
                                    onChangeText={this.onChange}
                                    value={this.state.text}
                                    containerStyle={styles.searchBoxContainer}
                                    inputContainerStyle={styles.searchBoxInner}
                                    inputStyle={{color: Colors.white}}
                                    placeholder="Search..."
                                    rightIcon={!!this.state.text
                                        ? <BaseIcon
                                            containerStyle={{
                                                backgroundColor: Colors.transparent,
                                                height: hp(2.8),
                                                width: hp(2.8),
                                                borderRadius: hp(1.4),
                                                // marginTop: hp(1),
                                                marginStart: 0,
                                                marginEnd: 0,
                                            }}
                                            icon={{type: "material", name: "close", color: Colors.white}}
                                            onPress={() => this.setState({text: ''})}
                                            // style={{ height: hp(4), marginLeft: Metrics.baseMargin}}
                                        /> : undefined}
                                />
                            {/*</InputGroup>*/}
                        </View>
                        {/*<View style={styles.listContainer}>*/}
                            <ScrollView style={styles.listContainer}>
                                {/*<View style={styles.list}>*/}
                                    {/*<List>*/}
                                        {searchedAddresses.map((result: any) => {
                                            const item = result.item;
                                            const text = this.getTextFromAddress(item);
                                            return (<ListItem
                                                title={text}
                                                onPress={() => this.onAddressSelected(item)}
                                                key={text}>
                                                {/*<Text>*/}
                                                    {/*{text}*/}
                                                {/*</Text>*/}
                                            </ListItem>)
                                        })}
                                    {/*</List>*/}
                                {/*</View>*/}
                            </ScrollView>
                        {/*</View>*/}
                    </View>
                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    parentView:{
        flex:1,
    },
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "transparent"
    },
    searchRow: {
        width: '92%',
        height: Fonts.size.h1,
        flexDirection: "row",
        // paddingStart: Metrics.basePadding,
        paddingEnd: Metrics.basePadding,
    },
    searchBoxContainer: {
        height: hp(5),
        // paddingStart: 0,
        // paddingEnd: 0,
        // marginEnd: wp(10),
    },
    searchBoxInner: {
        marginTop: hp(1),
    },
    listContainer: {
        width: '100%',
        // backgroundColor: "#fff",
        // justifyContent: "flex-start",
        // alignItems: "stretch",
        // flexDirection: "column",
    },
    list: {
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "flex-start",
        flex:1,
    },
    header: {
        flexDirection: "column",
        justifyContent: "space-between",
        // paddingTop: Metrics.baseDoubleMargin,
        backgroundColor: Colors.brandPrimary,
    },
    // header: {
    //     height: Fonts.size.h1,
    //     paddingTop: 0,
    // },
});
