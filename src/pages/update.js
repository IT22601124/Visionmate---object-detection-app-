import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

const UpdateScreen = ({ route, navigation }) => {
  const { objectId } = route.params; // Get object_id passed from the previous screen
  const [instruction, setInstruction] = useState('');
  const [warnings, setWarnings] = useState('');

  useEffect(() => {
    // Fetch existing data for this object_id
    fetch(`http://192.168.57.110:3000/instructions/${objectId}`)
      .then((response) => response.json())
      .then((data) => {
        setInstruction(data.instruction || '');
        setWarnings(data.warnings || '');
      })
      .catch((error) => console.error('Error fetching instruction:', error));
  }, [objectId]);

  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://192.168.57.110:3000/instructions/${objectId}`, {
        method: 'PUT', // Use PUT to update the data
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          instruction,
          warnings,
        }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Instruction updated successfully!');
        navigation.goBack(); // Navigate back after success
      } else {
        Alert.alert('Error', 'Failed to update instruction.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to connect to the server.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Instruction</Text>

      <Text style={styles.label}>Instruction:</Text>
      <TextInput
        style={styles.input}
        value={instruction}
        onChangeText={(text) => setInstruction(text)}
      />

      <Text style={styles.label}>Warnings:</Text>
      <TextInput
        style={styles.input}
        value={warnings}
        onChangeText={(text) => setWarnings(text)}
      />

      <Button title="Update" onPress={handleUpdate} />
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
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 16,
    borderRadius: 4,
  },
});

export default UpdateScreen;
