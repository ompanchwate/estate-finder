import express from "express";
import { createUser, bookVisit, getbookings, cancelBooking, toFav, getAllFavourites } from "../controllers/userController.js";
import jwtCheck from "../config/auth0Config.js";
const router = express.Router();

// jwtCheck is a middleware
router.post("/register", jwtCheck,  createUser);
router.post("/bookVisit/:id",jwtCheck, bookVisit);
router.post("/getBookings", getbookings);
router.post("/removebooking/:id",jwtCheck, cancelBooking);
router.post("/toFav/:rid",jwtCheck, toFav);
router.post("/allFav",jwtCheck, getAllFavourites);

export {router as userRoute}

