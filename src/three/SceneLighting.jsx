export default function SceneLighting() {
  return (
    <>
      {/* Soft ambient fill */}
      <ambientLight intensity={0.45} color="#8EA89A" />

      {/* Key light — warm directional */}
      <directionalLight
        position={[4, 4, 5]}
        intensity={0.9}
        color="#E8DCC8"
      />

      {/* Fill light — cooler */}
      <directionalLight
        position={[-3, 1, -2]}
        intensity={0.3}
        color="#A0B8C8"
      />

      {/* Rim / accent light */}
      <pointLight
        position={[1, 2, -3]}
        intensity={0.4}
        color="#C8D8C0"
      />

      {/* Subtle bottom bounce */}
      <pointLight
        position={[0, -2, 1]}
        intensity={0.2}
        color="#6A7A5E"
      />
    </>
  );
}
