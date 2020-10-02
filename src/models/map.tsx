import { action, autorun, observable } from "mobx";
import { Feature, Map, View } from "ol";
import { distance } from "ol/coordinate";
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
import Icon from "ol/style/Icon";
import IconAnchorUnits from "ol/style/IconAnchorUnits";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";
import planeIconUrl from "../../assets/plane.png";
import { arrDelete, degToRad, feetToNauticalMiles } from "../utils/common";
import { SimModel } from "./sim";
import ScaleLine from "ol/control/ScaleLine";

export class MapModel {
    // Plane
    planeIcon = new Icon({
        anchor: [0.5, 0.5],
        scale: [0.2, 0.2],
        anchorXUnits: IconAnchorUnits.FRACTION,
        anchorYUnits: IconAnchorUnits.FRACTION,
        src: planeIconUrl,
    });
    planeIconStyle = new Style({
        image: this.planeIcon,
    });
    planePoint = new Point([0, 0]);
    planeFeature = new Feature({
        geometry: this.planePoint,
    });

    planeSource = new VectorSource({
        features: [this.planeFeature],
    });
    planeLayer = new VectorLayer({
        source: this.planeSource,
    });

    // Waypoint points
    waypointPointFeatures: Feature[] = [];

    // Waypoint line
    waypointLine = new LineString([]);
    waypointLineStyle = new Style({
        stroke: new Stroke({
            width: 2,
            color: "#ff0000",
        }),
    });
    waypointLineFeature = new Feature({
        geometry: this.waypointLine,
    });
    waypointSource = new VectorSource({
        features: [this.waypointLineFeature],
    });
    waypointLayer = new VectorLayer({
        source: this.waypointSource,
    });

    view = new View({
        center: [0, 0],
        zoom: 14,
    });

    interactions = defaultInteractions();
    placePinInteraction = new PointerInteraction({
        handleDownEvent: event => {
            if (this.addingWaypoint) {
                const [lon, lat] = toLonLat(event.coordinate);
                this.waypoints.push([lon, lat]);
                this.stopAddingWaypoint();
            }
            return false;
        },
    });

    map = new Map({
        layers: [
            new TileLayer({
                source: new OSM({ imageSmoothing: true }),
            }),
            this.waypointLayer,
            this.planeLayer,
        ],
        view: this.view,
        interactions: this.interactions,
        controls: [
            new ScaleLine({
                units: "nautical",
            }),
        ],
    });

    @observable
    followPlane: boolean = true;

    @observable
    showWaypoints: boolean = false;

    @observable
    addingWaypoint: boolean = false;

    @observable
    waypoints: Array<[number, number]> = [];

    @observable
    selectedWaypoint: [number, number] | null = null;

    @observable
    planeLongitude: number = 0;

    @observable
    planeLatitude: number = 0;

    @observable
    planeHeading: number = 0;

    private sim: SimModel;

    constructor(sim: SimModel) {
        this.planeFeature.setStyle(this.planeIconStyle);
        this.waypointLineFeature.setStyle(this.waypointLineStyle);

        this.sim = sim;

        this.waypointLayer.setVisible(this.showWaypoints);

        setInterval(() => {
            this.planeLatitude = sim.getData("PLANE LATITUDE")?.value ?? this.planeLatitude;
            this.planeLongitude = sim.getData("PLANE LONGITUDE")?.value ?? this.planeLongitude;
            this.planeHeading =
                sim.getData("PLANE HEADING DEGREES TRUE")?.value ?? this.planeHeading;
        }, 500);
    }

    onRef = <T extends HTMLElement>(ref: T | null): void => {
        this.map.setTarget(ref ?? undefined);
    };

    @action.bound
    toggleWaypoints(): void {
        this.showWaypoints = !this.showWaypoints;

        this.waypointLayer.setVisible(this.showWaypoints);
    }

    @action.bound
    toggleFollowPlane(): void {
        this.followPlane = !this.followPlane;
    }

    @action.bound
    startAddingWaypoint(): void {
        this.addingWaypoint = true;

        this.interactions.push(this.placePinInteraction);
    }

    @action.bound
    stopAddingWaypoint(): void {
        this.addingWaypoint = false;
        this.interactions.remove(this.placePinInteraction);
    }

    dc = autorun(() => {
        const planeCoords = fromLonLat([this.planeLongitude, this.planeLatitude]);

        const open = [...this.waypoints];
        const toRemove: Array<[number, number]> = [];
        while (open.length > 0) {
            const nextWaypoint = open.shift();
            if (nextWaypoint == null) break;

            const lenInFt = new LineString([fromLonLat(nextWaypoint), planeCoords]).getLength();

            if (lenInFt > 500) break;
            toRemove.push(nextWaypoint);
        }
        toRemove.forEach(wp => arrDelete(this.waypoints, wp));

        // UPDATE VIEW

        // Update plane
        this.planePoint.setCoordinates(planeCoords);
        this.planeIcon.setRotation(degToRad(this.planeHeading));
        if (this.followPlane) {
            this.view.setCenter(planeCoords);
        }

        // Update waypoints
        const waypointCoords = this.waypoints.map(w => fromLonLat(w));

        // Update waypoint points
        const oldPointFeatures = this.waypointPointFeatures;
        this.waypointPointFeatures = waypointCoords.map(
            coord => new Feature({ geometry: new Point(coord) })
        );
        for (const feat of oldPointFeatures) {
            this.waypointSource.removeFeature(feat);
        }
        this.waypointSource.addFeatures(this.waypointPointFeatures);

        // Update waypoint line
        this.waypointLine.setCoordinates([planeCoords, ...waypointCoords]);
    });
}
