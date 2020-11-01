import React, { useState, useEffect } from 'react';
import { TouchableOpacity, TextInput, ImageBackground, Text, View, StyleSheet, SafeAreaView } from 'react-native';
import { firebase } from "../firebase";
import LogoutButton from './LogoutButton';

const Teams = ({ auth, teamId, setTeamId, setRoute }) => {
    const [teams, setTeams] = useState([]);
    const db = firebase.database().ref('users/' + auth.uid + "/teams");

    useEffect(() => {
        const handleData = snap => {
            if (snap.val()) {
                const json = snap.val();
                var teams = Object.entries(json);
                setTeams(teams);
            }
        }
        db.on('value', handleData, error => alert(error));
        return () => { db.off('value', handleData); };
    }, []);

    return (
        <View style={[styles.center]}>
            <Text style={[styles.header, styles.center]}>Teams!</Text>
            {teams.map(team => (
                        <TouchableOpacity key={team[0]} style={styles.list} onPress={() => setTeamId(team[0])}>
                            <Text style={[styles.listHeader, styles.center]}> {team[1]} </Text>
                        </TouchableOpacity>
                    ))}
            <TouchableOpacity onPress={() => setRoute("joinTeam")}>
                <Text style={[styles.buttonText, styles.center]}>Join New Team</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.center]} onPress={() => setRoute("createTeam")}>
                    <Text style={[styles.buttonText, styles.center]}>Create Team</Text>
                </TouchableOpacity>
            <LogoutButton teamId={teamId} setTeamId={setTeamId}  auth={auth} />
        </View>
        
    );
};

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

export default Teams;


