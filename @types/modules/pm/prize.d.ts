declare interface PMPrizeUpdateRequest {
  prizeDisplayName?: string;
  prizePrice?: number;
  prizeListingName?: string;
  prizeUrl?: string;
  prizeASIN?: string;
}

declare interface PMPrizeCreateRequest extends PMPrizeUpdateRequest {
  prizeId: string;
  prizeDisplayName: string;
  prizePrice: number;
  prizeListingName: string;
  prizeUrl: string;
  prizeASIN: string;
}

declare interface PMPrize extends PMPrizeCreateRequest {}

declare interface PMPrizeList {
  prizes: PMPrize[];
}
