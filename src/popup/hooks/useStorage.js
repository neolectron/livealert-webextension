import { useState, useEffect } from 'react';

// this hook only work in a webextension context.
const useStorage = (key, area = 'local', initialValue) => {
  const [value, set] = useState(initialValue);
  const { storage } = window.chrome || window.browser;

  useEffect(() => {
    storage[area].get(key, (data) => set(data[key]));
  }, [key, area, storage]);

  useEffect(() => {
    const setData = (data) => set(data[key].newValue);

    storage.onChanged.addListener(setData);
    return () => storage.onChanged.removeListener(setData);
  }, [key, storage.onChanged]);

  return [
    value,
    (value) => {
      storage[area].set({
        [key]: value,
      });
    },
  ];
};

export default useStorage;
