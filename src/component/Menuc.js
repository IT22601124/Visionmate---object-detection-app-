import { View, Image, StyleSheet ,TouchableOpacity,Text} from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { GestureHandlerRootView, TapGestureHandler, LongPressGestureHandler } from 'react-native-gesture-handler';

const Cont = () => {
    const navigation = useNavigation();

    const handleSingleTap = () => {
        navigation.navigate('Science');
    };

    const handleDoubleTap = () => {
        navigation.navigate('Admin');
    };

    const handleLongPress = () => {
        navigation.navigate('DetectObject');
    };

    return (
        <GestureHandlerRootView style={styles.container}>
            <View style={styles.micee}>
                <TapGestureHandler numberOfTaps={1} onActivated={handleSingleTap}>
                    <TapGestureHandler numberOfTaps={2} onActivated={handleDoubleTap}>
                        <LongPressGestureHandler onActivated={handleLongPress} minDurationMs={800}>
                            <Image style={styles.mice} source={require('../assets/images/eye.png')} />
                        </LongPressGestureHandler>
                    </TapGestureHandler>
                </TapGestureHandler>
            </View>
              
        </GestureHandlerRootView>
    );
};

export default Cont;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E0E0E0', // Set the background color at the top-level container
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop:500,
        
    },
    micee: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        paddingBottom:500
    },
    mice: {
        width: 500, // Adjust image size if needed
        height: 500,
    },buttonContainer:{
        alignItems:'center',

    }
});
