import prisma from "../db";

export const getLogs = async (req, res, next) => {
  try {
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
      const from = new Date(new Date(req.query.from).toDateString()).getTime();
      if (isNaN(from)) {
        res.status(400);
        return res.json({
          message: "`from` should be a date in yyyy-mm-dd format",
        });
      }
      user.log = user.log.filter((exercise) => {
        return new Date(exercise.date).getTime() >= from;
      });
    }

    if (req.query.to) {
      const to = new Date(new Date(req.query.to).toDateString()).getTime();
      if (isNaN(to)) {
        res.status(400);
        return res.json({
          message: "`to` should be a date in yyyy-mm-dd format",
        });
      }
      user.log = user.log.filter((exercise) => {
        return new Date(exercise.date).getTime() <= to;
      });
    }

    user.count = user.log.length;
    user.log = user.log.sort(
      (ex1, ex2) => new Date(ex1.date).getTime() - new Date(ex2.date).getTime()
    );

    if (req.query.limit) {
      if (!(req.query.limit > 0)) {
        res.status(400);
        return res.json({ message: "`limit` should be a positive number" });
      }
      user.log = user.log.slice(0, req.query.limit);
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
};
