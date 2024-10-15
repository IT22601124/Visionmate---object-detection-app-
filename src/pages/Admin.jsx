import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Logoview from '../component/Logoview';
import Insert from '../component/Insert';
import { useNavigation } from '@react-navigation/native';

const ObjectScienceList = () => {
  const [objects, setObjects] = useState([]);
  const [selectedObject, setSelectedObject] = useState(null); // Change to null to represent no selection
  const navigation = useNavigation(); 

  useEffect(() => {
    fetch('http://192.168.57.110:3000/object_science')
      .then((response) => response.json())
      .then((data) => setObjects(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleValueChange = (itemValue) => {
    const object = objects.find((obj) => obj.name === itemValue);
    setSelectedObject(object);
  };

  return (
    <View style={styles.container}>
    <TouchableOpacity style={styles.bt} onPress={() => navigation.navigate('DataTable')}>
        <Text style={{ color: 'white' }}>View All Data</Text>
      </TouchableOpacity>

      <Logoview />
      
      <Text style={styles.title}>SELECT OBJECT</Text>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedObject ? selectedObject.name : ''}
          onValueChange={handleValueChange}
          style={styles.picker}
        >
          {objects.map((object) => (
            <Picker.Item key={object._id} label={object.name} value={object.name} />
          ))}
        </Picker>
      </View>

      {selectedObject ? (
        <View style={styles.selectedContainer}>
          <Text style={styles.selectedText}>Selected Object:</Text>
          <Text style={styles.selectedDetail}>Name: {selectedObject.name}</Text>
          <Text style={styles.selectedDetail}>OId: {selectedObject.OId}</Text>
        </View>
      ) : null}

   <Insert selectedOId={selectedObject ? selectedObject.OId : ''} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20, // Slightly reduced font size
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#2C3E50', // Darker, more professional color
    marginTop: -10,
  },
  pickerContainer: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    overflow: 'hidden',
    marginVertical: 20,
    marginTop:-10
  },
  picker: {
    height: 50,
    width: '100%',
    fontSize: 18,
  },
  selectedContainer: {
    marginTop: 0,
    paddingTop:15,
    
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },bt:{
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    borderRadius: 8,
    width: 100,
    position: 'absolute', // Use absolute positioning
    top: -8, // Adjust the top position as needed
    right: 10,
    alignItems:'center',
    height:40
    
  
  },
  selectedText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007BFF',
    marginBottom: 5,
  },
  selectedDetail: {
    fontSize: 16,
    color: '#333',
  },
});
export default ObjectScienceList;
