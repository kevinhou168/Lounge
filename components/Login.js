import React, { useEffect, useState } from 'react';
import { TouchableOpacity, ImageBackground, TextInput, Text, View, StyleSheet, SafeAreaView } from 'react-native';
import { firebase } from '../firebase';


const LoginForm = () => {

    const [loginType, setLoginType] = useState('');
    const [nameField, setNameField] = useState('');
    const [passField, setPassField] = useState('');
    const [confirmPassField, setConfirmPassField] = useState('');
    const [signInError, setSignInError] = useState('');

    



    async function handleOnSubmit() {
        loginType == 'Login'?
        firebase.auth().signInWithEmailAndPassword(nameField, passField).catch(function (error) {
            setSignInError(error.message);
        })
        : passField != confirmPassField?
        firebase.auth().createUserWithEmailAndPassword(nameField, passField).catch(function (error) {
            setSignInError(error.message);
        }) :
        console.Log("Confirm Password not valid")
            
            
            
    }



    return (
        <View>
            {loginType == 'Login' &&
                <View>
                    <Text style={[styles.text, styles.center]}> Username </Text>
                    <TextInput autoFocus maxLength={40} style={[styles.textInput, styles.center]} value={nameField} placeholder="eg. John Doe" onChangeText={text => setNameField(text)} />
                    <Text style={[styles.text, styles.center]}> Password </Text>
                    <TextInput autoFocus maxLength={40} style={[styles.textInput, styles.center]} value={passField} placeholder="eg. John Doe" onChangeText={text => setPassField(text)} secureTextEntry />
                    <TouchableOpacity style={[styles.button, styles.center]} onPress={() => handleOnSubmit()}>
                        <Text style={[styles.buttonText, styles.center]}>Login</Text>
                    </TouchableOpacity>
                </View>
            }
            {loginType == 'SignUp' &&
                <View>
                    <Text style={[styles.text, styles.center]}> Username </Text>
                    <TextInput autoFocus maxLength={40} style={[styles.textInput, styles.center]} value={nameField} placeholder="eg. John Doe" onChangeText={text => setNameField(text)} />
                    <Text style={[styles.text, styles.center]}> Password </Text>
                    <TextInput autoFocus maxLength={40} style={[styles.textInput, styles.center]} value={passField} placeholder="eg. John Doe" onChangeText={text => setPassField(text)} secureTextEntry />
                    <Text style={[styles.text, styles.center]}> Confirm Password </Text>
                    <TextInput autoFocus maxLength={40} style={[styles.textInput, styles.center]} value={passField} placeholder="eg. John Doe" onChangeText={text => setConfirmPassField(text)} secureTextEntry />
                    <TouchableOpacity style={[styles.button, styles.center]} onPress={() => handleOnSubmit()}>
                        <Text style={[styles.buttonText, styles.center]}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            }
            {loginType == '' &&
                <View>
                    <TouchableOpacity style={[styles.button, styles.center]} onPress={() => setLoginType('Login')}>
                        <Text style={[styles.buttonText, styles.center]}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.center]} onPress={() => setLoginType('SignUp')}>
                        <Text style={[styles.buttonText, styles.center]}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            }

        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    header: {
        fontSize: 32,
        marginVertical: 60,
        color: '#F5F5DC',
    },
    text: {
        fontSize: 24,
        color: '#F5F5DC',
    },
    textInput: {
        height: 50,
        backgroundColor: '#F5F5DC',
        color: '#000000',
        marginVertical: 30,
        fontSize: 20,
        borderRadius: 5,
        width: '100%',
    },
    button: {
        backgroundColor: '#556B2F',
        borderRadius: 5,
        width: '100%',
        height: 40,
        maxWidth: 300,
    },
    buttonText: {
        fontSize: 20,
        color: '#F5F5DC',
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
    }
});

export default LoginForm;