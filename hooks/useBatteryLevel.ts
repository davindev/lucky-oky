import { useBatteryLevel as useInitialBatteryLevel } from 'expo-battery';

export default function useBatteryLevel() {
  const initialBatteryLevel = useInitialBatteryLevel();
  const batteryLevel = +initialBatteryLevel.toFixed(2) * 100;

  return batteryLevel;
}
