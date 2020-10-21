import React, { useEffect, useState } from 'react';
import { StyleSheet, Button, Text, View, SafeAreaView } from 'react-native';
import { firebase } from './firebase';
import onlineStatus from './util/onlineStatus';
import Lobby from './components/Lobby';
import NameForm from './components/NameForm';
import Teams from './components/Teams';
import Game from './components/Game';
import Activities from './components/Activities';
import LoginForm from './components/Login';

export default function App() {
  const [user, setUser] = useState(false);
  const [uids, setUids] = useState([]);
  const [teamId, setTeamId] = useState("");
  const [teamInfo, setTeamInfo] = useState(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(setUser);
  }, []);

  // watch data for users in team, etc
  useEffect(() => {
    const db = firebase.database().ref('/teams/' + teamId + "/members");
    console.log(db);
    const handleData = snap => {
      if (snap.val()) {
        const json = snap.val()
        console.log(json);
        setUids(Object.keys(json))
        const teamInfo = Object.values(json)
        setTeamInfo(teamInfo)
      }
    }
    db.on('value', handleData, error => alert(error));
    return () => { db.off('value', handleData); };
  }, [teamId]);

  // teamInfo closed
  const isLobbyClosed = (teamInfo) => {
    if (teamInfo) {
      var arr = teamInfo.filter(user => !user.voteToClose)
      console.log(teamInfo.length)
      console.log(arr)
      return (arr.length == 0 && teamInfo.length > 1)
    }
    return false
  }

  const isGameChosen = (teamInfo) => {
    console.log(teamInfo)
    if (teamInfo) {
      var arr = teamInfo.filter(user => user.voteGame != null)
      // console.log(teamInfo)
      // console.log(arr.length)
      // console.log(arr)
      if (arr.length == teamInfo.length){
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
    for(var i = 0; i<arr.length; i++){
      if(!map[arr[i].voteGame]){
          map[arr[i].voteGame]=1;
      }else{
          ++map[arr[i].voteGame];
          if(map[arr[i].voteGame]>map[mostFrequentElement]){
              mostFrequentElement = arr[i].voteGame;
          }
      }
    }
    return mostFrequentElement
  }

  useEffect(() => {
    console.log(user)
    console.log(teamId)
    if (user && teamId != "")
      onlineStatus(user.uid, teamId);
  }, [teamId]);

  const generateLink = (uids) => {
    return uids[0]
    //return uids.join('');
  }

  return (
    <SafeAreaView style={[styles.background, styles.center]}>
      <View style={[styles.container, styles.center]}>
        {!isLobbyClosed(teamInfo) ?
          <View style={styles.container}>
            {!user ?
            <LoginForm/> :
              teamId == "" ? 
              <Teams user={user} setTeamId={setTeamId} />     
              :
              <Lobby user={user}
              teamId={teamId} teamInfo={teamInfo}/>
            }
          </View>
          :
          !isGameChosen(teamInfo) ?
            <View style={[styles.container, styles.center]}>
              <Activities numUsers={teamInfo.length} user={user} teamInfo={teamInfo} teamId={teamId}/>
            </View> 
            :
            <View style={[styles.container, styles.center]}>
              <Game jitsiLink={generateLink(uids)} gameName={theGameChosen(teamInfo)} />
            </View>
        }
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '90%',
    height: '100%',
    maxWidth: 600,
    minWidth: 200,
  },
  background: {
    backgroundColor: '#8FBC8F',
    width: '100%',
    height: '100%',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
