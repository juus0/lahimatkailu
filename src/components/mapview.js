import React, {Component} from 'react';
import {
  View,
  AppRegistry,
  DeviceEventEmitter,
  Image,
  Text,
  TouchableWithoutFeedback,
  Dimensions
} from 'react-native';
import {Callout, Marker} from 'react-native-maps';
import ClusteredMapView from 'react-native-maps-super-cluster'
import { getDistance } from 'geolib';
import RNALocation from 'react-native-android-location';
import Snackbar from 'react-native-snackbar';
// style
import {styles} from './styles/mapviewstyle';
import {customMapStyle} from './styles/mapviewstyle';

import {fetchDataByLocation} from './getData';

const INIT_REGION = {
  latitude: 60.169856,
  longitude: 24.938379,
  latitudeDelta: 0.22,
  longitudeDelta: 0.22
}

export default class MapViewComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      latitude: 60.169856,
      longitude: 24.938379,
      data: [],
      markers: [],
      options: {
        food: true,
        sight: true,
        service: true
      },
      region: this.setInitialRegion(),
      width: Dimensions.get('screen').width,
      height: Dimensions.get('screen').heigth
    };
  }

  componentDidMount() {
    Dimensions.addEventListener('change', async (e) => {
      try {
        const { width, height } = await e.screen;
        this.setState({ width, height });
      } catch(error) {
          console.warn("Dimensions event listener: " + error) // temporary, katotaan heitteleekö vielä
      }
    })
    this.getData(() => {
      this.setProps(this.props);
    }, () => {
      DeviceEventEmitter
        .addListener('updateLocation', function (e) {
          this.setState({
            lng: e.Longitude,
            lat: e.Latitude
          }, () => {
            this.setProps(this.props);
          });
        }.bind(this));

      RNALocation.getLocation();
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setProps(nextProps);
  }

  precisionRound(number, precision) {
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
  }

  setInitialRegion() {
    if (this.props.region != null) {
      return this.props.region;
    } else {
      return INIT_REGION;
    }
  }

  setProps(nextProps) {
    this.setState({
      options: {
        food: nextProps.options.food,
        sight: nextProps.options.sight,
        service: nextProps.options.service
      }
    }, () => {
      let itemList = [];
      for (let i = 0; i < this.state.data.length; i++) {
        if (this.state.data[i].type == 'Ruoka' && this.state.options.food) {
          itemList.push(this.state.data[i]);
        }
        if (this.state.data[i].type == 'Nähtävyys' && this.state.options.sight) {
          itemList.push(this.state.data[i]);
        }
        if (this.state.data[i].type == 'Palvelu' && this.state.options.service) {
          itemList.push(this.state.data[i]);
        }
        if (this.state.options.food === null && this.state.options.sight === null && this.state.options.service === null) {
          itemList = this.state.data;
        }
      };
      this.setState({markers: itemList});
    })
  }

  getData() {
    this
      .fetchData()
      .done();
  }

  fetchData = async() => {
    try {
      const res = await fetchDataByLocation(this.state.region);
      if (res !== undefined) {
        this.setState({data: res, markers: res});
      } else {
        this.showErrorMessage("Latausvirhe");
      }
    } catch(e) {
      this.showErrorMessage("Yhteysvirhe");
    }
    
  }

  showErrorMessage(error) {
    Snackbar.show({
      title: error,
      color: 'white',
      duration: Snackbar.LENGTH_INDEFINITE,
      action: {
        title: 'yritä uudelleen',
        color: 'white',
        onPress: () => {
          this.fetchData();
        }
      }
    });
  }

  markerImgUrl(icon) {
    if (icon == 'Ruoka') {
      return 'http://maps.gstatic.com/mapfiles/ms2/micons/restaurant.png'
    } else if (icon == 'Nähtävyys') {
      return 'http://maps.gstatic.com/mapfiles/ms2/micons/tree.png'
    } else {
      return 'http://maps.gstatic.com/mapfiles/ms2/micons/realestate.png'
    }
  }

  renderCluster = (cluster, onPress) => {
    const pointCount = cluster.pointCount,
      coordinate = cluster.coordinate,
      clusterId = cluster.clusterId

    const clusteringEngine = this
        .map
        .getClusteringEngine(),
      clusteredPoints = clusteringEngine.getLeaves(clusterId, 100)

    return (
      <Marker coordinate={coordinate} onPress={(onPress)}>
        <View style={styles.myClusterStyle}>
          <Text style={styles.myClusterTextStyle}>
            {pointCount}
          </Text>
        </View>
      </Marker>
    )
  }

  openingHours (data) {
    const compare = new Date();
    const today = compare.getDay();
    const hours = compare.getHours();
    let closes;

    if (today == 0) {
      closes = data.openingHours.sun.end;
    } else if (today == 1) {
      closes = data.openingHours.mon.end;
    } else if (today == 2) {
      closes = data.openingHours.tue.end;
    } else if (today == 3) {
      closes = data.openingHours.wed.end;
    } else if (today == 4) {
      closes = data.openingHours.thu.end;
    } else if (today == 5) {
      closes = data.openingHours.fri.end;
    } else if (today == 6) {
      closes = data.openingHours.sat.end;
    }
    let convertedClosing = closes.split(':');
    convertedClosing = parseFloat(parseInt(convertedClosing[0], 10) + '.' + parseInt((convertedClosing[1]/6)*10, 10));
    
    if (convertedClosing - hours < 0) {
      return "Suljettu nyt";
    } else if (convertedClosing - hours > 3) {
      return "Sulkeutuu tänään: " + closes;
    } else if (convertedClosing - hours < 3) {
      if (convertedClosing - hours >= 1) {
        return "Sulkeutuu tänään: " + closes + "\n(Sulkeutuu " + Math.floor(convertedClosing - hours) +  "h päästä)";
      } else {
        return "Sulkeutuu tänään: " + closes + "\n(Sulkeutuu <1h päästä)";
      } 
    } else {
      return "Avoinna 24h"
    }
  }

  renderMarker = (data) => <Marker
    key={data._id}
    coordinate={{
      latitude: data.location.latitude,
      longitude: data.location.longitude
    }}
   onCalloutPress={() => this.handleCalloutPress(data)}>
    <Image
      style={{
      width: 32,
      height: 32
    }}
      source={{
      uri: this.markerImgUrl(data.type)
    }}/>
    <Callout style={{ 
      width: 200,
      height: 100, 
      borderRadius: 32,
      backgroundColor: 'rgba(255, 255, 255, 0.6)'
    }}>
      <View>
          <Text>{data.name}</Text>
          <Text>{data.type}</Text>
          <Text>Etäisyys linnuntietä: {this.precisionRound(getDistance({latitude: this.state.latitude, longitude: this.state.longitude}, {latitude: data.location.latitude, longitude: data.location.longitude}) / 1000, 1)} km</Text>
          <Text>{this.openingHours(data)}</Text>
        </View>
    </Callout>
  </Marker>

  onRegionChange(region) {
    this.setState({
      region
    }, () => this.fetchData());
  }

  handleCalloutPress(data) {
    this
      .props
      .setSelectedItem(data, data._id, this.state.region);
  }

  render() {
    return (
      <View style={styles.container} >
        <ClusteredMapView
          customMapStyle={customMapStyle}
          style={styles.map}
          width={this.state.width}
          height={this.state.height}
          data={this.state.markers}
          initialRegion={this.state.region}
          onRegionChangeComplete={region => this.onRegionChange(region)}
          ref={(r) => {
          this.map = r
        }}
          renderMarker={this.renderMarker}
          renderCluster={this.renderCluster}
          showsMyLocationButton={false}
          showsUserLocation={true}
          minZoom={5}
          maxZoom={12}
          showInfoWindow={true} 
          />
      </View>
    );
  }
}