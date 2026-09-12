import { describe, it, expect, beforeEach, afterEach } from "vitest";
import request from "supertest";
import pino from "pino";
import { openDatabase } from "../server/db/database.js";
import { createApp } from "../server/app.js";
import type Database from "better-sqlite3";
let db: Database.Database;
beforeEach(() => {
  db = openDatabase(":memory:");
});
afterEach(() => db.close());
function app() {
  return createApp({ db, logger: pino({ enabled: false }) });
}
describe("API", () => {
  it("returns health status", async () => {
    const res = await request(app()).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      ok: true,
      service: "portfolio",
      version: "1.0.0",
    });
  });
  it("rejects invalid contact data", async () => {
    const res = await request(app())
      .post("/api/contact")
      .send({ name: "A", email: "bad", message: "short", answer: "1" });
    expect(res.status).toBe(400);
  });
  it("stores normalized contact safely", async () => {
    const res = await request(app())
      .post("/api/contact")
      .send({
        name: "  Budi Test  ",
        email: " BUDI@EXAMPLE.COM ",
        subject: " Internship ",
        message: "Halo, saya ingin berdiskusi mengenai kesempatan internship.",
        website: "",
        answer: "7",
      });
    expect(res.status).toBe(201);
    const row = db
      .prepare("SELECT name,email,subject FROM contact_messages")
      .get() as Record<string, string>;
    expect(row).toEqual({
      name: "Budi Test",
      email: "budi@example.com",
      subject: "Internship",
    });
  });
});
