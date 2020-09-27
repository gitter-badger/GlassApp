import { action, observable } from "mobx";
import { Feature, Map, View } from "ol";
import LineString from "ol/geom/LineString";
import Point from "ol/geom/Point";
import { defaults as defaultInteractions } from "ol/interaction";
import PointerInteraction from "ol/interaction/Pointer";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import "ol/ol.css";
import { fromLonLat, toLonLat } from "ol/proj";
import OSM from "ol/source/OSM";
import VectorSource from "ol/source/Vector";
import Fill from "ol/style/Fill";
import Icon from "ol/style/Icon";
import IconAnchorUnits from "ol/style/IconAnchorUnits";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";
import Text from "ol/style/Text";
import pinIconUrl from "../../assets/pin.png";
import planeIconUrl from "../../assets/plane.png";
import { degToRad, feetToNauticalMiles, headingFromCoords } from "../utils/common";

export class MapModel {
    // Plane
    planeIcon = new Icon({
        anchor: [0.5, 0.5],
        scale: [0.2, 0.2],
        anchorXUnits: IconAnchorUnits.FRACTION,
        anchorYUnits: IconAnchorUnits.FRACTION,
        src: planeIconUrl,
    });
    planePoint = new Point([0, 0]);
    planeFeature = new Feature({
        geometry: this.planePoint,
    });
    planeIconStyle = new Style({
        image: this.planeIcon,
    });

    planeSource = new VectorSource({
        features: [this.planeFeature],
    });
    planeLayer = new VectorLayer({
        source: this.planeSource,
    });

    // Pin
    pinIcon = new Icon({
        anchor: [0.5, 1],
        scale: [0.1, 0.1],
        anchorXUnits: IconAnchorUnits.FRACTION,
        anchorYUnits: IconAnchorUnits.FRACTION,
        src: pinIconUrl,
    });
    pinIconStyle = new Style({
        image: this.pinIcon,
    });
    pinPoint = new Point([0, 0]);
    pinFeature = new Feature({
        geometry: this.pinPoint,
    });

    // Pin Line
    pinLine = new LineString([
        [0, 0],
        [0, 0],
    ]);
    pinLineStyle = new Style({
        stroke: new Stroke({
            width: 2,
            color: "#ff0000",
        }),
    });
    pinLineFeature = new Feature({
        geometry: this.pinLine,
    });

    pinSource = new VectorSource({
        features: [this.pinFeature, this.pinLineFeature],
    });
    pinLayer = new VectorLayer({
        source: this.pinSource,
    });

    // Wind Vector
    windLine = new LineString([
        [0, 0],
        [0, 0],
    ]);
    windLineStyle = new Style({
        stroke: new Stroke({
            width: 2,
            color: "#0000ff",
        }),
    });
    windLineFeature = new Feature({
        geometry: this.windLine,
    });
    windLineSource = new VectorSource({
        features: [this.windLineFeature],
    });
    windLayer = new VectorLayer({
        source: this.windLineSource,
    });

    view = new View({
        center: [0, 0],
        zoom: 14,
    });

    interactions = defaultInteractions();
    placePinInteraction = new PointerInteraction({
        handleDownEvent: event => {
            if (this.placingPin) {
                const [lon, lat] = toLonLat(event.coordinate);
                this.updatePinPosition(lon, lat);
                this.endPlacingPin();
            }
            return false;
        },
    });

    map = new Map({
        layers: [
            new TileLayer({
                source: new OSM({ imageSmoothing: true }),
            }),
            this.pinLayer,
            this.planeLayer,
        ],
        view: this.view,
        interactions: this.interactions,
    });

    @observable
    followPlane: boolean = true;

    @observable
    showPin: boolean = false;

    @observable
    placingPin: boolean = false;

    constructor() {
        this.planeFeature.setStyle(this.planeIconStyle);
        this.pinFeature.setStyle(this.pinIconStyle);
        this.pinLineFeature.setStyle(this.pinLineStyle);
        this.windLineFeature.setStyle(this.windLineStyle);

        this.pinLayer.setVisible(this.showPin);
    }

    onRef = <T extends HTMLElement>(ref: T | null): void => {
        this.map.setTarget(ref ?? undefined);
    };

    updatePlanePosition(lon: number, lat: number, rot: number) {
        const coords = fromLonLat([lon, lat]);
        this.planePoint.setCoordinates(coords);
        this.planeIcon.setRotation(degToRad(rot));

        if (this.followPlane) {
            this.view.setCenter(coords);
        }

        this.updatePinLine();
    }

    updatePinPosition(lon: number, lat: number) {
        const pinCoords = fromLonLat([lon, lat]);
        this.pinPoint.setCoordinates(pinCoords);

        this.updatePinLine();
    }

    updatePinLine() {
        const pinCoords = this.pinPoint.getCoordinates();
        const planeCoords = this.planePoint.getCoordinates();

        this.pinLine.setCoordinates([planeCoords, pinCoords]);

        const distance = feetToNauticalMiles(this.pinLine.getLength());

        const heading = headingFromCoords(
            planeCoords as [number, number],
            pinCoords as [number, number]
        );

        this.pinLineStyle.setText(
            new Text({
                backgroundFill: new Fill({ color: "#ffffff" }),
                backgroundStroke: new Stroke({ color: "#000000" }),
                text: `${distance.toFixed(2)} NM\n${heading.toFixed(2)}°`,
                scale: 1.5,
            })
        );
    }

    @action.bound
    toggleShowPin(): void {
        this.showPin = !this.showPin;

        this.pinLayer.setVisible(this.showPin);
    }

    @action.bound
    toggleFollowPlane(): void {
        this.followPlane = !this.followPlane;
    }

    @action.bound
    startPlacingPin(): void {
        this.placingPin = true;

        this.interactions.push(this.placePinInteraction);
    }

    @action.bound
    endPlacingPin(): void {
        this.placingPin = false;
        this.interactions.remove(this.placePinInteraction);
    }
}
