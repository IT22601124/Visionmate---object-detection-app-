import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';

const SpeechDataView = () => {
  const [speechData, setSpeechData] = useState([]);

  useEffect(() => {
    // Fetch the speech data when the component mounts
    const fetchData = async () => {
      try {
        const response = await axios.get('http://192.168.57.110:3000/speech');
        setSpeechData(response.data);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch speech data');
      }
    };

    fetchData();
  }, []);

  // Function to handle delete
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://192.168.57.110:3000/speech/${id}`);
      if (response.status === 200) {
        // Update UI after delete, using the custom id
        setSpeechData(speechData.filter(item => item.id !== id)); // Change item._id to item.id
        Alert.alert('Success', 'Data deleted successfully');
      } else {
        Alert.alert('Error', 'Failed to delete data');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to delete data');
    }
  };
  
  

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>ID: {item.id}</Text>
      <Text style={styles.itemText}>Speech: {item.speech}</Text>
      <TouchableOpacity style={styles.deleteButton} onPress={() => {
  console.log('Deleting speech with id:', item.id); // Debugging line
  handleDelete(item.id)
}}>
  <Text style={styles.deleteButtonText}>Delete</Text>
</TouchableOpacity>

    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Speech Data</Text>
      {speechData.length > 0 ? (
        <FlatList
          data={speechData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : (
        <Text>No data available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  itemContainer: {
    padding: 20,
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    marginBottom: 15,
  },
  itemText: {
    fontSize: 18,
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SpeechDataView;
