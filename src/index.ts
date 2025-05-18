import express from "express";
import mongoose from "mongoose";
import { ContentModel, LinkModel, UserModel } from "./db";
import { protect } from "./middleware";
import { signupSchema, loginSchema } from "./zodTypes/user";
import { contentBody } from "./zodTypes/content";
import { signToken } from "./auth";
import { randomStr } from "./utils";
import { DB_CONNECTION, PORT } from "./config";
import { shareLinkParam } from "./zodTypes/link";

mongoose
  .connect(DB_CONNECTION)
  .then(() => {
    console.log("connected to MongoDb");
  })
  .catch(() => {
    console.log("could not connect to MongoDb");
  });

const app = express();
app.use(express.json());

const apiV1Router = express.Router();

apiV1Router.post("/signup", async (req, res) => {
  const parseResult = signupSchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ errors: parseResult.error.errors });
    return;
  }

  const { username, password } = parseResult.data;

  try {
    const user = await UserModel.create({ username, password });
    const token = signToken(user._id);

    res.status(200).json({
      message: "User has been signed up",
      user,
      token,
    });
  } catch (e) {
    res.status(400).json({
      message: "Request failed",
    });
  }
});

apiV1Router.post("/login", async (req, res) => {
  const parseResult = loginSchema.safeParse(req.body);

  if (!parseResult.success) {
    res.status(400).json({ errors: parseResult.error.errors });
    return;
  }

  const user = await UserModel.findOne(parseResult.data);
  if (!user) {
    res.status(400).json({
      message: "User does not exist",
    });
    return;
  }

  const token = signToken(user._id);

  res.status(200).json({
    token,
    message: "logged in successfully",
  });
});

apiV1Router.post("/content", protect, async (req, res) => {
  const { link, title } = req.body;
  const parseResult = contentBody.safeParse({
    link,
    title,
    userId: req.userId,
    tags: [],
  });

  if (!parseResult.success) {
    res.status(400).json({ error: parseResult.error.errors });
    return;
  }
  console.log(parseResult.data);
  const newContent = await ContentModel.create(parseResult.data);

  res.status(200).json({
    message: "content added",
    content: newContent,
  });
});

// apiV1Router.get("/content", protect, async (req, res) => {
//   const content = await ContentModel.find({
//     userId: req.userId,
//   }).populate("userId", "username");

//   res.status(200).json({
//     message: "success",
//     data: content,
//   });
// });

apiV1Router.get("/content", async (_req, res) => {
  const content = await ContentModel.find();

  res.status(200).json({
    message: "success",
    data: content,
  });
});

apiV1Router.delete("/content", protect, async (req, res) => {
  const { contentId } = req.body;

  await ContentModel.deleteMany({
    _id: contentId,
    userId: req.userId,
  });

  res.status(200).json({
    message: "content deleted",
  });
});

apiV1Router.post("/brain/share", protect, async (req, res) => {
  const { share } = req.body;

  if (!share) {
    await LinkModel.deleteOne({ userId: req.userId });
    res.status(200).json({
      message: "deleted shareable link",
    });
    return;
  }

  const existingLink = await LinkModel.findOne({ userId: req.userId });
  if (existingLink) {
    res.status(200).json({
      message: "Existing shareable link found",
      hash: existingLink.hash,
    });
    return;
  }

  const newLink = await LinkModel.create({
    userId: req.userId,
  });
  if (newLink) {
    res.status(200).json({
      message: "Shareable link created",
      link: newLink.hash,
    });
    return;
  }

  res.status(200).json({ message: "link could not be created" });
});

apiV1Router.get("/brain/:shareLink", async (req, res) => {
  const parseResult = shareLinkParam.safeParse(req.params);
  if (!parseResult.success) {
    res.status(400).json({ error: "Invalid shareLink" });
    return;
  }

  const { shareLink: hash } = req.params;
  const link = await LinkModel.findOne({ hash }).lean();

  if (!link) {
    res.status(400).json({ error: "Invalid shareLink" });
    return;
  }

  const content = await ContentModel.find({ userId: link.userId }).lean();
  const user = await UserModel.findById(link.userId).lean();
  if (!user) {
    res.status(411).json({
      message: "User not found, error should ideally not happen",
    });
    return;
  }

  res.status(200).json({
    username: user.username,
    content,
  });
});

app.use("/api/v1", apiV1Router);
app.listen(PORT);
console.log(`Listening on port ${PORT}`);
