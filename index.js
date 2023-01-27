import { createSchema, createYoga } from "graphql-yoga";
import { createServer } from "node:http";
import fetch from "node-fetch";

const typeDefinitions = ` 
type Query {
  asteroidsNear : AsteroidsNear
},

type MissDistance {
  astronomical: String,
  lunar: String,
  kilometers: String,
  miles: String
},

type RelativeVelocity {
  kilometers_per_second: String,
  kilometers_per_hour: String,
  miles_per_hour: String
},

type CloseApproachData {
  close_approach_date: String,
  close_approach_date_full: String,
  epoch_date_close_approach: Int,
  orbiting_body: String,
  miss_distance: MissDistance,
  relative_velocity: RelativeVelocity
},

type Feet {
  estimated_diameter_min: Float,
  estimated_diameter_max: Float
},

type Miles {
  estimated_diameter_min: Float,
  estimated_diameter_max: Float
},

type Meters {
  estimated_diameter_min: Float,
  estimated_diameter_max: Float
},

type Kilometers {
  estimated_diameter_min: Float,
  estimated_diameter_max: Float
},

type EstimatedDiameter {
  feet: Feet,
  miles: Miles,
  meters: Meters,
  kilometers: Kilometers
},

type Today {
  id: String,
  neo_reference_id: String,
  name: String,
  nasa_jpl_url: String,
  absolute_magnitude_h: Int,
  is_potentially_hazardous_asteroid: Boolean,
  is_sentry_object: Boolean,
  close_approach_data: [CloseApproachData],
  estimated_diameter: EstimatedDiameter,
  links: Links
},

type NearEarthObjects {
  today: [Today]
},

type Links {
  next: String,
  prev: String,
  self: String
},

type AsteroidsNear {
  element_count: Int,
  near_earth_objects: NearEarthObjects,
  links: Links
}

`;

const yoga = createYoga({
  schema: createSchema({
    typeDefs: typeDefinitions,
    resolvers: {
      Query: {
        asteroidsNear: async () => {
          let res = await fetch("https://api.nasa.gov/neo/rest/v1/feed?start_date=2023-01-27&end_date=2023-01-27&api_key=DEMO_KEY");
          res = await res.text();
          res = res.replaceAll("2023-01-27", "today");
          res = JSON.parse(res);
          return res;
        },
      },
    },
  }),
});

const server = createServer(yoga);

server.listen(4000, () => {
  console.info("Server is running on http://localhost:4000/graphql");
});
