import { redis } from "../redis.js";


export const inc = async (req, res) => {
  try {
    const email = req.user.email;

    let counter = await redis.get(`counter:${email}`);
    if (counter === null) counter = 0;
    counter = parseInt(counter) + 1;

    await redis.set(`counter:${email}`, counter);
    res.json({ counter });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


export const dec = async (req, res) => {
  try {
    const email = req.user.email;

    let counter = await redis.get(`counter:${email}`);
    if (counter === null) counter = 0;
    counter = parseInt(counter) - 1;

    await redis.set(`counter:${email}`, counter);
    res.json({ counter });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getCounter = async (req, res) => {
  try {
    const email = req.user.email;
    let counter = await redis.get(`counter:${email}`);
    if (counter === null) {
      counter = 0;
      await redis.set(`counter:${email}`, counter);
    } else {
      counter = parseInt(counter);
    }

    res.json({ counter });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
