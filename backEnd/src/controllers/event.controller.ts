import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import {Request, Response} from "express"
import { User } from "@prisma/client";
import jwt, {JwtPayload} from 'jsonwebtoken'
import { prisma } from "..";

const isAdminCheck = async (userId: string) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.isAdmin) {
        throw new ApiError(403, "Access denied. Admins only!");
    }
};

const createEvent = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req.user as JwtPayload).userId;
    await isAdminCheck(userId);

    const {title, image, description, venue, performers, type, registrationLink, startsAt, endsAt, voting } = req.body; 

    // Input validation
    if (!title || !venue || !performers || !type || !startsAt || !endsAt || !image || voting === undefined) {
        throw new ApiError(400, "All fields (title, venue, performers, type, startsAt, endsAt, voting) except (description, registrationLink) are required");
    }
   
    if (
        typeof title !== "string" ||
        (description !== undefined && typeof description !== "string") || // Only check type if description exists
        typeof venue !== "string" ||
        !Array.isArray(performers) || 
        typeof type !== "string" ||
        typeof registrationLink !== "string" ||
        typeof voting !== "boolean" ||
        isNaN(new Date(startsAt).getTime()) ||
        isNaN(new Date(endsAt).getTime())
    ) {
        throw new ApiError(400, "Invalid input types");
    }    

    if (new Date(startsAt) >= new Date(endsAt)) {
        throw new ApiError(400, "Start time must be before end time!");
    }

    //Create event
    const event = await prisma.event.create({
        data: {
            title,
            image,
            description,
            venue,
            performers,
            type,
            registrationLink,
            startsAt,
            endsAt,
            voting
        },
    });

    return res.status(201).json(
        new ApiResponse<typeof event>({
            statusCode: 201,
            data: event,
            message: "Event created successfully",
        })
    );
});

const updateEvent = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req.user as JwtPayload).userId;
    await isAdminCheck(userId);

    const {eventId} = req.params;
    const {title, image, description, venue, performers, type, registrationLink, startsAt, endsAt, voting } = req.body;

    // Check if event exists
    const eventCheck = await prisma.event.findUnique({ where: { id: eventId } });
    if (!eventCheck) {
        throw new ApiError(404, "Event not found");
    }
    
    // type checking for only provided fields
    if (
        (req.body.title && typeof req.body.title !== "string") ||
        (req.body.description && typeof req.body.description !== "string") ||
        (req.body.venue && typeof req.body.venue !== "string") ||
        (req.body.performers && !Array.isArray(req.body.performers)) ||
        (req.body.type && typeof req.body.type !== "string") ||
        (registrationLink && typeof registrationLink !== "string") ||
        (req.body.voting !== undefined && typeof req.body.voting !== "boolean") || 
        (req.body.startsAt && isNaN(new Date(req.body.startsAt).getTime())) ||
        (req.body.endsAt && isNaN(new Date(req.body.endsAt).getTime()))
    ) {
        throw new ApiError(400, "Invalid input types");
    }

    if (new Date(startsAt) >= new Date(endsAt)) {
        throw new ApiError(400, "Start time must be before end time!");
    }

    //Update event
    const event = await prisma.event.update({
        where: {id: eventId},
        data: {
            title,
            image,
            description,
            venue,
            performers,
            type,
            registrationLink,
            startsAt,
            endsAt,
            voting
        },
    });

    return res.status(200).json(
        new ApiResponse<typeof event>({
            statusCode: 200,
            data: event,
            message: "Event updated successfully",
        })
    );
});

const deleteEvent = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req.user as JwtPayload).userId;
    await isAdminCheck(userId);

    const {eventId} = req.params;

    //Delete event
    await prisma.event.delete({
        where: {id: eventId}
    });

    return res.status(200).json(
        new ApiResponse<null>({
            statusCode: 200,
            data: null,
            message: "Event deleted successfully",
        })
    );
});

