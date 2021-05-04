import { useState, useEffect } from 'react';
const { storage } = chrome || browser;

// this hook only work in a webextension env.
const useStorage = (key, area = 'local', initialValue) => {
  const [value, set] = useState(initialValue);

  useEffect(() => {
    storage[area].get(key, (data) => {
      if (initialValue && !data[key]) {
        return storage[area].set({
          [key]: initialValue,
        });
      }
      set(data[key]);
    });

    const setChangedData = (data) => set(data[key].newValue);

    storage.onChanged.addListener(setChangedData);
    return () => storage.onChanged.removeListener(setChangedData);
  }, [key, area, initialValue]);

  return [
    value,
    (newValue) => {
      storage[area].set({
        [key]: newValue,
      });
    },
  ];
};

export default useStorage;
