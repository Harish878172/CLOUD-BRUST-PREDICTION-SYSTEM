type Props = {
  data: number[];
  color?: string;
  height?: number;
  fillId?: string;
};

export function TrendChart({ data, color = "#60A5FA", height = 90, fillId = "grad" }: Props) {
  const w = 300;
  const h = height;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = w / (data.length - 1);

  const points = data.map((v, i) => {
    const x = i * step;
    const y = h - ((v - min) / range) * (h - 20) - 10;
    return [x, y] as const;
  });

  const path = points
    .map(([x, y], i) => {
      if (i === 0) return `M ${x},${y}`;
      const [px, py] = points[i - 1];
      const cx = (px + x) / 2;
      return `Q ${cx},${py} ${cx},${(py + y) / 2} T ${x},${y}`;
    })
    .join(" ");

  const area = `${path} L ${w},${h} L 0,${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.45" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${fillId})`} />
      <path d={path} stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {points.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === points.length - 1 ? 4 : 0} fill={color} />
      ))}
    </svg>
  );
}
