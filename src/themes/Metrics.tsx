import {Dimensions, Platform} from 'react-native';

const { width, height } = Dimensions.get('window')
const IS_ANDROID = Platform.OS === "android";

// Used via Metrics.baseMargin
const metrics = {
  ANDROID_STATUSBAR: 24,
  DEVICE_HEIGHT: IS_ANDROID ? height - 24 : height,
  HEIGHT: IS_ANDROID ? height - 24 : height,
  DEVICE_WIDTH: width,
  WIDTH: width,
  marginHorizontal: 10,
  marginVertical: 10,
  section: 25,
  baseMargin: 10,
  basePadding: 10,
  baseDoublePadding: 10,
  doubleBaseMargin: 20,
  smallMargin: 5,
  doubleSection: 50,
  horizontalLineHeight: 1,
  screenWidth: width < height ? width : height,
  screenHeight: width < height ? height : width,
  navBarHeight: Platform.OS === "ios" ? 48 : 48,
  buttonRadius: 4,
  icons: {
    tiny: 15,
    small: 20,
    medium: 30,
    large: 45,
    xl: 50
  },
  images: {
    small: 20,
    medium: 40,
    large: 60,
    logo: 200
  }
};

export default metrics
