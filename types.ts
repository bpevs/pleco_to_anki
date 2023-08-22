export interface PlecoResponse {
  xml: {
    "@version": number;
    "@encoding": "string";
  };
  plecoflash: {
    "@formatversion": number;
    "@creator": string;
    "@generator": string;
    "@platform": string;
    "@created": number;
    categories: {
      category: PlecoCategory[];
    };
    cards: {
      card: PlecoCard[];
    };
  };
}

interface PlecoCategory {
  "@name": string;
  "#text": string | null;
}

interface Catassign {
  "@category": string;
  "#text": string | null;
}

export interface PlecoCard {
  "@language": string;
  entry: {
    headword: Array<{
      "@charset": "sc" | "tc";
      "#text": string; // chinese str
    }>;
    pron: {
      "@type": string;
      "@tones": string;
      "#text": string;
    };
    defn: string;
  };
  dictref: {
    "@dictid": string;
    "@entryid": number;
    text: string | null;
  };
  catassign: Catassign | Catassign[];
}

export interface AnkiCardData {
  pinyin?: string;
  definition?: string;
  simplifiedText?: string;
  traditionalText?: string;
}
