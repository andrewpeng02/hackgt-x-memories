import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Input, Text, Button } from '@rneui/themed';
import { getAuth, signInWithEmailAndPassword } from '@firebase/auth';

const auth = getAuth();

export default function SignInScreen({navigation}) {
  const [formInput, setFormInput] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')

  const handlePress = async () => {
    // validation 

    try {
      await signInWithEmailAndPassword(auth, formInput.email, formInput.password)
      navigation.navigate('Log in');
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.createAccountText}>Welcome back</Text>
        <Text style={styles.createAccountDesc}>Sign in to continue</Text>
      </View>
      <View style={{ width: "100%", marginTop: 80 }}>
        <Input label="Email" 
                onChangeText={(text) => setFormInput({ ...formInput, email: text })}
        />
        <Input label="Password" 
                secureTextEntry={true}
                onChangeText={(text) => setFormInput({ ...formInput, password: text })}
        />
        {error && <Text style={styles.errorLabel}>{error}</Text>}
      </View>
      <View style={{ marginTop: 30 }}>
        <Button title="Sign in" onPress={handlePress} />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c4dbc4',
    // justifyContent: 'center',
    padding: 20,
    paddingTop: 40
  },
  createAccountText: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10
  },
  createAccountDesc: {
    fontSize: 20,
  },
  errorLabel: {
    color: 'red',
    textAlign: 'center'
  }
});