import { Router } from "express";
import { getFlightInfo, getFlightsBySummit, insertFlight } from "../controllers/flights.controllers.js";

const flightsRouter = Router();

flightsRouter.get("/flights", getFlightsBySummit);
flightsRouter.get("/flights/:id", getFlightInfo);
flightsRouter.post("/flights", insertFlight);

export default flightsRouter;