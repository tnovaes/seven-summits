import { Router } from "express";
import { getHotelInfo, getHotelsBySummit, insertHotel } from "../controllers/hotels.controllers.js";

const hotelsRouter = Router();

hotelsRouter.get("/hotels/:summit", getHotelsBySummit);
hotelsRouter.get("/hotels/id/:id", getHotelInfo);
hotelsRouter.post("/hotels", insertHotel);


export default hotelsRouter;