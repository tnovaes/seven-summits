import { Router } from "express";
import flightsRouter from "./flights.routes.js";

const router = Router();
router.use(flightsRouter);

export default router;