const getEvent = asyncHandler(async (req: Request, res: Response) => {
    const { eventId } = req.params;

    // Check if event exists
    const event = await prisma.event.findUnique({
        where: { id: eventId },
    });

    // Handle not found error
    if (!event) {
        throw new ApiError(404, "Event not found");
    }

    // Return event
    return res.status(200).json(
        new ApiResponse<typeof event>({
            statusCode: 200,
            data: event,
            message: "Event retrieved successfully",
        })
    );
});

const getAllEvents = asyncHandler(async (req: Request, res: Response) => {
    // Fetch all events from the database
    const events = await prisma.event.findMany();

    // Check if no events exist
    if (!events || events.length === 0) {
        throw new ApiError(404, "No events found");
    }

    // Return events
    return res.status(200).json(
        new ApiResponse<typeof events>({
            statusCode: 200,
            data: events,
            message: "Events retrieved successfully",
        })
    );
});


const getEvents = asyncHandler(async (req: Request, res: Response) => {
    const { type, startsAfter, endsBefore } = req.query;

    // Optional query filters
    const filters: any = {};

    // Filter by type
    if (type) {
        if (typeof type !== "string") {
            throw new ApiError(400, "Invalid type filter");
        }
        filters.type = type;
    }

    // Filter by start time
    if (startsAfter) {
        const startsAfterDate = new Date(startsAfter as string);
        if (isNaN(startsAfterDate.getTime())) {
            throw new ApiError(400, "Invalid startsAfter date");
        }
        filters.startsAt = { gte: startsAfterDate };
    }

    // Filter by end time
    if (endsBefore) {
        const endsBeforeDate = new Date(endsBefore as string);
        if (isNaN(endsBeforeDate.getTime())) {
            throw new ApiError(400, "Invalid endsBefore date");
        }
        filters.endsAt = { lte: endsBeforeDate };
    }

    // Fetch filtered events
    const events = await prisma.event.findMany({
        where: filters,
        orderBy: { startsAt: "asc" }, // Order events by start time
    });

    // Handle no events found
    if (events.length === 0) {
        throw new ApiError(404, "No events found matching the criteria");
    }

    return res.status(200).json(
        new ApiResponse<typeof events>({
            statusCode: 200,
            data: events,
            message: "Events retrieved successfully",
        })
    );
});

// getTopThreeOfParticularEvent controller -> naming it getTopThree
const getTopThree = async (req: any, res: any) => {
    // If its not the admin hitting this route, give error. -> No! This result should be available to every user.
    // const userId = (req.user as JwtPayload).userId;
    // await isAdminCheck(userId);

  const { eventId } = req.params;

  if (!eventId) {
    return res.status(400).json({ error: 'Event ID is required.' });
  }

  try {
    // Query performances and aggregate true and false vote counts in a single database call
    const performances = await prisma.performance.findMany({
      where: { eventId },
      include: {
        _count: {
          select: {
            votes: true, // Total votes
          },
        },
        votes: {
          select: {
            vote: true,
          },
        },
      },
    });

    // If no performances are found for the event, return an error
    if (performances.length === 0) {
      return res.status(404).json({ error: 'Event or performances not found.' });
    }

    // Compute rankings with trueVotes and falseVotes
    const rankings = performances
      .map((performance) => {
        const trueVotes = performance.votes.filter((vote) => vote.vote === true).length;
        const falseVotes = performance.votes.filter((vote) => vote.vote === false).length;

        return {
          id: performance.id,
          name: performance.name,
          trueVotes,
          falseVotes,
        };
      })
      .sort((a, b) => {
        // Sort by true votes descending, then by false votes ascending
        if (b.trueVotes !== a.trueVotes) {
          return b.trueVotes - a.trueVotes;
        }
        return a.falseVotes - b.falseVotes;
      });

    // Get the top 3 performances
    const topThree = rankings.slice(0, 3);

    return res.status(200).json({
      message: 'Top 3 performances for the event retrieved successfully.',
      topThree,
    });
  } catch (error) {
    console.error('Error fetching top 3 performances:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};



export {createEvent, updateEvent, deleteEvent, getEvent, getEvents, getTopThree, getAllEvents}