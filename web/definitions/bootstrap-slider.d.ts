/// <reference path="./jquery.d.ts" />
interface JQuery {
    slider(): JQuery;
}

interface JQueryStatic {
    slider(): JQuery;
}

declare var bootstrap_slider: any;
declare module "seiyria-bootstrap-slider" {
    export = bootstrap_slider;
}