import { useRef, useState } from "react";
import Supercluster from "supercluster";
import { BBox, GeoJsonProperties } from "geojson";
import { useDeepCompareEffectNoCheck } from "use-deep-compare-effect";
import { dequal } from "dequal";

export interface UseSuperclusterArgument<P, C> {
  points: Array<Supercluster.PointFeature<P>>;
  bounds?: BBox;
  zoom: number;
  options?: Supercluster.Options<P, C>;
}

let useSupercluster = <
  P extends GeoJsonProperties = Supercluster.AnyProps,
  C extends GeoJsonProperties = Supercluster.AnyProps
>({
  points,
  bounds,
  zoom,
  options
}: UseSuperclusterArgument<P, C>) => {
  let superclusterRef = useRef<Supercluster<P, C>>();
  let pointsRef = useRef<Array<Supercluster.PointFeature<P>>>();
  let [clusters, setClusters] = useState<
    Array<Supercluster.ClusterFeature<C> | Supercluster.PointFeature<P>>
  >([]);
  let zoomInt = Math.round(zoom);

  useDeepCompareEffectNoCheck(() => {
    if (!superclusterRef.current || !dequal(pointsRef.current, points)) {
      superclusterRef.current = new Supercluster(options);
      superclusterRef.current.load(points);
    }

    if (bounds) {
      setClusters(superclusterRef.current.getClusters(bounds, zoomInt));
    }

    pointsRef.current = points;
  }, [points, bounds, zoomInt]);

  return { clusters, supercluster: superclusterRef.current };
};

export default useSupercluster;
