
import React, {useState, useEffect} from 'react';
import { TouchableOpacity, Modal, StyleSheet, Text, View, FlatList, SafeAreaView, ActivityIndicator, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const Row = ({item, onPress})=>{
  const [album, setAlbums] = useState(item);
  return (

    <TouchableOpacity style={styles.item} onPress={(item)=>onPress(album)}>
      <Text style={styles.title}>{item.title}</Text>
      
    </TouchableOpacity>

)};

function DetailsScreen({navigation, route}){
    const [detail, setDetail] = useState([]);
  
    useEffect(()=>{
    fetch('https://jsonplaceholder.typicode.com/users')
    .then((response)=>response.json())
    .then((json)=>{setDetail(json)})
  }, []);
  let album = route.params.album;
  let filterdName = detail.filter(d=>d.id===album.id).map(n=>n.username)
  return(
    <> 
    <Text style={styles.detail}> User ID : {album.id}</Text>
    <Text style={styles.detail}> Title: {album.title}</Text>
    <Text style={styles.detail}> UserName : {filterdName}</Text>
     </>
  );

}

function HomeScreen({navigation, route}){
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  
  useEffect(()=>{
    fetch('https://jsonplaceholder.typicode.com/albums')
    .then((response)=>response.json())
    .then((json)=>{setData(json); setIsError(false);})
    .catch((err)=>{setIsError(true); setData([]); console.error(err);})
    .finally(()=>setIsLoading(false));
  }, []);

  

  const renderRow = ({item})=><Row 
    item={item} 
    onPress={(item)=>navigation.navigate(
      {
        name:'Details',
        params:{album:item},
        merge:true,
      })}></Row>

  return (
    <SafeAreaView style={styles.container}>
      <Modal  visible={isError} animationType='fade' transparent={true}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
          <Text>Error loading data. Try again later.</Text>
        </View>
        </View>
      </Modal>
      
      {isLoading ? <><ActivityIndicator size='large' color='#00cccc'></ActivityIndicator><Text>Loading...</Text></> :
      <>
        <FlatList data={data} renderItem={renderRow} keyExtractor={item=>item.id}></FlatList>
      </>
      }
    </SafeAreaView>
  );
}

export default function App() {

  return(
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen name='Home' component={HomeScreen} />
        <Stack.Screen name='Details' component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: StatusBar.currentHeight || 0,
  },
  item:{
    backgroundColor:'#52b788',
    padding: 16,
    marginHorizontal: 16,
    marginVertical:8,
  },
  title:{
    fontSize:24,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10
  },
  detail:{
    backgroundColor:'#f9c74f',
    padding: 15,
    marginHorizontal: 16,
    marginVertical:6,
  }
});






