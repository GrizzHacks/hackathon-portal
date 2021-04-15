// From SimCity Loading messages, as extracted at https://gist.github.com/erikcox/7e96d031d00d7ecb1a2f
const randomLoadingMessages = [
  "Applying Theatre Soda Layer",
  "Breeding Fauna",
  "Bureacritizing Bureaucracies",
  "Calculating Llama Expectoration Trajectory",
  "Compressing Fish Files",
  "Deciding What Message to Display Next",
  "Deunionizing Bulldozers",
  "Gesticulating Mimes",
  "Graphing Whale Migration",
  "Initializing Rhinoceros Breeding Timetable",
  "Inserting Sublimated Messages",
  "Realigning Alternate Time Frames",
  "Reticulating Splines",
  "Scattering Rhino Food Sources",
  "Searching for Llamas",
];

export const getRandomLoadingMessage = () => {
  return randomLoadingMessages[
    Math.floor(Math.random() * randomLoadingMessages.length)
  ];
};
