export interface Launch {
  flight_number: number;
  mission_name: string;
  launch_year: string;
  details: string | null;

  links?: {
    mission_patch_small?: string | null;
    mission_patch?: string | null;
  };

  rocket?: {
    rocket_name?: string;
  };
}
