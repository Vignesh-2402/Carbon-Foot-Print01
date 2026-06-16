const EMISSION_FACTORS = {
  transportation: {
    car: 0.192,
    bus: 0.089,
    train: 0.041,
    flight: 0.255
  },
  energy: {
    electricity: 0.4,
    gas: 2.04,
    heating: 0.25
  },
  food: {
    meat: 27.0,
    vegetarian: 6.61,
    vegan: 2.89
  },
  shopping: {
    clothing: 24.0,
    electronics: 50.0
  },
  waste: {
    recycled: 0.0,
    landfill: 0.5
  }
};

const UNITS = {
  car: 'km',
  bus: 'km',
  train: 'km',
  flight: 'km',
  electricity: 'kWh',
  gas: 'm3',
  heating: 'kWh',
  meat: 'kg',
  vegetarian: 'kg',
  vegan: 'kg',
  shopping: 'units',
  waste: 'kg'
};

export const calculateCarbon = (type, quantity) => {
  let category;
  let factor;

  for (const [key, types] of Object.entries(EMISSION_FACTORS)) {
    if (types[type]) {
      category = key;
      factor = types[type];
      break;
    }
  }

  if (!factor) {
    throw new Error(`Unknown activity type: ${type}`);
  }

  return {
    carbonCalculated: quantity * factor,
    category,
    unit: UNITS[type]
  };
};

export const EMISSION_FACTORS_EXPORT = EMISSION_FACTORS;
