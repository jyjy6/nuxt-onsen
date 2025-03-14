export interface Episode {
  _id: string;
  contentsCode: string;
  mainImg: string;
  episode: string;
  episodeName: string;
  contentsLink: string;
  omake: string;
  guest?: string[];
  date: string;
  uploadDate: string;
}
