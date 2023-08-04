import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { t, tw, tailwind } from "react-native-tailwindcss";
import { supabase } from "../supabase/client";

export default function UserProfile () {


    const [user, setUser] = useState();
    const [restaurants, setRestaurants] = useState();

    const [usersInfo, setUsersInfo] = useState()

    let email = "manuelaag99@gmail.com"
    useEffect(() => {
        async function fetchData () {
            try {
                const { data, error } = await supabase.from("ALO-users-db").select("*").eq("user_email", email)
                setUsersInfo(data[0])
            } catch (err) {
                console.log(err)
            }
        }
        fetchData();
    }, []);  

    console.log(usersInfo)

    const USERPROTOTYPE = {
        user_email: "manuelaag99@gmail.com",
        user_username: "manuelaag99",
        user_display_name: "Manuel Alanis"
    }

    useEffect(() => {
        setUser(usersInfo)
        if (usersInfo) {
            setRestaurants(usersInfo.user_restaurants);
        }
    }, [])

    const RESTAURANTS = ["JARED", "MEXIAS TACOS"];
    const insets = useSafeAreaInsets();
    if (!user) {
        return (
            <View style={[ tw.flex, tw.flexRow, tw.justifyCenter, tw.wFull ]}>
                <Text style={[ t.textCenter, tw.mXAuto, tw.mY4, tw.wFull, t.fontBold ]}>Disculpa, hubo un error.</Text>
            </View>
        )
    } else {
        return (
            <View style={[[ tw.flex, tw.flexCol, t.pX5, tw.hScreen, tw.wScreen, t.bgWhite ], { paddingTop: insets.top }]}>

                <View style={[ tw.flex, tw.flexCol, tw.justifyCenter, tw.wFull, tw.hFull, tw.mXAuto ]}>
                    <View style={[ tw.flex, tw.flexRow, tw.justifyCenter, tw.wFull, tw.mY6 ]}>
                        <Text style={[ t.textCenter, tw.mXAuto, tw.wFull, t.fontBold, t.text2xl, t.italic ]}>A LA ORDEN</Text>
                    </View>

                    <View style={[ tw.flex, tw.flexCol, tw.justifyCenter, tw.wFull, tw.bgWhite, tw.border2, tw.borderGray300, tailwind.roundedLg, tw.mY5 ]}>
                        <View style={[ tw.flex, tw.flexRow, tw.justifyCenter, tw.wFull ]}>
                            <Text style={[ t.textCenter, tw.mXAuto, tw.mY4, tw.wFull, t.fontBold, t.text2xl ]}>Bienvenido, {user.user_display_name}</Text>
                        </View>
                    </View>
                    
                    <View style={[ tw.flex, tw.flexCol, tw.justifyCenter, tw.wFull, tw.bgWhite, tw.border2, tw.borderGray300, tailwind.roundedLg, tw.mY5 ]}>
                        <View style={[ tw.flex, tw.flexRow, tw.justifyCenter, tw.wFull ]}>
                            <Text style={[ t.textCenter, tw.mXAuto, tw.mY4, tw.wFull, t.fontBold ]}>MIS RESTAURANTES</Text>
                        </View>
                        {restaurants && restaurants.map((restaurant, index) => {
                            return (
                                <View key={index} style={[ tw.flex, tw.flexRow, tw.wFull ]}>
                                    <Text style={[ tw.w4_5, tw.mY4, tw.pL4 ]}>
                                        {restaurant}
                                    </Text>
                                    <Link href="" style={[ tw.w1_5, tw.mY4, t.textCenter, t.fontBold ]}>
                                        Ver
                                    </Link>
                                </View>
                            )
                        })}
                        {restaurants && <View style={[ tw.flex, tw.flexRow, tw.justifyCenter, tw.wFull ]}>
                            <Text style={[ t.textCenter, tw.mXAuto, tw.mY4, tw.wFull, t.fontBold ]}>Agregar otro restaurante</Text>
                        </View>}
                        {!restaurants && <View style={[ tw.flex, tw.flexRow, tw.justifyCenter, tw.wFull ]}>
                            <Text style={[ t.textCenter, tw.mXAuto, tw.mY4, tw.wFull, t.fontBold ]}>Aún no tienes restaurantes. Haz clic aquí para agregar uno</Text>
                        </View>}
                    </View>
    
                    <View style={[ tw.flex, tw.flexCol, tw.justifyCenter, tw.wFull, tw.bgRed600, tw.border2, tw.borderGray300, tailwind.roundedLg, tw.mY5 ]}>
                        <View style={[ tw.flex, tw.flexRow, tw.justifyCenter, tw.wFull ]}>
                            <Text style={[ t.textCenter, tw.mXAuto, tw.mY4, tw.wFull, t.fontBold, t.textWhite ]}>CERRAR SESIÓN</Text>
                        </View>
                    </View>

                    <View style={[ tw.flex, tw.flexCol, tw.justifyCenter, tw.wFull, tw.bgRed800, tw.border2, tw.borderGray300, tailwind.roundedLg, tw.mY5 ]}>
                        <View style={[ tw.flex, tw.flexRow, tw.justifyCenter, tw.wFull ]}>
                            <Text style={[ t.textCenter, tw.mXAuto, tw.mY4, tw.wFull, t.fontBold, t.textWhite ]}>ELIMINAR MI CUENTA</Text>
                        </View>
                    </View>
    
                </View>
                
            </View>
        )
    }
}