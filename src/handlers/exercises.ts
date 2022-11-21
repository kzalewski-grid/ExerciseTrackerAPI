import prisma from "../db";

export const addExercise = async (req, res, next) => {
  try {
    const userId = +req.params.id;
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      res.status(400);
      return res.json({ message: "User does not exist." });
    }

    const date = req.body.date ? new Date(req.body.date) : new Date();
    if (isNaN(date.getTime())) {
      res.status(400);
      return res.json({ message: "Invalid date." });
    }

    const exercise = await prisma.exercise.create({
      data: {
        description: req.body.description,
        duration: +req.body.duration,
        date: date.toDateString(),
        userId,
      },
    });

    res.json(exercise);
  } catch (err) {
    err.type = "input";
    next(err);
  }
};
