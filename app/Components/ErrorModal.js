import { Modal, Pressable, Text, TouchableHighlight, View } from "react-native";
import { t, tailwind, tw } from "react-native-tailwindcss";

export default function ErrorModal ({ animationForModal, isVisible, onClose, onPressingRedButton, textForButton, textForModal }) {
    return (
        <Modal animationType={animationForModal || "fade"} onRequestClose={onClose} transparent={true} visible={isVisible}>
            <View style={[[ t.flex, t.flexCol, tw.justifyCenter, tw.pX6, tw.wFull, tw.hFull ], { backgroundColor: "#00000075"}]}>
                <View style={[ t.flex, t.flexCol, tw.h50, tw.wFull, tw.bgWhite, tw.border, tw.borderGray300, tw.pT5, tw.pB6, tailwind.roundedLg, t.shadow2xl ]}>
                    <View style={[ t.flex, t.flexCol, tw.wFull, tw.h16, tw.justifyCenter ]}>
                        <Text style={[ t.textCenter, tw.pX4, tw.wFull, t.flex, t.flexCol, tw.justifyCenter ]}>
                            {textForModal}
                        </Text>
                    </View>
                    <View style={[ t.flex, t.flexRow, tw.wFull, tw.h12, tw.justifyAround, tw.mT3 ]}>
                        <TouchableHighlight underlayColor="#ff6666" style={[ tw.w2_3, t.flex, t.flexCol, tw.justifyCenter, tw.border, tw.borderRed700, tailwind.roundedLg, tw.bgRed700 ]} onPress={onClose}>
                            <Text style={[ t.textCenter, t.fontBold, t.textWhite ]}>{textForButton}</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </View>
        </Modal>
    )
}