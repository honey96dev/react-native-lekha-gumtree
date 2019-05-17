import React, {Component} from "react";
import AppContainer from "./src/routes";
import codePush from 'react-native-code-push';

/**
 * Main App
 */
class App extends Component<{}> {
  render() {
    return <AppContainer />;
  }
}

let codePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_RESUME };
export default codePush(codePushOptions)(App);
