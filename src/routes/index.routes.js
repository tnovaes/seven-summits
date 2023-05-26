import { Router } from "express";
import flightsRouter from "./flights.routes.js";
import hotelsRouter from "./hotels.routes.js";

const router = Router();
router.use(flightsRouter);
router.use(hotelsRouter);

export default router;