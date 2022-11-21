import prisma from "../db";

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
      },
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const newUser = await prisma.user.create({
      data: {
        username: req.body.username,
      },
    });

    res.json({ username: newUser.username, id: newUser.id });
  } catch (err) {
    err.type = "username";
    next(err);
  }
};
