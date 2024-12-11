/* eslint no-console: 0 */

import process from "node:process";
const debug = require("../../share/debug")(__filename);
require("dotenv").config({ path: ".env" });

for (let key of ["GITHUB_CLIENT_ID", "GITHUB_CLIENT_SECRET"]) {
  if (typeof process.env[key] !== "string") {
    console.error(`ERROR: Env var "${key}" is missing`);
  }
}

import mongoose from "mongoose";
const User = mongoose.model("User");
import { deleteSession } from "../model/user";
import querystring from "querystring";
import axios from "axios";
import md5 from "md5";

import Cache from "../lib/cache";
const loginStateCache = new Cache({ prefix: "loginState", expire: 300 }); // 5 minutes

import Router from "koa-66";
const router = new Router();
export default router;

router.get("/logout", async (ctx, next) => {
  const session = ctx.cookies.get("session");
  deleteSession(session);
  ctx.cookies.set("session", null);
  ctx.redirect(ctx.headers.referer || "/");
});

router.get("/login", async (ctx, next) => {
  debug("/login");
  ctx.cookies.set("redirect", ctx.headers.referer);
  const state = md5(Date.now() + ctx.request.ip);
  loginStateCache.set(state, true);
  const fullUrl = ctx.request.protocol + "://" + ctx.request.host +
    ctx.request.path;
  const query = querystring.stringify({
    client_id: process.env.GITHUB_CLIENT_ID,
    redirect_uri: fullUrl + "/callback",
    scope: "user",
    state: state,
  });
  ctx.redirect(`https://github.com/login/oauth/authorize?${query}`);
});

router.get("/login/callback", async (ctx, next) => {
  debug("/login/callback");
  const code = ctx.query.code;
  const state = ctx.query.state;
  if (!state || !code) {
    debug("invalid access");
    ctx.redirect(ctx.cookies.get("redirect") || "/");
    return;
  }
  if (await loginStateCache.get(state) !== true) {
    debug("invalid state");
    ctx.redirect(ctx.cookies.get("redirect") || "/");
    return;
  }

  const res = await axios.post("https://github.com/login/oauth/access_token", {
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    code: code,
  });

  const data = querystring.parse(res.data);
  debug(data);
  if (data.error) {
    ctx.body = data;
    ctx.status = 400;
    return;
  }
  debug("AccessToken: " + data.access_token);
  const user = await User.createOrFindByGithubToken(data.access_token);
  const session = md5(ctx.request.ip + Date.now() + data.access_token);
  ctx.cookies.set("session", session, { maxAge: 1000 * 60 * 60 * 24 * 14 }); // 14 days
  await user.setSession(session);
  user.save();
  ctx.redirect(ctx.cookies.get("redirect") || "/");
});
