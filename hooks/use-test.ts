import { parseAsFloat, useQueryStates } from "nuqs";

export const useTest = () => {
  const [{ latitude, longitude }, setCoordinates] = useQueryStates(
    {
      // Use variable names that make sense in your codebase
      latitude: parseAsFloat.withDefault(23.6),
      longitude: parseAsFloat.withDefault(23.6),
    },
    {
      urlKeys: {
        // And remap them to shorter keys in the URL
        latitude: "lat",
        longitude: "lng",
      },
    }
  );
  const onChange = () => {
    setCoordinates({
      latitude: 45.18,
    });
  };
  return { onChange, latitude, longitude };
};
