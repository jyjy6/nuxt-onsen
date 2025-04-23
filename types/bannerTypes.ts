export interface Banner {
  _id: string;
  title: string;
  mainImg: string;
  bannerPopup: string | null;
  timestamp: string;
  bannerNumber: number;
  selected: boolean;
}
