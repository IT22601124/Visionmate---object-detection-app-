// navigation/StackNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import App from '../App'; // Import the main component or entry point
import Menu from '../src/pages/Menu';
import Science from '../src/pages/Science';
import Admin from '../src/pages/Admin';
import DetectObject from '../src/pages/DetectObject';
import Adminpanel from '../src/pages/Adminpanel';
import DataTable from 'D:/node/vision/src/pages/Viewins.jsx';
import UpdateScreen from '../src/pages/update';
import jj from '../src/pages/jj';
import DataInsertForm from '../src/pages/insertdetails';
import SpeechDataView from '../src/pages/SpeechDataView';
import SpeechPlayer from '../src/pages/jj';
import Ap from '../src/pages/UploadImage';



const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={App} />
        <Stack.Screen name="Menu" component={Menu} />
        <Stack.Screen name="Science" component={Science} />
        <Stack.Screen name="Admin" component={Admin}/>
        <Stack.Screen name="DetectObject" component={DetectObject}/>
        <Stack.Screen name="Adminpanel" component={Adminpanel}/>
        <Stack.Screen name="DataTable" component={DataTable}/>   
        <Stack.Screen name="UpdateScreen" component={UpdateScreen} /> 
        <Stack.Screen name="jj" component={jj} /> 
        <Stack.Screen name="Text-to-speech" component={DataInsertForm} /> 
        <Stack.Screen name="SpeechDataView" component={SpeechDataView}/>
        <Stack.Screen name="SpeechPlayer" component={SpeechPlayer}/>
        <Stack.Screen name="upload" component={Ap}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
