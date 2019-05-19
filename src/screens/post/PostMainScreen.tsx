import React from 'react';
import {LayoutAnimation, ScrollView, StyleSheet, UIManager, View} from 'react-native';
import {NavigationScreenProps} from "react-navigation";
// @ts-ignore
import {Button, Header, Icon, Input, ListItem, Text} from "react-native-elements";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
// @ts-ignore
import Picker from 'react-native-picker';
// @ts-ignore
import NumericInput from 'react-native-numeric-input';
import sprintfJs from 'sprintf-js';
// @ts-ignore
// import Spinner from 'react-native-loading-spinner-overlay';
import {Colors, Fonts, Metrics} from "../../themes";
import InfoText from "../../components/InfoText";
import BaseIcon from "../../components/BaseIcon";
import {api_list, fetch, GET} from "../../apis";
import MySpinner from "../../components/MySpinner";
import SearchLocationModal from "../../components/SearchLocationModal";
import {AddressType} from "../../tools/G";

UIManager.setLayoutAnimationEnabledExperimental &&
UIManager.setLayoutAnimationEnabledExperimental(true);

interface MyProps {

}

interface CarType {
    id?: string|number,
    name?: string|number,
    description?: string,
    active?: boolean,
}

interface PriceModel {
    id?: string|number,
    name?: string|number,
    description?: string,
    active?: boolean,
}

// interface VendorType {
//     id?: string|number,
//     name?: string|number,
//     description?: string,
//     active?: boolean,
// }

interface ShiftType {
    id?: string|number,
    name?: string|number,
    description?: string,
    active?: boolean,
}

type Props = MyProps & NavigationScreenProps;

interface State {
    doingLoading: boolean;
    randomKey: number;
    carTypes: CarType[],
    priceModels: PriceModel[],
    vendorTypes: string[],
    shiftTypes: ShiftType[],
    carType: string|number,
    carTypeId: number,
    title?: string,
    description?: string,
    make?: string,
    model?: string,
    priceModel: string|number,
    priceModelId: number,
    price?: number,
    vendor: string|number,
    vendorId: number,
    location?: AddressType,
    // priceModelIdx: number,
    shiftType: string|number,
    shiftTypeId: number,
    date: string,
    // isPublicKey: number;
}

export default class PostMainScreen extends React.Component<Props, State> {
    // private animatedValue: Animated.Value;
    state = {
        doingLoading: false,
        randomKey: 0,
        carTypes: [],
        priceModels: [],
        vendorTypes: [],
        shiftTypes: [],
        carType: 'All',
        carTypeId: -1,
        title: '',
        description: '',
        make: '',
        model: '',
        priceModel: 'All',
        priceModelId: -1,
        price: 0,
        vendor: 'Select Vendor',
        vendorId: -1,
        // priceModelIdx: 0,
        location: {},
        shiftType: 'All',
        shiftTypeId: -1,
        date: 'Select Date',
        // isPublicKey: 0,
    };

    constructor(props: Props) {
        super(props);
        // this.animatedValue = new Animated.Value(0);
        // console.log(G.UserProfile);
    }

