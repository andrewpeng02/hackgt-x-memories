import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Input, Text, Button } from '@rneui/themed';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from '@firebase/auth';

const auth = getAuth();

export default function SignUpScreen({navigation}) {
  const [formInput, setFormInput] = useState({
    fullName: '',
    email: '',
    password: ''
  })
  const [error, setError] = useState('')

  const handlePress = async () => {
    // validation 

    try {
      const user = await createUserWithEmailAndPassword(auth, formInput.email, formInput.password)
      await updateProfile(user.user, {displayName: formInput.fullName})
      navigation.navigate('Log in');
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.createAccountText}>Create account</Text>
        <Text style={styles.createAccountDesc}>Sign up to get started!</Text>
      </View>
      <View style={{ width: "100%", marginTop: 80 }}>
        <Input label="Full name" 
                onChangeText={(text) => setFormInput({ ...formInput, fullName: text })}
        />
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
        <Button title="Sign up" onPress={handlePress} />
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