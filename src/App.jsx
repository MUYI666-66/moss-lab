import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import useDeviceDetect from './hooks/useDeviceDetect';

export default function App() {
  const isMobile = useDeviceDetect(768);

  return (
    <main className="relative w-full h-full bg-moss-bg text-moss-text">
      <Navbar />
      <HeroSection isMobile={isMobile} />
    </main>
  );
}