    componentDidMount() {
        // this.animate();
        this.loadRefData();
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

    loadRefData = () => {
        this.animateState({doingLoading: true});
        // @ts-ignore
        fetch(GET, api_list.systemRefdata, {})
            .then((response: any) => {
                const data = response.result;
                let carTypes: CarType[] = data.carTypes;
                let priceModels: CarType[] = data.priceModels;
                let vendorTypes: string[] = data.vendors;
                let shiftTypes: CarType[] = data.shiftTypes;
                carTypes.unshift({id: -1, name: 'All', description: '', active: false});
                priceModels.unshift({id: -1, name: 'All', description: '', active: false});
                vendorTypes.unshift('Select Vendor');
                shiftTypes.unshift({id: -1, name: 'All', description: '', active: false});

                // let priceModelIdx = 0;
                // for (let i in priceModels) {
                //     if (priceModels[i].name == SearchMainScreen.priceModel) {
                //         // @ts-ignore
                //         priceModelIdx = i;
                //         break;
                //     }
                // }
                // console.log('priceModels-loading', SearchMainScreen.priceModel, priceModelIdx, priceModels);

                this.animateState({
                    doingLoading: false,
                    carTypes: data.carTypes,
                    priceModels: data.priceModels,
                    // priceModelIdx: priceModelIdx,
                    shiftTypes: data.shiftTypes,
                });
            })
            .catch(err => {
                console.log(err);
                this.animateState({
                    doingLoading: false,
                });
            });
    };

    getAddressText = () => {
        // console.log('User info in get address text is');
        // console.info(G.UserProfile);
        const user: AddressType = this.state.location;
        if (user) {
            let items = [];
            if (!!user.suburb) {
                items.push(user.suburb);
            }
            if (!!user.state) {
                items.push(user.state);
            }
            if (!!user.postCode) {
                items.push(user.postCode);
            }
            if (items.length) {
                return items.join(', ');
            } else {
                return SearchLocationModal.SELECT_LOCATION_HELPER_STRING;
            }
        }
        return SearchLocationModal.SELECT_LOCATION_HELPER_STRING;
    };

    onPressCarType = () => {
        let data: string[] = [];
        if (this.state.carTypes.length == 0) {
            return;
        }
        for (let item of this.state.carTypes) {
            // @ts-ignore
            data.push(item.name);
        }
        Picker.init({
            pickerData: data,
            selectedValue: [this.state.carType],
            pickerConfirmBtnText: "OK",
            pickerCancelBtnText: "Cancel",
            pickerTitleText: "Car Type",
            pickerConfirmBtnColor: [234, 84, 36, 1],
            pickerCancelBtnColor: [234, 84, 36, 1],
            pickerTitleColor: [255, 255, 255, 1],
            pickerToolBarBg: [49, 31, 54, 1],
            pickerBg: [234, 84, 36, 1],
            pickerFontColor: [255, 255, 255, 1],
            onPickerConfirm: (data: string[]) => {
                console.log(data);
                this.setState({carType: data[0]});
            },
            onPickerCancel: data => {
                console.log(data);
            },
            onPickerSelect: (data: string[]) => {
                console.log(data);
            }
        });
        Picker.show();
    };

    onChangeTitle = (text: string) => {
        this.setState({title: text});
    };

    onChangeDescription = (text: string) => {
        this.setState({description: text});
    };

    onChangeMake = (text: string) => {
        this.setState({make: text});
    };

    onChangeModel = (text: string) => {
        this.setState({model: text});
    };

    onPressPriceModel = () => {
        let data: string[] = [];
        if (this.state.priceModels.length == 0) {
            return;
        }
        for (let item of this.state.priceModels) {
            // @ts-ignore
            data.push(item.name);
        }
        Picker.init({
            pickerData: data,
            selectedValue: [this.state.priceModel],
            pickerConfirmBtnText: "OK",
            pickerCancelBtnText: "Cancel",
            pickerTitleText: "Shift Type",
            pickerConfirmBtnColor: [234, 84, 36, 1],
            pickerCancelBtnColor: [234, 84, 36, 1],
            pickerTitleColor: [255, 255, 255, 1],
            pickerToolBarBg: [49, 31, 54, 1],
            pickerBg: [234, 84, 36, 1],
            pickerFontColor: [255, 255, 255, 1],
            onPickerConfirm: (data: string[]) => {
                console.log(data);
                this.setState({priceModel: data[0]});
            },
            onPickerCancel: data => {
                console.log(data);
            },
            onPickerSelect: (data: string[]) => {
                console.log(data);
            }
        });
        Picker.show();
    };

    onChangePrice = (text: number) => {
        // if (/^\d+$/.test(text)) {
            this.setState({price: text});
        // console.log('onChangePrice', text);
        // }
    };

    onPressVendor = () => {
        let data: string[] = [];
        if (this.state.vendorTypes.length == 0) {
            return;
        }
        for (let item of this.state.vendorTypes) {
            // @ts-ignore
            data.push(item);
        }
        Picker.init({
            pickerData: data,
            selectedValue: [this.state.vendor],
            pickerConfirmBtnText: "OK",
            pickerCancelBtnText: "Cancel",
            pickerTitleText: "Shift Type",
            pickerConfirmBtnColor: [234, 84, 36, 1],
            pickerCancelBtnColor: [234, 84, 36, 1],
            pickerTitleColor: [255, 255, 255, 1],
            pickerToolBarBg: [49, 31, 54, 1],
            pickerBg: [234, 84, 36, 1],
            pickerFontColor: [255, 255, 255, 1],
            onPickerConfirm: (data: string[]) => {
                console.log(data);
                this.setState({vendor: data[0]});
            },
            onPickerCancel: data => {
                console.log(data);
            },
            onPickerSelect: (data: string[]) => {
                console.log(data);
            }
        });
        Picker.show();
    }

    onLocationSelected = (address: AddressType) => {
        const {postCode, suburb, state, longitude, latitude} = address;
        this.setState({
            location: {
                postCode: postCode,
                suburb: suburb,
                state: state,
                longitude: longitude,
                latitude: latitude,
            }
        });
    };

    onPressShiftType = () => {
        let data: string[] = [];
        if (this.state.shiftTypes.length == 0) {
            return;
        }
        for (let item of this.state.shiftTypes) {
            // @ts-ignore
            data.push(item.name);
        }
        Picker.init({
            pickerData: data,
            selectedValue: [this.state.shiftType],
            pickerConfirmBtnText: "OK",
            pickerCancelBtnText: "Cancel",
            pickerTitleText: "Shift Type",
            pickerConfirmBtnColor: [234, 84, 36, 1],
            pickerCancelBtnColor: [234, 84, 36, 1],
            pickerTitleColor: [255, 255, 255, 1],
            pickerToolBarBg: [49, 31, 54, 1],
            pickerBg: [234, 84, 36, 1],
            pickerFontColor: [255, 255, 255, 1],
            onPickerConfirm: (data: string[]) => {
                console.log(data);
                this.setState({shiftType: data[0]});
            },
            onPickerCancel: data => {
                console.log(data);
            },
            onPickerSelect: (data: string[]) => {
                console.log(data);
            }
        });
        Picker.show();
    };

    _createDateData() {
        let date = [];
        for(let i=1970;i<2050;i++){
            let month = [];
            for(let j = 1;j<13;j++){
                let day = [];
                if(j === 2){
                    for(let k=1;k<29;k++){
                        day.push(k);
                    }
                    //Leap day for years that are divisible by 4, such as 2000, 2004
                    if(i%4 === 0){
                        day.push(29);
                    }
                }
                else if(j in {1:1, 3:1, 5:1, 7:1, 8:1, 10:1, 12:1}){
                    for(let k=1;k<32;k++){
                        day.push(k);
                    }
                }
                else{
                    for(let k=1;k<31;k++){
                        day.push(k);
                    }
                }
                let _month = {};
                // @ts-ignore
                _month[j] = day;
                month.push(_month);
            }
            let _date = {};
            // @ts-ignore
            _date[i] = month;
            date.push(_date);
        }
        return date;
    }

    onPressDate = () => {
        let data = this._createDateData();
        // for (let item of this.state.carTypes) {
        //     // @ts-ignore
        //     data.push(item.name);
        // }
        const ymd = this.state.date.split(/\//);
        const today = new Date();
        const y = today.getFullYear();
        const m = today.getMonth() + 1;
        const d = today.getDate();
        // console.log(ymd);
        Picker.init({
            pickerData: data,
            selectedValue: ymd.length == 3 ? [parseInt(ymd[2]), parseInt(ymd[1]), parseInt(ymd[0])] : [y, m, d],
            pickerConfirmBtnText: "OK",
            pickerCancelBtnText: "Cancel",
            pickerTitleText: "Car Type",
            pickerConfirmBtnColor: [234, 84, 36, 1],
            pickerCancelBtnColor: [234, 84, 36, 1],
            pickerTitleColor: [255, 255, 255, 1],
            pickerToolBarBg: [49, 31, 54, 1],
            pickerBg: [234, 84, 36, 1],
            pickerFontColor: [255, 255, 255, 1],
            onPickerConfirm: (data: string[]) => {
                console.log(data);
                this.setState({date: sprintfJs.sprintf('%02d/%02d/%04d', data[2], data[1], data[0])});
            },
            onPickerCancel: data => {
                console.log(data);
            },
            onPickerSelect: (data: string[]) => {
                console.log(data);
            }
        });
        Picker.show();
    };
    // onChangePriceModel = (selectedIndex: number) => {
    //     const {priceModels} = this.state;
    //     // @ts-ignore
    //     console.log('priceModels-saving', priceModels[selectedIndex], priceModels[selectedIndex].name);
    //     // @ts-ignore
    //     this.setState({priceModelIdx: selectedIndex, priceModel: priceModels[selectedIndex].name});
    // };

    render() {
        const {carType, title, description, make, model, priceModel, price, vendor, shiftType, date} = this.state;
        // console.log('price', price);
        // const price = sprintfJs.sprintf("%f", this.state.price);
        const location = this.getAddressText();
        // let priceButtons: string[] = [];
        // let item: PriceModel;
        // for (item of priceModels) {
        //     // @ts-ignore
        //     priceButtons.push(item.name);
        // }
        // const priceModelIdx = this.state.priceModelIdx;
        // console.log('priceModelIdx', priceModelIdx, priceButtons);
        return (
            <View style={styles.container} key={this.state.randomKey}>
                <Header
                    containerStyle={styles.header}
                    backgroundColor={Colors.brandPrimary}
                    centerComponent={{
                        text: 'Post New Listing',
                        style: {
                            color: '#fff',
                            fontSize: Fonts.size.h4,
                        }
                    }}
                />
                <ScrollView style={styles.scroll}>
                    <InfoText text="Basic Information"/>
                    <ListItem
                        containerStyle={[styles.listItemContainer, {padding: 0,}]}
                        title={<Input
                            inputContainerStyle={{borderBottomWidth: 0,}}
                            inputStyle={{
                                // borderWidth: 1, borderRadius: Metrics.baseMargin
                                // paddingTop: 0,
                                paddingBottom: 0,
                            }}
                            label={"Title"}
                            labelStyle={{fontWeight: "normal", color: Colors.txtgrey,}}
                            placeholder={"(Input Title)"}
                            value={title}
                            onChangeText={this.onChangeTitle}/>}
                    />
                    <ListItem
                        containerStyle={[styles.listItemContainer, {padding: 0,}]}
                        title={<Input
                            inputContainerStyle={{borderBottomWidth: 0,}}
                            inputStyle={{
                                // borderWidth: 1, borderRadius: Metrics.baseMargin
                                paddingTop: 0,
                                paddingBottom: 0,
                                textAlignVertical: "top",
                            }}
                            multiline={true}
                            numberOfLines={3}
                            label={"Description"}
                            labelStyle={{fontWeight: "normal", color: Colors.txtgrey,}}
                            placeholder={"(Input Description)"}
                            value={description}
                            onChangeText={this.onChangeDescription}/>}
                    />
                    <InfoText text="Car Info"/>
                    <ListItem
                        containerStyle={[styles.listItemContainer, {padding: 0,}]}
                        title={<Input
                            inputContainerStyle={{borderBottomWidth: 0,}}
                            inputStyle={{
                                // borderWidth: 1, borderRadius: Metrics.baseMargin
                                // paddingTop: 0,
                                paddingBottom: 0,
                            }}
                            label={"Make"}
                            labelStyle={{fontWeight: "normal", color: Colors.txtgrey,}}
                            placeholder={"(Input Make)"}
                            value={make}
                            onChangeText={this.onChangeMake}/>}
                    />
                    <ListItem
                        containerStyle={[styles.listItemContainer, {padding: 0,}]}
                        title={<Input
                            inputContainerStyle={{borderBottomWidth: 0,}}
                            inputStyle={{
                                // borderWidth: 1, borderRadius: Metrics.baseMargin
                                // paddingTop: 0,
                                paddingBottom: 0,
                            }}
                            label={"Model"}
                            labelStyle={{fontWeight: "normal", color: Colors.txtgrey,}}
                            placeholder={"(Input Model)"}
                            value={model}
                            onChangeText={this.onChangeModel}/>}
                    />
                    <InfoText text="Shift Info"/>
                    <ListItem
                        title="Price Types"
                        containerStyle={styles.listItemContainer}
                        // titleStyle={{fontSize: Fonts.size.h4}}
                        onPress={this.onPressPriceModel}
                        leftIcon={
                            <BaseIcon
                                containerStyle={{backgroundColor: Colors.brandPrimary}}
                                icon={{type: "material", name: "attach-money"}}
                            />
                        }
                        rightIcon={
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Text>{priceModel}</Text>
                                <Icon
                                    type={"material"}
                                    name={"chevron-right"}
                                    color={Colors.darktext}
                                />
                            </View>
                        }/>
                    <ListItem
                        title="Price"
                        containerStyle={styles.listItemContainer}
                        // titleStyle={{fontSize: Fonts.size.h4}}
                        leftIcon={
                            <BaseIcon
                                containerStyle={{backgroundColor: Colors.brandPrimary}}
                                icon={{type: "simple-line-icon", name: "wallet"}}
                            />
                        }
                        rightIcon={
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Text>AUD$</Text>
                                {/*<Input*/}
                                    {/*containerStyle={{width: wp(20), height: hp(4)}}*/}
                                    {/*inputContainerStyle={{borderBottomWidth: 0, height: hp(3.5)}}*/}
                                    {/*inputStyle={{*/}
                                        {/*marginTop: 0,*/}
                                        {/*// borderWidth: 1, borderRadius: Metrics.baseMargin*/}
                                        {/*paddingTop: 0,*/}
                                        {/*paddingBottom: 0,*/}
                                        {/*fontSize: Fonts.size.h6,*/}
                                        {/*textAlign: "right",*/}
                                    {/*}}*/}
                                    {/*placeholder={"(Price)"}*/}
                                    {/*maxLength={4}*/}
                                    {/*value={price}*/}
                                    {/*keyboardType='numeric'*/}
                                    {/*onChangeText={this.onChangePrice}/>*/}
                                <NumericInput
                                    initValue={price}
                                    value={price}
                                    onChange={this.onChangePrice}
                                    // totalWidth={240}
                                    totalHeight={hp(5)}
                                    // iconSize={25}
                                    step={5}
                                    valueType='real'
                                    rounded
                                    // textColor='#B0228C'
                                    // iconStyle={{ color: 'white' }}
                                    // rightButtonBackgroundColor='#EA3788'
                                    // leftButtonBackgroundColor='#E56B70'
                                />
                            </View>
                        }/>
                    <ListItem
                        title="Vendor"
                        containerStyle={styles.listItemContainer}
                        // titleStyle={{fontSize: Fonts.size.h4}}
                        onPress={this.onPressVendor}
                        leftIcon={
                            <BaseIcon
                                containerStyle={{backgroundColor: Colors.brandPrimary}}
                                icon={{type: "font-awesome", name: "trademark"}}
                            />
                        }
                        rightIcon={
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Text>{vendor}</Text>
                                <Icon
                                    type={"material"}
                                    name={"chevron-right"}
                                    color={Colors.darktext}
                                />
                            </View>
                        }/>
                    <ListItem
                        title="Location"
                        containerStyle={styles.listItemContainer}
                        // titleStyle={{fontSize: Fonts.size.h4}}
                        leftIcon={
                            <BaseIcon
                                containerStyle={{backgroundColor: Colors.brandPrimary}}
                                icon={{type: "material", name: "near-me"}}
                            />
                        }
                        rightIcon={
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <View
                                    style={{
                                        // flex: 1,
                                        height: 15,
                                        justifyContent: "center",
                                        // alignItems: "flex-end"
                                    }}
                                >
                                    <SearchLocationModal
                                        text={location}
                                        trigger="onPress"
                                        onCancel={() => console.log("On Cancel")}
                                        onSelected={this.onLocationSelected}
                                    >
                                        <Text style={{color: "#43484d"}}>
                                            {location}
                                        </Text>
                                    </SearchLocationModal>
                                </View>
                                <Icon
                                    type={"material"}
                                    name={"chevron-right"}
                                    color={Colors.darktext}
                                />
                            </View>
                        }/>
                    <ListItem
                        title="Shift"
                        containerStyle={styles.listItemContainer}
                        // titleStyle={{fontSize: Fonts.size.h4}}
                        onPress={this.onPressShiftType}
                        leftIcon={
                            <BaseIcon
                                containerStyle={{backgroundColor: Colors.brandPrimary}}
                                icon={{type: "feature", name: "list"}}
                            />
                        }
                        rightIcon={
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Text>{shiftType}</Text>
                                <Icon
                                    type={"material"}
                                    name={"chevron-right"}
                                    color={Colors.darktext}
                                />
                            </View>
                        }/>
                    <ListItem
                        title="Date"
                        containerStyle={styles.listItemContainer}
                        // titleStyle={{fontSize: Fonts.size.h4}}
                        onPress={this.onPressDate}
                        leftIcon={
                            <BaseIcon
                                containerStyle={{backgroundColor: Colors.brandPrimary}}
                                icon={{type: "feather", name: "bold"}}
                            />
                        }
                        rightIcon={
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Text>{date}</Text>
                                <Icon
                                    type={"material"}
                                    name={"chevron-right"}
                                    color={Colors.darktext}
                                />
                            </View>
                        }/>
                </ScrollView>
                <View style={styles.buttonSec}>
                    <Button
                        buttonStyle={[styles.buttonDefault, styles.postButton]}
                        titleStyle={[styles.buttonTextDefault, styles.postButtonText]}
                        title={"Post"}
                        />
                    {/*<Button*/}
                        {/*type="outline"*/}
                        {/*buttonStyle={[styles.buttonDefault, styles.cancelButton]}*/}
                        {/*titleStyle={[styles.buttonTextDefault, styles.cancelButtonText]}*/}
                        {/*title={"Cancel"}*/}
                    {/*/>*/}
                </View>
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
        height: Fonts.size.h1 + Metrics.statusBarHeight,
        paddingTop: Metrics.statusBarHeight,
    },
    scroll: {
        width: '100%',
        // height: hp(100) - Fonts.size.h1,
        backgroundColor: "white"
    },
    listContainer: {
        marginBottom: 0,
        marginTop: 0,
        borderTopWidth: 0
    },
    listItemContainer: {
        // height: hp(6),
        borderBottomColor: Colors.lightgrey,
        borderBottomWidth: 1,
    },
    buttonSec: {
        width: '100%',
        padding: Metrics.baseMargin,
        // flex: 1,
        flexDirection: 'row',
        // alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: Colors.backgroundGray,
        backgroundColor: Colors.backgroundEggplant,
    },
    buttonDefault: {
        marginStart: wp(5),
        marginEnd: wp(5),
        width: wp(25),
        height: hp(5.8),
        borderRadius: hp(1.8),
    },
    buttonTextDefault: {
        // fontFamily: Fonts.type.sfuiDisplayLight,
        fontSize: Fonts.size.button1,
        fontWeight: "400",
    },
    postButton: {
        backgroundColor: Colors.brandPrimary,
    },
    postButtonText: {
        color: 'white'
    },
    cancelButton: {
        backgroundColor: 'transparent',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: Colors.white,
    },
    cancelButtonText: {
        color: Colors.white,
        backgroundColor: Colors.transparent
    },
});

// let codePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_RESUME };
// export default codePush(codePushOptions)(PostMainScreen);

