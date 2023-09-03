import { Modal, Text, TouchableHighlight, View } from "react-native";
import { t, tailwind, tw } from "react-native-tailwindcss";
import { supabase } from "../supabase/client";
import { v4 as uuidv4 } from "uuid";

export default function ModalTemplate ({ actionButtonBorder, actionButtonColor, animationForModal, isVisible, onClose, onNavigateAfterAction, onPressingRedButton, restaurantId, textForButton, textForModal, userId }) {

    let request_id;
    async function sendRequest () {
        request_id = uuidv4();
        try {
            const { data, error } = await supabase.from("ALO-request").insert({ user_id: userId, restaurant_id: restaurantId, request_id: request_id });
            onNavigateAfterAction();
        } catch (err) {
            console.log(err);
        }
    }

    function actionButtonHandle () {
        if (textForModal === "") {
            sendRequest();
        }
    }

    return (
        <Modal animationType={animationForModal || "fade"} onRequestClose={onClose} transparent={true} visible={isVisible}>
            <View style={[[ t.flex, t.flexCol, tw.justifyCenter, tw.pX6, tw.wFull, tw.hFull ], { backgroundColor: "#00000075"}]}>
                <View style={[ t.flex, t.flexCol, tw.h50, tw.wFull, tw.bgWhite, tw.border, tw.borderGray300, tw.pT4, tw.pB8, tailwind.roundedLg, t.shadow2xl ]}>
                    <View style={[ t.flex, t.flexCol, tw.wFull, tw.h16, tw.justifyCenter ]}>
                        <Text style={[ t.textCenter, tw.pX4, tw.wFull, t.flex, t.flexCol, tw.justifyCenter ]}>
                            {textForModal}
                        </Text>
                    </View>
                    <View style={[ t.flex, t.flexRow, tw.wFull, tw.h12, tw.justifyAround, tw.mT3 ]}>
                        <TouchableHighlight underlayColor="#ff6666" style={[ tw.w1_3, t.flex, t.flexCol, tw.justifyCenter, tw.border, tailwind.roundedLg, actionButtonColor, actionButtonBorder ]} onPress={onPressingRedButton}>
                            <Text style={[ t.textCenter, t.fontBold, t.textWhite ]}>{textForButton}</Text>
                        </TouchableHighlight>
                        <TouchableHighlight underlayColor="#ccc" style={[ tw.w1_3, t.flex, t.flexCol, tw.justifyCenter, tw.border, tw.borderGray200, tailwind.roundedLg ]} onPress={onClose}>
                            <Text style={[ t.textCenter, t.fontBold ]}>Cancelar</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </View>
        </Modal>
    )
}