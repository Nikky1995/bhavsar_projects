"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { FeatureCollection, Geometry } from "geojson";
import type { Topology } from "topojson-specification";
import { getStateTopoUrl } from "@/lib/stateMapUrls";

interface DistrictProperties {
  district: string;
  dt_code: string;
}

interface DistrictPath {
  d: string;
  district: string;
  dtCode: string;
}

export interface StateDistrictMapProps {
  stateCode: string;
  onClick?: (district: string) => void;
  size?: string;
  mapColor?: string;
  strokeColor?: string;
  strokeWidth?: string;
  hoverColor?: string;
  className?: string;
}

const MAP_WIDTH = 800;
const MAP_HEIGHT = 600;

export default function StateDistrictMap({
  stateCode,
  onClick,
  size = "100%",
  mapColor = "#fef3c7",
  strokeColor = "#c2410c",
  strokeWidth = "0.8",
  hoverColor = "#ea580c",
  className = "state-district-map",
}: StateDistrictMapProps) {
  const topoUrl = getStateTopoUrl(stateCode);
  const [topology, setTopology] = useState<Topology | null>(null);
  const [loading, setLoading] = useState(Boolean(topoUrl));
  const [error, setError] = useState<string | null>(null);
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);
  const [focusedDistrict, setFocusedDistrict] = useState<string | null>(null);

  useEffect(() => {
    if (!topoUrl) return;

    let cancelled = false;

    fetch(topoUrl)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load district map");
        return res.json();
      })
      .then((data: Topology) => {
        if (!cancelled) {
          setTopology(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("Unable to load district map. Please try again.");
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [topoUrl]);

  const districtPaths = useMemo((): DistrictPath[] => {
    if (!topology) return [];

    const districtsObject = topology.objects.districts;
    if (!districtsObject) return [];

    const collection = feature(
      topology,
      districtsObject,
    ) as FeatureCollection<Geometry, DistrictProperties>;

    const projection = geoMercator().fitSize(
      [MAP_WIDTH, MAP_HEIGHT],
      collection,
    );
    const pathGenerator = geoPath(projection);

    return collection.features
      .map((districtFeature) => ({
        d: pathGenerator(districtFeature) ?? "",
        district: districtFeature.properties.district,
        dtCode: districtFeature.properties.dt_code,
      }))
      .filter((entry) => entry.d.length > 0);
  }, [topology]);

  const handleDistrictClick = useCallback(
    (district: string) => {
      onClick?.(district);
    },
    [onClick],
  );

  if (!topoUrl) {
    return (
      <div
        className="flex h-[500px] items-center justify-center rounded-xl bg-orange-50 px-6 text-center"
        style={{ width: size }}
      >
        <p className="text-orange-700">District map not available for this region.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className="flex h-[500px] items-center justify-center rounded-xl bg-orange-50"
        style={{ width: size }}
      >
        <p className="text-orange-700">Loading district map...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex h-[500px] items-center justify-center rounded-xl bg-orange-50 px-6 text-center"
        style={{ width: size }}
      >
        <p className="text-orange-700">{error}</p>
      </div>
    );
  }

  return (
    <div className={className} style={{ width: size }}>
      <svg
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        width="100%"
        height="auto"
        role="img"
        aria-label="Interactive district map"
        className="block"
      >
        {districtPaths.map(({ d, district, dtCode }) => {
          const isActive =
            hoveredDistrict === district || focusedDistrict === district;

          return (
            <path
              key={dtCode}
              d={d}
              fill={isActive ? hoverColor : mapColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              className="cursor-pointer transition-colors duration-150"
              onMouseEnter={() => setHoveredDistrict(district)}
              onMouseLeave={() => setHoveredDistrict(null)}
              onFocus={() => setFocusedDistrict(district)}
              onBlur={() => setFocusedDistrict(null)}
              onClick={() => handleDistrictClick(district)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  handleDistrictClick(district);
                }
              }}
              tabIndex={0}
              aria-label={district}
            >
              <title>{district}</title>
            </path>
          );
        })}
      </svg>
    </div>
  );
}
