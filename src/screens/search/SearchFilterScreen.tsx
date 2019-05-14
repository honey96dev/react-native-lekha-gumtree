import React from 'react';
import {LayoutAnimation, ScrollView, StyleSheet, Text, UIManager, View} from 'react-native';
import {NavigationScreenProps} from "react-navigation";
// @ts-ignore
import {ButtonGroup, Header, Icon, ListItem} from "react-native-elements";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
// @ts-ignore
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import Picker from 'react-native-picker';
import sprintfJs from 'sprintf-js';
// @ts-ignore
// import Spinner from 'react-native-loading-spinner-overlay';
import {Colors, Fonts, Metrics} from "../../themes";
import {ROUTES} from "../../routes";
import InfoText from "../../components/InfoText";
import BaseIcon from "../../components/BaseIcon";
import {api_list, fetch, GET} from "../../apis";
import MySpinner from "../../components/MySpinner";
import SearchMainScreen from "./SearchMainScreen";

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
    shiftTypes: ShiftType[],
    carType: string|number,
    priceModel: string|number,
    // priceModelIdx: number,
    shiftType: string|number,
    date: string,
    minPrice: number,
    maxPrice: number,
    // isPublicKey: number;
}

class SearchFilterScreen extends React.Component<Props, State> {
    // private animatedValue: Animated.Value;
    state = {
        doingLoading: false,
        randomKey: 0,
        carTypes: [],
        priceModels: [],
        shiftTypes: [],
        carType: 'All',
        priceModel: 'All',
        // priceModelIdx: 0,
        shiftType: 'All',
        date: 'All',
        minPrice: 0,
        maxPrice: 1000,
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
                let shiftTypes: CarType[] = data.shiftTypes;
                carTypes.unshift({id: -1, name: 'All', description: '', active: false});
                priceModels.unshift({id: -1, name: 'All', description: '', active: false});
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
                    carType: SearchMainScreen.carType,
                    shiftType: SearchMainScreen.shiftType,
                    date: SearchMainScreen.date,
                    priceModel: SearchMainScreen.priceModel,
                    minPrice: SearchMainScreen.minPrice,
                    maxPrice: SearchMainScreen.maxPrice,
                });
            })
            .catch(err => {
                console.log(err);
                this.animateState({
                    doingLoading: false,
                    carType: SearchMainScreen.carType,
                    shiftType: SearchMainScreen.shiftType,
                    date: SearchMainScreen.date,
                    priceModel: SearchMainScreen.priceModel,
                    minPrice: SearchMainScreen.minPrice,
                    maxPrice: SearchMainScreen.maxPrice,
                });
            });
    };

    saveFilters = () => {
        const {carType, shiftType, date, priceModel, minPrice, maxPrice} = this.state;
        SearchMainScreen.carType = carType;
        SearchMainScreen.shiftType = shiftType;
        SearchMainScreen.date = date;
        SearchMainScreen.priceModel = priceModel;
        SearchMainScreen.minPrice = minPrice;
        SearchMainScreen.maxPrice = maxPrice;
        this.props.navigation.navigate(ROUTES.SearchMain);
    };

    onPressCarType = () => {
        let data: string[] = [];
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

    onPressShiftType = () => {
        let data: string[] = [];
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

    onPressPriceModel = () => {
        let data: string[] = [];
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

    // onChangePriceModel = (selectedIndex: number) => {
    //     const {priceModels} = this.state;
    //     // @ts-ignore
    //     console.log('priceModels-saving', priceModels[selectedIndex], priceModels[selectedIndex].name);
    //     // @ts-ignore
    //     this.setState({priceModelIdx: selectedIndex, priceModel: priceModels[selectedIndex].name});
    // };

    onChangePriceRange = (data:number[]) => {
        this.setState({minPrice: data[0], maxPrice: data[1]});
    };

    render() {
        const {carType, priceModel, priceModels, shiftType, date, minPrice, maxPrice} = this.state;
        let priceButtons: string[] = [];
        let item: PriceModel;
        for (item of priceModels) {
            // @ts-ignore
            priceButtons.push(item.name);
        }
        // const priceModelIdx = this.state.priceModelIdx;
        // console.log('priceModelIdx', priceModelIdx, priceButtons);
        return (
            <View style={styles.container} key={this.state.randomKey}>
                <Header
                    containerStyle={styles.header}
                    backgroundColor={Colors.brandPrimary}
                    leftComponent={
                        <BaseIcon
                            containerStyle={{
                                backgroundColor: Colors.transparent,
                                height: hp(4),
                                width: hp(4),
                                borderRadius: hp(2),
                                // marginTop: hp(1),
                                marginEnd: 0,
                            }}
                            icon={{
                                size: Metrics.icons.large,
                                type: "material",
                                name: "arrow-back",
                                color: Colors.white}}
                            onPress={() => this.props.navigation.navigate(ROUTES.SearchMain)}
                            // style={{ height: hp(4), marginLeft: Metrics.baseMargin}}
                        />}
                    centerComponent={{
                        text: 'Filters',
                        style: {
                            color: '#fff',
                            fontSize: Fonts.size.h4,
                        }
                    }}
                    rightComponent={
                        <BaseIcon
                            containerStyle={{
                                backgroundColor: Colors.transparent,
                                height: hp(4),
                                width: hp(4),
                                borderRadius: hp(2),
                                // marginTop: hp(1),
                                marginEnd: 0,
                            }}
                            icon={{
                                size: Metrics.icons.large,
                                type: "material",
                                name: "done",
                                color: Colors.white}}
                            onPress={() => this.saveFilters()}
                            // style={{ height: hp(4), marginLeft: Metrics.baseMargin}}
                        />}
                />
                <ScrollView style={styles.scroll}>
                    <InfoText text="Filters"/>
                    <ListItem
                        title="Car Types"
                        containerStyle={styles.listItemContainer}
                        // titleStyle={{fontSize: Fonts.size.h4}}
                        onPress={this.onPressCarType}
                        rightIcon={
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Text>{carType}</Text>
                                <Icon
                                    type={"material"}
                                    name={"chevron-right"}
                                    color={Colors.darktext}
                                />
                            </View>
                        }/>
                    <ListItem
                        title="Shift Types"
                        containerStyle={styles.listItemContainer}
                        // titleStyle={{fontSize: Fonts.size.h4}}
                        onPress={this.onPressShiftType}
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
                    {/*<ButtonGroup*/}
                        {/*textStyle={{fontSize: Fonts.size.button2}}*/}
                        {/*selectedButtonStyle={{backgroundColor: Colors.brandPrimary}}*/}
                        {/*selectedIndex={priceModelIdx}*/}
                        {/*buttons={priceButtons}*/}
                        {/*onPress={this.onChangePriceModel}/>*/}
                    <ListItem
                        title="Price Model"
                        containerStyle={styles.listItemContainer}
                        // titleStyle={{fontSize: Fonts.size.h4}}
                        onPress={this.onPressPriceModel}
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
                    <Text style={{marginStart: Metrics.baseMargin, fontSize: Fonts.size.input}}>Price Range: {minPrice} - {maxPrice}</Text>
                    <MultiSlider
                        containerStyle={{marginStart: Metrics.baseMargin, marginEnd: Metrics.baseMargin, width: wp(100) - 2 * Metrics.baseMargin}}
                        values={[minPrice, maxPrice]}
                        sliderLength={wp(100) - 2 * Metrics.baseMargin}
                        onValuesChange={this.onChangePriceRange}
                        min={0}
                        max={1000}
                        step={5}
                        allowOverlap
                        snapped
                    />
                </ScrollView>
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
        height: Fonts.size.h1,
        paddingTop: 0,
    },
    userRow: {
        width: '100%',
        flexDirection: "row",
        alignItems: "center",
        // justifyContent: 'center',
        paddingBottom: Metrics.basePadding,
        paddingLeft: Metrics.basePadding * 2,
        paddingRight: Metrics.basePadding * 2,
        paddingTop: Metrics.basePadding,
    },
    userImage: {
        marginRight: Metrics.baseMargin,
    },
    signOutSec: {
        width: '100%',
        marginTop: Metrics.baseMargin,
        marginBottom: Metrics.baseMargin,
        // height: Metrics.section,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'center',
    },
    buttonDefault: {
        // height: hp(5.8),
        // borderRadius: hp(1.8),
    },
    signOutButton: {
        backgroundColor: 'transparent',
        // borderWidth: StyleSheet.hairlineWidth,
        // borderColor: Colors.snow,
        height: hp(4),
        borderRadius: hp(1.5),
    },
    buttonTextDefault: {
        // fontFamily: Fonts.type.sfuiDisplayLight,
        fontSize: Fonts.size.button1,
        fontWeight: "400",
    },
    signOutButtonText: {
        color: Colors.brandPrimary,
        backgroundColor: Colors.transparent
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
        height: hp(6),
        borderBottomColor: Colors.lightgrey,
        borderBottomWidth: 1,
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

export default SearchFilterScreen;

