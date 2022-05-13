/// <reference types="react" />
import Flow from "./Flow";
import Model from "./Model";
import Cell from "./cells/Cell";
import Node from "./cells/Node";
import Edge from "./cells/Edge";
import { CellDataType } from "./cells/Cell";
import { EdgeDataType } from "./cells/Edge";
import { NodeDataType } from "./cells/Node";
import { Portal, RightClickPanel, Interactor, Port, PortDataType, Arrow, ConsumerBridge } from "./components";
import * as G from "@antv/react-g";
import { autorun } from "mobx";
import { Vector2d, FlowInfraEventType } from "./typings/common";
import { Canvas } from "./Flow";
declare type ModelType = Model;
declare const Graph: {
    Arrow: typeof Arrow;
    ElementOf<Element_1, Prop, T extends string>(type: T): (props: {
        key?: import("react").Key | undefined;
        ref?: import("react").Ref<Element_1> | undefined;
        children?: import("react").ReactNode;
    } & Prop & Partial<{
        onPointerdown: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerup: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerupoutside: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointertap: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerover: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerenter: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerleave: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerout: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMousedown: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onRightdown: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseup: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseupoutside: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onClick: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMousemove: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseover: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseout: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseenter: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseleave: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onTouchstart: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onTouchend: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onTouchendoutside: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onTouchmove: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onTap: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onWheel: (evt: import("@antv/g").InteractivePointerEvent) => void;
    }>) => import("react").ReactElement<Prop, T>;
    Circle: (props: {
        key?: import("react").Key | undefined;
        ref?: import("react").Ref<import("@antv/g").Circle> | undefined;
        children?: import("react").ReactNode;
    } & import("@antv/g").CircleStyleProps & Partial<{
        onPointerdown: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerup: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerupoutside: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointertap: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerover: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerenter: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerleave: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerout: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMousedown: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onRightdown: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseup: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseupoutside: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onClick: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMousemove: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseover: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseout: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseenter: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseleave: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onTouchstart: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onTouchend: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onTouchendoutside: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onTouchmove: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onTap: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onWheel: (evt: import("@antv/g").InteractivePointerEvent) => void;
    }>) => import("react").ReactElement<import("@antv/g").CircleStyleProps, import("@antv/g").Shape.CIRCLE>;
    Ellipse: (props: {
        key?: import("react").Key | undefined;
        ref?: import("react").Ref<import("@antv/g").Ellipse> | undefined;
        children?: import("react").ReactNode;
    } & import("@antv/g").EllipseStyleProps & Partial<{
        onPointerdown: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerup: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerupoutside: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointertap: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerover: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerenter: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerleave: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerout: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMousedown: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onRightdown: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseup: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseupoutside: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onClick: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMousemove: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseover: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseout: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseenter: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseleave: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onTouchstart: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onTouchend: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onTouchendoutside: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onTouchmove: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onTap: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onWheel: (evt: import("@antv/g").InteractivePointerEvent) => void;
    }>) => import("react").ReactElement<import("@antv/g").EllipseStyleProps, import("@antv/g").Shape.ELLIPSE>;
    Group: (props: {
        key?: import("react").Key | undefined;
        ref?: import("react").Ref<import("@antv/g").Group> | undefined;
        children?: import("react").ReactNode;
    } & import("@antv/g").BaseStyleProps & Partial<{
        onPointerdown: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerup: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerupoutside: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointertap: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerover: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerenter: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerleave: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerout: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMousedown: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onRightdown: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseup: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseupoutside: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onClick: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMousemove: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseover: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseout: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseenter: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseleave: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onTouchstart: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onTouchend: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onTouchendoutside: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onTouchmove: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onTap: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onWheel: (evt: import("@antv/g").InteractivePointerEvent) => void;
    }>) => import("react").ReactElement<import("@antv/g").BaseStyleProps, import("@antv/g").Shape.GROUP>;
    HTML: (props: {
        key?: import("react").Key | undefined;
        ref?: import("react").Ref<import("@antv/g").HTML> | undefined;
        children?: import("react").ReactNode;
    } & import("@antv/g").HTMLStyleProps & Partial<{
        onPointerdown: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerup: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerupoutside: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointertap: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerover: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerenter: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerleave: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerout: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMousedown: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onRightdown: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseup: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseupoutside: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onClick: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMousemove: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseover: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseout: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseenter: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseleave: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onTouchstart: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onTouchend: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onTouchendoutside: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onTouchmove: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onTap: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onWheel: (evt: import("@antv/g").InteractivePointerEvent) => void;
    }>) => import("react").ReactElement<import("@antv/g").HTMLStyleProps, import("@antv/g").Shape.HTML>;
    Image: (props: {
        key?: import("react").Key | undefined;
        ref?: import("react").Ref<import("@antv/g").Image> | undefined;
        children?: import("react").ReactNode;
    } & import("@antv/g").ImageStyleProps & Partial<{
        onPointerdown: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerup: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerupoutside: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointertap: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerover: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerenter: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerleave: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerout: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMousedown: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onRightdown: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseup: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseupoutside: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onClick: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMousemove: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseover: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseout: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseenter: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseleave: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onTouchstart: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onTouchend: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onTouchendoutside: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onTouchmove: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onTap: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onWheel: (evt: import("@antv/g").InteractivePointerEvent) => void;
    }>) => import("react").ReactElement<import("@antv/g").ImageStyleProps, import("@antv/g").Shape.IMAGE>;
    Line: (props: {
        key?: import("react").Key | undefined;
        ref?: import("react").Ref<import("@antv/g").Line> | undefined;
        children?: import("react").ReactNode;
    } & import("@antv/g").LineStyleProps & Partial<{
        onPointerdown: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerup: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerupoutside: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointertap: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerover: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerenter: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerleave: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerout: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMousedown: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onRightdown: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseup: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseupoutside: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onClick: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMousemove: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseover: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseout: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseenter: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseleave: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onTouchstart: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onTouchend: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onTouchendoutside: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onTouchmove: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onTap: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onWheel: (evt: import("@antv/g").InteractivePointerEvent) => void;
    }>) => import("react").ReactElement<import("@antv/g").LineStyleProps, import("@antv/g").Shape.LINE>;
    Path: (props: {
        key?: import("react").Key | undefined;
        ref?: import("react").Ref<import("@antv/g").Path> | undefined;
        children?: import("react").ReactNode;
    } & import("@antv/g").PathStyleProps & Partial<{
        onPointerdown: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerup: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerupoutside: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointertap: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerover: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerenter: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerleave: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerout: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMousedown: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onRightdown: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseup: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseupoutside: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onClick: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMousemove: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseover: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseout: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseenter: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseleave: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onTouchstart: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onTouchend: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onTouchendoutside: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onTouchmove: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onTap: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onWheel: (evt: import("@antv/g").InteractivePointerEvent) => void;
    }>) => import("react").ReactElement<import("@antv/g").PathStyleProps, import("@antv/g").Shape.PATH>;
    Polygon: (props: {
        key?: import("react").Key | undefined;
        ref?: import("react").Ref<import("@antv/g").Polygon> | undefined;
        children?: import("react").ReactNode;
    } & import("@antv/g").PolygonStyleProps & Partial<{
        onPointerdown: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerup: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerupoutside: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointertap: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerover: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerenter: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerleave: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerout: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMousedown: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onRightdown: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseup: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseupoutside: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onClick: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMousemove: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseover: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseout: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseenter: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseleave: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onTouchstart: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onTouchend: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onTouchendoutside: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onTouchmove: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onTap: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onWheel: (evt: import("@antv/g").InteractivePointerEvent) => void;
    }>) => import("react").ReactElement<import("@antv/g").PolygonStyleProps, import("@antv/g").Shape.POLYGON>;
    Polyline: (props: {
        key?: import("react").Key | undefined;
        ref?: import("react").Ref<import("@antv/g").Polyline> | undefined;
        children?: import("react").ReactNode;
    } & import("@antv/g").PolylineStyleProps & Partial<{
        onPointerdown: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerup: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerupoutside: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointertap: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerover: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerenter: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerleave: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerout: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMousedown: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onRightdown: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseup: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseupoutside: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onClick: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMousemove: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseover: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseout: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseenter: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseleave: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onTouchstart: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onTouchend: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onTouchendoutside: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onTouchmove: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onTap: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onWheel: (evt: import("@antv/g").InteractivePointerEvent) => void;
    }>) => import("react").ReactElement<import("@antv/g").PolylineStyleProps, import("@antv/g").Shape.POLYLINE>;
    Rect: (props: {
        key?: import("react").Key | undefined;
        ref?: import("react").Ref<import("@antv/g").Rect> | undefined;
        children?: import("react").ReactNode;
    } & import("@antv/g").RectStyleProps & Partial<{
        onPointerdown: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerup: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerupoutside: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointertap: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerover: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerenter: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerleave: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerout: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMousedown: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onRightdown: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseup: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseupoutside: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onClick: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMousemove: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseover: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseout: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseenter: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseleave: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onTouchstart: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onTouchend: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onTouchendoutside: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onTouchmove: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onTap: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onWheel: (evt: import("@antv/g").InteractivePointerEvent) => void;
    }>) => import("react").ReactElement<import("@antv/g").RectStyleProps, import("@antv/g").Shape.RECT>;
    Text: (props: {
        key?: import("react").Key | undefined;
        ref?: import("react").Ref<import("@antv/g").Text> | undefined;
        children?: import("react").ReactNode;
    } & import("@antv/g").TextStyleProps & Partial<{
        onPointerdown: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerup: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerupoutside: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointertap: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerover: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerenter: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerleave: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onPointerout: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMousedown: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onRightdown: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseup: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseupoutside: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onClick: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMousemove: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseover: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseout: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseenter: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onMouseleave: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onTouchstart: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onTouchend: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onTouchendoutside: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onTouchmove: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onTap: (evt: import("@antv/g").InteractivePointerEvent) => void;
        onWheel: (evt: import("@antv/g").InteractivePointerEvent) => void;
    }>) => import("react").ReactElement<import("@antv/g").TextStyleProps, import("@antv/g").Shape.TEXT>;
    Canvas: import("react").ForwardRefExoticComponent<Pick<G.CanvasProps, keyof G.CanvasProps> & import("react").RefAttributes<import("@antv/g").Canvas>>;
    reconcilor: ReactReconciler.Reconciler<import("@antv/g").Element<any, any>, import("@antv/g").Element<any, any>, import("@antv/g").Element<any, any>, any, any>;
    render: (component: import("react").ReactNode, target: import("@antv/g").Element<any, any> | import("@antv/g").Canvas, callback?: (() => void) | null | undefined) => void;
};
export { Flow, Cell, Node, Edge, Port, Interactor, Portal, Graph, autorun, ConsumerBridge, RightClickPanel, Canvas, };
export type { ModelType, FlowInfraEventType, Vector2d, CellDataType, EdgeDataType, PortDataType, NodeDataType, };
