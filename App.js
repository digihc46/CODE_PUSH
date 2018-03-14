/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  Image, TouchableHighlight
} from 'react-native';
import codePush from 'react-native-code-push';

const bgProfile = require('./images/apip.jpeg');


let codePushOptions = { checkFrequency: codePush.CheckFrequency.MANUAL };


class App extends Component {

constructor(props){
  super(props);
  this.state = {
    logs : [], 
    updateAvailable: false,
    downloadingUpdate: null,
    installingUpdate: null,
    downloadProgress: null,
  }
}

componentDidMount(){
  // codePush.sync({
  //   updateDialog: true,
  //   installMode: codePush.InstallMode.IMMEDIATE
  // });
    codePush.checkForUpdate().then(update => {
      if (!update) {
        this.setState({updateAvailable: false})
      } else {
        this.setState({updateAvailable: true})
      }
    })
}

  codePushSync(){
    this.setState({logs: ['Started At ' + new Date().getTime()]})
    codePush.sync({
      updateDialog: true,
      installMode: codePush.InstallMode.IMMEDIATE
    }, (status) => {
      for(var key in codePush.SyncStatus){
        if (status === codePush.SyncStatus[key]){
          this.setState(prevState => ({ logs: [...prevState.logs, key.replace(/_/g, ' ')] }));
          break;
        }
      }
    });
  }

  handleUpdate() {
    const checkUpdateStatus = (status) => {
        switch (status) {
            case codePush.SyncStatus.DOWNLOADING_PACKAGE:
                console.log("STATUS DOWNLOADING_PACKAGE : " + status);
                this.setState({downloadingUpdate: true});
                break;
            case codePush.SyncStatus.INSTALLING_UPDATE:
            console.log("STATUS INSTALLING_UPDATE : " + status);
                this.setState({installingUpdate: true, downloadingUpdate: false});
                break;
            case codePush.SyncStatus.UPDATE_INSTALLED:
                console.log("STATUS UPDATE_INSTALLED : " + status);
                this.setState({installingUpdate: false, downloadingUpdate: false, updateInstalled: true});
                break;
        }
    };

    const downloadProgress = (downloadedBytes, totalBytes) => {
        this.setState({downloadProgress: (downloadedBytes / totalBytes) * 100})
    };

    codePush.sync({updateDialog: false, installMode: codePush.InstallMode.IMMEDIATE}, checkUpdateStatus, downloadProgress);
  }

  renderButton(){
    if (this.state.updateAvailable){
        return (
            <View style={{marginTop: 40}}>
                <Button title="An update is available" onPress={this.handleUpdate.bind(this)} />
            </View>
        )
    }
  }

  render() {
    console.log("updateAvailable: "+this.state.updateAvailable);
    console.log("downloadingUpdate: "+this.state.downloadingUpdate);
    console.log("installingUpdate: "+this.state.installingUpdate);
    console.log("downloadProgress: "+this.state.downloadProgress);
    console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")

    return (
        <View style={styles.container}>
            <Text>STATUS UPDATE : {this.state.updateAvailable} </Text>
            {this.renderButton()}
        </View>
    )
}


  // render() {
  //   return (
  //     <View style={styles.container}>
  //     {/* <Image source={bgProfile}></Image> */}
  //       <Text style={styles.welcome}>
  //         NEW UPDATE  FINAL
  //       </Text>
  //      <Button title="Code Push Sync" onPress={()=> this.codePushSync()} />
  //   {this.state.logs.map((log,i) => <Text key={i}>{log}</Text>)}
  //     </View>
  //   );
  // }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

App = codePush(codePushOptions)(App);
export default App;