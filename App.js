import React, { useEffect, useState } from 'react';
import { StyleSheet, Button, Text, View, SafeAreaView, ScrollView } from 'react-native';
import { firebase } from './firebase';
import Lobby from './components/Lobby';
import Teams from './components/Teams';
import Game from './components/Game';
import Activities from './components/Activities';
import LoginForm from './components/Login';
import JoinTeam from './components/JoinTeam';
import CreateTeam from './components/CreateTeam';
import styles from "./assets/Styles";


export default function App() {
  const [user, setUser] = useState(false);
  const [auth, setAuth] = useState(false);
  const [uids, setUids] = useState([]);
  const [teamId, setTeamId] = useState("");
  const [teamInfo, setTeamInfo] = useState(null);
  const [route, setRoute] = useState("")
  const [teamName, setTeamName] = useState("")

  useEffect(() => {
    firebase.auth().onAuthStateChanged(setAuth)
  }, []);

  useEffect(() => {
    if (auth) {
      const db = firebase.database().ref('/users/' + auth.uid)
      const handleData = snap => {
        if (snap.val()) {
          const json = snap.val()
          setUser(json);
        }
      }
      db.on('value', handleData, error => alert(error));
      return () => { db.off('value', handleData); };
    }
  }, [auth]);

  // watch data for users in team, etc
  useEffect(() => {
    if (teamId != "") {
      const db = firebase.database().ref('/teams/' + teamId);
      const handleData = snap => {
        if (snap.val()) {
          const json = snap.val()
          setUids(Object.keys(json.members))
          const teamInfo = Object.values(json.members)
          setTeamName(json.name)
          setTeamInfo(teamInfo)
        }
      }
      db.on('value', handleData, error => alert(error));
      return () => { db.off('value', handleData); };
    }
  }, [teamId]);

  // teamInfo closed
  const isLobbyClosed = (teamInfo) => {
    console.log("teamInfo");
    console.log(teamInfo);
    if (teamInfo) {
      // check for both false literal and false as a string just to be safe
      var arr = teamInfo.filter(user => user.voteToClose == "false" || !user.voteToClose)
      console.log("arr");
      console.log(arr);
      return (arr.length == 0 && teamInfo.length > 1)
    }
    return false
  }

  const isGameChosen = (teamInfo) => {
    if (teamInfo) {
      var arr = teamInfo.filter(user => user.voteGame != null)
      // console.log(teamInfo)
      // console.log(arr.length)
      // console.log(arr)
      if (arr.length == teamInfo.length) {
        return true
      }
      else
        return false
    }
  }

  const theGameChosen = (teamInfo) => {
    var arr = teamInfo.filter(user => user.voteGame != null)
    var map = {};
    var mostFrequentElement = arr[0].voteGame;
    for (var i = 0; i < arr.length; i++) {
      if (!map[arr[i].voteGame]) {
        map[arr[i].voteGame] = 1;
      } else {
        ++map[arr[i].voteGame];
        if (map[arr[i].voteGame] > map[mostFrequentElement]) {
          mostFrequentElement = arr[i].voteGame;
        }
      }
    }
    return mostFrequentElement
  }

  // useEffect(() => {
  //   console.log(auth)
  //   console.log(teamId)
  //   if (auth && teamId != "")
  //     onlineStatus(auth.uid, teamId);
  // }, [teamId]);

  const generateLink = (uids) => {
    return uids[0]
    //return uids.join('');
  }


  return (
    <ScrollView style={[styles.background] } >
      <SafeAreaView style={[styles.center]}>
        <View style={[styles.contentContainer, styles.center]}>
          {!isLobbyClosed(teamInfo) ?
            <View style={styles.container}>
              {!auth ?
                <LoginForm /> :
                teamId != "" ?
                  <Lobby auth={auth} teamId={teamId} teamInfo={teamInfo} setTeamId={setTeamId} teamName={teamName} />
                  :
                  route == "joinTeam" ?
                    <JoinTeam auth={auth} user={user} setRoute={setRoute}></JoinTeam>
                    :
                    route == "createTeam" ?
                      <CreateTeam auth={auth} user={user} setRoute={setRoute}></CreateTeam>
                      :
                      <Teams auth={auth} teamId={teamId} setTeamId={setTeamId} setRoute={setRoute} />
              }
            </View>
            :
            !isGameChosen(teamInfo) ?
              <View style={[styles.container, styles.center]}>
                <Activities numUsers={teamInfo.length} auth={auth} teamInfo={teamInfo} teamId={teamId} />
              </View>
              :
              <View style={[styles.container, styles.center]}>
                <Game jitsiLink={generateLink(uids)} gameName={theGameChosen(teamInfo)} />
              </View>
          }
        </View>
      </SafeAreaView>
    </ScrollView>

  );
}

