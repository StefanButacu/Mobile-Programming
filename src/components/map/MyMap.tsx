import React from "react";
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import { compose, withProps } from 'recompose';
import { mapsApiKey } from './mapApiKey';

interface MyMapProps {
    lat?: number;
    lng?: number;
    onMapClick: (e: any) => void,
    onMarkerClick: (e: any) => void,
}

export const MyMap =
    compose<MyMapProps, any>(
        withProps({
            googleMapURL:
                `https://maps.googleapis.com/maps/api/js?key=${mapsApiKey}&v=3.exp&libraries=geometry,drawing,places`,
            loadingElement: <div style={{ height: `100%` }} />,
            containerElement: <div style={{ height: `400px` }} />,
            mapElement: <div style={{ height: `100%` }} />
        }),
        withScriptjs,
        withGoogleMap
    )(props => (
        <GoogleMap
            defaultZoom={8}
            defaultCenter={{ lat: 46.7712, lng: 23.6236 }}
            onClick={props.onMapClick} >
            <Marker
                position={{lat: 46.7712, lng: 23.6236}}
                onClick={props.onMarkerClick}
            />
        </GoogleMap>

    ))