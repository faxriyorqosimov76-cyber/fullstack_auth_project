import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { pool } from '../db/index.js';
import { redis } from '../redis.js';



const genAccess = (id) => jwt.sign({id}, process.env.ACCESS_SECRET, {expiresIn: '15m'});

const genRefresh = (id) => jwt.sign({id}, process.env.REFRESH_SECRET, {expiresIn: '7d'});

export const register = async (req, res) => {
    const {email, password} = req.body;
    const hash = await bcrypt.hash(password, 10);
    await pool.query('insert into test_users (email, password) values($1, $2)', [email, hash]);
    res.json({ok: true})
}

export const login = async (req, res) => {
    const {email, password} = req.body;
    const user = (await pool.query('select * from test_users where email=$1', [email])).rows[0];


    if(!user || !(await bcrypt.compare(password, user.password)))
            return res.status(401).json({msg: "Auth error"});


    const access = genAccess(user.id);
    const refresh = genRefresh(user.id);

    await redis.set(refresh, user.id, {EX: 7 * 24 * 60 * 60});

    res.json({access, refresh});
};

export const refresh = async (req, res) => {
    const {refresh} = req.body;

    const exists = await redis.get(refresh);
    if(!exists) return res.status(401).json({logout: true});

    const payload = jwt.verify(refresh, process.env.REFRESH_SECRET);
    const access = genAccess(payload.id);
    
    res.json({access});
}

export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: "Refresh token required" });

    const result = await redis.del(refreshToken);
    if (result === 0) {
      return res.status(400).json({ message: "Token not found or already logged out" });
    }

    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Server error" });
  }
};