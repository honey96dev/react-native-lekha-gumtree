import {Dimensions, Platform} from 'react-native';
import {heightPercentageToDP as hp} from "react-native-responsive-screen";

const { width, height } = Dimensions.get('window')
const IS_ANDROID = Platform.OS === "android";

// Used via Metrics.baseMargin
const metrics = {
  ANDROID_STATUSBAR: 24,
  DEVICE_HEIGHT: IS_ANDROID ? height - 24 : height,
  HEIGHT: IS_ANDROID ? height - 24 : height,
  DEVICE_WIDTH: width,
  WIDTH: width,
  marginHorizontal: hp(1.3),
  marginVertical: hp(1.3),
  section: hp(3),
  baseMargin: hp(1.3),
  basePadding: hp(1.3),
  baseDoublePadding: hp(2.6),
  baseDoubleMargin: hp(2.6),
  smallMargin: hp(0.7),
  doubleSection: hp(6),
  horizontalLineHeight: 1,
  screenWidth: width < height ? width : height,
  screenHeight: width < height ? height : width,
  navBarHeight: Platform.OS === "ios" ? 48 : 48,
  buttonRadius: 4,
  icons: {
    tiny: hp(1.6),
    small: hp(2),
    medium: hp(2.4),
    large: hp(3.2),
    xl: hp(5),
  },
  images: {
    small: hp(2.2),
    medium: hp(3.5),
    large: hp(5),
    logo: hp(25),
  }
};

export default metrics
