//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet,FlatList,Image,TextInput,Platform,NetInfo,TouchableOpacity,Alert,AsyncStorage,ActivityIndicator,ToastAndroid } from 'react-native';
import FastImage from 'react-native-fast-image';
var numeral = require('numeral');
var parseString = require('react-native-xml2js').parseString
import navigationOptions from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust';
import * as Animatable from 'react-native-animatable';

import axios from 'react-native-axios';
const SEARCH = 'http://clients1.google.com/complete/search?hl=en&output=toolbar&gl=us&ds=yt&q=?'
import {
    AdMobBanner,
    AdMobInterstitial,
    PublisherBanner,
    AdMobRewarded,
  } from 'react-native-admob'
const LINK = 'https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&maxResults=10&key=AIzaSyBzyI8GzavsFfFoxopFLCAApWM2VKRXNeo&chart=mostPopular&regionCode=us&videoCategoryId='
// create a component
class Gaming extends Component {
   
    static navigationOptions =({navigation,screenProps})=> ({

        title:typeof(navigation.state.params)==='undefined' || typeof(navigation.state.params.title) === 'undefined' ? 'Loading': navigation.state.params.title,
        tabBarLabel:typeof(navigation.state.params)==='undefined' || typeof(navigation.state.params.title) === 'undefined' ? 'Loading': navigation.state.params.title,
        headerStyle:{
            //elevation:0,

        },
        headerTitleStyle: { textAlign:"center",alignSelf:"center"},
        headerLeft: (
            <View style={{flex:1,left:7}}><Icon name="menu" size={28} color="#fff" onPress={()=>navigation.navigate('DrawerOpen')}/></View>
    
        ),
        headerRight: navigation.state.params ? navigation.state.params.headerRight : null

    });



    constructor(){
        super()
        this.state={
            searchToggle:false,
            searchRes:[],
            store:[],
            selected:[],
            isLoading: false

        }
    }

    toggle(){

        if(this.state.searchToggle==false)
        {
            //this.props.navigation.setParams({ title: "Search" })
            this.setState({searchToggle:true,searchRes:[]})
        }
        else{
            //this.props.navigation.setParams({ title: this.state.headtitle })

            this.setState({searchToggle:false,searchRes:[]})

        }

    }

    async componentDidMount(){


        this.props.navigation.setParams({
            headerRight: (
                <View style={{flexDirection:'row',paddingHorizontal:5}}><Icon name="search"  style={{marginHorizontal:5,padding:15}} size={26} color="#fff" onPress={()=>this.toggle()} /></View>
            )
          })



        this.setState({isLoading: true})

        var names = await AsyncStorage.getItem('names')
        var conames =JSON.parse(names)
    var name1 = conames[1]
    this.props.navigation.setParams({ title: name1 })



        var res = await AsyncStorage.getItem('categories')
        var final = JSON.parse(res)
        this.setState({catID:final[1]})

        NetInfo.getConnectionInfo().then((connectionInfo) => {
            if(connectionInfo.type != 'none'){

            axios.get(LINK+final[1])
            .then((response) => {
            
        console.log(response);
        this.setState({store:response.data.items})


        if(response.data.nextPageToken){
            this.setState({nextPageToken:response.data.nextPageToken})
        }
        else{
            this.setState({nextPageToken:'null'})
        }
        this.setState({isLoading: false})
            })

      .catch((error) => {
        this.setState({isLoading: false})
        Alert.alert('Ops..','Request failed, please check your internet connection')
    
        console.log(error);
      });
    }
    else {
        this.setState({isLoading: false})
        Alert.alert('Ops..','Request failed, please check your internet connection')
    
        
    }

    });
    if (Platform.OS === 'android'){
        AndroidKeyboardAdjust.setAdjustPan();
    }

    }
    showTime(props) {
        var match = props.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
      
        match = match.slice(1).map(function(x) {
          if (x != null) {
              return x.replace(/\D/, '');
          }
        });
      
        var hours = (parseInt(match[0]) || 0);
        var minutes = (parseInt(match[1]) || 0);
        var seconds = (parseInt(match[2]) || 0);
      
        var ans= (hours * 3600 + minutes * 60 + seconds)/60;
        var ddew = ans.toFixed(0);
        return <Text style={{color:'#b2bec3',marginHorizontal:3}}>{ddew} minutes </Text>
    }

    showViews(props){
      var string = numeral(props).format('0,0');
      return <Text style={{color:'#b2bec3',marginHorizontal:3}}> {string} views </Text>

    }



      async addChannel(props){
        var store =[]
        this.state.selected.push(props)
        console.log(this.state.selected)
        
            let value = await AsyncStorage.getItem('channels');
            if (value != null){
                var arr1 = (JSON.parse(value))
                var arr2 = this.state.selected
                Array.prototype.push.apply(arr1, arr2);
                this.state.selected.pop()
                console.log('after pushing new values')
            console.log(arr1)
            AsyncStorage.setItem('channels',JSON.stringify(arr1))
            console.log('data pushed')
            ToastAndroid.showWithGravityAndOffset(
                'Channel added to the list!',
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50
              );
        
            }
            else if(value == null){
                AsyncStorage.setItem('channels',JSON.stringify(this.state.selected))
                console.log('friends store is null')
                console.log('new items pushed')
                this.state.selected.pop()
                let res = await AsyncStorage.getItem('channels');
                var arr = (JSON.parse(res))
                console.log('the result updated : '+arr)
                ToastAndroid.showWithGravityAndOffset(
                    'Channel added to the list!',
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                    25,
                    50
                  );
                // do something else
           }

      }


