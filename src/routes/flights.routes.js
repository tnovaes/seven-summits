import { Router } from "express";
import { getFlightsBySummit } from "../controllers/flights.controllers.js";

const flightsRouter = Router();

flightsRouter.get("/flights/:summit", getFlightsBySummit);

export default flightsRouter;