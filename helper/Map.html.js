export default MapHTML=`<!DOCTYPE html>
<html>
  <head>
    <title>Leaflet Map</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css"
    integrity="sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI="
    crossorigin=""/>
    <script src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.js"
    integrity="sha256-WBkoXOwTeyKclOHuWtc+i2uENFpDZ9YPdf5Hf+D7ewM="
    crossorigin=""></script>
  </head>
  <body>
    <div id="mapid" style="height: 100vh;"></div>



    <script>
      var map = L.map('mapid').setView([10.781272, 106.535700], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
          '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
          'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 20,
        tileSize: 512,
        zoomOffset: -1,
      }).addTo(map);

      const apiKey = '8c413d560bbd42d481dc9d4112e5752a';

      var layerGroup=L.layerGroup();
      var locationGroup=L.layerGroup();

      window.addEventListener('message', (event) => {
        const message = event.data;
        const data = JSON.parse(message);
        // Xử lý đối tượng JSON được gửi từ ứng dụng React Native tại đây
        Update(data.type,data.data);
      });

      function Update(type, data)// data là Schedule
      {
        if (type=="Clear"){
          layerGroup.clearLayers();
          locationGroup.clearLayers();
        }
        else if(type=="Schedule"){
          locationGroup.clearLayers();
          layerGroup.clearLayers();
          var listPoint=[];
          const promises=[];
          data.WalkStages.forEach((stage,idxStage)=>{
            promises.push(Routing(
              getCoordinate(stage.StartPoint),
              getCoordinate(stage.EndPoint),
              "WALK"));
            if(idxStage==0){
              const fromWaypointMarker = L.marker(getCoordinate(stage.StartPoint))
                .bindPopup((stage.StartPoint.Name?stage.StartPoint.Name:"")+" <<Đi từ>>");
              layerGroup.addLayer(fromWaypointMarker);
            }
            else if(idxStage==data.WalkStages.length-1){
              const toWaypointMarker = L.marker(getCoordinate(stage.EndPoint))
                .bindPopup((stage.EndPoint.Name?stage.EndPoint.Name:"")+" <<Điểm đến>>");
                layerGroup.addLayer(toWaypointMarker);
              }
          });
          data.BusStages.forEach(stage=>{
            for(let i=0;i<stage.listLocation.length-1;i++)
            {
              promises.push(Routing(
                getCoordinate(stage.listLocation[i]),
                getCoordinate(stage.listLocation[i+1]),
                "BUS"))
            }
            listPoint=[...listPoint,...stage.listLocation];
          });
          
          Promise.all(promises)
          .then(()=>{
            AddPointMarker(listPoint);
            layerGroup.addTo(map);
            map.setView(getCoordinate(data.WalkStages[0].StartPoint), 15);
          });
        }
        else{//data là {Locations: [<Location>],buses: [<Bus>]} ở dạng obj
          if(locationGroup.getLayers()==0)
          {
            data.Locations.forEach((location,index)=>{
              const marker=L.marker([location.Latitude,location.Longitude],
                {licence_plate: data.buses[index].licence_plate})
                  .bindPopup(layer.options.license_plate);
              locationGroup.addLayer(marker);
            });
          }
          else{
            locationGroup.eachLayer((layer,index)=>{
              const newLatLng = L.latLng(data.Locations[index].Latitude,
                data.Locations[index].Longitude);
              layer.setLatLng(newLatLng);    
            });
          }
        }
      }
      function getCoordinate(Location){
        return [Location.Latitude,Location.Longitude]
      }
      function AddPointMarker(listLocation){
        const turnByTurnMarkerStyle = {
          radius: 5,
          fillColor: "#fff",
          color: "#555",
          weight: 1,
          opacity: 1,
          fillOpacity: 1
        }
        const turnByTurns=[]
        listLocation.forEach(element => {
          const pointFeature = {
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [element.Longitude,element.Latitude]
            },
            "properties": {
              "name": element.Name
            }
          }
          turnByTurns.push(pointFeature);
        });

        const MarkerPoint=L.geoJSON({
          type: "FeatureCollection",
          features: turnByTurns
        }, {
          pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, turnByTurnMarkerStyle);
          }
        }).bindPopup((layer) => {
          return \`\${layer.feature.properties.name}\`
        })
        layerGroup.addLayer(MarkerPoint);
      }

      function Routing(From,To,mode)
      {
        if(mode=="BUS")
        {
            return fetch(\`https://api.geoapify.com/v1/routing?waypoints=\${From.join(',')}|\${To.join(',')}&mode=truck&apiKey=\${apiKey}\`).then(res => res.json()).then(result => {

            // Note! GeoJSON uses [longitude, latutude] format for coordinates
            const step=L.geoJSON(result, {
            style: (feature) => {
                return {
                color: "rgb(0,48,143)",
                weight: 5
                };
            }
            }).bindPopup((layer) => {
              return \`\${(layer.feature.properties.distance/1000).toFixed(2)} \${'km'}\`
              })
            layerGroup.addLayer(step);
            }, error => console.log(err));
        }
        else//(mode=="WALK")
        {
          return fetch(\`https://api.geoapify.com/v1/routing?waypoints=\${From.join(',')}|\${To.join(',')}&mode=walk&apiKey=${apiKey}\`).then(res => res.json()).then(result => {

          // Note! GeoJSON uses [longitude, latutude] format for coordinates
          const step=L.geoJSON(result, {
          style: (feature) => {
              return {
              color: "rgb(114,160,193)",
              weight: 2,
              dashArray: '5, 5',
              };
          }
          }).bindPopup((layer) => {
            return \`\${(layer.feature.properties.distance/1000).toFixed(2)} \${'km'}\`
            }).addTo(layerGroup);
          layerGroup.addLayer(step);
          }, error => console.log(err));
        }
      }


      ///////TEST
      const schedule=
      {
          WalkStages:[
              {
                  StartPoint:{
                      Name: "w1",
                      Longitude: 106.801822,
                      Latitude: 10.880277, 
                  },
                  EndPoint:{
                      Name: "w2",
                      Longitude: 106.802224,
                      Latitude: 10.879142,  
                  }
              },
              {
                  StartPoint:{
                      Name: "w3",
                      Longitude: 106.803032,
                      Latitude: 10.876861,  
                  },
                  EndPoint:{
                      Name: "w4",
                      Longitude: 106.802836,
                      Latitude: 10.876556,  
                  }
              }
          ],
          BusStages:[
              {
                  listLocation:[
                      {
                          Name: "b1",
                          Longitude: 106.802429,
                          Latitude: 10.878532,  
                      },
                      {
                          Name: "b2",
                          Longitude: 106.802678,
                          Latitude: 10.877870,  
                      },
                      {
                          Name: "b3",
                          Longitude: 106.802868,
                          Latitude: 10.877289,   
                      }
                  ],
              }
          ],
      };
      Update("Schedule",schedule);
    </script>
  </body>
</html>`