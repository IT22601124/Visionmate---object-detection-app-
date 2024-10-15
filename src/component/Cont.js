import { View, Image, StyleSheet } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { GestureDetector, GestureHandlerRootView, TapGestureHandler ,LongPressGestureHandler } from 'react-native-gesture-handler';

const Cont = () => {
    const navigation = useNavigation();

    const handleSingleTap = () => {
        navigation.navigate('Menu');
    };

    const handleDoubleTap = () => {
        navigation.navigate('DetectObject');
    };

    const handleLongPress = () => {
        navigation.navigate('Adminpanel');
    };

    return (
        <View style={styles.micee}>
             <GestureHandlerRootView style={{ flex: 1 }} >
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <TapGestureHandler
                    numberOfTaps={1}
                    onActivated={handleSingleTap}
                >
                    <TapGestureHandler
                        numberOfTaps={2}
                        onActivated={handleDoubleTap}
                    >
                        <TapGestureHandler
                            numberOfTaps={3}
                            onActivated={handleLongPress}
                        ><LongPressGestureHandler
                        onActivated={handleLongPress}
                        minDurationMs={800} // Duration to trigger long press (in milliseconds)
                    >
                            <Image style={styles.mice} source={require('../assets/logo/mice.png')} />
                            </LongPressGestureHandler>
                        </TapGestureHandler>
                    </TapGestureHandler>
                </TapGestureHandler>
            </View>
        </GestureHandlerRootView>
        </View>
       
    );
};

export default Cont;

const styles = StyleSheet.create({
    container: {},
    mice: {
        width: 500,
        height: 500,
        
    },
    micee:{
        paddingTop:200,
        alignItems:'center'
    }
});
