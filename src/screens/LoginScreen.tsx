import React, {Component} from 'react';
import {UIManager, LayoutAnimation, Alert, View, Button, Text} from 'react-native';
import {NavigationScreenProps} from "react-navigation";
import {authorize, refresh, revoke} from 'react-native-app-auth';

UIManager.setLayoutAnimationEnabledExperimental &&
UIManager.setLayoutAnimationEnabledExperimental(true);

interface MyProps {
}

type Props = MyProps & NavigationScreenProps;

interface State {
    hasLoggedInOnce: boolean;
    accessToken?: string;
    accessTokenExpirationDate?: string;
    refreshToken?: string;
    scopes?: string[];
};

const config = {
    issuer: 'https://identity.lekha.com.au',
    clientId: 'lekha-mobile-app',
    redirectUrl: 'com.lekha.mobile:/callback',
    scopes: ['openid', 'profile', 'email', 'offline_access', 'test-mobile-api']

    // serviceConfiguration: {
    //   authorizationEndpoint: 'https://demo.identityserver.io/connect/authorize',
    //   tokenEndpoint: 'https://demo.identityserver.io/connect/token',
    //   revocationEndpoint: 'https://demo.identityserver.io/connect/revoke'
    // }
};

export default class App extends Component<Props, State> {
    state = {
        hasLoggedInOnce: false,
        accessToken: '',
        accessTokenExpirationDate: '',
        refreshToken: '',
        scopes: [],
    };

    animateState(nextState: State | Pick<State, never> | null, delay: number = 0) {
        setTimeout(() => {
            this.setState(() => {
                LayoutAnimation.easeInEaseOut();
                return nextState;
            });
        }, delay);
    }

    authorize = async () => {
        try {
            const authState = await authorize(config);

            this.animateState(
                {
                    hasLoggedInOnce: true,
                    accessToken: authState.accessToken,
                    accessTokenExpirationDate: authState.accessTokenExpirationDate,
                    refreshToken: authState.refreshToken,
                    scopes: authState.scopes
                },
                500
            );
        } catch (error) {
            Alert.alert('Failed to log in', error.message);
        }
    };

    refresh = async () => {
        try {
            const authState = await refresh(config, {
                refreshToken: this.state.refreshToken
            });

            this.animateState({
                accessToken: authState.accessToken || this.state.accessToken,
                accessTokenExpirationDate:
                    authState.accessTokenExpirationDate || this.state.accessTokenExpirationDate,
                refreshToken: authState.refreshToken || this.state.refreshToken
            });
        } catch (error) {
            Alert.alert('Failed to refresh token', error.message);
        }
    };

    revoke = async () => {
        try {
            await revoke(config, {
                tokenToRevoke: this.state.accessToken,
                sendClientId: true
            });
            this.animateState({
                accessToken: '',
                accessTokenExpirationDate: '',
                refreshToken: ''
            });
        } catch (error) {
            Alert.alert('Failed to revoke token', error.message);
        }
    };

    render() {
        const {state} = this;
        return (
            <View>
                {!!state.accessToken ? (
                    <View>
                        <Text>accessToken</Text>
                        <Text>{state.accessToken}</Text>
                        <Text>accessTokenExpirationDate</Text>
                        <Text>{state.accessTokenExpirationDate}</Text>
                        <Text>refreshToken</Text>
                        <Text>{state.refreshToken}</Text>
                        <Text>scopes</Text>
                        <Text>{state.scopes.join(', ')}</Text>
                    </View>
                ) : (
                    <Text>{state.hasLoggedInOnce ? 'Goodbye.' : 'Hello, stranger.'}</Text>
                )}

                <View>
                    {!state.accessToken ? (
                        <Button onPress={this.authorize} title={"Authorize"} color="#DA2536"/>
                    ) : null}
                    {!!state.refreshToken ? (
                        <Button onPress={this.refresh} title={"Refresh"} color="#24C2CB"/>
                    ) : null}
                    {!!state.accessToken ? (
                        <Button onPress={this.revoke} title={"Revoke"} color="#EF525B"/>
                    ) : null}
                </View>
            </View>
        );
    }
}
