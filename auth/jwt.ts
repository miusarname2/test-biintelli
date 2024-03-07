import { Request, Response } from "express";
import { SignJWT, jwtVerify } from "jose";
import dotenv from "dotenv";
import passport from "passport";
import { Strategy as BearerStrategy } from "passport-http-bearer";

dotenv.config({ path: "../" });
console.log(process.env.JWT_SECRET);

// Configurar la estrategia de autenticación Bearer
passport.use(
  new BearerStrategy(async (token, done) => {
    try {
      const encoder = new TextEncoder();
      const { payload } = await jwtVerify(
        token,
        encoder.encode(process.env.JWT_SECRET)
      );

      // Aquí puedes realizar verificaciones adicionales si es necesario

      return done(null, payload);
    } catch (error) {
      return done(error, false);
    }
  })
);

export const requireRole = (role: string) => {
  return (req: Request, res: Response, next: any) => {
    passport.authenticate(
      "bearer",
      { session: false },
      (err: any, user: any) => {
        if (err) {
          return res.status(401).json({ message: "Unauthorized" });
        }
        if (!user) {
          return res.status(401).json({ message: "Unauthorized" });
        }
        if (user.role !== role) {
          return res.status(403).json({ message: "Forbidden" });
        }
        req.user = user;
        next();
      }
    )(req, res, next);
  };
};

export const validarToken = async (req: Request | any, res: Response, next: any) => {
  try {
    const encoder = new TextEncoder();
    const { payload } = await jwtVerify(
      req.headers.authorization.split(" ")[1], // Extract token from "Bearer <token>"
      encoder.encode(process.env.JWT_SECRET)
    );
    if (payload.role == "admin" || payload.role == "usuario") {
      req.user = payload; // Store the user's payload in the request for later use
      console.log(req.user);
      return next();
    } else {
      res
        .status(404)
        .send(JSON.stringify({ status: 404, message: "Not found role" }));
    }
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export const crearToken = async (req: Request, res: Response) => {
  const encoder = new TextEncoder();
  if (req.body.role == "admin" || req.body.role == "usuario") {
    const jwtConstructor = await new SignJWT(req.body)
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(encoder.encode(process.env.JWT_SECRET));
    res.send(JSON.stringify({ role: req.body.role, token: jwtConstructor }));
  } else {
    res
      .status(400)
      .send(
        JSON.stringify({ status: 400, message: "Invalid credentials required" })
      );
  }
};
