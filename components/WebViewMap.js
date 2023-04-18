// Component React Native
import { WebView } from 'react-native-webview';
import React, { useEffect, useState, useRef} from 'react';
import axios from 'axios';
import * as MapViewClass from '../helper/MapViewClass'
import { Text, View, StyleSheet} from 'react-native';
import {MapHTML} from '../helper/Map.html'

const LocationAPI = (EntityID) => {
  return 'http://demo.thingsboard.io/api/plugins/telemetry/DEVICE/' + EntityID + '/values/timeseries'
};
const AuthAPI = () => {
  return 'http://demo.thingsboard.io/api/auth/login'
};
const AppAPI = (service)=> {
  return 'localhost:4000'+service;
}
const REFRESH_INTERVAL = 5000;
const USER_THINGSBOARD = 'thanhnhanle1407@gmail.com';
const PASS_THINGSBOARD = '123456';

// props:
//   typeActivity: "select" or "find"
//   Longitude: number
//   Latitude: number
//   SelectRoute: number
//   Callback: Hàm trả về giá trị cho Component cha: gồm:
//      mapview.state{type,listRoute}
//      mapview.BusForRoute
//      mapview.timerId
//      mapview.Promise_JWT_Token
//      mapView.stateChange="changing" or "changed" -> Dùng để nhận biết một yêu cầu đã hoàn thành

// 5 TH của props:
// 1) "select" -> SelectRoute = index của route muốn chọn [Khi muốn chọn Route]
// 2) "find" -> tùy ý [Khi trước đó là "no"]
// 3) "no" -> tùy ý [Khi khởi tạo component]
// 4) "refind" -> tùy ý [Khi muốn tìm lại route, trước đó phải là find]
// 5) "reselect" -> tùy ý [Khi muốn chọn lại route, trước đó phải là select]


//Để sau khi chuyển trang vẫn ở trạng thái cũ thì làm như sau:
//

