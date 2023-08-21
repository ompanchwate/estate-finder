import asyncHandler from 'express-async-handler';

import { prisma } from '../config/prismaConfig.js';

export const createUser = asyncHandler(async (req, res) => {
    // console.log("creating a user");  

    let { email } = req.body;

    const userExists = await prisma.user.findUnique({ where: { email: email } })
    if (!userExists) {
        const user = await prisma.user.create({ data: req.body })
        res.send({
            message: "User Resistered Successfully",
            user: user
        });
    }

    else res.status(201).send({ message: "User already registered" })
})


// Book the visits
export const bookVisit = asyncHandler(async (req, res) => {
    const { email, date } = req.body;
    const { id } = req.params

    try {
        const alreadyBooked = await prisma.user.findUnique({
            where: { email: email },
            select: { bookedVisits: true }
        })

        if (alreadyBooked.bookedVisits.some((visits) => visits.id === id)) {
            res.status(400).json({ message: "Already Booked by you!" })
        } else {
            await prisma.user.update({
                where: { email: email },
                data: {
                    bookedVisits: { push: { id: id, date: date } }
                }
            });
            res.send("Your visit is booked successfully");
        }
    }
    catch (err) {
        throw new Error(err.message);
    }
});


// Get all bookings of the User
export const getbookings = asyncHandler(async (req, res) => {
    const { email } = req.body
    try {
        const bookings = await prisma.user.findUnique({
            where: { email: email },
            select: { bookedVisits: true }
        });

        res.status(200).send(bookings);
    } catch (error) {
        throw new Error(error.message);
    }
});

// Cancel the booked Visits 
export const cancelBooking = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const { id } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: { email: email },
            select: { bookedVisits: true }
        })

        const index = user.bookedVisits.findIndex((visit) => visit.id === id)

        if (index === -1) {
            res.status(404).json({ messaage: "Booking not found" })
        } else {
            user.bookedVisits.splice(index, 1)  // Deleting the booked visit
            await prisma.user.update({
                where: { email: email },
                data: { bookedVisits: user.bookedVisits }
            })

            res.send("Booking cancelled successfully");
        }
    } catch (err) {
        throw new Error(err.message);
    }
});


// Add the Residency in favourite list of the user
export const toFav = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const { rid } = req.params;

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (user.favResidenciesID.includes(rid)) {
            const updateUser = await prisma.user.update({
                where: { email: email },
                data: {
                    favResidenciesID: { set: user.favResidenciesID.filter((id) => id !== rid) }
                }
            })

            res.send({ message: "Removed from the favorites", user: updateUser })
        } else {
            const updateUser = await prisma.user.update({
                where: { email: email },
                data: {
                    favResidenciesID: {
                        push: rid
                    }
                }
            });
            res.send({ message: "Updated favourite", user: updateUser })
        }

    } catch (err) {
        throw new Error(err.message);
    }
});




// Get all favourite
export const getAllFavourites = asyncHandler(async (req, res) => {
    const { email } = req.body;
    try {
        const favResd = await prisma.user.findUnique({
            where: { email: email },
            select: { favResidenciesID: true }
        });
        res.status(200).send(favResd);
    } catch (err) {
        throw new Error(err.message);
    }

})