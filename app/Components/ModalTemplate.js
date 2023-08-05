import { Modal, Pressable, Text, TouchableHighlight, View } from "react-native";
import { t, tailwind, tw } from "react-native-tailwindcss";

export default function ModalTemplate ({ isVisible, onClose }) {
    return (
        <Modal animationType="slide" onRequestClose={onClose} transparent={true} visible={isVisible}>
            <View style={[ t.flex, t.flexCol, tw.justifyCenter, tw.pX6, tw.wFull, tw.hFull ]}>
                <View style={[ t.flex, t.flexCol, tw.h50, tw.wFull, tw.bgWhite, tw.border, tw.borderGray300, tw.pT4, tw.pB8, tailwind.roundedLg, t.shadow2xl ]}>
                    <View style={[ t.flex, t.flexCol, tw.wFull, tw.h16, tw.justifyCenter ]}>
                        <Text style={[ t.textCenter, tw.pX4, tw.wFull, t.flex, t.flexCol, tw.justifyCenter ]}>
                            ¿Seguro de que quieres eliminar este restaurante? Esto no se puede deshacer.
                        </Text>
                    </View>
                    <View style={[ t.flex, t.flexRow, tw.wFull, tw.h12, tw.justifyAround, tw.mT3 ]}>
                        <Pressable style={[ tw.w1_3, t.flex, t.flexCol, tw.justifyCenter, tw.border, tw.borderGray200, tailwind.roundedLg, tw.bgRed700 ]} onPress={onClose}>
                            <Text style={[ t.textCenter, t.fontBold, t.textWhite ]}>Eliminar</Text>
                        </Pressable>
                        <Pressable style={[ tw.w1_3, t.flex, t.flexCol, tw.justifyCenter, tw.border, tw.borderGray200, tailwind.roundedLg ]} onPress={onClose}>
                            <Text style={[ t.textCenter, t.fontBold ]}>Cancelar</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    )
}