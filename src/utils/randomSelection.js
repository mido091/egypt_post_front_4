const STORAGE_KEY_GOVS = "most_visited_govs_v1";
const STORAGE_KEY_OFFICES = "most_visited_offices_v1";
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

// Helper to check if cache is valid
const isCacheValid = (timestamp) => {
  if (!timestamp) return false;
  return Date.now() - timestamp < ONE_WEEK_MS;
};

// Helper to get random items from array
const getRandomItems = (arr, count) => {
  if (!arr || arr.length === 0) return [];
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const getMostVisitedGovernorates = (governoratesObj) => {
  // Check local storage
  try {
    const cached = localStorage.getItem(STORAGE_KEY_GOVS);
    if (cached) {
      const { timestamp, data } = JSON.parse(cached);
      if (isCacheValid(timestamp)) {
        return data;
      }
    }
  } catch (e) {
    console.error("Error reading from localStorage", e);
  }

  const allGovNames = Object.keys(governoratesObj);
  if (allGovNames.length === 0) return [];

  // 1. Identify Cairo and Giza
  const cairoKey = allGovNames.find(
    (k) => k.toLowerCase().includes("cairo") || k.includes("القاهرة")
  );
  const gizaKey = allGovNames.find(
    (k) => k.toLowerCase().includes("giza") || k.includes("الجيزة")
  );

  const fixedGovs = [];
  if (cairoKey) fixedGovs.push(cairoKey);
  if (gizaKey) fixedGovs.push(gizaKey);

  // 2. Select 5 random from first 20 (excluding Cairo/Giza)
  const first20 = allGovNames.slice(0, 20);
  const candidates = first20.filter((k) => k !== cairoKey && k !== gizaKey);

  const randomGovs = getRandomItems(candidates, 5);

  const result = [...fixedGovs, ...randomGovs];

  // Save to storage
  try {
    localStorage.setItem(
      STORAGE_KEY_GOVS,
      JSON.stringify({
        timestamp: Date.now(),
        data: result,
      })
    );
  } catch (e) {
    console.error("Error saving to localStorage", e);
  }

  return result;
};

export const getMostVisitedOffices = (governoratesObj) => {
  // Check local storage
  try {
    const cached = localStorage.getItem(STORAGE_KEY_OFFICES);
    if (cached) {
      const { timestamp, data } = JSON.parse(cached);
      if (isCacheValid(timestamp)) {
        return data;
      }
    }
  } catch (e) {
    console.error("Error reading from localStorage", e);
  }

  const allGovNames = Object.keys(governoratesObj);
  if (allGovNames.length === 0) return [];

  const cairoKey = allGovNames.find(
    (k) => k.toLowerCase().includes("cairo") || k.includes("القاهرة")
  );
  const gizaKey = allGovNames.find(
    (k) => k.toLowerCase().includes("giza") || k.includes("الجيزة")
  );

  let selectedOffices = [];

  // 4 random from Cairo
  if (cairoKey && governoratesObj[cairoKey]) {
    const cairoOffices = governoratesObj[cairoKey];
    selectedOffices = [
      ...selectedOffices,
      ...getRandomItems(cairoOffices, 4).map((o) => ({
        ...o,
        govName: cairoKey,
      })),
    ];
  }

  // 2 random from Giza
  if (gizaKey && governoratesObj[gizaKey]) {
    const gizaOffices = governoratesObj[gizaKey];
    selectedOffices = [
      ...selectedOffices,
      ...getRandomItems(gizaOffices, 2).map((o) => ({
        ...o,
        govName: gizaKey,
      })),
    ];
  }

  // Save to storage
  try {
    localStorage.setItem(
      STORAGE_KEY_OFFICES,
      JSON.stringify({
        timestamp: Date.now(),
        data: selectedOffices,
      })
    );
  } catch (e) {
    console.error("Error saving to localStorage", e);
  }

  return selectedOffices;
};
