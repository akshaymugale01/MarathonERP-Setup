// src/db/mongoClient.ts
import { MongoClient } from "mongodb";
import { MONGO_URI } from "../constants/server";

export const getMongoClient = () => new MongoClient(MONGO_URI);
