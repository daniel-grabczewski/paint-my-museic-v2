export type PointType = {
  x: number;
  y: number;
};

export interface OnDrawFunc {
  (
    ctx: CanvasRenderingContext2D,
    point: PointType,
    prevPoint: PointType | null
  ): void;
}

export type ColorType = {
  color: string;
  code: string;
  music: string;
};

export interface CanvasProps {
  width: number;
  height: number;
}
