import prisma from "../db";

export const getLogs = async (req, res, next) => {
  try {
    let from;
    let to;
    const userId = +req.params.id;
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        log: {
          select: {
            description: true,
            duration: true,
            date: true,
          },
        },
      },
    });
    if (!user) {
      res.status(400);
      return res.json({ message: "User does not exist." });
    }

    if (req.query.from) {
      from = new Date(req.query.from).getTime() || Number.NEGATIVE_INFINITY;
      user.log = user.log.filter((exercise) => {
        return new Date(exercise.date).getTime() >= from;
      });
    }

    if (req.query.to) {
      to = new Date(req.query.to).getTime() || Number.POSITIVE_INFINITY;
      user.log = user.log.filter((exercise) => {
        return new Date(exercise.date).getTime() <= to;
      });
    }

    user.count = user.log.length;

    if (req.query.limit > 0) {
      user.log = user.log.slice(0, req.query.limit);
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
};
