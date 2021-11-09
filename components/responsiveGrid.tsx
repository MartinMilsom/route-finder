import { Grid, GridSizeType, ResponsiveContext } from "grommet";
import { FillType, GapType } from "grommet/utils";
import React from "react";
import { ReactNode } from "react";

interface GridAreas {
    [key: string]: { name?: string; start?: number[]; end?: number[] }[];
}

interface ResponsiveGridProps {
    areas: GridAreas;
    children: ReactNode[] | undefined;
    fill: FillType;
    rows?: GridSizeType | GridSizeType[];
    columns?:
    | GridSizeType
    | GridSizeType[]
    | {
        count?: 'fit' | 'fill' | number;
        size?: GridSizeType;
      };
    gap?: GapType | { row?: GapType; column?: GapType };
}

const ResponsiveGrid = ({ children, areas, ...props }: ResponsiveGridProps) => {
    const size: string = React.useContext(ResponsiveContext);
    return (
      <Grid 
        gap={{
          row: "medium",
          column: size == "large" || size == "medium" ? "medium" : "none"
        }}
        areas={areas[size]}
        {...props}>
        {children}
      </Grid>
    );  
  };

export default ResponsiveGrid;