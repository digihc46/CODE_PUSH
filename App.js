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
    updateAvailable: true,
    downloadingUpdate: null,
    installingUpdate: null,
    progress: null,
    downloadedBytes: 0,
    stats: "init"
  }
}

componentDidMount(){
  // codePush.sync({
  //   updateDialog: true,
  //   installMode: codePush.InstallMode.IMMEDIATE
  // });
    codePush.checkForUpdate().then(update => {
      if (!update) {
          this.setState({updateAvailable: false});
        
      } else {
        this.setState({updateAvailable: true});
          this.handleUpdate();
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
              this.setTimeout(() => {
                this.setState({
                  downloadingUpdate: true,
                  stats: "STATUS DOWNLOADING_PACKAGE : "
                });
              
              }, 1000);
              break;

            case codePush.SyncStatus.INSTALLING_UPDATE:
              this.setTimeout(() => {
                this.setState({
                  installingUpdate: true, downloadingUpdate: false,
                  stats: "STATUS INSTALLING_UPDATE : "
                });
              }, 1000);
              break;
            case codePush.SyncStatus.UPDATE_INSTALLED:
              this.setTimeout(() => {
                this.setState({
                  installingUpdate: false, downloadingUpdate: false, updateInstalled: true,
                  stats: "STATUS UPDATE_INSTALLED : "
                });

              }, 1000);
              break;
        }
    };

    var onDownloadProgress = function (downloadProgress) {
      if (downloadProgress) {
          this.setState({ progress:  "Downloading " + downloadProgress.receivedBytes + " of " + downloadProgress.totalBytes});
      }
  };

    codePush.sync({updateDialog: false, installMode: codePush.InstallMode.IMMEDIATE}, checkUpdateStatus, onDownloadProgress);
  }

  renderButton(){
    if (this.state.updateAvailable){
        return (
            <View style={{marginTop: 40}}>
                <Button title="DOWNLOAD UPDATE" onPress={this.handleUpdate.bind(this)} />
            </View>
        )
    }
  }

  render() {
    if (this.state.updateAvailable){
      return (
        <View>
          <Text>PROGRESS UPDATE: {this.state.stats}</Text>
          <Text>{this.state.progress != null ? this.state.progress : null}</Text>
        </View>
        )
    } else {
      return (<Text>THERE IS NO UPDATE</Text>)
    }
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