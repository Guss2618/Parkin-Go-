import { useMemo } from "react";
import { View } from "react-native";
import type { ViewProps } from "react-native";

// Based on https://github.com/react-native-linear-gradient/react-native-linear-gradient/blob/741f3d18815b5f02dbba70a376c60ab65fa627c4/index.d.ts#L5C20-L13
export interface LinearGradientProps extends ViewProps {
  colors: (string | number)[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  locations?: number[];
  useAngle?: boolean;
  angleCenter?: { x: number; y: number };
  angle?: number;
}

type RequiredProps = Required<LinearGradientProps>;

function getCssColors(
  colors: RequiredProps["colors"],
  locations: RequiredProps["locations"],
) {
  return colors
    .map((color, i) =>
      locations?.[i] != null ? `${color} ${locations[i] * 100}%` : color,
    )
    .join(",");
}

function getSvgColors(
  colors: RequiredProps["colors"],
  locations: RequiredProps["locations"],
) {
  return colors
    .map((color, i) => {
      const offsetValue =
        locations?.[i] != null
          ? locations[i]
          : colors.length === 1
            ? 0
            : i / (colors.length - 1);
      const normalizedOffset = Math.max(0, Math.min(offsetValue, 1)); // Ensure offset is between 0 and 1
      return `<stop offset="${normalizedOffset * 100}%" stop-color="${color}" />`;
    })
    .join("");
}

const toPercent = (v: number): string => v * 100 + "%";

export function getLinearGradientBackgroundImage(
  start: RequiredProps["start"],
  end: RequiredProps["end"],
  locations: RequiredProps["locations"],
  colors: RequiredProps["colors"],
  useAngle: LinearGradientProps["useAngle"],
  angle: RequiredProps["angle"],
) {
  if (useAngle) {
    return `linear-gradient(${angle}deg, ${getCssColors(colors, locations)})`;
  }

  const svgColors = getSvgColors(colors, locations);
  const svgGradient = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><linearGradient id="g" gradientUnits="userSpaceOnUse" x1="${toPercent(start.x)}" y1="${toPercent(start.y)}" x2="${toPercent(end.x)}" y2="${toPercent(end.y)}">${svgColors}</linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svgGradient)}")`;
}

const emptyArray: [] = [];
const defaultStart = { x: 0.5, y: 0 };
const defaultEnd = { x: 0.5, y: 1 };

function LinearGradientWeb({
  start = defaultStart,
  end = defaultEnd,
  locations = emptyArray,
  colors = emptyArray,
  useAngle,
  angle = 0,
  ...viewProps
}: LinearGradientProps) {
  "use memo";

  const bgStyle = useMemo((): ViewProps["style"] => {
    const linearGradientBackgroundImage = getLinearGradientBackgroundImage(
      start,
      end,
      locations,
      colors,
      useAngle,
      angle,
    );

    return {
      // @ts-expect-error
      backgroundImage: linearGradientBackgroundImage,
    };
  }, [start, end, locations, colors, useAngle, angle]);

  return <View {...viewProps} style={[viewProps.style, bgStyle]} />;
}

export default LinearGradientWeb;
