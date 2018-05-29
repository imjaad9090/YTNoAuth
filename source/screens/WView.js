//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet,WebView} from 'react-native';

// create a component
class WView extends Component {

    static navigationOptions ={
        header:null,
    }
    componentWillMount(){
        const { params } = this.props.navigation.state;
        this.setState({videoid:params.id})
    }

    compo


    render() {
        return (
<WebView
        source={{uri: 'https://www.youtube.com/watch?v='+this.state.videoid}}
      />            
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        
        backgroundColor: '#2c3e50',
    },
});

//make this component available to the app
export default WView;
