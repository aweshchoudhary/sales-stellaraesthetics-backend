import { ConfigParams } from "express-openid-connect";

const auth0Config: ConfigParams = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUHT0_CLIENT_SECRET ?? "",
  baseURL: process.env.AUTH0_BASEURL ?? "http://localhost:5000",
  clientID: process.env.AUTH0_CLIENT_ID ?? "",
  issuerBaseURL: process.env.AUTH0_ISSURE_BASE_URL ?? "",
  clientSecret: process.env.AUHT0_CLIENT_SECRET ?? "",
  authorizationParams: {
    response_type: "code",
    audience: process.env.AUTH0_AUDIENCE,
    scope: "openid profile email", // Add necessary scopes
  },
};

export default auth0Config;
