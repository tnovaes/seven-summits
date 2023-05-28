import { Router } from "express";
import { getHotelInfo, getHotelsBySummit, insertHotel } from "../controllers/hotels.controllers.js";

const hotelsRouter = Router();

hotelsRouter.get("/hotels", getHotelsBySummit);
hotelsRouter.get("/hotels/:id", getHotelInfo);
hotelsRouter.post("/hotels", insertHotel);


export default hotelsRouter;