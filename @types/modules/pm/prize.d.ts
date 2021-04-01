declare interface PMPrizeUpdateRequest {
    prizeDisplayName?: string;
    prizePrice?: string;
    prizeListingName?: string;
    prizeUrl?: string;
    prizeasin?: string;
  }
  
  declare interface PMPrizeCreateRequest extends PMPrizeUpdateRequest {
    prizeId: string;
    prizeDisplayName: string;
    prizePrice: string;
    prizeListingName: string;
    prizeUrl: string;
    prizeasin: string;

  }
  
  declare interface PMPrize extends PMPrizeCreateRequest {
    
  }
  
  declare interface PMPrizeList {
    Prize: PMPrize[];
  }

