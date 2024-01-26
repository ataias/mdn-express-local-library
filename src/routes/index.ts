import { Router } from "express";
const router = Router();

/* GET home page. */
router.get("/", (_req, res, _next) => {
  res.redirect("/catalog");
});

export default router;
