import { img } from "./utils";

export const IMAGES = {
  map: img("/images/map.jpg"),
  title: img("/images/title.jpg"),
  ship: img("/images/ship.png"),
  compass: img("/images/compass.jpg"),
  chestClosed: img("/images/chest-closed.jpg"),
  chestOpen: img("/images/chest-open.jpg"),
  islandMeeting: img("/images/island-meeting.jpg"),
  bayDate: img("/images/bay-date.jpg"),
  mountainAdventure: img("/images/mountain-adventure.jpg"),
  caveProposal: img("/images/cave-proposal.jpg"),
  islandWedding: img("/images/island-wedding.jpg"),
} as const;
