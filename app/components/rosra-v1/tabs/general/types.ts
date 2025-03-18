export interface Country {
  name: string;
  iso2: string;
  currency: string;
  currency_name: string;
  currency_symbol: string;
  states: {
    id: number;
    name: string;
    state_code: string;
    type: string | null;
  }[];
}

export interface EconomicData {
  country: string;
  iso2: string;
  years: {
    [year: string]: {
      "GDP/capita": number;
      "Population": number;
      "Average Household size": number;
    };
  };
}

export interface EditMode {
  row: string | null;
  year: string | null;
} 