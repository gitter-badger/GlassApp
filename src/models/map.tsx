import { action, autorun, observable } from "mobx";
import { Feature, Map, View } from "ol";
import ScaleLine from "ol/control/ScaleLine";
import Point from "ol/geom/Point";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import "ol/ol.css";
import { fromLonLat } from "ol/proj";
import OSM from "ol/source/OSM";
import VectorSource from "ol/source/Vector";
import Icon from "ol/style/Icon";
import IconAnchorUnits from "ol/style/IconAnchorUnits";
import Style from "ol/style/Style";
import planeIconUrl from "../../assets/plane.png";
import { degToRad } from "../utils/common";
import { AppModel } from "./app";
import { SimModel } from "./sim";
import Draw from "ol/interaction/Draw";
import GeometryType from "ol/geom/GeometryType";
import { Coordinate } from "ol/coordinate";

export class MapModel {
    osmSource = new OSM({});
    osmLayer = new TileLayer({
        source: this.osmSource,
    });

    // Plane
    planeIcon = new Icon({
        anchor: [0.5, 0.5],
        scale: [0.2, 0.2],
        anchorXUnits: IconAnchorUnits.FRACTION,
        anchorYUnits: IconAnchorUnits.FRACTION,
        src: planeIconUrl,
        rotateWithView: true,
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

    // Drawing
    drawSource = new VectorSource({});
    drawInteraction = new Draw({
        source: this.drawSource,
        type: GeometryType.LINE_STRING,
    });

    view = new View({
        center: [0, 0],
        zoom: 14,
    });
    map = new Map({
        layers: [this.osmLayer, this.planeLayer],
        view: this.view,
        controls: [
            new ScaleLine({
                units: "nautical",
            }),
        ],
    });

    @observable
    followPlane: boolean = true;

    @observable
    followHeading: boolean = false;

    @observable
    showLog: boolean = false;

    @observable
    planeLongitude: number = 0;

    @observable
    planeLatitude: number = 0;

    @observable
    planeHeading: number = 0;

    @observable
    measuring: boolean = false;

    private app: AppModel;
    private sim: SimModel;

    private disposers: Array<() => void> = [];

    constructor(app: AppModel) {
        this.app = app;
        this.sim = app.sim;

        this.planeFeature.setStyle(this.planeIconStyle);

        this.disposers.push(autorun(() => this.update()));

        this.drawInteraction.on("drawstart", evt => {
            console.log("Draw Start");
        });
    }

    dispose() {
        this.disposers.forEach(d => d());
        this.disposers = [];
    }

    onRef = <T extends HTMLElement>(ref: T | null): void => {
        this.map.setTarget(ref ?? undefined);
    };

    @action.bound
    toggleFollowPlane(): void {
        this.followPlane = !this.followPlane;
    }

    @action.bound
    toggleFollowPlaneHeading(): void {
        this.followHeading = !this.followHeading;

        if (!this.followHeading) {
            this.view.setRotation(0);
        }
    }

    @action.bound
    toggleShowLog(): void {
        this.showLog = !this.showLog;
    }

    @action.bound
    toggleMeasure(): void {
        this.measuring = !this.measuring;

        if (this.measuring) {
            this.map.addInteraction(this.drawInteraction);
        } else {
            this.map.removeInteraction(this.drawInteraction);
        }
    }

    resetNorth(): void {
        this.view.setRotation(0);
    }

    private update() {
        this.planeLatitude = this.sim.getData("PLANE LATITUDE")?.value ?? this.planeLatitude;
        this.planeLongitude = this.sim.getData("PLANE LONGITUDE")?.value ?? this.planeLongitude;
        this.planeHeading =
            this.sim.getData("PLANE HEADING DEGREES TRUE")?.value ?? this.planeHeading;

        const planeCoords = fromLonLat([this.planeLongitude, this.planeLatitude]);
        const planeHeadingDeg = degToRad(this.planeHeading);

        // Update plane
        this.planePoint.setCoordinates(planeCoords);
        this.planeIcon.setRotation(planeHeadingDeg);
        if (this.followPlane) {
            this.view.setCenter(planeCoords);
        }

        if (this.followHeading) {
            this.view.setRotation(-1 * planeHeadingDeg);
        }
    }
}
