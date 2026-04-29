import express, { type Request, type Response, type NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { authModule } from "./modules/auth/auth.module";
import { skillsModule } from "./modules/skills/skills.module";
import { profileModule } from "./modules/profile/profile.module";
import { errorHandler, notFound } from "./middleware/error";
import { listingsModule } from "./modules/listings/listings.module";
import { categoryModule } from "./modules/category/category.module";
import { chatModule } from "./modules/chat/chat.module";
import { messagesModule } from "./modules/messages/messages.module";
import { interestsModule } from "./modules/interests/interests.module";
import { tradesModule } from "./modules/trades/trades.module";
import { reportsModule } from "./modules/reports/reports.module";

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use((req: Request, _res: Response, next: NextFunction) => {
    console.log(`${req.method} ${req.path}`, {
      body: req.body,
      auth: req.headers.authorization,
    });
    next();
  });

  app.get("/", (_req: Request, res: Response) => res.send("Welcome to the Acity Connect API"));

  app.use("/api/v1/auth", authModule());
  app.use("/api/v1/skills", skillsModule());
  app.use("/api/v1/profile", profileModule());
  app.use("/api/v1/listings", listingsModule());
  app.use("/api/v1/category", categoryModule());
  app.use("/api/v1/chat", chatModule());
  app.use("/api/v1/messages", messagesModule());
  app.use("/api/v1/interests", interestsModule());
  app.use("/api/v1/trades", tradesModule());
  app.use("/api/v1/reports", reportsModule());
  app.use(notFound);
  app.use(errorHandler);

  return app;
}