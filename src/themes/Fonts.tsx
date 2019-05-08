import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

//Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

const scale = (size: number) => (width / guidelineBaseWidth) * size;
const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;
const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

const type = {
  base: "Avenir-Book",
  bold: "Avenir-Black",
  emphasis: "HelveticaNeue-Italic",
  sfuiDisplayBold: "SFUIDisplay-Bold",
  sfuiDisplaySemibold: "SFUIDisplay-Semibold",
  sfuiDisplayRegular: "SFUIDisplay-Regular",
  sfuiDisplayLight: "SFUIDisplay-Light",
  sfuiDisplayMedium: "SFUIDisplay-Medium",
  helveticaNeueLight: "HelveticaNeue-Light",
  helveticaNeueBold: "HelveticaNeue-Bold",
  helveticaNeueRegular: "HelveticaNeue-Regular",
  helveticaRegular: "Helvetica",
  helveticaBold: "Helvetica-Bold",
  robotoRegular: "Roboto-Regular",
  robotoMedium: "Roboto-Medium"
};

const size = {
  button1: hp(2.2),
  h1: hp(6),
  h2: 34,
  h3: hp(3.3),
  h4: hp(2.7),
  h5: hp(2.2),
  h6: 19,
  input: hp(2),
  regular: hp(1.8),
  medium: 14,
  small: 12,
  tiny: 8.5
};

const style = {
  h1: {
    fontFamily: type.base,
    fontSize: size.h1
  },
  h2: {
    fontWeight: "bold",
    fontSize: size.h2
  },
  h3: {
    fontFamily: type.emphasis,
    fontSize: size.h3
  },
  h4: {
    fontFamily: type.base,
    fontSize: size.h4
  },
  h5: {
    fontFamily: type.base,
    fontSize: size.h5
  },
  h6: {
    fontFamily: type.emphasis,
    fontSize: size.h6
  },
  normal: {
    fontFamily: type.base,
    fontSize: size.regular
  },
  description: {
    fontFamily: type.base,
    fontSize: size.medium
  }
};

export default {
  type,
  size,
  style,
  scale,
  verticalScale,
  moderateScale
};
