/**
 * Created by Ranjeet on 12/3/18.
 */
//@flow
import React, {Component} from 'react';
import {cloneDeep} from "lodash";
import {DayAvailability} from '../../tools/G';
// import {Button, Header, Icon, Text} from 'react-native-elements';
import {Modal, StyleSheet, View} from 'react-native';
import { Text, Switch, Icon, Button, Left, Right, Body, Title} from 'native-base';
import {Avatar, Header} from 'react-native-elements';
import {Col, Grid, Row} from "react-native-easy-grid";

import {Colors, Fonts, Metrics} from "../../themes";
import BaseIcon from "../../components/BaseIcon";
import {heightPercentageToDP as hp} from "react-native-responsive-screen";
import G from "../../tools/G";

interface Props {
    defaultVisible?: boolean,
    items?: DayAvailability[],
    onChange: (selected: DayAvailability[]) => void,
    // @ts-ignore
    children: Element<typeof Text> | Element<typeof Button> | Element<typeof Icon>,
    title?: string,
};

interface State {
    visible: boolean,
    items: DayAvailability[],
};

export type WeekDayRowProps = {
    availability: DayAvailability,
    onToggle: (date: number, day: boolean, night: boolean) => void
};

const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];

const getDefaultAvailability = (): DayAvailability[] => {
    let ret: DayAvailability[]= [];
    for(let i:number =0; i<7; i++){
        ret.push({
            day:false,
            night: false,
            dayOfWeek: i,
        })
    }
    return ret;
};

export interface TriggerProps {
    onPress?: () => void;
    onFocus?: () => void;
};

export const WeekDayRow = (props: WeekDayRowProps) => {
    let avail: DayAvailability = props.availability;
    return <Row style={styles.row}>
        <Col style={styles.col}>
            <Text>{days[avail.dayOfWeek]}</Text>
        </Col>
        <Col style={styles.col}>
            <Switch value={avail.day} onValueChange={() => props.onToggle(avail.dayOfWeek, !avail.day, avail.night)} />
        </Col>
        <Col style={styles.col}>
            <Switch value={avail.night} onValueChange={() => props.onToggle(avail.dayOfWeek, avail.day, !avail.night)} />
        </Col>
    </Row>;
};

export default class SearchLocationModal extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        const defaultAvail: DayAvailability[]=getDefaultAvailability();
        let items = this.getDefaultItems();
        this.state = {
            visible: props.defaultVisible || false,
            items: items,
        };
    }

    getDefaultItems = () => {
        let items = this.props.items;
        //check if items are an empty array
        //or items is null then generate default avialability array
        if (!items || items.length <= 0) {
            items = getDefaultAvailability();
        }
        return items;
    }

    onDone = () => {
        //User done with Changing Shift types want to send back data
        // console.log('User triggered the on change callback in WeekDayPicker control');
        // console.info(this.state.items);
        this.props.onChange(this.state.items);
        this.onToggleModal();
    }

    onToggleModal = () => {
        //If we are enabling/Disabling the Modal lets restore the items also
        var items = this.getDefaultItems();
        this.setState({ visible: !this.state.visible, items: items });
    };

    onItemToggle = (dayOfWeek: number, day: boolean, night: boolean): void => {
        let arr = cloneDeep(this.state.items);
        const index= this.state.items.findIndex(i => i.dayOfWeek == dayOfWeek);
        if(index>=0){
            arr[index] = {dayOfWeek: dayOfWeek, day: day, night: night};
            this.setState({items: arr});
        }
    };

    render() {
        const {
            firstName,
            lastName,
            email,
            phone,
        } = G.UserProfile;
        let avatar: string = "";
        if (firstName) {
            avatar += firstName.charAt(0).toUpperCase();
        }
        if (lastName) {
            avatar += lastName.charAt(0).toUpperCase();
        }
        let shift: number = 0;
        const newProps: TriggerProps = {};
        newProps.onPress = this.onToggleModal;
        // console.log('availability-render', this.props.items);
        return <View>
            {React.cloneElement(this.props.children, newProps)}
            <Modal
                animationType="slide"
                transparent={false}
                visible={this.state.visible}>
                <Header
                    containerStyle={styles.header}
                    backgroundColor={Colors.brandPrimary}
                    centerComponent={{
                        text: this.props.title || "Select Availability",
                        style: {
                            color: '#fff',
                            fontSize: Fonts.size.h4,
                        }
                    }}
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
                            onPress={() => this.onToggleModal()}
                            // style={{ height: hp(4), marginLeft: Metrics.baseMargin}}
                        />}
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
                            onPress={() => this.onDone()}
                            // style={{ height: hp(4), marginLeft: Metrics.baseMargin}}
                        />}
                />
                <View style={styles.userRow}>
                    <View style={styles.userImage}>
                        <Avatar size="large" rounded title={avatar}/>
                    </View>
                    <View>
                        {(!!firstName || !!lastName) && <Text style={{fontSize: Fonts.size.regular}}>
                            {firstName} {lastName}
                        </Text>}
                        {!!phone && <Text style={{color: "gray", fontSize: Fonts.size.regular}}>{phone}</Text>}
                        {!!email && <Text style={{color: "gray", fontSize: Fonts.size.regular}}>{email}</Text>}
                    </View>
                </View>
                <Grid style={styles.grid}>
                    <Row style={styles.headerRow}>
                        <Col style={styles.col}>
                            <Text style={styles.headerText}>Weekday</Text>
                        </Col>
                        <Col style={styles.col}>
                            <Text style={styles.headerText}>Day</Text>
                        </Col>
                        <Col style={styles.col}>
                            <Text style={styles.headerText}>Night</Text>
                        </Col>
                    </Row>
                    {this.state.items.map((item, index) => {
                        return <WeekDayRow key={`week-day-row-for-${item.dayOfWeek}`} onToggle={this.onItemToggle} availability={item} />;
                    })}
                </Grid>
            </Modal>
        </View>;
    }
}

const styles = StyleSheet.create({
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
    grid: {
        flex: 1,
    },
    header: {
        height: Fonts.size.h1,
        paddingTop: 0,
    },
    headerRow: {
        borderBottomColor: Colors.lightgrey,
        borderBottomWidth: 1,
        flex: 1,
        justifyContent: "center",
    },
    row: {
        borderBottomColor: Colors.lightgrey,
        borderBottomWidth: 1,
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        borderRadius: 0,
    },
    col: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    headerText: {
        color: Colors.brandPrimary,
        fontSize: Fonts.size.h6,
    }
});
