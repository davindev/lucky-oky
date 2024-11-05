import { useState, useCallback, useEffect } from 'react';
import { getBatteryLevelAsync } from 'expo-battery';

const DEFAULT_BATTERY_LEVEL = -100;
const CHECK_INTERVAL_MS = 60_000;

export default function useBatteryLevel() {
  const [batteryLevel, setBatteryLevel] = useState(DEFAULT_BATTERY_LEVEL);

  const checkBatteryLevel = useCallback(async () => {
    const initialBatteryLevel = await getBatteryLevelAsync();
    const realTimeBatteryLevel = +initialBatteryLevel.toFixed(2) * 100;

    setBatteryLevel(realTimeBatteryLevel);

    setTimeout(checkBatteryLevel, CHECK_INTERVAL_MS);
  }, []);

  useEffect(() => {
    checkBatteryLevel();
  }, [checkBatteryLevel]);

  return batteryLevel;
}
