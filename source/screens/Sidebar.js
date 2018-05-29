//import liraries
import React, { Component } from 'react';
import { View, StyleSheet,ScrollView,Image,Text,AsyncStorage,BackHandler,Alert} from 'react-native';
import Icon from 'react-native-vector-icons/Feather'
import { Container, Header, Content, List, Button, ListItem,H3,H2,Left, Body, Right, Switch } from 'native-base';

// create a component
class Sidebar extends Component {



  
  state={
    username:'Titan',
    usermail:'tan@live.com'
  }

   async componentWillMount(){
   
  }


  exit(){
    Alert.alert(
      'Exit',
      'Are you sure.',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'Yes', onPress: () => BackHandler.exitApp()  
      },
      ],
      { cancelable: true }
    )

  }


  logout(){
    AsyncStorage.removeItem('userToken');
    this.props.navigation.navigate('Select');
  }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                <Content>
<View style={{backgroundColor:'#000333',width:'100%',height:150,flexDirection:'row',padding:10,alignItems:'center'}}>

<View style={{justifyContent:'center',left:10}}>
<Text style={{color:'white',fontSize:24,fontWeight:"700"}}>Dashboard</Text>
<Text style={{color:'white',fontSize:15}}>Choose preferences</Text>

</View>
</View>

          <List style={{marginRight:6,top:8}}>
            <ListItem onPress={()=>this.props.navigation.pop()} icon>
              <Left>
                <Icon name="home" size={21} color="#ff0000"/>
              </Left>
              <Body>
                <Text style={{color:'white'}}>Home</Text>
              </Body>
              <Right>
                  <View></View>
              </Right>
            </ListItem>



            <ListItem onPress={()=>this.props.navigation.navigate('subs')}  icon>
              <Left>
                <Icon name="tv" size={21} color="#ff0000"/>
              </Left>
              <Body>
                <Text style={{color:'white'}}>Subscriptions</Text>
              </Body>
              <Right>
                  <View></View>
              </Right>
            </ListItem>



             <ListItem onPress={()=>this.logout()} icon>
              <Left>
                <Icon name="radio"  size={21} color="#ff0000" />
              </Left>
              <Body>
                <Text style={{color:'white'}}>Select Categories</Text>
              </Body>
              <Right>
                  <View></View>
              </Right>
            </ListItem>


        <ListItem  onPress={()=>this.exit()} icon>
              <Left>
                <Icon name="x-circle" size={21} color="#ff0000" />
              </Left>
              <Body>
                <Text style={{color:'white'}}>Exit</Text>
              </Body>
              <Right>
                  <View></View>
              </Right>
            </ListItem>

            </List>
            </Content>
                </ScrollView>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
});

//make this component available to the app
export default Sidebar;