function WebViewMap ({props}){
    const state= "noRoute";
    var listSchedule= null;
    var timerFetchLocations=null;
    var timerFetchBuses=null
    var JWT_Token=null;
    const webViewRef= useRef();
    
    //Component mount
    useEffect(()=>{
      //Lấy JWT_Token của thingsboard
      getJWT_Token()
      .then((result)=>{
        JWT_Token=result;
      })

      return ()=>{
        //Component unmount
        if(timerFetchLocations)
          clearInterval(timerFetchLocations);
        if(timerFetchBuses)
          clearInterval(timerFetchBuses);
      }},[])

    //Khi props thay đổi
    useEffect(()=>{
      
      if(props.typeActivity=="find"||props.typeActivity=="refind")
      {
        if(state=="noRoute"){noRoute_find();}
        else if(state=="noSelect"){noSelect_find();}
        else if(state=="Selected"){Selected_find();}
      }
      else if(props.typeActivity=="select"||props.typeActivity=="reselect")
      {
        if(state=="noSelect"){noSelect_select();}
        else if(state=="Selected"){Selected_select();}
      }
    },[props.typeActivity])

  function getJWT_Token(){
    const url = AuthAPI();
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    const data = {
      "username":USER_THINGSBOARD,
      "password":PASS_THINGSBOARD
    };
    return axios.post(url, data, {
      headers: headers,
    })
      .then(response => {
        return response.data["token"];
      })
      .catch(error => {
        console.error(error);
      });
  }

  function FetchSchedules(StartP,EndP)
  {
    const url = AppAPI('/schedule');
    const headers = {
      'Content-Type': 'application/json',
    };
    const param={
      StartPoint: StartP,
      EndPoint: EndP
    }
    return axios.get(url, {
      headers: headers, params: param
    })
      .then(response => {
        console.log(response.data);
        //Thay đổi listSchedule
        listSchedule=response.data.map(schedule => {
          const temp= new MapViewClass.Schedule()
          return temp.FromObj(schedule);
        });
      })
      .catch(error => {
        console.error(error);
      });
  }

  function FetchBuses(Schedules){
    const url = AppAPI('/buses');
    const headers = {
      'Content-Type': 'application/json',
    };
    const data=JSON.parse(JSON.stringify(Schedules))
    
    return axios.post(url, {
      headers: headers, data: data,
    })
      .then(response => {
        console.log(response.data);
        listSchedule=response.data.map(schedule => {
          const temp= new MapViewClass.Schedule()
          return temp.FromObj(schedule);
        });
      })
      .catch(error => {
        console.error(error);
      });
  }
  function FetchLocations(buses)
  {
    const EntityIds= buses.array.forEach(bus => {
      return bus.EntityId;
    });
    const urls =EntityIds.map((EntityID)=>{ return LocationAPI(EntityID)});
    const headers = {
      'Content-Type': 'application/json',
      'X-Authorization': 'Bearer '+ JWT_Token
    };
    if(JWT_Token)
    {
      return Promise.all(urls.map((url)=>{return axios.get(url, {
        headers: headers,
      })}))
        .then(response => {
          const listLocation=[];
          JSON.parse(response.data).array.forEach(telemetry => {
            const tempLo=new MapViewClass.Location("",telemetry.longitude[0].value, 
              telemetry.latitude[0].value);
            listLocation.push(tempLo);
          });
          return listLocation;
        })
        .catch(error => {
          console.error(error);
        });
    }
    else console.error("Fetch Location nhưng không có JWT_Token!")
  }

  function UpdateHTMLSchedule(Schedule){
    const mess={
      type: "Schedule",
      data: JSON.parse(JSON.stringify(Schedule))};
    webViewRef.current.postMessage(mess);
  }

  function UpdateHTMLLocations(Locations,buses){
    const mess={
      type: "Locations",
      data: {
        Locations: Locations.forEach((location)=>{
          return JSON.parse(JSON.stringify(location))
        }),
        buses: buses.forEach((bus)=>{
          return JSON.parse(JSON.stringify(bus))
        }),
      }};
    webViewRef.current.postMessage(mess);
  }

  function UpdateHTMLClear(){
    const mess={
      type: "Clear",
      data: {}};
    webViewRef.current.postMessage(mess);
  }

  function noRoute_find(){
    FetchSchedules(props.StartPoint, props.EndPoint)
    .then(()=>{
      if(listSchedule.length!=0){
        state="noSelect";
        FetchBuses(listSchedule)
        .then(()=>{
          props.Callback();
        })
      }
      else{
        props.Callback();
      }
    })
  }

  function noSelect_find(){
    FetchSchedules(props.StartPoint, props.EndPoint)
    .then(()=>{
      if(listSchedule.length!=0){
        state="noSelect";
        FetchBuses(listSchedule)
        .then(()=>{
          props.Callback();
        })
      }
      else{
        state="noRoute";
        props.Callback();
      }
    })
  }

  function Selected_find(){
    FetchSchedules(props.StartPoint, props.EndPoint)
    .then(()=>{
      if(listSchedule.length!=0){
        state="noSelect";
        FetchBuses(listSchedule)
        .then(()=>{
          state="noSelect"
          clearInterval(timerId);
          UpdateHTMLClear();
          props.Callback();
        })
      }
      else{
        state="noRoute";
        clearInterval(timerId);
        UpdateHTMLClear();
        props.Callback();
      }
    })
  }

  function Selected_select(){
    UpdateHTMLSchedule(listSchedule[props.currentRoute]);
    FetchBuses(listSchedule)
    .then(()=>{
      clearInterval(timerId);
      timerId=setInterval(()=>{
        FetchLocations(listSchedule.buses)
        .then((Locations)=>{
          UpdateHTMLLocations(Locations,listSchedule.buses)
        })
      },REFRESH_INTERVAL)
    });
  }
  function noSelect_select(){
    UpdateHTMLSchedule(listSchedule[props.currentRoute]);
    FetchBuses(listSchedule)
    .then(()=>{
      state="Selected";
      timerId=setInterval(()=>{
        FetchLocations(listSchedule.buses)
        .then((Locations)=>{
          UpdateHTMLLocations(Locations,listSchedule.buses)
        })
      },REFRESH_INTERVAL)
    });
  }

  function updateBusForRoute(data){

  }

  function getBusForRoute(){
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ 
          data: { 
            id: 1, 
            name: "Product 1", 
            price: 100 
          } 
        });
      }, 2000);
    });
  }

  function UpdateLocationBus(jwt_token,EntityId){

    newLocation=Promise_JWT_Token.then(()=>{
      const url = LocationAPI(EntityId);
      const headers = {
        'Content-Type': 'application/json',
        'X-Authorization': 'Bearer '+jwt_token
      };
      return axios.get(url, {
        headers: headers,
      })
        .then(response => {
          console.log(JSON.stringify(response.data));
          return response.data
        })
        .catch(error => {
          console.error(error);
        });
    })
    return newLocation;////////////////////
  }

    return (
      <WebView
        style={styles.container}
        ref={webViewRef}
        source={{ html: MapHTML }}
      />
      
      );
    }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
})

export default WebViewMap;