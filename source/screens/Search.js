//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet,FlatList,Image,TextInput,ToastAndroid,NetInfo,TouchableOpacity,StatusBar,Alert,AsyncStorage,ActivityIndicator,Button,ScrollView,Platform } from 'react-native';
import FastImage from 'react-native-fast-image'
import { DrawerActions } from 'react-navigation';
import { NavigationActions } from 'react-navigation';
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust';
const Q = 'https://www.googleapis.com/youtube/v3/search?key=AIzaSyCEnFIC4sQYCrsL03GufcD1xw2JHaQmxUs&part=snippet&order=date&type=video&maxResults=50&regionCode=us&q=?'
import axios from 'react-native-axios';
import Icon from 'react-native-vector-icons/MaterialIcons';

// create a component
class Search extends Component {


    static navigationOptions ={
        headerTitle:'Search Results',
        headerTintColor: 'white',
    headerStyle:{
        backgroundColor:"black",

    },
    headerTitleStyle:{
        color:'white'
    },
    
    }

        constructor(props){
            super(props)
            this.state={
                store:[],
                isLoading:true
            }
        }


        componentWillMount(){
       
        const { params } = this.props.navigation.state;
        console.log(params.query)
        
        axios.get(Q+params.query)
        .then((response) => {
   
        console.log(response);
        this.setState({store:response.data.items})
        this.setState({isLoading:false})

    
        })
        .catch((error) => {
            this.setState({isLoading:false})

        console.log(error);
        });
    
    
        }




    render() {
        return (
            <View style={styles.container}>
            {this.state.isLoading ? (
    <ActivityIndicator
      animating
      color="#e00"
      size="large"
      style={styles.activityIndicator}
    />
  ) : 
    <FlatList
  showsHorizontalScrollIndicator={false}
  //extraData={this.state.index}
//horizontal={true}
keyExtractor={(item, index) => index.toString()}
data={this.state.store}
//extraData={this.state.index}
renderItem={({item}) => (
<View style={{marginVertical:10}}>
<Text style={{color:'white',fontWeight:"600",fontSize:18}}>{item.snippet.title}</Text>
<Text style={{color:'white'}}>{item.snippet.channelTitle}</Text>


<TouchableOpacity activeOpacity={0.9} onPress={()=>this.props.navigation.navigate('webview',{id:item.id.videoId})}>
<FastImage
style={{width:400,height:280,alignSelf:'center'}}
source={{
uri: item.snippet.thumbnails.high.url,
priority: FastImage.priority.normal,

}}
resizeMode={FastImage.resizeMode.contain}
/>
</TouchableOpacity>

  </View>
)}/>            

            }

</View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding:5,
        backgroundColor: '#000',
    },
});

//make this component available to the app
export default Search;
