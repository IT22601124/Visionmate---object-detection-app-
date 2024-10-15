import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const DataTable = () => {
  const [tableData, setTableData] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetch('http://192.168.57.110:3000/s_instructions')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text(); // Read the response as text
      })
      .then((text) => {
        console.log('Raw response:', text);
        try {
          const data = JSON.parse(text); // Attempt to parse JSON
          setTableData(data);
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleDelete = async (objectId) => {
    console.log('Attempting to delete object with ID:', objectId); // Debugging line
    try {
      const response = await fetch(`http://192.168.57.110:3000/instructions/${objectId}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        Alert.alert('Success', 'Item deleted successfully!');
        setTableData((prevData) => prevData.filter((item) => item.object_id !== objectId));
      } else {
        Alert.alert('Error', 'Failed to delete item.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to connect to the server.');
    }
  };
  
  

  const handleUpdate = (item) => {
    navigation.navigate('UpdateScreen', { objectId: item.object_id });
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Instructions</Text>
      <ScrollView>
        {tableData.map((item, index) => (
          <View style={styles.card} key={index}>
            <Text style={styles.label}>Object ID:</Text>
            <Text style={styles.value}>{item.object_id}</Text>

            <Text style={styles.label}>Instruction:</Text>
            <Text style={styles.value}>{item.instruction}</Text>

            <Text style={styles.label}>Warnings:</Text>
            <Text style={styles.value}>{item.warnings || 'No warnings'}</Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.buttonDelete}
                onPress={() => handleDelete(item.object_id)}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonUpdate}
                onPress={() => handleUpdate(item)}
              >
                <Text style={styles.buttonText}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#2C3E50',
  },
  card: {
    backgroundColor: '#FFF',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // Adds a shadow for elevation effect
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonDelete: {
    backgroundColor: '#FF5A5F', // Red color for delete button
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  buttonUpdate: {
    backgroundColor: '#007BFF', // Blue color for update button
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default DataTable;