      search(props){
        if(props.length > 3){
            axios.get(SEARCH+props)
            .then((response) => {
                var str = (response.data)
                var temp = []
                //console.log(result)
                parseString(str, (err, result) => {
                    
                    for(let i = 0;i<result.toplevel.CompleteSuggestion.length;i++){
                        temp.push({title:result.toplevel.CompleteSuggestion[i].suggestion[0].$.data})
                    }
                    console.log(temp);
                    this.setState({searchRes:temp})
                    
                });
                console.log(this.state.searchRes)
            })

      .catch((error) => {
        
        console.log(error);
      });
        }
       
      }


      sendnext(props){
        this.setState({searchRes:[]})
        this.props.navigation.navigate('search',{query:JSON.stringify(props)})
      }


      onEndReached() {
        

        console.log('end reached'+this.state.nextPageToken)

        if(this.state.nextPageToken != 'null'){
        
        axios.get('https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&maxResults=10&key=AIzaSyBzyI8GzavsFfFoxopFLCAApWM2VKRXNeo&chart=mostPopular&regionCode=us&videoCategoryId='+this.state.catID+'&pageToken='+ this.state.nextPageToken)
      .then((response) => {
       
        console.log(response);
        let old = this.state.store

        var result = old.concat(response.data.items)
        //response.data.items
        this.setState({store:result,nextPageToken:response.data.nextPageToken})

      })
      .catch((error) => {
         console.log(error);

      });            
    
    }
    else{
        console.log('No next page token found')
    }

    }



    render() {
        return (
            <View style={styles.container}>
            {   this.state.searchToggle ?  
                (<Animatable.View   animation="fadeIn" duration={200} easing="ease-in" style={{width:'100%',padding:5,paddingHorizontal:10,position:"relative",
                       
                       height:'10%',borderColor:'transparent',backgroundColor:'#7b050b',}}>
                   
                   <View style={{flex:1,flexDirection:'row',backgroundColor:'#dd0914',
                       borderRadius:4,alignItems:'center'}}>
                   <View style={{justifyContent:'center',paddingLeft:2}}>
                   <Icon name='search' color='white' size={22} />
            
                   </View>
                   <TextInput  
                onTouchStart={()=> this.setState({searchRes:[]})}
                  selectionColor={'white'}
                   underlineColorAndroid='transparent'
                   autoCorrect={false}
                   autoFocus={true}
                   //autoCapitalize='none'
                   placeholderTextColor="#bfbfbf"
                   onChangeText={(text)=>this.search(text)}
                   placeholder=''
                   style={{height:'100%',
                   justifyContent:'center',
                       textDecorationLine:'none',
                       textDecorationColor:'transparent',
                       color:'white',
                       fontWeight:'400',
                       alignItems:'center',
                       width:'100%',
                       position:'relative',
                       fontStyle:'normal',
                       fontSize:15,
                          
                   }} />
                   </View>
                  
                   </Animatable.View>) : null
                }
            
            
                <View style={{padding:2}}>
                <FlatList        
                style={{borderRadius:2,backgroundColor:'transparent',marginHorizontal:5}}
                showsHorizontalScrollIndicator={false}
                //extraData={this.state.index}
                //horizontal={true}
                keyExtractor={(item, index) => index.toString()}
                data={this.state.searchRes}
                renderItem={({item}) => (
                    <View style={{backgroundColor:"white"}}>
                <TouchableOpacity onPress={()=>this.sendnext(item.title)} style={{backgroundColor:'white',height:30,paddingHorizontal:6,justifyContent:"center"}}>
                <Text style={{color:'black',fontWeight:'300',fontSize:15}}>{item.title}</Text>
                </TouchableOpacity>
                </View>
                )}/>
                </View>
            
            {this.state.isLoading ? (
    <ActivityIndicator
      animating
      color="#e00"
      size="large"
      style={styles.activityIndicator}
    />
  ) : 
  <View>
<View>
  <FlatList
  showsHorizontalScrollIndicator={false}
  //extraData={this.state.index}
//horizontal={true}
keyExtractor={(item, index) => index.toString()}
data={this.state.store}
onEndReached={this.onEndReached.bind(this)}

renderItem={({item}) => (
  <TouchableOpacity activeOpacity={0.9} onPress={()=>this.props.navigation.navigate('webview',{id:item.id})} style={{marginVertical:10,}}>
<Text style={{color:'white',fontWeight:"400",fontSize:16}}>{item.snippet.localized.title}</Text>
<Text style={{color:'white'}}>{item.snippet.channelTitle}</Text>
<View style={{flexDirection:'row',alignItems:'center'}}>
<Icon name="play-circle-outline" style={{marginLeft:3}} color="#e00" size={16} /> 
{this.showTime(item.contentDetails.duration)}
<Icon name="remove-red-eye" style={{marginLeft:3}} color="#e00" size={16} /> 

{this.showViews(item.statistics.viewCount)}
</View><View style={{flexDirection:'row',alignItems:'center'}}>
<Text style={{color:'white'}}>Add to favourites </Text>
<Icon name="favorite" color='#e00' size={23} onPress={()=>this.addChannel(item.snippet.channelId,item.id)}/>
</View>
<FastImage
style={{width:400,height:280,alignSelf:'center'}}
source={{
uri: item.snippet.thumbnails.high.url,
priority: FastImage.priority.normal,

}}
resizeMode={FastImage.resizeMode.contain}


/>

  </TouchableOpacity>
)}/>
</View>
<View style={{position:'absolute',alignSelf:'center',justifyContent:'flex-end',bottom:0}}>
  <AdMobBanner
adSize="smartBannerLandscape"
  adUnitID="ca-app-pub-9592011956917491/8683582684"
  testDevices={[AdMobBanner.simulatorId]}
  onAdFailedToLoad={error => console.log(error)}
/>
</View>
</View> }








          
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
    activityIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 80
      }
});

//make this component available to the app
export default Gaming;
